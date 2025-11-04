import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

type OrderItemInput = { productId: string; quantity: number }

export async function POST(request: Request) {
  try {
    console.info('[orders] incoming');
    const data = await request.json()
    const items = Array.isArray(data.items) ? (data.items as OrderItemInput[]) : []
    const paymentProvider = (data.paymentProvider || 'COD') as string
    const shippingAddress = data.shippingAddress as any | undefined
    const billingAddress = data.billingAddress as any | undefined
    if (items.length === 0) return NextResponse.json({ error: 'No items' }, { status: 400 })

    // Load products
    const productIds = Array.from(new Set(items.map(i => i.productId)))
    const products = await prisma.product.findMany({ where: { id: { in: productIds } }, include: { inventory: true } })
    const productMap = new Map(products.map(p => [p.id, p]))

    // Validate stock and compute totals
    let totalCents = 0
    for (const { productId, quantity } of items) {
      const p = productMap.get(productId)
      if (!p) return NextResponse.json({ error: `Product not found: ${productId}` }, { status: 400 })
      if (!p.inventory || p.inventory.quantity < quantity) {
        return NextResponse.json({ error: `Insufficient stock for ${p.title}` }, { status: 409 })
      }
      totalCents += p.priceCents * quantity
    }

    // Create order and decrement stock atomically
    const order = await prisma.$transaction(async (tx) => {
      const created = await tx.order.create({
        data: { totalCents, currency: 'INR', status: paymentProvider === 'CARD' ? 'PAID' : 'PENDING', paymentProvider },
      })
      for (const { productId, quantity } of items) {
        const p = productMap.get(productId)!
        await tx.orderItem.create({
          data: {
            orderId: created.id,
            productId,
            titleSnapshot: p.title,
            priceCentsSnapshot: p.priceCents,
            quantity,
          },
        })
        await tx.inventory.update({ where: { productId }, data: { quantity: { decrement: quantity } } })
      }
      if (shippingAddress) {
        await tx.address.create({ data: {
          orderId: created.id, type: 'SHIPPING',
          line1: shippingAddress.line1 || '', line2: shippingAddress.line2 || null,
          city: shippingAddress.city || '', state: shippingAddress.state || '',
          postalCode: shippingAddress.postalCode || '', country: shippingAddress.country || 'IN',
          phone: shippingAddress.phone || null,
        }})
      }
      if (billingAddress) {
        await tx.address.create({ data: {
          orderId: created.id, type: 'BILLING',
          line1: billingAddress.line1 || '', line2: billingAddress.line2 || null,
          city: billingAddress.city || '', state: billingAddress.state || '',
          postalCode: billingAddress.postalCode || '', country: billingAddress.country || 'IN',
          phone: billingAddress.phone || null,
        }})
      }
      return created
    })
    console.info('[orders] created', { orderId: order.id, totalCents })
    return NextResponse.json({ ok: true, orderId: order.id, totalCents }, { status: 201 })
  } catch (error: any) {
    console.error('[orders] error', error)
    return NextResponse.json({ error: 'Failed to place order', details: error?.message }, { status: 500 })
  }
}


