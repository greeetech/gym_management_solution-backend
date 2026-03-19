const mongoose = require("mongoose");

const gymOwnerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    address: {
      type: String,
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
      default: "other",
    },
    role: {
      type: String,
      enum: ["admin", "gym_owner"],
      default: "gym_owner",
    },
  },
  { timestamps: true },
);

const Gym_Owner = mongoose.model("Gym_Owner", gymOwnerSchema);

module.exports = Gym_Owner;
