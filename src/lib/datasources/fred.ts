/**
 * FRED（美联储经济数据库）真实序列适配器
 *
 * 免费 API Key：https://fredaccount.stlouisfed.org/apikeys （服务端环境变量 FRED_API_KEY）
 * 一个 Key 解锁上千条日/月频权威序列。未配置时该源整体降级（no_key），不造假。
 *
 * 端点：/fred/series/observations?series_id=..&api_key=..&file_type=json
 *        &sort_order=desc&limit=N  → { observations:[{date,value(string,'.'=缺失)}] }
 */

import type { EconCategory, EconSeries, SeriesPoint } from '@/types/econ';

const KEY = (process.env.FRED_API_KEY ?? '').trim();
const BASE = 'https://api.stlouisfed.org/fred/series/observations';
const LIMIT = 60;

export function hasFredKey(): boolean {
  return KEY.length > 0;
}

interface FredSeriesDef {
  id: string; // FRED series_id
  label: string;
  category: EconCategory;
  unit: string;
  note?: string;
  area?: string;
}

/** 选定的真实序列：大宗商品 / 利率与金融条件 / 部分宏观（日月频） */
const FRED_SERIES: FredSeriesDef[] = [
  { id: 'DCOILBRENTEU', label: '布伦特原油', category: 'commodity', unit: '美元/桶', note: '欧洲布伦特原油现货（日）' },
  { id: 'DCOILWTICO', label: 'WTI 原油', category: 'commodity', unit: '美元/桶', note: '西德州中质原油现货（日）' },
  { id: 'DHHNGSP', label: '亨利港天然气', category: 'commodity', unit: '美元/百万英热', note: 'Henry Hub 现货（日）' },
  { id: 'VIXCLS', label: 'VIX 恐慌指数', category: 'rate', unit: '点', note: 'CBOE 波动率指数（日）' },
  { id: 'DGS10', label: '美债 10 年收益率', category: 'rate', unit: '%', note: '10 年期国债收益率（日）' },
  { id: 'T10Y2Y', label: '10Y-2Y 利差', category: 'rate', unit: '%', note: '收益率曲线斜率，倒挂预警衰退（日）' },
  { id: 'DFF', label: '联邦基金利率', category: 'rate', unit: '%', note: '有效联邦基金利率（日）' },
  { id: 'DEXCHUS', label: '人民币汇率', category: 'fx', unit: 'CNY/USD', note: '在岸人民币兑美元（日）' },
  { id: 'CPIAUCSL', label: '美国 CPI', category: 'macro', unit: '指数', area: '美国', note: '城市消费者物价指数（月）' },
  { id: 'UNRATE', label: '美国失业率', category: 'macro', unit: '%', area: '美国', note: '失业率（月）' },
];

function num(s: string): number | null {
  if (s === '.' || s === '' || s == null) return null;
  const v = Number(s);
  return Number.isFinite(v) ? v : null;
}

async function fetchOne(def: FredSeriesDef): Promise<EconSeries | null> {
  const url =
    `${BASE}?series_id=${def.id}&api_key=${KEY}&file_type=json` +
    `&sort_order=desc&limit=${LIMIT}`;
  const res = await fetch(url, { next: { revalidate: 1800 } });
  if (!res.ok) throw new Error(`FRED ${def.id} ${res.status}`);
  const json = (await res.json()) as { observations?: { date: string; value: string }[] };
  const obs = json.observations ?? [];

  // desc → 取最新有效点，转升序
  const points: SeriesPoint[] = [];
  for (const o of obs) {
    const v = num(o.value);
    if (v != null) points.push({ date: o.date, value: v });
  }
  if (points.length === 0) return null;
  points.reverse(); // 升序

  const latest = points[points.length - 1];
  const prev = points.length >= 2 ? points[points.length - 2] : null;
  const change = prev ? latest.value - prev.value : null;
  const changePercent = prev && prev.value !== 0 ? ((latest.value - prev.value) / Math.abs(prev.value)) * 100 : null;

  return {
    id: `fred-${def.id}`,
    label: def.label,
    category: def.category,
    provider: 'FRED',
    unit: def.unit,
    points,
    latest: latest.value,
    change,
    changePercent,
    asOf: latest.date,
    sourceUrl: `https://fred.stlouisfed.org/series/${def.id}`,
    area: def.area,
    note: def.note,
  };
}

/** 拉取全部 FRED 序列；逐条 try/catch，失败的跳过（不造假）。无 Key 抛出供上层标记 no_key。 */
export async function fetchFredSeries(): Promise<EconSeries[]> {
  if (!hasFredKey()) throw new Error('no_key');
  const settled = await Promise.allSettled(FRED_SERIES.map(fetchOne));
  const out: EconSeries[] = [];
  for (const s of settled) {
    if (s.status === 'fulfilled' && s.value) out.push(s.value);
  }
  return out;
}
