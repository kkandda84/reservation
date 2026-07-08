import Link from 'next/link'
import { ROOMS, ROOM_COLORS, getReservations, getToday, formatDateKorean } from '@/lib/data'
import ReservationTimeline from './components/ReservationTimeline'
import NewReservationModal from './components/NewReservationModal'
import DeleteReservationButton from './components/DeleteReservationButton'

const NAME_COLORS = {
  blue: 'text-blue-600',
  emerald: 'text-emerald-600',
  purple: 'text-purple-600',
}

const DOT_COLORS = {
  blue: 'bg-blue-500',
  emerald: 'bg-emerald-500',
  purple: 'bg-purple-500',
}

export default async function Home() {
  const today = getToday()
  const all = await getReservations()
  const todayAll = all.filter((r) => r.date === today)

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-slate-800 border-b border-slate-700">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center gap-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://plgrim24.cafe24.com/wp-content/uploads/2019/04/logo-1.png"
            alt="플그림"
            className="h-8 w-auto flex-shrink-0"
          />
          <div>
            <h1 className="text-xl font-bold text-white">플그림 회의실 예약 시스템</h1>
            <p className="text-xs text-slate-400 mt-0.5">{formatDateKorean(today)} 오늘 예약 현황</p>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {ROOMS.map((room) => {
            const reservations = todayAll
              .filter((r) => r.roomId === room.id)
              .sort((a, b) => a.startTime.localeCompare(b.startTime))

            const roomColor = ROOM_COLORS[room.id]
            const nameColor = NAME_COLORS[roomColor]
            const dotColor = DOT_COLORS[roomColor]

            return (
              <div
                key={room.id}
                className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6"
              >
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h2 className={`text-xl font-bold ${nameColor}`}>{room.name}</h2>
                    <p className="text-sm text-gray-400 mt-0.5">정원 {room.capacity}명</p>
                  </div>
                  <span
                    className={`text-xs font-semibold px-3 py-1.5 rounded-full ${
                      reservations.length === 0
                        ? 'bg-green-100 text-green-700'
                        : 'bg-orange-100 text-orange-700'
                    }`}
                  >
                    {reservations.length === 0 ? '예약 없음' : `${reservations.length}건 예약`}
                  </span>
                </div>

                <ReservationTimeline reservations={reservations} roomId={room.id} />

                <div className="mt-4 space-y-2.5">
                  {reservations.length === 0 ? (
                    <p className="text-sm text-gray-400 text-center">
                      오늘 예약된 회의가 없습니다
                    </p>
                  ) : (
                    reservations.map((r) => (
                      <div key={r.id} className="flex items-center gap-3 text-sm">
                        <span className={`w-2 h-2 rounded-full flex-shrink-0 ${dotColor}`} />
                        <span className="text-gray-400 w-[88px] flex-shrink-0 tabular-nums">
                          {r.startTime}~{r.endTime}
                        </span>
                        <span className="font-medium text-gray-800 truncate">{r.title}</span>
                        <span className="text-gray-400 flex-shrink-0">{r.bookedBy}</span>
                        <DeleteReservationButton id={r.id} />
                      </div>
                    ))
                  )}
                </div>

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                  <Link
                    href={`/rooms/${room.id}`}
                    className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    자세히 보기 →
                  </Link>
                  <NewReservationModal
                    roomId={room.id}
                    roomName={room.name}
                    date={today}
                    roomColor={roomColor}
                    compact
                  />
                </div>
              </div>
            )
          })}
        </div>
      </main>
    </div>
  )
}
