// controllers/authController.js

import jwt from 'jsonwebtoken';
import { addSeconds } from 'date-fns';
import Session from '../db/models/Session.js';
import {
  findUserByEmail,
  findUserById,
  signup,
} from '../services/userServices.js';

import {
  generateTokens,
  removeSessionByJti,
  verifyRefreshToken,
} from '../utils/tokenService.js';
import {
  JWT_ACCESS_EXPIRES_IN,
  JWT_REFRESH_EXPIRES_IN,
} from '../constants/token.js';
import { parseJwtExpTime } from '../utils/parseExpTime.js';
import {
  createSession,
  findSessionByUserIdAndJti,
} from '../services/sessions.js';
import { changePassword, requestResetToken } from '../services/authServices.js';

export const registerController = async (req, res, next) => {
  const { name, email, password, phone } = req.body;

  try {
    if (!name || !email || !password || !phone) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const existingUser = await findUserByEmail({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: 'User with this email already exists' });
    }

    await signup({
      name,
      email,
      password,
      phone,
    });

    res.status(201).json({
      message: 'User has been successfully registered. Please log in.',
    });
  } catch (error) {
    next(error);
  }
};

export const loginController = async (req, res, next) => {
  const { email, password } = req.body;
  console.log('Login password:', password);

  try {
    const user = await findUserByEmail({ email });
    console.log('пользователь:', user);
    console.log('Найден email:', email);

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    console.log('Пароль из базы данных:', user.password);

    const isPasswordValid = await user.comparePassword(password);
    console.log('Совпадение паролей:', isPasswordValid);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const payload = { userId: user._id };
    const { accessToken, refreshToken, accessJti, refreshJti } =
      generateTokens(payload);

    const now = new Date();
    const accessExpiresAt = new Date(now.getTime() + 15 * 60 * 1000);
    const refreshExpiresAt = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    await createSession({
      userId: user._id,
      accessToken,
      refreshToken,
      accessJti,
      refreshJti,
      accessExpiresAt,
      refreshExpiresAt,
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    });
    res.clearCookie('cookieName');
    res.status(200).json({ accessToken });
  } catch (error) {
    next(error);
  }
};

export const logoutController = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken || req.body.refreshToken;
    if (!refreshToken) {
      return res.status(400).json({ message: 'Refresh token is required' });
    }

    const decoded = verifyRefreshToken(refreshToken);

    const session = await removeSessionByJti(decoded.jti);
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    res.clearCookie('refreshToken');
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    next(error);
  }
};

export const getCurrentUserController = async (req, res) => {
  try {
    const userId = req.userId;

    const user = await findUserById({ _id: userId });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const refreshTokenController = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
      return res.status(400).json({ message: 'Refresh token is required' });
    }

    const decoded = verifyRefreshToken(refreshToken);
    if (!decoded) {
      return res
        .status(401)
        .json({ message: 'Invalid or expired refresh token' });
    }

    const session = await findSessionByUserIdAndJti(
      decoded.userId,
      decoded.jti,
    );
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    const {
      accessToken,
      refreshToken: newRefreshToken,
      accessJti,
      refreshJti,
    } = generateTokens({
      userId: decoded.userId,
    });

    const now = new Date();
    const accessExpiresAt = addSeconds(
      now,
      parseJwtExpTime(JWT_ACCESS_EXPIRES_IN),
    );
    const refreshExpiresAt = addSeconds(
      now,
      parseJwtExpTime(JWT_REFRESH_EXPIRES_IN),
    );

    await Session.updateOne(
      { _id: session._id },
      {
        accessToken,
        accessTokenValidUntil: accessExpiresAt,
        refreshToken: newRefreshToken,
        refreshTokenValidUntil: refreshExpiresAt,
        accessJti,
        refreshJti,
      },
    );

    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    });

    res.setHeader('Authorization', `Bearer ${accessToken}`);
    res.json({
      accessToken,
      refreshToken: newRefreshToken,
      expiresIn: 600,
    });
  } catch (error) {
    console.error('Refresh token error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const requestResetEmailController = async (req, res) => {
  const { email } = req.body;

  try {
    await requestResetToken(email);
    res.json({ message: 'Password reset link sent to your email' });
  } catch (error) {
    console.error('Password reset request error:', error);

    if (error.name === 'NotFoundError') {
      return res.status(404).json({ message: error.message });
    }

    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(400).json({ message: 'Invalid JWT token' });
    }

    res.status(500).json({ message: 'Server error' });
  }
};

export const changePasswordController = async (req, res) => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json({
        message: 'Token and password are required',
        status: 400,
      });
    }

    await changePassword(token, password);

    res.json({
      message: 'Password was successfully reset!',
      status: 200,
      data: {},
    });
  } catch (error) {
    console.error('Password reset error:', error);
    res.status(error.status || 500).json({
      message: error.message || 'Server error',
    });
  }
};
