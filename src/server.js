import express from 'express';
import pino from 'pino-http';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import env from './utils/env.js';
import authRouter from './routers/authRoutes.js';
import notFoundHandler from './middlewares/notFoundHandler.js';
import errorHandler from './middlewares/errorHandler.js';
import swaggerDocs from './middlewares/swaggerDocs.js';

const PORT = Number(env('PORT', '3000'));
const FRONTEND_DOMAIN = env('FRONTEND_DOMAIN');

const startServer = () => {
  const logger = pino({
    level: env('NODE_ENV') === 'production' ? 'info' : 'debug',
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
        translateTime: 'SYS:dd-mm-yyyy HH:MM:ss',
        ignore: 'pid,hostname',
      },
    },
  });

  const app = express();

  // Security
  app.use(helmet());
  app.disable('x-powered-by');

  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
  });

  const allowedOrigins = ['http://localhost:5173', FRONTEND_DOMAIN].filter(
    Boolean,
  );

  const corsOptions = {
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    optionsSuccessStatus: 200,
  };

  // Middleware
  app.use(cors(corsOptions));
  app.use(limiter);
  app.use(logger);
  app.use(cookieParser());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  if (env('NODE_ENV') !== 'production') {
    app.use('/docs', swaggerDocs());
  }

  // Paths
  app.use('/users', authRouter);
  // app.use('/api/products', productsRouter);
  // app.use('/api/orders', ordersRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  const server = app.listen(PORT, () => {
    logger.logger.info(`Server running on port ${PORT}`);
    logger.logger.info(`Allowed origins: ${allowedOrigins.join(', ')}`);
    logger.logger.info(`Swagger Docs: http://localhost:${PORT}/docs`);
  });

  server.on('error', (error) => {
    logger.logger.error('Server error:', error);
    process.exit(1);
  });

  // Graceful shutdown
  process.on('SIGTERM', () => {
    logger.logger.info('SIGTERM received. Shutting down gracefully...');
    server.close(() => {
      logger.logger.info('Server terminated');
      process.exit(0);
    });
  });

  return server;
};

export default startServer;
