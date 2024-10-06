// External imports
const express = require("express");

// Internal imports
const authMiddleware = require("../middlewares/middlewares");
const { handleBalanceCheck, handleTransfer } = require("../controllers/accountController");

const router = express.Router();

// 1. An endpoint for user to get their balance.
router.get("/balance", authMiddleware, handleBalanceCheck);

// 2. An endpoint for user to transfer money to another account
router.post("/transfer", authMiddleware, handleTransfer);

module.exports = router;