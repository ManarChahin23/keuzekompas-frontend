import Link from 'next/link';
import { notFound } from 'next/navigation';
import { fetchVkm } from '@/app/vkms/lib/api';


type Params = Promise<{ id: string }>;

export default async function VkmDetailPage({ params }: { params: Params }) {
  const { id } = await params;          

  const v = await fetchVkm(id).catch(() => null);
  if (!v) return notFound();

  return (
    <main className="max-w-3xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between gap-3">
        <Link
          href="/vkms"
          className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 hover:bg-gray-50"
        >
          ← Terug naar overzicht
        </Link>

        <Link
          href={`/vkms/${id}/edit`}   
          className="inline-flex items-center gap-2 rounded-lg bg-black text-white px-4 py-2 hover:bg-gray-800"
        >
          Bewerken
        </Link>
      </div>

      <section className="space-y-2">
        <h1 className="text-3xl font-semibold">{v.name}</h1>
        <p className="text-gray-600">
          {v.ec ?? '—'} EC • {v.level ?? '—'}
        </p>
        {v.location && <p className="text-gray-600">{v.location}</p>}
      </section>

      {v.description && <p className="leading-7">{v.description}</p>}

      {v.learningoutcomes && (
        <section className="space-y-2">
          <h2 className="font-semibold">Learning outcomes</h2>
          <p className="leading-7">{v.learningoutcomes}</p>
        </section>
      )}
    </main>
  );
}
