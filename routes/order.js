import express from "express";
import User from "../models/User.js";
import Order from "../models/Order.js";

const router = express.Router();

// Get all orders
router.get("/", async (req, res) => {
  try {
    // If a userId is provided, fetch orders for that user
    const orders = await Order.find()
      .populate("items.productId")
      .populate("userId");

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: "Error fetching orders", error });
  }
});

// Checkout
router.post("/checkout", async (req, res) => {
  const { userId } = req.body;

  try {
    const user = await User.findById(userId).populate("cart.productId");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    console.log(user)
    if (user.cart.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    // Calculate total price
    let totalPrice = 0;
    const items = user.cart.map((item) => {
      totalPrice += item.productId.price * item.quantity;
      return { productId: item.productId._id, quantity: item.quantity };
    });

    // Save the order
    const order = new Order({
      userId: user._id,
      items,
      totalPrice,
    });
    await order.save();

    // Clear the cart
    user.cart = [];
    await user.save();

    res.status(200).json({ message: "Checkout successful", totalPrice, order });
  } catch (error) {
    res.status(500).json({ message: "Error during checkout", error });
  }
});

export default router;
