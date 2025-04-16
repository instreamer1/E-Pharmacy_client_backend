// middlewares/authMiddleware.js
import jwt from 'jsonwebtoken';
import Session from '../db/models/Session.js';
import { JWT_REFRESH_SECRET } from '../constants/token.js';

const authMiddleware = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken || req.body?.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({ message: 'Refresh token is required' });
    }

    let decoded;
    try {
      decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
    } catch (err) {
      if (err.name === 'TokenExpiredError') {

        await Session.deleteOne({ refreshToken });
        return res.status(401).json({ message: 'Refresh token expired' });
      }

      return res.status(403).json({ message: 'Invalid refresh token' });
    }


    const session = await Session.findOne({
      refreshToken,
      userId: decoded.userId,
    });

    if (!session) {
      return res.status(403).json({ message: 'Session not found' });
    }

    if (new Date() > new Date(session.refreshTokenValidUntil)) {

      await Session.deleteOne({ _id: session._id });
      return res.status(401).json({ message: 'Refresh token expired' });
    }

    req.session = session;
    next();
  } catch (error) {
    console.error('Refresh token validation error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export default authMiddleware;
