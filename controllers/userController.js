// External imports
const jwt = require("jsonwebtoken");

// Internal imports
const { User, Account } = require("../models/db");
const { SignUpSchema, SignInSchema, UpdateUserSchema } = require("../types");

const secret = process.env.JWT_SECRET;

// 1) Backend auth controllers
const handleSignup = async (req, res) => {
  const username = req.body.username;
  const firstname = req.body.firstname;
  const lastname = req.body.lastname;
  const password = req.body.password;

  // Validating user input
  const validate = SignUpSchema.safeParse({
    username,
    firstname,
    lastname,
    password,
  });

  if (validate.success === false) {
    res.status(411).json({
      message: "Incorrect inputs",
    });
  }

  // To check if the user already exists or not
  const existingUser = await User.findOne({ username });

  if (existingUser) {
    res.status(411).json({
      message: "username already taken",
    });
  } else {
    const user = await User.create({
      username,
      firstname,
      lastname,
      password,
    });

    const userId = user._id;

    const token = jwt.sign(
      {
        userId,
      },
      secret
    );

    // New account creation
    await Account.create({
      userId,
      balance: 1 + Math.random() * 10000,
    });

    res.status(200).json({
      message: "User created successfully",
      jwt: token,
    });
  }
};

const handleSignin = async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  // Validating user input
  const validate = SignInSchema.safeParse({
    username,
    password,
  });

  if (validate.success === false) {
    res.status(411).json({
      message: "Incorrect inputs",
    });
  }

  const user = await User.findOne({
    username,
    password,
  });

  // console.log(user);

  if (user) {
    const token = jwt.sign(
      {
        userId: user._id,
      },
      secret
    );

    res.status(200).json({
      token: token,
    });
  }
};

// 2) Controllers to update user information
const handleUpdateUserInfo = async (req, res) => {
  const password = req.body.password;
  const firstname = req.body.firstname;
  const lastname = req.body.lastname;

  const validate = UpdateUserSchema.safeParse({
    password,
    firstname,
    lastname,
  });

  if (validate.success === false) {
    res.status(411).json({
      message: "Error while updating information",
    });
  }

  await User.updateOne({ _id: req.userId }, req.body);

  res.json({
    message: "Updated successfully",
  });
};

// 3) Controllers for searching other users
const handleSearchUser = async (req, res) => {
  const filter = req.query.filter || "";

  const myUserId = req.userId;

  const users = await User.find({
    $or: [
      { firstname: { $regex: filter, $options: "i" } }, // Case insensitive search
      { lastname: { $regex: filter, $options: "i" } },
    ],
  });

  res.json({
    users: users
      .filter((user) => user._id.toString() !== myUserId.toString())
      .map((user) => ({
        username: user.username,
        firstName: user.firstname,
        lastName: user.lastname,
        _id: user._id,
      }))
  });
};

module.exports = {
  handleSignup,
  handleSignin,
  handleUpdateUserInfo,
  handleSearchUser,
};