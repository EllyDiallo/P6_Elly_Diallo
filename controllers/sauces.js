const Sauce = require("../models/sauce")
const fs = require("fs")
const sauce = require("../models/sauce")

exports.createSauce = (req, res, next) => {
  const sauce = JSON.parse(req.body.sauce)

  new Sauce({
    ...sauce,
    imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
  })
    .save()
    .then(() => res.status(201).json({ message: "Objet enregistré !" }))
    .catch((error) => res.status(400).json({ error }))
}

exports.getAllSauces = (req, res, next) => {
    Sauce.find()
      .then((sauces) => res.status(200).json(sauces))
      .catch((error) => res.status(400).json({ error }))
  }

exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => res.status(200).json(sauce))
    .catch((error) => res.status(404).json({ error }))
}

exports.modifySauce = (req, res, next) => {
  const sauceObject = req.file
    ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
      }
    : { ...req.body }
   Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
    .then(() => res.status(200).json({ message: "Objet modifié !" }))
    .catch((error) => res.status(400).json({ error }))
}

exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      const filename = sauce.imageUrl.split("/images/")[1];

      fs.unlink(`images/${filename}`, () => {
        Sauce.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: "Objet supprimé !" }))
          .catch((error) => res.status(400).json({ error }))
      })
    })
    .catch((error) => res.status(500).json({ error }))
}


exports.likeOrdislike = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
      let messageToUsers;
      const userId = req.body.userId
      let indexUserLiked = sauce.usersLiked.indexOf(userId);
      let indexUserlDisiked = sauce.usersDisliked.indexOf(userId);
      
      // Est-ce que l'user a déjà voté ?
      if (indexUserLiked !== -1) { // L'user a déjà dit qu'il aimait la sauce
        // On efface son ancien vote
        sauce.likes--;
        sauce.usersLiked.splice(indexUserLiked, 1);
      }
      if (indexUserlDisiked !== -1) { // L'user a déjà dit qu'il n'aimait pas la sauce
        // On efface son ancien vote
        sauce.dislikes--;
        sauce.usersDisliked.splice(indexUserlDisiked, 1);
      }

      // On met en place son nouveau vote
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
      Sauce.updateOne({ _id: req.params.id }, {...sauce._doc, _id: req.params.id} )
      .then(() => res.status(200).json({ message: "messageToUsers"}))
      .catch(error => res.status(500).json({ error }));
    })
};
  

    