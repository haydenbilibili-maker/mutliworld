/**
 * NASA FIRMS 活跃火点 — Wave 2 实时
 *
 * 数据源：NASA FIRMS（Fire Information for Resource Management System）。
 * VIIRS 近实时活跃火点（活火/热异常）。需免费 MAP_KEY：
 *   注册 https://firms.modaps.eosdis.nasa.gov/api/area/ 申请 → 配 FIRMS_MAP_KEY（服务端，非 NEXT_PUBLIC）。
 * 无 key 时返回空（优雅降级，不阻塞）。服务端抓取避 CORS。
 */

import type { FirePoint } from '@/types/fires';

const KEY = (process.env.FIRMS_MAP_KEY ?? '').trim();
const SOURCE = 'VIIRS_SNPP_NRT'; // 375m 分辨率近实时
const MAX_POINTS = 800; // 全球火点可达数千，取 FRP 最强 N 个

export function hasFirmsKey(): boolean {
  return KEY.length > 0;
}

function num(v: string | undefined): number {
  const n = parseFloat(v ?? '');
  return Number.isFinite(n) ? n : 0;
}

/** 拉取全球近一天活跃火点（按 FRP 取最强 MAX_POINTS 个） */
export async function fetchActiveFires(dayRange = 1): Promise<FirePoint[]> {
  if (!KEY) return [];
  try {
    const url = `https://firms.modaps.eosdis.nasa.gov/api/area/csv/${KEY}/${SOURCE}/world/${dayRange}`;
    const res = await fetch(url, { next: { revalidate: 600 } });
    if (!res.ok) return [];
    const csv = (await res.text()).trim();
    if (!csv || csv.startsWith('Invalid') || csv.startsWith('<')) return [];

    const rows = csv.split('\n');
    const header = rows[0].split(',').map((h) => h.trim());
    const col = (name: string) => header.indexOf(name);
    const iLat = col('latitude');
    const iLng = col('longitude');
    const iFrp = col('frp');
    const iConf = col('confidence');
    const iBt = col('bright_ti4');
    const iDate = col('acq_date');
    const iTime = col('acq_time');
    const iDn = col('daynight');
    const iSat = col('satellite');
    if (iLat < 0 || iLng < 0) return [];

    const out: FirePoint[] = [];
    for (let i = 1; i < rows.length; i++) {
      const c = rows[i].split(',');
      const lat = num(c[iLat]);
      const lng = num(c[iLng]);
      if (lat === 0 && lng === 0) continue;
      out.push({
        id: `fire-${i}`,
        lat,
        lng,
        frp: num(c[iFrp]),
        confidence: (c[iConf] ?? '').trim(),
        brightness: num(c[iBt]),
        acqDate: (c[iDate] ?? '').trim(),
        acqTime: (c[iTime] ?? '').trim(),
        daynight: (c[iDn] ?? '').trim(),
        satellite: (c[iSat] ?? '').trim(),
      });
    }
    out.sort((a, b) => b.frp - a.frp);
    return out.slice(0, MAX_POINTS);
  } catch {
    return [];
  }
}
