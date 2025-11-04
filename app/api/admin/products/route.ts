import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

type CreateProductBody = {
  title: string
  description: string
  priceCents: number
  currency?: string
  categories?: string[] // category names
  images?: string[]
  quantity?: number
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<CreateProductBody>
    const title = String(body.title || '').trim()
    const description = String(body.description || '').trim()
    const priceCents = Number(body.priceCents)
    const currency = (body.currency || 'INR').toString()
    const categories = Array.isArray(body.categories) ? body.categories : []
    const images = Array.isArray(body.images) ? body.images : []
    const quantity = Number.isFinite(body.quantity) ? Number(body.quantity) : 0

    if (!title || !description || !Number.isFinite(priceCents) || priceCents < 0) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
    }

    // Minimal slugify identical to prisma/seed.ts util
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')

    // Ensure categories exist
    const categoryIds: string[] = []
    for (const name of categories) {
      const catSlug = name
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
      const cat = await prisma.category.upsert({
        where: { slug: catSlug },
        update: {},
        create: { name, slug: catSlug },
        select: { id: true },
      })
      categoryIds.push(cat.id)
    }

    const created = await prisma.product.create({
      data: {
        title,
        slug,
        description,
        priceCents,
        currency,
        categories: { create: categoryIds.map((id) => ({ categoryId: id })) },
        images: { create: images.map((url, i) => ({ url, sortOrder: i })) },
        inventory: { create: { quantity: Math.max(0, quantity) } },
      },
      include: { inventory: true, categories: { include: { category: true } }, images: true },
    })

    return NextResponse.json({ ok: true, product: created }, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to create product', details: error?.message }, { status: 500 })
  }
}


