require("dotenv").config();
const express = require("express");
const path = require("path");
const connectdb = require("./config/db");

const app = express();

connectdb();

app.use(express.json());

app.get("/", async (req, res) => {
  // return res.status(200).json({status:true , message:"Hardiko Website is up and running"})
  return res.sendFile(path.join(__dirname, "index.html"));
});

const user = require("./routes/user/user.routes");

app.use("/", user);

module.exports = app;
