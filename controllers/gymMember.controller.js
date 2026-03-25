const { isValidObjectId } = require("mongoose");
const GymMembers = require("../models/gymMembersModel");

//====================== create gym member =====================

exports.createGymMember = async (req, res) => {
  try {
    const ownerId = req.user._id;

    const data = req.body;

    const {
      fullName,
      phone,
      email,
      age,
      weight,
      gender,
      subscriptionId,
      startDate,
    } = data;




if(!fullName ){
    return res.status(400).json({ status: false, message: "Full name is required" });
}


if(fullName && (typeof fullName !== "string" || fullName.trim() === "" )){
    return res.status(400).json({ status: false, message: "Provide valid string for full name" });
}


if(!phone ){
    return res.status(400).json({ status: false, message: "Phone number is required" });
}

if(phone && (typeof phone !== "string" || phone.trim() === "" )){
    return res.status(400).json({ status: false, message: "Provide valid string for phone number" });
}

// valid 10 digit phone number validation indian format
const phoneRegex = /^[6-9]\d{9}$/;

if(!phoneRegex.test(phone)){
    return res.status(400).json({ status: false, message: "Provide valid phone number" });
}


if(!email ){
    return res.status(400).json({ status: false, message: "Email is required" });
}

if(email && (typeof email !== "string" || email.trim() === "" )){
    return res.status(400).json({ status: false, message: "Provide valid string for email" });
}



if(age && (isNaN(Number(age) || age <= 0 || age > 120 ))){
    return res.status(400).json({ status: false, message: "Provide valid number for age" });
}


if(weight && (isNaN(Number(weight)) || weight <= 0 )){
    return res.status(400).json({ status: false, message: "Provide valid number for weight" });
}

if(!gender ){
    return res.status(400).json({ status: false, message: "Gender is required" });
}

if(gender && !["Male", "Female", "Other"].includes(gender)){
    return res.status(400).json({ status: false, message: `Gender should be one of these ${["Male", "Female ", "Other"].join(" | ")}` });
}


// yaha pr mai baad me krta hoon 


if(!subscriptionId  || !isValidObjectId(subscriptionId)){
    return res.status(400).json({ status: false, message: "Subscription ID should be a valid Object ID" });
}


// format for start date should be YYYY-MM-DD

if(!startDate ){
    return res.status(400).json({ status: false, message: "Start date is required" });
}





if(startDate && isNaN(Date.parse(startDate))){
    return res.status(400).json({ status: false, message: "Provide valid date for start date" });
}   

let start = new Date(startDate);



// need to calculate end date based on subscription duration Monthly, Quarterly, Half Yearly, Yearly ccording then create membership at a time after member creation end date will be 







  } catch (err) {
    return res.status(500).json({ status: false, message: err.message });
  }
};

// upload profile image for gym member
