import type { RegionId } from '@/types/region';
import { getRegion } from '@/regions';
import {
  GLOBAL_GROUND_STATIONS,
  type GroundStation,
} from '@/regions/global.groundStations';

function inBounds(
  lng: number,
  lat: number,
  bounds: [[number, number], [number, number]],
): boolean {
  const [[minLng, minLat], [maxLng, maxLat]] = bounds;
  return lng >= minLng && lng <= maxLng && lat >= minLat && lat <= maxLat;
}

/** 按区域边界筛选地面测控站；无边界（全球视角）返回全部 */
export function getGlobalGroundStationsForRegion(
  regionId: RegionId,
): GroundStation[] {
  const bounds = getRegion(regionId)?.bounds;
  if (!bounds) return GLOBAL_GROUND_STATIONS;
  return GLOBAL_GROUND_STATIONS.filter((p) => inBounds(p.lng, p.lat, bounds));
}
