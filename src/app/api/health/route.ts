import { NextResponse } from 'next/server';

/**
 * 数据健康探测 — 对各免密钥真实数据源做轻量可用性探测（并行 + 超时），
 * 返回在线状态 / HTTP 码 / 往返延迟。诚实反映上游当前可达性，不缓存、不编造。
 * 仅探测连通性（不下载完整响应体），避免拉取大体量数据。
 */

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface Source {
  id: string;
  label: string;
  category: string;
  url: string;
}

/** 与各实时图层一致的上游探测端点（尽量取最小响应） */
const SOURCES: Source[] = [
  { id: 'usgs', label: 'USGS 地震', category: '地表', url: 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_day.geojson' },
  { id: 'eonet', label: 'NASA EONET 事件', category: '地表', url: 'https://eonet.gsfc.nasa.gov/api/v3/events?category=volcanoes&limit=1' },
  { id: 'gdacs', label: 'GDACS 灾害告警', category: '地表', url: 'https://www.gdacs.org/gdacsapi/api/events/geteventlist/MAP' },
  { id: 'swpc', label: 'NOAA SWPC 极光', category: '地表', url: 'https://services.swpc.noaa.gov/json/ovation_aurora_latest.json' },
  { id: 'open-meteo', label: 'Open-Meteo 气象', category: '近地', url: 'https://api.open-meteo.com/v1/forecast?latitude=0&longitude=0&current=temperature_2m' },
  { id: 'marine', label: 'Open-Meteo 海洋', category: '近地', url: 'https://marine-api.open-meteo.com/v1/marine?latitude=0&longitude=0&current=wave_height' },
  { id: 'noaa-crw', label: 'NOAA CRW 珊瑚白化', category: '洋底', url: 'https://pae-paha.pacioos.hawaii.edu/erddap/info/dhw_5km/index.json' },
  { id: 'celestrak', label: 'CelesTrak 轨道根数', category: '宇宙', url: 'https://celestrak.org/NORAD/elements/gp.php?CATNR=25544&FORMAT=tle' },
  { id: 'wheretheiss', label: 'wheretheiss 实时星下点', category: '宇宙', url: 'https://api.wheretheiss.at/v1/satellites/25544' },
  { id: 'cneos', label: 'JPL CNEOS 近地天体', category: '宇宙', url: 'https://ssd-api.jpl.nasa.gov/cad.api?date-min=now&date-max=%2B7&dist-max=0.05&sort=date' },
];

const TIMEOUT_MS = 6500;
const SLOW_MS = 2500; // 超过判为「缓慢」

interface Result {
  id: string;
  label: string;
  category: string;
  ok: boolean;
  status: number | null;
  latencyMs: number | null;
  state: 'up' | 'slow' | 'down';
  error?: string;
}

async function probe(s: Source): Promise<Result> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  const t0 = Date.now();
  try {
    const res = await fetch(s.url, {
      method: 'GET',
      signal: ctrl.signal,
      cache: 'no-store',
      headers: { 'User-Agent': 'OmniLens-HealthCheck/1.0', Accept: '*/*' },
    });
    const latencyMs = Date.now() - t0;
    // 仅判断连通与状态，不读取完整响应体（释放连接、省带宽）
    try { await res.body?.cancel(); } catch { /* */ }
    const ok = res.ok;
    return {
      id: s.id, label: s.label, category: s.category, ok, status: res.status, latencyMs,
      state: !ok ? 'down' : latencyMs > SLOW_MS ? 'slow' : 'up',
    };
  } catch (e) {
    const latencyMs = Date.now() - t0;
    const aborted = e instanceof Error && e.name === 'AbortError';
    return {
      id: s.id, label: s.label, category: s.category, ok: false, status: null, latencyMs,
      state: 'down', error: aborted ? '超时' : '连接失败',
    };
  } finally {
    clearTimeout(timer);
  }
}

export async function GET() {
  const results = await Promise.all(SOURCES.map(probe));
  const up = results.filter((r) => r.state === 'up').length;
  const slow = results.filter((r) => r.state === 'slow').length;
  const down = results.filter((r) => r.state === 'down').length;
  return NextResponse.json(
    { checkedAt: new Date().toISOString(), total: results.length, up, slow, down, sources: results },
    { headers: { 'Cache-Control': 'no-store, max-age=0' } },
  );
}
