import type { RegionId } from '@/types/region';
import { getRegion } from '@/regions';
import { GLOBAL_LAUNCH_SITES, type LaunchSitePoint } from '@/regions/global.launchSites';

function inBounds(
  lng: number,
  lat: number,
  bounds: [[number, number], [number, number]],
): boolean {
  const [[minLng, minLat], [maxLng, maxLat]] = bounds;
  return lng >= minLng && lng <= maxLng && lat >= minLat && lat <= maxLat;
}

/**
 * 按区域边界筛选全球航天发射场。
 * 无边界（中国/全球视角）返回全部。
 */
export function getGlobalLaunchSitesForRegion(regionId: RegionId): LaunchSitePoint[] {
  const bounds = getRegion(regionId)?.bounds;
  if (!bounds) return GLOBAL_LAUNCH_SITES;
  return GLOBAL_LAUNCH_SITES.filter((p) => inBounds(p.lng, p.lat, bounds));
}
