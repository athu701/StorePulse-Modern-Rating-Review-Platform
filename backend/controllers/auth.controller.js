const authService = require("../services/auth.service");
const userRepo = require("../repositories/user.repository");
const {
  signupSchema,
  loginSchema,
  verifyOtpSchema,
  updatePasswordSchema,
} = require("../validators/auth.validator");
const db = require("../config/database");
const { hashPassword, comparePasswords } = require("../utils/hash.util");

const cloudinary = require("../config/cloudinary");
const multer = require("multer");
const streamifier = require("streamifier");

const upload = multer({ storage: multer.memoryStorage() });

async function signup(req, res) {
  try {
    const { name, username, email, address, password, role } =
      await signupSchema.validateAsync(req.body);

    let image_url;
    if (req.file) {
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "user_profiles" },
          (error, result) => (error ? reject(error) : resolve(result))
        );
        streamifier.createReadStream(req.file.buffer).pipe(stream);
      });
      image_url = result.secure_url;
    } else {
      image_url =
        "https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?semt=ais_hybrid&w=740&q=80";
    }

    const { user, token, message } = await authService.signup({
      name,
      username,
      email,
      address,
      password,
      role,
      image_url,
    });

    res.cookie("authToken", token, {
      httpOnly: true,
      maxAge: 7 * 24 * 3600 * 1000,
      sameSite: "lax",
      secure: false,
    });

    return res.status(201).json({ user, message });
  } catch (err) {
    console.error("Signup failed:", err);

    return res.status(400).json({
      message: err.message || "Signup failed. Please try again.",
    });
  }
}

async function verifyOtp(req, res) {
  try {
    const data = await verifyOtpSchema.validateAsync(req.body);

    const result = await authService.verifyOtp(data.email, data.otp);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

async function login(req, res) {
  try {
    const data = await loginSchema.validateAsync(req.body);
    const { user, token } = await authService.login(data);

    res.cookie("authToken", token, {
      httpOnly: true,
      maxAge: 7 * 24 * 3600 * 1000,
      sameSite: "lax",
      secure: false,
    });
    console.log("cookie SendmailTransport");
    res.json({ user });
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
}

async function updatePassword(req, res) {
  try {
    const { error } = updatePasswordSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { currentPassword, newPassword } = req.body;

    const user = await db("users").where({ id: req.user.id }).first();
    if (!user) return res.status(404).json({ error: "User not found" });

    const isMatch = await comparePasswords(currentPassword, user.password_hash);
    if (!isMatch) {
      return res.status(400).json({ error: "Current password is incorrect" });
    }

    const hashedPassword = await hashPassword(newPassword);

    await db("users")
      .where({ id: req.user.id })
      .update({ password_hash: hashedPassword });

    console.log("Password updated for user:", req.user.id);
    res.json({ message: "Password changed successfully" });
  } catch (err) {
    console.error("Password change failed", err);
    res.status(500).json({ error: "Server error while changing password" });
  }
}

async function profiles(req, res) {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    console.log("hello", req.user.id);
    let user_username = await userRepo.findUsernameById(req.user.id);
    console.log("name", user_username);
    res.json({
      user: { id: req.user.id, role: req.user.role, username: user_username },
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

async function getProfile(req, res) {
  try {
    const user = await db("users")
      .select(
        "id",
        "name",
        "username",
        "email",
        "address",
        "image_url",
        "created_at"
      )
      .where({ id: req.user.id })
      .first();

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const hasStore = await db("stores")
      .where({ owner_id: req.user.id })
      .first();

    console.log("pro go", user, "hasStore:", !!hasStore);

    res.json({
      user: {
        ...user,
        hasStore: !!hasStore,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
}

async function updateProfile(req, res) {
  try {
    console.log("in update profile", req.user.id);
    const { name, username, email, address } = req.body;

    const user = await db("users").where({ id: req.user.id }).first();
    if (!user) return res.status(404).json({ error: "User not found" });

    if (username && username !== user.username) {
      const usernameExists = await db("users")
        .where("username", username)
        .andWhereNot("id", req.user.id)
        .first();
      if (usernameExists)
        return res.status(400).json({ error: "Username already taken" });
    }

    if (email && email !== user.email) {
      const emailExists = await db("users")
        .where("email", email)
        .andWhereNot("id", req.user.id)
        .first();
      if (emailExists)
        return res.status(400).json({ error: "Email already registered" });
    }

    let image_url = user.image_url;
    if (req.file) {
      const uploadResult = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "user_profiles" },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        );
        streamifier.createReadStream(req.file.buffer).pipe(stream);
      });
      image_url = uploadResult.secure_url;
    }

    const updatedData = {
      name: name ?? user.name,
      username: username ?? user.username,
      email: email ?? user.email,
      address: address ?? user.address,
      image_url,
      updated_at: new Date(),
    };

    await db("users").where({ id: req.user.id }).update(updatedData);

    const updatedUser = await db("users")
      .select(
        "id",
        "name",
        "username",
        "email",
        "address",
        "image_url",
        "created_at",
        "updated_at"
      )
      .where({ id: req.user.id })
      .first();

    return res.json({ user: updatedUser });
  } catch (err) {
    console.error("Update failed", err);
    return res.status(500).json({ error: "Update failed" });
  }
}
async function verifyPassword(req, res) {
  const { id } = req.params;
  let { password } = req.body;

  if (!password) {
    return res.status(400).json({ message: "Password is required" });
  }

  try {
    const user = await db("users").where({ id }).first();
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.password_hash) {
      return res.status(500).json({ message: "User has no password set" });
    }

    const match = await comparePasswords(password, user.password_hash);

    if (!match) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    return res.status(200).json({ message: "Password verified" });
  } catch (err) {
    console.error("verifyPassword error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

async function DeleteUser(req, res) {
  const userId = parseInt(req.params.id);

  if (!userId) {
    return res.status(400).json({ message: "User ID is required" });
  }

  try {
    const user = await db("users").where({ id: userId }).first();
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await db("users").where({ id: userId }).del();

    res.clearCookie("authToken", {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
    });

    return res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    console.error("DeleteUser error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

function logout(req, res) {
  res.clearCookie("authToken");
  res.json({ message: "Logged out" });
}

module.exports = {
  signup,
  upload,
  verifyOtp,
  login,
  updatePassword,
  profiles,
  getProfile,
  updateProfile,
  logout,
  verifyPassword,
  DeleteUser,
};
