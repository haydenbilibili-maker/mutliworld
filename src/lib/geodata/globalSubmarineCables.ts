import type { RegionId } from '@/types/region';
import type { GeoJSONFeature } from '@/types/geo';
import { getRegion } from '@/regions';
import {
  GLOBAL_SUBMARINE_CABLES,
  type SubmarineCableRoute,
} from '@/regions/global.submarineCables';
import { LAYER_HALO_COLORS, resolveMarkerStyle } from '@/lib/geodata/markerStyle';

function inBounds(
  lng: number,
  lat: number,
  bounds: [[number, number], [number, number]],
): boolean {
  const [[minLng, minLat], [maxLng, maxLat]] = bounds;
  return lng >= minLng && lng <= maxLng && lat >= minLat && lat <= maxLat;
}

function lineMidpoint(coords: [number, number][]): [number, number] {
  const mid = coords[Math.floor(coords.length / 2)];
  return mid ?? coords[0];
}

function routeIntersectsRegion(
  coords: [number, number][],
  bounds: [[number, number], [number, number]] | undefined,
): boolean {
  if (!bounds) return true;
  return coords.some(([lng, lat]) => inBounds(lng, lat, bounds));
}

/** 按区域边界筛选海缆路由（任一路点落入边界即保留） */
export function getSubmarineCablesForRegion(regionId: RegionId): SubmarineCableRoute[] {
  const bounds = getRegion(regionId)?.bounds;
  if (!bounds) return GLOBAL_SUBMARINE_CABLES;
  return GLOBAL_SUBMARINE_CABLES.filter((c) => routeIntersectsRegion(c.coordinates, bounds));
}

export function cableRouteToFeature(
  route: SubmarineCableRoute,
  generatedAt: string,
): GeoJSONFeature {
  const [lng, lat] = lineMidpoint(route.coordinates);
  const marker = resolveMarkerStyle({ layerId: 'cables', impact: route.impact, subKind: 'cable-route' });
  const meta = [route.capacity, route.year ? `${route.year} 年` : ''].filter(Boolean).join(' · ');
  const description = meta ? `${route.note}\n${meta}` : route.note;

  return {
    type: 'Feature',
    geometry: { type: 'LineString', coordinates: route.coordinates },
    properties: {
      id: route.id,
      title: route.name,
      source: '公开电信/海缆资料',
      timestamp: generatedAt,
      impact: route.impact,
      layerId: 'cables',
      category: 'cables',
      geomType: 'line',
      description,
      opacity: route.planned ? 0.55 : 0.82,
      planned: route.planned ?? false,
      capacity: route.capacity ?? '',
      year: route.year ?? '',
      lng,
      lat,
      lineColor: LAYER_HALO_COLORS.cables ?? '#22d3ee',
      ...marker,
    },
  };
}

export function cableRoutesToFeatures(
  routes: SubmarineCableRoute[],
  generatedAt: string,
): GeoJSONFeature[] {
  return routes.map((r) => cableRouteToFeature(r, generatedAt));
}
