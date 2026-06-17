/**
 * EIA（美国能源信息署）真实序列适配器 — 能源实物供需
 *
 * 免费 API Key：https://www.eia.gov/opendata/register.php （服务端环境变量 EIA_API_KEY）
 * 使用 v2 便捷端点 /v2/seriesid/{LEGACY_ID}?api_key=.. 避开复杂 facet 路由：
 *   → { response:{ data:[{ period, value, ... }] } }
 * 未配置 Key 时整体降级（no_key），不造假。
 */

import type { EconSeries, SeriesPoint } from '@/types/econ';

const KEY = (process.env.EIA_API_KEY ?? '').trim();
const BASE = 'https://api.eia.gov/v2/seriesid';

export function hasEiaKey(): boolean {
  return KEY.length > 0;
}

interface EiaSeriesDef {
  id: string; // EIA 旧版 series id
  label: string;
  unit: string;
  note?: string;
}

/** 能源实物供需真实序列（周频） */
const EIA_SERIES: EiaSeriesDef[] = [
  { id: 'PET.WCESTUS1.W', label: '美国原油库存', unit: '千桶', note: '商业原油库存（不含战略储备 SPR，周）' },
  { id: 'PET.WCRFPUS2.W', label: '美国原油产量', unit: '千桶/日', note: '本土原油产量（周）' },
  { id: 'NG.NW2_EPG0_SWO_R48_BCF.W', label: '美国天然气库存', unit: 'Bcf', note: '下48州地下储气量（周）' },
];

function toNum(v: unknown): number | null {
  if (typeof v === 'number') return Number.isFinite(v) ? v : null;
  if (typeof v === 'string') {
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
  }
  return null;
}

/** EIA period 形如 "2024-06-07" 或 "20240607"，统一为 ISO 日期 */
function normPeriod(p: string): string {
  if (/^\d{8}$/.test(p)) return `${p.slice(0, 4)}-${p.slice(4, 6)}-${p.slice(6, 8)}`;
  return p;
}

async function fetchOne(def: EiaSeriesDef): Promise<EconSeries | null> {
  const url = `${BASE}/${def.id}?api_key=${KEY}`;
  const res = await fetch(url, { next: { revalidate: 3600 } });
  if (!res.ok) throw new Error(`EIA ${def.id} ${res.status}`);
  const json = (await res.json()) as {
    response?: { data?: { period: string; value: unknown }[] };
  };
  const data = json.response?.data ?? [];

  const points: SeriesPoint[] = [];
  for (const d of data) {
    const v = toNum(d.value);
    if (v != null && d.period) points.push({ date: normPeriod(String(d.period)), value: v });
  }
  if (points.length === 0) return null;
  // 统一升序
  points.sort((a, b) => a.date.localeCompare(b.date));
  const trimmed = points.slice(-60);

  const latest = trimmed[trimmed.length - 1];
  const prev = trimmed.length >= 2 ? trimmed[trimmed.length - 2] : null;
  const change = prev ? latest.value - prev.value : null;
  const changePercent = prev && prev.value !== 0 ? ((latest.value - prev.value) / Math.abs(prev.value)) * 100 : null;

  return {
    id: `eia-${def.id}`,
    label: def.label,
    category: 'energy_supply',
    provider: 'EIA',
    unit: def.unit,
    points: trimmed,
    latest: latest.value,
    change,
    changePercent,
    asOf: latest.date,
    sourceUrl: 'https://www.eia.gov/opendata/',
    note: def.note,
  };
}

/** 拉取全部 EIA 序列；逐条 try/catch。无 Key 抛出供上层标记 no_key。 */
export async function fetchEiaSeries(): Promise<EconSeries[]> {
  if (!hasEiaKey()) throw new Error('no_key');
  const settled = await Promise.allSettled(EIA_SERIES.map(fetchOne));
  const out: EconSeries[] = [];
  for (const s of settled) {
    if (s.status === 'fulfilled' && s.value) out.push(s.value);
  }
  return out;
}
