import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ROOMS, ROOM_COLORS, getReservations } from '@/lib/data'
import { getToday, formatDateKorean } from '@/lib/date'
import RoomDayPanel from '@/app/components/RoomDayPanel'

export default async function RoomPage({
  params,
  searchParams,
}: {
  params: Promise<{ roomId: string }>
  searchParams: Promise<{ date?: string }>
}) {
  const { roomId } = await params
  const { date: queryDate } = await searchParams

  const room = ROOMS.find((r) => r.id === roomId)
  if (!room) notFound()

  const today = getToday()
  const selectedDate = queryDate || today

  const all = await getReservations()
  const dayReservations = all
    .filter((r) => r.roomId === roomId && r.date === selectedDate)
    .sort((a, b) => a.startTime.localeCompare(b.startTime))

  const roomColor = ROOM_COLORS[room.id]

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-slate-800 border-b border-slate-700">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center gap-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://plgrim24.cafe24.com/wp-content/uploads/2019/04/logo-1.png"
            alt="플그림"
            className="h-8 w-auto flex-shrink-0"
          />
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-bold text-white">{room.name}</h1>
            <p className="text-xs text-slate-400">정원 {room.capacity}명</p>
          </div>
          <Link
            href={`/?date=${selectedDate}`}
            className="text-slate-400 hover:text-white transition-colors text-sm flex-shrink-0"
          >
            ← 메인
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-6 pb-28">
        <RoomDayPanel
          reservations={dayReservations}
          roomId={room.id}
          roomName={room.name}
          roomColor={roomColor}
          selectedDate={selectedDate}
          formattedDate={formatDateKorean(selectedDate)}
        />
      </main>
    </div>
  )
}
