import type { LayerId } from '@/types/geo';

/** 战略研究模块内的小节 */
export interface StrategicSection {
  heading: string;
  paragraphs: string[];
}

/** 中美战略博弈 · 深度阅读模块 */
export interface StrategicModule {
  id: string;
  title: string;
  summary: string;
  sections: StrategicSection[];
  /** 点击「在地图上查看」时飞往的坐标与缩放 */
  mapView?: { center: [number, number]; zoom: number };
  /** 阅读时建议高亮的地图图层 */
  relatedLayerIds?: LayerId[];
}

export type StrategicModuleId =
  | 'overview'
  | 'trade_tech'
  | 'military'
  | 'alliance'
  | 'diplomacy'
  | 'scenarios';
