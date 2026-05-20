import type { Reservation, Room, RoomId } from './types'
import { sql, initDb } from './db'

export const ROOMS: Room[] = [
  { id: 'large', name: '대회의실', capacity: 20 },
  { id: 'medium', name: '중회의실', capacity: 10 },
]

type DbRow = {
  id: string
  room_id: string
  date: string
  start_time: string
  end_time: string
  title: string
  booked_by: string
  created_at: string
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

export async function insertReservation(r: Reservation): Promise<void> {
  await initDb()
  await sql`
    INSERT INTO reservations (id, room_id, date, start_time, end_time, title, booked_by, created_at)
    VALUES (${r.id}, ${r.roomId}, ${r.date}, ${r.startTime}, ${r.endTime}, ${r.title}, ${r.bookedBy}, ${r.createdAt})
  `
}

export async function removeReservation(id: string): Promise<Reservation | null> {
  await initDb()
  const rows = (await sql`
    DELETE FROM reservations WHERE id = ${id} RETURNING *
  `) as DbRow[]
  return rows.length > 0 ? toReservation(rows[0]) : null
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

export function getToday(): string {
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export function addDays(dateStr: string, n: number): string {
  const [y, m, d] = dateStr.split('-').map(Number)
  const date = new Date(y, m - 1, d + n)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function formatDateKorean(dateStr: string): string {
  const [y, m, d] = dateStr.split('-').map(Number)
  const date = new Date(y, m - 1, d)
  const days = ['일', '월', '화', '수', '목', '금', '토']
  return `${y}년 ${m}월 ${d}일 (${days[date.getDay()]})`
}

export function formatDateShort(dateStr: string): string {
  const [, m, d] = dateStr.split('-').map(Number)
  const date = new Date(Number(dateStr.split('-')[0]), m - 1, d)
  const days = ['일', '월', '화', '수', '목', '금', '토']
  return `${m}/${d} (${days[date.getDay()]})`
}
