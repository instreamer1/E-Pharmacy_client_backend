//optionalAuthMiddleware.js

import { findUserById } from '../services/userServices.js';
import { checkTokenRevoked, verifyAccessToken } from '../utils/token.js';

const optionalAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader?.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];

    try {
      const { userId, jti } = verifyAccessToken(token, 'access');

      if (await checkTokenRevoked(jti)) return next();

      const user = await findUserById(userId);
      if (user) req.user = user;
    } catch {
      // Просто идём дальше без req.user
    }
  }

  next();
};

export default optionalAuth;
