// routes/authRoutes.js

import { Router } from 'express';

import ctrlWrapper from '../utils/ctrlWrapper.js';
import validateBody from '../utils/validateBody.js';
import verifyRefreshTokenMiddleware from '../middlewares/verifyRefreshTokenMiddleware.js';

import {
  getCurrentUserController,
  loginController,
  logoutController,
  refreshTokenController,
  registerController,
  requestResetEmailController,
  changePasswordController,
} from '../controllers/authController.js';

import {
  createUserSchema,
  loginUserSchema,
  requestResetEmailSchema,
  changePasswordSchema,
} from '../schemas/userSchema.js';
import {
  refreshLimiter,
  changePasswordLimiter,
  resetEmailLimiter,
  loginLimiter,
} from '../middlewares/rateLimiters.js';
import verifyAccessTokenMiddleware from '../middlewares/verifyAccessTokenMiddleware.js';


const authRouter = Router();

authRouter.post(
  '/signup',
  validateBody(createUserSchema),
  ctrlWrapper(registerController),
);
authRouter.post(
  '/signin',
  loginLimiter,
  validateBody(loginUserSchema),
  ctrlWrapper(loginController),
);

authRouter.post(
  '/logout',
  verifyRefreshTokenMiddleware,
  ctrlWrapper(logoutController),
);

authRouter.get(
  '/user-info',
  verifyAccessTokenMiddleware,
  ctrlWrapper(getCurrentUserController),
);

authRouter.post(
  '/refresh',
  refreshLimiter,
  verifyRefreshTokenMiddleware,
  ctrlWrapper(refreshTokenController),
);

authRouter.post(
  '/request-reset-email',
  resetEmailLimiter,
  validateBody(requestResetEmailSchema),
  ctrlWrapper(requestResetEmailController),
);

authRouter.post(
  '/change-password',
  changePasswordLimiter,
  validateBody(changePasswordSchema),
  ctrlWrapper(changePasswordController),
);

export default authRouter;
