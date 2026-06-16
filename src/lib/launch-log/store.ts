import 'server-only';

import { readFileSync, existsSync, statSync } from 'node:fs';
import { join } from 'node:path';
import type { LaunchLogDatabase, LaunchRecord } from '../../../data/launch-log/schema';
import { LAUNCH_LOG_WINDOW_MS } from '../../../data/launch-log/schema';
import { parseIsoMs } from '@/lib/timeRange';
import { seedsAsRecords } from '@/lib/launch-log/convert';

const DATA_PATH = join(process.cwd(), 'data/launch-log/launches.json');

let cache: LaunchRecord[] | null = null;
let cacheMtime = 0;

function readDatabase(): LaunchLogDatabase | null {
  if (!existsSync(DATA_PATH)) return null;
  try {
    const raw = readFileSync(DATA_PATH, 'utf-8');
    return JSON.parse(raw) as LaunchLogDatabase;
  } catch {
    return null;
  }
}

/** 读取全部发射记录（优先 JSON DB，种子兜底） */
export function loadLaunchRecords(): LaunchRecord[] {
  if (existsSync(DATA_PATH)) {
    const { mtimeMs } = statSync(DATA_PATH);
    if (cache && mtimeMs === cacheMtime) return cache;
    const db = readDatabase();
    if (db?.launches?.length) {
      cache = db.launches;
      cacheMtime = mtimeMs;
      return cache;
    }
  }

  cache = seedsAsRecords();
  cacheMtime = 0;
  return cache;
}

export interface QueryLaunchRecordsOptions {
  sinceMs?: number;
  limit?: number;
  offset?: number;
}

/** 按时间窗查询（默认近 1 年），按 launchTime 倒序 */
export function queryLaunchRecords(options: QueryLaunchRecordsOptions = {}): {
  launches: LaunchRecord[];
  total: number;
} {
  const sinceMs = options.sinceMs ?? LAUNCH_LOG_WINDOW_MS;
  const limit = options.limit ?? 500;
  const offset = options.offset ?? 0;
  const now = Date.now();
  const cutoff = now - sinceMs;

  const filtered = loadLaunchRecords()
    .filter((r) => {
      const ms = parseIsoMs(r.launchTime);
      return ms != null && ms >= cutoff;
    })
    .sort((a, b) => Date.parse(b.launchTime) - Date.parse(a.launchTime));

  return {
    total: filtered.length,
    launches: filtered.slice(offset, offset + limit),
  };
}

export function getLatestLaunchRecord(): LaunchRecord | null {
  const { launches } = queryLaunchRecords({ limit: 1 });
  return launches[0] ?? null;
}
