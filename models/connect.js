const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require('path');

// Set path to .env file
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Connection to DB
const DBconnection = async () => {
  try {
    const connectionUri = process.env.CONNECTION_URI;

    await mongoose.connect(connectionUri); 

    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    process.exit(1); 
  }
};

module.exports = DBconnection;