import rateLimit from 'express-rate-limit';
import ApiError from './ApiError.js';
import logger from './logger.js';
import sendEmail from './sendEmail.js';

export const createRateLimiter = (options) => {
  const { message, notifyEmail } = options;

  return rateLimit({
    ...options,
    handler: async (req, res, next, opt) => {
      const err = ApiError.BadRequest(message || 'Too many requests');
      res.status(err.status).json({
        status: err.status,
        message: err.message,
      });


      const logMessage = `[RateLimiter] ${req.method} ${req.originalUrl} | IP: ${req.ip} | Message: ${err.message}`;
      logger.warn(logMessage);

      if (notifyEmail) {
        try {
          await sendEmail({
            to: notifyEmail,
            subject: 'Rate Limit Exceeded 🚨',
            html: `
              <h2> Rate Limiter Triggered</h2>
              <p><strong>Route:</strong> ${req.method} ${req.originalUrl}</p>
              <p><strong>IP:</strong> ${req.ip}</p>
              <p><strong>Message:</strong> ${err.message}</p>
              <p><strong>Time:</strong> ${new Date().toISOString()}</p>
            `,
          });
        } catch (emailError) {
          logger.error(`[Mailer] Failed to send rate limit email: ${emailError.message}`);
        }
      }
    },
    standardHeaders: true,
    legacyHeaders: false,
  });
};
