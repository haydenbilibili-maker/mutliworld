'use client';

/**
 * 天体探索概览 — 多天体探索 Phase 4（新增模块）
 * 关键统计 + 真实里程碑/首次（中立并陈各国成果）。仅真实档案。
 */

import { useMemo, useState } from 'react';
import { useMapStore } from '@/store/useMapStore';
import { getSitesForBody } from '@/bodies/sites';
import { orbitersForBody } from '@/bodies/orbiters';
import { getBody } from '@/bodies';
import type { CelestialBody } from '@/types/body';

interface Milestone {
  year: string;
  label: string;
  agency: string;
}

const MILESTONES: Record<CelestialBody, Milestone[]> = {
  earth: [],
  moon: [
    { year: '1966', label: '首次月球软着陆（月球 9 号）', agency: 'USSR' },
    { year: '1969', label: '首次载人登月（阿波罗 11 号）', agency: 'NASA' },
    { year: '1970', label: '首次机器人采样返回（月球 16 号）', agency: 'USSR' },
    { year: '2019', label: '首次月球背面软着陆（嫦娥四号）', agency: 'CNSA' },
    { year: '2023', label: '首次近月球南极着陆（月船 3 号）', agency: 'ISRO' },
    { year: '2024', label: '首个商业航天器月球软着陆（奥德修斯 IM-1）', agency: 'NASA' },
    { year: '2024', label: '首次月球背面采样返回（嫦娥六号）', agency: 'CNSA' },
  ],
  mars: [
    { year: '1976', label: '首次成功火星表面任务（海盗 1 号）', agency: 'NASA' },
    { year: '1997', label: '首辆火星巡视器（旅居者号）', agency: 'NASA' },
    { year: '2008', label: '首次就地确认火星水冰（凤凰号）', agency: 'NASA' },
    { year: '2021', label: '中国首次火星着陆与巡视（天问一号/祝融号）', agency: 'CNSA' },
    { year: '2021', label: '采集样本待取回、首架地外动力飞行（毅力号/机智号）', agency: 'NASA' },
  ],
};

const AGENCY_COLOR: Record<string, string> = { NASA: '#60a5fa', CNSA: '#f87171', ISRO: '#fb923c', JAXA: '#f4d08a', ESA: '#a78bfa', USSR: '#94a3b8' };

interface BodyOverviewPanelProps {
  className?: string;
}

export function BodyOverviewPanel({ className = '' }: BodyOverviewPanelProps) {
  const activeBody = useMapStore((s) => s.activeBody);
  const [collapsed, setCollapsed] = useState(false);
  const mod = getBody(activeBody);

  const stats = useMemo(() => {
    const sites = getSitesForBody(activeBody);
    const inService = sites.filter((s) => s.status === 'active').length;
    const agencies = new Set(sites.map((s) => Object.keys(AGENCY_COLOR).find((k) => s.agency.includes(k)) ?? s.agency)).size;
    const orbiters = orbitersForBody(activeBody).length;
    return { traces: sites.length, inService, agencies, orbiters };
  }, [activeBody]);

  if (activeBody === 'earth' || !mod) return null;
  const milestones = MILESTONES[activeBody] ?? [];

  return (
    <div className={`overflow-hidden rounded-lg border border-brand-cyan/20 bg-dashboard-bg/90 shadow-xl backdrop-blur-md ${className}`}>
      <button type="button" onClick={() => setCollapsed((c) => !c)} className="flex w-full items-center gap-2 border-b border-dashboard-neutral/10 px-3 py-2 text-left">
        <span aria-hidden>🧭</span>
        <span className="flex-1 text-sm font-medium text-white">{mod.name} · 探索概览</span>
        <span className="text-xs text-dashboard-neutral/50">{collapsed ? '展开' : '收起'}</span>
      </button>

      {!collapsed && (
        <div className="p-3">
          <div className="grid grid-cols-4 gap-1.5">
            {[
              { k: '痕迹', v: stats.traces },
              { k: '在役', v: stats.inService },
              { k: '机构', v: stats.agencies },
              { k: '在轨', v: stats.orbiters },
            ].map((s) => (
              <div key={s.k} className="rounded-md bg-white/5 px-2 py-1.5 text-center">
                <div className="text-sm font-semibold tabular-nums text-white">{s.v}</div>
                <div className="text-[10px] text-dashboard-neutral/50">{s.k}</div>
              </div>
            ))}
          </div>

          <div className="mt-3">
            <div className="mb-1.5 text-[10px] uppercase tracking-wide text-dashboard-neutral/40">里程碑 · 首次</div>
            <ul className="space-y-1.5">
              {milestones.map((m, i) => (
                <li key={i} className="flex gap-2 text-[11px] leading-snug">
                  <span className="w-9 shrink-0 tabular-nums text-dashboard-neutral/50">{m.year}</span>
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full" style={{ backgroundColor: AGENCY_COLOR[m.agency] ?? '#94a3b8' }} />
                  <span className="text-dashboard-neutral/85">{m.label}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-2 border-t border-dashboard-neutral/10 pt-2 text-[10px] text-dashboard-neutral/45">
            真实任务档案 · 中立并陈各国成果
          </div>
        </div>
      )}
    </div>
  );
}
