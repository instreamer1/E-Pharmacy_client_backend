import Joi from 'joi';

export const updateCartSchema = Joi.object({
  productId: Joi.string().required().messages({
    'string.base': 'Product ID must be a string',
    'any.required': 'Product ID is required',
  }),
  quantity: Joi.number().integer().min(0).required().messages({
    'number.base': 'Quantity must be a number',
    'number.min': 'Quantity must be at least 0',
    'any.required': 'Quantity is required',
  }),
});

export const checkoutCartSchema = Joi.object({
  items: Joi.array()
    .items(
      Joi.object({
        productId: Joi.string().required().messages({
          'string.base': 'Product ID must be a string',
          'any.required': 'Product ID is required',
        }),
        quantity: Joi.number().integer().min(1).required().messages({
          'number.base': 'Quantity must be a number',
          'number.min': 'Quantity must be at least 1',
          'any.required': 'Quantity is required',
        }),
      }),
    )
    .required()
    .messages({
      'array.base': 'Items must be an array',
      'any.required': 'Items are required',
    }),

  total: Joi.number().required().messages({
    'number.base': 'Total must be a number',
    'any.required': 'Total is required',
  }),

  paymentMethod: Joi.string().valid('Cash On Delivery', 'Bank').required().messages({
    'any.only': 'Payment method must be one of Cash On Delivery or Bank',
    'any.required': 'Payment method is required',
  }),

  shippingInfo: Joi.object({
    name: Joi.string().required().messages({ 'any.required': 'Name is required' }),
    email: Joi.string().email().required().messages({ 'any.required': 'Email is required', 'string.email': 'Email must be valid' }),
    phone: Joi.string().required().messages({ 'any.required': 'Phone is required' }),
    address: Joi.string().required().messages({ 'any.required': 'Address is required' }),
  }).required().messages({
    'any.required': 'Shipping info is required',
  }),

  createdAt: Joi.date().iso().required().messages({
    'date.base': 'createdAt must be a valid date',
    'any.required': 'createdAt is required',
  }),
});
