const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  img: { type: String, required: true },
  numberInStock: { type: Number, min: 0, required: true },
  price: { type: Number, min: 0, required: true },
});

const Product = mongoose.model("Product", productSchema);

function validateProductSchema(product) {
  const schema = Joi.object({
    name: Joi.string().required(),
    numberInStock: Joi.Number(),
    img: Joi.string(),
    price: Joi.Number(),
  });
  return schema.validate(product);
}

exports.Product = Product;
exports.validateProductSchema = validateProductSchema;
