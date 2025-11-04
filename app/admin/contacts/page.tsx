import { prisma } from '@/lib/prisma'
import ToggleHandled from './ToggleHandled'

// Server component with simple filter params
export default async function AdminContactsPage({ searchParams }: { searchParams?: Promise<{ q?: string; from?: string; to?: string }> }) {
    const sp = await searchParams
    const q = (sp?.q || '').trim()
    const from = sp?.from ? new Date(sp.from) : null
    const to = sp?.to ? new Date(sp.to) : null

    const where: any = {}
    if (q) {
        where.OR = [
            { name: { contains: q, mode: 'insensitive' } },
            { email: { contains: q, mode: 'insensitive' } },
            { message: { contains: q, mode: 'insensitive' } },
        ]
    }
    if (from || to) {
        where.createdAt = {}
        if (from) where.createdAt.gte = from
        if (to) where.createdAt.lte = to
    }

    const messages = await (prisma as any).contactMessage.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: 500,
    })

    function toCsv(rows: { createdAt: Date; name: string; email: string; message: string }[]) {
        const header = ['createdAt','name','email','message']
        const lines = [header.join(',')]
        for (const r of rows) {
            const vals = [
                new Date(r.createdAt).toISOString(),
                r.name.replaceAll('"','""'),
                r.email.replaceAll('"','""'),
                r.message.replaceAll('"','""')
            ].map(v => '"' + v + '"')
            lines.push(vals.join(','))
        }
        return lines.join('\n')
    }

    const csv = toCsv(messages as any)

    return (
        <main className="container mx-auto py-10 px-4">
            <h1 className="text-2xl font-semibold mb-6">Contact Messages</h1>

            <form method="get" className="grid grid-cols-1 md:grid-cols-5 gap-3 mb-6">
                <input name="q" placeholder="Search name/email/message" defaultValue={q} className="border rounded px-3 py-2" />
                <input name="from" type="date" className="border rounded px-3 py-2" defaultValue={sp?.from || ''} />
                <input name="to" type="date" className="border rounded px-3 py-2" defaultValue={sp?.to || ''} />
                <button className="px-4 py-2 bg-gray-900 text-white rounded">Filter</button>
                <a
                  href={`data:text/csv;charset=utf-8,${encodeURIComponent(csv)}`}
                  download={`contacts_${Date.now()}.csv`}
                  className="px-4 py-2 border rounded text-center"
                >Export CSV</a>
            </form>

            {messages.length === 0 ? (
                <p className="text-gray-600">No messages found.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border rounded">
                        <thead className="bg-gray-50 text-left text-sm">
                            <tr>
                                <th className="p-3 border-b">When</th>
                                <th className="p-3 border-b">Name</th>
                                <th className="p-3 border-b">Email</th>
                                <th className="p-3 border-b">Message</th>
                                <th className="p-3 border-b">Handled</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm">
                            {messages.map((m: { id: string; createdAt: Date; name: string; email: string; message: string; handled: boolean }) => (
                                <tr key={m.id} className="align-top">
                                    <td className="p-3 border-b whitespace-nowrap">{new Date(m.createdAt).toLocaleString()}</td>
                                    <td className="p-3 border-b">{m.name}</td>
                                    <td className="p-3 border-b"><a href={`mailto:${m.email}`} className="text-blue-700 hover:underline">{m.email}</a></td>
                                    <td className="p-3 border-b max-w-[48rem]">
                                        <div className="whitespace-pre-wrap break-words">{m.message}</div>
                                    </td>
                                    <td className="p-3 border-b">
                                        <ToggleHandled id={m.id} defaultChecked={m.handled} />
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


