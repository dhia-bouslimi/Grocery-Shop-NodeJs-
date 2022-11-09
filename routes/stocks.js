const express = require('express');
const router = express.Router();
var jwt = require('jsonwebtoken');
const Stock = require('../models/stock');
const stock = require('../models/stock');









router.post("/addStock", async (req, res) => {
    const {
        type,
        quantite,
        image,
        prix,
        
     
    
    } = req.body;
    if (!type ||!quantite ||!image ||!prix  ) {
      res.json({ error: "please add all the feilds" });
    }

    try {
      
      const stock = new Stock({
        type,
        quantite,
        image,
        prix,
      });
      stock
        .save()
        .then((stock) => {

            res.json({ message: "add successfuly" });
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (err) {
      res.status(500).json(err);
    }
  });


  router.post("/UpdateStock", (req, res) => {
    let updatedStock = {
      id: req.body.id,
      type: req.body.type,
      quantite: req.body.quantite,
      image: req.body.image,
      prix: req.body.prix,
    };
    Stock.findByIdAndUpdate(req.body.id, { $set: updatedStock })
      .then((savedStock) => {
        res.status(202).send(
          JSON.stringify({
            //200 OK
               id: savedStock._id,
                type:  savedStock.type,
                quantite:  savedStock.quantite,
                image:  savedStock.image,
                prix:  savedStock.prix,
            token: "",
          })
        );
      })
      .catch((error) => {
        res.json({
          message: "an error occured when updating stock",
        });
      });
  });


  router.delete("/delete/:type", async (req, res) => {
    try {
       await Stock.findOneAndRemove({ "type": req.params.type}).then(doc =>{
        res.status(200).json(doc);
       })
    } catch (err) {
        res.send(err);
    }
});











router.get("/stock", async (req,res) => {
    try {
      await Stock.find({}).then((result) => {
        res.send(result);
      });
    } catch (err) {
        console.log(err);
    }
    });
    router.get('/:id',(req,res) => {
        console.log(req.params.id);
        Stock.findById(req.params.id)
        .then(result=>{
            res.status(200).json({
                stock:result
            })
        })
        .catch(err=> {
            console.log(err);
            res.status(500).json({
                error:err
            })
        })
    });




  module.exports = router;