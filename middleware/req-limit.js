const rateLimit = require("express-rate-limit");

exports.limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: " :( trop de requêtes pour cet utilisateur"
});


exports.createAccountLimiter = rateLimit({

    windowMs: 60 * 60 * 1000,
    max: 5,
    message : " :( Trop de comptes créés cette dernière heure: 5 maximum" 
});


