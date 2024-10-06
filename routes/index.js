const express = require("express");

// Internal Imports 
const userRouter = require("./user");
const accountRouter = require("./account");

const router = express.Router();

// Routing middlewares
router.use("/user", userRouter);
router.use("/account", accountRouter)

// router.get("/", (req, res) => {
//     res.send("Hello, welcome to ZapWallet!");
// });

module.exports = router;