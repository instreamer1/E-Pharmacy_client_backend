// services/sessions.js

import { MongoServerError } from 'mongodb';
import ApiError from '../utils/ApiError.js';
import { addSeconds } from 'date-fns';
import {
  JWT_ACCESS_EXPIRES_IN,
  JWT_REFRESH_EXPIRES_IN,
} from '../constants/token.js';
import SessionCollection from '../db/models/Session.js';
import { parseJwtExpTime } from '../utils/parseExpTime.js';

export const createSession = async ({
  userId,
  accessToken,
  refreshToken,
  accessJti,
  refreshJti,
}) => {
  try {
    const existingSession = await SessionCollection.findOne({ userId });
    if (existingSession) {
      existingSession.accessToken = accessToken;
      existingSession.refreshToken = refreshToken;
      existingSession.accessJti = accessJti;
      existingSession.refreshJti = refreshJti;
      existingSession.accessTokenValidUntil = addSeconds(
        new Date(),
        parseJwtExpTime(JWT_ACCESS_EXPIRES_IN),
      );
      existingSession.refreshTokenValidUntil = addSeconds(
        new Date(),
        parseJwtExpTime(JWT_REFRESH_EXPIRES_IN),
      );

      return await existingSession.save();
    }

    const accessExpiresAt = addSeconds(
      new Date(),
      parseJwtExpTime(JWT_ACCESS_EXPIRES_IN),
    );
    const refreshExpiresAt = addSeconds(
      new Date(),
      parseJwtExpTime(JWT_REFRESH_EXPIRES_IN),
    );

    return await SessionCollection.create({
      userId,
      accessToken,
      refreshToken,
      accessJti,
      refreshJti,
      accessTokenValidUntil: accessExpiresAt,
      refreshTokenValidUntil: refreshExpiresAt,
    });
  } catch (error) {
    if (error instanceof MongoServerError && error.code === 11000) {
      throw ApiError.Conflict('Session already exists for this user');
    }

    throw ApiError.InternalError('Internal Server Error');
  }
};

export const findSessionByUserIdAndJti = async (userId, jti) => {
  try {
    const session = await SessionCollection.findOne({ userId, refreshJti: jti });

    if (!session) {
      return null;
    }

    return session;
  } catch (error) {
    console.error('error:', error);
    throw new Error('Internal Server Error');
  }
};
