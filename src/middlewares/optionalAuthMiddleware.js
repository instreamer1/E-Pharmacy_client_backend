//optionalAuthMiddleware.js

import { findUserById } from '../services/userServices.js';
import { verifyAccessToken } from '../utils/tokenService.js';

const optionalAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader?.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];

    try {
      const decoded = verifyAccessToken(token);
      const user = await findUserById(decoded.id);
      req.user = user;
    } catch (error) {
      // Если токен недействителен — не блокируем, но и не добавляем пользователя
      req.user = null;
    }
  }

  next();
};

export default optionalAuth;
