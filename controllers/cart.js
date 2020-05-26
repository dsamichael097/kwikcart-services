const mongoose = require("mongoose");
const _ = require("lodash");
const { Session } = require("../models/session");
const { Product } = require("../models/product");
const {
  Cart,
  validateObjectId,
  validateCartSchema,
} = require("../models/cart");

exports.createEntrySession = async (req, res, next) => {
  const session = new Session();

  await session.save();
  res.status(200).send(_.pick(session, ["_id"]));
};

exports.addProductToCart = async (req, res) => {
  const { error: sessionError } = validateObjectId(
    { objectId: req.params.sessionId },
    "SessionID"
  );
  if (sessionError)
    return res.status(404).send(sessionError.details[0].message);

  //Check req.body with @hapi/joi over here.
  let { error: productError } = validateObjectId(
    { objectId: req.body.productId },
    "ProductID"
  );
  if (productError)
    return res.status(400).send(productError.details[0].message);

  //Check if product id is a valid product id
  const product = await Product.findById(req.body.productId);
  if (!product) return res.status(400).send("Invalid Product");

  if (product.numberInStock === 0)
    return res.status(400).send("Product not in stock");

  //product = {_id: req.body.productId, qty: req.body.qty};
  const session = await Session.findById(sessionId);
  if (!session) return res.status(404).send("Invalid Session ID");

  const index = session.cart.findIndex(
    (p) => p.productId == req.body.productId
  );
  //return res.status(200).send("Index is " + index);
  if (index !== -1) return res.status(400).send("Product already in cart");

  const cartProduct = new Cart({
    productId: req.body.productId,
    img: product.img,
    qty: 1,
    price: product.price,
    name: product.name,
  });

  session.cart.push(cartProduct);
  await session.save();
  await Product.updateOne(
    { _id: req.body.productId },
    { $inc: { numberInStock: -1 } }
  );
  res.status(200).send(session);
};

exports.populateCart = async (req, res) => {
  const { error: sessionError } = validateObjectId(
    { objectId: req.params.sessionId },
    "SessionID"
  );
  if (sessionError)
    return res.status(404).send(sessionError.details[0].message);

  const session = await Session.findById(sessionId);
  if (!session) return res.status(404).send("Session does not exist");

  return res.status(200).send(session.cart);
};

exports.updateProductInCart = async (req, res) => {
  const { error: sessionError } = validateObjectId(
    { objectId: req.params.sessionId },
    "SessionID"
  );
  if (sessionError)
    return res.status(404).send(sessionError.details[0].message);

  //Check req.body with @hapi/joi over here.
  const { error } = validateCartSchema(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  //Check if product id is a valid product id
  let product = await Product.findById(req.body.productId);
  if (!product) return res.status(400).send("Invalid Product");

  //product = {_id: req.body.productId, qty: req.body.qty};
  const session = await Session.findById(sessionId);
  if (!session) return res.status(404).send("Invalid Session ID");

  const index = session.cart.findIndex(
    (p) => p.productId == req.body.productId
  );

  if (index === -1) return res.status(400).send("Invalid Product ID");

  const qtyToUpdate = session.cart[index].qty - req.body.qty;
  if (qtyToUpdate < 0) {
    if (product.numberInStock < qtyToUpdate * -1)
      return res.status(400).send("More product ordered than available");
  }
  session.cart[index].qty = req.body.qty;

  await session.save();
  await Product.updateOne(
    { _id: req.body.productId },
    { $inc: { numberInStock: qtyToUpdate } }
  );

  res.status(200).send(session);
};

exports.deleteProductFromCart = async (req, res) => {
  const { error: sessionError } = validateObjectId(
    { objectId: req.params.sessionId },
    "SessionID"
  );
  if (sessionError)
    return res.status(404).send(sessionError.details[0].message);

  //Check req.body with @hapi/joi over here
  const { error } = validateCartSchema(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  //Check if product id is a valid product id
  let product = await Product.findById(req.body.productId);
  if (!product) return res.status(400).send("Invalid Product");

  //product = {_id: req.body.productId, qty: req.body.qty};
  const session = await Session.findById(sessionId);
  if (!session) return res.status(404).send("Invalid Session ID");

  const index = session.cart.findIndex(
    (p) => p.productId == req.body.productId
  );

  if (index === -1) return res.status(400).send("Invalid Product ID");

  session.cart.splice(index, 1);

  await session.save();
  await Product.findByIdAndUpdate(req.body.productId, {
    $inc: { numberInStock: req.body.qty },
  });

  return res.status(200).send(session);
};
