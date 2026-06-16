/**
 * GDACS 全球灾害预警实时源 — 对标 World Monitor Round 3
 *
 * 免费、无 key 的公开 GeoJSON。覆盖洪水/气旋/火山/干旱/野火等（地震由 USGS 提供，此处排除）。
 * 服务端拉取 + 按区域 bounds 过滤 + 转为平台 feature（layerId 'natural'）。
 */

import type { GeoJSONFeature } from '@/types/geo';

const GDACS_URL =
  'https://www.gdacs.org/gdacsapi/api/events/geteventlist/MAP';

const TYPE_LABEL: Record<string, string> = {
  EQ: '地震',
  TC: '热带气旋',
  FL: '洪水',
  VO: '火山',
  DR: '干旱',
  WF: '野火',
  TS: '海啸',
};

type Bounds = [[number, number], [number, number]];

function inBounds(lng: number, lat: number, bounds?: Bounds | null): boolean {
  if (!bounds) return true;
  const [[minLng, minLat], [maxLng, maxLat]] = bounds;
  return lng >= minLng && lng <= maxLng && lat >= minLat && lat <= maxLat;
}

function impactByAlert(level: string): 'medium' | 'high' | 'critical' {
  const l = level.toLowerCase();
  if (l === 'red') return 'critical';
  if (l === 'orange') return 'high';
  return 'medium';
}

interface GdacsFeature {
  geometry?: { type?: string; coordinates?: [number, number] };
  properties?: {
    eventtype?: string;
    eventid?: number | string;
    name?: string;
    country?: string;
    alertlevel?: string;
    fromdate?: string;
    url?: string | { report?: string };
  };
}

/**
 * 拉取并转换 GDACS 灾害事件为平台 feature（排除 EQ；只取 Point；按 eventid 去重）。
 * 失败返回空数组。Next fetch 缓存 10 分钟。
 */
export async function fetchGdacsDisasters(
  bounds?: Bounds | null,
): Promise<GeoJSONFeature[]> {
  try {
    const res = await fetch(GDACS_URL, { next: { revalidate: 600 } });
    if (!res.ok) return [];
    const json = (await res.json()) as { features?: GdacsFeature[] };

    const seen = new Set<string>();
    const out: GeoJSONFeature[] = [];

    for (const f of json.features ?? []) {
      if (f.geometry?.type !== 'Point') continue;
      const c = f.geometry.coordinates;
      if (!Array.isArray(c)) continue;
      const [lng, lat] = c;

      const p = f.properties ?? {};
      const etype = String(p.eventtype ?? '');
      if (etype === 'EQ') continue; // 地震由 USGS 提供，避免重复

      const id = `gdacs-${etype}-${p.eventid ?? ''}`;
      if (seen.has(id)) continue;
      seen.add(id);
      if (!inBounds(lng, lat, bounds)) continue;

      const link =
        typeof p.url === 'string' ? p.url : (p.url?.report ?? '');

      out.push({
        type: 'Feature',
        geometry: { type: 'Point', coordinates: [lng, lat] },
        properties: {
          id,
          title: `${TYPE_LABEL[etype] ?? etype} · ${p.name ?? p.country ?? ''}`,
          source: 'GDACS',
          timestamp: p.fromdate
            ? new Date(p.fromdate).toISOString()
            : new Date().toISOString(),
          impact: impactByAlert(String(p.alertlevel ?? '')),
          category: 'natural',
          layerId: 'natural',
          description: `${p.name ?? ''}（预警级别 ${p.alertlevel ?? '-'}）`,
          link,
          live: true,
          lng,
          lat,
        },
      });
    }

    return out.slice(0, 120);
  } catch {
    return [];
  }
}
