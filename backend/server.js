import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import authRoutes from './routes/auth.route.js';
import pollRoutes from './routes/poll.route.js'

dotenv.config(); // load .env variables

const app = express();
const port = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

// Middlewares
app.use(cors());
app.use(express.json()); // parse JSON request bodies

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/polls", pollRoutes);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Start server
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
