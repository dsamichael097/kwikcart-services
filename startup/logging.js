const winston = require("winston");
require("winston-mongodb");
require("express-async-errors");

module.exports = function () {
  winston.handleExceptions(
    new winston.transports.File({ filename: "uncaughtExceptions.log" })
  );

  process.on("unhandledRejection", (err) => {
    throw err;
  });

  winston.add(winston.transports.File, { filename: "logFile.log" });
  winston.add(winston.transports.MongoDB, {
    db: "mongodb://localhost:27017/kwikcart",
    level: "info",
  });
};
