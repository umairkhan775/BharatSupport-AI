import { Router, Request, Response } from 'express';
import { db } from '../db';
import { EscalationItem } from '../../src/types';

const router = Router();

// Get all escalations
router.get('/', async (req: Request, res: Response) => {
  try {
    const rows = await db.all('SELECT * FROM escalations ORDER BY escalated_at DESC');
    const escalations: EscalationItem[] = rows.map(r => ({
      id: r.id,
      ticketId: r.ticket_id,
      ticketNumber: r.ticket_number,
      citizenName: r.citizen_name,
      category: r.category,
      priority: r.priority,
      status: r.status,
      reason: r.reason,
      escalatedAt: r.escalated_at,
      assignedAgent: r.assigned_agent,
      conversationSnippet: r.conversation_snippet
    }));
    res.json(escalations);
  } catch (error) {
    console.error('Escalations fetch error:', error);
    res.status(500).json({ error: 'Failed to retrieve escalation queue' });
  }
});

// Update escalation item (assign agent, change status)
router.patch('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status, assignedAgent, resolutionNote } = req.body;

    const esc = await db.get('SELECT * FROM escalations WHERE id = ?', [id]);
    if (!esc) {
      return res.status(404).json({ error: 'Escalation item not found' });
    }

    const updatedStatus = status || esc.status;
    const updatedAgent = assignedAgent !== undefined ? assignedAgent : esc.assigned_agent;

    await db.run(
      'UPDATE escalations SET status = ?, assigned_agent = ? WHERE id = ?',
      [updatedStatus, updatedAgent, id]
    );

    // If status is Resolved, update corresponding ticket
    if (updatedStatus === 'Resolved' && esc.ticket_id) {
      const nowIso = new Date().toISOString();
      const ticket = await db.get('SELECT * FROM tickets WHERE id = ?', [esc.ticket_id]);
      if (ticket) {
        const timeline = ticket.timeline ? JSON.parse(ticket.timeline) : [];
        timeline.push({
          id: `ev-${Date.now()}`,
          timestamp: nowIso,
          title: 'Escalation Resolved by Human Officer',
          description: resolutionNote || `Officer ${updatedAgent || 'Nodal Desk'} finalized case resolution.`,
          actor: 'Human Support Officer',
          type: 'resolution'
        });

        await db.run(
          `UPDATE tickets SET status = 'Resolved', assigned_agent = ?, resolution_notes = ?, timeline = ?, updated_at = ? WHERE id = ?`,
          [updatedAgent, resolutionNote || 'Resolved via Escalation Desk', JSON.stringify(timeline), nowIso, esc.ticket_id]
        );
      }
    }

    const updated = await db.get('SELECT * FROM escalations WHERE id = ?', [id]);
    res.json(updated);
  } catch (error) {
    console.error('Escalation update error:', error);
    res.status(500).json({ error: 'Failed to update escalation status' });
  }
});

export default router;
