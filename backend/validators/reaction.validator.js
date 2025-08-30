const Joi = require("joi");

const allowedReactions = ["like", "dislike"];

const reactionSchema = Joi.object({
  store_id: Joi.number().integer().required(),
  user_id: Joi.number().integer().required(),
});

module.exports = { reactionSchema };
