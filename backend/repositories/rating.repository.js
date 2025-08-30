const db = require("../config/database");

async function submitRating(store_id, user_id, rating, review) {
  await db("ratings")
    .insert({ user_id, store_id, rating, review })
    .onConflict(["user_id", "store_id"])
    .merge();

  const avg = await db("ratings")
    .where({ store_id })
    .avg("rating as avg")
    .first();

  return { averageRating: parseFloat(avg.avg) || 0 };
}

async function getUserRatingForStore(userId, storeId) {
  return db("ratings").where({ user_id: userId, store_id: storeId }).first();
}

async function getAverageRatingForStore(storeId) {
  const result = await db("ratings")
    .where({ store_id: storeId })
    .avg("rating as avg_rating")
    .first();
  const avgClean = parseFloat(result.avg_rating) || 0;
  return Number.isInteger(avgClean)
    ? avgClean
    : parseFloat(avgClean.toFixed(1));
}

async function getRatingsForStore(storeId) {
  return db("ratings").where({ store_id: storeId }).select("*");
}

module.exports = {
  submitRating,
  getUserRatingForStore,
  getAverageRatingForStore,
  getRatingsForStore,
};
