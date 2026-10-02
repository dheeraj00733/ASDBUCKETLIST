const db = require('../database/db');

const productService = {
  async getAllProducts() {
    return db.findAll();
  },

  async getProductById(id) {
    return db.findById(id);
  },

  async createProduct(productData) {
    return db.create(productData);
  },

  async updateProduct(id, productData) {
    return db.update(id, productData);
  },

  async patchProduct(id, productData) {
    return db.patch(id, productData);
  },

  async deleteProduct(id) {
    return db.remove(id);
  },
};

module.exports = productService;
