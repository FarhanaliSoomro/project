import express from "express";
import Product from "../models/Product.js";
const router = express.Router();

// Add a new product (admin route)
router.post('/', async (req, res) => {
  const { name, description, price, imageUrl } = req.body;
  const product = new Product({ name, description, price, imageUrl });
  await product.save();
  res.status(201).json({ message: 'Product added successfully' });
});

// Get all products
router.get('/', async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

// Get a single product by ID
router.get('/:id', async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }
  res.json(product);
});

export default router;