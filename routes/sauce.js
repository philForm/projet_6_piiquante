const express = require("express");
const router = express.Router();
const saucesControllers = require("../controllers/sauces.js");

const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");


router.get("/:id", auth, saucesControllers.displayOneSauce);

router.get("/", auth, saucesControllers.displayAllSauces);
router.post("/", auth, multer, saucesControllers.createSauce);

// router.post("/:id/like", auth, saucesControllers);

// router.put("/:id", auth, saucesControllers);
// router.delete("/:id", auth, saucesControllers);

module.exports = router;