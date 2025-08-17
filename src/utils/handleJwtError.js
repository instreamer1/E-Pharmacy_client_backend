// utils/handleJwtError.js

import ApiError from './ApiError.js';

export function handleJwtError(err) {
  switch (err.name) {
    case 'TokenExpiredError':
      return ApiError.UnauthorizedError('Access token expired');
    case 'JsonWebTokenError':
      return ApiError.UnauthorizedError('Invalid access token');
    case 'NotBeforeError':
      return ApiError.UnauthorizedError('Token not active yet');
    default:
      return err; 
  }
}
