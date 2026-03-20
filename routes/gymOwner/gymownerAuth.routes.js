const express = require("express");
const {
  registerGymOwner,
  logInGym_owner,
  profileGym_Owner,
  updateProfileGym_Owner,
} = require("../../controllers/gymowner.controller");
const gym_owner = require("../../routing/gymownerRoute.routes");
const { gym_ownerAuthentication } = require("../../middleware/auth");

const router = express.Router();

router.route("/register").post(registerGymOwner);

router.route("/login").post(logInGym_owner);

router.route("/profile").get(gym_ownerAuthentication, profileGym_Owner);

router.route("/profile").put(gym_ownerAuthentication, updateProfileGym_Owner);

module.exports = router;
