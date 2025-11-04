export default function HomeLanding() {
    return (
        <main className="container mx-auto py-16 px-4">
            <section className="text-center mb-10">
                <h1 className="text-4xl font-extrabold mb-3">Amrutha NextGen Stores</h1>
                <p className="text-gray-600">Discover apparel, shoes, and accessories with a modern shopping experience.</p>
            </section>

            <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <a href="/products" className="block bg-white shadow rounded p-6 hover:shadow-md transition">
                    <h3 className="text-lg font-semibold mb-2">Browse Products</h3>
                    <p className="text-gray-600 text-sm">Explore the latest items with filters and sorting.</p>
                </a>
                <a href="/categories" className="block bg-white shadow rounded p-6 hover:shadow-md transition">
                    <h3 className="text-lg font-semibold mb-2">Shop by Category</h3>
                    <p className="text-gray-600 text-sm">Find items faster by browsing categories.</p>
                </a>
                <a href="/cart" className="block bg-white shadow rounded p-6 hover:shadow-md transition">
                    <h3 className="text-lg font-semibold mb-2">View Cart</h3>
                    <p className="text-gray-600 text-sm">Review items added to your cart and checkout later.</p>
                </a>
            </section>
        </main>
    )
}



