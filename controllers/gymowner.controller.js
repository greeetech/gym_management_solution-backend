const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Gym_Owner = require("../models/gymowner");

function validateEmail(email) {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
}

// ======== user data store ========

exports.registerGymOwner = async (req, res) => {
  try {
    const data = req.body;
    const { name, email, password, address, gender } = data;

    if (!name || typeof name !== "string") {
      return res.status(400).json({
        status: false,
        message: "Name is required | Provide valid string",
      });
    }

    if (!email || typeof email !== "string") {
      return res.status(400).json({
        status: false,
        message: "Email is required | Provide valid string",
      });
    }

    if (!validateEmail(email)) {
      return res
        .status(400)
        .json({ status: false, message: "Kindly provide a valid Email" });
    }

    // password
    if (!password || typeof password !== "string") {
      return res.status(400).json({
        status: false,
        message: "password is required | Provide valid string",
      });
    }

    // address

    if (address) {
      if (typeof address !== "string" || address.trim().length == 0) {
        return res
          .status(400)
          .json({ status: false, message: "Provide a Valid address" });
      }
    }

    if (gender && !["male", "female", "other"].includes(gender)) {
      return res.status(400).json({
        status: false,
        message: `gender should be one of these ${["male", "female", "other"].join(" | ")}`,
      });
    }

    const salt = 10;

    const hashpassword = await bcrypt.hash(password, salt);

    data.password = hashpassword;

    // email unique check
    const check = await Gym_Owner.findOne({ email: email });
    if (check) {
      return res
        .status(400)
        .json({ status: false, message: "Email Already exist" });
    }

    const saveUser = await Gym_Owner.create(data);

    if (!saveUser) {
      return res.status(400).json({
        status: false,
        message: "There is something wents wrong in registration data store",
      });
    }

    return res.status(201).json({
      status: true,
      message: "user created successfully",
      data: saveUser,
    });
  } catch (err) {
    return res.status(500).json({ status: false, message: err.message });
  }
};

//============== Log In Gym Owner ===========

exports.logInGym_owner = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ status: false, message: "Email or Password is missing " });
    }

    const gymOwner = await Gym_Owner.findOne({ email: email });

    if (!gymOwner) {
      return res.status(404).json({
        status: false,
        message: `Register yourself no data found by this Email:${email}`,
      });
    }

    const checkpassword = await bcrypt.compare(password, gymOwner.password);

    if (!checkpassword) {
      return res
        .status(404)
        .json({ status: false, message: `Invalid Credentials` });
    }

    const token = jwt.sign(
      { _id: gymOwner._id },
      process.env.JWT_SECERET_GYM_OWNER,
    );

    const data = {
      name: gymOwner.name,
      email: gymOwner.email,
      address: gymOwner.address,
      gender: gymOwner.gender,
    };

    return res.status(201).json({
      status: true,
      message: "Logged In successfully",
      data: data,
      token: token,
    });
  } catch (err) {
    return res.status(500).json({ status: false, message: err.message });
  }
};

//=========== get profile ================

exports.profileGym_Owner = async (req, res) => {
  try {
    const user = req.user;

    return res.status(201).json({
      status: true,
      message: "user created successfully",
      data: user,
    });
  } catch (err) {
    return res.status(500).json({ status: false, message: err.message });
  }
};

// ================= update profile ===============

exports.updateProfileGym_Owner = async (req, res) => {
  try {
    const user = req.user._id;
    const data = req.body;

    const { name, email, address, gender } = data;

    if (name) {
      if (typeof name !== "string") {
        return res.status(400).json({
          status: false,
          message: "Provide valid string for name",
        });
      }
    }

    if (email) {
      if (typeof email !== "string") {
        return res.status(400).json({
          status: false,
          message: "Provide valid string for email",
        });
      }

      if (!validateEmail(email)) {
        return res
          .status(400)
          .json({ status: false, message: "Kindly provide a valid Email" });
      }
    }

    if (address) {
      if (typeof address !== "string" || address.trim().length == 0) {
        return res
          .status(400)
          .json({ status: false, message: "Provide a Valid address" });
      }
    }

    if (gender) {
      if (!["male", "female", "other"].includes(gender)) {
        return res.status(400).json({
          status: false,
          message: `gender should be one of these ${["male", " female", "other"].join(" | ")}`,
        });
      }
    }

    // email unique check $ne:{_id:user._id}
    if (email) {
      const check = await Gym_Owner.findOne({
        email: email,
        _id: { $ne: user._id },
      });
      if (check) {
        return res
          .status(400)
          .json({ status: false, message: "Email Already exist" });
      }
    }

    const updateData = await Gym_Owner.findByIdAndUpdate(
      user._id,
      { $set: data },
      { returnDocument: 'after' },
    );

    return res.status(201).json({
      status: true,
      message: "Profile updated successfully",
      data: updateData,
    });
  } catch (err) {
    return res.status(500).json({ status: false, message: err.message });
  }
};
