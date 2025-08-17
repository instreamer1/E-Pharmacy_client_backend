// middlewares/auth/checkRole.js
import ApiError from '../utils/ApiError.js';

const checkRole = (requiredRole) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(ApiError.unauthorized('User not authenticated'));
    }

    if (req.user.role !== requiredRole) {
      return next(ApiError.forbidden('Access denied: insufficient permissions'));
    }

    next();
  };
};

export default checkRole;


