/**
 * USGS 地震实时源 — 对标 World Monitor Round 2
 *
 * 免费、无 key 的公开 GeoJSON feed。服务端拉取 + 按区域 bounds 过滤 + 转为平台 feature。
 * 接入 'natural' 图层；通过 /api/geodata 合并，自动流向地图/事件流/跑马灯。
 */

import type { GeoJSONFeature } from '@/types/geo';
import { magBand } from '@/lib/geodata/seismicStyle';

// 过去一天 M4.5+ 地震（量级适中、点位不过密）；可换 2.5_day/all_day
const USGS_URL =
  'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_day.geojson';

interface UsgsFeature {
  id: string;
  properties: {
    mag: number | null;
    place: string | null;
    time: number | null;
    url: string | null;
    title: string | null;
    tsunami?: number;
  };
  geometry: { coordinates: [number, number, number] };
}

type Bounds = [[number, number], [number, number]];

function inBounds(lng: number, lat: number, bounds?: Bounds | null): boolean {
  if (!bounds) return true;
  const [[minLng, minLat], [maxLng, maxLat]] = bounds;
  return lng >= minLng && lng <= maxLng && lat >= minLat && lat <= maxLat;
}

function impactByMag(mag: number): 'low' | 'medium' | 'high' | 'critical' {
  if (mag >= 6) return 'critical';
  if (mag >= 5) return 'high';
  if (mag >= 4.5) return 'medium';
  return 'low';
}

/**
 * 拉取并转换 USGS 地震为平台 feature（layerId: 'natural'）。
 * 失败返回空数组（不影响其它数据）。Next fetch 缓存 5 分钟。
 */
export async function fetchUsgsEarthquakes(
  bounds?: Bounds | null,
): Promise<GeoJSONFeature[]> {
  try {
    const res = await fetch(USGS_URL, {
      next: { revalidate: 300 },
    });
    if (!res.ok) return [];
    const json = (await res.json()) as { features?: UsgsFeature[] };

    return (json.features ?? [])
      .filter((f) => {
        const c = f.geometry?.coordinates;
        return Array.isArray(c) && inBounds(c[0], c[1], bounds);
      })
      .map((f) => {
        const [lng, lat] = f.geometry.coordinates;
        const mag = f.properties.mag ?? 0;
        const place = f.properties.place ?? '未知位置';
        const tsunami = f.properties.tsunami === 1;
        return {
          type: 'Feature' as const,
          geometry: { type: 'Point', coordinates: [lng, lat] },
          properties: {
            id: 'usgs-' + f.id,
            title: `M${mag.toFixed(1)} 地震 · ${place}`,
            source: 'USGS',
            timestamp: f.properties.time
              ? new Date(f.properties.time).toISOString()
              : new Date().toISOString(),
            impact: impactByMag(mag),
            category: 'natural',
            layerId: 'natural',
            subKind: magBand(mag),
            description: tsunami
              ? `${place}（含海啸提示）`
              : place,
            link: f.properties.url ?? '',
            live: true,
            mag,
            lng,
            lat,
          },
        };
      });
  } catch {
    return [];
  }
}

/** 震源深度分带（标准地震学）：浅源 <70km / 中源 70–300km / 深源 >300km */
function depthBand(depthKm: number): 'shallow' | 'intermediate' | 'deep' {
  if (depthKm < 70) return 'shallow';
  if (depthKm <= 300) return 'intermediate';
  return 'deep';
}

const DEPTH_BAND_LABEL: Record<string, string> = {
  shallow: '浅源 (<70km)',
  intermediate: '中源 (70–300km)',
  deep: '深源 (>300km)',
};

/**
 * 拉取 USGS 地震并按**震源深度**分带（layerId: 'quake_depth'，洋底/地下空间层）。
 * 复用同一 feed，不额外消耗；失败返回空数组。
 */
export async function fetchUsgsByDepth(
  bounds?: Bounds | null,
): Promise<GeoJSONFeature[]> {
  try {
    const res = await fetch(USGS_URL, { next: { revalidate: 300 } });
    if (!res.ok) return [];
    const json = (await res.json()) as { features?: UsgsFeature[] };

    return (json.features ?? [])
      .filter((f) => {
        const c = f.geometry?.coordinates;
        return Array.isArray(c) && inBounds(c[0], c[1], bounds);
      })
      .map((f) => {
        const [lng, lat, depth] = f.geometry.coordinates;
        const mag = f.properties.mag ?? 0;
        const place = f.properties.place ?? '未知位置';
        const band = depthBand(depth ?? 0);
        return {
          type: 'Feature' as const,
          geometry: { type: 'Point' as const, coordinates: [lng, lat] },
          properties: {
            id: 'usgsd-' + f.id,
            title: `M${mag.toFixed(1)} · 深 ${Math.round(depth ?? 0)}km · ${place}`,
            source: 'USGS',
            timestamp: f.properties.time
              ? new Date(f.properties.time).toISOString()
              : new Date().toISOString(),
            impact: impactByMag(mag),
            category: 'quake_depth',
            layerId: 'quake_depth',
            subKind: band,
            description: `${DEPTH_BAND_LABEL[band]} · 震级 M${mag.toFixed(1)} · ${place}`,
            link: f.properties.url ?? '',
            live: true,
            mag,
            depth: depth ?? 0,
            lng,
            lat,
          },
        };
      });
  } catch {
    return [];
  }
}
