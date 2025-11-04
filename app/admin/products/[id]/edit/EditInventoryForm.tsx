"use client"
import { useState } from 'react'

export default function EditInventoryForm({ productId, initialQuantity, initialActive }: { productId: string; initialQuantity: number; initialActive: boolean }) {
  const [quantity, setQuantity] = useState<number>(initialQuantity)
  const [active, setActive] = useState<boolean>(initialActive)
  const [status, setStatus] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  async function onSave() {
    try {
      setSaving(true)
      setStatus(null)
      const res = await fetch(`/api/admin/products/${productId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity, active }),
      })
      if (!res.ok) throw new Error('Failed')
      setStatus('Saved')
    } catch {
      setStatus('Save failed')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="bg-white rounded border p-6 max-w-xl">
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Quantity</label>
        <input type="number" className="border rounded px-3 py-2 w-full" value={quantity} onChange={e=>setQuantity(Number(e.target.value))} />
      </div>
      <div className="mb-4">
        <label className="inline-flex items-center gap-2 text-sm">
          <input type="checkbox" checked={active} onChange={e=>setActive(e.target.checked)} />
          Active (visible)
        </label>
      </div>
      <button onClick={onSave} disabled={saving} className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-60">{saving ? 'Saving...' : 'Save changes'}</button>
      {status && <div className="mt-3 text-sm text-gray-700">{status}</div>}
    </div>
  )
}


