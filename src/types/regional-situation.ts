/**
 * 区域态势统一条目 — 社媒热点 / 趋势指标 / 态势摘要
 */

import type { RegionId } from '@/types/region';

export type SituationItemType = '社媒' | '趋势' | '态势';

export type SituationSentiment = 'positive' | 'negative' | 'neutral' | 'mixed';

export type SituationDomain =
  | '政治'
  | '经济'
  | '军事'
  | '社会'
  | '文化'
  | '灾害';

/** 单条区域态势（社媒 + 趋势 + 态势摘要统一模型） */
export interface RegionalSituationItem {
  id: string;
  regionId: RegionId;
  type: SituationItemType;
  title: string;
  summary: string;
  sentiment: SituationSentiment;
  /** 热度 0–100 */
  heat: number;
  tags: SituationDomain[];
  timestamp: string;
  lng?: number;
  lat?: number;
  /** 社媒类可选平台 */
  platform?: string;
  /** 社媒类可选互动量 */
  engagement?: number;
}
