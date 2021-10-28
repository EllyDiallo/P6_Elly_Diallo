const passwordValidator = require("password-validator");


const passwordSchema = new passwordValidator();


passwordSchema
    .is().min(8) // 8 caract min 
    .is().max(100) // 100 caract max
    .has().uppercase(1) // 1 maj min
    .has().lowercase(1) // 1 minuscule min
    .has().digits(2) // 2 digit min
    .has().not().spaces() // Pas d'espace
    .is().not().oneOf(['Passw0rd', 'Password123', 'azerty','$','+','*','-','=']); // Valeurs blacklistées



module.exports = (req, res, next) => {

    if (passwordSchema.validate(req.body.password)) {

        next();

    } else {

        return res
            .status(400)
            .json({
                Error: "le mot de passe n'est pas assez fort" + alert(passwordSchema.validate(req.body.password, {
                    list: true
                }))
            })

    }



}