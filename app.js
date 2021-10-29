//Importation des dépendances et paths
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const helmet = require('helmet');
const sauceRoutes = require('./routes/sauces');
const userRoutes = require('./routes/user');
const rateLimits = require('../backend/middleware/req-limit');

//Création application avec méthode express
const app = express(); 

//Importation fonction config() de dotenv pour variables d'environement.
require("dotenv").config();

//Utilisation des variables d'environement pour l'identification mongoose.
const URI = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_LINK}`;

mongoose.connect(URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));

// sécurisation en-têtes http
app.use(helmet());

// Configuration requêtes CORS.
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

//Remplace "body-parser" obsolète.
app.use(express.urlencoded({
    extended: true
}));
app.use(express.json());

//limiteur de requêtes (globales: 100/15mins, creation compte: 5/h)
app.use("/api", rateLimits.limiter);
app.use('/api/auth/signup', rateLimits.createAccountLimiter);

//Gestion de la ressource "images" pour chaque requête route "/images".
app.use('/images', express.static(path.join(__dirname, 'images')));

app.use('/api/sauces', sauceRoutes);
app.use('/api/auth', userRoutes);


module.exports = app;