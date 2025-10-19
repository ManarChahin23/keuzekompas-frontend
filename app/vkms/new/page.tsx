'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createVkm } from '@/lib/api';

type FormState = {
  code: string;
  name: string;
  ec: number | '';// empty string zodat input leeg kan zijn
  level: 'NLQF-5' | 'NLQF-6' | '';
  description: string;
  location: string;
};

export default function NewVkmPage() {
  const r = useRouter();

  const [form, setForm] = useState<FormState>({
    code: '',
    name: '',
    ec: 15,
    level: 'NLQF-5',
    description: '',
    location: '',
  });

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [validated, setValidated] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});

  function validate(s: FormState) {
    const e: Partial<Record<keyof FormState, string>> = {};

    // Naam verplicht, 2–120 chars
    if (!s.name.trim()) e.name = 'Naam is verplicht.';
    else if (s.name.trim().length < 2) e.name = 'Naam is te kort (min. 2).';
    else if (s.name.trim().length > 120) e.name = 'Naam is te lang (max. 120).';

    // EC verplicht, integer 1–60
    const ecNum = typeof s.ec === 'string' ? Number(s.ec) : s.ec;
    if (s.ec === '' || Number.isNaN(ecNum as number)) e.ec = 'EC is verplicht.';
    else if (!Number.isInteger(ecNum as number)) e.ec = 'EC moet een geheel getal zijn.';
    else if ((ecNum as number) < 1 || (ecNum as number) > 60) e.ec = 'EC moet tussen 1 en 60 liggen.';

    // Level verplicht
    if (s.level !== 'NLQF-5' && s.level !== 'NLQF-6') e.level = 'Kies een geldig level.';

    // Code optioneel (max 32)
    if (s.code && s.code.length > 32) e.code = 'Max 32 tekens.';

    // Locatie optioneel (max 120)
    if (s.location && s.location.length > 120) e.location = 'Max 120 tekens.';

    // Beschrijving optioneel (max 2000)
    if (s.description && s.description.length > 2000) e.description = 'Max 2000 tekens.';

    return e;
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);

    const v = validate(form);
    const hasErrors = Object.keys(v).length > 0;
    setErrors(v);
    setValidated(true);

    if (hasErrors) return;

    try {
      setLoading(true);
      const created = await createVkm({
        code: form.code || undefined,
        name: form.name.trim(),
        ec: Number(form.ec),
        level: form.level as any,
        description: form.description || undefined,
        location: form.location || undefined,
      });
      r.push(`/vkms/${created._id}`);
    } catch (e: any) {
      setErr(e?.message ?? 'Fout bij aanmaken');
    } finally {
      setLoading(false);
    }
  }

  const fieldClass = (key: keyof FormState) =>
    `border rounded-lg px-3 py-2 w-full outline-none transition ${
      !validated
        ? 'border-gray-300'
        : errors[key]
          ? 'border-red-500 ring-1 ring-red-300'
          : 'border-green-500 ring-1 ring-green-300'
    }`;

  const Hint = ({ name }: { name: keyof FormState }) =>
    !validated ? null : errors[name] ? (
      <p className="text-sm text-red-600 mt-1">{errors[name]}</p>
    ) : (
      <p className="text-sm text-green-600 mt-1">Looks good!</p>
    );

  return (
    <main className="max-w-xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold">Nieuwe module</h1>
      {err && <p className="text-red-600">{err}</p>}

      <form onSubmit={submit} className="space-y-4">
        {/* Code (optioneel) */}
        <div>
          <input
            className={fieldClass('code')}
            placeholder="Code (optioneel)"
            value={form.code}
            onChange={(e) => setForm({ ...form, code: e.target.value })}
          />
          <Hint name="code" />
        </div>

        {/* Naam */}
        <div>
          <input
            className={fieldClass('name')}
            placeholder="Naam *"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <Hint name="name" />
        </div>

        {/* EC + Level */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <input
              type="number"
              className={fieldClass('ec')}
              placeholder="EC *"
              min={1}
              max={60}
              step={1}
              value={form.ec}
              onChange={(e) => setForm({ ...form, ec: e.target.value === '' ? '' : Number(e.target.value) })}
            />
            <Hint name="ec" />
          </div>

          <div>
            <select
              className={fieldClass('level')}
              value={form.level}
              onChange={(e) => setForm({ ...form, level: e.target.value as FormState['level'] })}
            >
              <option value="">Kies level *</option>
              <option value="NLQF-5">NLQF-5</option>
              <option value="NLQF-6">NLQF-6</option>
            </select>
            <Hint name="level" />
          </div>
        </div>

        {/* Locatie (optioneel) */}
        <div>
          <input
            className={fieldClass('location')}
            placeholder="Locatie (optioneel)"
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
          />
          <Hint name="location" />
        </div>

        {/* Beschrijving (optioneel) */}
        <div>
          <textarea
            className={fieldClass('description')}
            placeholder="Beschrijving (optioneel)"
            rows={4}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          <Hint name="description" />
        </div>

        <button
          disabled={loading}
          className="bg-black text-white rounded-lg px-4 py-2 disabled:opacity-60"
        >
          {loading ? 'Bezig…' : 'Opslaan'}
        </button>
      </form>
    </main>
  );
}
