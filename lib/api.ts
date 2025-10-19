// lib/api.ts
import type { VkmApi } from '@/types/vkm';


const BASE = process.env.NEXT_PUBLIC_API_BASE!;

export async function fetchVkms(params: Record<string,string>) {
  const qs = params
    ? '?' + new URLSearchParams(Object.entries(params).filter(([,v]) => v)).toString()
    : '';
  const res = await fetch(`${BASE}/vkm${qs}`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch VKM list');
  return (await res.json()) as VkmApi[];
}

export async function fetchVkm(id: string) {
  const res = await fetch(`${BASE}/vkm/${id}`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch VKM');
  return (await res.json()) as VkmApi | null;
}

export async function createVkm(input: Partial<VkmApi>) {
  const res = await fetch(`${BASE}/vkm`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  if (!res.ok) throw new Error('Failed to create VKM');
  return (await res.json()) as VkmApi;
}

export async function updateVkm(id: string, input: Partial<VkmApi>) {
  const res = await fetch(`${BASE}/vkm/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  if (!res.ok) throw new Error('Failed to update VKM');
  return (await res.json()) as VkmApi;
}
