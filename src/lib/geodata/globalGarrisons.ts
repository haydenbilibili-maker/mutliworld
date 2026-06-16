import type { RegionId } from '@/types/region';
import { getRegion } from '@/regions';
import { GLOBAL_GARRISONS, type GarrisonBase } from '@/regions/global.garrisons';

function inBounds(
  lng: number,
  lat: number,
  bounds: [[number, number], [number, number]],
): boolean {
  const [[minLng, minLat], [maxLng, maxLat]] = bounds;
  return lng >= minLng && lng <= maxLng && lat >= minLat && lat <= maxLat;
}

/** 按区域边界筛选全球海外军事基地；无边界（全球视角）返回全部 */
export function getGlobalGarrisonsForRegion(regionId: RegionId): GarrisonBase[] {
  const bounds = getRegion(regionId)?.bounds;
  if (!bounds) return GLOBAL_GARRISONS;
  return GLOBAL_GARRISONS.filter((p) => inBounds(p.lng, p.lat, bounds));
}
