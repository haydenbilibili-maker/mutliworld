import type { RegionId } from '@/types/region';
import { getRegion } from '@/regions';
import { GLOBAL_TECTONICS, type TectonicFeature } from '@/regions/global.tectonics';

function inBounds(
  lng: number,
  lat: number,
  bounds: [[number, number], [number, number]],
): boolean {
  const [[minLng, minLat], [maxLng, maxLat]] = bounds;
  return lng >= minLng && lng <= maxLng && lat >= minLat && lat <= maxLat;
}

/** 按区域边界筛选板块/断层；无边界（全球视角）返回全部 */
export function getGlobalTectonicsForRegion(regionId: RegionId): TectonicFeature[] {
  const bounds = getRegion(regionId)?.bounds;
  if (!bounds) return GLOBAL_TECTONICS;
  return GLOBAL_TECTONICS.filter((p) => inBounds(p.lng, p.lat, bounds));
}
