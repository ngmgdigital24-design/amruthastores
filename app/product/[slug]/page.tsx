import { prisma } from '@/lib/prisma'
import AddToCartButton from '../../components/AddToCartButton'

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params
    const product = await prisma.product.findUnique({
        where: { slug },
        include: {
            images: true,
            inventory: true,
            categories: { include: { category: true } },
        },
    })

    if (!product) {
        return (
            <main className="container mx-auto py-10 px-4">
                <h1 className="text-2xl font-semibold">Product not found</h1>
            </main>
        )
    }

    return (
        <main className="container mx-auto py-10 px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <div className="aspect-square bg-white rounded-lg overflow-hidden shadow-sm border border-slate-100">
                        {product.images?.[0]?.url ? (
                            <img src={product.images[0].url} alt={product.title} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-500">No Image</div>
                        )}
                    </div>
                    {product.images?.length > 1 && (
                        <div className="flex gap-2 mt-3">
                            {product.images.slice(1).map((img) => (
                                <img key={img.id} src={img.url} alt={product.title} className="w-16 h-16 object-cover rounded" />
                            ))}
                        </div>
                    )}
                </div>

                <div>
                    <h1 className="text-3xl font-bold mb-2 text-indigo-800">{product.title}</h1>
                    <p className="text-gray-600 mb-4">{product.description}</p>
                    <div className="text-2xl font-bold text-indigo-700 mb-2">₹{(product.priceCents / 100).toFixed(2)}</div>
                    <div className="mb-4">
                        {product.inventory?.quantity && product.inventory.quantity > 0 ? (
                            <span className="text-sm text-gray-500">{product.inventory.quantity} in stock</span>
                        ) : (
                            <span className="text-xs font-medium text-red-700 bg-red-100 px-2 py-1 rounded">Out of stock</span>
                        )}
                    </div>
                    <div className="mb-4">
                        {product.categories?.map((cat) => (
                            <span key={cat.category.id} className="inline-block bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded mr-2">
                                {cat.category.name}
                            </span>
                        ))}
                    </div>
                    <div className="mt-4 flex items-center gap-3">
                        <AddToCartButton productId={product.id} disabled={(product.inventory?.quantity ?? 0) <= 0} />
                        <a href="/checkout" className="px-3 py-2 border rounded text-sm">Checkout</a>
                    </div>
                </div>
            </div>

        </main>
    )
}


