const User = require("../models/user.model");
const Transaction = require("../models/transaction.model");

const transactionList = async (req, res) => {
  try {
    // Verify access token and retrieve user ID
    const { userId } = req.user;
    const { transactionId } = req.query;
    console.log(transactionId);

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // const transactions = await Transaction.findOne({
    //     $or: [{ user: userId }, { _id: transactionId }],
    //   })

    const transactions = await Transaction.find({ user: userId })
      .sort({
        createdAt: "asc",
      })
      .skip(skip)
      .limit(limit);

    res.status(200).json({ transactions });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

const getTransaction = async (req, res) => {
  try {
    // Verify access token and retrieve user ID
    const { userId } = req.user;
    const { id: transactionId } = req.params;
    console.log(transactionId);

    const transaction = await Transaction.findOne({
      $or: [{ user: userId }, { _id: transactionId }],
    })

    

    res.status(200).json({ transaction });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error });
  }
};

const createTransaction = async (req, res) => {
  try {
    const { userId } = req.user;
    const { imageUrl, name, amount, type, currencySymbol } = req.body;
    if (!imageUrl || !name || !amount || !type || !currencySymbol) {
      return res.status(200).json("All transactiobns fileds are required!");
    }

    const newTransaction = new Transaction({
      imageUrl,
      name,
      amount,
      type,
      currencySymbol,
      user: userId,
    });
    await newTransaction.save();

    const transactionObj = {
      name,
      imageUrl,
      amount,
      type,
      currencySymbol,
    };

    res.status(201).json({ transaction: transactionObj });
  } catch (error) {}
};

module.exports = {
  transactionList,
  createTransaction,
  getTransaction,
};
