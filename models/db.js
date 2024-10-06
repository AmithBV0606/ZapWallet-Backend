const mongoose = require("mongoose");
const dotenv = require("dotenv");
const DBconnection = require("./connect");

// DB connection
DBconnection();

// Creating schema
const UserSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: true,
    trim: true,
    maxLength: 50,
  },
  lastname: {
    type: String,
    required: true,
    trim: true,
    maxLength: 50,
  },
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    minLength: 3,
    maxLength: 30,
  },
  password: {
    type: String,
    required: true,
    minLength: 6,
  },
});

const AccountSchema = new mongoose.Schema({
  userId: {
      type: mongoose.Schema.Types.ObjectId, // Reference to User model
      ref: 'User',
      required: true
  },
  balance: {
      type: Number,
      required: true
  }
});

// ref ensures that the anything cannot be put in the accounts table, which is not related to User

const User = mongoose.model("User", UserSchema);
const Account = mongoose.model('Account', AccountSchema);

module.exports = {
  User,
  Account
};