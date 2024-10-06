// External Imports
const express = require("express");
const cors = require("cors");

// Internal Imports
const rootRouter = require("./routes/index.js");
const DBconnection = require("./models/connect.js");

// Initializing the Express app.
const app = express();

// Default middleware
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT;

// DB Connection
DBconnection();

// Routing middlewares
app.use("/api/v1", rootRouter);

app.listen(PORT, () => {
    console.log(`App running on PORT : ${PORT}`);
}); 