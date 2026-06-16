/**
 * 全球航天发射日志 — 本地结构化数据库 schema
 *
 * 数据文件：data/launch-log/launches.json
 * 抓取脚本：npm run data:launches
 *
 * 扩展至全历史：在 fetch-launches.js 中移除 net__gte 过滤、提高 maxPages，
 * 或按年份分批抓取后合并去重（以 id 为键）。
 */

export type LaunchStatus =
  | 'success'
  | 'failure'
  | 'partial'
  | 'scheduled'
  | 'scrubbed';

/** 发射记录（本地 DB 主结构） */
export interface LaunchRecord {
  id: string;
  name: string;
  provider: string;
  rocket: string;
  siteName: string;
  siteId?: string;
  lat: number;
  lng: number;
  launchTime: string;
  status: LaunchStatus;
  orbit?: string;
  mission?: string;
  payload?: string;
  country?: string;
  source: string;
  fetchedAt: string;
}

/** launches.json 顶层结构 */
export interface LaunchLogDatabase {
  version: 1;
  fetchedAt: string;
  source: string;
  count: number;
  launches: LaunchRecord[];
}

/** 发射日志展示/地图时间窗：近 1 年（独立于 geodata 7d/30d 窗口） */
export const LAUNCH_LOG_WINDOW_MS = 365 * 24 * 60 * 60 * 1000;

/** API since 参数解析 */
export const LAUNCH_LOG_SINCE_MS: Record<string, number> = {
  '1y': LAUNCH_LOG_WINDOW_MS,
  '30d': 30 * 24 * 60 * 60 * 1000,
  '7d': 7 * 24 * 60 * 60 * 1000,
};
