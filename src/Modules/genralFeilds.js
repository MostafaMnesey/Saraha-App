import joi from "joi";

export const genralFeilds = {
  fullName: joi.string().min(2).max(20).messages({
    "string.empty": "fullName is required",
    "string.min": "fullName must be at least 2 characters long",
    "string.max": "fullName must be at most 20 characters long",
  }),
  email: joi.string().email().messages({
    "string.empty": "email is required",
    "string.email": "email must be a valid email address",
  }),
  password: joi.string().min(8).max(20).messages({
    "string.empty": "password is required",
    "string.min": "password must be at least 8 characters long",
    "string.max": "password must be at most 20 characters long",
  }),
  gender: joi.string().valid("male", "female").messages({
    "string.empty": "gender is required",
    "string.valid": "gender must be male or female",
  }),
  confirmPassword: joi.string().valid(joi.ref("password")).messages({
    "string.empty": "confirmPassword is required",
    "any.only": "confirmPassword must match password",
  }),
  phone: joi.string().min(10).max(10),
  otp: joi
    .string()
    .pattern(new RegExp(/^\d{6}$/))
    .required(),
};
