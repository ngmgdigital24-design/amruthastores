"use client"
import { useState } from 'react'

export default function ContactPage() {
    const [status, setStatus] = useState<string | null>(null)

    async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        const form = e.currentTarget
        const formData = new FormData(form)
        const payload = {
            name: String(formData.get('name') || ''),
            email: String(formData.get('email') || ''),
            message: String(formData.get('message') || ''),
        }
        try {
            const res = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
            if (!res.ok) throw new Error('Request failed')
            const data = await res.json()
            setStatus('Message sent! Saved with id ' + data.id)
            // Optional: open default mail client too
            if (data.mailto) {
                window.location.href = data.mailto
            }
            form.reset()
        } catch (err) {
            setStatus('Failed to send message')
        }
    }

    return (
        <main className="container mx-auto py-10 px-4">
            <h1 className="text-2xl font-semibold mb-4">Contact Us</h1>
            <p className="text-gray-700 mb-6">We'd love to hear from you. Send us a message and we'll get back soon.</p>
            <form className="grid gap-3 max-w-lg" onSubmit={onSubmit}>
                <input name="name" className="border rounded px-3 py-2" placeholder="Your name" required />
                <input name="email" type="email" className="border rounded px-3 py-2" placeholder="Your email" required />
                <textarea name="message" className="border rounded px-3 py-2" rows={5} placeholder="Message" required />
                <button className="px-4 py-2 bg-gray-900 text-white rounded w-max">Send</button>
                {status && <div className="text-sm text-gray-700">{status}</div>}
            </form>
        </main>
    )
}



