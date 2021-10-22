const express = require("express")
const saucesController = require("../controllers/sauces")
const auth = require("../middleware/auth")
const multer = require("../middleware/multer-config")

const router = express.Router()

router.post("/", auth, multer, saucesController.createSauce)
/*router.post("/:id/like", auth, saucesController.likeSauce)

router.put("/:id", auth, multer, saucesController.modifySauce)

router.delete("/:id", auth, saucesController.deleteSauce)

router.get("/:id", auth, saucesController.getOneSauce)*/
router.get("/", auth, saucesController.getAllSauces)

module.exports = router