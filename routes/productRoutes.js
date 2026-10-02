const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const cacheMiddleware = require('../middleware/cacheMiddleware');

// GET    /products
router.get('/', cacheMiddleware, productController.getAllProducts);

// GET    /products/:id
router.get('/:id', cacheMiddleware, productController.getProductById);

// POST   /products
router.post('/', productController.createProduct);

// PUT    /products/:id
router.put('/:id', productController.updateProduct);

// PATCH  /products/:id
router.patch('/:id', productController.patchProduct);

// DELETE /products/:id
router.delete('/:id', productController.deleteProduct);

module.exports = router;
