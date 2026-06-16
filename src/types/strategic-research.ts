import type { LayerId } from '@/types/geo';
import type { RegionId } from '@/types/region';

/** 战略研究模块内的小节 */
export interface StrategicResearchSection {
  heading: string;
  paragraphs: string[];
}

/** 单个战略研究面板内的深度阅读模块 */
export interface StrategicResearchModule {
  id: string;
  title: string;
  summary: string;
  sections: StrategicResearchSection[];
  mapView?: { center: [number, number]; zoom: number };
  relatedLayerIds?: LayerId[];
}

/** 注册表中的研究主题 id */
export type StrategicResearchPanelId =
  | 'china-us'
  | 'future-us'
  | 'future-scs';

/** 战略研究主题注册项 */
export interface StrategicResearchPanelDef {
  id: StrategicResearchPanelId;
  title: string;
  subtitle: string;
  icon: string;
  /** 在哪些区域下显示该入口 */
  regions: RegionId[];
  enabled: boolean;
  defaultModuleId: string;
  getModules: () => StrategicResearchModule[];
  footer?: string;
}
