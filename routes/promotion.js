const express = require('express');
const router = express.Router();
var jwt = require('jsonwebtoken');
const Promotion = require('../models/promotion');







router.post("/addpromotion", async (req, res) => {
    const {
        prix_promo,
        duree,
        produit,
        
     
    
    } = req.body;
    if (!prix_promo ||!duree ||!produit) {
      res.json({ error: "please add all the feilds" });
    }
   
    try {
      
      const promotion = new Promotion({
        prix_promo,
        duree,
        produit,
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



  router.get("/promotion", async (req,res) => {
    try {
      await Promotion.find({}).then((result) => {
        res.send(result);
      });
    } catch (err) {
        console.log(err);
    }
    });
    

    router.post("/UpdatePromotion", (req, res) => {
      let updatedPromotion = {
        id: req.body.id,
        prix_promo: req.body.prix_promo,
        duree: req.body.duree,
        produit: req.body.produit,

     
      };
      Promotion.findByIdAndUpdate(req.body.id, { $set: updatedPromotion })
        .then((savedPromotion) => {
          res.status(202).send(
            JSON.stringify({
              //200 OK
                 id: savedPromotion._id,
                 prix_promo: savedPromotion.prix_promo,
                 duree: savedPromotion.duree,
                 produit: savedPromotion.produit,
                
              token: "",
            })
          );
        })
        .catch((error) => {
          res.json({
            message: "an error occured when updating promotion",
          });
        });
    });
  

    router.delete("/deletepromotion/:duree", async (req, res) => {
      try {
         await Promotion.findOneAndRemove({ "duree": req.params.duree}).then(doc =>{
          res.status(200).json(doc);
         })
      } catch (err) {
          res.send(err);
      }
  });


















  module.exports = router;
