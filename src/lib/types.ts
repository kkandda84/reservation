export type RoomId = 'large' | 'medium'

export type Room = {
  id: RoomId
  name: string
  capacity: number
}

export type Reservation = {
  id: string
  roomId: RoomId
  date: string
  startTime: string
  endTime: string
  title: string
  bookedBy: string
  createdAt: string
}

export type ActionState = {
  error?: string
  success?: boolean
} | null
