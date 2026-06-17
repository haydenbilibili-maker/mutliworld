/**
 * 披萨门店坐标解析 — 与 pizzint.watch / 本地种子对齐
 */

import { PIZZA_VENUES } from '@/lib/pizza-index/venues';

function normalizeName(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9&]+/g, ' ').trim();
}

/** 按名称模糊匹配本地种子坐标（pizzint 地址无 @lat,lng 时回退） */
export function matchVenueSeed(name: string, id?: string) {
  if (id) {
    const byId = PIZZA_VENUES.find((v) => v.id === id);
    if (byId) return byId;
  }
  const norm = normalizeName(name);
  return PIZZA_VENUES.find((v) => {
    const seedNorm = normalizeName(v.name);
    return norm.includes(normalizeName(v.brand)) || seedNorm.includes(norm) || norm.includes(seedNorm);
  });
}

/** 确保地图标记坐标有效；优先 API 解析，其次种子库 */
export function resolveVenueCoords(
  name: string,
  lat: number,
  lng: number,
  id?: string,
): { lat: number; lng: number } {
  if (Number.isFinite(lat) && Number.isFinite(lng) && (lat !== 0 || lng !== 0)) {
    return { lat, lng };
  }
  const seed = matchVenueSeed(name, id);
  if (seed) return { lat: seed.lat, lng: seed.lng };
  return { lat, lng };
}
