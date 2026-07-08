import { ROOMS, ROOM_COLORS, getReservations } from '@/lib/data'
import { getToday, addDays, formatDateKorean, isWeekend } from '@/lib/date'
import DateSelector from './components/DateSelector'
import RoomSummaryCard from './components/RoomSummaryCard'

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ date?: string }>
}) {
  const { date: queryDate } = await searchParams

  const today = getToday()
  const selectedDate = queryDate || today
  const dates = Array.from({ length: 10 }, (_, i) => addDays(today, i))
    .filter((d) => !isWeekend(d))
    .slice(0, 5)

  const all = await getReservations()
  const selectedAll = all.filter((r) => r.date === selectedDate)

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-slate-800 border-b border-slate-700">
        <div className="max-w-2xl mx-auto px-6 py-4 flex items-center gap-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://plgrim24.cafe24.com/wp-content/uploads/2019/04/logo-1.png"
            alt="플그림"
            className="h-8 w-auto flex-shrink-0"
          />
          <div>
            <h1 className="text-xl font-bold text-white">플그림 회의실 예약 시스템</h1>
            <p className="text-xs text-slate-400 mt-0.5">{formatDateKorean(selectedDate)} 예약 현황</p>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8">
        <DateSelector dates={dates} selectedDate={selectedDate} today={today} />

        <div className="flex flex-col gap-6">
          {ROOMS.map((room) => {
            const reservations = selectedAll
              .filter((r) => r.roomId === room.id)
              .sort((a, b) => a.startTime.localeCompare(b.startTime))

            return (
              <RoomSummaryCard
                key={room.id}
                room={room}
                reservations={reservations}
                date={selectedDate}
                roomColor={ROOM_COLORS[room.id]}
              />
            )
          })}
        </div>
      </main>
    </div>
  )
}
