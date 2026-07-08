import { neon } from '@neondatabase/serverless'

export const sql = neon(process.env.DATABASE_URL!)

export async function initDb(): Promise<void> {
  await sql`
    CREATE TABLE IF NOT EXISTS reservations (
      id         TEXT PRIMARY KEY,
      room_id    TEXT NOT NULL,
      date       TEXT NOT NULL,
      start_time TEXT NOT NULL,
      end_time   TEXT NOT NULL,
      title      TEXT NOT NULL,
      booked_by  TEXT NOT NULL,
      created_at TEXT NOT NULL,
      pin        TEXT NOT NULL DEFAULT '0000'
    )
  `
  await sql`ALTER TABLE reservations ADD COLUMN IF NOT EXISTS pin TEXT NOT NULL DEFAULT '0000'`
}
