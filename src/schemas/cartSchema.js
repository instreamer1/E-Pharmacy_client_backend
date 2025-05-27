import Joi from 'joi';

// export const updateCartSchema = Joi.object({
//   productId: Joi.string().required().messages({
//     'string.base': 'Product ID must be a string',
//     'any.required': 'Product ID is required',
//   }),
//   name: Joi.string().required().messages({
//     'string.base': 'Name must be a string',
//     'any.required': 'Name is required',
//   }),
//   photo: Joi.string().uri().required().messages({
//     'string.base': 'Photo must be a valid URL',
//     'any.required': 'Photo is required',
//   }),
//   price: Joi.number().positive().required().messages({
//     'number.base': 'Price must be a number',
//     'any.required': 'Price is required',
//   }),
//   quantity: Joi.number().integer().min(1).required().messages({
//     'number.base': 'Quantity must be a number',
//     'number.min': 'Quantity must be at least 1',
//     'any.required': 'Quantity is required',
//   }),
//   descGeneral: Joi.string().optional(),
// });

export const updateCartSchema = Joi.object({
  productId: Joi.string().required().messages({
    'string.base': 'Product ID must be a string',
    'any.required': 'Product ID is required',
  }),
  quantity: Joi.number().integer().min(1).required().messages({
    'number.base': 'Quantity must be a number',
    'number.min': 'Quantity must be at least 1',
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
        price: Joi.number().required().messages({
          'number.base': 'Price must be a number',
          'any.required': 'Price is required',
        }),
      }),
    )
    .required()
    .messages({
      'array.base': 'Items must be an array',
      'any.required': 'Items are required',
    }),
  totalAmount: Joi.number().required().messages({
    'number.base': 'Total amount must be a number',
    'any.required': 'Total amount is required',
  }),
});
