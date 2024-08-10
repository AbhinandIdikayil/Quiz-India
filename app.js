const express = require("express");
const app = express();
const { v4: uuidv4 } = require("uuid");
const path = require("path");
const session = require("express-session");
require('dotenv').config();

const userRouter = require("./server/router/userRouter");
const connectDB  = require("./connections/mongoConnetion");

// Set view engine
app.set("view engine", "ejs");
app.use("/", express.static(path.join(__dirname, "/views")));
app.use("/", express.static(path.join(__dirname, "/public/userSide")));

// Session setup
app.use(
  session({
    secret: uuidv4(),
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 30 * 24 * 60 * 60 * 1000,
    },
  })
);

// Static files
app.use(express.static("public"));

// Parse incoming requests with JSON payloads
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cache control headers
app.use((req, res, next) => {
  res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");
  next();
});

// Use userRouter
app.use("/", userRouter);


connectDB()
// Server setup
const PORT = 3000;
app.listen(PORT, () =>
  console.log(`Server is running at http://localhost:${PORT}`)
);
