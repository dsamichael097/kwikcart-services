const express = require("express");
const router = express.Router();
const { Session } = require("../models/session");
const { User } = require("../models/user");
const { Product } = require("../models/product");
const validateSessionId = require("../middlewares/validateSessionId");
const validateObjectId = require("../middlewares/validateObjectId");
const { validateCartSchema } = require("../models/cart");

router.get("/:sessionId", validateSessionId, async (req, res) => {
  const session = await Session.findById(req.params.id);
  if (!session) return res.status(404).send("Session Does Not Exist");

  res.status(200).send(session.cart);
});

router.post("/:sessionId", validateSessionId, async (req, res) => {
  const session = await Session.findById(req.params.id);
  if (!session) return res.status(404).send("Session Does Not Exist");

  if (session.cart.length === 0)
    return res.status(400).send("No products Selected for order to be placed");

  const orders = [];
  for (let product of session.cart) {
    product.delete(productId);
    product.totalPrice = product.qty * product.price;
    orders.push(product);
  }

  const user = new User({
    phone: req.body.phone,
  });

  user.orders.push(...orders);
  await user.save();

  await Session.findByIdAndDelete(session._id);

  return res.status(200).send("Order Placed Successfully");
});

router.put("/:sessionId", validateSessionId, async (req, res) => {
  const session = await Session.findById(req.params.sessionId);
  if (!session) return res.status(404).send("Session Does Not Exist");

  const { error } = validateCartSchema(req.body);
  if (error) return res.status(400).send("No such product Exists");

  //Write the logic to update product qty in cart
  const index = session.cart.findIndex(
    (p) => p.productId == req.body.productId
  );

  if (index === -1) return res.status(400).send("No such item exists in cart");

  const qtyToUpdate = session.cart[index].qty - req.body.qty;
  if (qtyToUpdate < 0) {
    if (product.numberInStock < qtyToUpdate * -1)
      return res.status(400).send("Lower the Quantity of Products Ordered");
  }
  session.cart[index].qty = req.body.qty;

  await session.save();
  await Product.updateOne(
    { _id: req.body.productId },
    { $inc: { numberInStock: qtyToUpdate } }
  );
});

router.delete("/:sessionId", validateSessionId, async (req, res) => {
  const validProductId = validateObjectId(req.body.productId);
  if (!validProductId) return res.status(400).send("No such product exists");

  const session = Session.findById(req.params.sessionId);
  if (!session) return res.status(404).send("Invalid Session");

  const index = session.cart.findIndex(
    (p) => p.productId == req.body.productId
  );

  if (index === -1) return res.status(400).send("No such item exists in cart");

  const qty = session.cart[index].qty;
  session.cart.splice(index, 1);

  await session.save();
  await Product.findByIdAndUpdate(req.body.productId, {
    $inc: { numberInStock: qty },
  });

  return res.status(200).send("Item deleted Successfully");
});

module.exports = router;
