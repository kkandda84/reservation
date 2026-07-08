'use client'

import { useRef } from 'react'
import ReservationTimeline from './ReservationTimeline'
import NewReservationModal, { type NewReservationModalHandle } from './NewReservationModal'
import DeleteReservationButton from './DeleteReservationButton'
import type { Reservation, RoomId } from '@/lib/types'

const BAR_COLORS = {
  blue: 'bg-blue-500',
  emerald: 'bg-emerald-500',
  purple: 'bg-purple-500',
}

interface Props {
  reservations: Reservation[]
  roomId: RoomId
  roomName: string
  roomColor: 'blue' | 'emerald' | 'purple'
  selectedDate: string
  formattedDate: string
}

export default function RoomDayPanel({
  reservations,
  roomId,
  roomName,
  roomColor,
  selectedDate,
  formattedDate,
}: Props) {
  const modalRef = useRef<NewReservationModalHandle>(null)
  const barColor = BAR_COLORS[roomColor]

  return (
    <>
      <div className="bg-white rounded-2xl border border-gray-200 p-5 mb-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-gray-800">{formattedDate}</h2>
          <span className="text-sm text-gray-400">{reservations.length}건</span>
        </div>
        <ReservationTimeline
          reservations={reservations}
          roomId={roomId}
          onRangeSelect={(start, end) => modalRef.current?.openWithRange(start, end)}
        />
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-5">
        <h3 className="font-semibold text-gray-800 mb-4">예약 목록</h3>

        {reservations.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-4xl mb-3">📭</p>
            <p className="text-gray-400 text-sm">예약된 회의가 없습니다</p>
          </div>
        ) : (
          <div className="space-y-3">
            {reservations.map((r) => (
              <div key={r.id} className="flex items-center gap-4 p-4 rounded-xl bg-gray-50">
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

      <div className="fixed bottom-6 right-6 z-10">
        <NewReservationModal
          ref={modalRef}
          roomId={roomId}
          roomName={roomName}
          date={selectedDate}
          roomColor={roomColor}
        />
      </div>
    </>
  )
}
