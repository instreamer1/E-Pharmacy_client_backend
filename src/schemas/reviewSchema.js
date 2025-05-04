import Joi from 'joi';

export const reviewSchema = Joi.object({
  userId: Joi.string().required().messages({
    'string.base': `"userId" must be a string`,
    'any.required': `"userId" is required`,
  }),

  productId: Joi.string().required().messages({
    'string.base': `"productId" must be a string`,
    'any.required': `"productId" is required`,
  }),

  rating: Joi.number().integer().min(1).max(5).required().messages({
    'number.base': `"rating" must be a number`,
    'number.min': `"rating" must be at least 1`,
    'number.max': `"rating" must be at most 5`,
    'any.required': `"rating" is required`,
  }),

  name: Joi.string().min(1).max(20).required().messages({
    'string.base': `"name" must be a string`,
    'any.required': `"name" is required`,
  }),

  testimonial: Joi.string().min(1).required().messages({
    'string.base': `"comment" must be a string`,
    'any.required': `"comment" is required`,
  }),
});
