// External imports
const express = require("express");

// Internal imports
const { handleSignup, handleSignin, handleUpdateUserInfo, handleSearchUser, handleMe } = require("../controllers/userController");
const authMiddleware = require("../middlewares/middlewares");

const router = express.Router();

// 1) Backend auth routes
router.post("/signup", handleSignup);
router.post("/signin", handleSignin);

// 2) Route to update user information
router.put("/", authMiddleware, handleUpdateUserInfo);

// 3) Route to search other users
router.get("/bulk", authMiddleware, handleSearchUser);

// 4) To get the signedin user info
router.get("/me", authMiddleware, handleMe);

module.exports = router;