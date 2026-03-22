const mongoose = require("mongoose");

const subscriptionSchema = new mongoose.Schema(
  {
    gymOwnerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Gym_Owner",
      required: true,
    },

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
  },
  { timestamps: true },
);

const Subscription = mongoose.model("Subscription", subscriptionSchema);

module.exports = Subscription;
