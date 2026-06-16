import type { RegionId } from '@/types/region';
import type { Facility } from '@/types/middleeast';
import { getRegion } from '@/regions';
import { GLOBAL_NUCLEAR_FACILITIES } from '@/regions/global.nuclear';

function inBounds(
  lng: number,
  lat: number,
  bounds: [[number, number], [number, number]],
): boolean {
  const [[minLng, minLat], [maxLng, maxLat]] = bounds;
  return lng >= minLng && lng <= maxLng && lat >= minLat && lat <= maxLat;
}

/** 两点近似距离（度），用于去重 */
function degDistance(a: { lng: number; lat: number }, b: { lng: number; lat: number }): number {
  const dLng = a.lng - b.lng;
  const dLat = a.lat - b.lat;
  return Math.sqrt(dLng * dLng + dLat * dLat);
}

const DEDUP_RADIUS_DEG = 0.08;

/**
 * 按区域边界筛选全球核设施；无边界（中国/全球视角）返回全部。
 * 与区域已有核设施坐标过近时跳过，避免重复标点。
 */
export function getGlobalNuclearForRegion(
  regionId: RegionId,
  existingFacilities: Facility[] = [],
): Facility[] {
  const mod = getRegion(regionId);
  const bounds = mod?.bounds;

  const existingNuclear = existingFacilities.filter(
    (f) => f.type === 'nuclear' || f.nuclearKind,
  );

  return GLOBAL_NUCLEAR_FACILITIES.filter((site) => {
    if (bounds && !inBounds(site.position.lng, site.position.lat, bounds)) {
      return false;
    }
    const dup = existingNuclear.some(
      (ex) => degDistance(ex.position, site.position) < DEDUP_RADIUS_DEG,
    );
    return !dup;
  });
}
