const db = require("../config/database");

async function createOrUpdateSignupOtp(data) {
  const existing = await db("email_verifications")
    .where({ email: data.email })
    .first();
  if (existing) {
    return db("email_verifications").where({ email: data.email }).update(data);
  }
  return db("email_verifications").insert(data);
}

async function findByEmail(email) {
  return db("email_verifications").where({ email }).first();
}

async function deleteByEmail(email) {
  return db("email_verifications").where({ email }).del();
}

module.exports = { createOrUpdateSignupOtp, findByEmail, deleteByEmail };
