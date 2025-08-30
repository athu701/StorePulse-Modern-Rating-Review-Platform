const Joi = require("joi");

const storeSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().optional(),
  address: Joi.string().max(400).optional(),
  description: Joi.string().optional().allow(""),
  image_url: Joi.string().uri().optional(),
  owner_id: Joi.number().integer().optional(),
});

const storeFilterSchema = Joi.object({
  name: Joi.string().optional(),
  address: Joi.string().optional(),
});

module.exports = { storeSchema, storeFilterSchema };
