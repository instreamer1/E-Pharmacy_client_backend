// utils/tokenService.js

import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

import {
  JWT_ACCESS_SECRET,
  JWT_REFRESH_SECRET,
  JWT_ACCESS_EXPIRES_IN,
  JWT_REFRESH_EXPIRES_IN,
} from '../constants/token.js';
import Session from '../db/models/Session.js';
import ApiError from './ApiError.js';


export const generateTokens = (userPayload) => {
  const accessJti = uuidv4();
  const refreshJti = uuidv4();

  const accessToken = jwt.sign(
    { ...userPayload, jti: accessJti },
    JWT_ACCESS_SECRET,
    { expiresIn: JWT_ACCESS_EXPIRES_IN }
  );

  const refreshToken = jwt.sign(
    { ...userPayload, jti: refreshJti },
    JWT_REFRESH_SECRET,
    { expiresIn: JWT_REFRESH_EXPIRES_IN }
  );

  return {
    accessToken,
    refreshToken,
    accessJti,
    refreshJti,
  };
};

export const verifyAccessToken = (token) => {
  try {
    const decoded = jwt.verify(token, JWT_ACCESS_SECRET);

    return decoded;
  } catch (error) {
    console.error("error", error);
    throw ApiError.UnauthorizedError('Invalid or expired access token');
  }
};


export const verifyRefreshToken = (token) => {
  try {
    const decoded = jwt.verify(token, JWT_REFRESH_SECRET);
    if (!decoded.jti) throw new Error('Missing token ID (jti)');
    return decoded;
  } catch (error) {
    console.error("error", error);
    throw ApiError.UnauthorizedError('Invalid or expired refresh token');
  }
};



export const removeSessionByJti = async (jti) => {
  const session = await Session.findOneAndDelete({ refreshJti: jti });
  return session;
};

export const checkTokenRevoked = async (jti) => {

  const session = await Session.findOne({
    $or: [{ accessJti: jti }, { refreshJti: jti }]
  });

  return !session;
};



