const { request, response } = require("express");
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = require('../models/user');
//const bcrypt = require("bcrypt");
var bcrypt = require('bcryptjs');
var nodemailer = require ('nodemailer');
const { sendConfirmationEmail } = require('../nodemailer');
const jwt = require("jsonwebtoken");

const upload = require('../middleware/upload');
const user = require("../models/user");


/**
  * @swagger
  * tags:
  *   name: Auth
*/

/**
 * @swagger
 * /users/signup:
 *   post:
 *     summary: Add fournisseur
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Book'
 *     responses:
 *       200:
 *         description: Users Added Successfully!
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Book'
 *       500:
 *         description: Some server error
 */

router.post("/signup", upload.single('photo'), async (req, res) => {

    const {
      firstName,
      lastName,
      email,
      password,
      gender,
      age,
    
    } = req.body;

    

    if (!firstName ||!email || !password  ) {
      res.json({ error: "please add all the feilds" });
    }
  
    const user = await User.findOne({ email: email });
    if (user) {
      res.json({ error: "User Exist " });
    }
    try {
      const salt = await bcrypt.genSalt(10);
      const hasedPassword = await bcrypt.hash(password, salt);
      const user = new User({
        firstName,
        lastName,
        email,
        password: hasedPassword,
        gender,
        age,

        code: "",
        codeAdmin:""
      });
if(req.file){
  user.photo = req.file.path
}

      
      user
        .save()
        .then((user) => {
           
          
          res.json({ message: "signup successfuly" });
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
 * /users/signin:
 *   post:
 *     summary: login
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Book'
 *     responses:
 *       200:
 *         description:  Successfully!
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Book'
 *       500:
 *         description: Some server error
 */

router.post("/signin", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(422).json({ error: "please provide email or password" });
  }
  User.findOne({ email: email }).then((savedUser) => {
    if (!savedUser) {
      return res.status(422).json({ error: "invalid email or password" });
    }
    bcrypt
      .compare(password, savedUser.password)
      .then((doMatch) => {
        if (doMatch) {
          const accessToken = jwt.sign(
            { _id: savedUser._id },
            'MySecret'
          );
          res.status(200).send(
           
            JSON.stringify({
             message: "Login successfully ",
              //200 OK
              id: savedUser._id,
              email: savedUser.email,
              password: savedUser.password,
              firstName: savedUser.firstName,
              lastName: savedUser.lastName,
              gender: savedUser.gender,
              age: savedUser.age,
              photo: savedUser.photo,
              token: accessToken,

              })
            
          );
        } else {
          return res.status(422).json({ error: "invalid email or password" });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  });
});

/**
 * @swagger
 * /users/UpdateUser:
 *   post:
 *     summary: Update
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Book'
 *     responses:
 *       200:
 *         description:  Successfully!
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Book'
 *       500:
 *         description: Some server error
 */
router.post("/UpdateUser", (req, res) => {


 
  let updatedUser = {
    id: req.body.id,
    email: req.body.email,
    firstName:req.body.firstName,
    lastName: req.body.lastName,
    gender: req.body.gender,
    age: req.body.age,
   // password: req.body.password,

   // photo:req.file.path
    
  };
  User.findByIdAndUpdate(req.body.id, { $set: updatedUser })
    .then((savedUser) => {
    /*  bcrypt.hash(req.body.password, 10, (err, hash) => {
        if (err) {
          return res.status(400).json({
            error: err,
          });
        } else {
          user.password = hash;
          user.save();
          return res.status(200).json({ message: "password Has Changed!" });
        }
      });*/
      //
      res.status(202).send(
        JSON.stringify({
          //200 OK
             id: savedUser._id,
              email: savedUser.email,
             // password: savedUser.password,
              firstName: savedUser.firstName,
              lastName: savedUser.lastName,
              gender: savedUser.gender,
              age: savedUser.age,
              user: savedUser.user,

            //  photo: savedUser.photo,
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


/**
 * @swagger
 * /users/UpdatePassword:
 *   post:
 *     summary: Update password
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Book'
 *     responses:
 *       200:
 *         description:  Successfully!
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Book'
 *       500:
 *         description: Some server error
 */
router.post("/UpdatePassword", (req, res) => {
  bcrypt.hash(req.body.password, 10, function (err, hashedPass) {
    console.log(req.body);
    if (err) {
      console.log("erreur password hash");
      res.json({
        error: err,
      });
    }

    let updatedUser = {
      id: req.body.id,
      password: hashedPass,
    };

    User.findByIdAndUpdate(req.body.id, { $set: updatedUser })
      .then(() => {
        res.json({ message: "Password user updated successfully" });
      })
      .catch((error) => {
        res.json({
          message: "an error occured when updating Password user",
        });
      });
  });
});


/**
 * @swagger
 * /users/updatephoto/:id:
 *   post:
 *     summary: Update photo
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Book'
 *     responses:
 *       200:
 *         description:  Successfully!
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Book'
 *       500:
 *         description: Some server error
 */

router.post("/updatephoto/:id",upload.single('photo'), async (req,res) => {
  try{
      await User.findOneAndUpdate(
          { _id: req.params.id },
          { 
              photo: `https://grocery-shop-node-js.vercel.app/uploads/${req.file.filename}`
          }
      );
      user
      .save()
      .then((user) => {

          res.json({ message: "add successfuly", imageUrl: `https://grocery-shop-node-js.vercel.app/uploads/${req.file.filename}` });
      })
      .catch((err) => {
        console.log(err);
      });
  } catch(err){
      res.send(err);
  }
});





router.post("/updatephooto",upload.single('photo'), async (req,res) => {
  try{
      await User.findOneAndUpdate(
          { email: req.body.email },
          { 
              photo: `https://grocery-shop-node-js.vercel.app/uploads/${req.file.filename}`
          }
      );
      user
      .save()
      .then((user) => {

          res.json({ message: "add successfuly", imageUrl: `https://grocery-shop-node-js.vercel.app/uploads/${req.file.filename}` });
      })
      .catch((err) => {
        console.log(err);
      });
  } catch(err){
      res.send(err);
  }
});






router.post("/updateavatar",upload.single('photo'), async (req,res) => {
  const userMail = await User.findOne({ email: req.body.email }); //req.body.email.toLowerCase()
  //console.log(req.body.email);
  //
  const file = req.file;
  if (userMail) {
    try {
      if (!file) {
        const error = new Error("Please upload a file");
        error.httpStatusCode = 400;
        console.log("error", "Please upload a file");
        res.send({ code: 500, msg: "Please upload a file" });
       // return next({ code: 500, msg: error });
      }
      //res.send({ code: 200, msg: file.filename });
      console.log(file.filename);
      res.status(200).send(
        JSON.stringify({
          //200 OK
          msg: `https://grocery-shop-node-js.vercel.app/uploads/${req.file.filename}`
        })
      );
      ///////////////////////////////////////////////////////////////////////////////
      await User.findOneAndUpdate(
        { email: req.body.email },
        { 
            photo: `https://grocery-shop-node-js.vercel.app/uploads/${req.file.filename}`
        }
    );
    } catch (error) {
      console.log(error);
      res.status(400).send(error);
    }
  } else {
    console.log("Email not found");
    res.status(202).json({
      message: "Email not found",
    });
  }
});









router.post("/UpdateAvatar", (req, res) => {
  let updatedUser = {
    id: req.body.id,
    avatar: req.body.avatar,
  };
  User.findByIdAndUpdate(req.body.id, { $set: updatedUser })
    .then(() => {
      res.json({ message: "avatar user updated successfully" });
    })
    .catch((error) => {
      res.json({
        message: "an error occured when updating avatar user",
      });
    });

});

////////////////////////////////////////////////////////////////// ios
var transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: 'dhiabouslimi80@gmail.com',
      pass: 'lhotjywupqlfzmjw'
  },
});




/**
 * @swagger
 * /users/forgetPassword:
 *   post:
 *     summary: forgetPassword
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Book'
 *     responses:
 *       200:
 *         description:  Successfully!
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Book'
 *       500:
 *         description: Some server error
 */
router.post("/forgetPassword", async (req, res) => {
  const userMail = await User.findOne({ email: req.body.email });
  if (!userMail) {
    res.status(202).json({
      message: "email not found",
    });
  } else {
    var code = (Math.floor(Math.random() * 10000) + 10000)
      .toString()
      .substring(1);
    console.log(code);
    // var code = Math.floor(Math.random() * 100000);
    var mailContent = `Almost done : ` + code;

    var mailOptions = {
      from: "dhiabouslimi80@gmail.com",
      to: req.body.email,
      subject: "Forgot Password ",
      text: mailContent,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        res.json({ message: "error sending" });
        console.log(error);
      } else {
        res.status(200).json({
          code: code,
        });
        User.findOneAndUpdate(
          { email: req.body.email },
          { code: code },
          { new: true }
        )

          .then((user) => {
            //console.log(user);
          })
          .catch((err) => {
            console.log(err);
          });
      }
    });
  }
});

router.post("/VerifCode", async (req, res) => {
  // Go from Otp to Page change password
  const user = await User.findOne({ email: req.body.email });
  if (user.code == req.body.code) {

    return res.status(200).json({ message: "Code corect!" });  } 
    if (req.body.code != user.code && user.code != "") {
      console.log("Sorry! The code is incorrect!");
      return res.status(402).json({ message: "Sorry! The code is incorrect!" });
    }
    if (user.code == "") {
      return res
        .status(401)
        .json({ message: "Sorry! There is no code in Database!" });
    }
});


/**
 * @swagger
 * /users/changePassword:
 *   post:
 *     summary: changePassword
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Book'
 *     responses:
 *       200:
 *         description: success!
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Book'
 *       500:
 *         description: Some server error
 */

router.post("/changePassword", async (req, res, next) => {
  // Change Password
  const { email, code, password } = req.body;
  if (!email || !code || !password) {
    return res.status(422).json({ error: "Something is missing" });
  } else {
    //
    const user = await User.findOne({ email: req.body.email });
    if (req.body.code == user.code && user.code != "") {
      bcrypt.hash(req.body.password, 10, (err, hash) => {
        if (err) {
          return res.status(400).json({
            error: err,
          });
        } else {
          user.password = hash;
          user.code = "";
          user.save().then((user) => {
            return res
              .status(200)
              .json({ message: "Congratulations, Password changed!" });
          });
        }
      });
    } else {
      return res.status(402).json({ message: "Sorry! The code is incorrect!" });
    }}
});




router.post("/verifAdmin", async (req,res) => {
  const user = await User.findOne({ email: req.body.email });
if(user.codeAdmin == req.body.codeAdmin){
  res.json({ message: "welcome to admin espace" });
} else {
  res.json({ message: "you are not an admin" });
}
});




router.post("/ByFacebook", async (req, res) => {
  const { name, email } = req.body;

  const user = await User.findOne({ email: email });
  if (user) {
    console.log("if email exist ---->  Login by Facebook");

    ///////////////////////////////////////////////////////////////////////////////
    User.findOne({ email: email }).then((savedUser) => {
      if (savedUser) {
        const accessToken = jwt.sign(
          { _id: savedUser._id },
          process.env.JWT_SECRET
        );
        res.status(200).send(
          JSON.stringify({
            //200 OK
            id: savedUser._id,
            name: savedUser.name,
            email: savedUser.email,
            blood: savedUser.blood,
            age: savedUser.age,
            weight: savedUser.weight,
            adress: savedUser.adress,
            phone: savedUser.phone,
            usertype: savedUser.usertype,
            avatar: savedUser.avatar,
            token: accessToken,
          })
        );
      }
    });
  }
  ////////////////////////////////////////////////////////////////////////////////
  else {
    console.log("if email exist ---->  Inscription by Facebook");

    const savedUser = new User({
      name,
      email,
      password: " ",
      blood: "IDK",
      age: " ",
      weight: " ",
      adress: " ",
      phone: " ",
      usertype: "Donor",
      avatar: name,
      code: " ",
    });
    savedUser
      .save()
      .then((savedUser) => {
        res.status(202).send(
          JSON.stringify({
            //200 OK
            id: savedUser._id,
            name: savedUser.name,
            email: savedUser.email,
            blood: savedUser.blood,
            age: savedUser.age,
            weight: savedUser.weight,
            adress: savedUser.adress,
            phone: savedUser.phone,
            usertype: savedUser.usertype,
            avatar: savedUser.avatar,
            token: "",
          })
        );
      })
      .catch((err) => {
        console.log(err);
        console.log(err.stack);
      });
  }
});
///////////////////////////////////////////////////////////////////
module.exports = router;
