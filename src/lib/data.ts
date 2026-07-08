import type { Reservation, Room, RoomId } from './types'
import { sql, initDb } from './db'

export const ROOMS: Room[] = [
  { id: 'large', name: '대회의실', capacity: 10 },
  { id: 'medium', name: '중회의실', capacity: 10 },
  { id: 'small', name: '소회의실', capacity: 8 },
]

export const ROOM_COLORS: Record<RoomId, 'blue' | 'emerald' | 'purple'> = {
  large: 'blue',
  medium: 'emerald',
  small: 'purple',
}

type DbRow = {
  id: string
  room_id: string
  date: string
  start_time: string
  end_time: string
  title: string
  booked_by: string
  created_at: string
  pin: string
}

function toReservation(row: DbRow): Reservation {
  return {
    id: row.id,
    roomId: row.room_id as RoomId,
    date: row.date,
    startTime: row.start_time,
    endTime: row.end_time,
    title: row.title,
    bookedBy: row.booked_by,
    createdAt: row.created_at,
  }
}

export async function getReservations(): Promise<Reservation[]> {
  await initDb()
  const rows = (await sql`
    SELECT * FROM reservations ORDER BY date, start_time
  `) as DbRow[]
  return rows.map(toReservation)
}

export async function insertReservation(r: Reservation, pin: string): Promise<void> {
  await initDb()
  await sql`
    INSERT INTO reservations (id, room_id, date, start_time, end_time, title, booked_by, created_at, pin)
    VALUES (${r.id}, ${r.roomId}, ${r.date}, ${r.startTime}, ${r.endTime}, ${r.title}, ${r.bookedBy}, ${r.createdAt}, ${pin})
  `
}

export type RemoveReservationResult = 'not_found' | 'wrong_pin' | Reservation

export async function removeReservation(id: string, pin: string): Promise<RemoveReservationResult> {
  await initDb()
  const rows = (await sql`
    SELECT * FROM reservations WHERE id = ${id}
  `) as DbRow[]
  if (rows.length === 0) return 'not_found'
  if (rows[0].pin !== pin) return 'wrong_pin'

  const deleted = (await sql`
    DELETE FROM reservations WHERE id = ${id} RETURNING *
  `) as DbRow[]
  return toReservation(deleted[0])
}

export async function findConflicts(
  roomId: string,
  date: string,
  startTime: string,
  endTime: string
): Promise<Reservation[]> {
  await initDb()
  const rows = (await sql`
    SELECT * FROM reservations
    WHERE room_id = ${roomId}
      AND date = ${date}
      AND start_time < ${endTime}
      AND end_time > ${startTime}
  `) as DbRow[]
  return rows.map(toReservation)
}
