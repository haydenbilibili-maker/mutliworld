import 'server-only';

import { readFileSync, existsSync, statSync } from 'node:fs';
import { join } from 'node:path';
import type { LayerId } from '@/types/geo';
import type { RegionId } from '@/types/region';
import type { LaunchLogDatabase } from '../../../data/launch-log/schema';
import { LAYER_LABELS, LAYER_HINTS } from '@/lib/constants';
import { buildRegionGeoJSON } from '@/lib/geodata/buildRegionGeoJSON';
import { loadLaunchRecords, queryLaunchRecords } from '@/lib/launch-log/store';
import { loadTleDatabase } from '@/lib/orbital/tleStore';
import { ALL_REGION_IDS } from '@/lib/regions/ids';
import { listRegions } from '@/regions';
import { listStrategicResearchPanels } from '@/regions/strategic-research/registry';
import { GLOBAL_CONFLICT_ZONES } from '@/regions/global.conflict-zones';
import { PIZZA_VENUES } from '@/lib/pizza-index/venues';
import { listTiers, tierForLayer } from '@/tiers';
import type { SpatialTier } from '@/types/tier';
import {
  classifyLayerSource,
  getCachePolicies,
  getFeatureFlags,
  LAYER_SOURCE_LABELS,
} from '@/lib/admin/system';
import { getSystemInfo } from '@/lib/admin/system.server';
import { formatTleAgeHours } from '@/lib/admin/format';
import { ALL_PERSONS, getPersonCountsByRegion } from '@/regions/persons';
import { getPersonAvatarStats } from '@/lib/person/avatar';
import { NEWS_FEED_SEED } from '@/data/news-feed';
import type { NewsFeedCategory } from '@/data/news-feed';
import {
  getSituationCountsByRegion,
  getSituationTypeCounts,
} from '@/regions/regional-situation';
import {
  REGION_CONTENT_PANELS,
  REGION_SWITCHER_TOOLTIP,
  filterByRegion,
  filterMarketQuotes,
} from '@/lib/region/contentFilter';
import { STOCK_INDEX_SEEDS } from '@/lib/markets/stock-indices';
import type { PersonDomain } from '@/types/person';

const LAUNCH_LOG_PATH = join(process.cwd(), 'data/launch-log/launches.json');
const CACHE_DIR = join(process.cwd(), 'public', 'cache');
const TLE_STALE_HOURS = 72;

function parseIsoMs(iso: string | null | undefined): number | null {
  if (!iso) return null;
  const ms = Date.parse(iso);
  return Number.isFinite(ms) ? ms : null;
}

function sanitizeFutureIso(iso: string | null | undefined, maxFutureMs = 365 * 24 * 3600_000): string | null {
  if (!iso) return null;
  const ms = Date.parse(iso);
  if (!Number.isFinite(ms)) return null;
  if (ms > Date.now() + maxFutureMs) return null;
  return iso;
}

export interface LaunchLogDbMeta {
  exists: boolean;
  count: number;
  fetchedAt: string | null;
  source: string;
  fileSize: number;
}

export interface GeodataCacheEntry {
  regionId: RegionId;
  exists: boolean;
  fetchedAt: string | null;
  featureCount: number;
  fileSize: number;
}

export interface RegionFeatureStats {
  regionId: RegionId;
  name: string;
  enabled: boolean;
  layers: LayerId[];
  totalFeatures: number;
  layerCounts: Record<string, number>;
  dataNamespace: string;
  hasDataset: boolean;
}

export function getLaunchLogDbMeta(): LaunchLogDbMeta {
  if (!existsSync(LAUNCH_LOG_PATH)) {
    const records = loadLaunchRecords();
    return {
      exists: false,
      count: records.length,
      fetchedAt: null,
      source: 'seed-fallback',
      fileSize: 0,
    };
  }

  try {
    const db = JSON.parse(readFileSync(LAUNCH_LOG_PATH, 'utf-8')) as LaunchLogDatabase;
    const { size } = statSync(LAUNCH_LOG_PATH);
    return {
      exists: true,
      count: db.count ?? db.launches?.length ?? 0,
      fetchedAt: db.fetchedAt ?? null,
      source: db.source ?? 'unknown',
      fileSize: size,
    };
  } catch {
    const records = loadLaunchRecords();
    return {
      exists: false,
      count: records.length,
      fetchedAt: null,
      source: 'parse-error-fallback',
      fileSize: 0,
    };
  }
}

export function getGeodataCacheStatus(): GeodataCacheEntry[] {
  return ALL_REGION_IDS.map((regionId) => {
    const cachePath = join(CACHE_DIR, `geodata-${regionId}.json`);
    if (!existsSync(cachePath)) {
      return {
        regionId,
        exists: false,
        fetchedAt: null,
        featureCount: 0,
        fileSize: 0,
      };
    }

    try {
      const raw = JSON.parse(readFileSync(cachePath, 'utf-8')) as {
        features?: unknown[];
        meta?: { fetchedAt?: string };
      };
      const { size } = statSync(cachePath);
      return {
        regionId,
        exists: true,
        fetchedAt: raw.meta?.fetchedAt ?? null,
        featureCount: raw.features?.length ?? 0,
        fileSize: size,
      };
    } catch {
      return {
        regionId,
        exists: true,
        fetchedAt: null,
        featureCount: 0,
        fileSize: 0,
      };
    }
  });
}

export function getRegionFeatureStats(): RegionFeatureStats[] {
  return listRegions().map((region) => {
    const geo = buildRegionGeoJSON({
      regionId: region.id,
      timeRange: region.timeRange ?? '7d',
      layers: region.layers,
    });

    const layerCounts: Record<string, number> = {};
    for (const feature of geo.features) {
      const layerId = String(feature.properties?.layerId ?? 'unknown');
      layerCounts[layerId] = (layerCounts[layerId] ?? 0) + 1;
    }

    return {
      regionId: region.id,
      name: region.name,
      enabled: region.enabled,
      layers: region.layers,
      totalFeatures: geo.meta.featureCount,
      layerCounts,
      dataNamespace: region.dataNamespace,
      hasDataset: Boolean(region.dataset),
    };
  });
}

export function getLayerTierGroups(): Record<SpatialTier, LayerId[]> {
  const allLayerIds = Object.keys(LAYER_LABELS) as LayerId[];
  const groups: Record<SpatialTier, LayerId[]> = {
    space: [],
    surface: [],
    subsurface: [],
  };

  for (const layerId of allLayerIds) {
    groups[tierForLayer(layerId)].push(layerId);
  }

  return groups;
}

export interface LayerAdminDetail {
  layerId: LayerId;
  label: string;
  tier: SpatialTier;
  sourceKind: ReturnType<typeof classifyLayerSource>;
  sourceLabel: string;
  enabledRegionCount: number;
  hint?: string;
}

export interface ConflictZoneSummary {
  id: string;
  nameZh: string;
  name: string;
  status: string;
  since: string;
  intensity: 'high' | 'medium';
  description: string;
  dashed?: boolean;
}

export function getLayerAdminDetails(): LayerAdminDetail[] {
  const regions = listRegions();
  const allLayerIds = Object.keys(LAYER_LABELS) as LayerId[];

  return allLayerIds.map((layerId) => {
    const enabledRegionCount = regions.filter((r) => r.layers.includes(layerId)).length;
    const sourceKind = classifyLayerSource(layerId);
    return {
      layerId,
      label: LAYER_LABELS[layerId],
      tier: tierForLayer(layerId),
      sourceKind,
      sourceLabel: LAYER_SOURCE_LABELS[sourceKind],
      enabledRegionCount,
      hint: LAYER_HINTS[layerId],
    };
  });
}

export function getConflictZoneSummaries(): ConflictZoneSummary[] {
  return GLOBAL_CONFLICT_ZONES.map((zone) => ({
    id: zone.id,
    nameZh: zone.nameZh,
    name: zone.name,
    status: zone.status,
    since: zone.since,
    intensity: zone.intensity,
    description: zone.description,
    dashed: zone.dashed,
  }));
}

export interface PersonAdminSample {
  id: string;
  name: string;
  domain: PersonDomain;
  role: string;
  avatarKind: 'wikipedia' | 'generated' | 'custom';
}

export interface ContentHierarchySummary {
  levels: { id: string; label: string; description: string }[];
  filteredPanels: string[];
  regionSwitcherTooltip: string;
  /** 各区域二级面板过滤示例（新闻种子条数） */
  newsFilteredByRegion: Record<RegionId, number>;
  /** 各区域市场股指可见数（含 FX/加密全局项） */
  marketQuotesFilteredByRegion: Record<RegionId, number>;
  /** 各区域人物可见数 */
  personsFilteredByRegion: Record<RegionId, number>;
}

function getPersonsByDomain(): Record<PersonDomain, number> {
  const counts: Record<PersonDomain, number> = {
    政治: 0,
    经济: 0,
    社会: 0,
    文化: 0,
    军事: 0,
  };
  for (const p of ALL_PERSONS) {
    counts[p.domain]++;
  }
  return counts;
}

function getPersonSamplesByRegion(limit = 3): Record<RegionId, PersonAdminSample[]> {
  const regions = Object.keys(getPersonCountsByRegion()) as RegionId[];
  return Object.fromEntries(
    regions.map((regionId) => {
      const list = ALL_PERSONS.filter((p) => p.regionIds.includes(regionId)).slice(0, limit);
      return [
        regionId,
        list.map((p) => ({
          id: p.id,
          name: p.name,
          domain: p.domain,
          role: p.role,
          avatarKind: p.avatar?.includes('wikimedia')
            ? ('wikipedia' as const)
            : p.avatar?.includes('dicebear')
              ? ('generated' as const)
              : p.avatar
                ? ('custom' as const)
                : ('generated' as const),
        })),
      ];
    }),
  ) as Record<RegionId, PersonAdminSample[]>;
}

function getNewsFeedStats() {
  const byCategory: Record<NewsFeedCategory, number> = {
    时政: 0,
    政经: 0,
    国际局势: 0,
    军事安全: 0,
    能源市场: 0,
  };
  const byRegion: Record<RegionId, number> = {
    global: 0,
    china: 0,
    middleeast: 0,
    asia_pacific: 0,
    north_america: 0,
    latin_america: 0,
    southeast_asia: 0,
    western_europe: 0,
    eastern_europe: 0,
  };

  for (const item of NEWS_FEED_SEED) {
    byCategory[item.category]++;
    const ids = item.regionIds?.length ? item.regionIds : (['global'] as RegionId[]);
    for (const rid of ids) {
      byRegion[rid] = (byRegion[rid] ?? 0) + 1;
    }
  }

  return {
    total: NEWS_FEED_SEED.length,
    byCategory,
    byRegion,
    withLocation: NEWS_FEED_SEED.filter((i) => i.location).length,
  };
}

function getContentHierarchySummary(): ContentHierarchySummary {
  const regions = Object.keys(getPersonCountsByRegion()) as RegionId[];
  const newsFilteredByRegion = Object.fromEntries(
    regions.map((r) => [r, filterByRegion(NEWS_FEED_SEED, r).length]),
  ) as Record<RegionId, number>;
  const marketQuotesFilteredByRegion = Object.fromEntries(
    regions.map((r) => [
      r,
      filterMarketQuotes(
        STOCK_INDEX_SEEDS.map((s) => ({ ...s, kind: 'index' as const })),
        r,
      ).length,
    ]),
  ) as Record<RegionId, number>;
  const personsFilteredByRegion = getPersonCountsByRegion();

  return {
    levels: [
      {
        id: 'L1',
        label: '一级 · 区域切换',
        description: 'RegionSwitcher 决定 activeRegion，影响顶部 Dock 面板内容范围。',
      },
      {
        id: 'L2',
        label: '二级 · 面板内容过滤',
        description: '新闻、市场、跑马灯等按 regionIds 过滤；图层与搜索不受限（三级）。',
      },
      {
        id: 'L3',
        label: '三级 · 地图图层',
        description: 'MapControlBar 图层开关、搜索索引保持全局，不随区域收缩。',
      },
    ],
    filteredPanels: Array.from(REGION_CONTENT_PANELS),
    regionSwitcherTooltip: REGION_SWITCHER_TOOLTIP,
    newsFilteredByRegion,
    marketQuotesFilteredByRegion,
    personsFilteredByRegion,
  };
}

function getRegionalSituationAdmin() {
  const byRegion = getSituationCountsByRegion();
  const typeByRegion = Object.fromEntries(
    (Object.keys(byRegion) as RegionId[]).map((r) => [r, getSituationTypeCounts(r)]),
  ) as Record<RegionId, Record<string, number>>;
  return {
    total: Object.values(byRegion).reduce((s, n) => s + n, 0),
    byRegion,
    typeByRegion,
  };
}

function getMarketsAdmin() {
  const byRegion: Record<string, number> = {};
  for (const seed of STOCK_INDEX_SEEDS) {
    for (const rid of seed.regionIds) {
      byRegion[rid] = (byRegion[rid] ?? 0) + 1;
    }
  }
  return {
    stockIndexCount: STOCK_INDEX_SEEDS.length,
    indices: STOCK_INDEX_SEEDS.map((s) => ({
      id: s.id,
      label: s.label,
      symbol: s.symbol,
      region: s.region,
      regionIds: s.regionIds,
    })),
    byRegion,
  };
}

export function getAdminStats() {
  const launchMeta = getLaunchLogDbMeta();
  const tle = loadTleDatabase();
  const panels = listStrategicResearchPanels();
  const tiers = listTiers();
  const geodataCache = getGeodataCacheStatus();
  const regions = getRegionFeatureStats();
  const { launches: recentLaunches } = queryLaunchRecords({ limit: 20 });
  const layerGroups = getLayerTierGroups();

  const tleFetchedMs = parseIsoMs(tle.fetchedAt);
  const tleAgeHours =
    tleFetchedMs != null ? Math.round((Date.now() - tleFetchedMs) / 3600_000) : null;
  const tleStale = tleAgeHours == null || tleAgeHours > TLE_STALE_HOURS;

  const latestLaunch = recentLaunches[0];
  const latestLaunchTime = sanitizeFutureIso(latestLaunch?.launchTime ?? null);
  const launchLogStale =
    latestLaunchTime != null &&
    Date.now() - Date.parse(latestLaunchTime) > 45 * 24 * 3600_000;

  const totalSeedFeatures = regions.reduce((sum, r) => sum + r.totalFeatures, 0);
  const cacheFeatureTotal = geodataCache.reduce((sum, c) => sum + c.featureCount, 0);

  const layerDetails = getLayerAdminDetails();
  const conflictZones = getConflictZoneSummaries();
  const system = getSystemInfo();
  const featureFlags = getFeatureFlags();
  const cachePolicies = getCachePolicies();

  const liveApiLayerCount = layerDetails.filter((l) => l.sourceKind === 'live_api').length;
  const tleAgeLabel = formatTleAgeHours(tle.fetchedAt || null);

  const personsByRegion = getPersonCountsByRegion();
  const personsByDomain = getPersonsByDomain();
  const personAvatarStats = getPersonAvatarStats(ALL_PERSONS);
  const personSamples = getPersonSamplesByRegion(3);
  const newsFeed = getNewsFeedStats();
  const contentHierarchy = getContentHierarchySummary();
  const regionalSituation = getRegionalSituationAdmin();
  const markets = getMarketsAdmin();

  return {
    generatedAt: new Date().toISOString(),
    system,
    featureFlags,
    cachePolicies,
    conflictZones,
    persons: {
      total: ALL_PERSONS.length,
      byRegion: personsByRegion,
      byDomain: personsByDomain,
      avatarStats: personAvatarStats,
      samples: personSamples,
    },
    newsFeed,
    contentHierarchy,
    regionalSituation,
    markets,
    launchLog: {
      ...launchMeta,
      recentLaunches,
      latestLaunchTime,
      latestLaunchStale: launchLogStale,
    },
    orbital: {
      fetchedAt: tle.fetchedAt || null,
      ageLabel: tleAgeLabel,
      ageHours: tleAgeHours,
      stale: tleStale,
      staleThresholdHours: TLE_STALE_HOURS,
      source: tle.source,
      counts: tle.counts,
      total: tle.objects.length,
    },
    strategicResearch: panels.map((panel) => ({
      id: panel.id,
      title: panel.title,
      subtitle: panel.subtitle,
      enabled: panel.enabled,
      moduleCount: panel.getModules().length,
      regions: panel.regions,
      icon: panel.icon,
    })),
    tiers: tiers.map((tier) => ({
      id: tier.id,
      name: tier.name,
      icon: tier.icon,
      tagline: tier.tagline,
      layerCount: tier.layers.length,
      layers: tier.layers,
      defaultLayers: tier.defaultLayers,
      renderMode: tier.renderMode,
    })),
    geodataCache,
    regions,
    layers: {
      total: Object.keys(LAYER_LABELS).length,
      labels: LAYER_LABELS,
      byTier: layerGroups,
      details: layerDetails,
      liveApiCount: liveApiLayerCount,
      liveOverlays: {
        conflict_zones: GLOBAL_CONFLICT_ZONES.length,
        pizza_index: PIZZA_VENUES.length,
        live_weather: 'Open-Meteo + RainViewer',
        live_flights: 'OpenSky ADS-B',
        live_maritime: 'AISStream / 航运通道模拟',
      },
    },
    summary: {
      regionCount: regions.length,
      enabledRegionCount: regions.filter((r) => r.enabled).length,
      totalSeedFeatures,
      cacheFeatureTotal,
      strategicPanelCount: panels.length,
      enabledStrategicPanelCount: panels.filter((p) => p.enabled).length,
      conflictZoneCount: conflictZones.length,
      liveApiLayerCount,
      maplibreVersion: system.maplibreVersion,
      globeProjection: system.globeProjection,
      appVersion: system.version,
      tleAgeLabel,
      tleStale,
      launchLogStale: launchLogStale,
      personCount: ALL_PERSONS.length,
      newsFeedSeedCount: newsFeed.total,
      regionalSituationCount: regionalSituation.total,
      stockIndexCount: markets.stockIndexCount,
    },
  };
}

export type AdminStats = ReturnType<typeof getAdminStats>;
