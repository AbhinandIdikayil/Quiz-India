const express = require("express");
const app = express();
const { v4: uuidv4 } = require("uuid");
const path = require("path");
const session = require("express-session");
require('dotenv').config();
const mongoose = require("mongoose");
const cookieParser = require('cookie-parser');
const userRouter = require("./server/router/userRouter");

// Set view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views/userSide"));
app.use("/", express.static(path.join(__dirname, "/views")));
app.use("/", express.static(path.join(__dirname, "/public")));

// Session setup
app.use(
  session({
    secret: uuidv4(),
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);

// Static files
app.use(express.static("public"));

// Parse incoming requests with JSON payloads
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Cache control headers
app.use((req, res, next) => {
  res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");
  next();
});

// Use userRouter
app.use("/", userRouter);

//mongo connection
const PORT = 3000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Listening on Port: ${PORT} - DB Connected`);
    });
  })
  .catch((error) => {
    console.log(error);
  });
