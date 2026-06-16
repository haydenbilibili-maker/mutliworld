#!/usr/bin/env node
/**
 * fetch-launches.js — 全球航天发射日志抓取
 *
 * 从 Launch Library 2（The Space Devs）拉取近一年发射记录，写入
 * data/launch-log/launches.json，供 /api/launch-log 与地图 launch_log 图层读取。
 *
 * 使用方式：
 *   npm run data:launches              # 抓取近 1 年
 *   npm run data:launches -- --dry-run # 仅打印统计，不写文件
 *   npm run data:launches -- --since 2y # 自定义回溯（年）
 *
 * 扩展至全历史：
 *   1. 移除 buildSinceIso() 的 net__gte 下限，或设 sinceYears 为足够大
 *   2. 提高 MAX_PAGES（LL2 每页最多 100 条）
 *   3. 可按年份循环 net__gte/net__lte 分批抓取后按 id 去重合并
 *   4. 考虑付费 dev API 以提高速率限制
 *
 * 离线兜底：抓取失败时保留已有 launches.json；若无文件则退出码 1。
 */

import { writeFileSync, mkdirSync, existsSync, readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const OUT_DIR = join(ROOT, 'data', 'launch-log');
const OUT_FILE = join(OUT_DIR, 'launches.json');

const LL2_BASE = 'https://ll.thespacedevs.com/2.2.0/launch/';
const PAGE_SIZE = 100;
const MAX_PAGES = 50;
const REQUEST_DELAY_MS = 350;

const args = process.argv.slice(2);
const DRY_RUN = args.includes('--dry-run');
const sinceYears = (() => {
  const idx = args.indexOf('--since');
  if (idx === -1) return 1;
  const val = args[idx + 1] ?? '1y';
  const m = val.match(/^(\d+)y$/);
  return m ? Number(m[1]) : 1;
})();

function buildSinceIso() {
  const d = new Date();
  d.setUTCFullYear(d.getUTCFullYear() - sinceYears);
  return d.toISOString();
}

const STATUS_MAP = {
  Success: 'success',
  Failure: 'failure',
  'Partial Failure': 'partial',
  Go: 'scheduled',
  TBD: 'scheduled',
  Hold: 'scrubbed',
  'TBDCountdown': 'scheduled',
  'In Flight': 'scheduled',
};

function mapStatus(abbrev) {
  return STATUS_MAP[abbrev] ?? 'scheduled';
}

function transformLaunch(item, fetchedAt) {
  const pad = item.pad ?? {};
  const location = pad.location ?? {};
  const rocket = item.rocket?.configuration?.full_name
    ?? item.rocket?.configuration?.name
    ?? '';
  const provider = item.launch_service_provider?.name ?? '未知';
  const lat = Number(pad.latitude ?? location.latitude);
  const lng = Number(pad.longitude ?? location.longitude);
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;

  const mission = item.mission ?? {};
  const orbit = mission.orbit?.name ?? item.orbit?.name ?? undefined;

  return {
    id: `ll2-${item.id}`,
    name: item.name ?? `${provider} · ${rocket}`,
    provider,
    rocket,
    siteName: pad.name ?? location.name ?? '',
    siteId: undefined,
    lat,
    lng,
    launchTime: item.net ?? item.window_start ?? item.window_end ?? '',
    status: mapStatus(item.status?.abbrev ?? item.status?.name ?? 'TBD'),
    orbit,
    mission: mission.description ?? mission.name ?? undefined,
    payload: mission.name ?? undefined,
    country: location.country_code ?? location.country?.name ?? undefined,
    source: 'launch-library-2',
    fetchedAt,
  };
}

async function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function fetchPage(offset, sinceIso) {
  const url = new URL(LL2_BASE);
  url.searchParams.set('limit', String(PAGE_SIZE));
  url.searchParams.set('offset', String(offset));
  url.searchParams.set('ordering', '-net');
  url.searchParams.set('net__gte', sinceIso);
  url.searchParams.set('mode', 'detailed');

  const res = await fetch(url.toString(), {
    headers: { Accept: 'application/json', 'User-Agent': 'MultiWorldDashboard/1.0' },
  });
  if (!res.ok) throw new Error(`LL2 HTTP ${res.status}: ${url}`);
  return res.json();
}

async function fetchAllLaunches() {
  const sinceIso = buildSinceIso();
  const fetchedAt = new Date().toISOString();
  const byId = new Map();
  let offset = 0;
  let pages = 0;

  console.log(`[launches] 抓取自 ${sinceIso}（近 ${sinceYears} 年）…`);

  while (pages < MAX_PAGES) {
    const data = await fetchPage(offset, sinceIso);
    const results = data.results ?? [];
    if (!results.length) break;

    for (const item of results) {
      const rec = transformLaunch(item, fetchedAt);
      if (rec?.launchTime) byId.set(rec.id, rec);
    }

    console.log(`  页 ${pages + 1}: +${results.length}（累计 ${byId.size}）`);
    offset += PAGE_SIZE;
    pages += 1;

    if (!data.next) break;
    await sleep(REQUEST_DELAY_MS);
  }

  return [...byId.values()].sort(
    (a, b) => Date.parse(b.launchTime) - Date.parse(a.launchTime),
  );
}

function writeDatabase(launches) {
  const fetchedAt = new Date().toISOString();
  const payload = {
    version: 1,
    fetchedAt,
    source: 'launch-library-2',
    count: launches.length,
    launches,
  };
  mkdirSync(OUT_DIR, { recursive: true });
  writeFileSync(OUT_FILE, JSON.stringify(payload, null, 2), 'utf-8');
  return payload;
}

async function main() {
  try {
    const launches = await fetchAllLaunches();
    console.log(`[launches] 共 ${launches.length} 条有效记录`);

    if (DRY_RUN) {
      console.log('[launches] --dry-run，未写入文件');
      return;
    }

    const db = writeDatabase(launches);
    console.log(`[launches] 已写入 ${OUT_FILE}（${db.count} 条）`);
  } catch (err) {
    console.error('[launches] 抓取失败:', err.message);
    if (existsSync(OUT_FILE)) {
      const cached = JSON.parse(readFileSync(OUT_FILE, 'utf-8'));
      console.warn(`[launches] 使用缓存 ${OUT_FILE}（${cached.count ?? '?'} 条）`);
      process.exit(0);
    }
    process.exit(1);
  }
}

main();
