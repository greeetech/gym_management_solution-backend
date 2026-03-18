const User = require("../models/userModel");

// ======== user data store ====
exports.createUser = async (req, res) => {
  try {
    const data = req.body;
    const { name, email, address, age } = data;

    if (!name || !email || !address || !age) {
      return res
        .status(400)
        .json({ status: false, message: "All Fields are Required" });
    }

    const saveUser = await User.create(data);

    if (!saveUser) {
      return res
        .status(400)
        .json({
          status: false,
          message: "There is something wents wrong in user data store",
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

//=========== get all user

exports.getUser = async (req, res) => {
  try {
    const user = await User.find();

    return res.status(201).json({
      status: true,
      message: "user created successfully",
      data: user,
    });
  } catch (err) {
    return res.status(500).json({ status: false, message: err.message });
  }
};
