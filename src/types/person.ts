/**
 * 区域人物 — 政治 / 经济 / 社会 / 文化 / 军事等领域公众人物
 *
 * 资料库扩展字段（birthYear/deathYear/nationality/party/education/career/
 * netWorthUsd/aliases/sources/tags）全部可选，旧数据零迁移，渐进填充。
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

/** 履历条目（资料库时间线） */
export interface PersonCareerEntry {
  /** 年份或区间，如 "2017"、"2017-2021"、"2020 至今" */
  year?: string;
  /** 职务 / 事件标题 */
  title: string;
  /** 机构 / 组织 */
  org?: string;
  /** 补充说明 */
  description?: string;
}

/** 引用来源（维基百科式多源标注） */
export interface PersonSource {
  /** 来源名，如 "维基百科"、"Britannica"、"官方简历" */
  label: string;
  url: string;
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
  /** 维基百科页面 URL（可选） —— 用于显示「维基百科 ↗」外链按钮 */
  wikipedia?: string;
  avatar?: string;
  actions?: PersonAction[];

  // ── 资料库扩展字段（全部可选，旧数据零迁移，渐进填充） ──

  /** 出生年份 */
  birthYear?: number;
  /** 逝世年份 */
  deathYear?: number;
  /** 国籍（中文） */
  nationality?: string;
  /** 政党 / 派系 */
  party?: string;
  /** 教育背景（如 ["哈佛大学法学博士", "清华大学本科"]） */
  education?: string[];
  /** 履历时间线（职务变迁） */
  career?: PersonCareerEntry[];
  /** 净资产（美元） */
  netWorthUsd?: number;
  /** 别名 / 曾用名 */
  aliases?: string[];
  /** 引用来源（多源，维基百科式标注） */
  sources?: PersonSource[];
  /** 自由标签（如 "G7领导人"、"科技巨头"、"诺贝尔奖"） */
  tags?: string[];
}

