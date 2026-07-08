'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { formatDateShort } from '@/lib/date'

interface Props {
  dates: string[]
  selectedDate: string
  today: string
}

export default function DateSelector({ dates, selectedDate, today }: Props) {
  const router = useRouter()

  return (
    <div className="flex flex-wrap items-center justify-between gap-2 mb-6">
      <div className="flex flex-wrap gap-2">
        {dates.map((date) => {
          const isSelected = date === selectedDate
          const isToday = date === today
          return (
            <Link
              key={date}
              href={`/?date=${date}`}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                isSelected
                  ? 'bg-slate-800 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {isToday ? `오늘 ${formatDateShort(date).split(' ')[0]}` : formatDateShort(date)}
            </Link>
          )
        })}
      </div>
      <input
        type="date"
        value={selectedDate}
        onChange={(e) => {
          if (e.target.value) router.push(`/?date=${e.target.value}`)
        }}
        aria-label="날짜 직접 선택"
        className="flex-shrink-0 border border-gray-200 rounded-full px-3 py-2 text-sm text-gray-600 bg-white outline-none focus:ring-2 focus:ring-gray-300"
      />
    </div>
  )
}
