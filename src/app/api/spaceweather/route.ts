import { NextResponse } from 'next/server';

/**
 * 太空天气 — 地磁 Kp 行星指数（NOAA SWPC，免密钥真实，近实时）。
 * 返回最新 Kp、近 ~3 天 3 小时序列与 G 级地磁暴等级。服务端缓存 10 分钟，失败回退缓存。
 * 真实观测，不预测、不编造。
 */

export const dynamic = 'force-dynamic';

interface Body { kp: number | null; series: number[]; times: string[]; gLevel: string; gDesc: string; windSpeed: number | null; bz: number | null; generatedAt: string; source: string; stale?: boolean }

/** 取 SWPC 时序产品最后一行的某列数值（首行为表头），失败返回 null */
async function lastCol(url: string, col: number): Promise<number | null> {
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(12000), headers: { Accept: 'application/json' }, next: { revalidate: 0 } });
    if (!res.ok) return null;
    const rows = (await res.json()) as unknown[][];
    const data = Array.isArray(rows) ? rows.slice(1) : [];
    for (let i = data.length - 1; i >= 0; i--) {
      const v = Number(data[i]?.[col]);
      if (Number.isFinite(v)) return v;
    }
    return null;
  } catch { return null; }
}

let cache: { expires: number; body: Body } | null = null;
const TTL = 10 * 60 * 1000;

/** Kp → G 级地磁暴（NOAA 标度） */
function gScale(kp: number): { level: string; desc: string } {
  if (kp >= 9) return { level: 'G5', desc: '极强地磁暴' };
  if (kp >= 8) return { level: 'G4', desc: '强烈地磁暴' };
  if (kp >= 7) return { level: 'G3', desc: '强地磁暴' };
  if (kp >= 6) return { level: 'G2', desc: '中等地磁暴' };
  if (kp >= 5) return { level: 'G1', desc: '轻微地磁暴' };
  if (kp >= 4) return { level: '活跃', desc: '地磁活跃' };
  return { level: '平静', desc: '地磁平静' };
}

export async function GET() {
  const now = Date.now();
  if (cache && cache.expires > now) {
    return NextResponse.json(cache.body, { headers: { 'Cache-Control': 'public, s-maxage=600, stale-while-revalidate=1800' } });
  }
  try {
    const res = await fetch('https://services.swpc.noaa.gov/products/noaa-planetary-k-index.json', {
      signal: AbortSignal.timeout(15000), headers: { Accept: 'application/json' }, next: { revalidate: 0 },
    });
    if (!res.ok) throw new Error(`SWPC HTTP ${res.status}`);
    const rows = (await res.json()) as unknown[][];
    // 首行为表头；其余 [time_tag, Kp, a_running, station_count]
    const data = Array.isArray(rows) ? rows.slice(1) : [];
    const recent = data.slice(-24); // 近 ~3 天（3 小时一档）
    const series: number[] = [];
    const times: string[] = [];
    for (const r of recent) {
      const v = Number(r?.[1]);
      if (Number.isFinite(v)) { series.push(v); times.push(String(r?.[0] ?? '')); }
    }
    const kp = series.length ? series[series.length - 1] : null;
    const g = kp != null ? gScale(kp) : { level: '—', desc: '暂无数据' };
    // 太阳风：plasma 速度(列2)、磁场 Bz(列3，GSM)；最佳努力、失败不影响 Kp
    const [windSpeed, bz] = await Promise.all([
      lastCol('https://services.swpc.noaa.gov/products/solar-wind/plasma-1-day.json', 2),
      lastCol('https://services.swpc.noaa.gov/products/solar-wind/mag-1-day.json', 3),
    ]);
    const body: Body = { kp, series, times, gLevel: g.level, gDesc: g.desc, windSpeed, bz, generatedAt: new Date().toISOString(), source: 'NOAA SWPC 行星 Kp + 太阳风（近实时）' };
    cache = { expires: now + TTL, body };
    return NextResponse.json(body, { headers: { 'Cache-Control': 'public, s-maxage=600, stale-while-revalidate=1800' } });
  } catch (err) {
    if (cache) return NextResponse.json({ ...cache.body, stale: true });
    return NextResponse.json({ kp: null, series: [], times: [], gLevel: '—', gDesc: '获取失败', windSpeed: null, bz: null, generatedAt: new Date().toISOString(), source: 'NOAA SWPC', error: err instanceof Error ? err.message : 'SWPC 获取失败' }, { status: 502, headers: { 'Cache-Control': 'no-store' } });
  }
}
