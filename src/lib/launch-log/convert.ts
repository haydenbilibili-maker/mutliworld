import type { LaunchRecord } from '../../../data/launch-log/schema';
import type { LaunchLogEntry } from '@/regions/global.launchLog';
import { GLOBAL_LAUNCH_LOG } from '@/regions/global.launchLog';

/** 种子条目 → LaunchRecord（离线兜底） */
export function seedEntryToRecord(entry: LaunchLogEntry, fetchedAt: string): LaunchRecord {
  return {
    id: entry.id,
    name: entry.title,
    provider: entry.provider,
    rocket: entry.title.split(' · ')[0] ?? entry.title,
    siteName: entry.siteId ?? '',
    siteId: entry.siteId,
    lat: entry.location.lat,
    lng: entry.location.lng,
    launchTime: entry.launchTime,
    status: entry.status,
    orbit: entry.orbit,
    mission: entry.note,
    payload: entry.payload,
    source: 'seed',
    fetchedAt,
  };
}

/** LaunchRecord → 面板/地图沿用的 LaunchLogEntry */
export function recordToLogEntry(record: LaunchRecord): LaunchLogEntry {
  return {
    id: record.id,
    title: record.name,
    provider: record.provider,
    siteId: record.siteId,
    location: { lng: record.lng, lat: record.lat },
    launchTime: record.launchTime,
    status: record.status,
    orbit: record.orbit,
    payload: record.payload,
    note: record.mission,
    layerId: 'launch_log',
  };
}

export function seedsAsRecords(): LaunchRecord[] {
  const fetchedAt = new Date().toISOString();
  return GLOBAL_LAUNCH_LOG.map((e) => seedEntryToRecord(e, fetchedAt));
}
