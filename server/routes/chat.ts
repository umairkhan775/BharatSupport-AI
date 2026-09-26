import { Router, Request, Response } from 'express';
import { db } from '../db';
import { processAIQuery } from '../aiEngine';
import { SupportedLanguage, SupportCategory } from '../../src/types';

const router = Router();

// Send a chat message and get AI response
router.post('/message', async (req: Request, res: Response) => {
  try {
    const { conversationId, query, language = 'en', category, citizenName = 'Citizen', apiKey, skipAiResponse } = req.body;

    if (!query || typeof query !== 'string') {
      return res.status(400).json({ error: 'Query is required' });
    }

    const cleanApiKey = (typeof apiKey === 'string' && apiKey.trim() && !apiKey.includes('...')) ? apiKey.trim() : undefined;
    if (cleanApiKey) {
      process.env.GEMINI_API_KEY = cleanApiKey;
      try {
        await db.run(
          'INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value',
          ['geminiApiKey', cleanApiKey]
        );
      } catch (dbErr) {
        console.warn('Could not persist geminiApiKey to db:', dbErr);
      }
    }

    const convId = conversationId || `conv-${Date.now()}`;
    const userMsgId = `msg-u-${Date.now()}`;
    const nowIso = new Date().toISOString();

    // 1. Record User Message in database
    await db.run(
      `INSERT INTO messages (id, conversation_id, sender, content, category, confidence, language, created_at, requires_human_review)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [userMsgId, convId, 'user', query, category || null, null, language, nowIso, 0]
    );

    // If client handled Gemini directly and just sent audit record
    if (skipAiResponse) {
      return res.json({ success: true, message: 'Recorded' });
    }

    // 2. Process query through AI Engine with priority apiKey
    const startTime = Date.now();
    const aiResult = await processAIQuery(query, language as SupportedLanguage, category as SupportCategory, cleanApiKey);
    const durationMs = Date.now() - startTime;

    // 3. Record AI Response Message
    const aiMsgId = `msg-ai-${Date.now()}`;
    await db.run(
      `INSERT INTO messages (id, conversation_id, sender, content, category, confidence, language, created_at, suggested_actions, sources, requires_human_review)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        aiMsgId,
        convId,
        'ai',
        aiResult.reply,
        aiResult.category,
        aiResult.confidence,
        language,
        nowIso,
        JSON.stringify(aiResult.suggestedActions),
        JSON.stringify(aiResult.sources),
        aiResult.requiresHumanReview ? 1 : 0
      ]
    );

    // 4. Record Analytics event
    await db.run(
      `INSERT INTO analytics_events (id, event_type, category, language, response_time_ms, created_at)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [`evt-${Date.now()}`, 'ai_chat_query', aiResult.category, language, durationMs, nowIso]
    );

    res.json({
      conversationId: convId,
      userMessage: {
        id: userMsgId,
        sender: 'user',
        content: query,
        timestamp: nowIso,
        language
      },
      aiMessage: {
        id: aiMsgId,
        sender: 'ai',
        content: aiResult.reply,
        timestamp: nowIso,
        category: aiResult.category,
        confidence: aiResult.confidence,
        language,
        suggestedActions: aiResult.suggestedActions,
        sources: aiResult.sources,
        requiresHumanReview: aiResult.requiresHumanReview
      }
    });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ error: 'Failed to process AI chat query' });
  }
});

// Fetch conversation history
router.get('/history/:conversationId', async (req: Request, res: Response) => {
  try {
    const { conversationId } = req.params;
    const rows = await db.all(`SELECT * FROM messages WHERE conversation_id = ? ORDER BY created_at ASC`, [conversationId]);
    
    const formatted = rows.map(r => ({
      id: r.id,
      sender: r.sender,
      content: r.content,
      category: r.category,
      confidence: r.confidence,
      language: r.language,
      timestamp: r.created_at,
      suggestedActions: r.suggested_actions ? JSON.parse(r.suggested_actions) : [],
      sources: r.sources ? JSON.parse(r.sources) : [],
      requiresHumanReview: Boolean(r.requires_human_review),
      ticketId: r.ticket_id
    }));

    res.json({ conversationId, messages: formatted });
  } catch (error) {
    console.error('History fetch error:', error);
    res.status(500).json({ error: 'Failed to retrieve conversation history' });
  }
});

export default router;
