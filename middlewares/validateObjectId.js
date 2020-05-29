const ObjectId = require("mongoose").Types.ObjectId;

module.exports = function (id) {
  ObjectId.isValid(id)
    ? String(new ObjectId(id) === id)
      ? true
      : false
    : false;
};
