const jwt = require("jsonwebtoken");
const Gym_Owner = require("../models/gymowner");

exports.gym_ownerAuthentication = async (req, res, next) => {
  try {
    const token = req.headers["x-auth-token"];

    if (!token) {
      return res
        .status(400)
        .json({ status: false, message: "Auth token is missing" });
    }

    jwt.verify(
      token,
      process.env.JWT_SECERET_GYM_OWNER,
      async (err, decoded) => {
        if (err) {
          return res
            .status(401)
            .json({ status: false, message: "Un authenticated user" });
        }
        const user = await Gym_Owner.findById(decoded._id).select("-password");

        if (!user) {
          return res
            .status(404)
            .json({ status: false, message: "Gym owner not found" });
        }

        req.user = user;

        req.token = token;
        // console.log(req.user);
        next();
      },
    );
  } catch (err) {
    return res.status(500).json({ status: false, message: err.message });
  }
};
