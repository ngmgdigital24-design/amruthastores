import { prisma } from '@/lib/prisma'
import AddToCartButton from './components/AddToCartButton'
import { Prisma } from '@prisma/client'

type SearchParams = { [key: string]: string | undefined }

export const dynamic = 'force-dynamic'

export default async function Page({ searchParams }: { searchParams: Promise<SearchParams> }) {
    const sp = await searchParams
    const q = sp.q?.trim() || ''
    const category = sp.category || undefined
    const inStockParam = sp.inStock
    const inStock = inStockParam === 'true' ? true : inStockParam === 'false' ? false : undefined
    const sort = (sp.sort || 'newest') as 'newest' | 'price_asc' | 'price_desc'

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
            : { OR: [{ quantity: 0 }, { productId: { equals: '' } }] }
    }

    const orderBy: Prisma.ProductOrderByWithRelationInput =
        sort === 'price_asc' ? { priceCents: Prisma.SortOrder.asc } :
        sort === 'price_desc' ? { priceCents: Prisma.SortOrder.desc } : 
        { createdAt: Prisma.SortOrder.desc }

	const [products, categories] = await Promise.all([
		prisma.product.findMany({
            where,
            orderBy,
            take: 100,
            include: {
                inventory: true,
                categories: { include: { category: true } },
                images: true,
            },
        }),
		prisma.category.findMany({ orderBy: { name: 'asc' } }),
	])

	return (
		<main className="container mx-auto py-10 px-4">
            <form method="get" className="mb-8 grid grid-cols-1 md:grid-cols-4 gap-3">
                <input name="q" placeholder="Search products" defaultValue={sp.q || ''} className="border rounded px-3 py-2" />
                <select name="category" defaultValue={sp.category || ''} className="border rounded px-3 py-2">
					<option value="">All categories</option>
					{categories.map((c) => (
						<option key={c.id} value={c.slug}>{c.name}</option>
					))}
				</select>
                <select name="sort" defaultValue={sp.sort || 'newest'} className="border rounded px-3 py-2">
					<option value="newest">Newest</option>
					<option value="price_asc">Price: Low to High</option>
					<option value="price_desc">Price: High to Low</option>
				</select>
                <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" name="inStock" value="true" defaultChecked={sp.inStock === 'true'} /> In stock only
				</label>
				<button className="bg-gray-900 text-white rounded px-4 py-2 md:col-span-4">Apply</button>
			</form>
			<h1 className="text-3xl font-bold text-center mb-8">Welcome to Ecommerce</h1>
			
			{products.length > 0 ? (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{products.map((product: any) => (
					<div key={product.id} className="bg-white/90 backdrop-blur rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden border border-slate-100">
						<a href={`/product/${product.slug}`} className="block">
						<div className="aspect-square bg-white flex items-center justify-center overflow-hidden">
							{(product.images?.[0]?.url) ? (
								<img
									src={product.images[0].url}
									alt={product.title}
									className="w-full h-full object-cover hover:scale-[1.02] transition-transform"
								/>
							) : (
								<span className="text-gray-500">No Image</span>
							)}
						</div>
						</a>
							<div className="p-4">
							<h3 className="font-semibold text-lg mb-2">
								<a href={`/product/${product.slug}`} className="hover:underline">{product.title}</a>
							</h3>
								<p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
                            <div className="flex justify-between items-center">
									<span className="text-xl font-bold text-indigo-700">
										₹{(product.priceCents / 100).toFixed(2)}
									</span>
                                {product.inventory?.quantity > 0 ? (
                                    <span className="text-sm text-gray-500">
                                        {product.inventory.quantity} in stock
                                    </span>
                                ) : (
                                    <span className="text-xs font-medium text-red-700 bg-red-100 px-2 py-1 rounded">
                                        Out of stock
                                    </span>
                                )}
								</div>
								<div className="mt-3">
									{product.categories?.map((cat: any) => (
										<span key={cat.category.id} className="inline-block bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded mr-2">
											{cat.category.name}
										</span>
									))}
								</div>
                            <div className="mt-4 flex items-center gap-3">
                                <AddToCartButton productId={product.id} disabled={(product.inventory?.quantity || 0) <= 0} />
									<a href="/checkout" className="px-3 py-2 border rounded text-sm hover:bg-slate-50">Checkout</a>
                            </div>
							</div>
						</div>
					))}
				</div>
			) : (
				<div className="text-center py-12">
					<p className="text-gray-600 text-lg">No products available at the moment.</p>
					<p className="text-gray-500 text-sm mt-2">Check back later for new items!</p>
				</div>
			)}
		</main>
	);
}
