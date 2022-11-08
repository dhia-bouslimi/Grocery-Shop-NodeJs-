const mongoose = require("mongoose");

const usershema = new mongoose.Schema({
    email: {
        type: String,
        required: true   
    },     
    password: {
        type: String
    },
    firstName: {
        type: String
    },
    lastName: {
        type: String
    },
    gender:  {
        type: String
    },
    age:  {
        type: String
    },
    photo: {
        type: String
    },
    code: {
        type: String,
        required: false,
      },
      codeAdmin: {
        type: String,
        required: false,
      },
    createdAt : {
        type: Date,
        default: Date.now()
    },
    },
    {
    toJSON:{virtuals:true},
});

const User = module.exports = mongoose.model('User', usershema);
