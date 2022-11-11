const mongoose = require("mongoose");

const stockshema = new mongoose.Schema({

    type: {
        type: String
    },
    quantite:  {
        type: String
    },
    image:  {
        type: String
    },
    prix:  {
        type: String
    },
    createdAt : {
        type: Date,
        default: Date.now()
    },
    },
    {
    toJSON:{virtuals:true},
});

const Stock = module.exports = mongoose.model('Stock', stockshema);