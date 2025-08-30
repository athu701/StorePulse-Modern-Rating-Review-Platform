const userRepo = require("../repositories/user.repository");
const { hashPassword, comparePasswords } = require("../utils/hash.util");
const { generateToken } = require("../utils/token.util");

const allowedRoles = ["system_admin", "normal_user", "store_owner"];

async function signup({
  name,
  username,
  email,
  address,
  password,
  image_url,
  role = "normal_user",
}) {
  if (!allowedRoles.includes(role)) throw new Error("Invalid user role");

  const existingUser = await userRepo.findByEmail(email);
  if (existingUser) throw new Error("Email already registered");

  const existingName = await userRepo.findByUsername(username);
  if (existingName) throw new Error("Username already registered");

  const password_hash = await hashPassword(password);

  const user = await userRepo.createUser({
    name,
    username,
    email,
    password_hash,
    address,
    image_url,
    role,
  });

  const token = generateToken({ id: user.id, role: user.role });

  return { user, token, message: "User created successfully" };
}

async function login({ email, password }) {
  const user = await userRepo.findByEmail(email);
  if (!user) throw new Error("Invalid credentials");
  const hashed = await hashPassword(password.trim());
  if (hashed == user.password_hash) console.log("match pass");
  else console.log("not match");
  const valid = await comparePasswords(password, user.password_hash);

  if (!valid) throw new Error("Invalid credentials");
  else console.log("service + compass" + user);

  const token = generateToken({ id: user.id, role: user.role });

  return { user, token };
}

async function updatePassword(userId, newPassword) {
  const password_hash = await hashPassword(newPassword);
  await userRepo.updatePassword(userId, password_hash);
}

module.exports = { signup, login, updatePassword };
