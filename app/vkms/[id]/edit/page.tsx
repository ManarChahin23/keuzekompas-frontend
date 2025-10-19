import VkmEditForm from './VkmEditForm';

function apiBase() {
  return (
    process.env.NEXT_PUBLIC_API_URL ||
    process.env.API_URL ||
    'http://localhost:8080'
  );
}

async function fetchVkm(id: string) {
  const base = apiBase();
  const res = await fetch(`${base}/vkm/${id}`, { cache: 'no-store' });
  if (!res.ok) throw new Error(`Niet gevonden (${res.status})`);
  return res.json();
}

type Params = Promise<{ id: string }>;

export default async function EditPage({ params }: { params: Params }) {
  const { id } = await params; // ✅ eerst awaiten

  const vkm = await fetchVkm(id);

  return (
    <main className="max-w-xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold">Module bewerken</h1>
      <VkmEditForm
        id={id}
        initial={{
          name: vkm.name ?? '',
          ec: vkm.ec ?? 0,
          level: vkm.level ?? '',
          location: vkm.location ?? '',
          description: vkm.description ?? '',
          learningoutcomes: vkm.learningoutcomes ?? '',
        }}
      />
    </main>
  );
}
