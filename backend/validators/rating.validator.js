const Joi = require("joi");

const ratingSchema = Joi.object({
  store_id: Joi.number().integer().required(),
  rating: Joi.number().min(1).max(5).required(),
});

module.exports = { ratingSchema };
