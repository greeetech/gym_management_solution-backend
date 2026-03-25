const mongoose = require("mongoose");

const gymMembersSchema = new mongoose.Schema(
  {
    gymOwnerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Gym_Owner",
      required: true,
    },

    profileImage: {
      public_id: String,
      url: String,
    },

    fullName: {
      type: String,
      required: true,
    },

    phone: {
      type: String,
      required: true,
      unique: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    age: {
      type: Number,
    },

    weight: {
      type: Number,
    },

    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
    },

    subscriptionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subscription",
      required: true,
    },

    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true },
); // will modify more

const GymMembers = mongoose.model("GymMembers", gymMembersSchema);

module.exports = GymMembers;
