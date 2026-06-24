/**
 * wheretheiss.at 实时星下点 — 服务端抓取 + 短缓存 + TLE 传播兜底。
 * 上游不可达时回退本地 TLE（SGP4），避免宇宙层 ISS/天宫等完全空白。
 */

import 'server-only';

import { propagateTle } from '@/lib/orbital/propagate';
import { loadTleDatabase } from '@/lib/orbital/tleStore';

const WTI_BASE = 'https://api.wheretheiss.at/v1/satellites';
const FETCH_TIMEOUT_MS = 15_000;
const CACHE_TTL_MS = 5_000;

export interface WtiPosition {
  lat: number;
  lon: number;
  altitude: number;
  velocity: number;
  timestamp: number;
  source: string;
  stale?: boolean;
}

interface WtiResp {
  latitude?: number;
  longitude?: number;
  altitude?: number;
  velocity?: number;
  timestamp?: number;
}

const caches = new Map<number, { expires: number; body: WtiPosition }>();

function tleFallback(noradId: number, label: string): WtiPosition | null {
  const rec = loadTleDatabase().objects.find((o) => o.noradId === noradId);
  if (!rec) return null;
  const obj = propagateTle(rec);
  if (!obj) return null;
  return {
    lat: obj.lat,
    lon: obj.lng,
    altitude: obj.altKm,
    velocity: obj.velocityKmh,
    timestamp: Date.now(),
    source: `${label} · TLE 传播（wheretheiss 不可达，示意）`,
    stale: true,
  };
}

/** 拉取 NORAD 编号对应实时星下点；失败时 TLE 兜底，仍失败则抛错 */
export async function fetchWtiPosition(
  noradId: number,
  meta: { label: string; liveSource: string },
): Promise<WtiPosition> {
  const now = Date.now();
  const hit = caches.get(noradId);
  if (hit && hit.expires > now) return hit.body;

  try {
    const res = await fetch(`${WTI_BASE}/${noradId}`, {
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
      next: { revalidate: 0 },
    });
    if (!res.ok) throw new Error(`wheretheiss HTTP ${res.status}`);
    const d = (await res.json()) as WtiResp;
    if (typeof d.latitude !== 'number' || typeof d.longitude !== 'number') {
      throw new Error(`${meta.label} 数据结构不符`);
    }
    const body: WtiPosition = {
      lat: d.latitude,
      lon: d.longitude,
      altitude: typeof d.altitude === 'number' ? d.altitude : 0,
      velocity: typeof d.velocity === 'number' ? d.velocity : 0,
      timestamp: typeof d.timestamp === 'number' ? d.timestamp * 1000 : now,
      source: meta.liveSource,
    };
    caches.set(noradId, { expires: now + CACHE_TTL_MS, body });
    return body;
  } catch {
    const cached = caches.get(noradId);
    if (cached) return { ...cached.body, stale: true };

    const tle = tleFallback(noradId, meta.label);
    if (tle) {
      caches.set(noradId, { expires: now + CACHE_TTL_MS, body: tle });
      return tle;
    }
    throw new Error(`${meta.label} 获取失败`);
  }
}
