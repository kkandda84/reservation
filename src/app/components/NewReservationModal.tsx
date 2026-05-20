'use client'

import { useActionState, useEffect, useRef } from 'react'
import { createReservation } from '@/app/actions'
import type { ActionState, RoomId } from '@/lib/types'

function generateTimes(startH: number, startM: number, endH: number, endM: number): string[] {
  const times: string[] = []
  let h = startH
  let m = startM
  while (h < endH || (h === endH && m <= endM)) {
    times.push(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`)
    m += 30
    if (m >= 60) {
      m = 0
      h++
    }
  }
  return times
}

const START_TIMES = generateTimes(8, 0, 17, 30)
const END_TIMES = generateTimes(8, 30, 18, 0)

interface Props {
  roomId: RoomId
  roomName: string
  date: string
  roomColor: 'blue' | 'emerald'
  compact?: boolean
}

export default function NewReservationModal({ roomId, roomName, date, roomColor, compact }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const formRef = useRef<HTMLFormElement>(null)
  const [state, action, pending] = useActionState<ActionState, FormData>(createReservation, null)

  useEffect(() => {
    if (state?.success) {
      dialogRef.current?.close()
      formRef.current?.reset()
    }
  }, [state?.success])

  const btnBase =
    roomColor === 'blue'
      ? 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
      : 'bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-500'

  const focusRing =
    roomColor === 'blue' ? 'focus:ring-blue-500' : 'focus:ring-emerald-500'

  return (
    <>
      <button
        onClick={() => dialogRef.current?.showModal()}
        className={
          compact
            ? `${btnBase} text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors`
            : `${btnBase} text-white px-6 py-3 rounded-full shadow-lg font-semibold text-sm transition-colors`
        }
      >
        + 새 예약
      </button>

      <dialog
        ref={dialogRef}
        className="rounded-2xl shadow-2xl p-0 w-[calc(100vw-2rem)] max-w-md m-auto"
        onClick={(e) => {
          if (e.target === dialogRef.current) dialogRef.current?.close()
        }}
      >
        <div className="p-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-gray-900">새 예약</h2>
              <p className="text-sm text-gray-500 mt-0.5">
                {roomName} · {date}
              </p>
            </div>
            <button
              type="button"
              onClick={() => dialogRef.current?.close()}
              className="text-gray-400 hover:text-gray-600 text-xl leading-none p-1"
            >
              ✕
            </button>
          </div>

          <form ref={formRef} action={action} className="space-y-4">
            <input type="hidden" name="roomId" value={roomId} />
            <input type="hidden" name="date" value={date} />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                회의 제목 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                required
                placeholder="예: 주간 팀 미팅"
                className={`w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 ${focusRing} focus:border-transparent`}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                예약자 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="bookedBy"
                required
                placeholder="이름을 입력하세요"
                className={`w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 ${focusRing} focus:border-transparent`}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  시작 시간 <span className="text-red-500">*</span>
                </label>
                <select
                  name="startTime"
                  required
                  defaultValue="09:00"
                  className={`w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 ${focusRing} focus:border-transparent`}
                >
                  {START_TIMES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  종료 시간 <span className="text-red-500">*</span>
                </label>
                <select
                  name="endTime"
                  required
                  defaultValue="10:00"
                  className={`w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 ${focusRing} focus:border-transparent`}
                >
                  {END_TIMES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {state?.error && (
              <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-600">
                {state.error}
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => dialogRef.current?.close()}
                className="flex-1 px-4 py-2.5 rounded-xl border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                취소
              </button>
              <button
                type="submit"
                disabled={pending}
                className={`flex-1 px-4 py-2.5 rounded-xl text-sm font-medium text-white transition-colors disabled:opacity-60 ${btnBase}`}
              >
                {pending ? '예약 중…' : '예약하기'}
              </button>
            </div>
          </form>
        </div>
      </dialog>
    </>
  )
}
