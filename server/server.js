import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import connectDB from './config/db.js';
import courseRoutes from './routes/courseRoutes.js';
import errorHandler from './middleware/errorHandler.js';

const app = express();
const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

// Allow the React app to call the API and send cookies (needed for JWT auth later)
app.use(cors({ origin: CLIENT_URL, credentials: true }));
app.use(express.json());

// Health check: confirms the API is running and whether MongoDB is connected
app.get('/api/health', (req, res) => {
  const dbConnected = mongoose.connection.readyState === 1;
  res.status(dbConnected ? 200 : 503).json({
    status: 'ok',
    database: dbConnected ? 'connected' : 'disconnected',
  });
});

app.use('/api/courses', courseRoutes);

// Unknown API routes
app.use((req, res) => {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
});

app.use(errorHandler);

const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
};

startServer();
