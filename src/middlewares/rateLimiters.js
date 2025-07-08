import { createRateLimiter } from '../utils/createRateLimiter.js';

import { ADMIN_EMAIL } from '../constants/token.js';


export const loginLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: 'Too many login attempts. Please try again later.',
  notifyEmail: ADMIN_EMAIL,
});

export const refreshLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 5, // Max. 5 requests
  message: 'Too many refresh requests, please try again later',
  notifyEmail: ADMIN_EMAIL,
});

export const resetEmailLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: 'Too many reset email requests. Please try again later.',
  notifyEmail: ADMIN_EMAIL,
});

export const changePasswordLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 3,
  message: 'Too many password change attempts. Please try again later.',
  notifyEmail: ADMIN_EMAIL,
});
