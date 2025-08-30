const db = require("../config/database");
const { comparePasswords } = require("../utils/hash.util");

const isAdmin = async (req, res, next) => {
  console.log("req comes to admin midd");

  if (!req.user) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  console.log("req.user exists");

  try {
    const user = await db("users").where({ id: req.user.id }).first();
    console.log("user found", user);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (["admin", "system_admin"].includes(user.role)) {
      req.user.role = user.role;
      return next();
    }

    return res.status(403).json({ error: "Forbidden: Admins only" });
  } catch (err) {
    console.error("Error checking admin role:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const isSystemAdmin = async (req, res, next) => {
  console.log("req comes to system_admin midd");

  if (!req.user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const user = await db("users").where({ id: req.user.id }).first();

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (user.role === "system_admin") {
      req.user.role = user.role;
      return next();
    }

    return res.status(403).json({ error: "Forbidden: System Admins only" });
  } catch (err) {
    console.error("Error checking system_admin role:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

async function verifyPassword(req, res, next) {
  try {
    const userId = req.user.id;
    const { password } = req.body;

    const user = await db("users").where({ id: userId }).first();
    if (!user) return res.status(401).json({ error: "User not found" });

    const valid = await comparePasswords(password, user.password_hash);
    if (!valid) return res.status(403).json({ error: "Invalid password" });

    next();
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
}

module.exports = { isAdmin, isSystemAdmin, verifyPassword };
