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
