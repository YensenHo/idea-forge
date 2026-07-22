import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

type Row = Record<string, unknown>;

export interface DbAdapter {
  all(sql: string, ...params: unknown[]): Promise<Row[]>;
  get(sql: string, ...params: unknown[]): Promise<Row | undefined>;
  run(sql: string, ...params: unknown[]): Promise<{ lastInsertRowid: number | bigint }>;
}

const SCHEMA = `
  CREATE TABLE IF NOT EXISTS posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    target_user TEXT DEFAULT '',
    pain_points TEXT DEFAULT '',
    tags TEXT DEFAULT '[]',
    bounty REAL DEFAULT 0,
    upvotes INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now')),
    claimed_by TEXT DEFAULT NULL,
    app_url TEXT DEFAULT NULL,
    delivered_at TEXT DEFAULT NULL,
    claim_created_at TEXT DEFAULT NULL
  );
  CREATE TABLE IF NOT EXISTS comments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    post_id INTEGER NOT NULL,
    author_name TEXT DEFAULT '匿名用户',
    content TEXT NOT NULL,
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE
  );
`;

// Migration: add columns if they don't exist (for existing databases)
function migrate(db: Database.Database) {
  const cols = db.prepare("PRAGMA table_info(posts)").all() as Array<{name: string}>;
  const names = new Set(cols.map(c => c.name));
  if (!names.has('bounty')) db.exec('ALTER TABLE posts ADD COLUMN bounty REAL DEFAULT 0');
  if (!names.has('delivered_at')) db.exec("ALTER TABLE posts ADD COLUMN delivered_at TEXT DEFAULT NULL");
}

// ---- Local (better-sqlite3) ----
function createLocal(): DbAdapter {
  const dataDir = process.env.VERCEL
    ? path.join('/tmp', 'data')
    : path.join(process.cwd(), 'data');
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

  const dbPath = path.join(dataDir, 'idea-forge.db');
  const db = new Database(dbPath);
  db.pragma('journal_mode = WAL');
  db.pragma('foreign_keys = ON');
  db.exec(SCHEMA);
  migrate(db);

  return {
    all(sql, ...params) {
      return Promise.resolve(db.prepare(sql).all(...params) as Row[]);
    },
    get(sql, ...params) {
      return Promise.resolve(db.prepare(sql).get(...params) as Row | undefined);
    },
    run(sql, ...params) {
      const r = db.prepare(sql).run(...params);
      return Promise.resolve({ lastInsertRowid: r.lastInsertRowid });
    },
  };
}

// ---- Turso (libsql) ----
async function createTurso(): Promise<DbAdapter> {
  const { createClient } = await import('@libsql/client');
  const client = createClient({
    url: process.env.TURSO_DATABASE_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN!,
  });
  await client.executeMultiple(SCHEMA);

  return {
    async all(sql, ...params) {
      const r = await client.execute({ sql, args: params as Array<string | number | null> });
      return r.rows.map(row => {
        const obj: Row = {};
        r.columns.forEach((c, i) => { obj[c] = row[i]; });
        return obj;
      });
    },
    async get(sql, ...params) {
      const r = await client.execute({ sql, args: params as Array<string | number | null> });
      if (r.rows.length === 0) return undefined;
      const obj: Row = {};
      r.columns.forEach((c, i) => { obj[c] = r.rows[0][i]; });
      return obj;
    },
    async run(sql, ...params) {
      const r = await client.execute({ sql, args: params as Array<string | number | null> });
      return { lastInsertRowid: r.lastInsertRowid ?? 0 };
    },
  };
}

// ---- Singleton ----
let _adapter: DbAdapter | null = null;
let _init: Promise<DbAdapter> | null = null;

async function resolve(): Promise<DbAdapter> {
  if (_adapter) return _adapter;
  if (_init) return _init;

  const isTurso = !!(process.env.TURSO_DATABASE_URL && process.env.TURSO_AUTH_TOKEN);

  if (isTurso) {
    _init = createTurso().then(a => { _adapter = a; return a; });
    return _init;
  }

  _adapter = createLocal();
  return _adapter;
}

const proxy: DbAdapter = {
  async all(sql, ...params) { return (await resolve()).all(sql, ...params); },
  async get(sql, ...params) { return (await resolve()).get(sql, ...params); },
  async run(sql, ...params) { return (await resolve()).run(sql, ...params); },
};

export function getDb(): DbAdapter {
  return proxy;
}
