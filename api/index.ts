import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { logger } from './src/middlewares/logger.js';
import { errorHandler } from './src/middlewares/errorHandler.js';
import authRoutes from './src/routes/authRoutes.js';
import gamesRoutes from './src/routes/games.js';
import challengesRoutes from './src/routes/challenges.js';
import participationsRoutes from './src/routes/participations.js';
import homeRoutes from './src/routes/home.js';
import leaderboardRoutes from './src/routes/leaderboard.js';
import challengeVoteRoutes from './src/routes/challengeVote.js';
import participationVoteRoutes from './src/routes/participationVote.js';
import profileRoutes from './src/routes/profile.js';
import reportRoutes from './src/routes/reports.js';
import moderationRoutes from './src/routes/moderation.js';
import cookieParser from 'cookie-parser';

const app = express();
const PORT = process.env.PORT || 3000;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';
app.set('trust proxy', true);

// Middlewares globaux
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' }
  })
);
app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie']
  })
);
app.use(express.json());
app.use(logger);
app.use(cookieParser());

// Routes API
app.use('/auth', authRoutes);
app.use('/profile', profileRoutes);
app.use('/games', gamesRoutes);
app.use('/challenges', challengesRoutes);
app.use('/challengeVote', challengeVoteRoutes);
app.use('/participation', participationsRoutes);
app.use('/participationVote', participationVoteRoutes);
app.use('/leaderboard', leaderboardRoutes);
app.use('/reports', reportRoutes);
app.use('/moderation', moderationRoutes);

// Route de test
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'API is running' });
});

// Route Accueil
app.use('/', homeRoutes);

// Error handler (toujours en dernier)
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`✅ API ready on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
  console.log(`Frontend URL: ${process.env.FRONTEND_URL}`);
});
