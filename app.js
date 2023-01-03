const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const usersRoutes = require('./routes/users');
const fournisseursRoutes = require('./routes/fournisseur');
const stocksRoutes = require('./routes/stocks');
const cors = require('cors');
const dotenv = require("dotenv");
dotenv.config();
const promotionsRoutes = require('./routes/promotion');
const swaggerUI = require('swagger-ui-express') ;
const swaggerJSDoc = require('swagger-jsdoc') ;
//Database connection
mongoose.Promise = global.Promise;
mongoose.connect(process.env.DATABASELOCAL,{ useNewUrlParser: true });
mongoose.connection.on('connected', function(req, res) {
    console.log('Connected to the database');
});
mongoose.connection.on('error', function(req, err){
    console.log('Unable to connect to the database ' + err);
});
 
app.all('/*', function(req, res, next) {
    // CORS headers
    res.header("Access-Control-Allow-Origin", "*"); // restrict it to the required domain
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    // Set custom headers for CORS
    res.header('Access-Control-Allow-Headers', 'Content-type,Accept,X-Access-Token,X-Key');
    if (req.method == 'OPTIONS') {
        res.status(200).end();
    } else {
        next();
    }
});









// swagger
const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "BOOKY API",
            version: "1.0.0",
            description: "A simple Express  API",
        },
        servers: [
            {
                url: "http://localhost:2500",
            },
        ],
    },
    apis: ["./routes/*.js"],
};

const specs = swaggerJSDoc(options);


//swagger
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));

 
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());
const _PORT = process.env.PORT || 2500;
//Start the server
app.listen(_PORT, function (){
    console.log('Server Started on port ', _PORT);
});

//allow to read files in folder uploads
var publicDir = require('path').join(__dirname,'/Uploads');
app.use('/Uploads', express.static(publicDir));
app.use(cors());
app.use('/uploads', express.static('uploads_user'));
app.use('/uploadsStock', express.static('uploads_stock'));

// allow to excutes url of web services in such route
app.use('/users', usersRoutes);
app.use('/fournisseurs', fournisseursRoutes);
app.use('/stocks', stocksRoutes);
app.use('/promotions', promotionsRoutes);