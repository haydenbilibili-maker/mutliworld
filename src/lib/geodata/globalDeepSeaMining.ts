import type { RegionId } from '@/types/region';
import { getRegion } from '@/regions';
import {
  GLOBAL_DEEP_SEA_MINING,
  type SeabedMiningArea,
} from '@/regions/global.deepSeaMining';

function inBounds(
  lng: number,
  lat: number,
  bounds: [[number, number], [number, number]],
): boolean {
  const [[minLng, minLat], [maxLng, maxLat]] = bounds;
  return lng >= minLng && lng <= maxLng && lat >= minLat && lat <= maxLat;
}

/** 按区域边界筛选深海采矿区；无边界（全球视角）返回全部 */
export function getGlobalDeepSeaMiningForRegion(
  regionId: RegionId,
): SeabedMiningArea[] {
  const bounds = getRegion(regionId)?.bounds;
  if (!bounds) return GLOBAL_DEEP_SEA_MINING;
  return GLOBAL_DEEP_SEA_MINING.filter((p) => inBounds(p.lng, p.lat, bounds));
}
