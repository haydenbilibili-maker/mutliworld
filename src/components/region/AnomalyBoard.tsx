'use client';

/**
 * 实时异常榜（3.0 P0 · 智能层）— 跨层聚合真实事件，按显著度排序，一键定位。
 * 数据：USGS 地震 + NASA EONET 火山/风暴/洪水（免密钥、近实时、中立并陈）。
 * 仅地表层显示；点击条目飞向该处并打开详情。诚实合成、不编造，缺时间不伪造。
 */

import useSWR from 'swr';
import type { FeatureCollection, Feature } from 'geojson';
import { useMapStore } from '@/store/useMapStore';
import { DockPanel } from '@/components/region/DockPanel';
import { timeAgo } from '@/lib/format/time';
import type { EventDetail } from '@/types/geo';

const fetcher = (url: string) => fetch(url).then((r) => r.json());
const swrOpts = { revalidateOnFocus: false, refreshInterval: 5 * 60 * 1000, dedupingInterval: 60 * 1000 };

interface Anomaly {
  key: string;
  kind: string;
  icon: string;
  label: string;
  score: number; // 显著度 0–100+
  coords: [number, number];
  time: string; // ISO 或空
}

function coordsOf(f: Feature): [number, number] | null {
  const g = f.geometry as { type?: string; coordinates?: number[] } | null;
  if (!g || g.type !== 'Point' || !Array.isArray(g.coordinates) || g.coordinates.length < 2) return null;
  return [g.coordinates[0], g.coordinates[1]];
}

function severityClass(score: number): string {
  return score >= 70 ? 'text-rose-300' : score >= 55 ? 'text-amber-300' : 'text-dashboard-neutral/70';
}

export function AnomalyBoard({ className = '' }: { className?: string }) {
  const enabled = useMapStore((s) => s.activeBody === 'earth' && s.activeTier === 'surface');
  const setViewport = useMapStore((s) => s.setViewport);
  const selectEvent = useMapStore((s) => s.selectEvent);

  const { data: quakes } = useSWR<FeatureCollection>(enabled ? '/api/earthquakes' : null, fetcher, swrOpts);
  const { data: volcanoes } = useSWR<FeatureCollection>(enabled ? '/api/volcanoes' : null, fetcher, swrOpts);
  const { data: storms } = useSWR<FeatureCollection>(enabled ? '/api/storms' : null, fetcher, swrOpts);
  const { data: floods } = useSWR<FeatureCollection>(enabled ? '/api/floods' : null, fetcher, swrOpts);

  if (!enabled) return null;

  const items: Anomaly[] = [];

  // 地震：M≥4.5 入榜，按震级评分；带海啸标志加权
  if (quakes?.type === 'FeatureCollection') {
    for (const f of quakes.features) {
      const c = coordsOf(f);
      const p = (f.properties ?? {}) as { mag?: number; place?: string; time?: number; tsunami?: number };
      if (!c || typeof p.mag !== 'number' || p.mag < 4.5) continue;
      const tsunami = p.tsunami ? 15 : 0;
      items.push({
        key: `q-${c[0]},${c[1]},${p.time}`,
        kind: '地震', icon: '📳',
        label: `M${p.mag.toFixed(1)} · ${p.place ?? '未知区域'}${p.tsunami ? ' · 🌊海啸' : ''}`,
        score: Math.round(p.mag * 11 + tsunami),
        coords: c,
        time: typeof p.time === 'number' ? new Date(p.time).toISOString() : '',
      });
    }
  }
  const pushEonet = (fc: FeatureCollection | undefined, kind: string, icon: string, base: number, prefix: string) => {
    if (fc?.type !== 'FeatureCollection') return;
    for (const f of fc.features) {
      const c = coordsOf(f);
      const p = (f.properties ?? {}) as { title?: string; date?: string };
      if (!c) continue;
      items.push({
        key: `${prefix}-${c[0]},${c[1]}`,
        kind, icon,
        label: p.title ?? kind,
        score: base,
        coords: c,
        time: p.date ? new Date(p.date).toISOString() : '',
      });
    }
  };
  pushEonet(storms, '风暴', '🌪️', 58, 's');
  pushEonet(volcanoes, '火山', '🌋', 52, 'v');
  pushEonet(floods, '洪水', '🌊', 46, 'f');

  items.sort((a, b) => b.score - a.score);
  const top = items.slice(0, 12);

  // 自动态势简报（确定性合成自真实聚合数据，不编造）
  const count = (k: string) => items.filter((i) => i.kind === k).length;
  const strongQuake = items.filter((i) => i.kind === '地震').sort((a, b) => b.score - a.score)[0];
  const briefParts: string[] = [];
  if (strongQuake) briefParts.push(`最强 ${strongQuake.label.split(' · ')[0]} 地震`);
  const cs = count('风暴'), cv = count('火山'), cf = count('洪水');
  if (cs) briefParts.push(`${cs} 个活跃风暴`);
  if (cv) briefParts.push(`${cv} 处活跃火山`);
  if (cf) briefParts.push(`${cf} 处洪水`);
  const summary = briefParts.length ? `当前全球：${briefParts.join('、')}。` : '';

  const focus = (a: Anomaly) => {
    setViewport(a.coords, Math.max(useMapStore.getState().zoom, 3.5));
    const detail: EventDetail = {
      id: a.key,
      title: `${a.icon} ${a.kind} · ${a.label}`,
      source: a.kind === '地震' ? 'USGS 地震灾害项目（近实时）' : 'NASA EONET（近实时）',
      timestamp: a.time,
      location: a.coords,
      impact_level: a.score >= 70 ? 'high' : a.score >= 55 ? 'medium' : 'low',
      category: 'natural',
      description: `${a.kind}事件 · 显著度 ${a.score}`,
    };
    selectEvent(detail);
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
        <div className="text-[10px] text-dashboard-neutral/50">跨层聚合 · 按显著度排序 · 点击定位（地震 M≥4.5）</div>
        {top.length === 0 ? (
          <div className="py-2 text-center text-dashboard-neutral/45">暂无显著异常 / 数据加载中</div>
        ) : (
          <div className="max-h-[42vh] space-y-1 overflow-y-auto pr-0.5">
            {top.map((a) => (
              <button
                key={a.key}
                type="button"
                onClick={() => focus(a)}
                className="flex w-full items-center gap-2 rounded-md bg-white/5 px-2 py-1.5 text-left transition-colors hover:bg-white/10 active:scale-[0.99]"
              >
                <span aria-hidden className="shrink-0 text-sm">{a.icon}</span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-dashboard-neutral/85">{a.label}</span>
                  <span className="text-[9px] text-dashboard-neutral/45">{a.kind}{a.time ? ` · ${timeAgo(a.time)}` : ''}</span>
                </span>
                <span className={`shrink-0 tabular-nums text-[10px] font-semibold ${severityClass(a.score)}`}>{a.score}</span>
              </button>
            ))}
          </div>
        )}
        <div className="border-t border-dashboard-neutral/10 pt-1 text-[9px] text-dashboard-neutral/40">源：USGS · NASA EONET · 真实数据·中立并陈</div>
      </div>
    </DockPanel>
  );
}
