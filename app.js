const express = require("express");
const mongoose = require("mongoose");
const Fawn = require("fawn");
const userRoutes = require("./routes/cartRoutes");
const Joi = require("@hapi/joi");
Joi.objectId = require("joi-objectid")(Joi);
//const productRoutes = require('./routes/productRoutes')
//const orderRoutes = require('./routes/orderRoutes')
const cors = require("cors");
const app = express();
require("express-async-errors");

app.use(cors());
app.use(express.json());

// MongoDB Connection Initialization
mongoose
  .connect("mongodb://localhost:27017/kwikcart", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log("Some error occured"));

// //Code to remove records after certain time, i.e 1.5 hrs
// function removeInactiveSessions(){
//   console.log("I'll remove Inactive Sessions");
//   var ref = admin.database().ref('/cart/');
//   var now = Date.now();
//   var cutoff = now - 2 * 60 * 60 * 1000;
//   var d1 = new Date(cutoff);
//   console.log(d1.toLocaleString());
//   var old = ref.orderByChild('timestamp').endAt(d1.toLocaleString()).limitToLast(1);
//   var listener = old.once('child_added', function(snapshot) {
//     snapshot.ref.remove();
//   });
// }

// setInterval(() => removeInactiveSessions(), 7200000);

Fawn.init(mongoose);
//Common Route for All Users
app.use("/api/cart", userRoutes);
//app.use("/api/product",productRoutes);
//app.use("/api/order",orderRoutes);

app.use((err, req, res, next) => {
  console.error("ERROR : ", err);
  res.status(500).send("Some Error Occured");
  //next(err);
});

app.listen(process.env.PORT || 4500, () => {
  console.log("Server staretd on port 4500");
});
