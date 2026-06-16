import type { RegionId } from '@/types/region';
import { getRegion } from '@/regions';
import {
  GLOBAL_SEMICONDUCTORS,
  type SemiconductorFab,
} from '@/regions/global.semiconductors';

function inBounds(
  lng: number,
  lat: number,
  bounds: [[number, number], [number, number]],
): boolean {
  const [[minLng, minLat], [maxLng, maxLat]] = bounds;
  return lng >= minLng && lng <= maxLng && lat >= minLat && lat <= maxLat;
}

/** 按区域边界筛选全球晶圆厂；无边界（全球视角）返回全部 */
export function getGlobalSemiconductorsForRegion(
  regionId: RegionId,
): SemiconductorFab[] {
  const bounds = getRegion(regionId)?.bounds;
  if (!bounds) return GLOBAL_SEMICONDUCTORS;
  return GLOBAL_SEMICONDUCTORS.filter((p) => inBounds(p.lng, p.lat, bounds));
}
