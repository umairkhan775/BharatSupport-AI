import { Router, Request, Response } from 'express';
import { db } from '../db';

const router = Router();

// Submit user feedback
router.post('/', async (req: Request, res: Response) => {
  try {
    const { ticketId, conversationId, rating = 5, helpful = true, category, comments = '' } = req.body;

    const id = `fb-${Date.now()}`;
    const nowIso = new Date().toISOString();

    await db.run(
      `INSERT INTO feedback (id, ticket_id, conversation_id, rating, helpful, category, comments, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        ticketId || null,
        conversationId || null,
        rating,
        helpful ? 1 : 0,
        category || null,
        comments,
        nowIso
      ]
    );

    // Record Analytics Event
    await db.run(
      `INSERT INTO analytics_events (id, event_type, category, language, response_time_ms, created_at)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [`evt-${Date.now()}`, 'citizen_feedback', category || 'General', 'en', 0, nowIso]
    );

    res.status(201).json({ success: true, message: 'Feedback submitted successfully', feedbackId: id });
  } catch (error) {
    console.error('Feedback error:', error);
    res.status(500).json({ error: 'Failed to record feedback' });
  }
});

// Get feedback list
router.get('/', async (_req: Request, res: Response) => {
  try {
    const rows = await db.all('SELECT * FROM feedback ORDER BY created_at DESC LIMIT 50');
    res.json(rows);
  } catch (error) {
    console.error('Feedback fetch error:', error);
    res.status(500).json({ error: 'Failed to retrieve feedback' });
  }
});

export default router;
