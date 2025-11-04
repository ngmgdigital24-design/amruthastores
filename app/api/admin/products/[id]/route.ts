import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id
    const body = await request.json()
    const quantity = typeof body.quantity === 'number' ? body.quantity : undefined
    const active = typeof body.active === 'boolean' ? body.active : undefined

    if (quantity === undefined && active === undefined) {
      return NextResponse.json({ error: 'No fields to update' }, { status: 400 })
    }

    const updates: any = {}
    if (active !== undefined) updates.active = active

    const result = await prisma.$transaction(async (tx) => {
      if (quantity !== undefined) {
        await tx.inventory.upsert({
          where: { productId: id },
          update: { quantity },
          create: { productId: id, quantity },
        })
      }
      if (Object.keys(updates).length > 0) {
        await tx.product.update({ where: { id }, data: updates })
      }
      return tx.product.findUnique({ where: { id }, include: { inventory: true } })
    })

    return NextResponse.json({ ok: true, product: result })
  } catch (error: any) {
    return NextResponse.json({ error: 'Update failed', details: error?.message }, { status: 500 })
  }
}


