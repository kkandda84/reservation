'use client'

import { useRef, useState } from 'react'
import type { Reservation, RoomId } from '@/lib/types'

const START_HOUR = 8
const END_HOUR = 18
const TOTAL_MINUTES = (END_HOUR - START_HOUR) * 60
const SNAP_MINUTES = 30

function toMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number)
  return h * 60 + m
}

function toPct(time: string): number {
  const offset = toMinutes(time) - START_HOUR * 60
  return Math.max(0, Math.min(100, (offset / TOTAL_MINUTES) * 100))
}

function minutesToTime(minutesFromStart: number): string {
  const total = START_HOUR * 60 + minutesFromStart
  const h = Math.floor(total / 60)
  const m = total % 60
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}

function timeFromClientX(clientX: number, rect: DOMRect): string {
  const pct = rect.width === 0 ? 0 : Math.max(0, Math.min(1, (clientX - rect.left) / rect.width))
  const snapped = Math.round((pct * TOTAL_MINUTES) / SNAP_MINUTES) * SNAP_MINUTES
  return minutesToTime(Math.max(0, Math.min(TOTAL_MINUTES, snapped)))
}

const HOUR_MARKS = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18]

const BAR_COLORS: Record<RoomId, string> = {
  large: 'bg-blue-500',
  medium: 'bg-emerald-500',
  small: 'bg-purple-500',
}

const SELECTION_COLORS: Record<RoomId, string> = {
  large: 'bg-blue-300 border-blue-600',
  medium: 'bg-emerald-300 border-emerald-600',
  small: 'bg-purple-300 border-purple-600',
}

interface Props {
  reservations: Reservation[]
  roomId: RoomId
  onRangeSelect?: (startTime: string, endTime: string) => void
}

export default function ReservationTimeline({ reservations, roomId, onRangeSelect }: Props) {
  const trackRef = useRef<HTMLDivElement>(null)
  const [drag, setDrag] = useState<{ anchor: string; current: string } | null>(null)

  const barColor = BAR_COLORS[roomId]
  const selectionColor = SELECTION_COLORS[roomId]
  const interactive = Boolean(onRangeSelect)

  function handlePointerDown(e: React.PointerEvent<HTMLDivElement>) {
    if (!interactive) return
    const rect = trackRef.current?.getBoundingClientRect()
    if (!rect) return
    const time = timeFromClientX(e.clientX, rect)
    setDrag({ anchor: time, current: time })
    e.currentTarget.setPointerCapture(e.pointerId)
  }

  function handlePointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (!drag) return
    const rect = trackRef.current?.getBoundingClientRect()
    if (!rect) return
    const time = timeFromClientX(e.clientX, rect)
    setDrag((d) => (d ? { ...d, current: time } : d))
  }

  function finishDrag() {
    if (!drag) return
    let start = drag.anchor
    let end = drag.current
    if (start > end) [start, end] = [end, start]
    if (start === end) {
      end = minutesToTime(Math.min(TOTAL_MINUTES, toMinutes(start) - START_HOUR * 60 + SNAP_MINUTES))
    }
    setDrag(null)
    onRangeSelect?.(start, end)
  }

  const selStart = drag && drag.anchor < drag.current ? drag.anchor : drag?.current
  const selEnd = drag && drag.anchor < drag.current ? drag.current : drag?.anchor
  const selLeft = selStart ? toPct(selStart) : 0
  const selWidth = selStart && selEnd ? Math.max(toPct(selEnd) - toPct(selStart), 0.5) : 0

  return (
    <div>
      <div
        ref={trackRef}
        className={`relative h-5 bg-gray-100 rounded-full overflow-hidden ${
          interactive ? 'cursor-pointer touch-none select-none' : ''
        }`}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={finishDrag}
        onPointerCancel={() => setDrag(null)}
      >
        {reservations.map((r) => {
          const left = toPct(r.startTime)
          const width = toPct(r.endTime) - left
          return (
            <div
              key={r.id}
              className={`absolute top-0 h-full ${barColor} opacity-80`}
              style={{ left: `${left}%`, width: `${width}%` }}
              title={`${r.startTime}~${r.endTime} ${r.title}`}
            />
          )
        })}
        {drag && (
          <div
            className={`absolute top-0 h-full border-2 ${selectionColor} opacity-70 pointer-events-none`}
            style={{ left: `${selLeft}%`, width: `${selWidth}%` }}
          />
        )}
      </div>
      <div className="flex justify-between mt-1 px-0.5">
        {HOUR_MARKS.map((h) => (
          <span key={h} className="text-[10px] text-gray-400">
            {h}
          </span>
        ))}
      </div>
      {interactive && (
        <p className="text-[11px] text-gray-400 mt-1.5">
          타임라인을 드래그하면 그 시간으로 예약을 만들 수 있어요
        </p>
      )}
    </div>
  )
}
