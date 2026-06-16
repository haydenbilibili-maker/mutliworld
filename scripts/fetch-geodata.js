#!/usr/bin/env node
/**
 * fetch-geodata.js — 态势数据抓取脚本
 *
 * 用途：从公开 RSS / GeoJSON 源拉取最新事件，做基础地理编码后写入
 *       public/cache/geodata-{region}.json，供 /api/geodata 优先读取（静态缓存兜底）。
 *
 * 使用方式：
 *   npm run data:fetch                    # 拉取所有区域
 *   npm run data:fetch -- --region china  # 仅拉取 china
 *   npm run data:fetch -- --dry-run       # 仅打印，不写文件
 *
 * 数据源（免费/公开，无需 API Key）：
 *   - GDELT GeoJSON（近 15 分钟全球新闻事件）
 *   - USGS Earthquakes GeoJSON（过去 7 天 M≥4.5）
 *   - ACLED（需注册，当前占位，格式已对齐）
 *
 * 输出格式与 /api/geodata 响应相同，可直接被 buildRegionGeoJSON 读取或
 * 在 route.ts 里作为优先级更高的缓存层合并。
 */

import { writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const CACHE_DIR = join(ROOT, 'public', 'cache');

// ── CLI 参数 ─────────────────────────────────────────────────────────────────
const args = process.argv.slice(2);
const DRY_RUN = args.includes('--dry-run');
const REGION_FILTER = (() => {
  const idx = args.indexOf('--region');
  return idx !== -1 ? args[idx + 1] : null;
})();

// ── 区域边界（粗略矩形，用于 GDELT 过滤） ────────────────────────────────────
const REGION_BOUNDS = {
  china: { minLng: 73, maxLng: 135, minLat: 18, maxLat: 54 },
  middleeast: { minLng: 25, maxLng: 65, minLat: 12, maxLat: 42 },
  asia_pacific: { minLng: 60, maxLng: 180, minLat: -50, maxLat: 55 },
  north_america: { minLng: -170, maxLng: -50, minLat: 15, maxLat: 72 },
  latin_america: { minLng: -118, maxLng: -34, minLat: -56, maxLat: 33 },
  southeast_asia: { minLng: 90, maxLng: 142, minLat: -12, maxLat: 25 },
  western_europe: { minLng: -11, maxLng: 20, minLat: 36, maxLat: 60 },
  eastern_europe: { minLng: 22, maxLng: 44, minLat: 44, maxLat: 56 },
};

// ── 数据源配置 ────────────────────────────────────────────────────────────────
const SOURCES = [
  {
    id: 'gdelt-15min',
    name: 'GDELT 近 15 分钟事件',
    url: 'https://api.gdeltproject.org/api/v2/geo/geo?query=conflict&mode=PointData&format=geojson&timespan=1d&maxpoints=250',
    layerId: 'conflicts',
    transform: transformGdelt,
  },
  {
    id: 'usgs-eq-7d',
    name: 'USGS 地震 M≥4.5 过去 7 天',
    url: 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_week.geojson',
    layerId: 'natural',
    transform: transformUsgsEq,
  },
];

// ── 转换函数 ──────────────────────────────────────────────────────────────────

/** GDELT GeoJSON → 统一 Feature */
function transformGdelt(rawFeatures, layerId) {
  return rawFeatures
    .filter((f) => {
      const [lng, lat] = f.geometry?.coordinates ?? [];
      return Number.isFinite(lng) && Number.isFinite(lat);
    })
    .map((f, i) => {
      const [lng, lat] = f.geometry.coordinates;
      const p = f.properties ?? {};
      return {
        type: 'Feature',
        geometry: { type: 'Point', coordinates: [lng, lat] },
        properties: {
          id: `gdelt-${Date.now()}-${i}`,
          title: String(p.name ?? p.title ?? '未知事件').slice(0, 80),
          source: 'GDELT',
          timestamp: new Date().toISOString(),
          impact: 'medium',
          category: layerId,
          layerId,
          description: String(p.url ?? ''),
          link: String(p.url ?? ''),
          opacity: 0.85,
          lng,
          lat,
        },
      };
    });
}

/** USGS GeoJSON → 统一 Feature */
function transformUsgsEq(rawFeatures, layerId) {
  return rawFeatures
    .filter((f) => {
      const [lng, lat] = f.geometry?.coordinates ?? [];
      return Number.isFinite(lng) && Number.isFinite(lat);
    })
    .map((f) => {
      const [lng, lat, depth] = f.geometry.coordinates;
      const p = f.properties ?? {};
      const mag = Number(p.mag ?? 0);
      const impact = mag >= 6.5 ? 'critical' : mag >= 5.5 ? 'high' : mag >= 4.5 ? 'medium' : 'low';
      return {
        type: 'Feature',
        geometry: { type: 'Point', coordinates: [lng, lat] },
        properties: {
          id: String(f.id ?? `usgs-${lng}-${lat}`),
          title: `M${mag.toFixed(1)} 地震 · ${String(p.place ?? '未知地点')}`,
          source: 'USGS',
          timestamp: p.time ? new Date(p.time).toISOString() : new Date().toISOString(),
          impact,
          category: layerId,
          layerId,
          description: `震级 M${mag.toFixed(1)}，震源深度 ${depth?.toFixed(1) ?? '?'} km`,
          link: String(p.url ?? ''),
          opacity: Math.min(0.9, 0.5 + mag * 0.06),
          lng,
          lat,
        },
      };
    });
}

// ── 区域过滤 ──────────────────────────────────────────────────────────────────

function filterByRegion(features, regionId) {
  const bounds = REGION_BOUNDS[regionId];
  if (!bounds) return features;
  return features.filter(({ properties: p }) => {
    const lng = Number(p?.lng ?? 0);
    const lat = Number(p?.lat ?? 0);
    return (
      lng >= bounds.minLng &&
      lng <= bounds.maxLng &&
      lat >= bounds.minLat &&
      lat <= bounds.maxLat
    );
  });
}

// ── 抓取单个数据源 ────────────────────────────────────────────────────────────

async function fetchSource(source) {
  console.log(`  ↓ 拉取 ${source.name} …`);
  try {
    const res = await fetch(source.url, {
      headers: { 'User-Agent': 'world-monitor-dashboard/1.0 (research)' },
      signal: AbortSignal.timeout(20_000),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    const rawFeatures = json.features ?? [];
    const features = source.transform(rawFeatures, source.layerId);
    console.log(`  ✓ ${source.name}：${features.length} 个点位`);
    return features;
  } catch (err) {
    console.warn(`  ✗ ${source.name} 失败：${err.message}`);
    return [];
  }
}

// ── 写缓存文件 ────────────────────────────────────────────────────────────────

function writeCache(regionId, features) {
  const outPath = join(CACHE_DIR, `geodata-${regionId}.json`);
  const payload = {
    type: 'FeatureCollection',
    features,
    meta: {
      region: regionId,
      source: 'fetch-geodata-script',
      fetchedAt: new Date().toISOString(),
      featureCount: features.length,
    },
  };
  if (DRY_RUN) {
    console.log(`  [dry-run] 将写入 ${outPath}（${features.length} 条）`);
    return;
  }
  mkdirSync(CACHE_DIR, { recursive: true });
  writeFileSync(outPath, JSON.stringify(payload, null, 2), 'utf-8');
  console.log(`  ✓ 写入 ${outPath}（${features.length} 条）`);
}

// ── 主流程 ────────────────────────────────────────────────────────────────────

async function main() {
  console.log('=== 态势数据抓取脚本 ===');
  if (DRY_RUN) console.log('[dry-run 模式，不写文件]');

  const regions = Object.keys(REGION_BOUNDS).filter(
    (r) => !REGION_FILTER || r === REGION_FILTER,
  );

  for (const regionId of regions) {
    console.log(`\n▶ 区域：${regionId}`);

    // 并发拉取所有数据源
    const allFeatures = (
      await Promise.all(SOURCES.map(fetchSource))
    ).flat();

    // 按区域边界过滤
    const filtered = filterByRegion(allFeatures, regionId);
    console.log(`  过滤后 ${regionId} 保留 ${filtered.length} 条`);

    writeCache(regionId, filtered);
  }

  console.log('\n完成。');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
