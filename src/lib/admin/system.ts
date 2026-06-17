import type { LayerId } from '@/types/geo';
import { LIVE_API_LAYER_IDS } from '@/lib/layers/liveApiLayers';

export { LIVE_API_LAYER_IDS };

/** 静态代码内嵌、无外部 API 的图层 */
export const STATIC_EMBED_LAYER_IDS: LayerId[] = ['conflict_zones'];

export interface CachePolicyEntry {
  id: string;
  name: string;
  location: string;
  ttl: string;
  refreshCommand?: string;
  notes?: string;
}

export interface FeatureFlagEntry {
  key: string;
  value: string;
  description: string;
  category: 'admin' | 'runtime' | 'integration';
}

export interface SystemInfo {
  appName: string;
  version: string;
  nodeEnv: string;
  maplibreVersion: string;
  globeProjection: boolean;
  geographicBasemap: boolean;
  buildTime: string | null;
}

export function getFeatureFlags(): FeatureFlagEntry[] {
  const adminEnabled =
    process.env.NODE_ENV === 'development' ||
    process.env.NEXT_PUBLIC_ADMIN_ENABLED === 'true';

  return [
    {
      key: 'NEXT_PUBLIC_ADMIN_ENABLED',
      value: process.env.NEXT_PUBLIC_ADMIN_ENABLED ?? '(未设置)',
      description: '生产环境显式开启管理后台（开发模式自动可用）',
      category: 'admin',
    },
    {
      key: 'admin.effectiveEnabled',
      value: String(adminEnabled),
      description: '当前进程管理后台实际可用状态',
      category: 'admin',
    },
    {
      key: 'NODE_ENV',
      value: process.env.NODE_ENV ?? 'unknown',
      description: 'Node 运行环境',
      category: 'runtime',
    },
    {
      key: 'PIZZINT_API_URL',
      value: process.env.PIZZINT_API_URL ?? '(默认 https://www.pizzint.watch)',
      description: '披萨指数上游 API 根地址（可选覆盖）',
      category: 'integration',
    },
  ];
}

export function getCachePolicies(): CachePolicyEntry[] {
  return [
    {
      id: 'geodata-static',
      name: 'Geodata 静态缓存',
      location: 'public/cache/geodata-{regionId}.json',
      ttl: '手动刷新（npm run data:fetch）',
      refreshCommand: 'npm run data:fetch',
      notes: '各区域 OSM/USGS 等抓取结果；缺失时回退种子数据',
    },
    {
      id: 'launch-log',
      name: '发射日志本地库',
      location: 'data/launch-log/launches.json',
      ttl: '手动刷新（npm run data:launches）',
      refreshCommand: 'npm run data:launches',
    },
    {
      id: 'tle',
      name: 'TLE 轨道数据库',
      location: 'data/orbital/tle.json',
      ttl: '手动 / 管理后台一键刷新',
      refreshCommand: 'npm run data:tle',
      notes: 'CelesTrak 抓取；缺失时使用种子 TLE',
    },
    {
      id: 'flights-api',
      name: 'OpenSky 航班代理',
      location: '进程内存（/api/flights）',
      ttl: '45 秒',
      notes: 'OpenSky ADS-B states/all，按 bbox 分键缓存',
    },
    {
      id: 'weather-api',
      name: '实时天气',
      location: 'CDN / Edge（/api/weather）',
      ttl: '15 分钟（s-maxage=900）',
      notes: 'Open-Meteo 城市观测；RainViewer 雷达见 /api/weather/radar',
    },
    {
      id: 'pizza-api',
      name: '披萨指数',
      location: '进程内存（/api/osint/pentagon-pizza）',
      ttl: '实时 5 分钟 / 模拟 3 分钟',
      notes: '优先 pizzint.watch；失败回退服务端模拟',
    },
    {
      id: 'orbital-api',
      name: '在轨物体传播',
      location: 'CDN / Edge（/api/orbital-objects）',
      ttl: '15 秒（s-maxage=15）',
      notes: 'SGP4 本地传播，依赖 TLE 库 freshness',
    },
    {
      id: 'conflict-zones',
      name: '冲突区多边形',
      location: 'src/regions/global.conflict-zones.ts',
      ttl: '代码内嵌（部署更新）',
      notes: `${STATIC_EMBED_LAYER_IDS.length} 个示意性冲突区，非实时测绘`,
    },
  ];
}

export function classifyLayerSource(layerId: LayerId): 'live_api' | 'static_embed' | 'seed' {
  if (LIVE_API_LAYER_IDS.includes(layerId)) return 'live_api';
  if (STATIC_EMBED_LAYER_IDS.includes(layerId)) return 'static_embed';
  return 'seed';
}

export const LAYER_SOURCE_LABELS: Record<'live_api' | 'static_embed' | 'seed', string> = {
  live_api: '实时 API',
  static_embed: '静态内嵌',
  seed: '种子/缓存',
};
