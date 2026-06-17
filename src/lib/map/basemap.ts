/**
 * 三位一体空间层底图配置
 *
 * 洋底：OpenFreeMap Fiord 矢量自然地理 + 全球 DEM 山体阴影/3D 地形
 * 地表/宇宙：卫星影像 / 政区国界 / 混合叠加（BasemapMode 切换）
 */

import type { StyleSpecification } from 'maplibre-gl';
import type { Map as MaplibreMap } from 'maplibre-gl';
import type { BasemapMode, BasemapPreset } from '@/types/tier';
import { buildGraticule } from '@/lib/graticule';

/** OpenFreeMap planet 矢量瓦片 maxzoom（Fiord / Liberty 样式依赖此源） */
export const SURFACE_BASEMAP_MAX_ZOOM = 14;

/** 卫星影像瓦片 maxzoom（ESRI World Imagery） */
export const SATELLITE_BASEMAP_MAX_ZOOM = 19;

/** 全球 Terrarium DEM maxzoom（Mapzen/AWS 公开瓦片） */
export const TERRAIN_DEM_MAX_ZOOM = 15;

const DARK_BASEMAP_MAX_ZOOM = 22;

/** ESRI World Imagery — 无需 API Key（生产请核对 ToS） */
export const ESRI_WORLD_IMAGERY_TILES = [
  'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
];

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

/** 洋底地理矢量样式：Fiord — 水体/陆地/自然要素，偏户外地理风 */
export const DEFAULT_GEOGRAPHIC_STYLE_URL =
  'https://tiles.openfreemap.org/styles/fiord';

/** 政区矢量样式：Liberty — 传统国界/标注 */
export const DEFAULT_POLITICAL_STYLE_URL =
  'https://tiles.openfreemap.org/styles/liberty';

/** @deprecated 使用 DEFAULT_GEOGRAPHIC_STYLE_URL */
export const DEFAULT_SURFACE_STYLE_URL = DEFAULT_GEOGRAPHIC_STYLE_URL;

export const TERRAIN_SOURCE_ID = 'mw-terrain-dem';
export const HILLSHADE_LAYER_ID = 'mw-hillshade';
export const SATELLITE_SOURCE_ID = 'mw-satellite';
export const SATELLITE_LAYER_ID = 'mw-satellite-raster';
export const HYBRID_COUNTRY_LINE_ID = 'mw-country-line';

const terrainZoomHandlers = new WeakMap<MaplibreMap, () => void>();

const BASEMAP_MODES: BasemapMode[] = ['satellite', 'political', 'hybrid'];

/** 解析 BasemapMode（URL / 存储） */
export function parseBasemapMode(raw: string | null | undefined): BasemapMode {
  if (raw && BASEMAP_MODES.includes(raw as BasemapMode)) {
    return raw as BasemapMode;
  }
  return 'hybrid';
}

/** 从环境变量读取洋底地理样式 URL */
export function getGeographicStyleUrl(): string {
  return (
    process.env.NEXT_PUBLIC_MAP_STYLE_SURFACE?.trim() ||
    DEFAULT_GEOGRAPHIC_STYLE_URL
  );
}

/** @deprecated 使用 getGeographicStyleUrl */
export function getSurfaceStyleUrl(): string {
  return getGeographicStyleUrl();
}

/** 从环境变量读取政区样式 URL */
export function getPoliticalStyleUrl(): string {
  return (
    process.env.NEXT_PUBLIC_MAP_STYLE_POLITICAL?.trim() ||
    DEFAULT_POLITICAL_STYLE_URL
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

/** 是否启用地形增强（山体阴影 + 3D 地形）；默认开启，洋底层 geographic 预设生效 */
export function isTerrainEnhanceEnabled(): boolean {
  const raw = process.env.NEXT_PUBLIC_MAP_TERRAIN_ENHANCE?.trim().toLowerCase();
  if (raw === 'false' || raw === '0' || raw === 'off') return false;
  return true;
}

/** 洋底 geographic 预设：Fiord + DEM */
export function isTerrainPreset(preset: BasemapPreset): boolean {
  return preset === 'geographic';
}

/** 地表/宇宙 imagery 预设 */
export function isImageryPreset(preset: BasemapPreset): boolean {
  return preset === 'imagery';
}

/** 按底图预设与模式约束地图 maxZoom */
export function applyBasemapZoomConstraints(
  map: MaplibreMap,
  preset: BasemapPreset,
  mode: BasemapMode = 'hybrid',
): void {
  let maxZoom = DARK_BASEMAP_MAX_ZOOM;
  if (isTerrainPreset(preset)) {
    maxZoom = SURFACE_BASEMAP_MAX_ZOOM;
  } else if (isImageryPreset(preset)) {
    maxZoom =
      mode === 'political' ? SURFACE_BASEMAP_MAX_ZOOM : SATELLITE_BASEMAP_MAX_ZOOM;
  }
  map.setMaxZoom(maxZoom);
  if (map.getZoom() > maxZoom) {
    map.setZoom(maxZoom);
  }
}

/** 纯卫星影像样式 */
export function buildSatelliteStyle(): StyleSpecification {
  return {
    version: 8,
    sources: {
      [SATELLITE_SOURCE_ID]: {
        type: 'raster',
        tiles: ESRI_WORLD_IMAGERY_TILES,
        tileSize: 256,
        maxzoom: SATELLITE_BASEMAP_MAX_ZOOM,
        attribution: 'Esri, Maxar, Earthstar Geographics',
      },
    },
    layers: [
      {
        id: 'background',
        type: 'background',
        paint: { 'background-color': '#0b1020' },
      },
      {
        id: SATELLITE_LAYER_ID,
        type: 'raster',
        source: SATELLITE_SOURCE_ID,
      },
    ],
  };
}

/** 混合样式：卫星底图 + 半透明国界矢量叠加 */
export function buildHybridStyle(): StyleSpecification {
  return {
    version: 8,
    sources: {
      [SATELLITE_SOURCE_ID]: {
        type: 'raster',
        tiles: ESRI_WORLD_IMAGERY_TILES,
        tileSize: 256,
        maxzoom: SATELLITE_BASEMAP_MAX_ZOOM,
        attribution: 'Esri, Maxar, Earthstar Geographics',
      },
      countries: {
        type: 'vector',
        url: 'https://demotiles.maplibre.org/tiles/tiles.json',
      },
    },
    layers: [
      {
        id: 'background',
        type: 'background',
        paint: { 'background-color': '#0b1020' },
      },
      {
        id: SATELLITE_LAYER_ID,
        type: 'raster',
        source: SATELLITE_SOURCE_ID,
      },
      {
        id: 'mw-country-fill',
        type: 'fill',
        source: 'countries',
        'source-layer': 'countries',
        paint: { 'fill-color': '#1e3a5f', 'fill-opacity': 0.12 },
      },
      {
        id: HYBRID_COUNTRY_LINE_ID,
        type: 'line',
        source: 'countries',
        'source-layer': 'countries',
        paint: {
          'line-color': '#f8fafc',
          'line-width': 1.2,
          'line-opacity': 0.85,
        },
      },
    ],
  };
}

/** 深色态势底图（遗留 starfield/seabed）：国界轮廓 + 经纬网 */
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

/** 解析地表/宇宙 imagery 样式 */
export function resolveImageryStyle(mode: BasemapMode): string | StyleSpecification {
  switch (mode) {
    case 'satellite':
      return buildSatelliteStyle();
    case 'political':
      return getPoliticalStyleUrl();
    case 'hybrid':
    default:
      return buildHybridStyle();
  }
}

/** 按底图预设与模式解析初始/切换样式 */
export function resolveBasemapStyle(
  preset: BasemapPreset,
  mode: BasemapMode = 'hybrid',
): string | StyleSpecification {
  if (isTerrainPreset(preset)) {
    return getGeographicStyleUrl();
  }
  if (isImageryPreset(preset)) {
    return resolveImageryStyle(mode);
  }
  return buildDarkBasemapStyle();
}

/** 洋底 ↔ 宇宙旧深色底图共用（遗留） */
export function isDarkBasemapPreset(preset: BasemapPreset): boolean {
  return preset === 'graticule' || preset === 'starfield' || preset === 'seabed';
}

/** 地表 ↔ 宇宙同为 imagery 且模式相同时可跳过 setStyle */
export function shouldSkipImageryStyleSwap(
  prevPreset: BasemapPreset,
  nextPreset: BasemapPreset,
  prevMode: BasemapMode,
  nextMode: BasemapMode,
): boolean {
  return (
    isImageryPreset(prevPreset) &&
    isImageryPreset(nextPreset) &&
    prevMode === nextMode
  );
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

/** 在已加载的地理底图上叠加 DEM 山体阴影与 3D 地形（洋底层） */
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

/** 切换至非 geographic 底图时清除 3D 地形 */
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

/** 实时点叠加锚点：在 geodata 之下、hillshade 之上；无 geodata 时置顶 */
export function findLiveOverlayBeforeId(map: {
  getLayer: (id: string) => unknown;
}): string | undefined {
  const geodataAnchors = [
    'geodata-api-halo',
    'geodata-api-lines-solid',
    'geodata-api-lines-daynight',
    'geodata-api-lines-planned',
    'geodata-api-symbols',
  ];
  for (const id of geodataAnchors) {
    if (map.getLayer(id)) return id;
  }
  return undefined;
}

/** @deprecated 使用 findLiveOverlayBeforeId */
export const findRadarOverlayBeforeId = findLiveOverlayBeforeId;

/** 叠加层 insertBefore 锚点：优先态势图层，其次底图要素 */
export function findOverlayBeforeId(map: {
  getLayer: (id: string) => unknown;
  getStyle: () => StyleSpecification | undefined;
}): string | undefined {
  const preferred = [
    'geodata-api-halo',
    'geodata-api-lines-solid',
    'geodata-api-symbols',
    HYBRID_COUNTRY_LINE_ID,
    'country-line',
    HILLSHADE_LAYER_ID,
    SATELLITE_LAYER_ID,
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
