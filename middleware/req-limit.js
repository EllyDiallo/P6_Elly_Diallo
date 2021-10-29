const rateLimit = require("express-rate-limit");

exports.limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 750, // 750 requêtes
    message: " :( trop de requêtes pour cet utilisateur"
});


exports.createAccountLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 heure
    max: 5, // 5 requêtes
    message : " :( Trop de comptes créés cette dernière heure: 5 maximum" 
});


