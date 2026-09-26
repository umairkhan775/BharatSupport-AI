import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initDatabase } from './db';
import { seedDatabase } from './seed';

import chatRoutes from './routes/chat';
import ticketRoutes from './routes/tickets';
import escalationRoutes from './routes/escalations';
import knowledgeRoutes from './routes/knowledge';
import analyticsRoutes from './routes/analytics';
import feedbackRoutes from './routes/feedback';
import settingsRoutes from './routes/settings';
import resetRoutes from './routes/reset';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/chat', chatRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/escalations', escalationRoutes);
app.use('/api/knowledge', knowledgeRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/reset-demo', resetRoutes);

// Health check
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'online',
    platform: 'Bharat Support AI (BSAI)',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

async function startServer() {
  try {
    await initDatabase();
    await seedDatabase();

    app.listen(PORT, () => {
      console.log(`====================================================`);
      console.log(`🚀 BSAI Backend API Server running on port ${PORT}`);
      console.log(`🔗 Health: http://localhost:${PORT}/api/health`);
      console.log(`====================================================`);
    });
  } catch (err) {
    console.error('Failed to start BSAI server:', err);
    process.exit(1);
  }
}

startServer();
