const mongoose = require("mongoose");
const Joi = require("@hapi/joi");

const cartSchema = new mongoose.Schema(
  {
    productId: { type: mongoose.Types.ObjectId, required: true },
    img: { type: String, required: true },
    price: { type: Number, required: true },
    qty: { type: Number, required: true, default: 1 },
    name: { type: String, required: true },
  },
  { _id: false }
);

const Cart = mongoose.model("cart", cartSchema);

function validateCartSchema(product) {
  const schema = Joi.object({
    productId: Joi.objectId().required(),
    qty: Joi.Number(),
  });
  return schema.validate(product);
}

exports.Cart = Cart;
exports.cartSchema = cartSchema;
exports.validateCartSchema = validateCartSchema;
