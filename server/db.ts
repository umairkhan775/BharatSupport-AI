import fs from 'fs';
import path from 'path';
import sqlite3 from 'sqlite3';

// Database storage directory
const dataDir = path.resolve(process.cwd(), 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.resolve(dataDir, 'bsai_database.sqlite');
const sqlite = sqlite3.verbose();

export interface IDatabase {
  run(sql: string, params?: any[]): Promise<{ lastID?: number; changes?: number }>;
  get<T = any>(sql: string, params?: any[]): Promise<T | undefined>;
  all<T = any>(sql: string, params?: any[]): Promise<T[]>;
  exec(sql: string): Promise<void>;
}

class SQLiteDB implements IDatabase {
  private db: sqlite3.Database;

  constructor(file: string) {
    this.db = new sqlite.Database(file);
  }

  run(sql: string, params: any[] = []): Promise<{ lastID?: number; changes?: number }> {
    return new Promise((resolve, reject) => {
      this.db.run(sql, params, function (this: sqlite3.RunResult, err: Error | null) {
        if (err) return reject(err);
        resolve({ lastID: this.lastID, changes: this.changes });
      });
    });
  }

  get<T = any>(sql: string, params: any[] = []): Promise<T | undefined> {
    return new Promise((resolve, reject) => {
      this.db.get(sql, params, (err: Error | null, row: any) => {
        if (err) return reject(err);
        resolve(row as T);
      });
    });
  }

  all<T = any>(sql: string, params: any[] = []): Promise<T[]> {
    return new Promise((resolve, reject) => {
      this.db.all(sql, params, (err: Error | null, rows: any[]) => {
        if (err) return reject(err);
        resolve((rows || []) as T[]);
      });
    });
  }

  exec(sql: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.exec(sql, (err: Error | null) => {
        if (err) return reject(err);
        resolve();
      });
    });
  }
}

export const db: IDatabase = new SQLiteDB(dbPath);

export async function initDatabase(): Promise<void> {
  await db.exec(`
    CREATE TABLE IF NOT EXISTS tickets (
      id TEXT PRIMARY KEY,
      ticket_number TEXT UNIQUE,
      citizen_name TEXT,
      citizen_contact TEXT,
      title TEXT,
      description TEXT,
      category TEXT,
      status TEXT,
      priority TEXT,
      language TEXT,
      created_at TEXT,
      updated_at TEXT,
      assigned_agent TEXT,
      resolution_notes TEXT,
      timeline TEXT,
      escalation_reason TEXT,
      tags TEXT
    );

    CREATE TABLE IF NOT EXISTS messages (
      id TEXT PRIMARY KEY,
      conversation_id TEXT,
      sender TEXT,
      content TEXT,
      category TEXT,
      confidence REAL,
      language TEXT,
      created_at TEXT,
      suggested_actions TEXT,
      sources TEXT,
      requires_human_review INTEGER,
      ticket_id TEXT
    );

    CREATE TABLE IF NOT EXISTS escalations (
      id TEXT PRIMARY KEY,
      ticket_id TEXT,
      ticket_number TEXT,
      citizen_name TEXT,
      category TEXT,
      priority TEXT,
      status TEXT,
      reason TEXT,
      escalated_at TEXT,
      assigned_agent TEXT,
      conversation_snippet TEXT
    );

    CREATE TABLE IF NOT EXISTS knowledge_articles (
      id TEXT PRIMARY KEY,
      title TEXT,
      title_hi TEXT,
      category TEXT,
      summary TEXT,
      summary_hi TEXT,
      content TEXT,
      content_hi TEXT,
      tags TEXT,
      views INTEGER DEFAULT 0,
      helpful_count INTEGER DEFAULT 0,
      not_helpful_count INTEGER DEFAULT 0,
      last_updated TEXT,
      official_portal_url TEXT,
      helpline_number TEXT
    );

    CREATE TABLE IF NOT EXISTS feedback (
      id TEXT PRIMARY KEY,
      ticket_id TEXT,
      conversation_id TEXT,
      rating INTEGER,
      helpful INTEGER,
      category TEXT,
      comments TEXT,
      created_at TEXT
    );

    CREATE TABLE IF NOT EXISTS analytics_events (
      id TEXT PRIMARY KEY,
      event_type TEXT,
      category TEXT,
      language TEXT,
      response_time_ms INTEGER,
      created_at TEXT
    );

    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT
    );
  `);
}
