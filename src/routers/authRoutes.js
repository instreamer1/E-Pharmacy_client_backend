// routes/authRoutes.js

import { Router } from 'express';

import ctrlWrapper from '../utils/ctrlWrapper.js';
import validateBody from '../utils/validateBody.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import authenticate from '../middlewares/authenticate.js';
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

authRouter.post('/logout', ctrlWrapper(logoutController));

authRouter.get('/user-info', authenticate, ctrlWrapper(getCurrentUserController));

authRouter.post(
  '/refresh',
  refreshLimiter,
  authMiddleware,
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
