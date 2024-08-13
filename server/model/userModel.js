const mongodb = require('mongoose');

const userSchema = new mongodb.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    profileImgURL:{
        type: String,
        default: "https://cdn-icons-png.flaticon.com/512/149/149071.png",
    },
    password: {
        type: String,
        required: true
    },
    userStatus: {
        type: Boolean,
        default: true
    },
    totalScore:{
        type: Number,
        default:0
    },
    correctedAnswerCount:{
        type:Number,
        default:0
    },
    wrongAnswerCount:{
        type:Number,
        default:0

    }
});

const Userdb = mongodb.model('Userdb', userSchema);

module.exports = Userdb;