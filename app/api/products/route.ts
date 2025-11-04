import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'

function parseIntSafe(value: string | null, defaultValue: number) {
	const n = value ? parseInt(value, 10) : NaN
	return Number.isFinite(n) && n > 0 ? n : defaultValue
}

export async function GET(request: Request) {
	try {
        console.info('[products] request', { url: request.url });
		
		const { searchParams } = new URL(request.url)
		const q = searchParams.get('q')?.trim() || ''
		const page = parseIntSafe(searchParams.get('page'), 1)
		const pageSize = Math.min(parseIntSafe(searchParams.get('pageSize'), 20), 100)
		const skip = (page - 1) * pageSize
		const sort = (searchParams.get('sort') || 'newest') as 'newest' | 'price_asc' | 'price_desc'
		const category = searchParams.get('category') || undefined
		const inStockParam = searchParams.get('inStock')
		const inStock = inStockParam === 'true' ? true : inStockParam === 'false' ? false : undefined

		const where: any = { active: true }
		if (q) {
			where.OR = [
				{ title: { contains: q, mode: 'insensitive' } },
				{ description: { contains: q, mode: 'insensitive' } },
			]
		}
		if (category) {
			where.categories = { some: { category: { slug: category } } }
		}
		if (typeof inStock === 'boolean') {
			where.inventory = inStock
				? { quantity: { gt: 0 } }
				: { OR: [{ quantity: 0 }, { productId: { equals: '' } }] } // placeholder to allow zero match; SQLite needs explicit check
		}

		const orderBy: Prisma.ProductOrderByWithRelationInput =
			sort === 'price_asc' ? { priceCents: Prisma.SortOrder.asc } :
			sort === 'price_desc' ? { priceCents: Prisma.SortOrder.desc } : { createdAt: Prisma.SortOrder.desc }

        const [items, total] = await Promise.all([
            prisma.product.findMany({
                where,
                skip,
                take: pageSize,
                orderBy,
                include: {
                    inventory: true,
                    categories: { include: { category: true } },
                    images: true,
                },
            }),
            prisma.product.count({ where }),
        ])

        console.info('[products] response', { page, pageSize, total });
        return NextResponse.json({ page, pageSize, total, items })
	} catch (error) {
        console.error('[products] error', error);
		const errorMessage = error instanceof Error ? error.message : 'Unknown error';
		return NextResponse.json({ error: 'Internal server error', details: errorMessage }, { status: 500 });
	}
}
