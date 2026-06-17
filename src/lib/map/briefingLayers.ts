import type { LayerId } from '@/types/geo';

/** 中国专题简报模块 → 建议开启的图层 */
export const CHINA_BRIEFING_MODULE_LAYERS: Record<string, LayerId[]> = {
  scs: ['conflicts', 'conflict_zones', 'hotspots', 'maritime', 'waterways', 'sanctions'],
  disputes: ['conflicts', 'conflict_zones', 'hotspots', 'bases', 'maritime'],
  island: ['bases', 'military', 'hotspots', 'garrisons', 'waterways'],
  taiwan: ['conflicts', 'conflict_zones', 'hotspots', 'military', 'bases'],
  japan: ['conflicts', 'military', 'bases', 'hotspots', 'waterways'],
  korea: ['conflicts', 'conflict_zones', 'military', 'nuclear', 'hotspots'],
};

/** 美国专题简报模块 → 建议开启的图层 */
export const US_BRIEFING_MODULE_LAYERS: Record<string, LayerId[]> = {
  nuclear: ['nuclear', 'military', 'bases'],
  garrisons: ['garrisons', 'bases', 'military', 'hotspots'],
  homeland: ['outages', 'protests', 'conflicts', 'conflict_zones'],
  indo: ['military', 'bases', 'hotspots', 'garrisons', 'waterways'],
  nato: ['military', 'bases', 'garrisons', 'sanctions'],
  supply: ['economic', 'minerals', 'pipelines', 'semiconductors'],
  domestic: ['protests', 'conflicts', 'conflict_zones', 'outages'],
  surface: ['economic', 'weather', 'live_weather', 'live_flights', 'live_maritime', 'pizza_index'],
};

/** 简报模块点击：若相关图层未开则自动开启 */
export function ensureBriefingLayers(
  moduleKey: string,
  layerMap: Record<string, LayerId[]>,
  activeLayers: LayerId[],
  toggleLayer: (layerId: LayerId) => void,
): void {
  const needed = layerMap[moduleKey];
  if (!needed?.length) return;
  for (const id of needed) {
    if (!activeLayers.includes(id)) toggleLayer(id);
  }
}
