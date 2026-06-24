export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { NextResponse } from 'next/server';

/**
 * 近地天体(NEO)接近事件 — 宇宙层信息面板数据。
 * 真实数据：NASA/JPL CNEOS 近地天体接近(Close-Approach Data) API，免费无 key。
 * 取未来 7 天、最近距离 ≤ 0.05 au(约 19.5 个月球距离) 的接近事件。服务端缓存 1 小时。
 */

const API = 'https://ssd-api.jpl.nasa.gov/cad.api?date-min=now&date-max=%2B7&dist-max=0.05&sort=date';
const CACHE_TTL_MS = 60 * 60 * 1000;
const AU_TO_LD = 1 / 0.002569; // 1 au ≈ 389.2 月球距离

interface NeoItem { name: string; date: string; distLD: number; velocityKms: number; diameterKm: number | null; }
interface NeoBody { items: NeoItem[]; generatedAt: string; source: string; }
let cache: { expires: number; body: NeoBody } | null = null;

interface CadResp { fields?: string[]; data?: string[][] }

/** 由绝对星等 H 估算直径(km，反照率取 0.14) */
function diameterFromH(h: number): number | null {
  if (!Number.isFinite(h)) return null;
  return (1329 / Math.sqrt(0.14)) * Math.pow(10, -0.2 * h);
}

export async function GET() {
  const now = Date.now();
  if (cache && cache.expires > now) {
    return NextResponse.json(cache.body, { headers: { 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200' } });
  }
  try {
    const res = await fetch(API, { signal: AbortSignal.timeout(20000), next: { revalidate: 0 } });
    if (!res.ok) throw new Error(`CNEOS CAD HTTP ${res.status}`);
    const d = (await res.json()) as CadResp;
    const fields = d.fields ?? [];
    const rows = d.data ?? [];
    const idx = (k: string) => fields.indexOf(k);
    const iDes = idx('des'), iCd = idx('cd'), iDist = idx('dist'), iV = idx('v_rel'), iH = idx('h');
    if (iDes < 0 || iCd < 0 || iDist < 0) throw new Error('CAD 字段结构不符');
    const items: NeoItem[] = rows.slice(0, 40).map((r) => {
      const distAu = Number(r[iDist]);
      const h = iH >= 0 ? Number(r[iH]) : NaN;
      return {
        name: String(r[iDes] ?? '未知天体'),
        date: String(r[iCd] ?? ''),
        distLD: Number.isFinite(distAu) ? distAu * AU_TO_LD : 0,
        velocityKms: iV >= 0 ? Number(r[iV]) : 0,
        diameterKm: diameterFromH(h),
      };
    });
    const body: NeoBody = { items, generatedAt: new Date().toISOString(), source: 'NASA/JPL CNEOS 近地天体接近数据' };
    cache = { expires: now + CACHE_TTL_MS, body };
    return NextResponse.json(body, { headers: { 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200' } });
  } catch (err) {
    if (cache) return NextResponse.json({ ...cache.body, stale: true });
    return NextResponse.json({ items: [], error: err instanceof Error ? err.message : 'NEO 获取失败' }, { status: 502, headers: { 'Cache-Control': 'no-store' } });
  }
}
