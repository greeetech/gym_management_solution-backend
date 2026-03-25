const express = require("express");
const { gym_ownerAuthentication } = require("../../middleware/auth");
const {
  createSubscription,
  updateSubscription,
  deleteSubscription,
  getAllSubscription,
  getSubscriptionById,
} = require("../../controllers/subscription.controller");

const router = express.Router();

router.route("/add").post(gym_ownerAuthentication, createSubscription);

router.route("/update/:id").put(gym_ownerAuthentication, updateSubscription);

router.route("/del/:id").delete(gym_ownerAuthentication, deleteSubscription);

router.route("/get").get(gym_ownerAuthentication, getAllSubscription);

router.route("/get/:id").get(gym_ownerAuthentication, getSubscriptionById);


module.exports = router;
