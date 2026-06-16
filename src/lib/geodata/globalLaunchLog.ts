import type { RegionId } from '@/types/region';
import type { TimeRange } from '@/types/geo';
import { getRegion } from '@/regions';
import { GLOBAL_LAUNCH_LOG, type LaunchLogEntry } from '@/regions/global.launchLog';
import { LAUNCH_LOG_WINDOW_MS } from '../../../data/launch-log/schema';
import { loadLaunchRecords, queryLaunchRecords } from '@/lib/launch-log/store';
import { recordToLogEntry } from '@/lib/launch-log/convert';
import { TIME_RANGE_MS, isWithinTimeWindow, parseIsoMs } from '@/lib/timeRange';

export { LAUNCH_LOG_WINDOW_MS };

function inBounds(
  lng: number,
  lat: number,
  bounds: [[number, number], [number, number]],
): boolean {
  const [[minLng, minLat], [maxLng, maxLat]] = bounds;
  return lng >= minLng && lng <= maxLng && lat >= minLat && lat <= maxLat;
}

/** 全部日志条目（DB 优先，种子兜底） */
export function getAllLaunchLogEntries(): LaunchLogEntry[] {
  return loadLaunchRecords().map(recordToLogEntry);
}

/** 按区域边界筛选发射日志 */
export function getGlobalLaunchLogForRegion(regionId: RegionId): LaunchLogEntry[] {
  const entries = getAllLaunchLogEntries();
  const bounds = getRegion(regionId)?.bounds;
  if (!bounds) return entries;
  return entries.filter((e) => inBounds(e.location.lng, e.location.lat, bounds));
}

/** 近一年发射日志（面板/地图专用，独立于 geodata timeRange） */
export function getLaunchLogWithinYear(regionId?: RegionId): LaunchLogEntry[] {
  const { launches } = queryLaunchRecords({ sinceMs: LAUNCH_LOG_WINDOW_MS, limit: 1000 });
  const entries = launches.map(recordToLogEntry);
  if (!regionId) return entries;
  const bounds = getRegion(regionId)?.bounds;
  if (!bounds) return entries;
  return entries.filter((e) => inBounds(e.location.lng, e.location.lat, bounds));
}

/** 按 geodata 时间窗口筛选（保留兼容；launch_log 图层请用 filterLaunchLogByYear） */
export function filterLaunchLogByTimeRange(
  entries: LaunchLogEntry[],
  timeRange: TimeRange,
): LaunchLogEntry[] {
  const windowMs = TIME_RANGE_MS[timeRange];
  const now = Date.now();
  return entries.filter((e) => {
    const ms = parseIsoMs(e.launchTime);
    return isWithinTimeWindow(ms, now, windowMs);
  });
}

/** 发射日志一年窗口过滤 */
export function filterLaunchLogByYear(entries: LaunchLogEntry[]): LaunchLogEntry[] {
  const now = Date.now();
  return entries.filter((e) => {
    const ms = parseIsoMs(e.launchTime);
    return isWithinTimeWindow(ms, now, LAUNCH_LOG_WINDOW_MS);
  });
}

/** 最新一条发射任务（用于跑马灯等；服务端同步读取） */
export function getLatestLaunchHeadline(): LaunchLogEntry | null {
  const entries = getAllLaunchLogEntries();
  const sorted = [...entries].sort(
    (a, b) => Date.parse(b.launchTime) - Date.parse(a.launchTime),
  );
  return sorted[0] ?? GLOBAL_LAUNCH_LOG[GLOBAL_LAUNCH_LOG.length - 1] ?? null;
}
