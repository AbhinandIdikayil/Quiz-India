const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    question: {
        type: String,
        required: true,
        unique: true
    },
    answer: {
        type: String,
        required: true,
    },
    choices: {
        type: [String],
        validate: [arrayLimit, '{PATH} should have at least 4 choices']
    },
    type: {
        type: String,
        enum: ["hard", "medium", "easy"], 
        required: true
    },
    points: {
        type: Number,
        default: function () {
            switch (this.type) {
                case 'hard': return 10;
                case 'medium': return 7;
                case 'easy': return 5;
                default: return 5;
            }
        }
    },
});

function arrayLimit(val) {
    return val.length >= 4;
}

const Questiondb = mongoose.model('Questiondb', questionSchema);

module.exports = Questiondb;