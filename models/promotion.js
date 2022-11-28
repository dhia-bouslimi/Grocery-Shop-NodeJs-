const mongoose = require("mongoose");

const promotionshema = new mongoose.Schema({

    prix_promo: {
        type: String
    },
    duree:  {
        type: String
    },
    produit:  {
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

const Promotion = module.exports = mongoose.model('Promotion', promotionshema);
