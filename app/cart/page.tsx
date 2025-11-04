"use client"
import { useEffect, useState } from 'react'

type CartItem = { id: string; title: string; priceCents: number; quantity: number }

export default function CartPage() {
    const [items, setItems] = useState<CartItem[]>([])
    const [total, setTotal] = useState(0)

    useEffect(() => {
        async function load() {
            try {
                const raw = localStorage.getItem('cart') || '{}'
                const cart = JSON.parse(raw) as Record<string, number>
                const ids = Object.keys(cart)
                if (ids.length === 0) { setItems([]); setTotal(0); return }
                const res = await fetch('/api/products?pageSize=100')
                const data = await res.json()
                const map: Record<string, any> = {}
                for (const p of data.items) map[p.id] = p
                const list: CartItem[] = []
                let sum = 0
                for (const id of ids) {
                    const p = map[id]; if (!p) continue
                    const qty = cart[id]
                    const line = p.priceCents * qty
                    sum += line
                    list.push({ id, title: p.title, priceCents: p.priceCents, quantity: qty })
                }
                setItems(list)
                setTotal(sum)
            } catch {
                setItems([]); setTotal(0)
            }
        }
        load()
    }, [])

    return (
        <main className="container mx-auto py-10 px-4">
            <h1 className="text-2xl font-semibold mb-6">Your Cart</h1>
            {items.length === 0 ? (
                <p className="text-gray-600">Your cart is empty.</p>
            ) : (
                <>
                    <ul className="divide-y">
                        {items.map(item => (
                            <li key={item.id} className="py-3 flex items-center justify-between">
                                <div>
                                    <div className="font-medium">{item.title}</div>
                                    <div className="text-sm text-gray-500">Qty: {item.quantity}</div>
                                </div>
                                <div>₹{((item.priceCents * item.quantity)/100).toFixed(2)}</div>
                            </li>
                        ))}
                    </ul>
                    <div className="mt-4 text-right text-lg font-semibold">Total: ₹{(total/100).toFixed(2)}</div>
                    <div className="mt-6 flex justify-end gap-3">
                        <a href="/products" className="px-4 py-2 border rounded">Continue shopping</a>
                        <a href="/checkout" className="px-4 py-2 bg-green-600 text-white rounded">Checkout</a>
                    </div>
                </>
            )}
        </main>
    )
}


