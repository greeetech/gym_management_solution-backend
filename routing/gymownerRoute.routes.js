const express = require("express")


const gym_owner = express()


const gymownerAuthRoute = require("../routes/gymOwner/gymownerAuth.routes")

gym_owner.use("/gym_owner", gymownerAuthRoute)

module.exports = gym_owner