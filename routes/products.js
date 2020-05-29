const express = require("express");
const router = express.Router();
const { Product, validateProduct } = require("../models/product");
const validateProduct = require("../middlewares/validateProduct");

router.get("", async (req, res) => {
  const products = await Product.find();
  return res.status(200).send(products);
});

router.get("/:productId", validateProduct, async (req, res) => {
  const product = await Product.findById(req.params.productId);
  if (!product) return res.status(404).send("Product does not exist");

  return res.status(200).send(product);
});

router.post("/", async (req, res) => {
  const { error } = validateProduct(req.body);
  if (error) return res.status(400).send("Invalid Product Details");

  const product = new Product(req.body);
  await product.save();
  res.status(200).send(product);
});

router.put("/:productId", validateProduct, async (req, res) => {
  const { error } = validateProduct(req.body);
  if (error) return res.status(400).send("Invalid Product Details");

  const product = await Product.findByIdAndUpdate(
    req.params.productId,
    req.body
  );
  if (!product) return res.status(404).send("Product does not exist");

  return res.status(200).send(product);
});

router.delete("/:productId", validateProduct, async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.productId);
  if (!product) return res.status(404).send("Product does not exist");

  return res.status(200).send(product);
});

module.exports = router;
