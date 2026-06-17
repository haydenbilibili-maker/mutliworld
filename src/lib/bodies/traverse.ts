/**
 * 巡视器 traverse 抓取与解析 — NASA MMGIS waypoints → 有序折线坐标
 * 真实路径点；任何异常返回 null（上层降级，不造假）。
 */

import type { TraverseDef } from '@/bodies/traverse';

export interface TraversePath {
  id: string;
  rover: string;
  color: string;
  body: TraverseDef['body'];
  /** 有序折线坐标 [lng(-180..180), lat] */
  coords: [number, number][];
  /** 末端（最新航点） */
  last: [number, number] | null;
  count: number;
}

function norm180(lon: number): number {
  let x = ((lon + 180) % 360 + 360) % 360 - 180;
  if (x === -180) x = 180;
  return x;
}

interface WpFeature {
  geometry?: { type?: string; coordinates?: [number, number] };
  properties?: Record<string, unknown>;
}

/** 排序键：优先 sol，再 site/drive，回退原序 */
function orderKey(f: WpFeature, idx: number): number {
  const p = f.properties ?? {};
  const sol = Number(p.sol ?? p.SOL ?? NaN);
  if (Number.isFinite(sol)) return sol;
  const site = Number(p.site ?? p.SITE ?? NaN);
  const drive = Number(p.drive ?? p.DRIVE ?? NaN);
  if (Number.isFinite(site)) return site * 100000 + (Number.isFinite(drive) ? drive : 0);
  return idx;
}

export async function fetchTraverse(def: TraverseDef): Promise<TraversePath | null> {
  try {
    const res = await fetch(def.url, { next: { revalidate: 3600 } });
    if (!res.ok) return null;
    const json = (await res.json()) as { features?: WpFeature[] };
    const feats = (json.features ?? []).filter(
      (f) => f.geometry?.type === 'Point' && Array.isArray(f.geometry.coordinates),
    );
    if (feats.length === 0) return null;

    const ordered = feats
      .map((f, i) => ({ f, k: orderKey(f, i) }))
      .sort((a, b) => a.k - b.k)
      .map((x) => x.f);

    const coords: [number, number][] = [];
    for (const f of ordered) {
      const c = f.geometry!.coordinates!;
      const lng = Number(c[0]);
      const lat = Number(c[1]);
      if (Number.isFinite(lng) && Number.isFinite(lat)) coords.push([norm180(lng), lat]);
    }
    if (coords.length < 2) return null;

    return {
      id: def.id,
      rover: def.rover,
      color: def.color,
      body: def.body,
      coords,
      last: coords[coords.length - 1] ?? null,
      count: coords.length,
    };
  } catch {
    return null;
  }
}

export async function fetchTraverses(defs: TraverseDef[]): Promise<TraversePath[]> {
  const settled = await Promise.allSettled(defs.map(fetchTraverse));
  const out: TraversePath[] = [];
  for (const s of settled) if (s.status === 'fulfilled' && s.value) out.push(s.value);
  return out;
}
