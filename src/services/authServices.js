// services/authServices.js

import jwt from 'jsonwebtoken';
import { SMTP } from '../constants/index.js';
import sendEmail, { compileTemplate } from '../utils/sendEmail.js';
import { FRONTEND_DOMAIN, JWT_RESET_SECRET } from '../constants/token.js';
import { findUser, findUserById } from './userServices.js';
import ApiError from '../utils/ApiError.js';

export const requestResetToken = async (email) => {
  const user = await findUser({ email });
  console.log('EMAIL a user', user);
  if (!user) {
    throw new ApiError.NotFound(
      'If the email exists, you will receive a reset link',
    );
  }

  const resetToken = jwt.sign({ sub: user._id }, JWT_RESET_SECRET, {
    expiresIn: '15m',
  });

  user.resetPasswordToken = resetToken;
  user.resetPasswordExpires = Date.now() + 15 * 60 * 1000;
  user.resetPasswordToken = resetToken;
  user.resetPasswordExpires = Date.now() + 15 * 60 * 1000;
  await user.save();
  console.log('a user', user);

  const resetLink = `${FRONTEND_DOMAIN}/reset-password?token=${resetToken}`;

  const html = await compileTemplate('reset-password', {
    name: user.name,
    link: resetLink,
    year: new Date().getFullYear(),
  });

  await sendEmail({
    from: SMTP.SMTP_FROM,
    to: email,
    subject: 'Reset your password',
    html,
    headers: {
      'X-Priority': '1',
    },
  });
};

export const changePassword = async (token, newPassword) => {
  let decoded;
  try {
    decoded = jwt.verify(token, JWT_RESET_SECRET);
  } catch (error) {
    console.error('error:', error);
    throw new ApiError.Unauthorized('Invalid or expired token');
  }

  const user = await findUserById({ _id: decoded.sub });

  if (!user) {
    throw new ApiError.NotFound('User not found');
  }

  if (user.resetPasswordExpires < Date.now()) {
    throw new ApiError.BadRequest('Password reset token has expired');
  }

  user.password = newPassword;
  user.resetPasswordToken = null;
  user.resetPasswordExpires = null;

  await user.save();
};
