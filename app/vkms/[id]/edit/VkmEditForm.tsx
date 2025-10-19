'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { updateVkm } from '@/app/vkms/lib/api';
import type { VkmApi } from '@/app/vkms/types/vkm';

type Level = 'NLQF-5' | 'NLQF-6' | '';
type Props = {
  id: string;
  initial: Pick<VkmApi, 'name' | 'ec' | 'level' | 'location' | 'description' | 'learningoutcomes'>;
};

export default function VkmEditForm({ id, initial }: Props) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validated, setValidated] = useState(false);

  const [form, setForm] = useState({
    name: initial.name ?? '',
    ec: (initial.ec ?? 0) as number | '',
    level: (initial.level ?? '') as Level,
    location: initial.location ?? '',
    description: initial.description ?? '',
    learningoutcomes: initial.learningoutcomes ?? '',
  });

  // VALIDATIE
  const [errors, setErrors] = useState<Partial<Record<keyof typeof form, string>>>({});

  function validate(s: typeof form) {
    const e: Partial<Record<keyof typeof form, string>> = {};

    // Naam verplicht 2–120
    if (!s.name.trim()) e.name = 'Naam is verplicht.';
    else if (s.name.trim().length < 2) e.name = 'Naam is te kort (min. 2).';
    else if (s.name.trim().length > 120) e.name = 'Naam is te lang (max. 120).';

    // EC verplicht 1–60, integer
    const ecNum = typeof s.ec === 'string' ? Number(s.ec) : s.ec;
    if (s.ec === '' || Number.isNaN(ecNum as number)) e.ec = 'EC is verplicht.';
    else if (!Number.isInteger(ecNum as number)) e.ec = 'EC moet een geheel getal zijn.';
    else if ((ecNum as number) < 1 || (ecNum as number) > 60) e.ec = 'EC moet tussen 1 en 60 liggen.';

    // Level verplicht
    if (s.level !== 'NLQF-5' && s.level !== 'NLQF-6') e.level = 'Kies een geldig level.';

    // Optioneel: lengte-limieten
    if (s.location && s.location.length > 120) e.location = 'Max 120 tekens.';
    if (s.description && s.description.length > 2000) e.description = 'Max 2000 tekens.';
    if (s.learningoutcomes && s.learningoutcomes.length > 5000) e.learningoutcomes = 'Max 5000 tekens.';

    return e;
  }

  const fieldClass = (k: keyof typeof form) =>
    `border rounded-lg px-3 py-2 w-full outline-none transition ${
      !validated ? 'border-gray-300'
      : errors[k] ? 'border-red-500 ring-1 ring-red-300'
      : 'border-green-500 ring-1 ring-green-300'
    }`;

  const Hint = ({ name }: { name: keyof typeof form }) =>
    !validated ? null : errors[name] ? (
      <p className="text-sm text-red-600 mt-1">{errors[name]}</p>
    ) : (
      <p className="text-sm text-green-600 mt-1">Looks good!</p>
    );

  //SUBMIT
  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const v = validate(form);
    setErrors(v);
    setValidated(true);
    if (Object.keys(v).length) return;

    const payload: Partial<VkmApi> = {
      name: form.name.trim(),
      ec: Number(form.ec),
      level: form.level as 'NLQF-5' | 'NLQF-6',
      location: form.location || undefined,
      description: form.description || undefined,
      learningoutcomes: form.learningoutcomes || undefined,
    };

    setPending(true);
    try {
      await updateVkm(id, payload);
      router.push(`/vkms/${id}`);
      router.refresh();
    } catch (e: any) {
      setError(e?.message ?? 'Opslaan mislukt.');
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {error && <div className="bg-red-50 text-red-700 border rounded p-3">{error}</div>}

      {/* Naam */}
      <div>
        <input
          name="name"
          className={fieldClass('name')}
          placeholder="Naam *"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <Hint name="name" />
      </div>

      {/* EC */}
      <div>
        <input
          name="ec"
          type="number"
          min={1}
          max={60}
          step={1}
          className={fieldClass('ec')}
          placeholder="EC *"
          value={form.ec}
          onChange={(e) =>
            setForm({ ...form, ec: e.target.value === '' ? '' : Number(e.target.value) })
          }
        />
        <Hint name="ec" />
      </div>

      {/* Level */}
      <div>
        <select
          name="level"
          className={fieldClass('level')}
          value={form.level}
          onChange={(e) => setForm({ ...form, level: e.target.value as Level })}
        >
          <option value="">Kies niveau *</option>
          <option value="NLQF-5">NLQF-5</option>
          <option value="NLQF-6">NLQF-6</option>
        </select>
        <Hint name="level" />
      </div>

      {/* Locatie */}
      <div>
        <input
          name="location"
          className={fieldClass('location')}
          placeholder="Locatie"
          value={form.location}
          onChange={(e) => setForm({ ...form, location: e.target.value })}
        />
        <Hint name="location" />
      </div>

      {/* Beschrijving */}
      <div>
        <textarea
          name="description"
          className={fieldClass('description')}
          placeholder="Beschrijving"
          rows={4}
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
        <Hint name="description" />
      </div>

      {/* Learning outcomes */}
      <div>
        <textarea
          name="learningoutcomes"
          className={fieldClass('learningoutcomes')}
          placeholder="Learning outcomes"
          rows={4}
          value={form.learningoutcomes}
          onChange={(e) => setForm({ ...form, learningoutcomes: e.target.value })}
        />
        <Hint name="learningoutcomes" />
      </div>

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={pending}
          className="bg-black text-white rounded-lg px-4 py-2 disabled:opacity-50"
        >
          {pending ? 'Opslaan…' : 'Opslaan'}
        </button>
        <button
          type="button"
          onClick={() => router.push(`/vkms/${id}`)}
          className="rounded-lg border px-4 py-2"
        >
          Annuleren
        </button>
      </div>
    </form>
  );
}
