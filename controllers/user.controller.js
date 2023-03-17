const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const Transaction = require("../models/transaction.model");
const mongoose = require("mongoose");

const signUp = async (req, res) => {
  try {
    const { name, email, mobile, password } = req.body;

    if (!email || !name || !mobile || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ $or: [{ email }, { mobile }] });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = new User({ name, email, mobile, password });
    await user.save();

    const accessToken = jwt.sign(
      { userId: user._id },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "5m" }
    );
    const refreshToken = jwt.sign(
      { userId: user._id },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "1d" }
    );

    await User.updateOne({ _id: user._id }, { $set: { refreshToken } });

    return res.json({ userId: user._id, accessToken, refreshToken });
  } catch (error) {
    res.status(500).json(error);
  }
};

const login = async (req, res) => {
  try {
    const { mobile, password } = req.body;
    const user = await User.findOne({ mobile });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const accessToken = jwt.sign(
      { userId: user._id },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );
    const refreshToken = jwt.sign(
      { userId: user._id },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "1d" }
    );

    await User.updateOne({ _id: user._id }, { $set: { refreshToken } });

    return res.status(200).json({ accessToken, refreshToken });
  } catch (error) {
    res.status(500).json(error);
  }
};



module.exports = {
  signUp,
  login,
};
