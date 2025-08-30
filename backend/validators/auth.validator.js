const Joi = require("joi");

const allowedRoles = ["system_admin", "normal_user", "store_owner"];

const signupSchema = Joi.object({
  name: Joi.string().min(1).max(60).required(),
  username: Joi.string().min(1).max(60).required(),
  email: Joi.string().email().required(),
  address: Joi.string().max(400).required(),
  image_url: Joi.string().min(0),
  password: Joi.string()
    .min(8)
    .max(16)
    .pattern(new RegExp("^(?=.*[A-Z])(?=.*[!@#$%^&*])"))
    .required()
    .messages({
      "string.pattern.base":
        "Password must include at least one uppercase letter and one special character.",
    }),
  role: Joi.string()
    .valid(...allowedRoles)
    .default("normal_user"),
});

const updatePasswordSchema = Joi.object({
  currentPassword: Joi.string().required().messages({
    "string.empty": "Current password is required",
  }),
  newPassword: Joi.string()
    .min(8)
    .max(16)
    .pattern(new RegExp("^(?=.*[A-Z])(?=.*[!@#$%^&*])"))
    .required()
    .messages({
      "string.min": "Password must be at least 8 characters",
      "string.max": "Password must be at most 16 characters",
      "string.pattern.base":
        "Password must include at least one uppercase letter and one special character",
    }),
});

const verifyOtpSchema = Joi.object({
  email: Joi.string().email().required(),
  otp: Joi.string().length(6).required(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

module.exports = {
  signupSchema,
  verifyOtpSchema,
  loginSchema,
  updatePasswordSchema,
};
