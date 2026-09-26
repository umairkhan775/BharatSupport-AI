import { Router, Request, Response } from 'express';
import { db } from '../db';
import { Ticket, TicketStatus, TicketPriority, SupportCategory, SupportedLanguage } from '../../src/types';

const router = Router();

// Get all tickets with optional category, status, search filter
router.get('/', async (req: Request, res: Response) => {
  try {
    const { status, category, priority, search } = req.query;

    let query = 'SELECT * FROM tickets WHERE 1=1';
    const params: any[] = [];

    if (status && status !== 'All') {
      query += ' AND status = ?';
      params.push(status);
    }

    if (category && category !== 'All') {
      query += ' AND category = ?';
      params.push(category);
    }

    if (priority && priority !== 'All') {
      query += ' AND priority = ?';
      params.push(priority);
    }

    if (search && typeof search === 'string' && search.trim().length > 0) {
      query += ' AND (ticket_number LIKE ? OR citizen_name LIKE ? OR title LIKE ? OR description LIKE ?)';
      const s = `%${search.trim()}%`;
      params.push(s, s, s, s);
    }

    query += ' ORDER BY created_at DESC';

    const rows = await db.all(query, params);
    const tickets: Ticket[] = rows.map(r => ({
      id: r.id,
      ticketNumber: r.ticket_number,
      citizenName: r.citizen_name,
      citizenContact: r.citizen_contact,
      title: r.title,
      description: r.description,
      category: r.category as SupportCategory,
      status: r.status as TicketStatus,
      priority: r.priority as TicketPriority,
      language: r.language as SupportedLanguage,
      createdAt: r.created_at,
      updatedAt: r.updated_at,
      assignedAgent: r.assigned_agent,
      resolutionNotes: r.resolution_notes,
      timeline: r.timeline ? JSON.parse(r.timeline) : [],
      escalationReason: r.escalation_reason,
      tags: r.tags ? JSON.parse(r.tags) : []
    }));

    res.json(tickets);
  } catch (error) {
    console.error('Tickets fetch error:', error);
    res.status(500).json({ error: 'Failed to retrieve support tickets' });
  }
});

// Get single ticket by ID or Ticket Number
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const r = await db.get('SELECT * FROM tickets WHERE id = ? OR ticket_number = ?', [id, id]);

    if (!r) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    const ticket: Ticket = {
      id: r.id,
      ticketNumber: r.ticket_number,
      citizenName: r.citizen_name,
      citizenContact: r.citizen_contact,
      title: r.title,
      description: r.description,
      category: r.category as SupportCategory,
      status: r.status as TicketStatus,
      priority: r.priority as TicketPriority,
      language: r.language as SupportedLanguage,
      createdAt: r.created_at,
      updatedAt: r.updated_at,
      assignedAgent: r.assigned_agent,
      resolutionNotes: r.resolution_notes,
      timeline: r.timeline ? JSON.parse(r.timeline) : [],
      escalationReason: r.escalation_reason,
      tags: r.tags ? JSON.parse(r.tags) : []
    };

    res.json(ticket);
  } catch (error) {
    console.error('Single ticket fetch error:', error);
    res.status(500).json({ error: 'Failed to retrieve ticket details' });
  }
});

// Create new support ticket
router.post('/', async (req: Request, res: Response) => {
  try {
    const {
      citizenName = 'Citizen User',
      citizenContact = '',
      title,
      description,
      category = 'Government Services',
      priority = 'Medium',
      language = 'en',
      tags = [],
      isEscalated = false,
      escalationReason = ''
    } = req.body;

    if (!title || !description) {
      return res.status(400).json({ error: 'Title and description are required' });
    }

    const id = `tkt-${Date.now()}`;
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const ticketNumber = `BSAI-2026-${randomNum}`;
    const nowIso = new Date().toISOString();

    const initialStatus: TicketStatus = isEscalated ? 'Escalated' : 'Open';

    const timeline = [
      {
        id: `ev-${Date.now()}-1`,
        timestamp: nowIso,
        title: isEscalated ? 'Escalated Support Request Created' : 'Ticket Created via BSAI Platform',
        description: description.slice(0, 140) + (description.length > 140 ? '...' : ''),
        actor: 'Citizen',
        type: isEscalated ? 'escalation' : 'creation'
      }
    ];

    await db.run(
      `INSERT INTO tickets (id, ticket_number, citizen_name, citizen_contact, title, description, category, status, priority, language, created_at, updated_at, assigned_agent, resolution_notes, timeline, escalation_reason, tags)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        ticketNumber,
        citizenName,
        citizenContact || null,
        title,
        description,
        category,
        initialStatus,
        priority,
        language,
        nowIso,
        nowIso,
        null,
        null,
        JSON.stringify(timeline),
        escalationReason || (isEscalated ? 'Citizen flagged for direct officer review' : null),
        JSON.stringify(tags)
      ]
    );

    // If escalated, add to escalation queue
    if (isEscalated) {
      await db.run(
        `INSERT INTO escalations (id, ticket_id, ticket_number, citizen_name, category, priority, status, reason, escalated_at, conversation_snippet)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          `esc-${Date.now()}`,
          id,
          ticketNumber,
          citizenName,
          category,
          priority,
          'Pending Review',
          escalationReason || 'Citizen requested immediate human support officer intervention',
          nowIso,
          description.slice(0, 180)
        ]
      );
    }

    // Analytics event
    await db.run(
      `INSERT INTO analytics_events (id, event_type, category, language, response_time_ms, created_at)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [`evt-${Date.now()}`, isEscalated ? 'ticket_escalated' : 'ticket_created', category, language, 0, nowIso]
    );

    const created = await db.get('SELECT * FROM tickets WHERE id = ?', [id]);
    res.status(201).json({
      ...created,
      ticketNumber,
      timeline,
      tags
    });
  } catch (error) {
    console.error('Ticket creation error:', error);
    res.status(500).json({ error: 'Failed to create support ticket' });
  }
});

// Update ticket status / assign agent / add timeline note / resolve
router.patch('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status, assignedAgent, resolutionNotes, note, actor = 'Human Support Officer' } = req.body;

    const existing = await db.get('SELECT * FROM tickets WHERE id = ?', [id]);
    if (!existing) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    const nowIso = new Date().toISOString();
    const timeline = existing.timeline ? JSON.parse(existing.timeline) : [];

    if (note) {
      timeline.push({
        id: `ev-${Date.now()}`,
        timestamp: nowIso,
        title: status ? `Status updated to ${status}` : 'Update Note Added',
        description: note,
        actor,
        type: status === 'Resolved' ? 'resolution' : 'status_change'
      });
    }

    const updatedStatus = status || existing.status;
    const updatedAgent = assignedAgent !== undefined ? assignedAgent : existing.assigned_agent;
    const updatedNotes = resolutionNotes !== undefined ? resolutionNotes : existing.resolution_notes;

    await db.run(
      `UPDATE tickets
       SET status = ?, assigned_agent = ?, resolution_notes = ?, timeline = ?, updated_at = ?
       WHERE id = ?`,
      [updatedStatus, updatedAgent, updatedNotes, JSON.stringify(timeline), nowIso, id]
    );

    // If resolved, also update escalations table if present
    if (updatedStatus === 'Resolved') {
      await db.run(
        `UPDATE escalations SET status = 'Resolved' WHERE ticket_id = ?`,
        [id]
      );
    }

    const result = await db.get('SELECT * FROM tickets WHERE id = ?', [id]);
    res.json({
      ...result,
      timeline: JSON.parse(result.timeline),
      tags: result.tags ? JSON.parse(result.tags) : []
    });
  } catch (error) {
    console.error('Ticket update error:', error);
    res.status(500).json({ error: 'Failed to update ticket' });
  }
});

export default router;
