const express = require("express");
const cors = require("cors");
const cart = require("../routes/cart");
const products = require("../routes/products");
const orders = require("../routes/orders");
const otp = require("../routes/otp");
// const returns = require("../routes/returns");
// const customers = require("../routes/customers");
// const auth = require("../routes/auth");
// const users = require("../routes/users");
const error = require("../middlewares/error");

module.exports = function (app) {
  app.use(cors());
  app.use(express.json());

  app.use("/api/cart", cart);
  app.use("/api/products", products);
  app.use("/api/orders", orders);
  app.use("/api/otp", otp);
  // app.use("/api/returns", returns);
  // app.use("/api/users", users);
  // app.use("/api/auth", auth);

  // We use this middleware which is called the express error middleware to
  // log and handle internal server errors, whenever a client sends a request
  // And send him an error response. The parameter 'error' is a function reference
  // defined in middlewares/error.js
  app.use(error);
};
