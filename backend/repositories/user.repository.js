const db = require("../config/database");

async function findByEmail(email) {
  return await db("users").where({ email }).first();
}

async function findByUsername(username) {
  return await db("users").where({ username }).first();
}

async function findUsernameById(userId) {
  const user = await db("users").where({ id: userId }).first();
  return user ? user.username : null;
}

async function findById(userId) {
  return await db("users").where({ id: userId }).first();
}

async function createUser(user) {
  const [createdUser] = await db("users")
    .insert(user)
    .returning(["id", "name", "email", "address", "role"]);
  return createdUser;
}

async function updatePassword(id, passwordHash) {
  return await db("users")
    .where({ id })
    .update({ password_hash: passwordHash, updated_at: db.fn.now() });
}

module.exports = {
  findByEmail,
  findByUsername,
  findUsernameById,
  findById,
  createUser,
  updatePassword,
};
