/**
 * 区域人物 — 政治 / 经济 / 社会 / 文化 / 军事等领域公众人物
 */

import type { RegionId } from '@/types/region';

/** 人物领域 */
export type PersonDomain = '政治' | '经济' | '社会' | '文化' | '军事';

/** 人物状态（可选） */
export type PersonStatus = 'active' | 'restricted' | 'deceased';

/** 关联行动（中东冲突场景等，可选） */
export interface PersonAction {
  codeName: string;
  date: string;
  description: string;
  eventId?: string;
}

/** 区域人物条目 */
export interface Person {
  id: string;
  /** 显示名（通常为中文） */
  name: string;
  /** 外文名（可选） */
  nameEn?: string;
  role: string;
  domain: PersonDomain;
  /** 所属区域（可跨区） */
  regionIds: RegionId[];
  lng: number;
  lat: number;
  bio: string;
  /** 任职或相关起始年份 */
  since?: number;
  status?: PersonStatus;
  /** 阵营标识（中东等场景筛选用） */
  faction?: string;
  /** 维基百科页面 URL（可选）—— 用于显示「维基百科 ↗」外链按钮 */
  wikipedia?: string;
  avatar?: string;
  actions?: PersonAction[];
}
