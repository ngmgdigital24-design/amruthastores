"use client"
export default function AddToCartButton({ productId, disabled }: { productId: string; disabled?: boolean }) {
  function add() {
    try {
      if (process.env.NEXT_PUBLIC_DEBUG === 'true') {
        console.log('[cart] add', { productId })
      }
      const raw = localStorage.getItem('cart') || '{}'
      const cart = JSON.parse(raw) as Record<string, number>
      cart[productId] = (cart[productId] || 0) + 1
      localStorage.setItem('cart', JSON.stringify(cart))
      // notify listeners without relying on click handler
      document.dispatchEvent(new Event('cart-updated'))
      alert('Added to cart')
    } catch {
      // ignore
    }
  }
  return (
    <button onClick={add} disabled={disabled} className="add-to-cart bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-3 py-2 rounded text-sm" data-product-id={productId}>
      Add to cart
    </button>
  )
}



