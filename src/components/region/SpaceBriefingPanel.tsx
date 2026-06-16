'use client';

/**
 * 宇宙空间简报 — 三位一体 Phase 2 收尾
 * 仅在 🛰 宇宙空间层（space tier）显示；从宇宙各数据集结构化合成态势摘要。
 * 诚实合成、不编造；空天事件带真实日期与出处，ASAT 等敏感条目随「敏感图层下架」一键隐藏。
 */

import { useMemo } from 'react';
import { useMapStore } from '@/store/useMapStore';
import { GLOBAL_LAUNCH_SITES } from '@/regions/global.launchSites';
import { GLOBAL_LAUNCH_LOG } from '@/regions/global.launchLog';
import { GLOBAL_GROUND_STATIONS } from '@/regions/global.groundStations';
import { GLOBAL_SATELLITES } from '@/regions/global.satellites';
import { GLOBAL_SPACE_EVENTS } from '@/regions/global.spaceEvents';
import type { EventDetail } from '@/types/geo';

interface SpaceBriefingPanelProps {
  className?: string;
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-md bg-white/5 px-2 py-1.5 text-center">
      <div className="text-sm font-semibold tabular-nums text-white">{value}</div>
      <div className="text-[10px] text-dashboard-neutral/50">{label}</div>
    </div>
  );
}

const EVENT_EMOJI: Record<string, string> = {
  asat: '🎯',
  collision: '💥',
  breakup: '🌌',
  reentry: '☄️',
  closeapproach: '⚠️',
};

export function SpaceBriefingPanel({ className = '' }: SpaceBriefingPanelProps) {
  const activeTier = useMapStore((s) => s.activeTier);
  const hideSensitive = useMapStore((s) => s.hideSensitive);
  const setCenter = useMapStore((s) => s.setCenter);
  const setZoom = useMapStore((s) => s.setZoom);
  const selectEvent = useMapStore((s) => s.selectEvent);

  const satByKind = useMemo(() => {
    let weather = 0;
    let comms = 0;
    let navigation = 0;
    for (const s of GLOBAL_SATELLITES) {
      if (s.kind === 'weather') weather += 1;
      else if (s.kind === 'comms') comms += 1;
      else if (s.kind === 'navigation') navigation += 1;
    }
    return { weather, comms, navigation };
  }, []);

  const recentEvents = useMemo(
    () =>
      [...GLOBAL_SPACE_EVENTS]
        .sort((a, b) => b.date.localeCompare(a.date))
        .slice(0, 3),
    [],
  );

  if (activeTier !== 'space') return null;

  const flyTo = (id: string, name: string, lng: number, lat: number, desc: string) => {
    setCenter([lng, lat]);
    setZoom(4);
    const ev: EventDetail = {
      id,
      title: name,
      source: '',
      timestamp: '',
      location: [lng, lat],
      impact_level: 'high',
      category: 'space_events',
      description: desc,
    };
    selectEvent(ev);
  };

  return (
    <div
      className={`w-72 rounded-lg border border-sky-500/25 bg-dashboard-bg/95 shadow-xl backdrop-blur-md ${className}`}
    >
      <div className="flex items-center gap-2 border-b border-dashboard-neutral/10 px-3 py-2">
        <span className="text-base" aria-hidden>🛰</span>
        <div className="text-sm font-medium text-white">宇宙空间 · 态势简报</div>
      </div>

      <div className="space-y-2.5 p-3">
        <div className="grid grid-cols-4 gap-1.5">
          <Stat label="发射场" value={GLOBAL_LAUNCH_SITES.length} />
          <Stat label="测控站" value={GLOBAL_GROUND_STATIONS.length} />
          <Stat label="GEO星" value={GLOBAL_SATELLITES.length} />
          <Stat label="发射记录" value={GLOBAL_LAUNCH_LOG.length} />
        </div>

        <div className="text-[11px] text-dashboard-neutral/70">
          GEO 卫星：🌦️气象 {satByKind.weather} · 📶通信 {satByKind.comms} · 🧭导航{' '}
          {satByKind.navigation}
        </div>

        <div>
          <div className="mb-1 flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-wide text-dashboard-neutral/40">
              近期空天事件
            </span>
            {hideSensitive && (
              <span className="text-[9px] text-rose-300/70">敏感已下架</span>
            )}
          </div>
          {hideSensitive ? (
            <div className="text-[11px] text-dashboard-neutral/45">
              含反卫星(ASAT)等敏感条目，已随「敏感图层下架」隐藏
            </div>
          ) : (
            <ul className="space-y-1">
              {recentEvents.map((e) => (
                <li key={e.id}>
                  <button
                    type="button"
                    onClick={() => flyTo(e.id, e.name, e.lng, e.lat, `${e.date.slice(0, 10)} · ${e.note}`)}
                    className="flex w-full items-start gap-1.5 rounded px-1 py-0.5 text-left hover:bg-white/5"
                  >
                    <span className="mt-0.5 text-[10px]" aria-hidden>
                      {EVENT_EMOJI[e.kind] ?? '💫'}
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate text-[11px] leading-tight text-dashboard-neutral hover:text-white">
                        {e.name}
                      </span>
                      <span className="block text-[10px] text-dashboard-neutral/45">
                        {e.date.slice(0, 10)}
                      </span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="text-[9px] text-dashboard-neutral/30">
          结构化合成 · 非编造 · 发射场/测控/卫星为公开资料示意，空天事件带日期来源
        </div>
      </div>
    </div>
  );
}
