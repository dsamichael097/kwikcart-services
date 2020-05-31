const validateObjectId = require("./validateObjectId");

module.exports = function (req, res, next) {
  const validId = validateObjectId(req.params.sessionId);
  if (!validId) return res.status(404).send("Session does not exist");
  next();
};
