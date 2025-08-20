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
import productRoutes from './routers/client/productRoutes.js';
import pharmacyRoutes from './routers/client/storesRoutes.js';
import reviewRoutes from './routers/client/reviewRoutes.js';
import cartRoutes from './routers/client/cartRoutes.js';
import orderRoutes from './routers/admin/orderRoutes.js';
import productsRoutes from './routers/admin/productRoutes.js';
import customersRoutes from './routers/admin/customersRoutes.js';
import dashboardRoutes from './routers/admin/dashboardRoutes.js';
import suppliersRoutes from './routers/admin/suppliersRoutes.js';

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
  // app.use(limiter);
  app.use(logger);
  app.use(cookieParser());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  if (env('NODE_ENV') !== 'production') {
    app.use('/docs', swaggerDocs());
  }

  // Paths
  //client
  app.use('/user', authRouter);
  app.use('/products', productRoutes);
  app.use('/stores', pharmacyRoutes);
  app.use('/customer-reviews', reviewRoutes);
  app.use('/cart', cartRoutes);

  // admin

  app.use('/dashboard', dashboardRoutes);
  app.use('/customers', customersRoutes);
  app.use('/orders', orderRoutes);
  app.use('/products', productsRoutes);
  app.use('/suppliers', suppliersRoutes);


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
