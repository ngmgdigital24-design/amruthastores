"use client"
import { useEffect, useState } from 'react'

function getCartCount(): number {
  try {
    const raw = localStorage.getItem('cart') || '{}'
    const obj = JSON.parse(raw)
    return Object.values(obj).reduce((sum: number, n: unknown) => sum + (typeof n === 'number' ? n : 0), 0)
  } catch {
    return 0
  }
}

export default function NavBar() {
  const [count, setCount] = useState<number>(0)

  useEffect(() => {
    setCount(getCartCount())

    const onCartUpdated = () => setCount(getCartCount())
    const onStorage = (e: StorageEvent) => {
      if (e.key === 'cart') setCount(getCartCount())
    }
    document.addEventListener('cart-updated', onCartUpdated as EventListener)
    window.addEventListener('storage', onStorage)
    return () => {
      document.removeEventListener('cart-updated', onCartUpdated as EventListener)
      window.removeEventListener('storage', onStorage)
    }
  }, [])

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur border-b">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <a href="/" className="text-xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-sky-600">Amrutha NextGen Stores</a>
        <nav className="flex items-center gap-6 text-sm">
          <a href="/products" className="hover:text-indigo-700 transition-colors">Products</a>
          <a href="/categories" className="hover:text-indigo-700 transition-colors">Categories</a>
          <a href="/about" className="hover:text-indigo-700 transition-colors">About</a>
          <a href="/contact" className="hover:text-indigo-700 transition-colors">Contact</a>
          <a href="/cart" className="relative hover:text-indigo-700 transition-colors">
            Cart
            <span className="ml-1 inline-flex items-center justify-center rounded-full bg-blue-600 text-white text-[10px] w-5 h-5 align-middle">{count}</span>
          </a>
        </nav>
      </div>
    </header>
  )
}


