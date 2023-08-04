// Variables environnemment
require("dotenv").config();
const express = require("express");
// const bodyParser = require("body-parser");
const router = require("./app/router");


const cors = require('cors');
const multer = require('multer');
const bodyParser = multer();




// import du module
const session = require('express-session');
// configuration de la session
const sessionMiddleware = session({
    secret : 'KeepScore&HaveFun',
    resave: true,
    saveUninitialized : true,
    cookie : {
        secure : true ,// http mode doesn't require it 
        maxAge : (10006060) // durée de la session en millisecondes - 1 heure
    }
});


const app = express();
app.use(express.json());


app.use(cors('*')); // On autorise tout les domaines à faire du Cross Origin Resource Sharing.
app.use(bodyParser.none()); // permet de traduire les données du front


// intégration du middleware pour les sessions
app.use(sessionMiddleware);


app.use(bodyParser.none());

app.set('view engine', 'ejs');
app.set('views', './app/view');

app.use(router);


app.use(express.static('public'));



const PORT = process.env.PORT ?? 3000;
app.listen(PORT, ()=>{
    console.log(`Le serveur tourne sur le port : ${PORT}`);
});