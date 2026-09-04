const express = require("express");
const router = express.Router();
const {
  getMyProducts,
  createMyProduct,
  updateMyProduct,
  deleteMyProduct,
  getSellerSummary,
} = require("../controllers/sellerController");
const { getSellerOrders, updateOrderItemDelivered } = require("../controllers/orderController");
const { protect, seller } = require("../middleware/authMiddleware");

// Every route here requires the user to be logged in AND be a seller (or admin)
router.use(protect, seller);

router.route("/summary").get(getSellerSummary);

router.route("/products").get(getMyProducts).post(createMyProduct);
router.route("/products/:id").put(updateMyProduct).delete(deleteMyProduct);

router.route("/orders").get(getSellerOrders);
router.route("/orders/:id/items/:itemId/deliver").put(updateOrderItemDelivered);

module.exports = router;
