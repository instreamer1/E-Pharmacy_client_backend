//middleware/errorHandler.js

import pino from 'pino';
import pinoHttp from 'pino-http';
import ApiError from '../utils/ApiError.js';
import env from '../utils/env.js';

const loggerInstance = pino({
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: true,
      ignore: 'pid,hostname',
    },
  },
});

const logger = pinoHttp({ logger: loggerInstance });

const errorHandler = (err, req, res, next) => {
  const isDev = env('NODE_ENV', 'development') === 'development';

  if (isDev) {
    console.error('\x1b[31m', '--- ERROR DETAILS (development) ---');
    console.error(err);
    console.error('\x1b[0m');
  } else {
    logger.error({
      error: {
        name: err.name,
        message: err.message,
        code: err.code,
      },
      request: {
        method: req.method,
        url: req.originalUrl,
        params: req.params,
        query: req.query,
      },
      stack: isDev ? err.stack : undefined,
    });
  }

  if (err instanceof ApiError) {
    const { status, message, expose, stack } = err;
    return res.status(status).json({
      status,
      message: expose ? message : 'Internal Server Error',
      ...(isDev && {
        error: {
          type: err.name,
          details: expose ? err.errors : undefined,
          stack,
        },
      }),
    });
  }


  console.error('Unhandled Error:', err);
  return res.status(500).json({
    status: 500,
    message: 'Internal Server Error',
    ...(isDev && {
      error: {
        type: err.name,
        message: err.message,
        stack: err.stack,
      },
    }),
  });
};

export default errorHandler;
