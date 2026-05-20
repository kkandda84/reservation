'use server'

import { revalidatePath } from 'next/cache'
import { randomUUID } from 'crypto'
import { insertReservation, removeReservation, findConflicts } from '@/lib/data'
import type { ActionState, Reservation, RoomId } from '@/lib/types'

export async function createReservation(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const roomId = formData.get('roomId') as RoomId
  const date = formData.get('date') as string
  const startTime = formData.get('startTime') as string
  const endTime = formData.get('endTime') as string
  const title = (formData.get('title') as string)?.trim()
  const bookedBy = (formData.get('bookedBy') as string)?.trim()

  if (!roomId || !date || !startTime || !endTime || !title || !bookedBy) {
    return { error: '모든 필드를 입력해주세요.' }
  }

  if (startTime >= endTime) {
    return { error: '종료 시간은 시작 시간보다 늦어야 합니다.' }
  }

  const conflicts = await findConflicts(roomId, date, startTime, endTime)
  if (conflicts.length > 0) {
    const c = conflicts[0]
    return {
      error: `해당 시간에 이미 예약이 있습니다. (${c.startTime}~${c.endTime} ${c.title})`,
    }
  }

  const newReservation: Reservation = {
    id: randomUUID(),
    roomId,
    date,
    startTime,
    endTime,
    title,
    bookedBy,
    createdAt: new Date().toISOString(),
  }

  await insertReservation(newReservation)

  revalidatePath('/')
  revalidatePath(`/rooms/${roomId}`)

  return { success: true }
}

export async function deleteReservation(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const id = formData.get('id') as string

  if (!id) return { error: '예약 ID가 없습니다.' }

  const deleted = await removeReservation(id)
  if (!deleted) return { error: '예약을 찾을 수 없습니다.' }

  revalidatePath('/')
  revalidatePath(`/rooms/${deleted.roomId}`)

  return { success: true }
}
