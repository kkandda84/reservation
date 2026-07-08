import type { Reservation, RoomId } from '@/lib/types'

const START_HOUR = 8
const END_HOUR = 18
const TOTAL_MINUTES = (END_HOUR - START_HOUR) * 60

function toMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number)
  return h * 60 + m
}

function toPct(time: string): number {
  const offset = toMinutes(time) - START_HOUR * 60
  return Math.max(0, Math.min(100, (offset / TOTAL_MINUTES) * 100))
}

const HOUR_MARKS = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18]

const BAR_COLORS: Record<RoomId, string> = {
  large: 'bg-blue-500',
  medium: 'bg-emerald-500',
  small: 'bg-purple-500',
}

interface Props {
  reservations: Reservation[]
  roomId: RoomId
}

export default function ReservationTimeline({ reservations, roomId }: Props) {
  const barColor = BAR_COLORS[roomId]

  return (
    <div>
      <div className="relative h-5 bg-gray-100 rounded-full overflow-hidden">
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
      </div>
      <div className="flex justify-between mt-1 px-0.5">
        {HOUR_MARKS.map((h) => (
          <span key={h} className="text-[10px] text-gray-400">
            {h}
          </span>
        ))}
      </div>
    </div>
  )
}
