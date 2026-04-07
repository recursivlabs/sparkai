import { getRecursiv } from "./recursiv";
import { PROJECT_ID, DB_NAME } from "./constants";

let dbReady = false;

/**
 * Ensure the SPARK AI database and tables exist.
 * Safe to call multiple times — only runs setup once per process.
 */
export async function ensureDatabase(): Promise<void> {
  if (dbReady) return;

  const r = getRecursiv();

  // Ensure the database exists (creates if not)
  await r.databases.ensure({ project_id: PROJECT_ID, name: DB_NAME });

  // Create RSVP table if it doesn't exist
  await r.databases.query({
    project_id: PROJECT_ID,
    database_name: DB_NAME,
    sql: `
      CREATE TABLE IF NOT EXISTS rsvps (
        id SERIAL PRIMARY KEY,
        event_id TEXT NOT NULL,
        event_title TEXT NOT NULL,
        event_date TEXT,
        event_time TEXT,
        name TEXT,
        email TEXT NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        UNIQUE(event_id, email)
      )
    `,
  });

  // Add columns for reminder emails (safe to run if they already exist)
  await r.databases.query({
    project_id: PROJECT_ID,
    database_name: DB_NAME,
    sql: `ALTER TABLE rsvps ADD COLUMN IF NOT EXISTS meeting_link TEXT`,
  });
  await r.databases.query({
    project_id: PROJECT_ID,
    database_name: DB_NAME,
    sql: `ALTER TABLE rsvps ADD COLUMN IF NOT EXISTS event_date_iso TEXT`,
  });
  await r.databases.query({
    project_id: PROJECT_ID,
    database_name: DB_NAME,
    sql: `ALTER TABLE rsvps ADD COLUMN IF NOT EXISTS reminder_sent BOOLEAN DEFAULT FALSE`,
  });

  // Create app_config table for storing persistent settings (e.g., agent_id)
  await r.databases.query({
    project_id: PROJECT_ID,
    database_name: DB_NAME,
    sql: `
      CREATE TABLE IF NOT EXISTS app_config (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL,
        updated_at TIMESTAMPTZ DEFAULT NOW()
      )
    `,
  });

  dbReady = true;
}

/**
 * Execute a SQL query against the SPARK AI database.
 */
export async function query(sql: string, params?: unknown[]) {
  await ensureDatabase();
  const r = getRecursiv();
  const { data } = await r.databases.query({
    project_id: PROJECT_ID,
    database_name: DB_NAME,
    sql,
    params,
  });
  // API returns { rows, columns, rowCount } or a plain array
  if (Array.isArray(data)) return data;
  if (data?.rows && Array.isArray(data.rows)) return data.rows;
  return [];
}
