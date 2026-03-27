const { isValidObjectId } = require("mongoose");
const GymMembers = require("../models/gymMembersModel");
const Subscription = require("../models/subscriptionModel");
const Membership = require("../models/memberShipModel.js");
const { uploadSingleImage } = require("../utils/fileUpload");

//====================== create gym member =====================

exports.createGymMember = async (req, res) => {
  try {
    const ownerId = req.user._id;

    const {
      fullName,
      phone,
      email,
      age,
      weight,
      gender,
      subscriptionId,
      startDate,
    } = req.body;

    // ================= validations =================

    if (!fullName || typeof fullName !== "string" || !fullName.trim()) {
      return res
        .status(400)
        .json({ status: false, message: "Valid full name is required" });
    }

    if (!phone || !/^[6-9]\d{9}$/.test(phone)) {
      return res
        .status(400)
        .json({ status: false, message: "Valid phone number required" });
    }

    if (!email || typeof email !== "string" || !email.trim()) {
      return res
        .status(400)
        .json({ status: false, message: "Valid email is required" });
    }

    if (age && (isNaN(age) || age <= 0 || age > 120)) {
      return res.status(400).json({ status: false, message: "Invalid age" });
    }

    if (weight && (isNaN(weight) || weight <= 0)) {
      return res.status(400).json({ status: false, message: "Invalid weight" });
    }

    if (!gender || !["Male", "Female", "Other"].includes(gender)) {
      return res.status(400).json({ status: false, message: "Invalid gender" });
    }

    if (!subscriptionId || !isValidObjectId(subscriptionId)) {
      return res
        .status(400)
        .json({ status: false, message: "Invalid subscription ID" });
    }

    const subscription = await Subscription.findById(subscriptionId);

    if (!subscription) {
      return res
        .status(404)
        .json({ status: false, message: "Subscription not found" });
    }

    if (!startDate || isNaN(Date.parse(startDate))) {
      return res
        .status(400)
        .json({ status: false, message: "Valid start date required" });
    }

    // ================= DATE LOGIC =================

    const start = new Date(startDate);

    // normalize start date
    start.setHours(0, 0, 0, 0);

    // clone for end date (IMPORTANT)
    const end = new Date(start);

    if (subscription.duration === "Monthly") {
      end.setMonth(end.getMonth() + 1);
    } else if (subscription.duration === "Quarterly") {
      end.setMonth(end.getMonth() + 3);
    } else if (subscription.duration === "Half Yearly") {
      end.setMonth(end.getMonth() + 6);
    } else if (subscription.duration === "Yearly") {
      end.setFullYear(end.getFullYear() + 1);
    }

    // ================= STATUS LOGIC =================

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let status = start <= today ? "Active" : "Pending";

    // ================= CREATE MEMBER =================

    const gymMember = await GymMembers.create({
      gymOwnerId: ownerId,
      fullName,
      phone,
      email,
      age,
      weight,
      gender,
      subscriptionId,
    });

    // ================= CREATE MEMBERSHIP =================

    const membership = await Membership.create({
      gymOwnerId: ownerId,
      gymMemberId: gymMember._id,
      subscriptionId,
      name: subscription.name,
      grossPrice: subscription.grossPrice,
      price: subscription.price,
      duration: subscription.duration,
      startDate: start,
      endDate: end,
      status: status,
    });

    gymMember.membershipId = membership._id;
    await gymMember.save();

    return res.status(201).json({
      status: true,
      message: "Gym member & membership created successfully",
      data: { gymMember, membership },
    });
  } catch (err) {
    return res.status(500).json({ status: false, message: err.message });
  }
};

// ========================  update gym member profile image ========================

exports.updateGymMemberProfileImage = async (req, res) => {
  try {
    const memberId = req.params.id;
    const ownerId = req.user._id;

    const gymMember = await GymMembers.findOne({
      _id: memberId,
      gymOwnerId: ownerId,
    });

    if (!gymMember) {
      return res
        .status(404)
        .json({ status: false, message: "Gym member not found" });
    }

    if (!req.files || !req.files.profileImage) {
      return res
        .status(400)
        .json({ status: false, message: "Profile image file is required" });
    }

    const image = req.files.profileImage;

    const result = await uploadSingleImage(image, "gym_members");

    if (!result.status) {
      return res.status(400).json({ status: false, message: result.message });
    }

    req.body.profileImage = {
      filename: result.data.filename,
      url: result.data.url,
    };

    const updatedMember = await GymMembers.findByIdAndUpdate(
      memberId,
      { profileImage: req.body.profileImage },
      { returnDocument: "after" },
    );

    return res.status(200).json({
      status: true,
      message: "Profile image updated successfully",
      data: updatedMember,
    });
  } catch (err) {
    return res.status(500).json({ status: false, message: err.message });
  }
};

// update gym member details only required details will be updated rest will remain same

exports.updateGymMemberDetails = async (req, res) => {
  try {
    const memberId = req.params.id;
    const ownerId = req.user._id;

    const gymMember = await GymMembers.findOne({
      _id: memberId,
      gymOwnerId: ownerId,
    });
    if (!gymMember) {
      return res
        .status(404)
        .json({ status: false, message: "Gym member not found" });
    }

    const { fullName, phone, email, age, weight, gender } = req.body;

    if (fullName) {
      gymMember.fullName = fullName;
    }
    if (phone) {
      gymMember.phone = phone;
    }
    if (email) {
      gymMember.email = email;
    }
    if (age !== undefined) {
      gymMember.age = age;
    }
    if (weight !== undefined) {
      gymMember.weight = weight;
    }
    if (gender) {
      gymMember.gender = gender;
    }

    const updatedMember = await GymMembers.findByIdAndUpdate(
      memberId,
      gymMember,
      { returnDocument: "after" },
    );

    return res.status(200).json({
      status: true,
      message: "Gym member details updated successfully",
      data: updatedMember,
    });
  } catch (err) {
    return res.status(500).json({ status: false, message: err.message });
  }
};

// ========================  get gym member profile image ========================

exports.getMyGymMembers = async (req, res) => {
  try {
    const ownerId = req.user._id;

    const { search, statusFilter, page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const query = { gymOwnerId: ownerId };

    if (search) {
      query.fullName = { $regex: search, $options: "i" };
    }

    //  Populate membership + status
    let members = await GymMembers.find(query)
      .populate({
        path: "membershipId",
        select: "status startDate endDate",
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .lean();

    //  Simple filter
    if (statusFilter && statusFilter !== "All") {
      members = members.filter((m) => m.membershipId?.status === statusFilter);
    }

    const total = await GymMembers.countDocuments(query);

    return res.status(200).json({
      status: true,
      message: "Gym members fetched successfully",
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / limit),
      },
      data: members,
    });
  } catch (err) {
    return res.status(500).json({
      status: false,
      message: err.message,
    });
  }
};

//========================= get single gym member details ========================

exports.getSingleGymMemberDetails = async (req, res) => {
  try {
    const ownerId = req.user._id;
    const memberId = req.params.id;
    const gymMember = await GymMembers.findOne({
      _id: memberId,
      gymOwnerId: ownerId,
    }).populate("membershipId");

    if (!gymMember) {
      return res.status(404).json({
        status: false,
        message: "Gym member not found",
      });
    }

    return res.status(200).json({
      status: true,
      message: "Gym member details fetched successfully",
      data: gymMember,
    });
  } catch (err) {
    return res.status(500).json({
      status: false,
      message: err.message,
    });
  }
};

// ========================  delete gym member (soft delete) ========================

exports.deleteGymMember = async (req, res) => {
  try {
    const memberId = req.params.id;
    const ownerId = req.user._id;
    const gymMember = await GymMembers.findOne({
      _id: memberId,
      gymOwnerId: ownerId,
    });
    if (!gymMember) {
      return res
        .status(404)
        .json({ status: false, message: "Gym member not found" });
    }
    gymMember.isDeleted = true;
    gymMember.isDeletedAt = new Date();
    await gymMember.save();
    return res.status(200).json({
      status: true,
      message: "Gym member deleted successfully",
    });
  } catch (err) {
    return res.status(500).json({ status: false, message: err.message });
  }
};
