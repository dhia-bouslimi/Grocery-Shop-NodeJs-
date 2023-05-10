const mongoose = require("mongoose");

const fournisseurshema = new mongoose.Schema({

    fullName: {
        type: String
    },
    numTel:  {
        type: String
    },
    adresse:  {
        type: String
    },
    secteur:  {
        type: String
    },
    createdAt : {
        type: Date,
        default: Date.now()
    },
    });

const Fournisseur = module.exports = mongoose.model('Fournisseur', fournisseurshema);
