const getMembershipStatus = (membership) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const start = new Date(membership.startDate);
  const end = new Date(membership.endDate);

  // difference in days

  const diffTime = end - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  //  Cancelled

  if (membership.isCancelled) return "Cancelled";

  //  Inactive

  if (membership.isInactive) return "Inactive";

  //  Pending

  if (today < start) return "Pending";

  //  Expired

  if (today > end) return "Expired";

  //  Expiry Soon (within 5 days)

  if (diffDays <= 5) return "Expiry Soon";

  //  Active

  return "Active";
};


module.exports = { getMembershipStatus }