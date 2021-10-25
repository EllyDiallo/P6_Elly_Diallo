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



  



  
   
    /*switch (like) {
        case 1:
          if(sauce.usersLiked.find((_userID) => _userID === userID)){
            return {message:"déjà liké "};
          }
          return{ 
            //sauce.usersLiked.push( userID) + sauce.likes++;
            usersLiked: [...sauce.usersLiked, userID],
            likes: sauce.usersLiked.length + 1
          
          }
                 
            
          
          break;
        case -1:

          break;
          case 0:
          
            break;
      
        default:
          break;
      }
*/ 
  
