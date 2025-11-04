import { prisma } from '@/lib/prisma'

export default async function AdminOrderDetail({ params }: { params: { id: string } }) {
  const order = await prisma.order.findUnique({
    where: { id: params.id },
    include: { items: { include: { product: true } }, addresses: true },
  })
  if (!order) {
    return (
      <main className="container mx-auto py-10 px-4">
        <h1 className="text-2xl font-semibold">Order not found</h1>
      </main>
    )
  }

  return (
    <main className="container mx-auto py-10 px-4">
      <h1 className="text-2xl font-semibold mb-4">Order {order.id}</h1>
      <div className="mb-6 text-sm text-gray-600">Placed: {new Date(order.createdAt).toLocaleString()}</div>
      <div className="bg-white rounded border p-4">
        <div className="font-semibold mb-2">Items</div>
        <ul className="divide-y">
          {order.items.map(it => (
            <li key={it.id} className="py-2 flex items-center justify-between">
              <div>
                <div className="font-medium">{it.titleSnapshot}</div>
                <div className="text-gray-500 text-sm">Qty: {it.quantity}</div>
              </div>
              <div>₹{((it.priceCentsSnapshot*it.quantity)/100).toFixed(2)}</div>
            </li>
          ))}
        </ul>
        <div className="mt-4 text-right font-semibold">Total: ₹{(order.totalCents/100).toFixed(2)}</div>
      </div>
    </main>
  )
}


