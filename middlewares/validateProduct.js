const validateObjectId = require("./validateObjectId");

module.exports = function (req, res, next) {
  const validId = validateObjectId(req.params.productId);
  if (!validId) return res.status(404).send("Product does not exist");
  next();
};
