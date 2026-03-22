const Subscription = require("../models/subscriptionModel");

//====================== create subscription =====================

exports.createSubscription = async (req, res) => {
  try {
    const ownerId = req.user._id;
    const data = req.body;
    const { name, grossPrice, price, duration } = data;
    if (!name) {
      return res
        .status(400)
        .json({ status: false, message: "Name is required" });
    }

    if (typeof name !== "string" || name.trim() === "") {
      return res
        .status(400)
        .json({ status: false, message: "Name should be a valid string" });
    }

    let grossPriceNum = Number(grossPrice);
    if (isNaN(grossPriceNum) || grossPriceNum <= 0) {
      return res.status(400).json({
        status: false,
        message: "Gross Price should be a positive number",
      });
    }

    let priceNum = Number(price);
    if (isNaN(priceNum) || priceNum <= 0) {
      return res
        .status(400)
        .json({ status: false, message: "Price should be a positive number" });
    }

    const validDurations = ["Monthly", "Quarterly", "Half Yearly", "Yearly"];
    if (!duration || !validDurations.includes(duration)) {
      return res
        .status(400)
        .json({ status: false, message: "Invalid duration" });
    }

    // check if subscription with same name already exists for the gym owner

    const existingSubscription = await Subscription.findOne({
      gymOwnerId: ownerId,
      name: name,
    });
    if (existingSubscription) {
      return res.status(400).json({
        status: false,
        message: "Subscription with the same name already exists",
      });
    }

    const subscription = new Subscription({
      gymOwnerId: ownerId,
      name,
      grossPrice,
      price,
      duration,
    });

    await subscription.save();
    return res.status(201).json({
      status: true,
      message: "Subscription created successfully",
      data: subscription,
    });
  } catch (err) {
    return res.status(500).json({ status: false, message: err.message });
  }
};

//======================= update subscription =====================

exports.updateSubscription = async (req, res) => {
  try {
    const ownerId = req.user._id;
    const subscriptionId = req.params.id;
    const data = req.body;
    const { name, grossPrice, price, duration } = data;
    const subscription = await Subscription.findOne({
      _id: subscriptionId,
      gymOwnerId: ownerId,
    });
    if (!subscription) {
      return res
        .status(404)
        .json({ status: false, message: "Subscription not found" });
    }

    if (name) {
      if (typeof name !== "string" || name.trim() === "") {
        return res
          .status(400)
          .json({ status: false, message: "Name should be a valid string" });
      }
      subscription.name = name;
    }

    if (grossPrice) {
      let grossPriceNum = Number(grossPrice);
      if (isNaN(grossPriceNum) || grossPriceNum <= 0) {
        return res.status(400).json({
          status: false,
          message: "Gross Price should be a positive number",
        });
      }
      subscription.grossPrice = grossPriceNum;
    }

    if (price) {
      let priceNum = Number(price);
      if (isNaN(priceNum) || priceNum <= 0) {
        return res.status(400).json({
          status: false,
          message: "Price should be a positive number",
        });
      }
      subscription.price = priceNum;
    }

    // duration if  prevent duplicate $ne _id and same name for the same gym owner duration

    if (duration) {
      const validDurations = ["Monthly", "Quarterly", "Half Yearly", "Yearly"];
      if (!validDurations.includes(duration)) {
        return res
          .status(400)
          .json({ status: false, message: "Invalid duration" });
      }
      //check duplicate name for the same gym owner and same duration but different subscription id
      const existingSubscription = await Subscription.findOne({
        gymOwnerId: ownerId,
        duration: duration,
        _id: { $ne: subscriptionId },
      });

      if (existingSubscription) {
        return res.status(400).json({
          status: false,
          message:
            "Subscription with the same name and duration already exists",
        });
      }

      subscription.duration = duration;
    }

    await subscription.save();
    return res.status(200).json({
      status: true,
      message: "Subscription updated successfully",
      data: subscription,
    });
  } catch (err) {
    return res.status(500).json({ status: false, message: err.message });
  }
};

//======================= delete subscription =====================

exports.deleteSubscription = async (req, res) => {
  try {
    const ownerId = req.user._id;
    const subscriptionId = req.params.id;
    const subscription = await Subscription.findOneAndDelete({
      _id: subscriptionId,
      gymOwnerId: ownerId,
    });
    if (!subscription) {
      return res
        .status(404)
        .json({ status: false, message: "Subscription not found" });
    }
    return res.status(200).json({
      status: true,
      message: "Subscription deleted successfully",
      data: subscription,
    });
  } catch (err) {
    return res.status(500).json({ status: false, message: err.message });
  }
};

//======================= get all subscription =====================
exports.getAllSubscription = async (req, res) => {
  try {
    const ownerId = req.user._id;
    const subscriptions = await Subscription.find({ gymOwnerId: ownerId });
    return res.status(200).json({
      status: true,
      message: "Subscriptions fetched successfully",
      data: subscriptions,
    });
  } catch (err) {
    return res.status(500).json({ status: false, message: err.message });
  }
};

//======================= get subscription by id =====================
exports.getSubscriptionById = async (req, res) => {
  try {
    const ownerId = req.user._id;
    const subscriptionId = req.params.id;
    const subscription = await Subscription.findOne({
      _id: subscriptionId,
      gymOwnerId: ownerId,
    });
    if (!subscription) {
      return res
        .status(404)
        .json({ status: false, message: "Subscription not found" });
    }
    return res.status(200).json({
      status: true,
      message: "Subscription fetched successfully",
      data: subscription,
    });
  } catch (err) {
    return res.status(500).json({ status: false, message: err.message });
  }
};
