const express = require("express");
const saucesCtrl = require("../controllers/sauces");
const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");


const router = express.Router()

router.get("/", auth, saucesCtrl.getAllSauces);
router.get("/:id", auth, saucesCtrl.getOneSauce);

router.post("/:id/like", auth, saucesCtrl.likeOrdislike);
router.post("/", auth, multer, saucesCtrl.createSauce);

router.put("/:id", auth, multer, saucesCtrl.modifySauce);

router.delete("/:id", auth, saucesCtrl.deleteSauce);

module.exports = router;