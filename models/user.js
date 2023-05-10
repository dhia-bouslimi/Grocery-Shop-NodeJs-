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
        type: String,
        required: false,
    },
    gender:  {
        type: String,
         required: false,
    },
    age:  {
        type: String,
        required: false,
    },
    photo: {
        type: String,
        required: false,
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
