const Membership = require("../models/memberShipModel.js");

//====================== get all memberships of gym owner =====================

exports.getAllMemberships = async (req, res) => {
  try {
    const ownerId = req.user._id;

    // ================= QUERY PARAMS =====================

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 50;
    const skip = (page - 1) * limit;

    // ================= OPTIONAL FILTERS =================

    const search = req.query.search || "";

    const statusFilter = req.query.status;

    if (
      statusFilter &&
      !["Pending", "Active", "Expired", "Cancelled", "Expiry Soon"].includes(
        statusFilter,
      )
    ) {
      return res.status(400).json({
        status: false,
        message:
          "Invalid status filter. Allowed values: Pending, Active, Expired, Cancelled, Expiry Soon",
      });
    }

    // ================= BASE QUERY =================

    let query = {
      gymOwnerId: ownerId,
    };

    // search by name (subscription name)

    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    // ================= FETCH DATA =================

    const memberships = await Membership.find(query)
      .populate("gymMemberId", "fullName phone email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    // ================= TOTAL COUNT =================

    const total = await Membership.countDocuments(query);

    // ================= RESPONSE ====================

    return res.status(200).json({
      status: true,
      message: "Memberships fetched successfully",
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
      data: memberships,
    });
  } catch (err) {
    return res.status(500).json({
      status: false,
      message: err.message,
    });
  }
};

//======================== get single membership details ========================

exports.getSingleMembershipDetails = async (req, res) => {
  try {
    const ownerId = req.user._id;
    const membershipId = req.params.id;

    const membership = await Membership.findOne({
      _id: membershipId,
      gymOwnerId: ownerId,
    }).populate("gymMemberId", "fullName phone email");


    if (!membership) {
      return res.status(404).json({
        status: false,
        message: "Membership not found",
      });
    }

    return res.status(200).json({
      status: true,
      message: "Membership details fetched successfully",
      data: membership,
    });
  } catch (err) {
    return res.status(500).json({
      status: false,
      message: err.message,
    });
  }
};

// ======================== update status of membership (active, inactive, cancelled) ========================

exports.updateMembershipStatus = async (req, res) => {
    try {
        const ownerId = req.user._id;
        const membershipId = req.params.id;
        const { status } = req.body;

        if (!["Active", "Inactive", "Cancelled"].includes(status)) {
            return res.status(400).json({
                status: false,
                message: "Invalid status. Allowed values: Active, Inactive, Cancelled",
            });
        }

        const membership = await Membership.findOne({ _id: membershipId, gymOwnerId: ownerId });

        if (!membership) {
            return res.status(404).json({
                status: false,
                message: "Membership not found",
            });
        }

        membership.status = status;
        await membership.save();
        return res.status(200).json({
            status: true,
            message: "Membership status updated successfully",
            data: membership,
        });
    } catch (err) {
        return res.status(500).json({
            status: false,
            message: err.message,
        });
    }
};
