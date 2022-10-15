const express = require("express");
const router = express.Router();
const saucesControllers = require("../controllers/sauces.js");

const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");


router.post("/", auth, multer, saucesControllers.createSauce);

router.get("/", auth, saucesControllers.displayAllSauces);
router.get("/:id", auth, saucesControllers.displayOneSauce);

router.post("/:id/like", auth, saucesControllers.likedSauce);

router.put("/:id", auth, multer, saucesControllers.modifySauce);
router.delete("/:id", auth, saucesControllers.deleteOneSauce);

module.exports = router;