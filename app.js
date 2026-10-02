const express = require('express');
const productRoutes = require('./routes/productRoutes');

const app = express();

// Parse JSON request bodies
app.use(express.json());

// Mount product routes
app.use('/products', productRoutes);

// 404 fallback for unknown routes
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

module.exports = app;
