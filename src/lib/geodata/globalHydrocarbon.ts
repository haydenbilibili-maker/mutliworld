import type { RegionId } from '@/types/region';
import { getRegion } from '@/regions';
import {
  GLOBAL_HYDROCARBON_RESERVES,
  type HydrocarbonReserveSite,
} from '@/regions/global.hydrocarbon';

function inBounds(
  lng: number,
  lat: number,
  bounds: [[number, number], [number, number]],
): boolean {
  const [[minLng, minLat], [maxLng, maxLat]] = bounds;
  return lng >= minLng && lng <= maxLng && lat >= minLat && lat <= maxLat;
}

/** 按区域边界筛选油气储藏点；无边界（全球视角）返回全部 */
export function getGlobalHydrocarbonForRegion(
  regionId: RegionId,
): HydrocarbonReserveSite[] {
  const bounds = getRegion(regionId)?.bounds;
  if (!bounds) return GLOBAL_HYDROCARBON_RESERVES;
  return GLOBAL_HYDROCARBON_RESERVES.filter((p) => inBounds(p.lng, p.lat, bounds));
}
