const express = require('express');
const router = express.Router();
var jwt = require('jsonwebtoken');
const Stock = require('../models/Stock');
const uploadStock = require('../middleware/uploadStock')



/**
  * @swagger
  * tags:
  *   name: Stock
*/




/**
 * @swagger 
 * /stocks/addStock:
 *  get:
 *     description: Add stocks
 *     responses: 
 *         '200':
 *            description: A successful response
 */
router.post("/addStock",uploadStock.single('image'), async (req, res) => {
    const {
        type,
        quantite,
        prix,
        
     
    
    } = req.body;
    if (!type ||!quantite||!prix  ) {
      res.json({ error: "please add all the feilds" });
    }

    try {
      
      const stock = new Stock({
        type,
        quantite,
        prix,
        
      });
      if(req.file){
        stock.image = `https://grocery-shop-node-js.vercel.app/uploadsStock/${req.file.filename}`
      }
      stock
        .save()
        .then((stock) => {

            res.json({ message: "add successfuly", imageUrl: `https://grocery-shop-node-js.vercel.app/uploadsStock/${req.file.filename}` });
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
 * /stocks/UpdateStock:
 *   post:
 *     summary: Update Stock
 *     tags: [Stocks]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Book'
 *     responses:
 *       200:
 *         description: ok!
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Book'
 *       500:
 *         description: Some server error
 */
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


/**
 * @swagger
 * /stocks/delete/:type:
 *   delete:
 *     summary: Delete Stock
 *     tags: [Stocks]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Book'
 *     responses:
 *       200:
 *         description: ok!
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Book'
 *       500:
 *         description: Some server error
 */
  router.delete("/delete/:type", async (req, res) => {
    try {
       await Stock.findOneAndRemove({ "type": req.params.type}).then(doc =>{
        res.status(200).json(doc);
       })
    } catch (err) {
        res.send(err);
    }
});









/**
 * @swagger 
 * /stocks/stock:
 *  get:
 *     description: stocks
 *     responses: 
 *         '200':
 *            description: A successful response
 */

router.post("/stock", async (req,res) => {
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