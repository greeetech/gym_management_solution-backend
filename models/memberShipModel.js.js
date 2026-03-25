const mongoose = require("mongoose");

const membershipSchema = new mongoose.Schema(
  {
    gymOwnerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Gym_Owner",
      required: true,
    },
    gymMemberId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Gym_Member",
      required: true,
    },
    subscriptionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subscription",
      required: true,
    },
    // subscription details
    name: {
      type: String,
      required: true,
    },
    grossPrice: {
      type: Number,
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },

    duration: {
      type: String,
      enum: ["Monthly", "Quarterly", "Half Yearly", "Yearly"],
      default: "Monthly",
    },

    //==========

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
);

const Membership = mongoose.model("Membership", membershipSchema);

module.exports = Membership;
