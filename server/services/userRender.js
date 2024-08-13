const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const Userdb = require("../model/userModel");
const Questiondb = require("../model/questions");

module.exports = {
  //render home page
  homePage: async (req, res) => {
    try {
      res.status(200).render("index");
    } catch (err) {
      console.error("Home page err:", err);
      res.status(500).json({ menubar: "internal error" });
    }
  },

  //render register page
  userRegister: async (req, res) => {
    try {
      res.status(200).render("registerPge");
    } catch (error) {
      console.log("register error:", error);
    }
  },

  userLogin: async(req, res) =>{
    try {
      res.status(200).render("loginPage");
    } catch (error) {
      console.log("register error:", error);
    }
  },

  leaderboard: async (req, res) => {
    try {
   
  
      res.status(200).render('leaderboard'); 
    } catch (error) {
      console.log("Leaderboard route error:", error);
    }
  },

  getProfile: async (req, res) => {
    try {
   
  
      res.status(200).render('profile'); 
    } catch (error) {
      console.log("Leaderboard route error:", error);
    }
  },

  editProfile: async (req, res) => {
    try {
   
  
      res.status(200).render('editProfile'); 
    } catch (error) {
      console.log("Leaderboard route error:", error);
    }
  },

  quizPage: async (req, res) => {
      try {
        const token = req.cookies.user_token;
        const { _id } = jwt.verify(token, process.env.SECRET);

        if (!mongoose.Types.ObjectId.isValid(_id)) {
            return res.redirect("/login");
        }

        const user = await Userdb.findById(_id);
        if (!user) {
            return res.redirect("/login");
        }

        const userLevel = user.level;

        const questions = await Questiondb.aggregate([
            { $match: { type: userLevel } },
            { $sample: { size: 10 } }
        ]);

        if (!req.session.askedQuestionIds) {
            req.session.askedQuestionIds = [];
        }

        const newQuestions = questions.filter(q => !req.session.askedQuestionIds.includes(q._id.toString()));

        if (newQuestions.length === 0) {
            req.session.askedQuestionIds = [];
            return res.redirect('/Q&A');
        }

        const selectedQuestion = newQuestions[0];
        req.session.askedQuestionIds.push(selectedQuestion._id.toString());

        res.status(200).render('Q&A', { question: selectedQuestion });
    } catch (error) {
        console.log("Quiz page route error:", error);
        res.status(500).send("An error occurred while loading the quiz.");
    }
  }

};
