/**
 * 实时卫星位置 — 宇宙空间层（三位一体）
 *
 * 数据源：wheretheiss.at（免费、无 key、HTTPS）。支持任意 NORAD 编号的实时星下点。
 * 高亮：国际空间站 ISS 与中国空间站 天宫。其余为代表性 LEO 卫星实时位置。
 * 服务端抓取（避开 CORS / 限频），失败优雅降级。
 */

export interface TrackedSat {
  norad: number;
  name: string;
  kind: 'station' | 'sat';
  /** 重点高亮（空间站） */
  highlight?: boolean;
  operator?: string;
}

export const TRACKED_SATS: TrackedSat[] = [
  { norad: 25544, name: '国际空间站 ISS', kind: 'station', highlight: true, operator: 'NASA/Roscosmos/ESA/JAXA/CSA' },
  { norad: 48274, name: '中国空间站 天宫（天和核心舱）', kind: 'station', highlight: true, operator: '中国载人航天' },
  { norad: 20580, name: '哈勃空间望远镜 HST', kind: 'sat', operator: 'NASA/ESA' },
  { norad: 43013, name: 'NOAA-20 气象卫星', kind: 'sat', operator: 'NOAA' },
  { norad: 49260, name: 'Landsat-9 对地观测', kind: 'sat', operator: 'NASA/USGS' },
  { norad: 25994, name: 'Terra 对地观测', kind: 'sat', operator: 'NASA' },
  // ── 星座代表性卫星（实时星下点；按 NORAD 取，wheretheiss 无数据则优雅跳过）──
  { norad: 44713, name: 'Starlink-1007（星链）', kind: 'sat', operator: 'SpaceX · Starlink' },
  { norad: 45657, name: 'Starlink-1130（星链）', kind: 'sat', operator: 'SpaceX · Starlink' },
  { norad: 44057, name: 'OneWeb-0012', kind: 'sat', operator: 'OneWeb' },
  { norad: 43249, name: 'Iridium NEXT 154', kind: 'sat', operator: 'Iridium' },
  { norad: 40697, name: '哨兵 2A（Sentinel-2A）', kind: 'sat', operator: 'ESA / 哥白尼计划' },
  { norad: 33591, name: 'NOAA-19 气象卫星', kind: 'sat', operator: 'NOAA' },
];

export interface LiveSat extends TrackedSat {
  lat: number;
  lng: number;
  /** 高度 km */
  alt: number;
  /** 速度 km/h */
  velocity: number;
}

interface WtiResponse {
  latitude?: number;
  longitude?: number;
  altitude?: number;
  velocity?: number;
}

async function fetchOne(t: TrackedSat): Promise<LiveSat | null> {
  try {
    const res = await fetch(`https://api.wheretheiss.at/v1/satellites/${t.norad}`, {
      next: { revalidate: 5 },
      headers: { accept: 'application/json' },
    });
    if (!res.ok) return null;
    const j = (await res.json()) as WtiResponse;
    if (j.latitude == null || j.longitude == null) return null;
    return {
      ...t,
      lat: j.latitude,
      lng: j.longitude,
      alt: j.altitude ?? 0,
      velocity: j.velocity ?? 0,
    };
  } catch {
    return null;
  }
}

/** 并行拉取全部跟踪目标的实时位置；任一失败跳过 */
export async function fetchLiveSatellites(): Promise<LiveSat[]> {
  const results = await Promise.all(TRACKED_SATS.map(fetchOne));
  return results.filter((r): r is LiveSat => r != null);
}
