/**
 * 垂直剖面分层计算 — 招牌交互「天—地—海垂直剖面」共享逻辑
 *
 * 把已加载 geodata 要素按 tierForLayer 归到 宇宙/地表/洋底 三层，按距剖面点距离排序；
 * 空间层额外注入「头顶同步轨道」（最近 GEO 卫星）与实时空间站过顶。
 * 面板（VerticalProfilePanel）与地图连线层（CrossLayerLinks）共用，保证一致。
 */

import type { GeoJSONFeature, LayerId } from '@/types/geo';
import type { SpatialTier } from '@/types/tier';
import { tierForLayer } from '@/tiers';
import { GLOBAL_SATELLITES } from '@/regions/global.satellites';

export interface ProfileItem {
  id: string;
  emoji: string;
  title: string;
  distKm: number;
  lng: number;
  lat: number;
  detail?: string;
  tier: SpatialTier;
  /** 示意高度/深度（km，正=高空，0=地表，负=水下/地下），用于垂直剖面侧视图 */
  altKm: number;
}

/** 各图层的示意高度/深度（km）；用于垂直剖面侧视图（非精确） */
const ALT_BY_LAYER: Record<string, number> = {
  // 宇宙（高空）
  sat_constellations: 35786, // GEO
  space_stations: 420,
  satellites: 550,
  space_debris: 800,
  ground_stations: 0,
  launch_sites: 0,
  launch_log: 0,
  space_events: 0,
  // 洋底（地下/水下）
  cables: -2,
  cable_incidents: -2,
  pipelines: -1.5,
  deep_sea_mining: -4.5,
  tectonics: -8,
  // quake_depth 由 subKind 细分（见下）
};

const QUAKE_DEPTH_ALT: Record<string, number> = {
  shallow: -35,
  intermediate: -185,
  deep: -500,
};

/** 估算要素示意高度/深度 */
function estimateAltKm(layerId: string, subKind: string, tier: SpatialTier): number {
  if (layerId === 'quake_depth') return QUAKE_DEPTH_ALT[subKind] ?? -35;
  if (layerId in ALT_BY_LAYER) return ALT_BY_LAYER[layerId];
  // 兜底：按层归位
  if (tier === 'space') return 500;
  if (tier === 'subsurface') return -3;
  return 0;
}

export interface LiveSatLite {
  norad: number;
  name: string;
  lng: number;
  lat: number;
  alt: number;
  highlight?: boolean;
}

export const PROFILE_RADIUS_DEG = 16;

export function degDist(aLng: number, aLat: number, bLng: number, bLat: number): number {
  const dLat = aLat - bLat;
  const dLng = (aLng - bLng) * Math.cos((((aLat + bLat) / 2) * Math.PI) / 180);
  return Math.sqrt(dLat * dLat + dLng * dLng);
}

export type ProfileBuckets = Record<SpatialTier, ProfileItem[]>;

export function computeProfileBuckets(
  features: GeoJSONFeature[] | undefined,
  liveSats: LiveSatLite[],
  point: [number, number],
  perTier = 5,
): ProfileBuckets {
  const out: ProfileBuckets = { space: [], near_earth: [], surface: [], subsurface: [] };

  for (const f of features ?? []) {
    const lid = String(f.properties?.layerId ?? '') as LayerId;
    if (!lid) continue;
    const lng = Number(f.properties?.lng);
    const lat = Number(f.properties?.lat);
    if (!Number.isFinite(lng) || !Number.isFinite(lat)) continue;
    const d = degDist(lng, lat, point[0], point[1]);
    if (d > PROFILE_RADIUS_DEG) continue;
    const tier = tierForLayer(lid);
    const subKind = String(f.properties?.subKind ?? '');
    out[tier].push({
      id: String(f.properties?.id ?? `${lid}-${lng}-${lat}`),
      emoji: String(f.properties?.markerEmoji ?? '•'),
      title: String(f.properties?.title ?? ''),
      distKm: Math.round(d * 111),
      lng,
      lat,
      detail: String(f.properties?.description ?? ''),
      tier,
      altKm: estimateAltKm(lid, subKind, tier),
    });
  }

  // 头顶同步轨道：最近 GEO 卫星（按经度差）
  let nearestGeo = GLOBAL_SATELLITES[0];
  let best = Infinity;
  for (const s of GLOBAL_SATELLITES) {
    const dl = Math.abs(((s.lng - point[0] + 540) % 360) - 180);
    if (dl < best) {
      best = dl;
      nearestGeo = s;
    }
  }
  if (nearestGeo) {
    out.space.unshift({
      id: `geo-${nearestGeo.id}`,
      emoji: '🛰️',
      title: `头顶同步轨道：${nearestGeo.name}`,
      distKm: Math.round(best * 111),
      lng: nearestGeo.lng,
      lat: 0,
      detail: `约 ${nearestGeo.lng}°E 定点 · 经度差 ${best.toFixed(1)}°`,
      tier: 'space',
      altKm: 35786,
    });
  }

  // 实时空间站过顶（如在范围内）
  for (const s of liveSats) {
    if (!s.highlight) continue;
    const d = degDist(s.lng, s.lat, point[0], point[1]);
    if (d > PROFILE_RADIUS_DEG) continue;
    out.space.unshift({
      id: `live-${s.norad}`,
      emoji: '🛰️',
      title: `${s.norad === 25544 ? 'ISS' : '天宫'} 当前过顶`,
      distKm: Math.round(d * 111),
      lng: s.lng,
      lat: s.lat,
      detail: `高度 ${Math.round(s.alt)} km · 实时星下点`,
      tier: 'space',
      altKm: s.alt,
    });
  }

  (Object.keys(out) as SpatialTier[]).forEach((k) => {
    out[k].sort((a, b) => a.distKm - b.distKm);
    out[k] = out[k].slice(0, perTier);
  });
  return out;
}
