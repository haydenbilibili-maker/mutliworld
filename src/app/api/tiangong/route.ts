import { NextResponse } from 'next/server';

/**
 * 天宫空间站(CSS / 天和核心舱)实时星下点 — 宇宙层。
 * 真实数据：wheretheiss.at 公开 API（NORAD 48274），免费无 key，秒级实时。
 * 返回经纬度/高度/速度/时刻；服务端仅极短缓存(5s)，前端约 8s 轮询。
 */

const API = 'https://api.wheretheiss.at/v1/satellites/48274';
const CACHE_TTL_MS = 5 * 1000;

interface SatPos { lat: number; lon: number; altitude: number; velocity: number; timestamp: number; source: string }
let cache: { expires: number; body: SatPos } | null = null;

interface WtiResp { latitude?: number; longitude?: number; altitude?: number; velocity?: number; timestamp?: number }

export async function GET() {
  const now = Date.now();
  if (cache && cache.expires > now) {
    return NextResponse.json(cache.body, { headers: { 'Cache-Control': 'public, s-maxage=5' } });
  }
  try {
    const res = await fetch(API, { signal: AbortSignal.timeout(15000), next: { revalidate: 0 } });
    if (!res.ok) throw new Error(`wheretheiss HTTP ${res.status}`);
    const d = (await res.json()) as WtiResp;
    if (typeof d.latitude !== 'number' || typeof d.longitude !== 'number') throw new Error('天宫数据结构不符');
    const body: SatPos = {
      lat: d.latitude,
      lon: d.longitude,
      altitude: typeof d.altitude === 'number' ? d.altitude : 0,
      velocity: typeof d.velocity === 'number' ? d.velocity : 0,
      timestamp: typeof d.timestamp === 'number' ? d.timestamp * 1000 : now,
      source: 'wheretheiss.at（NORAD 48274 实时）',
    };
    cache = { expires: now + CACHE_TTL_MS, body };
    return NextResponse.json(body, { headers: { 'Cache-Control': 'public, s-maxage=5' } });
  } catch (err) {
    if (cache) return NextResponse.json({ ...cache.body, stale: true });
    return NextResponse.json({ error: err instanceof Error ? err.message : '天宫获取失败' }, { status: 502, headers: { 'Cache-Control': 'no-store' } });
  }
}
