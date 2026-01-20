import express from 'express';
import http from 'http';
import cors from 'cors';
import morgan from 'morgan';

import { config } from './src/config/env.js';
import { connectDB } from './src/config/db.js';
import pollRoutes from './src/routes/pollRoutes.js';
import { notFound, errorHandler } from './src/middleware/errorHandler.js';
import { registerPollSocket } from './src/sockets/pollSocket.js';

const app = express();

app.use(cors({ origin: config.corsOrigins, credentials: true }));
app.use(express.json());
app.use(morgan('dev'));

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/polls', pollRoutes);

app.use(notFound);
app.use(errorHandler);

const server = http.createServer(app);
const io = registerPollSocket(server, config);
app.set('io', io);

const startServer = async () => {
  await connectDB();
  server.listen(config.port, () => {
    console.log(`Server listening on port ${config.port}`);
  });
};

startServer();
