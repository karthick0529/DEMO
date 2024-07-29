const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();
require("./db/connectDB");

const app = express();
const port = process.env.PORT || 5000;

//IMPORT ROUTES