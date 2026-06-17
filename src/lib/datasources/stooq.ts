/**
 * Stooq 真实股指/行情适配器（免费、无需 Key、CSV）
 *
 * 历史端点：https://stooq.com/q/d/l/?s={symbol}&i=d&d1=YYYYMMDD&d2=YYYYMMDD
 *   → CSV: Date,Open,High,Low,Close,Volume
 * 用真实日收盘替换原「种子+抖动」股指。逐符号 try/catch，失败跳过（不造假）。
 */

import type { EconSeries, SeriesPoint } from '@/types/econ';
import type { RegionId } from '@/types/region';

export interface IndexDef {
  symbol: string; // Stooq 符号
  label: string;
  region: string;
  regionIds: RegionId[];
}

/** 主要股指（Stooq 符号） */
export const STOOQ_INDICES: IndexDef[] = [
  { symbol: '^spx', label: '标普 500', region: '美国', regionIds: ['north_america'] },
  { symbol: '^ndq', label: '纳斯达克', region: '美国', regionIds: ['north_america'] },
  { symbol: '^dji', label: '道琼斯', region: '美国', regionIds: ['north_america'] },
  { symbol: '^shc', label: '上证综指', region: '中国', regionIds: ['china'] },
  { symbol: '^hsi', label: '恒生指数', region: '中国香港', regionIds: ['china', 'asia_pacific'] },
  { symbol: '^n225', label: '日经 225', region: '日本', regionIds: ['asia_pacific'] },
  { symbol: '^dax', label: '德国 DAX', region: '德国', regionIds: ['western_europe'] },
];

function ymd(d: Date): string {
  return d.toISOString().slice(0, 10).replace(/-/g, '');
}

/** 拉取单符号近 N 日真实日收盘序列（升序）。 */
export async function fetchStooqDaily(symbol: string, days = 120): Promise<SeriesPoint[]> {
  const end = new Date();
  const start = new Date(end.getTime() - days * 86400_000);
  const url = `https://stooq.com/q/d/l/?s=${encodeURIComponent(symbol)}&i=d&d1=${ymd(start)}&d2=${ymd(end)}`;
  const res = await fetch(url, { next: { revalidate: 600 } });
  if (!res.ok) throw new Error(`Stooq ${symbol} ${res.status}`);
  const text = await res.text();
  const lines = text.trim().split(/\r?\n/);
  if (lines.length < 2 || !/^date,/i.test(lines[0])) return [];

  const points: SeriesPoint[] = [];
  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].split(',');
    if (cols.length < 5) continue;
    const date = cols[0];
    const close = Number(cols[4]);
    if (!date || !Number.isFinite(close)) continue;
    points.push({ date, value: close });
  }
  points.sort((a, b) => a.date.localeCompare(b.date));
  return points;
}

function buildSeries(def: IndexDef, points: SeriesPoint[]): EconSeries | null {
  if (points.length === 0) return null;
  const latest = points[points.length - 1];
  const prev = points.length >= 2 ? points[points.length - 2] : null;
  const change = prev ? latest.value - prev.value : null;
  const changePercent = prev && prev.value !== 0 ? ((latest.value - prev.value) / Math.abs(prev.value)) * 100 : null;
  return {
    id: `stooq-${def.symbol}`,
    label: def.label,
    category: 'index',
    provider: 'Stooq',
    unit: '点',
    points,
    latest: latest.value,
    change,
    changePercent,
    asOf: latest.date,
    sourceUrl: `https://stooq.com/q/?s=${encodeURIComponent(def.symbol)}`,
    area: def.region,
  };
}

/** 全部股指真实序列（econ 用）。 */
export async function fetchStooqIndexSeries(): Promise<EconSeries[]> {
  const settled = await Promise.allSettled(
    STOOQ_INDICES.map(async (d) => buildSeries(d, await fetchStooqDaily(d.symbol))),
  );
  const out: EconSeries[] = [];
  for (const s of settled) {
    if (s.status === 'fulfilled' && s.value) out.push(s.value);
  }
  return out;
}
