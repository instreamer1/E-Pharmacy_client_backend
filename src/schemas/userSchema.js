// shemas/userSchema.js

import Joi from 'joi';

export const name = Joi.string().min(2).max(50).required();

export const email = Joi.string()
  .pattern(/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/)
  .required()
  .messages({
    'string.pattern.base': 'Enter a valid Email',
    'string.empty': 'Email is required',
  });

export const phone = Joi.string()
  .pattern(/^\+?[1-9]\d{1,14}$/)
  .required()
  .messages({
    'string.pattern.base': 'Please provide a valid phone number',
    'string.empty': 'Phone is required',
  });

export const password = Joi.string()
  .min(7)
  .max(30)
  .pattern(/^\S+$/) // без пробелов
  .required()
  .messages({
    'string.pattern.base': 'Password cannot contain spaces',
    'string.empty': 'Password is required',
  });

export const createUserSchema = Joi.object({
  name,
  email,
  phone,
  password,
});

export const loginUserSchema = Joi.object({
  email,
  password,
});

export const updateUserSchema = Joi.object({
  name,
  email,
  password,
  phone,
});

export const requestResetEmailSchema = Joi.object({
  email,
});

export const changePasswordSchema = Joi.object({
  password,
  token: Joi.string().required().messages({
    'string.empty': 'Token is required to change password',
  }),
});
