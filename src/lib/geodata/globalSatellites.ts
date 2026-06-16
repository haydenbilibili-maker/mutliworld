import type { RegionId } from '@/types/region';
import { getRegion } from '@/regions';
import { GLOBAL_SATELLITES, type SatellitePoint } from '@/regions/global.satellites';

/** GEO 卫星纬度固定为 0（赤道上空） */
const GEO_LAT = 0;

function lngInBounds(
  lng: number,
  bounds: [[number, number], [number, number]],
): boolean {
  const [[minLng, minLat], [maxLng, maxLat]] = bounds;
  return lng >= minLng && lng <= maxLng && GEO_LAT >= minLat && GEO_LAT <= maxLat;
}

/** 按区域边界（经度）筛选 GEO 卫星；无边界（全球视角）返回全部 */
export function getGlobalSatellitesForRegion(regionId: RegionId): SatellitePoint[] {
  const bounds = getRegion(regionId)?.bounds;
  if (!bounds) return GLOBAL_SATELLITES;
  return GLOBAL_SATELLITES.filter((s) => lngInBounds(s.lng, bounds));
}
