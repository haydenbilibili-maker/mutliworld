import type { Feature, FeatureCollection, Polygon } from 'geojson';
import type { RegionId } from '@/types/region';
import { getRegion } from '@/regions';
import {
  GLOBAL_CONFLICT_ZONES,
  type ConflictIntensity,
  type ConflictZone,
} from '@/regions/global.conflict-zones';

const INTENSITY_FILL_OPACITY: Record<ConflictIntensity, number> = {
  high: 0.32,
  medium: 0.22,
};

function bboxIntersects(
  ring: [number, number][],
  bounds: [[number, number], [number, number]],
): boolean {
  let minLng = Infinity;
  let minLat = Infinity;
  let maxLng = -Infinity;
  let maxLat = -Infinity;
  for (const [lng, lat] of ring) {
    minLng = Math.min(minLng, lng);
    maxLng = Math.max(maxLng, lng);
    minLat = Math.min(minLat, lat);
    maxLat = Math.max(maxLat, lat);
  }
  const [[bMinLng, bMinLat], [bMaxLng, bMaxLat]] = bounds;
  return !(maxLng < bMinLng || minLng > bMaxLng || maxLat < bMinLat || minLat > bMaxLat);
}

function zoneToFeature(zone: ConflictZone): Feature<Polygon> {
  const fillColor = zone.fillColor ?? (zone.intensity === 'high' ? '#FF4D4F' : '#FF7A45');
  const lineColor = zone.lineColor ?? fillColor;
  const fillOpacity = zone.dashed ? 0.12 : INTENSITY_FILL_OPACITY[zone.intensity];

  return {
    type: 'Feature',
    geometry: {
      type: 'Polygon',
      coordinates: [zone.ring],
    },
    properties: {
      id: zone.id,
      layerId: 'conflict_zones',
      title: zone.nameZh,
      name: zone.name,
      nameZh: zone.nameZh,
      status: zone.status,
      since: zone.since,
      intensity: zone.intensity,
      description: zone.description,
      dashed: zone.dashed ?? false,
      fillColor,
      lineColor,
      fillOpacity,
      labelLng: zone.label[0],
      labelLat: zone.label[1],
      lng: zone.label[0],
      lat: zone.label[1],
      source: '冲突区示意数据',
      timestamp: '2026-01-01T00:00:00.000Z',
      category: 'conflict_zones',
      impact: zone.intensity === 'high' ? 'critical' : 'high',
    },
  };
}

/** 按区域边界筛选冲突区；全球视角返回全部 */
export function getConflictZonesForRegion(regionId: RegionId): ConflictZone[] {
  const bounds = getRegion(regionId)?.bounds;
  if (!bounds) return GLOBAL_CONFLICT_ZONES;
  return GLOBAL_CONFLICT_ZONES.filter((z) => bboxIntersects(z.ring, bounds));
}

/** 构建 conflict_zones 图层 GeoJSON */
export function buildConflictZonesGeoJSON(regionId: RegionId): FeatureCollection<Polygon> {
  const zones = getConflictZonesForRegion(regionId);
  return {
    type: 'FeatureCollection',
    features: zones.map(zoneToFeature),
  };
}
