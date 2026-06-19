/**
 * 地名地理编码 — OpenStreetMap Nominatim（免费，客户端 CORS 允许）。
 * 支持任意地点搜索并跳转：城镇、地标、纪念地等（如白泉镇、艾菲尔铁塔、马尼拉美军公墓）。
 * 遵守 Nominatim 使用策略：调用端做防抖（≥400ms/次），limit≤5。
 */

import type { SearchEntry } from './searchIndex';

interface NominatimResult {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
  type?: string;
  class?: string;
  addresstype?: string;
}

/** 按地点类型选择合适的跳转缩放级别 */
function zoomForType(type?: string, cls?: string): number {
  if (!type && !cls) return 9;
  const t = type ?? '';
  if (t === 'country') return 4;
  if (['state', 'region', 'province'].includes(t)) return 6;
  if (['city', 'county', 'municipality'].includes(t)) return 9;
  if (['town', 'suburb', 'borough'].includes(t)) return 11;
  if (['village', 'hamlet', 'neighbourhood'].includes(t)) return 12;
  if (
    cls === 'tourism' ||
    cls === 'amenity' ||
    cls === 'historic' ||
    cls === 'aeroway' ||
    cls === 'man_made' ||
    cls === 'leisure' ||
    [
      'building', 'attraction', 'monument', 'memorial', 'museum',
      'man_made', 'cemetery', 'place_of_worship', 'castle', 'ruins',
    ].includes(t)
  ) {
    return 15;
  }
  return 12;
}

/** 用 Nominatim 对任意地名做地理编码，结果统一成 SearchEntry（kind=place） */
export async function geocodePlaces(
  query: string,
  signal?: AbortSignal,
): Promise<SearchEntry[]> {
  const q = query.trim();
  if (q.length < 2) return [];

  const url =
    'https://nominatim.openstreetmap.org/search' +
    `?format=jsonv2&limit=5&accept-language=zh-CN,zh,en&q=${encodeURIComponent(q)}`;

  try {
    const res = await fetch(url, { signal, headers: { Accept: 'application/json' } });
    if (!res.ok) return [];
    const data = (await res.json()) as NominatimResult[];
    return data
      .map((r): SearchEntry => {
        const lng = parseFloat(r.lon);
        const lat = parseFloat(r.lat);
        const primary = r.display_name.split(',')[0]?.trim() || r.display_name;
        return {
          id: `geo-${r.place_id}`,
          label: primary,
          sublabel: r.display_name,
          kind: 'place',
          regionId: null,
          lng,
          lat,
          zoom: zoomForType(r.addresstype ?? r.type, r.class),
          category: 'place',
          source: 'OpenStreetMap · Nominatim',
          description: r.display_name,
        };
      })
      .filter((e) => Number.isFinite(e.lng) && Number.isFinite(e.lat));
  } catch {
    // AbortError 或网络异常：静默返回空，保留本地结果
    return [];
  }
}
