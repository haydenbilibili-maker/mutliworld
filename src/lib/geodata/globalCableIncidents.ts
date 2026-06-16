import type { RegionId } from '@/types/region';
import { getRegion } from '@/regions';
import {
  GLOBAL_CABLE_INCIDENTS,
  type CableIncident,
} from '@/regions/global.cableIncidents';

function inBounds(
  lng: number,
  lat: number,
  bounds: [[number, number], [number, number]],
): boolean {
  const [[minLng, minLat], [maxLng, maxLat]] = bounds;
  return lng >= minLng && lng <= maxLng && lat >= minLat && lat <= maxLat;
}

/** 按区域边界筛选断缆事件；无边界（全球视角）返回全部 */
export function getGlobalCableIncidentsForRegion(
  regionId: RegionId,
): CableIncident[] {
  const bounds = getRegion(regionId)?.bounds;
  if (!bounds) return GLOBAL_CABLE_INCIDENTS;
  return GLOBAL_CABLE_INCIDENTS.filter((p) => inBounds(p.lng, p.lat, bounds));
}
