const express = require("express");
const { registerUser, loginUser } = require("../controllers/userController");
const verifyToken = require("../middlewares/authenticationMiddleware");
const router = express.Router();

router.post("/signup",registerUser);
router.post("/login", loginUser);
module.exports = router;