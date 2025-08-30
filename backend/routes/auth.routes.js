const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const upload = require("../middlewares/upload");

router.post("/signup", upload.single("image"), authController.signup);
router.post("/verify-otp", authController.verifyOtp);
router.post("/login", authController.login);
router.post("/logout", authController.logout);
router.put("/change-password", authMiddleware, authController.updatePassword);
router.get("/profile", authMiddleware, authController.profiles);
router.delete("/:id", authMiddleware, authController.DeleteUser);
router.get("/users/:id", authMiddleware, authController.getProfile);
router.post("/:id/delete", authMiddleware, authController.verifyPassword);

router.put(
  "/users/update",
  authMiddleware,
  upload.single("image"),
  authController.updateProfile
);

module.exports = router;
