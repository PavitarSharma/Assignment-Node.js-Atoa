const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  imageUrl: { type: String, required: true },
  amount: { type: Number, required: true },
  type: { type: String, enum: ["debit", "credit"], required: true },
  createdAt: { type: Date, default: Date.now },
  currencySymbol: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }
});

const Transaction = mongoose.model("Transaction", transactionSchema);

module.exports = Transaction;
