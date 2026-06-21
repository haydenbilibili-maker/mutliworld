/**
 * NASA EONET 自然事件 — 共享取数（火山/风暴/洪水/沙尘/海冰等共用）。
 * 免密钥真实数据：EONET v3，取每个进行中事件的最新位置点。按类目内存缓存 30 分钟。
 */

const CACHE_TTL_MS = 30 * 60 * 1000;

export interface EonetFC {
  type: 'FeatureCollection';
  features: Array<{ type: 'Feature'; id: string; geometry: { type: 'Point'; coordinates: [number, number] }; properties: { title: string; date: string } }>;
  generatedAt: string;
  source: string;
  stale?: boolean;
}

interface EonetGeometry { date?: string; type?: string; coordinates?: number[] }
interface EonetEvent { id?: string; title?: string; geometry?: EonetGeometry[] }
interface EonetResp { events?: EonetEvent[] }

const cache = new Map<string, { expires: number; body: EonetFC }>();

/** 取某类目 EONET 事件并转为精简点 GeoJSON；失败抛错（路由层兜底） */
export async function getEonetGeoJSON(category: string, source: string): Promise<EonetFC> {
  const now = Date.now();
  const hit = cache.get(category);
  if (hit && hit.expires > now) return hit.body;

  const url = `https://eonet.gsfc.nasa.gov/api/v3/events?category=${encodeURIComponent(category)}&status=open`;
  const res = await fetch(url, { signal: AbortSignal.timeout(20000), next: { revalidate: 0 } });
  if (!res.ok) throw new Error(`EONET HTTP ${res.status}`);
  const d = (await res.json()) as EonetResp;
  const events = Array.isArray(d.events) ? d.events : [];
  const features = events
    .map((ev) => {
      const geoms = (ev.geometry ?? []).filter((g) => g.type === 'Point' && Array.isArray(g.coordinates) && g.coordinates.length >= 2);
      const last = geoms[geoms.length - 1];
      if (!last) return null;
      const c = last.coordinates!;
      return {
        type: 'Feature' as const,
        id: ev.id ?? `${c[0]},${c[1]}`,
        geometry: { type: 'Point' as const, coordinates: [c[0], c[1]] as [number, number] },
        properties: { title: String(ev.title ?? '事件'), date: String(last.date ?? '') },
      };
    })
    .filter((f): f is NonNullable<typeof f> => f !== null);
  const body: EonetFC = { type: 'FeatureCollection', features, generatedAt: new Date().toISOString(), source };
  cache.set(category, { expires: now + CACHE_TTL_MS, body });
  return body;
}

/** 取上次成功缓存（供路由失败时回退） */
export function getEonetStale(category: string): EonetFC | null {
  return cache.get(category)?.body ?? null;
}
