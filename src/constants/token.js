// constants/token.js

import env from '../utils/env.js';

export const JWT_ACCESS_SECRET = env('JWT_ACCESS_SECRET') || 'super-secret-key';
export const JWT_REFRESH_SECRET = env('JWT_REFRESH_SECRET') || 'super-refresh-secret-key';
export const JWT_ACCESS_EXPIRES_IN = '15m';
export const JWT_REFRESH_EXPIRES_IN = '30d';
export const JWT_RESET_SECRET =  env("JWT_RESET_SECRET") || 'SecretKeyForReset';
export const ADMIN_EMAIL = env('ADMIN_EMAIL');
export const FRONTEND_DOMAIN = env('FRONTEND_DOMAIN');
