const ratingRepo = require("../repositories/rating.repository");
const db = require("../config/database");

async function submitRating(store_id, user_id, rating, review) {
  if (rating < 1 || rating > 5)
    throw new Error("Rating must be between 1 and 5");

  return await ratingRepo.submitRating(store_id, user_id, rating, review);
}

module.exports = { submitRating };

async function getUserRating(userId, storeId) {
  return ratingRepo.getUserRatingForStore(userId, storeId);
}

async function getAvgRating(storeId) {
  return ratingRepo.getAverageRatingForStore(storeId);
}

async function getStoreRatings(storeId) {
  return ratingRepo.getRatingsForStore(storeId);
}

async function getReviewsAndRatingsByStoreId(storeId) {
  console.log("req come to ratingservice", storeId);

  const rows = await db("ratings as r")
    .join("users as u", "r.user_id", "u.id")
    .join("stores as s", "r.store_id", "s.id")
    .select(
      "r.id",
      "r.user_id",
      "r.store_id",
      "r.rating",
      "r.review",
      "r.parent_review_id",
      "r.created_at",
      "u.username",
      "u.image_url",
      "s.owner_id as storeOwnerId"
    )
    .where("r.store_id", storeId)
    .orderBy("r.created_at", "desc");

  const reviews = rows.filter((r) => r.parent_review_id === null);
  const replies = rows.filter((r) => r.parent_review_id !== null);

  reviews.forEach((review) => {
    review.replies = replies.filter(
      (rep) => rep.parent_review_id === review.id
    );
  });

  const avgResult = await db("ratings")
    .where({ store_id: storeId })
    .whereNull("parent_review_id")
    .avg("rating as avg")
    .first();

  return {
    reviews,
    averageRating: parseFloat(avgResult?.avg) || 0,
  };
}

module.exports = {
  submitRating,
  getUserRating,
  getAvgRating,
  getStoreRatings,
  getReviewsAndRatingsByStoreId,
};
