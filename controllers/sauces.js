const Sauce = require("../models/sauce")
const fs = require("fs")

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