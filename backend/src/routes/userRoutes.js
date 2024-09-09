import express from "express";
import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";
import protect from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    // check  if user already exists

    const userExist = await User.findOne({ email });
    if (userExist) {
      return res.status(400).json({ message: "User already exist" });
    }

    // create new user

    const user = await User.create({
      name,
      email,
      password,
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id), // generaste jwt token
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // find user
    const user = await User.findOne({ email });

    // check if user exist and if password matches

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        token: user.generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: "Invalid username or password" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/profile", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      });
    } else {
      res.status(404).json({
        message: "User not found",
      });
    }
  } catch (error) {}
});

export default router;
