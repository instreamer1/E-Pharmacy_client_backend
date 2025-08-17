// middlewares/checkPermissionsMiddleware.js
import ApiError from '../utils/ApiError.js';

/**
 * @param {string[]} allowedRoles 
 */
const checkPermissionsMiddleware = (allowedRoles = []) => {
  return (req, res, next) => {
    const user = req.user;

    if (!user) {
      return next(ApiError.unauthorized('User not authenticated'));
    }

    if (!allowedRoles.includes(user.role)) {
      return next(ApiError.forbidden('Access denied: insufficient permissions'));
    }

    next();
  };
};

export default checkPermissionsMiddleware;
