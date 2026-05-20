'use client'

import { useActionState } from 'react'
import { deleteReservation } from '@/app/actions'
import type { ActionState } from '@/lib/types'

export default function DeleteReservationButton({ id }: { id: string }) {
  const [state, action, pending] = useActionState<ActionState, FormData>(
    deleteReservation,
    null
  )

  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!confirm('이 예약을 취소하시겠습니까?')) e.preventDefault()
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        disabled={pending}
        className="text-sm text-red-500 hover:text-red-700 hover:bg-red-50 disabled:opacity-40 px-3 py-1.5 rounded-lg transition-colors"
      >
        {pending ? '취소 중…' : '예약취소'}
      </button>
      {state?.error && (
        <p className="text-xs text-red-500 mt-1">{state.error}</p>
      )}
    </form>
  )
}
