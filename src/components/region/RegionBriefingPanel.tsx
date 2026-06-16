'use client';

/**
 * 区域简报面板 — 对标 World Monitor「AI 国家简报」（Round 1）
 *
 * 从区域结构化数据集**规则化合成**一份态势简报：概览计数 + 军力要点 + 近期动态 + 外交立场。
 * 诚实合成、不编造（与 WM 的 LLM 简报不同，此处为确定性聚合）。区域无关，8 区域通用。
 */

import { useMemo } from 'react';
import { useMapStore } from '@/store/useMapStore';
import { useRegionData } from '@/hooks/useRegionData';
import { getRegion } from '@/regions';
import { DockPanel } from '@/components/region/DockPanel';

interface RegionBriefingPanelProps {
  className?: string;
}

const SIDE_LABEL: Record<string, string> = {
  iran: '伊朗',
  us_israel: '美以',
  ru: '俄',
  ua: '乌',
  nato: '北约',
  eu: '欧盟',
};

export function RegionBriefingPanel({ className = '' }: RegionBriefingPanelProps) {
  const region = useMapStore((s) => s.activeRegion);
  const data = useRegionData();
  const mod = getRegion(region);

  const stats = useMemo(
    () => ({
      events: data.events?.length ?? 0,
      military: data.military?.length ?? 0,
      diplomacy: data.diplomacy?.length ?? 0,
      social: data.social?.length ?? 0,
      targets: data.targets?.length ?? 0,
      facilities: data.facilities?.length ?? 0,
      incidents: data.incidents?.length ?? 0,
    }),
    [data],
  );

  const recent = useMemo(
    () =>
      [...(data.events ?? [])]
        .filter((e) => e.timestamp)
        .sort((a, b) => b.timestamp.localeCompare(a.timestamp))
        .slice(0, 3),
    [data],
  );

  const total =
    stats.events +
    stats.military +
    stats.diplomacy +
    stats.social +
    stats.targets +
    stats.facilities +
    stats.incidents;
  if (total === 0 || region === 'china') return null;

  const coverage: [string, number][] = [
    ['事件', stats.events],
    ['军力', stats.military],
    ['外交', stats.diplomacy],
    ['社媒', stats.social],
    ['目标', stats.targets],
    ['设施', stats.facilities],
  ];

  return (
    <DockPanel
      id="briefing"
      title="区域简报"
      className={`w-80 max-h-[64vh] ${className}`}
    >
      <div className="space-y-3">
        {/* 定位 */}
        <div className="text-[11px] leading-snug text-dashboard-neutral/90">
          <span className="text-white font-medium">{mod?.name}</span> ·{' '}
          {mod?.viewpoint}
        </div>

        {/* 覆盖概览 */}
        <div>
          <div className="text-[10px] text-dashboard-neutral/70 mb-1">态势覆盖</div>
          <div className="flex flex-wrap gap-1.5">
            {coverage
              .filter(([, n]) => n > 0)
              .map(([k, n]) => (
                <span
                  key={k}
                  className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 border border-dashboard-neutral/15 text-dashboard-neutral"
                >
                  {k} <span className="text-white">{n}</span>
                </span>
              ))}
          </div>
        </div>

        {/* 军力要点 */}
        {data.military && data.military.length > 0 && (
          <div>
            <div className="text-[10px] text-dashboard-neutral/70 mb-1">军力要点</div>
            <ul className="space-y-1">
              {data.military.map((m) => (
                <li key={m.id} className="text-[11px] leading-snug">
                  <span className="text-white">
                    [{SIDE_LABEL[m.side] ?? m.side}] {m.title}
                  </span>
                  {m.items[0] && (
                    <span className="text-dashboard-neutral/70">
                      {' '}— {m.items[0].label}：{m.items[0].value}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* 近期动态 */}
        {recent.length > 0 && (
          <div>
            <div className="text-[10px] text-dashboard-neutral/70 mb-1">近期动态</div>
            <ul className="space-y-1">
              {recent.map((e) => (
                <li key={e.id} className="text-[11px] leading-snug">
                  <span className="text-dashboard-neutral/50">
                    {e.timestamp.slice(0, 10)}
                  </span>{' '}
                  <span className="text-dashboard-neutral/90">{e.title}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* 外交立场 */}
        {data.diplomacy && data.diplomacy.length > 0 && (
          <div>
            <div className="text-[10px] text-dashboard-neutral/70 mb-1">外交立场</div>
            <ul className="space-y-0.5">
              {data.diplomacy.map((a) => (
                <li key={a.id} className="text-[11px] leading-snug">
                  <span>{a.flag ?? '🏳️'}</span>{' '}
                  <span className="text-white">{a.name}</span>
                  <span className="text-dashboard-neutral/70">：{a.stanceLabel}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="text-[10px] text-dashboard-neutral/50 pt-1 border-t border-dashboard-neutral/10">
          结构化合成 · 来自本区域数据集（非 AI 编造）
        </div>
      </div>
    </DockPanel>
  );
}
