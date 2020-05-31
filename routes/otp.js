const express = require("express");
const Request = require("request");
const moment = require("moment");
const config = require("config");
const router = express.Router();
const { User } = require("../models/user");

router.get("/:phone", async (req, res) => {
  const user = (await User.find({ phone: req.params.phone }))[0];
  if (!user)
    return res.status(400).send("Mobile Number not registered with us");

  var otp = Math.floor(100000 + Math.random() * 900000);

  const dateGen = new Date().toLocaleTimeString();
  const apiKey = config.get("smsApiKey");
  const numbers = req.params.phone; // in a comma seperated list
  const message =
    "Your OTP for logging into KwikCart is : " +
    otp +
    ". Time of generation of OTP is " +
    dateGen +
    ". The OTP is valid for 10 mins from the mentioned time";
  const sender = "TXTLCL";

  const url =
    "https://api.textlocal.in/send/?apikey=" +
    apiKey +
    "&numbers=" +
    numbers +
    "&message=" +
    message +
    "&sender=" +
    sender;

  // Call API to send otp to mobile
  Request.get(url, (error, response, body) => {
    if (error) throw new Error(error);
  });

  user.otp = otp;
  user.otpTimeStamp = Date.now();
  await user.save();
  return res.status(200).send("OTP sent successfully");
});

router.post("/:phone", async (req, res) => {
  const user = (await User.find({ phone: req.params.phone }))[0];
  if (!user)
    return res.status(400).send("Mobile Number not registered with us");

  if (!user.otp) return res.status(400).send("Invalid OTP");

  if (user.otp == req.body.otp) {
    const mins = moment
      .duration(moment(Date.now()).diff(moment(user.otpTimeStamp)))
      .get("minutes");

    if (mins > 10)
      return res
        .status(400)
        .send("OTP has expired. Generate a new one before proceeding");

    //Setting it to undefined will remove these properties from mongodb document
    user.otp = undefined;
    user.otpTimeStamp = undefined;
    await user.save();
    return res.status(200).send("OTP verified Successfully");
  } else return res.status(400).send("Invalid OTP Entered");
});

module.exports = router;
