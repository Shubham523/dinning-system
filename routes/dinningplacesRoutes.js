const express = require("express");
const { addDinningPlace, searchDinningPlaces, makeBooking } = require("../controllers/dinningplace");
const { checkRole, verifyToken } = require("../middlewares/authenticationMiddleware");


const router = express.Router();

router.post("/dining-place/create",addDinningPlace);
router.get("/dining-place/:name", searchDinningPlaces);
router.post("/dining-place/book", checkRole,verifyToken,makeBooking);
module.exports = router;

