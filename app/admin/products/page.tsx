import { prisma } from '@/lib/prisma'

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: 'desc' },
    include: { inventory: true },
    take: 100,
  })

  return (
    <main className="container mx-auto py-10 px-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Products</h1>
        <a href="/admin/products/new" className="px-4 py-2 bg-blue-600 text-white rounded">New Product</a>
      </div>
      {products.length === 0 ? (
        <p className="text-gray-600">No products yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border rounded">
            <thead className="bg-gray-50 text-left text-sm">
              <tr>
                <th className="p-3 border-b">Title</th>
                <th className="p-3 border-b">Price</th>
                <th className="p-3 border-b">Stock</th>
                <th className="p-3 border-b">Status</th>
                <th className="p-3 border-b">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {products.map(p => (
                <tr key={p.id}>
                  <td className="p-3 border-b">{p.title}</td>
                  <td className="p-3 border-b">₹{(p.priceCents/100).toFixed(2)}</td>
                  <td className="p-3 border-b">{p.inventory?.quantity ?? 0}</td>
                  <td className="p-3 border-b">{p.active ? 'Active' : 'Inactive'}</td>
                  <td className="p-3 border-b">
                    <a href={`/admin/products/${p.id}/edit`} className="text-blue-700 hover:underline">Edit</a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  )
}
