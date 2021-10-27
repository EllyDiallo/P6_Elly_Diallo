const express = require("express")
const saucesController = require("../controllers/sauces")
const auth = require("../middleware/auth")
const multer = require("../middleware/multer-config")

const router = express.Router()

router.get("/", auth, saucesController.getAllSauces)
router.get("/:id", auth, saucesController.getOneSauce)

router.post("/:id/like", auth, saucesController.likeOrdislike)
router.post("/", auth, multer, saucesController.createSauce)

router.put("/:id", auth, multer, saucesController.modifySauce)

router.delete("/:id", auth, saucesController.deleteSauce)

module.exports = router