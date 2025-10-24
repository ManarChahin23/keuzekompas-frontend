import type { VkmApi } from '@/app/vkms/types/vkm';
import VkmEditForm from './VkmEditForm';
import { fetchVkm } from '@/app/vkms/lib/api';

type Params = Promise<{ id: string }>;

export default async function EditPage({ params }: { params: Params }) {
  const { id } = await params;

  const vkm = await fetchVkm(id) as VkmApi;

  return (
    <main className="max-w-xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold">Module bewerken</h1>
      <VkmEditForm
        id={id}
        initial={{
          name: vkm.name ?? '',
          ec: vkm.ec ?? 0,
          level: vkm.level ?? undefined,
          location: vkm.location ?? '',
          description: vkm.description ?? '',
          learningOutcomes: vkm.learningOutcomes ?? '',
        }}
      />
    </main>
  );
}
