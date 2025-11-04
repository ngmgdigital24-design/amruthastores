"use client"
import { useState } from 'react'

export default function ToggleHandled({ id, defaultChecked }: { id: string; defaultChecked: boolean }) {
  const [checked, setChecked] = useState(defaultChecked)
  const [busy, setBusy] = useState(false)
  async function onToggle() {
    try {
      setBusy(true)
      const res = await fetch('/api/contact', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, handled: !checked }) })
      if (!res.ok) throw new Error('Failed')
      setChecked(!checked)
    } catch {
      // ignore
    } finally {
      setBusy(false)
    }
  }
  return (
    <label className="inline-flex items-center gap-2 text-sm">
      <input type="checkbox" checked={checked} onChange={onToggle} disabled={busy} />
      <span>{checked ? 'Yes' : 'No'}</span>
    </label>
  )
}


