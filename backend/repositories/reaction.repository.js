const db = require("../config/database");

async function addOrUpdateReaction(userId, storeId, reaction) {
  const existing = await db("store_reactions")
    .where({ user_id: userId, store_id: storeId })
    .first();
  if (existing) {
    return db("store_reactions")
      .where({ id: existing.id })
      .update({ reaction, created_at: db.fn.now() });
  } else {
    return db("store_reactions").insert({
      user_id: userId,
      store_id: storeId,
      reaction,
      created_at: db.fn.now(),
    });
  }
}

async function getReactionsForStore(storeId) {
  return db("store_reactions").where({ store_id: storeId }).select("*");
}

async function getUserReaction(userId, storeId) {
  return db("store_reactions")
    .where({ user_id: userId, store_id: storeId })
    .first();
}

module.exports = { addOrUpdateReaction, getReactionsForStore, getUserReaction };
