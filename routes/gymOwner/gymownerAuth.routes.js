const express = require("express");
const { registerGymOwner, logInGym_owner } = require("../../controllers/gymowner.controller");

const router = express.Router();

router.route("/register").post(registerGymOwner);

router.route("/login").post(logInGym_owner);

module.exports = router;
