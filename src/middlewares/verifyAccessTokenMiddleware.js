// middlewares/verifyAccessTokenMiddleware.js

import { verifyAccessToken, checkTokenRevoked } from '../utils/token.js';
import { findUserById } from '../services/userServices.js';
import ApiError from '../utils/ApiError.js';
import { handleJwtError } from '../utils/handleJwtError.js';

const verifyAccessTokenMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;


    if (!authHeader?.startsWith('Bearer ')) {
      return next(
        ApiError.UnauthorizedError(
          'Authorization header is missing or invalid',
        ),
      );
    }

    const token = authHeader.split(' ')[1];

    let decoded;
    try {
      decoded = verifyAccessToken(token, 'access');
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        return next(ApiError.UnauthorizedError('Access token expired'));
      }
      if (err.name === 'JsonWebTokenError') {
        return next(ApiError.UnauthorizedError('Invalid access token'));
      }
      return next(handleJwtError(err));
    }

    const { userId, jti } = decoded;

    //  (logout, security)
    const isRevoked = await checkTokenRevoked(jti);
    if (isRevoked) {
      return next(ApiError.UnauthorizedError('Token has been revoked'));
    }


    const user = await findUserById(userId);
    if (!user) {
      return next(ApiError.UnauthorizedError('User not found'));
    }


    req.user = user;
    req.userId = userId;

    next();
  } catch (error) {
    next(error);
  }
};

export default verifyAccessTokenMiddleware;
