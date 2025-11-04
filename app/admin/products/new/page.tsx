"use client"
import { useState } from 'react'

export default function NewProductPage() {
  const [status, setStatus] = useState<string | null>(null)
  const [previews, setPreviews] = useState<string[]>([])

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const fd = new FormData(form)
    const payload = {
      title: String(fd.get('title') || ''),
      description: String(fd.get('description') || ''),
      priceCents: Math.round(Number(fd.get('price') || 0) * 100),
      currency: String(fd.get('currency') || 'INR'),
      categories: String(fd.get('categories') || '').split(',').map(s => s.trim()).filter(Boolean),
      images: String(fd.get('images') || '').split(',').map(s => s.trim()).filter(Boolean),
      quantity: Number(fd.get('quantity') || 0),
    }
    try {
      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error('Failed')
      const data = await res.json()
      setStatus('Created: ' + data.product.title)
      form.reset()
    } catch (err) {
      setStatus('Failed to create product')
    }
  }

  async function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return
    const uploadedUrls: string[] = []
    for (const f of files) {
      const formData = new FormData()
      formData.append('file', f)
      const res = await fetch('/api/uploads', { method: 'POST', body: formData })
      if (!res.ok) continue
      const data = await res.json()
      if (data.url) uploadedUrls.push(data.url)
    }
    // merge with existing images field
    const imagesInput = (document.querySelector('input[name="images"]') as HTMLInputElement)
    const existing = imagesInput.value ? imagesInput.value.split(',').map(s=>s.trim()).filter(Boolean) : []
    const merged = Array.from(new Set([...existing, ...uploadedUrls]))
    imagesInput.value = merged.join(',')
    setPreviews(merged)
    setStatus(`Uploaded ${uploadedUrls.length} file(s)`) 
  }

  return (
    <main className="container mx-auto py-10 px-4">
      <h1 className="text-2xl font-semibold mb-4">Create Product</h1>
      <form onSubmit={onSubmit} className="grid gap-3 max-w-2xl">
        <input name="title" className="border rounded px-3 py-2" placeholder="Title" required />
        <textarea name="description" className="border rounded px-3 py-2" rows={4} placeholder="Description" required />
        <div className="grid grid-cols-2 gap-3">
          <input name="price" type="number" step="0.01" className="border rounded px-3 py-2" placeholder="Price (e.g. 799.00)" required />
          <input name="currency" className="border rounded px-3 py-2" defaultValue="INR" placeholder="Currency" />
        </div>
        <input name="categories" className="border rounded px-3 py-2" placeholder="Categories (comma separated)" />
        <input name="images" className="border rounded px-3 py-2" placeholder="Image URLs (comma separated)" />
        <div className="border rounded p-3">
          <label className="text-sm block mb-2">Upload Images</label>
          <input type="file" multiple accept="image/*" onChange={onFileChange} />
          {previews.length > 0 && (
            <div className="grid grid-cols-4 gap-2 mt-3">
              {previews.map((url) => (
                <img key={url} src={url} alt="preview" className="w-full h-20 object-cover rounded" />
              ))}
            </div>
          )}
        </div>
        <input name="quantity" type="number" className="border rounded px-3 py-2" placeholder="Quantity" defaultValue={0} />
        <button className="px-4 py-2 bg-blue-600 text-white rounded w-max">Create</button>
        {status && <div className="text-sm text-gray-700">{status}</div>}
      </form>
    </main>
  )
}


