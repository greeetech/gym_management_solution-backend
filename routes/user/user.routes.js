const express = require("express");
const { createUser, getUser } = require("../../controllers/user.controller");

const router = express.Router();

router.route("/create").post(createUser);

router.route("/get").get(getUser);

module.exports = router;
