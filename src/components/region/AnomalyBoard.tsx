'use client';

/**
 * 实时异常榜（3.0 智能层 C · 完整版）— 跨层聚合真实事件/场，按显著度排序，一键定位。
 * 数据（免密钥·近实时·中立并陈）：
 *   点事件：USGS 地震 + NASA EONET 火山/风暴/洪水
 *   标量场：NOAA CRW 白化预警(BAA)/海温异常(SSTA) · Open-Meteo CAMS PM2.5（粗网格高值单元）
 * 自动态势简报 + 关注领域标签（关联引擎雏形，确定性·非预测）。仅地表层显示；点击飞向并打开详情。
 * 诚实合成、不编造，缺时间不伪造。
 */

import { useEffect, useState } from 'react';
import useSWR from 'swr';
import type { FeatureCollection, Feature } from 'geojson';
import { useMapStore } from '@/store/useMapStore';
import { useWatchlistStore } from '@/store/useWatchlistStore';
import { DockPanel } from '@/components/region/DockPanel';
import { timeAgo } from '@/lib/format/time';
import type { EventDetail } from '@/types/geo';

const fetcher = (url: string) => fetch(url).then((r) => r.json());
const swrOpts = { revalidateOnFocus: false, refreshInterval: 5 * 60 * 1000, dedupingInterval: 60 * 1000 };

interface ScalarGrid { nx: number; ny: number; lon0: number; lat0: number; dLon: number; dLat: number; params: Record<string, number[]> }

interface Anomaly {
  key: string;
  kind: string;
  icon: string;
  label: string;
  score: number;
  coords: [number, number];
  time: string;
  tsunami?: boolean;
}

function coordsOf(f: Feature): [number, number] | null {
  const g = f.geometry as { type?: string; coordinates?: number[] } | null;
  if (!g || g.type !== 'Point' || !Array.isArray(g.coordinates) || g.coordinates.length < 2) return null;
  return [g.coordinates[0], g.coordinates[1]];
}

function severityClass(score: number): string {
  return score >= 70 ? 'text-rose-300' : score >= 55 ? 'text-amber-300' : 'text-dashboard-neutral/70';
}

/** 显著度 → 左侧强调条颜色 */
function severityHex(score: number): string {
  return score >= 70 ? '#f43f5e' : score >= 55 ? '#fb923c' : '#64748b';
}

/** 关注领域（按类型确定性推断，非预测；关联引擎雏形） */
function impactDomains(kind: string, tsunami: boolean): string[] {
  switch (kind) {
    case '地震': return tsunami ? ['海啸预警', '基建', '救灾'] : ['基建', '救灾', '保险'];
    case '风暴': return ['航运', '能源', '航空', '农业'];
    case '野火': return ['空气质量', '应急', '农林', '碳排放'];
    case '火山': return ['航空', '空气质量'];
    case '洪水': return ['农业', '基建', '救灾'];
    case '白化预警': return ['海洋生态', '渔业', '旅游'];
    case '海温异常': return ['渔业', '气候', '珊瑚'];
    case '污染': return ['公共健康', '航空能见度', '农业'];
    default: return [];
  }
}

/** 扫描粗网格高值单元 → 异常项（cell 中心经纬，真实值） */
function scanGrid(
  grid: ScalarGrid | undefined, key: string, kind: string, icon: string, prefix: string,
  pass: (v: number) => boolean, score: (v: number) => number, label: (v: number) => string, topK: number,
): Anomaly[] {
  if (!grid?.nx || !grid.params?.[key]) return [];
  const { nx, lon0, lat0, dLon, dLat, params } = grid;
  const field = params[key];
  const hits: { v: number; lon: number; lat: number }[] = [];
  for (let k = 0; k < field.length; k++) {
    const v = field[k];
    if (!Number.isFinite(v) || !pass(v)) continue;
    const i = k % nx, j = Math.floor(k / nx);
    hits.push({ v, lon: lon0 + i * dLon, lat: lat0 + j * dLat });
  }
  hits.sort((a, b) => Math.abs(b.v) - Math.abs(a.v));
  return hits.slice(0, topK).map((h) => ({
    key: `${prefix}-${h.lon},${h.lat}`,
    kind, icon, label: label(h.v), score: Math.round(score(h.v)),
    coords: [h.lon, h.lat] as [number, number], time: '',
  }));
}

export function AnomalyBoard({ className = '' }: { className?: string }) {
  const enabled = useMapStore((s) => s.activeBody === 'earth' && s.activeTier === 'surface');
  const setViewport = useMapStore((s) => s.setViewport);
  const selectEvent = useMapStore((s) => s.selectEvent);
  const [filter, setFilter] = useState<string>('全部');
  const [onlyWatched, setOnlyWatched] = useState(false);

  // 关注清单 / 阈值告警
  const watchedKinds = useWatchlistStore((s) => s.kinds);
  const threshold = useWatchlistStore((s) => s.threshold);
  const alertsEnabled = useWatchlistStore((s) => s.alertsEnabled);
  const toggleKind = useWatchlistStore((s) => s.toggleKind);
  const setThreshold = useWatchlistStore((s) => s.setThreshold);
  const setAlertsEnabled = useWatchlistStore((s) => s.setAlertsEnabled);

  const { data: quakes } = useSWR<FeatureCollection>(enabled ? '/api/earthquakes' : null, fetcher, swrOpts);
  const { data: volcanoes } = useSWR<FeatureCollection>(enabled ? '/api/volcanoes' : null, fetcher, swrOpts);
  const { data: storms } = useSWR<FeatureCollection>(enabled ? '/api/storms' : null, fetcher, swrOpts);
  const { data: floods } = useSWR<FeatureCollection>(enabled ? '/api/floods' : null, fetcher, swrOpts);
  const { data: wildfires } = useSWR<FeatureCollection>(enabled ? '/api/wildfires' : null, fetcher, swrOpts);
  const { data: crw } = useSWR<ScalarGrid>(enabled ? '/api/noaa-crw-grid' : null, fetcher, swrOpts);
  const { data: aq } = useSWR<ScalarGrid>(enabled ? '/api/airquality-grid' : null, fetcher, swrOpts);

  const items: Anomaly[] = [];

  if (quakes?.type === 'FeatureCollection') {
    for (const f of quakes.features) {
      const c = coordsOf(f);
      const p = (f.properties ?? {}) as { mag?: number; place?: string; time?: number; tsunami?: number };
      if (!c || typeof p.mag !== 'number' || p.mag < 4.5) continue;
      items.push({
        key: `q-${c[0]},${c[1]},${p.time}`, kind: '地震', icon: '📳',
        label: `M${p.mag.toFixed(1)} · ${p.place ?? '未知区域'}${p.tsunami ? ' · 🌊海啸' : ''}`,
        score: Math.round(p.mag * 11 + (p.tsunami ? 15 : 0)), coords: c,
        time: typeof p.time === 'number' ? new Date(p.time).toISOString() : '', tsunami: !!p.tsunami,
      });
    }
  }
  const pushEonet = (fc: FeatureCollection | undefined, kind: string, icon: string, base: number, prefix: string) => {
    if (fc?.type !== 'FeatureCollection') return;
    for (const f of fc.features) {
      const c = coordsOf(f);
      const p = (f.properties ?? {}) as { title?: string; date?: string };
      if (!c) continue;
      items.push({ key: `${prefix}-${c[0]},${c[1]}`, kind, icon, label: p.title ?? kind, score: base, coords: c, time: p.date ? new Date(p.date).toISOString() : '' });
    }
  };
  pushEonet(storms, '风暴', '🌪️', 58, 's');
  pushEonet(wildfires, '野火', '🔥', 56, 'wf');
  pushEonet(volcanoes, '火山', '🌋', 52, 'v');
  pushEonet(floods, '洪水', '🌊', 46, 'f');

  // 标量场异常（粗网格高值单元）
  const baaName = ['无', '关注', '警告', 'I级', 'II级'];
  items.push(...scanGrid(crw, 'bleaching_alert_area', '白化预警', '🪸', 'baa',
    (v) => v >= 3, (v) => 54 + v * 6, (v) => `白化预警 ${baaName[Math.round(Math.max(0, Math.min(4, v)))]}`, 3));
  items.push(...scanGrid(crw, 'sst_anomaly', '海温异常', '🌡️', 'ssta',
    (v) => Math.abs(v) >= 3, (v) => 50 + Math.min(Math.abs(v), 8) * 3, (v) => `海温异常 ${v > 0 ? '+' : ''}${v.toFixed(1)}°C`, 3));
  items.push(...scanGrid(aq, 'pm2_5', '污染', '😷', 'pm',
    (v) => v >= 110, (v) => 46 + Math.min((v - 110) / 12, 18), (v) => `PM2.5 ${Math.round(v)} μg/m³`, 3));

  items.sort((a, b) => b.score - a.score);

  // 关注阈值告警：每轮数据刷新后上送候选项，越阈且未告警过则推 toast（去重在 store 内）
  const ingestSig = items.map((i) => `${i.key}:${i.score}`).join('|');
  useEffect(() => {
    if (!enabled) return;
    useWatchlistStore.getState().ingest(
      items.map((i) => ({ key: i.key, icon: i.icon, kind: i.kind, label: i.label, score: i.score, coords: i.coords, time: i.time })),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ingestSig, enabled, watchedKinds, threshold, alertsEnabled]);

  if (!enabled) return null;

  // 类别过滤（+ 仅看关注）
  const kinds = Array.from(new Set(items.map((i) => i.kind)));
  const byFilter = filter === '全部' ? items : items.filter((i) => i.kind === filter);
  const filtered = onlyWatched ? byFilter.filter((i) => watchedKinds.includes(i.kind)) : byFilter;
  const top = filtered.slice(0, 14);

  // 自动态势简报
  const count = (k: string) => items.filter((i) => i.kind === k).length;
  const strongQuake = items.filter((i) => i.kind === '地震')[0];
  const briefParts: string[] = [];
  if (strongQuake) briefParts.push(`最强 ${strongQuake.label.split(' · ')[0]} 地震`);
  for (const [k, w] of [['风暴', '个活跃风暴'], ['野火', '处活跃野火'], ['火山', '处活跃火山'], ['洪水', '处洪水'], ['白化预警', '处珊瑚高温压力'], ['污染', '处颗粒物超标']] as const) {
    const n = count(k); if (n) briefParts.push(`${n} ${w}`);
  }
  const summary = briefParts.length ? `当前全球：${briefParts.join('、')}。` : '';

  const focus = (a: Anomaly) => {
    setViewport(a.coords, Math.max(useMapStore.getState().zoom, 3.5));
    const isQuake = a.kind === '地震';
    const isGrid = ['白化预警', '海温异常', '污染'].includes(a.kind);
    selectEvent({
      id: a.key,
      title: `${a.icon} ${a.kind} · ${a.label}`,
      source: isQuake ? 'USGS 地震灾害项目（近实时）' : isGrid ? 'NOAA CRW / Open-Meteo CAMS（粗网格）' : 'NASA EONET（近实时）',
      timestamp: a.time,
      location: a.coords,
      impact_level: a.score >= 70 ? 'high' : a.score >= 55 ? 'medium' : 'low',
      category: 'natural',
      description: `${a.kind}。跨层异常聚合·按显著度排序（确定性合成，非预测）。`,
      metrics: [
        { label: '显著度', value: String(a.score), accent: a.score >= 70 ? '#f43f5e' : a.score >= 55 ? '#fb923c' : '#38bdf8' },
        { label: '类别', value: a.kind },
      ],
      tags: impactDomains(a.kind, !!a.tsunami),
    } as EventDetail);
  };

  return (
    <DockPanel
      id="anomaly-board"
      icon="🛰"
      title="实时异常榜 · 全球态势"
      className={`w-[min(18rem,calc(100vw-2rem))] border-rose-500/25 bg-dashboard-bg/95 shadow-xl backdrop-blur-md ${className}`}
    >
      <div className="space-y-1.5 text-[11px]">
        {summary && (
          <div className="rounded-md border border-rose-500/20 bg-rose-500/5 px-2 py-1.5 text-[11px] leading-snug text-dashboard-neutral/85">
            <span className="mr-1" aria-hidden>📡</span>{summary}
          </div>
        )}
        {/* 关注与阈值告警 */}
        <div className="flex items-center gap-1.5 rounded-md border border-amber-500/15 bg-amber-500/[0.04] px-2 py-1 text-[10px]">
          <button
            type="button"
            onClick={() => setAlertsEnabled(!alertsEnabled)}
            title={alertsEnabled ? '告警已开启（点击关闭）' : '告警已关闭（点击开启）'}
            aria-pressed={alertsEnabled}
            className={['shrink-0 rounded px-1 py-0.5 transition-colors', alertsEnabled ? 'text-amber-300' : 'text-dashboard-neutral/40 hover:text-dashboard-neutral/70'].join(' ')}
          >
            {alertsEnabled ? '🔔' : '🔕'}
          </button>
          <span className="text-dashboard-neutral/55">阈值</span>
          <button type="button" onClick={() => setThreshold(threshold - 5)} aria-label="降低阈值" className="rounded px-1 text-dashboard-neutral/55 hover:bg-white/5 hover:text-white">−</button>
          <span className="w-5 text-center tabular-nums font-semibold text-amber-200">{threshold}</span>
          <button type="button" onClick={() => setThreshold(threshold + 5)} aria-label="提高阈值" className="rounded px-1 text-dashboard-neutral/55 hover:bg-white/5 hover:text-white">＋</button>
          <button
            type="button"
            onClick={() => setOnlyWatched((v) => !v)}
            aria-pressed={onlyWatched}
            title="仅显示已关注类别"
            className={['ml-auto shrink-0 rounded px-1.5 py-0.5 transition-colors', onlyWatched ? 'bg-amber-500/25 text-amber-200' : 'text-dashboard-neutral/55 hover:bg-white/5'].join(' ')}
          >
            {onlyWatched ? '★ 仅关注' : '☆ 仅关注'}
          </button>
        </div>
        {/* 类别过滤（带实时计数） */}
        <div className="flex flex-wrap gap-1">
          {['全部', ...kinds].map((k) => {
            const n = k === '全部' ? items.length : items.filter((i) => i.kind === k).length;
            return (
              <button
                key={k}
                type="button"
                onClick={() => setFilter(k)}
                className={['flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] transition-colors', filter === k ? 'bg-rose-500/25 text-rose-200' : 'text-dashboard-neutral/55 hover:bg-white/5'].join(' ')}
              >
                <span>{k}</span>
                <span className={['tabular-nums', filter === k ? 'text-rose-100/90' : 'text-dashboard-neutral/40'].join(' ')}>{n}</span>
              </button>
            );
          })}
        </div>
        {top.length === 0 ? (
          <div className="py-2 text-center text-dashboard-neutral/45">暂无显著异常 / 数据加载中</div>
        ) : (
          <div className="max-h-[42vh] space-y-1 overflow-y-auto pr-0.5">
            {top.map((a) => (
              <div
                key={a.key}
                className="flex w-full items-center gap-1 rounded-md bg-white/5 pr-1 transition-colors hover:bg-white/10"
                style={{ borderLeft: `2.5px solid ${severityHex(a.score)}` }}
              >
                <button
                  type="button"
                  onClick={() => focus(a)}
                  className="flex min-w-0 flex-1 items-center gap-2 px-2 py-1.5 text-left active:scale-[0.99]"
                >
                  <span aria-hidden className="shrink-0 text-sm">{a.icon}</span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-dashboard-neutral/85">{a.label}</span>
                    <span className="block truncate text-[9px] text-dashboard-neutral/45">
                      {a.kind}{a.time ? ` · ${timeAgo(a.time)}` : ''} · {impactDomains(a.kind, !!a.tsunami).slice(0, 2).join('/')}
                    </span>
                  </span>
                  <span className={`shrink-0 tabular-nums text-[10px] font-semibold ${severityClass(a.score)}`}>{a.score}</span>
                </button>
                <button
                  type="button"
                  onClick={() => toggleKind(a.kind)}
                  aria-pressed={watchedKinds.includes(a.kind)}
                  title={watchedKinds.includes(a.kind) ? `取消关注「${a.kind}」类` : `关注「${a.kind}」类（越阈告警）`}
                  className={['shrink-0 rounded px-1 text-sm transition-colors', watchedKinds.includes(a.kind) ? 'text-amber-300' : 'text-dashboard-neutral/35 hover:text-amber-200'].join(' ')}
                >
                  {watchedKinds.includes(a.kind) ? '★' : '☆'}
                </button>
              </div>
            ))}
          </div>
        )}
        <div className="border-t border-dashboard-neutral/10 pt-1 text-[9px] text-dashboard-neutral/40">源：USGS · NASA EONET · NOAA CRW · Open-Meteo CAMS · 真实数据·中立并陈</div>
      </div>
    </DockPanel>
  );
}
