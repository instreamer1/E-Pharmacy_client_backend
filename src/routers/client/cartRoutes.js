import express from 'express';
import {
  getCartItems,
  updateCart,
  checkout,
} from '../../controllers/cartController.js';
import ctrlWrapper from '../../utils/ctrlWrapper.js';
import {
  checkoutCartSchema,
  updateCartSchema,
} from '../../schemas/cartSchema.js';
import validateBody from '../../utils/validateBody.js';
import verifyAccessTokenMiddleware from '../../middlewares/verifyAccessTokenMiddleware.js';
import checkPermissionsMiddleware from '../../middlewares/checkPermissionsMiddleware..js';
import { CART_ACCESS_ROLES, ROLES } from '../../constants/roles.js';

const cartRoutes = express.Router();

cartRoutes.get(
  '/',
  verifyAccessTokenMiddleware,
  checkPermissionsMiddleware([ROLES.USER, ROLES.ADMIN, ROLES.MODERATOR]),
  ctrlWrapper(getCartItems),
);
cartRoutes.put(
  '/update',
  verifyAccessTokenMiddleware,
  validateBody(updateCartSchema),
  checkPermissionsMiddleware(CART_ACCESS_ROLES),
  ctrlWrapper(updateCart),
);
cartRoutes.post(
  '/checkout',
  verifyAccessTokenMiddleware,
  validateBody(checkoutCartSchema),
  checkPermissionsMiddleware([ROLES.USER, ROLES.ADMIN, ROLES.MODERATOR]),
  ctrlWrapper(checkout),
); 

export default cartRoutes;
