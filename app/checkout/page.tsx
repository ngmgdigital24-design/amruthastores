"use client"
import { useEffect, useState } from 'react'

export default function CheckoutPage() {
    const [total, setTotal] = useState(0)
    const [confirmed, setConfirmed] = useState(false)
    const [placing, setPlacing] = useState(false)
    const [addr, setAddr] = useState({
        name: '', phone: '',
        shipping: { line1: '', line2: '', city: '', state: '', postalCode: '', country: 'IN' },
        billing: { line1: '', line2: '', city: '', state: '', postalCode: '', country: 'IN' },
        payment: 'COD' as 'COD' | 'CARD',
    })

    useEffect(() => {
        async function load() {
            try {
                const raw = localStorage.getItem('cart') || '{}'
                const cart = JSON.parse(raw) as Record<string, number>
                const ids = Object.keys(cart)
                if (ids.length === 0) { setTotal(0); return }
                const res = await fetch('/api/products?pageSize=100')
                const data = await res.json()
                let sum = 0
                for (const p of data.items) {
                    const qty = cart[p.id] || 0
                    sum += p.priceCents * qty
                }
                setTotal(sum)
            } catch {
                setTotal(0)
            }
        }
        load()
    }, [])

    async function confirmOrder() {
        try {
            setPlacing(true)
            const raw = localStorage.getItem('cart') || '{}'
            const cart = JSON.parse(raw) as Record<string, number>
            const items = Object.entries(cart).map(([productId, quantity]) => ({ productId, quantity }))
            const payload = {
                items,
                paymentProvider: addr.payment,
                shippingAddress: { ...addr.shipping, type: 'SHIPPING', name: addr.name, phone: addr.phone },
                billingAddress: { ...addr.billing, type: 'BILLING', name: addr.name, phone: addr.phone },
            }
            const res = await fetch('/api/orders', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
            if (!res.ok) throw new Error('Order failed')
            localStorage.removeItem('cart')
            setConfirmed(true)
        } catch {
            alert('Failed to place order')
        } finally {
            setPlacing(false)
        }
    }

    return (
        <main className="container mx-auto py-10 px-4">
            <h1 className="text-2xl font-semibold mb-6">Checkout</h1>
            {confirmed ? (
                <div className="bg-green-50 border border-green-200 p-4 rounded">
                    <div className="font-semibold text-green-700 mb-1">Order confirmed!</div>
                    <p className="text-green-700">Thank you for your purchase. Your cart has been cleared.</p>
                    <a className="inline-block mt-4 text-blue-700 hover:underline" href="/products">Continue shopping</a>
                </div>
            ) : (
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-white rounded border p-6">
                        <div className="text-lg font-semibold mb-3">Contact</div>
                        <div className="grid gap-3">
                            <input placeholder="Full name" className="border rounded px-3 py-2" value={addr.name} onChange={e=>setAddr(a=>({...a,name:e.target.value}))} />
                            <input placeholder="Phone" className="border rounded px-3 py-2" value={addr.phone} onChange={e=>setAddr(a=>({...a,phone:e.target.value}))} />
                        </div>
                        <div className="text-lg font-semibold mt-6 mb-3">Shipping Address</div>
                        <div className="grid gap-3">
                            <input placeholder="Line 1" className="border rounded px-3 py-2" value={addr.shipping.line1} onChange={e=>setAddr(a=>({...a,shipping:{...a.shipping,line1:e.target.value}}))} />
                            <input placeholder="Line 2 (optional)" className="border rounded px-3 py-2" value={addr.shipping.line2} onChange={e=>setAddr(a=>({...a,shipping:{...a.shipping,line2:e.target.value}}))} />
                            <div className="grid grid-cols-2 gap-3">
                                <input placeholder="City" className="border rounded px-3 py-2" value={addr.shipping.city} onChange={e=>setAddr(a=>({...a,shipping:{...a.shipping,city:e.target.value}}))} />
                                <input placeholder="State" className="border rounded px-3 py-2" value={addr.shipping.state} onChange={e=>setAddr(a=>({...a,shipping:{...a.shipping,state:e.target.value}}))} />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <input placeholder="Postal code" className="border rounded px-3 py-2" value={addr.shipping.postalCode} onChange={e=>setAddr(a=>({...a,shipping:{...a.shipping,postalCode:e.target.value}}))} />
                                <input placeholder="Country" className="border rounded px-3 py-2" value={addr.shipping.country} onChange={e=>setAddr(a=>({...a,shipping:{...a.shipping,country:e.target.value}}))} />
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded border p-6">
                        <div className="text-lg font-semibold mb-3">Billing Address</div>
                        <div className="grid gap-3">
                            <input placeholder="Line 1" className="border rounded px-3 py-2" value={addr.billing.line1} onChange={e=>setAddr(a=>({...a,billing:{...a.billing,line1:e.target.value}}))} />
                            <input placeholder="Line 2 (optional)" className="border rounded px-3 py-2" value={addr.billing.line2} onChange={e=>setAddr(a=>({...a,billing:{...a.billing,line2:e.target.value}}))} />
                            <div className="grid grid-cols-2 gap-3">
                                <input placeholder="City" className="border rounded px-3 py-2" value={addr.billing.city} onChange={e=>setAddr(a=>({...a,billing:{...a.billing,city:e.target.value}}))} />
                                <input placeholder="State" className="border rounded px-3 py-2" value={addr.billing.state} onChange={e=>setAddr(a=>({...a,billing:{...a.billing,state:e.target.value}}))} />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <input placeholder="Postal code" className="border rounded px-3 py-2" value={addr.billing.postalCode} onChange={e=>setAddr(a=>({...a,billing:{...a.billing,postalCode:e.target.value}}))} />
                                <input placeholder="Country" className="border rounded px-3 py-2" value={addr.billing.country} onChange={e=>setAddr(a=>({...a,billing:{...a.billing,country:e.target.value}}))} />
                            </div>
                        </div>
                    </div>
                    <div className="md:col-span-2 bg-white rounded border p-6">
                        <div className="mb-4">Total payable: <span className="font-semibold">₹{(total/100).toFixed(2)}</span></div>
                        <div className="mb-4">
                            <div className="text-lg font-semibold mb-2">Payment</div>
                            <label className="inline-flex items-center gap-2 mr-6 text-sm">
                                <input type="radio" name="payment" checked={addr.payment==='COD'} onChange={()=>setAddr(a=>({...a,payment:'COD'}))} /> Cash on Delivery
                            </label>
                            <label className="inline-flex items-center gap-2 text-sm">
                                <input type="radio" name="payment" checked={addr.payment==='CARD'} onChange={()=>setAddr(a=>({...a,payment:'CARD'}))} /> Card (mock)
                            </label>
                        </div>
                        <button onClick={confirmOrder} disabled={placing} className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-60">{placing ? 'Placing...' : 'Confirm order'}</button>
                    </div>
                </div>
            )}
        </main>
    )
}



