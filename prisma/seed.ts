import { PrismaClient } from '@prisma/client'

function slugify(input: string): string {
	return input
		.toLowerCase()
		.replace(/[^a-z0-9\s-]/g, '')
		.trim()
		.replace(/\s+/g, '-')
		.replace(/-+/g, '-')
}

const prisma = new PrismaClient()

async function main() {
	const categories = [
		{ name: 'T-Shirts' },
		{ name: 'Shoes' },
		{ name: 'Accessories' },
	]

	const catMap: Record<string, string> = {}
	for (const c of categories) {
		const slug = slugify(c.name)
		const cat = await prisma.category.upsert({
			where: { slug },
			update: {},
			create: { name: c.name, slug },
		})
		catMap[c.name] = cat.id
	}

	const products = [
		{ title: 'Classic Cotton Tee', description: 'Soft, breathable tee', priceCents: 79900, currency: 'INR', categories: ['T-Shirts'], quantity: 25, images: ['https://picsum.photos/seed/tee/800/800'] },
		{ title: 'Running Shoes', description: 'Lightweight daily runners', priceCents: 349900, currency: 'INR', categories: ['Shoes'], quantity: 12, images: ['https://picsum.photos/seed/shoes/800/800'] },
		{ title: 'Leather Belt', description: 'Full-grain leather', priceCents: 149900, currency: 'INR', categories: ['Accessories'], quantity: 5, images: ['https://picsum.photos/seed/belt/800/800'] },
	]

	for (const p of products) {
		const slug = slugify(p.title)
		const created = await prisma.product.upsert({
			where: { slug },
			update: {},
			create: {
				title: p.title,
				slug,
				description: p.description,
				priceCents: p.priceCents,
				currency: p.currency,
				categories: {
					create: p.categories.map((name) => ({ categoryId: catMap[name] }))
				},
			},
			include: { images: true },
		})
		// ensure at least one image
		if ((created.images?.length ?? 0) === 0) {
			await prisma.productImage.createMany({
				data: p.images.map((url, i) => ({ productId: created.id, url, sortOrder: i }))
			})
		}
		await prisma.inventory.upsert({
			where: { productId: created.id },
			update: { quantity: p.quantity },
			create: { productId: created.id, quantity: p.quantity },
		})
	}

	console.log('Seed complete')
}

main().finally(async () => {
	await prisma.$disconnect()
})
