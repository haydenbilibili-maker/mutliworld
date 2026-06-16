#!/usr/bin/env node
/**
 * fetch-tle.js — 从 CelesTrak 抓取 TLE 星历，写入 data/orbital/tle.json
 *
 * 使用方式：
 *   npm run data:tle              # 抓取并写入
 *   npm run data:tle -- --dry-run # 仅打印统计
 *
 * 数据源（CelesTrak GP 元素集）：
 *   stations — ISS、天宫等空间站
 *   visual / science / resource / weather / gnss / oneweb / starlink … — 在轨 LEO/MEO 卫星
 *     （按 SAT_GROUPS 优先级多组合并去重，凑满 SAT_LIMIT；active 组常 403，自动回退）
 *   iridium-33-debris / cosmos-2251-debris — 碰撞碎片（采样上限 DEBRIS_LIMIT）
 */

import { writeFileSync, mkdirSync, existsSync, readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const OUT_DIR = join(ROOT, 'data', 'orbital');
const OUT_FILE = join(OUT_DIR, 'tle.json');

const SAT_LIMIT = 400;
const DEBRIS_LIMIT = 250;

/**
 * 按优先级尝试多组并合并去重，凑满 SAT_LIMIT。
 * 覆盖更广 LEO/MEO：亮星、科学、对地观测、气象、导航、宽带星座、立方星、业余、工程试验等。
 * （CelesTrak「active」组常返回 403，放最后兜底）
 */
const SAT_GROUPS = [
  'visual', 'science', 'resource', 'weather', 'noaa', 'goes',
  'gnss', 'gps-ops', 'galileo', 'beidou-3', 'glo-ops',
  'oneweb', 'iridium-NEXT', 'globalstar', 'orbcomm',
  'planet', 'spire', 'cubesat', 'amateur', 'engineering',
  'starlink', 'active',
];

const args = process.argv.slice(2);
const DRY_RUN = args.includes('--dry-run');

const CELESTRAK = 'https://celestrak.org/NORAD/elements/gp.php';

/** 已知空间站 NORAD → 中文名 / 运营方 */
const STATION_META = {
  25544: { displayName: '国际空间站 ISS', highlight: true, operator: 'NASA/Roscosmos/ESA/JAXA/CSA' },
  48274: { displayName: '中国空间站 天宫（天和核心舱）', highlight: true, operator: '中国载人航天' },
  51844: { displayName: '天宫 · 问天实验舱', highlight: true, operator: '中国载人航天' },
  54216: { displayName: '天宫 · 梦天实验舱', highlight: true, operator: '中国载人航天' },
};

const SOURCES = [
  { group: 'stations', category: 'station', limit: null },
  { group: 'iridium-33-debris', category: 'debris', limit: DEBRIS_LIMIT },
  { group: 'cosmos-2251-debris', category: 'debris', limit: DEBRIS_LIMIT },
];

async function fetchSatellites(stationNorads) {
  const byNorad = new Map();
  let usedGroup = null;

  for (const group of SAT_GROUPS) {
    if (byNorad.size >= SAT_LIMIT) break;
    try {
      const text = await fetchGroup(group);
      const items = parseTleBlock(text, 'satellite').filter((o) => !stationNorads.has(o.noradId));
      if (!items.length) continue;
      if (!usedGroup) usedGroup = group;
      for (const o of items) {
        if (byNorad.size >= SAT_LIMIT) break;
        if (!byNorad.has(o.noradId)) byNorad.set(o.noradId, o);
      }
    } catch (err) {
      console.warn(`  ⚠ ${group} 失败: ${err.message}`);
    }
  }

  const items = [...byNorad.values()];
  if (items.length) {
    console.log(`  → ${items.length} 条（来源: ${usedGroup}${byNorad.size >= SAT_LIMIT ? '+' : ''}）`);
  } else {
    console.warn('  ⚠ 所有卫星组均失败');
  }
  return items;
}

function parseTleBlock(text, category) {
  const lines = text.replace(/\r\n/g, '\n').trim().split('\n');
  const out = [];
  for (let i = 0; i < lines.length; i++) {
    const name = lines[i].trim();
    if (!name || name.startsWith('1 ') || name.startsWith('2 ')) continue;
    const line1 = lines[i + 1]?.trim();
    const line2 = lines[i + 2]?.trim();
    if (!line1?.startsWith('1 ') || !line2?.startsWith('2 ')) continue;
    const noradId = parseInt(line1.substring(2, 7), 10);
    if (!Number.isFinite(noradId)) continue;

    const meta = STATION_META[noradId] ?? {};
    out.push({
      id: String(noradId),
      name,
      displayName: meta.displayName,
      noradId,
      line1,
      line2,
      category,
      highlight: meta.highlight,
      operator: meta.operator,
    });
    i += 2;
  }
  return out;
}

async function fetchGroup(group) {
  const url = `${CELESTRAK}?GROUP=${encodeURIComponent(group)}&FORMAT=tle`;
  const res = await fetch(url, {
    headers: {
      Accept: 'text/plain',
      'User-Agent': 'Mozilla/5.0 (compatible; MultiWorldDashboard/1.0; +https://github.com/)',
    },
  });
  if (!res.ok) throw new Error(`CelesTrak HTTP ${res.status}: ${group}`);
  return res.text();
}

async function main() {
  const fetchedAt = new Date().toISOString();
  const stationNorads = new Set();
  const all = [];

  for (const src of SOURCES) {
    console.log(`[tle] 抓取 ${src.group} (${src.category})…`);
    let items;
    try {
      const text = await fetchGroup(src.group);
      items = parseTleBlock(text, src.category);
    } catch (err) {
      console.warn(`  ⚠ ${src.group} 失败: ${err.message}`);
      continue;
    }

    if (src.category === 'station') {
      for (const o of items) stationNorads.add(o.noradId);
    }
    if (src.category === 'debris' && src.limit != null) {
      const debrisSoFar = all.filter((o) => o.category === 'debris').length;
      const room = Math.max(0, DEBRIS_LIMIT - debrisSoFar);
      if (room === 0) continue;
      items = items.slice(0, room);
    } else if (src.limit != null && items.length > src.limit) {
      items = items.slice(0, src.limit);
    }

    console.log(`  → ${items.length} 条`);
    all.push(...items);
  }

  console.log('[tle] 抓取卫星 (satellite)…');
  const satellites = await fetchSatellites(stationNorads);
  all.push(...satellites);

  const byNorad = new Map();
  for (const o of all) {
    if (!byNorad.has(o.noradId)) byNorad.set(o.noradId, o);
  }
  const objects = [...byNorad.values()];

  const counts = { station: 0, satellite: 0, debris: 0 };
  for (const o of objects) counts[o.category] += 1;

  console.log(`[tle] 合计 ${objects.length} 条 — 空间站 ${counts.station} / 卫星 ${counts.satellite} / 碎片 ${counts.debris}`);

  if (DRY_RUN) {
    console.log('[tle] --dry-run，未写入文件');
    return;
  }

  const payload = {
    version: 1,
    fetchedAt,
    source: 'celestrak-gp',
    counts,
    objects,
  };

  mkdirSync(OUT_DIR, { recursive: true });
  writeFileSync(OUT_FILE, JSON.stringify(payload, null, 2), 'utf-8');
  console.log(`[tle] 已写入 ${OUT_FILE}`);
}

main().catch((err) => {
  console.error('[tle] 抓取失败:', err.message);
  if (existsSync(OUT_FILE)) {
    const cached = JSON.parse(readFileSync(OUT_FILE, 'utf-8'));
    console.warn(`[tle] 使用缓存 ${OUT_FILE}（${cached.objects?.length ?? '?'} 条）`);
    process.exit(0);
  }
  process.exit(1);
});
