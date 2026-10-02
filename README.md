# ASDBUCKETLIST — Products API with Caching

A RESTful Products API built with **Node.js** and **Express 4**, featuring an in-memory caching layer with TTL-based expiry and automatic cache invalidation on write operations.

## Features

- Full CRUD operations for products (GET, POST, PUT, PATCH, DELETE)
- In-memory caching middleware with 1-minute TTL
- Cache HIT/MISS headers (`X-Cache`, `X-Cache-Age`)
- Automatic cache invalidation after successful write operations
- Request validation and error handling
- Layered architecture: Route → Middleware → Controller → Service → Database

## Folder Structure

```
ASDBUCKETLIST/
├── server.js                    # Server entrypoint (listens on PORT || 3000)
├── app.js                       # Express app setup, route mounting, error handling
├── package.json
├── .gitignore
├── README.md
├── database/
│   └── db.js                    # In-memory products array with async methods
├── services/
│   └── productService.js        # Business logic layer (calls database)
├── controllers/
│   └── productController.js     # Request handlers (calls services)
├── routes/
│   └── productRoutes.js         # Route definitions with middleware wiring
└── middleware/
    ├── cache.js                 # Cache store (Map), TTL, get/set/clear helpers
    ├── cacheMiddleware.js       # GET caching middleware with X-Cache headers
    ├── invalidateCache.js       # Clears cache after successful writes
    └── errorHandler.js          # Global error handler
```

## Request Flow

```
Client Request
      │
      ▼
┌─────────────┐
│   Route     │  (productRoutes.js)
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ Middleware   │  (cacheMiddleware / invalidateCache)
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ Controller  │  (productController.js)
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Service    │  (productService.js)
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Database   │  (db.js — in-memory array)
└─────────────┘
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm

### Installation

```bash
git clone https://github.com/dheeraj00733/ASDBUCKETLIST.git
cd ASDBUCKETLIST
npm install
```

### Running the Server

```bash
# Production
npm start

# Development (with auto-reload)
npm run dev
```

The server starts on `http://localhost:3000` (or the port specified in the `PORT` environment variable).

## API Endpoints

| Method   | Endpoint         | Description              | Status Codes     |
|----------|------------------|--------------------------|------------------|
| `GET`    | `/products`      | List all products        | 200              |
| `GET`    | `/products/:id`  | Get a single product     | 200, 400, 404    |
| `POST`   | `/products`      | Create a new product     | 201, 400         |
| `PUT`    | `/products/:id`  | Full replace a product   | 200, 400, 404    |
| `PATCH`  | `/products/:id`  | Partial update a product | 200, 400, 404    |
| `DELETE` | `/products/:id`  | Delete a product         | 200, 400, 404    |

### Request Body (POST / PUT)

```json
{
  "name": "Product Name",
  "price": 29.99,
  "category": "Category"
}
```

### Request Body (PATCH)

Any subset of the fields above (at least one required).

## Caching Design

### How it works

- **Cache Store**: An in-memory `Map` in `middleware/cache.js`
- **Cache Key**: `req.originalUrl` (e.g., `/products`, `/products/1`)
- **Cache Entry**: `{ data, createdAt }` where `createdAt = Date.now()`
- **TTL**: 1 minute (60,000 ms). On lookup, if `Date.now() - createdAt > TTL`, the entry is deleted and treated as a MISS

### Response Headers

| Header         | Description                                        |
|----------------|----------------------------------------------------|
| `X-Cache: HIT` | Response served from cache                         |
| `X-Cache: MISS`| Response fetched from database (cache was empty/expired) |

### Cache Invalidation

After any successful write operation (POST, PUT, PATCH, DELETE with a 2xx status), **all cache entries are cleared**. This ensures both the product list and individual product caches stay consistent. Failed requests (4xx/5xx) do **not** invalidate the cache.

## Testing with curl

### List all products

```bash
curl -i http://localhost:3000/products
```

### Get a single product

```bash
curl -i http://localhost:3000/products/1
```

### Create a product

```bash
curl -i -X POST http://localhost:3000/products \
  -H "Content-Type: application/json" \
  -d '{"name":"Tablet","price":499.99,"category":"Electronics"}'
```

### Update a product (full replace)

```bash
curl -i -X PUT http://localhost:3000/products/1 \
  -H "Content-Type: application/json" \
  -d '{"name":"Gaming Mouse","price":39.99,"category":"Electronics"}'
```

### Partial update

```bash
curl -i -X PATCH http://localhost:3000/products/1 \
  -H "Content-Type: application/json" \
  -d '{"price":34.99}'
```

### Delete a product

```bash
curl -i -X DELETE http://localhost:3000/products/1
```

### Verify caching

```bash
# First request — MISS (goes to database, ~200ms)
curl -i http://localhost:3000/products

# Second request — HIT (instant, from cache)
curl -i http://localhost:3000/products

# Create a product — cache is cleared
curl -s -X POST http://localhost:3000/products \
  -H "Content-Type: application/json" \
  -d '{"name":"Speaker","price":79.99,"category":"Electronics"}'

# Next GET — MISS (cache was invalidated)
curl -i http://localhost:3000/products
```
