import { prisma } from '@/lib/prisma'

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: 'desc' },
    include: { items: true },
    take: 100,
  })

  return (
    <main className="container mx-auto py-10 px-4">
      <h1 className="text-2xl font-semibold mb-6">Orders</h1>
      {orders.length === 0 ? (
        <p className="text-gray-600">No orders yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border rounded">
            <thead className="bg-gray-50 text-left text-sm">
              <tr>
                <th className="p-3 border-b">When</th>
                <th className="p-3 border-b">Order ID</th>
                <th className="p-3 border-b">Status</th>
                <th className="p-3 border-b">Total</th>
                <th className="p-3 border-b">Items</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {orders.map(o => (
                <tr key={o.id} className="align-top">
                  <td className="p-3 border-b whitespace-nowrap">{new Date(o.createdAt).toLocaleString()}</td>
                  <td className="p-3 border-b"><a href={`/admin/orders/${o.id}`} className="text-blue-700 hover:underline">{o.id}</a></td>
                  <td className="p-3 border-b">{o.status}</td>
                  <td className="p-3 border-b">₹{(o.totalCents/100).toFixed(2)}</td>
                  <td className="p-3 border-b">{o.items.reduce((sum, it) => sum + it.quantity, 0)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  )
}


