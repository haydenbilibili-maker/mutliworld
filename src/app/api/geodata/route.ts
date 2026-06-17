import { NextRequest } from 'next/server';
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import type { LayerId, TimeRange, GeoJSONFeature } from '@/types/geo';
import type { RegionId } from '@/types/region';
import { buildRegionGeoJSON } from '@/lib/geodata/buildRegionGeoJSON';
import { REFRESH_INTERVAL_MS, isWithinTimeWindow, parseIsoMs, TIME_RANGE_MS } from '@/lib/timeRange';
import { ALL_REGION_IDS } from '@/lib/regions/ids';
import { getRegion } from '@/regions';
import { fetchUsgsEarthquakes, fetchUsgsByDepth } from '@/lib/geodata/usgs';
import { fetchGdacsDisasters } from '@/lib/geodata/gdacs';

const VALID_REGIONS: RegionId[] = ALL_REGION_IDS;
const VALID_TIME_RANGES: TimeRange[] = ['24h', '7d', '30d'];
const ALL_LAYERS: LayerId[] = [
  'conflicts',
  'conflict_zones',
  'hotspots',
  'bases',
  'economic',
  'waterways',
  'natural',
  'weather',
  'live_weather',
  'military',
  'sanctions',
  'nuclear',
  'outages',
  'aviation',
  'live_flights',
  'maritime',
  'cables',
  'econ_hubs',
  'minerals',
  'daynight',
  'pipelines',
  'datacenters',
  'protests',
  'climate',
  'launch_sites',
  'launch_log',
  'semiconductors',
  'garrisons',
  'deep_sea_mining',
  'tectonics',
  'cable_incidents',
  'quake_depth',
  'ground_stations',
  'sat_constellations',
  'space_stations',
  'satellites',
  'space_debris',
  'space_events',
  'marine_archaeology',
  'ocean_currents',
  'fisheries',
  'monsoon',
  'atmospheric_circulation',
  'deep_exploration',
];

function parseRegion(value: string | null): RegionId {
  if (value && VALID_REGIONS.includes(value as RegionId)) return value as RegionId;
  return 'global';
}

function parseTimeRange(value: string | null): TimeRange {
  if (value && VALID_TIME_RANGES.includes(value as TimeRange)) return value as TimeRange;
  return '7d';
}

function parseLayers(value: string | null): LayerId[] {
  if (!value) return ['conflicts', 'economic', 'weather'];
  const ids = value
    .split(',')
    .map((s) => s.trim())
    .filter((s): s is LayerId => ALL_LAYERS.includes(s as LayerId));
  return ids.length ? ids : ['conflicts', 'economic', 'weather'];
}

/**
 * 读取 scripts/fetch-geodata.js 写入的静态缓存（public/cache/geodata-{region}.json）。
 * 返回与 timeRange 窗口匹配且 layerId 在 activeLayers 内的 feature 子集。
 */
function loadCachedFeatures(
  regionId: RegionId,
  layers: LayerId[],
  timeRange: TimeRange,
): GeoJSONFeature[] {
  const cachePath = join(process.cwd(), 'public', 'cache', `geodata-${regionId}.json`);
  if (!existsSync(cachePath)) return [];

  try {
    const raw = JSON.parse(readFileSync(cachePath, 'utf-8')) as {
      features?: GeoJSONFeature[];
      meta?: { fetchedAt?: string };
    };

    // 缓存文件超过 6 小时则跳过（数据太旧）
    const fetchedAt = parseIsoMs(raw.meta?.fetchedAt ?? '');
    if (fetchedAt != null && Date.now() - fetchedAt > 6 * 60 * 60 * 1000) return [];

    const windowMs = TIME_RANGE_MS[timeRange];
    const activeSet = new Set(layers);
    const now = Date.now();

    return (raw.features ?? []).filter((f) => {
      const lid = String(f.properties?.layerId ?? '');
      if (!activeSet.has(lid as LayerId)) return false;
      const ts = parseIsoMs(String(f.properties?.timestamp ?? ''));
      return isWithinTimeWindow(ts, now, windowMs);
    });
  } catch {
    return [];
  }
}

/**
 * GeoJSON 数据接口：按 region、timeRange、layers 聚合区域 dataset
 * 并合并 scripts/fetch-geodata.js 抓取的实时缓存（如存在）
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const regionId = parseRegion(searchParams.get('region'));
  const timeRange = parseTimeRange(searchParams.get('timeRange'));
  const layers = parseLayers(searchParams.get('layers'));

  // 种子数据（本地 dataset）
  const seedData = buildRegionGeoJSON({ regionId, timeRange, layers });

  // 实时缓存（由 npm run data:fetch 生成，可选）
  const cachedFeatures = loadCachedFeatures(regionId, layers, timeRange);

  // 合并：缓存数据追加在种子数据之后，去重（按 id）
  let features = seedData.features;
  if (cachedFeatures.length > 0) {
    const existingIds = new Set(features.map((f) => String(f.properties?.id ?? '')));
    const newFeatures = cachedFeatures.filter(
      (f) => !existingIds.has(String(f.properties?.id ?? '')),
    );
    features = [...features, ...newFeatures];
  }

  // 实时源：USGS 地震 + GDACS 灾害（'natural' 图层激活时并行拉取、按区域 bounds 过滤、合并去重）
  let liveQuakeCount = 0;
  let liveDisasterCount = 0;
  if (layers.includes('natural')) {
    const bounds = getRegion(regionId)?.bounds ?? null;
    const [quakes, disasters] = await Promise.all([
      fetchUsgsEarthquakes(bounds),
      fetchGdacsDisasters(bounds),
    ]);
    const live = [...quakes, ...disasters];
    if (live.length > 0) {
      const ids = new Set(features.map((f) => String(f.properties?.id ?? '')));
      const fresh = live.filter(
        (q) => !ids.has(String(q.properties?.id ?? '')),
      );
      features = [...features, ...fresh];
      liveQuakeCount = quakes.length;
      liveDisasterCount = disasters.length;
    }
  }

  // 实时源：USGS 地震按震源深度（洋底/地下层 'quake_depth' 图层）
  if (layers.includes('quake_depth')) {
    const bounds = getRegion(regionId)?.bounds ?? null;
    const byDepth = await fetchUsgsByDepth(bounds);
    if (byDepth.length > 0) {
      const ids = new Set(features.map((f) => String(f.properties?.id ?? '')));
      features = [...features, ...byDepth.filter((q) => !ids.has(String(q.properties?.id ?? '')))];
    }
  }

  const featureCount = features.length;
  const featureTimes = features
    .map((f) => parseIsoMs(String(f.properties?.timestamp ?? '')))
    .filter((ms): ms is number => ms != null);
  const latestEventAt =
    featureTimes.length > 0 ? new Date(Math.max(...featureTimes)).toISOString() : null;

  const cacheSec = Math.max(10, Math.floor(REFRESH_INTERVAL_MS[timeRange] / 1000));

  return Response.json(
    {
      type: 'FeatureCollection',
      features,
      meta: {
        region: regionId,
        timeRange,
        layers,
        generatedAt: new Date().toISOString(),
        featureCount,
        latestEventAt,
        cachedFeaturesCount: cachedFeatures.length,
        liveQuakeCount,
        liveDisasterCount,
      },
    },
    {
      headers: {
        'Cache-Control': `public, s-maxage=${cacheSec}, stale-while-revalidate=${cacheSec * 2}`,
      },
    },
  );
}
