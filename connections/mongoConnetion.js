const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    
    await mongoose.connect("mongodb://localhost:27017/quizApp");
    console.log("MongoDB connected successfully");
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
    process.exit(1);
  }
};

module.exports = connectDB;