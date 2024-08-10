const mongodb = require('mongoose');

const userSchema = new mongodb.Schema({
    fullName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    profileImage:{
        type: String,
        default: "https://cdn-icons-png.flaticon.com/512/149/149071.png",
    },
    password: {
        type: String,
        unique:true,
        required: true
    },
    userStatus: {
        type: Boolean,
        required: true
    },
    totalScore:{
        type: Number,
    },
    correctedAnswerCount:{
        type:Number
    },
    wrongAnswerCount:{
        type:Number
    }
});

const Userdb = mongodb.model('Userdb', userSchema);

module.exports = Userdb;