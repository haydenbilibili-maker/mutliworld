import type { RegionId } from '@/types/region';
import { getRegion } from '@/regions';
import { GLOBAL_INFRASTRUCTURE, type InfraPoint } from '@/regions/global.infrastructure';

function inBounds(
  lng: number,
  lat: number,
  bounds: [[number, number], [number, number]],
): boolean {
  const [[minLng, minLat], [maxLng, maxLat]] = bounds;
  return lng >= minLng && lng <= maxLng && lat >= minLat && lat <= maxLat;
}

/**
 * 按区域边界筛选全球基础设施点（航空/海运/海缆）。
 * 无边界（中国/全球视角）返回全部。
 */
export function getGlobalInfrastructureForRegion(regionId: RegionId): InfraPoint[] {
  const bounds = getRegion(regionId)?.bounds;
  if (!bounds) return GLOBAL_INFRASTRUCTURE;
  return GLOBAL_INFRASTRUCTURE.filter((p) => inBounds(p.lng, p.lat, bounds));
}
