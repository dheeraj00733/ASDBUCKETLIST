const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const cacheMiddleware = require('../middleware/cacheMiddleware');
const invalidateCache = require('../middleware/invalidateCache');

// GET    /products
router.get('/', cacheMiddleware, productController.getAllProducts);

// GET    /products/:id
router.get('/:id', cacheMiddleware, productController.getProductById);

// POST   /products
router.post('/', invalidateCache, productController.createProduct);

// PUT    /products/:id
router.put('/:id', invalidateCache, productController.updateProduct);

// PATCH  /products/:id
router.patch('/:id', invalidateCache, productController.patchProduct);

// DELETE /products/:id
router.delete('/:id', invalidateCache, productController.deleteProduct);

module.exports = router;
