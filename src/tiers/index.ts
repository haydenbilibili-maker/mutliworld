/**
 * 空间层模块入口 — 三位一体空间态势
 *
 * 导入即注册三层；其余代码统一从 '@/tiers' 取注册表 API。
 * 详见 docs/三位一体空间PRD.md
 */

import type { LayerId } from '@/types/geo';
import type { SpatialTier, TierModule } from '@/types/tier';
import { registerTier } from './registry';

/** 🌍 地表层 = 现有全部能力（默认层，零回归） */
const surfaceTier: TierModule = {
  id: 'surface',
  name: '地表',
  icon: '🌍',
  tagline: '冲突 · 军事 · 经济 · 能源 · 灾害 · 舆情',
  layers: [
    'conflicts', 'hotspots', 'military', 'bases', 'garrisons', 'nuclear', 'sanctions',
    'economic', 'econ_hubs', 'minerals', 'datacenters', 'semiconductors',
    'natural', 'weather', 'climate', 'protests',
    'aviation', 'outages', 'daynight',
  ],
  defaultLayers: ['conflicts', 'economic', 'weather', 'natural'],
  basemap: 'graticule',
  renderMode: 'flat',
  altitudeBand: [0, 0],
};

/** 🌊 洋底空间层 — 海缆/管线/震源深度/海床（Phase 1 主战场） */
const subsurfaceTier: TierModule = {
  id: 'subsurface',
  name: '洋底空间',
  icon: '🌊',
  tagline: '海缆 · 海底管线 · 震源深度 · 海床 · 深海争夺',
  // Phase 1 完整：海缆/海底管线/深海采矿/板块断层/震源深度/断缆事件 + 复用 maritime/natural（海床栅格随本层自动铺开）
  layers: ['cables', 'pipelines', 'deep_sea_mining', 'tectonics', 'quake_depth', 'cable_incidents', 'maritime', 'natural'],
  defaultLayers: ['cables', 'deep_sea_mining', 'tectonics', 'cable_incidents'],
  basemap: 'seabed',
  renderMode: 'depth',
  altitudeBand: [-11, 0], // 海平面至马里亚纳海沟约 -11km
  note: 'Phase 1 将增补 海床地形 / 板块断层 / 震源深度 / 深海采矿 / 断缆事件',
};

/** 🛰 宇宙空间层 — 发射场/星座/测控/空天事件（Phase 2，3D 分支） */
const spaceTier: TierModule = {
  id: 'space',
  name: '宇宙空间',
  icon: '🛰',
  tagline: '卫星星座 · 在轨 · 测控站 · 发射 · 轨道安全',
  // Phase 2：发射场 + 测控站 + 在轨 GEO 卫星；后续增补 LEO 星座/星下点动效/space_events + 3D 地球
  layers: ['launch_sites', 'launch_log', 'ground_stations', 'sat_constellations'],
  defaultLayers: ['launch_sites', 'launch_log', 'ground_stations', 'sat_constellations'],
  basemap: 'starfield',
  renderMode: 'orbit',
  altitudeBand: [200, 36000], // LEO 至 GEO
  note: 'Phase 2 将增补 星座/在轨星下点/测控站/空天事件，并上 3D 地球',
};

registerTier(spaceTier);
registerTier(surfaceTier);
registerTier(subsurfaceTier);

/**
 * 图层 → 所属空间层映射（Partial：未登记图层默认归地表，便于新增图层时不破坏类型）
 */
export const LAYER_TIER: Partial<Record<LayerId, SpatialTier>> = {
  // 洋底
  cables: 'subsurface',
  pipelines: 'subsurface',
  deep_sea_mining: 'subsurface',
  tectonics: 'subsurface',
  cable_incidents: 'subsurface',
  quake_depth: 'subsurface',
  // 宇宙
  launch_sites: 'space',
  launch_log: 'space',
  ground_stations: 'space',
  sat_constellations: 'space',
  // 其余默认地表（见 tierForLayer 兜底）
};

/** 取图层所属空间层（未登记默认地表） */
export function tierForLayer(layerId: LayerId): SpatialTier {
  return LAYER_TIER[layerId] ?? 'surface';
}

export * from './registry';
