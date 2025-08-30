const reactionService = require("../services/reaction.service");
const { reactionSchema } = require("../validators/reaction.validator");
const db = require("../config/database");

async function submitReaction(req, res) {
  const userId = req.user.id;
  const storeId = parseInt(req.params.storeId);

  if (!storeId) return res.status(400).json({ error: "Invalid store ID" });

  try {
    const existing = await db("store_reactions")
      .where({ user_id: userId, store_id: storeId })
      .first();

    if (!existing) {
      await db("store_reactions").insert({
        user_id: userId,
        store_id: storeId,
        reaction: "like",
      });
      return res.json({ message: "Liked", reaction: "like" });
    } else {
      const newReaction = existing.reaction === "like" ? "dislike" : "like";
      await db("store_reactions")
        .where({ user_id: userId, store_id: storeId })
        .update({ reaction: newReaction, created_at: db.fn.now() });

      return res.json({
        message: `Reaction updated to ${newReaction}`,
        reaction: newReaction,
      });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to toggle reaction" });
  }
}

async function getUserReaction(req, res) {
  try {
    const storeId = parseInt(req.params.storeId);
    const userId = req.user.id;
    const reaction = await reactionService.getUserReaction(userId, storeId);
    res.json(reaction || {});
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

module.exports = { submitReaction, getUserReaction };
