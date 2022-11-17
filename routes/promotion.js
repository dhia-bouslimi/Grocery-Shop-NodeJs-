const express = require('express');
const router = express.Router();
var jwt = require('jsonwebtoken');
const Promotion = require('../models/promotion');







router.post("/addpromotion", async (req, res) => {
    const {
        prix_promo,
        duree,
        
     
    
    } = req.body;
    if (!prix_promo ||!duree) {
      res.json({ error: "please add all the feilds" });
    }
   
    try {
      
      const promotion = new Promotion({
        prix_promo,
        duree,
      });
      promotion
        .save()
        .then((promotion) => {

            res.json({ message: "add successfuly" });
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (err) {
      res.status(500).json(err);
    }
  });






















  module.exports = router;
