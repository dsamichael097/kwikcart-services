const express = require("express");
const router = express.Router();
const CartController = require("../controllers/cart");

router.get("/", CartController.createEntrySession);
router.post("/:sessionId", CartController.addProductToCart);
router.get("/:sessionId", CartController.populateCart);
router.put("/:sessionId", CartController.updateProductInCart);
router.delete("/:sessionId", CartController.deleteProductFromCart);

module.exports = router;
