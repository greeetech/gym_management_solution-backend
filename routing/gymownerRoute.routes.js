const express = require("express");

const gym_owner = express();

const gymownerAuthRoute = require("../routes/gymOwner/gymownerAuth.routes");

const subscriptionRoute = require("../routes/gymOwner/subscriptionModel");

gym_owner.use("/gym_owner", gymownerAuthRoute);

gym_owner.use("/gym_owner/subscription", subscriptionRoute);

module.exports = gym_owner;
