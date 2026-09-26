import { Router, Request, Response } from 'express';
import { db } from '../db';
import { seedDatabase } from '../seed';

const router = Router();

router.post('/', async (_req: Request, res: Response) => {
  try {
    await db.exec(`
      DELETE FROM tickets;
      DELETE FROM escalations;
      DELETE FROM knowledge_articles;
      DELETE FROM feedback;
      DELETE FROM analytics_events;
      DELETE FROM messages;
    `);

    await seedDatabase();

    res.json({ success: true, message: 'BSAI Demo Data successfully reset to pristine baseline state.' });
  } catch (error) {
    console.error('Reset error:', error);
    res.status(500).json({ error: 'Failed to reset demo data' });
  }
});

export default router;
