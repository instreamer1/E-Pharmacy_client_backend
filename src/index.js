// src/index.js

import initMongoDBConnection from './db/initMongoDB.js';
import startServer from './server.js';

const bootstrap = async () => {
  await initMongoDBConnection();

  startServer();
};

bootstrap();
