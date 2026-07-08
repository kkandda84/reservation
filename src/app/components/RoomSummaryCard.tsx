'use client'

import { useRef } from 'react'
import Link from 'next/link'
import ReservationTimeline from './ReservationTimeline'
import NewReservationModal, { type NewReservationModalHandle } from './NewReservationModal'
import DeleteReservationButton from './DeleteReservationButton'
import type { Reservation, Room } from '@/lib/types'

const DOT_COLORS = {
  blue: 'bg-blue-500',
  emerald: 'bg-emerald-500',
  purple: 'bg-purple-500',
}

interface Props {
  room: Room
  reservations: Reservation[]
  date: string
  roomColor: 'blue' | 'emerald' | 'purple'
}

export default function RoomSummaryCard({ room, reservations, date, roomColor }: Props) {
  const modalRef = useRef<NewReservationModalHandle>(null)
  const dotColor = DOT_COLORS[roomColor]

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-xl font-bold text-gray-900">{room.name}</h2>
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

      <ReservationTimeline
        reservations={reservations}
        roomId={room.id}
        onRangeSelect={(start, end) => modalRef.current?.openWithRange(start, end)}
      />

      <div className="mt-4 space-y-2.5">
        {reservations.length === 0 ? (
          <p className="text-sm text-gray-400 text-center">예약된 회의가 없습니다</p>
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
          href={`/rooms/${room.id}?date=${date}`}
          className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
        >
          자세히 보기 →
        </Link>
        <NewReservationModal
          ref={modalRef}
          roomId={room.id}
          roomName={room.name}
          date={date}
          roomColor={roomColor}
          compact
        />
      </div>
    </div>
  )
}
