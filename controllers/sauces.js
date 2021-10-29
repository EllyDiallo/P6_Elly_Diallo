const Sauce = require("../models/sauce")
const fs = require("fs")

// Enregistrement de la sauce bdd.
exports.createSauce = (req, res, next) => {
    const sauce = JSON.parse(req.body.sauce) 

    new Sauce({
            ...sauce,
            imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
        })
        .save()
        .then(() => res.status(201).json({
            message: "Objet enregistré !"
        }))
        .catch((error) => res.status(400).json({
            error
        }))
}

// Obtention de toutes les sauces.
exports.getAllSauces = (req, res, next) => {
    Sauce.find()
        .then((sauces) => res.status(200).json(sauces))
        .catch((error) => res.status(400).json({
            error
        }))
}

// Obtention d'une sauce.
exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({
            _id: req.params.id
        })
        .then((sauce) => res.status(200).json(sauce))
        .catch((error) => res.status(404).json({
            error
        }))
}

// Modification de la sauce.
exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
    } : {
        ...req.body
    }
    Sauce.updateOne({
            _id: req.params.id
        }, {
            ...sauceObject,
            _id: req.params.id
        })
        .then(() => res.status(200).json({
            message: "Objet modifié !"
        }))
        .catch((error) => res.status(400).json({
            error
        }))
}

//Suppression de la la sauce.
exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({
            _id: req.params.id
        })
        .then((sauce) => {
            const filename = sauce.imageUrl.split("/images/")[1];

            fs.unlink(`images/${filename}`, () => {
                Sauce.deleteOne({
                        _id: req.params.id
                    })
                    .then(() => res.status(200).json({
                        message: "Objet supprimé !"
                    }))
                    .catch((error) => res.status(400).json({
                        error
                    }))
            })
        })
        .catch((error) => res.status(500).json({
            error
        }))
}

// Gestion des likes et dislikes.
exports.likeOrdislike = (req, res, next) => {
    Sauce.findOne({
            _id: req.params.id
        })
        .then(sauce => {
            let messageToUsers;
            const userId = req.body.userId

            // Obtention index de l'user ID du tableau user liked/disliked
            let indexUserLiked = sauce.usersLiked.indexOf(userId);
            let indexUserDisliked = sauce.usersDisliked.indexOf(userId);

            // si user ID déja présent, on efface le vote et supprime le user ID du tableau.
            if (indexUserLiked !== -1) {

                sauce.likes--;
                sauce.usersLiked.splice(indexUserLiked, 1);
            }
            if (indexUserDisliked !== -1) {

                sauce.dislikes--;
                sauce.usersDisliked.splice(indexUserDisliked, 1);
            }

            // Gestion des trois états 
            switch (req.body.like) {
            case 1:
                sauce.likes++;
                sauce.usersLiked.push(userId);
                messageToUsers = "Sauce likée !";
                break;
            case 0:
                messageToUsers = "Sauce ignorée !";
                break;
            case -1:
                sauce.dislikes++;
                sauce.usersDisliked.push(userId);
                messageToUsers = "Sauce dislikée !";
                break;
            }

            // Modifiaction de la sauce.
            Sauce.updateOne({
                    _id: req.params.id
                }, {
                    ...sauce.toJSON,
                    _id: req.params.id
                })
                .then(() => res.status(200).json({
                    message: messageToUsers
                }))
                .catch(error => res.status(500).json({
                    error
                }));
        })

};



   