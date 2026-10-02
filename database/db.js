const DELAY_MS = 200;

// Simulate async database delay
const delay = () => new Promise((resolve) => setTimeout(resolve, DELAY_MS));

// Auto-incrementing ID counter
let nextId = 6;

// Seeded in-memory products
const products = [
  { id: 1, name: 'Wireless Mouse', price: 29.99, category: 'Electronics' },
  { id: 2, name: 'Mechanical Keyboard', price: 79.99, category: 'Electronics' },
  { id: 3, name: 'Running Shoes', price: 119.99, category: 'Footwear' },
  { id: 4, name: 'Coffee Mug', price: 12.99, category: 'Kitchen' },
  { id: 5, name: 'Backpack', price: 49.99, category: 'Accessories' },
];

const db = {
  async findAll() {
    await delay();
    return [...products];
  },

  async findById(id) {
    await delay();
    return products.find((p) => p.id === id) || null;
  },

  async create(product) {
    await delay();
    const newProduct = { id: nextId++, ...product };
    products.push(newProduct);
    return newProduct;
  },

  async update(id, data) {
    await delay();
    const index = products.findIndex((p) => p.id === id);
    if (index === -1) return null;
    products[index] = { id, ...data };
    return products[index];
  },

  async patch(id, data) {
    await delay();
    const index = products.findIndex((p) => p.id === id);
    if (index === -1) return null;
    products[index] = { ...products[index], ...data, id }; // id is immutable
    return products[index];
  },

  async remove(id) {
    await delay();
    const index = products.findIndex((p) => p.id === id);
    if (index === -1) return null;
    const [removed] = products.splice(index, 1);
    return removed;
  },
};

module.exports = db;
