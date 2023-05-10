const express = require('express');
const router = express.Router();
var jwt = require('jsonwebtoken');
const Promotion = require('../models/promotion');




/**
  * @swagger
  * tags:
  *   name: Promotion
*/

  /**
 * @swagger
 * prommotions/addpromotion:
 *   post:
 *     summary: Add promotion
 *     tags: [Promotions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Book'
 *     responses:
 *       200:
 *         description: add successfuly
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Book'
 *       500:
 *         description: Some server error
 */
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
        produit,
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



  /**
 * @swagger
 * /promotions/promotion:
 *   get:
 *     summary: Add promotion
 *     tags: [Promotions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Book'
 *     responses:
 *       200:
 *         description: add successfuly
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Book'
 *       500:
 *         description: Some server error
 */
  router.post("/promotion", async (req,res) => {
    try {
      await Promotion.find({}).then((result) => {
        res.send(result);
      });
    } catch (err) {
        console.log(err);
    }
    });
    
 /**
 * @swagger
 * prommotions/UpdatePromotion:
 *   post:
 *     summary: Update Promotion
 *     tags: [Promotions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Book'
 *     responses:
 *       200:
 *         description: ok
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Book'
 *       500:
 *         description: Some server error
 */
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
  
 /**
 * @swagger
 * prommotions/deletepromotion/:duree:
 *   post:
 *     summary: Delete promotion
 *     tags: [Promotions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Book'
 *     responses:
 *       200:
 *         description: ok
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Book'

 */
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
