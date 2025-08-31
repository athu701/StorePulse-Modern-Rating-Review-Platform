const ratingService = require("../services/rating.service");
const { ratingSchema } = require("../validators/rating.validator");
const knex = require("../config/database");
const db = require("../config/database");

async function submitRating(req, res) {
  try {
    const { store_id, rating, review } = req.body;
    const user_id = req.user.id;
    const existing = await db("ratings")
      .where({ user_id, store_id })
      .whereNull("parent_review_id")
      .first();

    let result;
    if (existing) {
      [result] = await db("ratings")
        .where({ id: existing.id })
        .update({ rating, review, updated_at: new Date() })
        .returning("*");
    } else {
      [result] = await db("ratings")
        .insert({ user_id, store_id, rating, review })
        .returning("*");
    }

    const avg = await db("ratings")
      .where({ store_id })
      .whereNull("parent_review_id")
      .avg("rating as avg")
      .first();

    res.json({
      success: true,
      review: result,
      averageRating: Number(avg.avg) || 0,
    });
  } catch (err) {
    console.error("submitRating error:", err);
    res.status(400).json({ error: err.message });
  }
}

async function getUserRating(req, res) {
  try {
    const storeId = parseInt(req.params.storeId);
    const userId = req.user.id;
    const rating = await ratingService.getUserRating(userId, storeId);
    res.json(rating);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

async function getAvgRating(req, res) {
  try {
    const storeId = parseInt(req.params.storeId);
    const avg = await ratingService.getAvgRating(storeId);
    console.log("from avg", avg);
    res.json(avg);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

async function getStoreReviews(req, res) {
  const storeId = parseInt(req.params.id);
  try {
    const { reviews, averageRating } =
      await ratingService.getReviewsAndRatingsByStoreId(storeId);
    res.json({ reviews, averageRating });
  } catch (err) {
    console.error("❌ Error in getStoreReviews:", err);
    res.status(500).json({ error: "Failed to fetch reviews" });
  }
}

async function addreply(req, res) {
  console.log("req to reply comes");
  const parentId = req.params.id;
  const { userId, storeId, review, rating } = req.body;
  console.log("in try block enter");
  try {
    let finalStoreId = storeId;
    console.log("in try block enter", finalStoreId);

    if (!finalStoreId) {
      const parentReview = await knex("ratings")
        .where({ id: parentId })
        .first();
      if (!parentReview) {
        return res.status(404).json({ error: "Parent review not found" });
      }
      finalStoreId = parentReview.store_id;
    }

    const [reply] = await knex("ratings")
      .insert({
        user_id: userId,
        store_id: finalStoreId,
        rating: rating || 0,
        review,
        parent_review_id: parentId,
      })
      .returning("*");
    console.log("reply saved",reply);

    const user = await knex("users").where({ id: userId }).first();

    res.json({
      ...reply,
      username: user.username,
      image_url: user.image_url || "/default-user.png",
    });
  } catch (err) {
    console.error("Failed to add reply:", err);
    res.status(500).json({ error: "Failed to add reply" });
  }
}

async function editReview(req, res) {
  console.log("req comes to edit");
  try {
    const reviewId = parseInt(req.params.id);
    const { review } = req.body;
    const userId = req.user.id;

    if (!review || review.trim() === "") {
      return res
        .status(400)
        .json({ message: "Review content cannot be empty" });
    }

    const existing = await db("ratings").where({ id: reviewId }).first();
    if (!existing) {
      return res.status(404).json({ message: "Review not found" });
    }

    if (existing.user_id !== userId) {
      return res
        .status(403)
        .json({ message: "You are not authorized to edit this review" });
    }

    const [updated] = await db("ratings")
      .where({ id: reviewId })
      .update({ review, updated_at: new Date() })
      .returning("*");

    return res.status(200).json(updated);
  } catch (err) {
    console.error("editReview error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

async function deletereview(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const existing = await db("ratings").where({ id, user_id: userId }).first();
    if (!existing) {
      return res
        .status(404)
        .json({ message: "Review not found or not authorized" });
    }

    await db("ratings").where({ id }).orWhere({ parent_review_id: id }).del();

    return res.status(200).json({ success: true, message: "Review deleted" });
  } catch (error) {
    console.error("deleteReview error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = {
  submitRating,
  getUserRating,
  getAvgRating,
  getStoreReviews,
  addreply,
  editReview,
  deletereview,
};
