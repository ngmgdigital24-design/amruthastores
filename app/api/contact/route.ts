import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Simple email via mailto fallback: in real apps, integrate a provider (SendGrid, SES)
function buildMailto(name: string, email: string, message: string) {
  const subject = encodeURIComponent(`[Contact] ${name}`)
  const body = encodeURIComponent(`From: ${name} <${email}>\n\n${message}`)
  return `mailto:support@example.com?subject=${subject}&body=${body}`
}

export async function POST(request: Request) {
  try {
    console.info('[contact] incoming')
    const data = await request.json()
    const name = String(data.name || '').trim()
    const email = String(data.email || '').trim()
    const message = String(data.message || '').trim()
    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }

    // Save in DB
    const saved = await (prisma as any).contactMessage.create({
      data: { name, email, message },
    })

    console.info('[contact] saved', { id: saved.id })
    // Return both DB id and a mailto link the client could open
    return NextResponse.json({ id: saved.id, mailto: buildMailto(name, email, message) }, { status: 201 })
  } catch (error: any) {
    console.error('[contact] error', error)
    return NextResponse.json({ error: 'Unable to save message', details: error?.message }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    const data = await request.json()
    const id = String(data.id || '')
    const handled = Boolean(data.handled)
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })
    const updated = await (prisma as any).contactMessage.update({ where: { id }, data: { handled } })
    return NextResponse.json({ ok: true, handled: updated.handled })
  } catch (error: any) {
    return NextResponse.json({ error: 'Unable to update', details: error?.message }, { status: 500 })
  }
}


