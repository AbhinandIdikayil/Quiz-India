const bcrypt = require('bcrypt');
const  Userdb  = require('../../model/userModel');
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const Questiondb = require("../../model/questions")

module.exports = {


        updateScore : async (req, res) => {
        try {
            const token = req.cookies.user_token;
            const { _id } = jwt.verify(token, process.env.SECRET);
    
            if (!mongoose.Types.ObjectId.isValid(_id)) {
                return res.status(400).json({ error: 'Invalid user ID' });
            }
    
            const user = await Userdb.findById(_id);
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
    
            const { questionId, userAnswer, timeLeft } = req.body;
    
            const question = await Questiondb.findById(questionId);
            if (!question) {
                return res.status(404).json({ error: 'Question not found' });
            }
    
            const isCorrect = userAnswer === question.answer;
    
            let levelUpdate = {};
            let quizMasterUpdate = {};
            if (isCorrect) {
                if (user.level === 'easy' && user.correctedAnswerCount + 1 >= 5) {
                    levelUpdate = { level: 'medium' };
                } else if (user.level === 'medium' && user.correctedAnswerCount + 1 >= 10) {
                    levelUpdate = { level: 'hard' };
                }
                if (user.correctedAnswerCount + 1 >= 15) {
                    quizMasterUpdate = { quizMaster: true };
                }
            }
    
            const scoreUpdate = {
                $inc: {
                    totalScore: isCorrect ? question.points : 0,
                    correctedAnswerCount: isCorrect ? 1 : 0,
                    wrongAnswerCount: isCorrect ? 0 : 1
                },
                ...levelUpdate,
                ...quizMasterUpdate
            };
    
            const updatedUser = await Userdb.findByIdAndUpdate(_id, scoreUpdate, { new: true });
    
            res.json({ 
                success: true, 
                updatedUser,
                levelChanged: Object.keys(levelUpdate).length > 0,
                quizMasterAchieved: Object.keys(quizMasterUpdate).length > 0
            });
        } catch (error) {
            console.error('Error updating score:', error);
            res.status(500).json({ error: 'Failed to update score' });
        }
    },
    
   getQuestion :async (req, res) => {
        try {
            const token = req.cookies.user_token;
            const { _id } = jwt.verify(token, process.env.SECRET);
    
            const user = await Userdb.findById(_id);
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
    
            const questions = await Questiondb.aggregate([
                { $match: { type: user.level } },
                { $sample: { size: 10 } }
            ]);
    
            if (!req.session.askedQuestionIds) {
                req.session.askedQuestionIds = [];
            }
    
            const newQuestions = questions.filter(q => !req.session.askedQuestionIds.includes(q._id.toString()));
    
            if (newQuestions.length === 0) {
                req.session.askedQuestionIds = [];
                return res.status(204).end(); 
            }
    
            const selectedQuestion = newQuestions[0];
            req.session.askedQuestionIds.push(selectedQuestion._id.toString());
    
            res.json(selectedQuestion);
        } catch (error) {
            console.error('Error fetching question:', error);
            res.status(500).json({ error: 'Failed to fetch question' });
        }
    }

}