const express = require("express");
const router = express.Router();

const reactionController = require("../controllers/reaction.controller");
const authMiddleware = require("../middlewares/auth.middleware");

router.post("/:storeId", authMiddleware, reactionController.submitReaction);
router.get(
  "/:storeId/user",
  authMiddleware,
  reactionController.getUserReaction
);

module.exports = router;
