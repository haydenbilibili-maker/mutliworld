import type { RegionId } from '@/types/region';
import type { LayerId, GeoJSONFeature, ImpactLevel } from '@/types/geo';
import { getRegion } from '@/regions';
import {
  GLOBAL_THEMATIC_POINTS,
  GLOBAL_PIPELINES,
  type ThematicPoint,
  type PipelineRoute,
} from '@/regions/global.thematic';
import { buildTerminatorSegments } from '@/lib/geodata/terminator';
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

function lineIntersectsRegion(
  coords: [number, number][],
  bounds: [[number, number], [number, number]] | undefined,
): boolean {
  if (!bounds) return true;
  return coords.some(([lng, lat]) => inBounds(lng, lat, bounds));
}

export function getThematicPointsForRegion(regionId: RegionId): ThematicPoint[] {
  const bounds = getRegion(regionId)?.bounds;
  if (!bounds) return GLOBAL_THEMATIC_POINTS;
  return GLOBAL_THEMATIC_POINTS.filter((p) => inBounds(p.lng, p.lat, bounds));
}

export function getPipelinesForRegion(regionId: RegionId): PipelineRoute[] {
  const bounds = getRegion(regionId)?.bounds;
  if (!bounds) return GLOBAL_PIPELINES;
  return GLOBAL_PIPELINES.filter((p) => lineIntersectsRegion(p.coordinates, bounds));
}

export function buildDaynightFeatures(generatedAt: string): GeoJSONFeature[] {
  const segments = buildTerminatorSegments(new Date(generatedAt));
  return segments.map((coords, i) => {
    const [lng, lat] = lineMidpoint(coords);
    return {
      type: 'Feature' as const,
      geometry: { type: 'LineString' as const, coordinates: coords },
      properties: {
        id: `daynight-${i}`,
        title: '昼夜分界线（晨昏线）',
        source: '天文计算',
        timestamp: generatedAt,
        impact: 'low' as ImpactLevel,
        layerId: 'daynight',
        category: 'daynight',
        description: '当前 UTC 下的晨昏线示意，夜半球位于线西侧',
        opacity: 0.85,
        lng,
        lat,
        lineColor: '#fbbf24',
        markerEmoji: '🌓',
        markerLabel: '晨昏线',
      },
    };
  });
}

export function thematicPointToFeature(
  p: ThematicPoint,
  props: Record<string, unknown>,
): GeoJSONFeature {
  const marker = resolveMarkerStyle({
    layerId: p.layerId,
    impact: String(props.impact ?? p.impact),
    subKind: p.subKind,
  });

  return {
    type: 'Feature',
    geometry: { type: 'Point', coordinates: [p.lng, p.lat] },
    properties: {
      id: p.id,
      title: p.name,
      source: '全球主题档案',
      impact: p.impact,
      layerId: p.layerId,
      category: p.layerId,
      description: p.note,
      subKind: p.subKind ?? '',
      lng: p.lng,
      lat: p.lat,
      ...props,
      ...marker,
    },
  };
}

export function pipelineToFeature(p: PipelineRoute, generatedAt: string): GeoJSONFeature {
  const [lng, lat] = lineMidpoint(p.coordinates);
  const marker = resolveMarkerStyle({ layerId: 'pipelines', impact: p.impact });

  return {
    type: 'Feature',
    geometry: { type: 'LineString', coordinates: p.coordinates },
    properties: {
      id: p.id,
      title: p.name,
      source: '公开能源资料',
      timestamp: generatedAt,
      impact: p.impact,
      layerId: 'pipelines',
      category: 'pipelines',
      description: p.note,
      opacity: 0.88,
      lng,
      lat,
      lineColor: LAYER_HALO_COLORS.pipelines ?? '#f97316',
      ...marker,
    },
  };
}

/** 需做区域过滤的主题图层点 */
export const THEMATIC_POINT_LAYERS: LayerId[] = [
  'econ_hubs',
  'minerals',
  'datacenters',
  'protests',
  'climate',
  'megacities',
  'dams',
  'ports',
  'research_stations',
  'refineries',
  'airports',
  'nuclear_reactors',
  'factories',
  'financial_centers',
  'borders',
  'deserts',
  'universities',
  'military_industry',
  'wonder_projects',
  'agriculture',
  'religions',
  'stadiums',
  'museums',
  'islands',
];
