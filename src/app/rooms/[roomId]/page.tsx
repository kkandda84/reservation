import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ROOMS, ROOM_COLORS, getReservations, getToday, addDays, formatDateKorean, formatDateShort } from '@/lib/data'
import ReservationTimeline from '@/app/components/ReservationTimeline'
import NewReservationModal from '@/app/components/NewReservationModal'
import DeleteReservationButton from '@/app/components/DeleteReservationButton'
import type { RoomId } from '@/lib/types'

const NAME_COLORS = {
  blue: 'text-blue-600',
  emerald: 'text-emerald-600',
  purple: 'text-purple-600',
}

const BAR_COLORS = {
  blue: 'bg-blue-500',
  emerald: 'bg-emerald-500',
  purple: 'bg-purple-500',
}

const ACTIVE_TAB_COLORS = {
  blue: 'bg-blue-600 text-white',
  emerald: 'bg-emerald-600 text-white',
  purple: 'bg-purple-600 text-white',
}

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
  const dates = Array.from({ length: 8 }, (_, i) => addDays(today, i))

  const all = await getReservations()
  const dayReservations = all
    .filter((r) => r.roomId === roomId && r.date === selectedDate)
    .sort((a, b) => a.startTime.localeCompare(b.startTime))

  const roomColor = ROOM_COLORS[room.id]
  const nameColor = NAME_COLORS[roomColor]
  const barColor = BAR_COLORS[roomColor]
  const activeTab = ACTIVE_TAB_COLORS[roomColor]

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
            <h1 className={`text-xl font-bold ${nameColor}`}>{room.name}</h1>
            <p className="text-xs text-slate-400">정원 {room.capacity}명</p>
          </div>
          <Link
            href="/"
            className="text-slate-400 hover:text-white transition-colors text-sm flex-shrink-0"
          >
            ← 메인
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-6 pb-28">
        {/* 날짜 탭 */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-5 no-scrollbar">
          {dates.map((date) => {
            const isSelected = date === selectedDate
            const isToday = date === today
            return (
              <Link
                key={date}
                href={`/rooms/${roomId}?date=${date}`}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  isSelected
                    ? activeTab
                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {isToday ? `오늘 ${formatDateShort(date).split(' ')[0]}` : formatDateShort(date)}
              </Link>
            )
          })}
        </div>

        {/* 타임라인 */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5 mb-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-800">{formatDateKorean(selectedDate)}</h2>
            <span className="text-sm text-gray-400">{dayReservations.length}건</span>
          </div>
          <ReservationTimeline
            reservations={dayReservations}
            roomId={room.id as RoomId}
          />
        </div>

        {/* 예약 목록 */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <h3 className="font-semibold text-gray-800 mb-4">예약 목록</h3>

          {dayReservations.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-4xl mb-3">📭</p>
              <p className="text-gray-400 text-sm">예약된 회의가 없습니다</p>
            </div>
          ) : (
            <div className="space-y-3">
              {dayReservations.map((r) => (
                <div
                  key={r.id}
                  className="flex items-center gap-4 p-4 rounded-xl bg-gray-50"
                >
                  <div className={`w-1 h-12 rounded-full flex-shrink-0 ${barColor}`} />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">{r.title}</p>
                    <p className="text-sm text-gray-500 mt-0.5">
                      {r.startTime} ~ {r.endTime} · {r.bookedBy}
                    </p>
                  </div>
                  <DeleteReservationButton id={r.id} />
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* 플로팅 예약 버튼 */}
      <div className="fixed bottom-6 right-6 z-10">
        <NewReservationModal
          roomId={room.id as RoomId}
          roomName={room.name}
          date={selectedDate}
          roomColor={roomColor}
        />
      </div>
    </div>
  )
}
