// External imports
const mongoose = require("mongoose");

// Internal imports
const { Account } = require("../models/db.js");
const { transferSchema } = require("../types.js");

const handleBalanceCheck = async (req, res) => {
    const userId = req.userId;

    const accountInfo = await Account.findOne({userId});

    if (accountInfo) {
        res.status(200).json({
            balance: accountInfo.balance 
        });
    }
}

const handleTransfer = async (req, res) => {
    const session = await mongoose.startSession();

    // Start the transaction
    session.startTransaction();
    const { to, amount } = req.body;

    const validate = transferSchema.safeParse(req.body);

    if (validate.success === false) {
        await session.abortTransaction();
        return res.status(409).json({
            message: "Amount cannot be negative."
        });
    }

    // Fetch the accounts within the transaction

    // Fetching from : account
    const fromAccount = await Account.findOne({ userId: req.userId }).session(session);

    // Checking if the from : account, i.e who is sending the money has sufficient balance or not
    if (fromAccount.balance < amount ) {
        await session.abortTransaction();
        return res.status(400).json({
            message: "Insufficient balance"
        });
    }

    // Fetching to : account
    const toAccount = await Account.findOne({ userId: to }).session(session);

    // To check if the account we want to send money to exists or not
    if (!toAccount) {
        await session.abortTransaction();
        return res.status(400).json({
            message: "Invalid account"
        });
    }

    // To perform the transfer
    await Account.updateOne({ userId: req.userId }, {$inc:{balance: -amount}}).session(session);
    await Account.updateOne({ userId: to }, { $inc: {balance: amount}}).session(session);

    // Commit the transaction
    await session.commitTransaction();

    res.json({
        message: "Transfer successful"
    });
}

module.exports = {
    handleBalanceCheck,
    handleTransfer
}