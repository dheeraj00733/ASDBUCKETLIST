const productService = require('../services/productService');

// GET /products
const getAllProducts = async (req, res, next) => {
  try {
    const products = await productService.getAllProducts();
    res.json(products);
  } catch (err) {
    next(err);
  }
};

// GET /products/:id
const getProductById = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid product ID' });
    }

    const product = await productService.getProductById(id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(product);
  } catch (err) {
    next(err);
  }
};

// POST /products
const createProduct = async (req, res, next) => {
  try {
    const { name, price, category } = req.body;

    if (!name || price == null || !category) {
      return res.status(400).json({
        error: 'Missing required fields: name, price, category',
      });
    }
    if (typeof price !== 'number' || price < 0) {
      return res.status(400).json({ error: 'Price must be a non-negative number' });
    }

    const product = await productService.createProduct({ name, price, category });
    res.status(201).json(product);
  } catch (err) {
    next(err);
  }
};

// PUT /products/:id  (full replace)
const updateProduct = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid product ID' });
    }

    const { name, price, category } = req.body;
    if (!name || price == null || !category) {
      return res.status(400).json({
        error: 'Missing required fields: name, price, category',
      });
    }
    if (typeof price !== 'number' || price < 0) {
      return res.status(400).json({ error: 'Price must be a non-negative number' });
    }

    const product = await productService.updateProduct(id, { name, price, category });
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(product);
  } catch (err) {
    next(err);
  }
};

// PATCH /products/:id  (partial update)
const patchProduct = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid product ID' });
    }

    const updates = req.body;
    if (!updates || Object.keys(updates).length === 0) {
      return res.status(400).json({ error: 'Request body cannot be empty' });
    }
    if (updates.price != null && (typeof updates.price !== 'number' || updates.price < 0)) {
      return res.status(400).json({ error: 'Price must be a non-negative number' });
    }

    const product = await productService.patchProduct(id, updates);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(product);
  } catch (err) {
    next(err);
  }
};

// DELETE /products/:id
const deleteProduct = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid product ID' });
    }

    const product = await productService.deleteProduct(id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json({ message: 'Product deleted', product });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  patchProduct,
  deleteProduct,
};
