import type { EventDetail } from '@/types/geo';
import type { LayerId } from '@/types/geo';
import { ensureBriefingLayers } from '@/lib/map/briefingLayers';

interface FocusActions {
  selectEvent: (event: EventDetail | null) => void;
  setViewport: (center: [number, number], zoom: number) => void;
  activeLayers: LayerId[];
  toggleLayer: (layerId: LayerId) => void;
}

/** 简报/列表点击：选中事件、飞向地图坐标，并按需开启相关图层 */
export function focusEventOnMap(
  event: EventDetail,
  actions: FocusActions,
  zoom = 5,
  moduleKey?: string,
  moduleLayerMap?: Record<string, LayerId[]>,
): void {
  if (moduleKey && moduleLayerMap) {
    ensureBriefingLayers(
      moduleKey,
      moduleLayerMap,
      actions.activeLayers,
      actions.toggleLayer,
    );
  }
  actions.selectEvent(event);
  const [lng, lat] = event.location;
  if (!Number.isFinite(lng) || !Number.isFinite(lat)) return;
  actions.setViewport([lng, lat], zoom);
}

/** 简报模块标题点击：仅开启相关图层（不移动视野） */
export function enableBriefingModuleLayers(
  moduleKey: string,
  moduleLayerMap: Record<string, LayerId[]>,
  activeLayers: LayerId[],
  toggleLayer: (layerId: LayerId) => void,
): void {
  ensureBriefingLayers(moduleKey, moduleLayerMap, activeLayers, toggleLayer);
}
