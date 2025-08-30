const express = require("express");
const router = express.Router();

const ratingController = require("../controllers/rating.controller");
const authMiddleware = require("../middlewares/auth.middleware");

router.post("/", authMiddleware, ratingController.submitRating);
router.put("/:id", authMiddleware, ratingController.editReview);
router.delete("/:id", authMiddleware, ratingController.deletereview);
router.get("/:storeId/user", authMiddleware, ratingController.getUserRating);
router.get("/:storeId/average", ratingController.getAvgRating);
router.get("/stores/:id", ratingController.getStoreReviews);
router.post("/:id/reply", authMiddleware, ratingController.addreply);

module.exports = router;
