// app/vkms/page.tsx
import { fetchVkms } from '@/lib/api';
import { VkmCard } from '@/components/VkmCard';

type SearchParams = {
  name?: string;
  query?: string;
  ec?: string;
  level?: string;
  location?: string;
};

export default async function Page({
  searchParams,
}: {
  searchParams?: SearchParams;
}) {
  const params = searchParams ?? {};

  const vkms = await fetchVkms(params);

  return (
    <main className="max-w-6xl mx-auto p-6 space-y-6">

    <div className="flex items-center justify-between">
    <h1 className="text-2xl font-bold">Vrije Keuze Modules</h1>
    <a
    href="/vkms/new"
    className="bg-black text-white rounded-lg px-4 py-2 hover:bg-gray-800 transition"
    >
    + Nieuwe module
    </a>
    </div>



      {/* Filters */}
      <form
        className="grid grid-cols-1 md:grid-cols-5 gap-3"
        action="/vkms"
        method="get"
      >
        <input
          name="name"
          placeholder="Zoek op naam…"
          defaultValue={params.name ?? ''}
          className="border rounded-lg px-3 py-2"
        />
        <input
          name="query"
          placeholder="Zoek in beschrijving…"
          defaultValue={params.query ?? ''}
          className="border rounded-lg px-3 py-2"
        />
        <select
          name="ec"
          defaultValue={params.ec ?? ''}
          className="border rounded-lg px-3 py-2"
        >
          <option value="">EC</option>
          <option value="15">15</option>
          <option value="30">30</option>
        </select>
        <select
          name="level"
          defaultValue={params.level ?? ''}
          className="border rounded-lg px-3 py-2"
        >
          <option value="">Level</option>
          <option value="NLQF-5">NLQF-5</option>
          <option value="NLQF-6">NLQF-6</option>
        </select>
        <input
          name="location"
          placeholder="Locatie"
          defaultValue={params.location ?? ''}
          className="border rounded-lg px-3 py-2"
        />
        <button
          type="submit"
          className="bg-black text-white rounded-lg px-3 py-2 w-full"
        >
          Filter
        </button>
      </form>

      {/* VKM Cards */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {vkms.length > 0 ? (
          vkms.map((v) => <VkmCard key={v._id} vkm={v} />)
        ) : (
          <p className="text-gray-500 italic">Geen modules gevonden.</p>
        )}
      </section>
    </main>
  );
}
