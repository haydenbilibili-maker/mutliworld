import type { RegionId } from '@/types/region';
import { getRegion } from '@/regions';
import { GLOBAL_SPACE_EVENTS, type SpaceEvent } from '@/regions/global.spaceEvents';

function inBounds(
  lng: number,
  lat: number,
  bounds: [[number, number], [number, number]],
): boolean {
  const [[minLng, minLat], [maxLng, maxLat]] = bounds;
  return lng >= minLng && lng <= maxLng && lat >= minLat && lat <= maxLat;
}

/** 按区域边界筛选空天事件；无边界（全球视角）返回全部 */
export function getGlobalSpaceEventsForRegion(regionId: RegionId): SpaceEvent[] {
  const bounds = getRegion(regionId)?.bounds;
  if (!bounds) return GLOBAL_SPACE_EVENTS;
  return GLOBAL_SPACE_EVENTS.filter((e) => inBounds(e.lng, e.lat, bounds));
}
