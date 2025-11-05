const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/User");
require("dotenv").config();

//SIGNUP
router.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return req.status(400).json({ error: "All fields required" });
  }

  const existing = await User.findOne({ where: { email } });
  if (existing) return res.status(400).json({ error: "Email already exists" });

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await User.create({ name, email, passwordHash });

  return res.json({ message: "User created" });
});

//LOGIN
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ where: { email } });

  if (!user)
    return res.status(400).json({ error: "Invalid email or password" });

  const match = await bcrypt.compare(password, user.passwordHash);
  if (!match)
    return res.status(400).json({ error: "Invalid email or password" });

  //   its better to response with invalid email or password for both cases as it prevents revealin which specific field is incorrect

  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

  res.json({ token });
});

module.exports = router;
