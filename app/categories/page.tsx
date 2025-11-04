import { prisma } from '@/lib/prisma'

export default async function CategoriesPage() {
    const categories = await prisma.category.findMany({ orderBy: { name: 'asc' } })
    return (
        <main className="container mx-auto py-10 px-4">
            <h1 className="text-2xl font-semibold mb-6">Categories</h1>
            <ul className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {categories.map((c) => (
                    <li key={c.id} className="bg-white rounded border p-4 flex items-center justify-between">
                        <span>{c.name}</span>
                        <a className="text-sm text-blue-700 hover:underline" href={`/?category=${c.slug}`}>View products</a>
                    </li>
                ))}
            </ul>
        </main>
    )
}



