import { readFileSync, existsSync, statSync } from 'node:fs';
import { join } from 'node:path';
import type { LayerId } from '@/types/geo';
import type { RegionId } from '@/types/region';
import type { LaunchLogDatabase } from '../../../data/launch-log/schema';
import { LAYER_LABELS } from '@/lib/constants';
import { buildRegionGeoJSON } from '@/lib/geodata/buildRegionGeoJSON';
import { loadLaunchRecords, queryLaunchRecords } from '@/lib/launch-log/store';
import { loadTleDatabase } from '@/lib/orbital/tleStore';
import { ALL_REGION_IDS } from '@/lib/regions/ids';
import { listRegions } from '@/regions';
import { listStrategicResearchPanels } from '@/regions/strategic-research/registry';
import { listTiers, tierForLayer } from '@/tiers';
import type { SpatialTier } from '@/types/tier';

const LAUNCH_LOG_PATH = join(process.cwd(), 'data/launch-log/launches.json');
const CACHE_DIR = join(process.cwd(), 'public', 'cache');

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

export function getAdminStats() {
  const launchMeta = getLaunchLogDbMeta();
  const tle = loadTleDatabase();
  const panels = listStrategicResearchPanels();
  const tiers = listTiers();
  const geodataCache = getGeodataCacheStatus();
  const regions = getRegionFeatureStats();
  const { launches: recentLaunches } = queryLaunchRecords({ limit: 20 });
  const layerGroups = getLayerTierGroups();

  const totalSeedFeatures = regions.reduce((sum, r) => sum + r.totalFeatures, 0);
  const cacheFeatureTotal = geodataCache.reduce((sum, c) => sum + c.featureCount, 0);

  return {
    generatedAt: new Date().toISOString(),
    launchLog: {
      ...launchMeta,
      recentLaunches,
    },
    orbital: {
      fetchedAt: tle.fetchedAt || null,
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
    },
    summary: {
      regionCount: regions.length,
      enabledRegionCount: regions.filter((r) => r.enabled).length,
      totalSeedFeatures,
      cacheFeatureTotal,
      strategicPanelCount: panels.length,
      enabledStrategicPanelCount: panels.filter((p) => p.enabled).length,
    },
  };
}

export type AdminStats = ReturnType<typeof getAdminStats>;
