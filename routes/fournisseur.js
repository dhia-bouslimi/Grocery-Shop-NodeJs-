const express = require('express');
const router = express.Router();
var jwt = require('jsonwebtoken');
const Fournisseur = require('../models/fournisseur');









router.post("/addfournisseur", async (req, res) => {
    const {
        fullName,
        numTel,
        adresse,
        secteur,
     
    
    } = req.body;
    if (!fullName ||!numTel ||!adresse || !secteur  ) {
      res.json({ error: "please add all the feilds" });
    }
  
    const fournisseur = await Fournisseur.findOne({ numTel: numTel });
    if (fournisseur) {
      res.json({ error: "Fournisseur Exist " });
    }
    try {
      
      const fournisseur = new Fournisseur({
        fullName,
        numTel,
        adresse,
        secteur,
      });
      fournisseur
        .save()
        .then((fournisseur) => {

            res.json({ message: "add successfuly" });
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (err) {
      res.status(500).json(err);
    }
  });



  router.get("/fournisseur", async (req,res) => {
    try {
      await Fournisseur.find({}).then((result) => {
        res.send(result);
      });
    } catch (err) {
        console.log(err);
    }
    });
    



    router.get('/:id',(req,res) => {
        console.log(req.params.id);
        Fournisseur.findById(req.params.id)
        .then(result=>{
            res.status(200).json({
                user:result
            })
        })
        .catch(err=> {
            console.log(err);
            res.status(500).json({
                error:err
            })
        })
    });




  router.post("/UpdateFournisseur", (req, res) => {
    let updatedFournisseur = {
      id: req.body.id,
      fullName: req.body.fullName,
      numTel: req.body.numTel,
      adresse: req.body.adresse,
      secteur: req.body.secteur,
    };
    Fournisseur.findByIdAndUpdate(req.body.id, { $set: updatedFournisseur })
      .then((savedFournisseur) => {
        res.status(202).send(
          JSON.stringify({
            //200 OK
               id: savedFournisseur._id,
                fullName: savedFournisseur.fullName,
                numTel: savedFournisseur.numTel,
                adresse: savedFournisseur.adresse,
                secteur: savedFournisseur.secteur,
            token: "",
          })
        );
      })
      .catch((error) => {
        res.json({
          message: "an error occured when updating user",
        });
      });
  });


  router.delete("/deletefournisseur/:fullName", async (req, res) => {
    try {
       await Fournisseur.findOneAndRemove({ "fullName": req.params.fullName}).then(doc =>{
        res.status(200).json(doc);
       })
    } catch (err) {
        res.send(err);
    }
});
















  module.exports = router;
