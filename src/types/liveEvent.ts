/**
 * 统一真实事件流类型（Wave 4 重构）
 *
 * 全部来自真实公开 API：USGS(地震) · GDACS(灾害) · ReliefWeb(人道) · GDELT 2.0(地缘新闻)。
 * 不含种子/示例；每条带来源链与时间戳，可去重、可分类、可联动地图。
 * 为后续「投资建议 / 政策预估」的事件驱动关联引擎提供标准事件底座。
 */

export type LiveEventCategory =
  | 'quake' // 地震（USGS）
  | 'disaster' // 自然灾害（GDACS）
  | 'humanitarian' // 人道危机（ReliefWeb）
  | 'geopolitics' // 地缘/冲突/制裁（GDELT 新闻）
  | 'general';

export type LiveEventSeverity = 'low' | 'medium' | 'high' | 'critical';

export type LiveEventProvider = 'USGS' | 'GDACS' | 'ReliefWeb' | 'GDELT';

export interface LiveEvent {
  id: string;
  title: string;
  category: LiveEventCategory;
  severity: LiveEventSeverity;
  /** ISO 时间戳 */
  time: string;
  provider: LiveEventProvider;
  /** 来源显示名 */
  source: string;
  /** 原文/详情链接（可溯源） */
  sourceUrl: string;
  summary?: string;
  /** 地理坐标（可联动地图飞行），无则不带 */
  lat?: number;
  lng?: number;
  /** 国家/地区 */
  area?: string;
  /** 量级（地震震级等） */
  magnitude?: number;
}

export interface LiveEventsResponse {
  events: LiveEvent[];
  /** 各 provider 实际贡献的事件数（0 表示该真实源本次无数据/降级） */
  providerCounts: Record<LiveEventProvider, number>;
  generatedAt: string;
  count: number;
}
