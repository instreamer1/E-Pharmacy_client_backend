// middlewares/verifyAccessTokenMiddleware.js

import { checkTokenRevoked, verifyAccessToken } from '../utils/tokenService.js';
import ApiError from '../utils/ApiError.js';

const verifyAccessTokenMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith('Bearer')) {
      throw ApiError.UnauthorizedError('Invalid authorization header');
    }

    const token = authHeader.split(' ')[1];
    const { userId, jti } = verifyAccessToken(token, 'access');

   
    if (await checkTokenRevoked(jti)) {
      throw ApiError.UnauthorizedError('Token has been revoked ');
    }

    req.userId = userId;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return next(ApiError.UnauthorizedError('Access token expired'));
    }
    if (error.name === 'JsonWebTokenError') {
      return next(ApiError.UnauthorizedError('Invalid access token'));
    }
    next(error);
  }
};

export default verifyAccessTokenMiddleware;
