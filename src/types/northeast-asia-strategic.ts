import type { LayerId } from '@/types/geo';

/** 战略研究模块内的小节 */
export interface NortheastAsiaSection {
  heading: string;
  paragraphs: string[];
}

/** 东北亚地缘博弈 · 深度阅读模块 */
export interface NortheastAsiaModule {
  id: string;
  title: string;
  summary: string;
  sections: NortheastAsiaSection[];
  mapView?: { center: [number, number]; zoom: number };
  relatedLayerIds?: LayerId[];
}

export type NortheastAsiaModuleId =
  | 'overview'
  | 'five_powers'
  | 'us_alliance'
  | 'peninsula'
  | 'japan_russia'
  | 'china_us_rebalance';
