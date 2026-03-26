require("dotenv").config();
const express = require("express");
const path = require("path");
const connectdb = require("./config/db");
const fileUpload = require("express-fileupload");
const cloudinary = require("cloudinary").v2;

const app = express();

connectdb();

app.use(express.json());

app.use(
  fileUpload({
    limits: { fileSize: 20 * 1024 * 1024 },
  }),
);

app.get("/", async (req, res) => {
  // return res.status(200).json({status:true , message:"Hardiko Website is up and running"})
  return res.sendFile(path.join(__dirname, "index.html"));
});

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});


const gymowner = require("./routing/gymownerRoute.routes");
app.use("/", gymowner);

module.exports = app;
