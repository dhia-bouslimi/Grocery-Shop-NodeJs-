const express = require('express');
const router = express.Router();
var jwt = require('jsonwebtoken');
const Fournisseur = require('../models/fournisseur');



/**
  * @swagger
  * tags:
  *   name: Fournisseur
*/



/**
 * @swagger 
 * /fournisseurs/addfournisseur:
 *  post:
 *     description: fournisseurs
 *     responses: 
 *         '200':
 *            description: A successful response
 */

router.post("/addfournisseur", async (req, res) => {
    const {
        fullName,
        numTel,
        adresse,
        secteur,
     
    
    } = req.body;
    if (!fullName ||!numTel ||!adresse || !secteur  ) {
    return res.json({ error: "please add all the feilds" });
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

           return res.json({ message: "add successfuly" });
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (err) {
      return res.status(500).json(err);
    }
  });



/**
 * @swagger 
 * /fournisseurs/fournisseur:
 *  post:
 *     description: fournisseurs
 *     responses: 
 *         '200':
 *            description: A successful response
 */
  router.post("/fournisseur", async (req,res) => {
    try {
      await Fournisseur.find({}).then((result) => {
        console.log(result);
        return res.send(result);
      });
    } catch (err) {
        console.log(err);
    }
    });
    


    


/**
 * @swagger 
 * /fournisseurs/fournisseur/:id:
 *  get:
 *     description: fournisseurs
 *     responses: 
 *         '200':
 *            description: A successful response
 */
    router.get('/:id',(req,res) => {
        console.log(req.params.id);
        Fournisseur.findById(req.params.id)
        .then(result=>{
          return res.status(200).json({
                user:result
            })
        })
        .catch(err=> {
            console.log(err);
            return res.status(500).json({
                error:err
            })
        })
    });


/**
 * @swagger
 * fournisseurs/UpdateFournisseur:
 *   post:
 *     summary: update fournisseur
 *     tags: [Fournisseurs]
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
        return res.json({
          message: "an error occured when updating user",
        });
      });
  });

  /**
 * @swagger
 * fournisseurs/deletefournisseur/:fullName:
 *   delete:
 *     summary: delete fournisseur
 *     tags: [Fournisseurs]
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
  
  router.delete("/deletefournisseur/:fullName", async (req, res) => {
    try {
       await Fournisseur.findOneAndRemove({ "fullName": req.params.fullName}).then(doc =>{
        return res.status(200).json(doc);
       })
    } catch (err) {
      return res.send(err);
    }
});




  module.exports = router;
