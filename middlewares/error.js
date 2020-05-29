const winston = require("winston");

module.exports = function (err, req, res, next) {
  //Log the error to a file or database
  winston.error(err.message, err);
  res.status(500).send("Some Error Occured");
};
