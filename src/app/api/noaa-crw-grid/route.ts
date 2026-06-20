import { NextResponse } from 'next/server';

/**
 * NOAA 珊瑚礁观察（Coral Reef Watch）粗网格 — 近地层标量叠加：海温偏差(SST Anomaly) + 白化预警(BAA)。
 * 真实数据：NOAA CRW 每日 5km 全球产品，经 CoastWatch ERDDAP griddap 取样（免费无 key）。
 *   - CRW_SSTANOMALY：海面温度相对气候态偏差（°C）
 *   - CRW_BAA：Bleaching Alert Area 白化预警等级（0 无 … 4 II 级）
 * 以索引步长在 0.05° 网格上稀疏取样，按最近落格填入本服务 15° 粗网格；缺测记 NaN（前端透明）。
 * 注意：ERDDAP 数据集 id/变量名以部署环境为准；任何异常一律返回空网格(nx:0)，绝不编造数据。
 * 服务端缓存 3 小时（CRW 为日更产品）。
 */

const DLON = 15, DLAT = 15, LON0 = -180, LAT0 = -75, NX = 24, NY = 11;
const CACHE_TTL_MS = 3 * 60 * 60 * 1000;
// PacIOOS dhw_5km：NOAA CRW v3.1 综合产品，同时含 CRW_SSTANOMALY + CRW_BAA（经核验，0.05° 全球每日）
const ERDDAP = 'https://pae-paha.pacioos.hawaii.edu/erddap/griddap/dhw_5km.json';
const STRIDE = 200; // 0.05° × 200 = 10° 取样间隔，覆盖全球约 36×18 点
// 缺测填充值（ERDDAP info 核验）：SSTANOMALY=-327.68(物理范围 ±15)，BAA=251(有效 0–4)
const SSTA_VALID = (v: number) => (Number.isFinite(v) && v > -90 && v < 90 ? v : NaN);
const BAA_VALID = (v: number) => (Number.isFinite(v) && v >= 0 && v <= 4 ? v : NaN);
const DHW_VALID = (v: number) => (Number.isFinite(v) && v >= 0 && v <= 100 ? v : NaN); // 度日热 fill -327.68

type Param = 'sst_anomaly' | 'bleaching_alert_area' | 'degree_heating_week';

interface ScalarGrid {
  nx: number; ny: number; lon0: number; lat0: number; dLon: number; dLat: number;
  params: Record<Param, number[]>;
  generatedAt: string; source: string;
}
let cache: { expires: number; body: ScalarGrid } | null = null;

interface ErddapTable { table?: { columnNames?: string[]; rows?: (number | string | null)[][] } }

/** 把 (lat,lon,值) 落入最近的粗网格单元（取该格内样本均值） */
function binToGrid(samples: { lat: number; lon: number; val: number }[]): number[] {
  const sum = new Array(NX * NY).fill(0);
  const cnt = new Array(NX * NY).fill(0);
  for (const s of samples) {
    if (!Number.isFinite(s.val)) continue;
    const i = Math.round((s.lon - LON0) / DLON);
    const j = Math.round((s.lat - LAT0) / DLAT);
    if (i < 0 || i >= NX || j < 0 || j >= NY) continue;
    const idx = j * NX + i;
    sum[idx] += s.val; cnt[idx] += 1;
  }
  return sum.map((v, k) => (cnt[k] > 0 ? v / cnt[k] : NaN));
}

export async function GET() {
  const now = Date.now();
  if (cache && cache.expires > now) {
    return NextResponse.json(cache.body, { headers: { 'Cache-Control': 'public, s-maxage=10800, stale-while-revalidate=21600' } });
  }

  const range = `[(last)][(89.975):${STRIDE}:(-89.975)][(-179.975):${STRIDE}:(179.975)]`;
  const url = `${ERDDAP}?CRW_SSTANOMALY${range},CRW_BAA${range},CRW_DHW${range}`;

  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(20000), next: { revalidate: 0 } });
    if (!res.ok) throw new Error(`NOAA CRW ERDDAP HTTP ${res.status}`);
    const json = (await res.json()) as ErddapTable;
    const cols = json.table?.columnNames ?? [];
    const rows = json.table?.rows ?? [];
    const latI = cols.indexOf('latitude');
    const lonI = cols.indexOf('longitude');
    const sstaI = cols.indexOf('CRW_SSTANOMALY');
    const baaI = cols.indexOf('CRW_BAA');
    const dhwI = cols.indexOf('CRW_DHW');
    if (latI < 0 || lonI < 0 || (sstaI < 0 && baaI < 0 && dhwI < 0) || rows.length === 0) {
      throw new Error('ERDDAP 返回列结构不符');
    }
    const sstaSamples = sstaI >= 0 ? rows.map((r) => ({ lat: Number(r[latI]), lon: Number(r[lonI]), val: SSTA_VALID(Number(r[sstaI])) })) : [];
    const baaSamples = baaI >= 0 ? rows.map((r) => ({ lat: Number(r[latI]), lon: Number(r[lonI]), val: BAA_VALID(Number(r[baaI])) })) : [];
    const dhwSamples = dhwI >= 0 ? rows.map((r) => ({ lat: Number(r[latI]), lon: Number(r[lonI]), val: DHW_VALID(Number(r[dhwI])) })) : [];
    const params: Record<Param, number[]> = {
      sst_anomaly: sstaI >= 0 ? binToGrid(sstaSamples) : new Array(NX * NY).fill(NaN),
      bleaching_alert_area: baaI >= 0 ? binToGrid(baaSamples) : new Array(NX * NY).fill(NaN),
      degree_heating_week: dhwI >= 0 ? binToGrid(dhwSamples) : new Array(NX * NY).fill(NaN),
    };
    const body: ScalarGrid = { nx: NX, ny: NY, lon0: LON0, lat0: LAT0, dLon: DLON, dLat: DLAT, params, generatedAt: new Date().toISOString(), source: 'NOAA Coral Reef Watch 5km（PacIOOS ERDDAP）' };
    cache = { expires: now + CACHE_TTL_MS, body };
    return NextResponse.json(body, { headers: { 'Cache-Control': 'public, s-maxage=10800, stale-while-revalidate=21600' } });
  } catch (err) {
    if (cache) return NextResponse.json({ ...cache.body, stale: true });
    // 取数失败：返回空网格，前端不渲染（不编造数据）
    return NextResponse.json({ error: err instanceof Error ? err.message : 'NOAA CRW 获取失败', nx: 0, ny: 0 }, { status: 502, headers: { 'Cache-Control': 'no-store' } });
  }
}
