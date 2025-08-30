// user.routes.js
const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const storeController = require("../controllers/store.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const {
  isAdmin,
  isSystemAdmin,
  verifyPassword,
} = require("../middlewares/checkAdmin");

router.get("/stores", authMiddleware, isAdmin, storeController.listStores);

router.get("/:id", authMiddleware, isAdmin, userController.getUserDetail);

router.get("/", authMiddleware, isAdmin, userController.getAllUsers);

router.delete(
  "/stores/:id",
  authMiddleware,
  isAdmin,
  verifyPassword,
  userController.DeleteStore
);

router.delete(
  "/:id",
  authMiddleware,
  isAdmin,
  verifyPassword,
  userController.deleteUser
);

router.put(
  "/:id/make-admin",
  authMiddleware,
  isSystemAdmin,
  verifyPassword,
  userController.makeAdmin
);

router.put(
  "/:id/remove-admin",
  authMiddleware,
  isSystemAdmin,
  verifyPassword,
  userController.removeAdmin
);

module.exports = router;
