import express from "express";
import Product from "../models/Product.js";
import User from "../models/User.js";
const router = express.Router();

// Add item to cart
router.post("/add", async (req, res) => {
  const { userId, productId, quantity } = req.body;

  const user = await User.findById(userId);
  const product = await Product.findById(productId);
  console.log(user);
  console.log(product);
  if (!user || !product) {
    return res.status(400).json({ message: "Invalid user or product" });
  }

  user.cart.push({ productId, quantity });
  await user.save();

  res.status(200).json({ message: "Product added to cart" });
});

// Get cart
router.get("/:userId", async (req, res) => {
  const user = await User.findById(req.params.userId).populate(
    "cart.productId"
  );
  res.json(user.cart);
});

// Remove item from cart
router.delete("/remove", async (req, res) => {
  const { userId, productId } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Filter out the product to remove
    user.cart = user.cart.filter(
      (item) => item.productId.toString() !== productId
    );
    await user.save();

    res.status(200).json({ message: "Product removed from cart" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error removing product from cart", error });
  }
});

export default router;
