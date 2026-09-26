import { Router, Request, Response } from 'express';
import { db } from '../db';
import { KnowledgeArticle, SupportCategory } from '../../src/types';

const router = Router();

// Get knowledge articles with search and category filters
router.get('/', async (req: Request, res: Response) => {
  try {
    const { category, search } = req.query;

    let query = 'SELECT * FROM knowledge_articles WHERE 1=1';
    const params: any[] = [];

    if (category && category !== 'All') {
      query += ' AND category = ?';
      params.push(category);
    }

    if (search && typeof search === 'string' && search.trim().length > 0) {
      const s = `%${search.trim()}%`;
      query += ' AND (title LIKE ? OR title_hi LIKE ? OR summary LIKE ? OR summary_hi LIKE ? OR content LIKE ? OR tags LIKE ?)';
      params.push(s, s, s, s, s, s);
    }

    query += ' ORDER BY views DESC';

    const rows = await db.all(query, params);
    const articles: KnowledgeArticle[] = rows.map(r => ({
      id: r.id,
      title: r.title,
      titleHi: r.title_hi,
      category: r.category as SupportCategory,
      summary: r.summary,
      summaryHi: r.summary_hi,
      content: r.content,
      contentHi: r.content_hi,
      tags: r.tags ? JSON.parse(r.tags) : [],
      views: r.views || 0,
      helpfulCount: r.helpful_count || 0,
      notHelpfulCount: r.not_helpful_count || 0,
      lastUpdated: r.last_updated,
      officialPortalUrl: r.official_portal_url,
      helplineNumber: r.helpline_number
    }));

    res.json(articles);
  } catch (error) {
    console.error('Knowledge Base fetch error:', error);
    res.status(500).json({ error: 'Failed to retrieve knowledge articles' });
  }
});

// Get single article by ID and increment view count
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const r = await db.get('SELECT * FROM knowledge_articles WHERE id = ?', [id]);

    if (!r) {
      return res.status(404).json({ error: 'Article not found' });
    }

    // Increment view count
    await db.run('UPDATE knowledge_articles SET views = views + 1 WHERE id = ?', [id]);

    const article: KnowledgeArticle = {
      id: r.id,
      title: r.title,
      titleHi: r.title_hi,
      category: r.category as SupportCategory,
      summary: r.summary,
      summaryHi: r.summary_hi,
      content: r.content,
      contentHi: r.content_hi,
      tags: r.tags ? JSON.parse(r.tags) : [],
      views: (r.views || 0) + 1,
      helpfulCount: r.helpful_count || 0,
      notHelpfulCount: r.not_helpful_count || 0,
      lastUpdated: r.last_updated,
      officialPortalUrl: r.official_portal_url,
      helplineNumber: r.helpline_number
    };

    res.json(article);
  } catch (error) {
    console.error('Single article fetch error:', error);
    res.status(500).json({ error: 'Failed to retrieve article details' });
  }
});

// Vote helpful / not helpful
router.post('/:id/vote', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { helpful } = req.body;

    if (helpful) {
      await db.run('UPDATE knowledge_articles SET helpful_count = helpful_count + 1 WHERE id = ?', [id]);
    } else {
      await db.run('UPDATE knowledge_articles SET not_helpful_count = not_helpful_count + 1 WHERE id = ?', [id]);
    }

    const updated = await db.get('SELECT helpful_count, not_helpful_count FROM knowledge_articles WHERE id = ?', [id]);
    res.json(updated);
  } catch (error) {
    console.error('Vote error:', error);
    res.status(500).json({ error: 'Failed to submit vote' });
  }
});

export default router;
