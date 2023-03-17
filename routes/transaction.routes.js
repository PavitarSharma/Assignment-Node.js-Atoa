const express = require("express");
const { createTransaction, transactionList, getTransaction } = require("../controllers/transaction.controller");

const auth = require("../middlewares/auth");

const router = express.Router();

router.post("/",auth,  createTransaction);
router.get("/",auth,  transactionList);
router.get("/:id",auth,  getTransaction);

module.exports = router;
