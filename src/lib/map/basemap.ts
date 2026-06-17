/**
 * 三位一体空间层底图配置
 *
 * 地表：OpenFreeMap 矢量自然地理底图 + 全球 DEM 山体阴影/3D 地形
 * 洋底/宇宙：深色国界+经纬网（态势暗色画布，由 BathymetryLayer / 星空叠加增强）
 */

import type { StyleSpecification } from 'maplibre-gl';
import type { Map as MaplibreMap } from 'maplibre-gl';
import type { BasemapPreset } from '@/types/tier';
import { buildGraticule } from '@/lib/graticule';

/** OpenFreeMap planet 矢量瓦片 maxzoom（Fiord 样式依赖此源） */
export const SURFACE_BASEMAP_MAX_ZOOM = 14;

/** 全球 Terrarium DEM maxzoom（Mapzen/AWS 公开瓦片） */
export const TERRAIN_DEM_MAX_ZOOM = 15;

const DARK_BASEMAP_MAX_ZOOM = 22;

/** Mapzen Terrarium RGB — 全球覆盖，无需 API Key */
export const GLOBAL_TERRAIN_TILES = [
  'https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png',
];

/**
 * MapLibre 官方演示 DEM — 仅欧洲小片区域有真实数据，亚太/全球视图会 404。
 * 保留供本地调试；生产默认使用 GLOBAL_TERRAIN_TILES。
 */
export const MAPLIBRE_TERRAIN_TILES =
  'https://demotiles.maplibre.org/terrain-tiles/tiles.json';

/** 默认地表矢量样式：Fiord — 水体/陆地/自然要素，偏户外地理风 */
export const DEFAULT_SURFACE_STYLE_URL =
  'https://tiles.openfreemap.org/styles/fiord';

export const TERRAIN_SOURCE_ID = 'mw-terrain-dem';
export const HILLSHADE_LAYER_ID = 'mw-hillshade';

const terrainZoomHandlers = new WeakMap<MaplibreMap, () => void>();

/** 从环境变量读取地表样式 URL（可换 MapTiler Outdoor 等，需自备 Key） */
export function getSurfaceStyleUrl(): string {
  return (
    process.env.NEXT_PUBLIC_MAP_STYLE_SURFACE?.trim() ||
    DEFAULT_SURFACE_STYLE_URL
  );
}

/** 解析 DEM 瓦片：显式 tiles 数组或 TileJSON URL */
export function resolveTerrainDemSource(): {
  tiles?: string[];
  url?: string;
  encoding: 'terrarium' | 'mapbox';
  maxzoom: number;
} {
  const custom = process.env.NEXT_PUBLIC_MAP_TERRAIN_TILES?.trim();
  if (custom) {
    if (custom.endsWith('.json')) {
      return { url: custom, encoding: 'mapbox', maxzoom: TERRAIN_DEM_MAX_ZOOM };
    }
    return {
      tiles: [custom],
      encoding: custom.includes('terrarium') ? 'terrarium' : 'mapbox',
      maxzoom: TERRAIN_DEM_MAX_ZOOM,
    };
  }
  return {
    tiles: GLOBAL_TERRAIN_TILES,
    encoding: 'terrarium',
    maxzoom: TERRAIN_DEM_MAX_ZOOM,
  };
}

/** 是否启用地形增强（山体阴影 + 3D 地形）；默认开启，可通过 env 关闭 */
export function isTerrainEnhanceEnabled(): boolean {
  const raw = process.env.NEXT_PUBLIC_MAP_TERRAIN_ENHANCE?.trim().toLowerCase();
  if (raw === 'false' || raw === '0' || raw === 'off') return false;
  return true;
}

/** 按底图预设约束地图 maxZoom，避免请求超出瓦片源能力的级别 */
export function applyBasemapZoomConstraints(
  map: MaplibreMap,
  preset: BasemapPreset,
): void {
  const maxZoom =
    preset === 'geographic' ? SURFACE_BASEMAP_MAX_ZOOM : DARK_BASEMAP_MAX_ZOOM;
  map.setMaxZoom(maxZoom);
  if (map.getZoom() > maxZoom) {
    map.setZoom(maxZoom);
  }
}

/** 深色态势底图（洋底/宇宙层）：国界轮廓 + 经纬网，不依赖外部瓦片 */
export function buildDarkBasemapStyle(): StyleSpecification {
  return {
    version: 8,
    sources: {
      countries: {
        type: 'vector',
        url: 'https://demotiles.maplibre.org/tiles/tiles.json',
      },
      graticule: { type: 'geojson', data: buildGraticule(20) },
    },
    layers: [
      {
        id: 'background',
        type: 'background',
        paint: { 'background-color': '#0A0E17' },
      },
      {
        id: 'country-fill',
        type: 'fill',
        source: 'countries',
        'source-layer': 'countries',
        paint: { 'fill-color': '#13233f', 'fill-opacity': 0.7 },
      },
      {
        id: 'country-line',
        type: 'line',
        source: 'countries',
        'source-layer': 'countries',
        paint: { 'line-color': '#2d5a8c', 'line-width': 0.6 },
      },
      {
        id: 'graticule-lines',
        type: 'line',
        source: 'graticule',
        paint: {
          'line-color': '#3b6ea5',
          'line-width': 0.5,
          'line-opacity': 0.35,
        },
      },
    ],
  };
}

/** 按底图预设解析初始/切换样式 */
export function resolveBasemapStyle(
  preset: BasemapPreset,
): string | StyleSpecification {
  if (preset === 'geographic') {
    return getSurfaceStyleUrl();
  }
  return buildDarkBasemapStyle();
}

function syncTerrainForZoom(map: MaplibreMap): void {
  if (!map.getSource(TERRAIN_SOURCE_ID)) return;
  const zoom = map.getZoom();
  const terrainActive = map.getTerrain() != null;
  if (zoom > TERRAIN_DEM_MAX_ZOOM && terrainActive) {
    map.setTerrain(null);
  } else if (zoom <= TERRAIN_DEM_MAX_ZOOM && !terrainActive) {
    map.setTerrain?.({ source: TERRAIN_SOURCE_ID, exaggeration: 1.15 });
  }
}

function bindTerrainZoomSync(map: MaplibreMap): void {
  if (terrainZoomHandlers.has(map)) return;
  const handler = () => syncTerrainForZoom(map);
  map.on('zoom', handler);
  terrainZoomHandlers.set(map, handler);
}

function unbindTerrainZoomSync(map: MaplibreMap): void {
  const handler = terrainZoomHandlers.get(map);
  if (!handler) return;
  map.off('zoom', handler);
  terrainZoomHandlers.delete(map);
}

/** 在已加载的地理底图上叠加 DEM 山体阴影与 3D 地形 */
export function applyTerrainEnhancement(map: MaplibreMap): void {
  if (map.getSource(TERRAIN_SOURCE_ID)) {
    syncTerrainForZoom(map);
    return;
  }

  const dem = resolveTerrainDemSource();
  map.addSource(TERRAIN_SOURCE_ID, {
    type: 'raster-dem',
    tileSize: 256,
    maxzoom: dem.maxzoom,
    encoding: dem.encoding,
    ...(dem.tiles ? { tiles: dem.tiles } : { url: dem.url }),
  });

  if (!map.getLayer(HILLSHADE_LAYER_ID)) {
    map.addLayer(
      {
        id: HILLSHADE_LAYER_ID,
        type: 'hillshade',
        source: TERRAIN_SOURCE_ID,
        paint: {
          'hillshade-exaggeration': 0.35,
          'hillshade-shadow-color': '#475569',
          'hillshade-highlight-color': '#f8fafc',
          'hillshade-accent-color': '#64748b',
        },
      },
      findOverlayBeforeId(map),
    );
  }

  syncTerrainForZoom(map);
  bindTerrainZoomSync(map);
}

/** 切换至非地理底图时清除 3D 地形 */
export function clearTerrainEnhancement(map: MaplibreMap): void {
  try {
    unbindTerrainZoomSync(map);
    map.setTerrain(null);
    if (map.getLayer(HILLSHADE_LAYER_ID)) map.removeLayer(HILLSHADE_LAYER_ID);
    if (map.getSource(TERRAIN_SOURCE_ID)) map.removeSource(TERRAIN_SOURCE_ID);
  } catch {
    /* v4 或无 terrain */
  }
}

/** 叠加层 insertBefore 锚点：优先态势图层，其次底图要素 */
export function findOverlayBeforeId(map: {
  getLayer: (id: string) => unknown;
  getStyle: () => StyleSpecification | undefined;
}): string | undefined {
  const preferred = [
    'geodata-api-halo',
    'geodata-api-lines-solid',
    'geodata-api-symbols',
    'country-line',
    HILLSHADE_LAYER_ID,
  ];
  for (const id of preferred) {
    if (map.getLayer(id)) return id;
  }
  const layers = map.getStyle()?.layers ?? [];
  const label = layers.find(
    (layer) =>
      layer.type === 'symbol' ||
      (layer.type === 'line' && layer.id !== 'graticule-lines'),
  );
  return label?.id;
}
