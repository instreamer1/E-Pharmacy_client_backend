// shemas/userSchema.js

import Joi from 'joi';

export const createUserSchema = Joi.object({
  name: Joi.string().min(2).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  phone: Joi.string()
    .pattern(/^\+?\d{10,15}$/)
    .required(),
});

export const loginUserSchema = Joi.object({
  email: Joi.string().required(),
  password: Joi.string().required(),
});

export const updateUserSchema = Joi.object({
  name: Joi.string().min(2).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  phone: Joi.string()
    .pattern(/^\+?\d{10,15}$/)
    .required(),
});

export const requestResetEmailSchema = Joi.object({
  email: Joi.string().email().required(),
});

export const changePasswordSchema = Joi.object({
  password: Joi.string().min(6).max(30).required().messages({
    'string.min': 'Password is too short (minimum 8 characters)',
  }),
  token: Joi.string().required().messages({
    'string.empty': 'Token is required to change password',
  }),
});
