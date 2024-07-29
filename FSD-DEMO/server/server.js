const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();
require("./db/connectDB");

const app = express();
const PORT = process.env.PORT || 5000;

//IMPORT ROUTES

const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");

app.use(cors());
app.use(express.json());

// defining the routes

app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);

app.listen(PORT, () =>
     console.log(`Server running on port ${PORT}`)
);
