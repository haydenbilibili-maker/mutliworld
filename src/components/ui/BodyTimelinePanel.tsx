'use client';

/**
 * 天体任务时间轴 — 多天体探索 Phase 4
 * 按时间顺序列出当前天体全部真实探索痕迹；点击飞行定位至该点（地图联动）。
 * 含机构分布概览。仅展示真实档案数据。
 */

import { useMemo, useState } from 'react';
import { useMapStore } from '@/store/useMapStore';
import { useBodyStore } from '@/store/useBodyStore';
import { getSitesForBody } from '@/bodies/sites';
import { getBody } from '@/bodies';
import type { BodySite } from '@/types/body';

const AGENCY_COLOR: Record<string, string> = {
  NASA: '#60a5fa',
  CNSA: '#f87171',
  ISRO: '#fb923c',
  JAXA: '#f4d08a',
  ESA: '#a78bfa',
  USSR: '#94a3b8',
};

const STATUS_LABEL: Record<string, string> = { active: '在役', completed: '已完成', lost: '失联' };
const STATUS_COLOR: Record<string, string> = { active: '#22c55e', completed: '#94a3b8', lost: '#f59e0b' };

function agencyColor(a: string): string {
  const key = Object.keys(AGENCY_COLOR).find((k) => a.includes(k));
  return key ? AGENCY_COLOR[key] : '#94a3b8';
}

interface BodyTimelinePanelProps {
  className?: string;
}

export function BodyTimelinePanel({ className = '' }: BodyTimelinePanelProps) {
  const activeBody = useMapStore((s) => s.activeBody);
  const setViewport = useMapStore((s) => s.setViewport);
  const activeBodyLayers = useBodyStore((s) => s.activeBodyLayers);
  const [collapsed, setCollapsed] = useState(false);

  const mod = getBody(activeBody);

  const sites = useMemo(() => {
    return getSitesForBody(activeBody)
      .filter((s) => activeBodyLayers.includes(s.layer))
      .sort((a, b) => a.date.localeCompare(b.date));
  }, [activeBody, activeBodyLayers]);

  const agencyCounts = useMemo(() => {
    const m = new Map<string, number>();
    for (const s of sites) {
      const key = Object.keys(AGENCY_COLOR).find((k) => s.agency.includes(k)) ?? s.agency;
      m.set(key, (m.get(key) ?? 0) + 1);
    }
    return Array.from(m.entries()).sort((a, b) => b[1] - a[1]);
  }, [sites]);

  if (activeBody === 'earth' || !mod || sites.length === 0) return null;

  const locate = (s: BodySite) => setViewport([s.lng, s.lat], 5);

  return (
    <div className={`overflow-hidden rounded-lg border border-brand-gold/20 bg-dashboard-bg/90 shadow-xl backdrop-blur-md ${className}`}>
      <button
        type="button"
        onClick={() => setCollapsed((c) => !c)}
        className="flex w-full items-center gap-2 border-b border-dashboard-neutral/10 px-3 py-2 text-left"
      >
        <span aria-hidden>{mod.icon}</span>
        <span className="flex-1 text-sm font-medium text-white">{mod.name} · 任务时间轴</span>
        <span className="text-xs text-dashboard-neutral/60">{sites.length}</span>
        <span className="text-xs text-dashboard-neutral/50">{collapsed ? '展开' : '收起'}</span>
      </button>

      {!collapsed && (
        <>
          <div className="flex flex-wrap gap-1.5 border-b border-dashboard-neutral/10 px-3 py-2">
            {agencyCounts.map(([a, n]) => (
              <span key={a} className="flex items-center gap-1 text-[10px] text-dashboard-neutral/80">
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: agencyColor(a) }} />
                {a} {n}
              </span>
            ))}
          </div>

          <ul className="max-h-[60vh] divide-y divide-dashboard-neutral/8 overflow-y-auto">
            {sites.map((s) => (
              <li key={s.id}>
                <button
                  type="button"
                  onClick={() => locate(s)}
                  title="点击定位至地图"
                  className="flex w-full items-center gap-2 px-3 py-1.5 text-left hover:bg-white/5"
                >
                  <span className="w-16 shrink-0 text-[10px] tabular-nums text-dashboard-neutral/55">{s.date}</span>
                  <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: agencyColor(s.agency) }} />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-xs text-white">{s.name}</span>
                    <span className="block truncate text-[10px] text-dashboard-neutral/55">{s.agency} · {s.nameEn ?? ''}</span>
                  </span>
                  <span className="shrink-0 text-[10px]" style={{ color: STATUS_COLOR[s.status] }}>
                    {STATUS_LABEL[s.status]}
                  </span>
                </button>
              </li>
            ))}
          </ul>

          <div className="border-t border-dashboard-neutral/10 px-3 py-1.5 text-[10px] text-dashboard-neutral/45">
            真实任务档案 · 点击条目飞行定位 · 中立并陈
          </div>
        </>
      )}
    </div>
  );
}
