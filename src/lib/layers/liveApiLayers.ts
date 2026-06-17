import type { LayerId } from '@/types/geo';

/** 启用后会周期性请求外部 API 的实时图层 */
export const LIVE_API_LAYER_IDS: readonly LayerId[] = [
  'live_weather',
  'live_flights',
  'live_maritime',
  'pizza_index',
  'space_stations',
  'satellites',
  'space_debris',
] as const;

const LIVE_API_LAYER_SET = new Set<LayerId>(LIVE_API_LAYER_IDS);

/** 同时开启该数量及以上实时图层时提示性能影响 */
export const LIVE_API_PERFORMANCE_THRESHOLD = 3;

export const LIVE_LAYER_PERF_DISMISS_KEY = 'mw-live-layer-perf-dismiss';

export function isLiveApiLayer(layerId: LayerId): boolean {
  return LIVE_API_LAYER_SET.has(layerId);
}

export function countActiveLiveApiLayers(activeLayers: LayerId[]): number {
  return activeLayers.filter(isLiveApiLayer).length;
}
