/**
 * World Bank 开放数据适配器 — 国别宏观经济指标（真实、无需 Key）
 *
 * 端点：/v2/country/{ISO2;..}/indicator/{IND}?format=json&date=YYYY:YYYY&per_page=..
 *   → [ {meta}, [ { countryiso3code, country:{id,value}, date, value } ... ] ]
 * 年频真实数据（GDP 增速 / 通胀 / 失业率），为政策预估模块提供底座。
 */

import type { EconSeries, SeriesPoint } from '@/types/econ';

const BASE = 'https://api.worldbank.org/v2';

/** 关注国别（ISO2 → 中文名） */
const COUNTRIES: { iso2: string; name: string }[] = [
  { iso2: 'US', name: '美国' },
  { iso2: 'CN', name: '中国' },
  { iso2: 'JP', name: '日本' },
  { iso2: 'DE', name: '德国' },
  { iso2: 'IN', name: '印度' },
  { iso2: 'GB', name: '英国' },
];

interface WbIndicator {
  code: string;
  label: string;
  unit: string;
  note?: string;
}

const INDICATORS: WbIndicator[] = [
  { code: 'NY.GDP.MKTP.KD.ZG', label: 'GDP 增速', unit: '%', note: '实际 GDP 年增长率' },
  { code: 'FP.CPI.TOTL.ZG', label: 'CPI 通胀', unit: '%', note: '消费者物价年通胀率' },
  { code: 'SL.UEM.TOTL.ZS', label: '失业率', unit: '%', note: '失业占劳动力比例（ILO 估计）' },
];

interface WbRow {
  countryiso3code: string;
  country?: { id: string; value: string };
  date: string;
  value: number | null;
}

async function fetchIndicator(ind: WbIndicator): Promise<EconSeries[]> {
  const iso = COUNTRIES.map((c) => c.iso2).join(';');
  const url = `${BASE}/country/${iso}/indicator/${ind.code}?format=json&date=2013:2025&per_page=400`;
  const res = await fetch(url, { next: { revalidate: 86400 } });
  if (!res.ok) throw new Error(`WorldBank ${ind.code} ${res.status}`);
  const json = (await res.json()) as [unknown, WbRow[] | null];
  const rows = Array.isArray(json) ? json[1] ?? [] : [];

  // 按国别分组 → 升序序列
  const byCountry = new Map<string, SeriesPoint[]>();
  for (const r of rows) {
    if (r.value == null || !r.country) continue;
    const key = r.country.id; // ISO2
    const arr = byCountry.get(key) ?? [];
    arr.push({ date: `${r.date}-12-31`, value: r.value });
    byCountry.set(key, arr);
  }

  const out: EconSeries[] = [];
  for (const c of COUNTRIES) {
    const pts = byCountry.get(c.iso2);
    if (!pts || pts.length === 0) continue;
    pts.sort((a, b) => a.date.localeCompare(b.date));
    const latest = pts[pts.length - 1];
    const prev = pts.length >= 2 ? pts[pts.length - 2] : null;
    const change = prev ? latest.value - prev.value : null;
    const changePercent = prev && prev.value !== 0 ? ((latest.value - prev.value) / Math.abs(prev.value)) * 100 : null;
    out.push({
      id: `wb-${ind.code}-${c.iso2}`,
      label: `${c.name} · ${ind.label}`,
      category: 'macro',
      provider: 'WorldBank',
      unit: ind.unit,
      points: pts,
      latest: latest.value,
      change,
      changePercent,
      asOf: latest.date.slice(0, 4),
      sourceUrl: `https://data.worldbank.org/indicator/${ind.code}?locations=${c.iso2}`,
      area: c.name,
      note: ind.note,
    });
  }
  return out;
}

/** 拉取全部宏观指标（无需 Key）；逐指标 try/catch。 */
export async function fetchWorldBankSeries(): Promise<EconSeries[]> {
  const settled = await Promise.allSettled(INDICATORS.map(fetchIndicator));
  const out: EconSeries[] = [];
  for (const s of settled) {
    if (s.status === 'fulfilled') out.push(...s.value);
  }
  return out;
}
