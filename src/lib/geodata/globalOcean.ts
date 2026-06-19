import type { RegionId } from '@/types/region';
import type { GeoJSONFeature, LayerId } from '@/types/geo';
import { getRegion } from '@/regions';
import {
  GLOBAL_MARINE_ARCHAEOLOGY,
  GLOBAL_OCEAN_CURRENTS,
  GLOBAL_FISHERIES,
  GLOBAL_MONSOON,
  GLOBAL_ATMOSPHERIC_CIRCULATION,
  GLOBAL_DEEP_EXPLORATION,
  type OceanPoint,
  type OceanCurrentRoute,
} from '@/regions/global.ocean';
import {
  GLOBAL_CORAL_REEFS,
  GLOBAL_MARINE_LIFE,
  GLOBAL_UNDERSEA_WONDERS,
  GLOBAL_MIGRATION_ROUTES,
} from '@/regions/global.ocean-life';
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

function filterPointsForRegion(points: OceanPoint[], regionId: RegionId): OceanPoint[] {
  const bounds = getRegion(regionId)?.bounds;
  if (!bounds) return points;
  return points.filter((p) => inBounds(p.lng, p.lat, bounds));
}

function filterCurrentsForRegion(routes: OceanCurrentRoute[], regionId: RegionId): OceanCurrentRoute[] {
  const bounds = getRegion(regionId)?.bounds;
  if (!bounds) return routes;
  return routes.filter((r) => lineIntersectsRegion(r.coordinates, bounds));
}

export function getMarineArchaeologyForRegion(regionId: RegionId): OceanPoint[] {
  return filterPointsForRegion(GLOBAL_MARINE_ARCHAEOLOGY, regionId);
}

export function getOceanCurrentsForRegion(regionId: RegionId): OceanCurrentRoute[] {
  return filterCurrentsForRegion(GLOBAL_OCEAN_CURRENTS, regionId);
}

export function getFisheriesForRegion(regionId: RegionId): OceanPoint[] {
  return filterPointsForRegion(GLOBAL_FISHERIES, regionId);
}

export function getMonsoonForRegion(regionId: RegionId): OceanPoint[] {
  return filterPointsForRegion(GLOBAL_MONSOON, regionId);
}

export function getAtmosphericCirculationForRegion(regionId: RegionId): OceanPoint[] {
  return filterPointsForRegion(GLOBAL_ATMOSPHERIC_CIRCULATION, regionId);
}

export function getCoralReefsForRegion(regionId: RegionId): OceanPoint[] {
  return filterPointsForRegion(GLOBAL_CORAL_REEFS, regionId);
}

export function getMarineLifeForRegion(regionId: RegionId): OceanPoint[] {
  return filterPointsForRegion(GLOBAL_MARINE_LIFE, regionId);
}

export function getUnderseaWondersForRegion(regionId: RegionId): OceanPoint[] {
  return filterPointsForRegion(GLOBAL_UNDERSEA_WONDERS, regionId);
}

export function getMigrationRoutesForRegion(regionId: RegionId): OceanCurrentRoute[] {
  return filterCurrentsForRegion(GLOBAL_MIGRATION_ROUTES, regionId);
}

export function getDeepExplorationForRegion(regionId: RegionId): OceanPoint[] {
  return filterPointsForRegion(GLOBAL_DEEP_EXPLORATION, regionId);
}

const OCEAN_POINT_KIND_LABEL: Record<string, string> = {
  merchant: '商船',
  ancient: '古代沉船',
  galleon: '宝船',
  modern: '近代沉船',
  warship: '军舰',
  colonial: '殖民时期',
  groundfish: '底栖渔业',
  pelagic: '远洋渔业',
  coastal: '近海渔业',
  summer: '夏季/湿季',
  winter: '冬季/干季',
  year_round: '全年/年际变化',
  itcz: '赤道辐合带',
  trade_wind: '信风带',
  subtropical_high: '副热带高压',
  jet_stream: '急流',
  hadley: '哈德利环流',
  polar: '极地环流',
  walker: '沃克环流',
  semi_permanent: '半永久性系统',
  trench: '海沟',
  hydrothermal: '热液喷口',
  manned: '载人深潜',
  rov: '无人深潜器',
  institution: '科考机构',
};

function oceanPointToFeature(p: OceanPoint, generatedAt: string): GeoJSONFeature {
  const marker = resolveMarkerStyle({
    layerId: p.layerId,
    impact: p.impact,
    subKind: p.subKind ?? '',
  });
  const kindLabel = p.subKind ? (OCEAN_POINT_KIND_LABEL[p.subKind] ?? p.subKind) : '';
  const description = kindLabel ? `${kindLabel} · ${p.note}` : p.note;

  return {
    type: 'Feature',
    geometry: { type: 'Point', coordinates: [p.lng, p.lat] },
    properties: {
      id: p.id,
      title: p.name,
      source: '公开海洋地理资料',
      timestamp: generatedAt,
      impact: p.impact,
      category: p.layerId,
      layerId: p.layerId,
      description,
      opacity: 0.88,
      subKind: p.subKind ?? '',
      lng: p.lng,
      lat: p.lat,
      ...marker,
    },
  };
}

export function oceanCurrentToFeature(
  route: OceanCurrentRoute,
  generatedAt: string,
  layerId: LayerId = 'ocean_currents',
  lineColor = '#06b6d4',
): GeoJSONFeature {
  const [lng, lat] = lineMidpoint(route.coordinates);
  const marker = resolveMarkerStyle({ layerId, impact: route.impact });
  const isMigration = layerId === 'migration_routes';
  const prefix = route.direction ? `${isMigration ? '方向' : '流向'}：${route.direction} · ` : '';
  const description = `${prefix}${route.note}`;

  return {
    type: 'Feature',
    geometry: { type: 'LineString', coordinates: route.coordinates },
    properties: {
      id: route.id,
      title: route.name,
      source: isMigration ? '公开海洋生态资料' : '公开海洋学资料',
      timestamp: generatedAt,
      impact: route.impact,
      category: layerId,
      layerId,
      geomType: 'line',
      description,
      opacity: 0.78,
      direction: route.direction ?? '',
      lng,
      lat,
      lineColor,
      ...marker,
    },
  };
}

export function oceanPointsToFeatures(
  points: OceanPoint[],
  layerId: LayerId,
  active: Set<LayerId>,
  generatedAt: string,
): GeoJSONFeature[] {
  if (!active.has(layerId)) return [];
  return points.filter((p) => p.layerId === layerId).map((p) => oceanPointToFeature(p, generatedAt));
}

export function oceanCurrentsToFeatures(
  routes: OceanCurrentRoute[],
  active: Set<LayerId>,
  generatedAt: string,
): GeoJSONFeature[] {
  if (!active.has('ocean_currents')) return [];
  return routes.map((r) => oceanCurrentToFeature(r, generatedAt));
}

/** 通用洋底线要素（迁徙路线等）：按给定 layerId 渲染 */
export function oceanRoutesToFeatures(
  routes: OceanCurrentRoute[],
  layerId: LayerId,
  active: Set<LayerId>,
  generatedAt: string,
  lineColor = '#34d399',
): GeoJSONFeature[] {
  if (!active.has(layerId)) return [];
  return routes.map((r) => oceanCurrentToFeature(r, generatedAt, layerId, lineColor));
}

export const OCEAN_LAYER_HALO_COLOR = LAYER_HALO_COLORS.ocean_currents ?? '#06b6d4';
