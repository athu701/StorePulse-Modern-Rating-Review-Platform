const express = require("express");
const router = express.Router();

const storeController = require("../controllers/store.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const validateMiddleware = require("../middlewares/validate.middleware");
const upload = require("../middlewares/upload");

router.get("/user/:id", storeController.listStores);
router.post(
  "/create-Store",
  authMiddleware,
  upload.single("image"),
  storeController.createStore
);
router.post(
  "/:id/delete",
  authMiddleware,
  storeController.verifyStoreOwnerPassword
);
router.get("/:id/reviews", storeController.getreviews);
router.delete("/:id", authMiddleware, storeController.DeleteStore);
router.get("/:id", storeController.getinfo);
router.put(
  "/:id",
  authMiddleware,
  upload.single("image"),
  storeController.updateStore
);
router.get("/", storeController.listStores);

module.exports = router;
