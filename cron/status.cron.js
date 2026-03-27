const cron = require("node-cron");
const Membership = require("../models/memberShipModel.js");


cron.schedule("0 0 * * *", async () => {
  console.log("Running membership status update cron...");

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const memberships = await Membership.find({
    $in: ["Pending", "Active", "Expiry Soon"],
  });

  for (let m of memberships) {
    let newStatus;

    const start = new Date(m.startDate);
    const end = new Date(m.endDate);

    const diffDays = Math.ceil((end - today) / (1000 * 60 * 60 * 24));

    if (today < start) {
      newStatus = "Pending";
    } else if (today > end) {
      newStatus = "Expired";
    } else if (diffDays <= 5) {
      newStatus = "Expiry Soon";
    } else {
      newStatus = "Active";
    }

    if (m.status !== newStatus) {
      m.status = newStatus;
      await m.save();
    }
  }

  console.log("Membership status updated");
});
