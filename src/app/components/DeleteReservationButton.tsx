'use client'

import { useActionState, useState } from 'react'
import { deleteReservation } from '@/app/actions'
import type { ActionState } from '@/lib/types'

export default function DeleteReservationButton({ id }: { id: string }) {
  const [state, action, pending] = useActionState<ActionState, FormData>(deleteReservation, null)
  const [open, setOpen] = useState(false)
  const [pin, setPin] = useState('')

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="text-sm text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors"
      >
        예약취소
      </button>
    )
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <form action={action} className="flex items-center gap-1.5">
        <input type="hidden" name="id" value={id} />
        <input
          type="password"
          name="pin"
          inputMode="numeric"
          pattern="[0-9]{4}"
          maxLength={4}
          value={pin}
          onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
          placeholder="비밀번호"
          autoFocus
          required
          className="w-20 border border-gray-300 rounded-lg px-2 py-1 text-xs outline-none focus:ring-2 focus:ring-red-400"
        />
        <button
          type="submit"
          disabled={pending || pin.length !== 4}
          className="text-xs text-red-600 font-semibold px-2 py-1.5 rounded-lg hover:bg-red-50 disabled:opacity-40 transition-colors"
        >
          {pending ? '취소 중…' : '확인'}
        </button>
        <button
          type="button"
          onClick={() => {
            setOpen(false)
            setPin('')
          }}
          className="text-xs text-gray-400 px-1.5 py-1.5 hover:text-gray-600"
        >
          ✕
        </button>
      </form>
      {state?.error && <p className="text-xs text-red-500">{state.error}</p>}
    </div>
  )
}
