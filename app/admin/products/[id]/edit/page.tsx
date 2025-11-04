import { prisma } from '@/lib/prisma'
import EditInventoryForm from './EditInventoryForm'

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const product = await prisma.product.findUnique({ where: { id }, include: { inventory: true } })
  if (!product) {
    return (
      <main className="container mx-auto py-10 px-4">
        <h1 className="text-2xl font-semibold">Product not found</h1>
      </main>
    )
  }
  const quantity = product.inventory?.quantity ?? 0
  return (
    <main className="container mx-auto py-10 px-4">
      <h1 className="text-2xl font-semibold mb-4">Edit Product</h1>
      <div className="mb-6">
        <div className="text-lg font-bold">{product.title}</div>
        <div className="text-sm text-gray-600">Current price: ₹{(product.priceCents/100).toFixed(2)}</div>
      </div>
      <EditInventoryForm productId={product.id} initialQuantity={quantity} initialActive={product.active} />
    </main>
  )
}


