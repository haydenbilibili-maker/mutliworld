'use client';

/**
 * 区域简报面板 — 对标 World Monitor「AI 国家简报」（Round 1）
 *
 * 从区域结构化数据集**规则化合成**一份态势简报：概览计数 + 军力要点 + 近期动态 + 外交立场。
 * 诚实合成、不编造（与 WM 的 LLM 简报不同，此处为确定性聚合）。区域无关，8 区域通用。
 */

import { useCallback, useMemo, useState } from 'react';
import { useMapStore } from '@/store/useMapStore';
import { useRegionData } from '@/hooks/useRegionData';
import { getRegion } from '@/regions';
import { DockPanel } from '@/components/region/DockPanel';

type AiState = 'idle' | 'loading' | 'done' | 'no_key' | 'error';

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
      social: data.situation?.length ?? data.social?.length ?? 0,
      persons: data.persons?.length ?? 0,
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

  const [aiState, setAiState] = useState<AiState>('idle');
  const [aiText, setAiText] = useState('');

  const generateAi = useCallback(async () => {
    setAiState('loading');
    setAiText('');
    try {
      const situation = (data.situation ?? [])
        .map((s) => (typeof s === 'string' ? s : (s as { title?: string; summary?: string }).title ?? (s as { summary?: string }).summary ?? ''))
        .filter(Boolean)
        .slice(0, 8);
      const recentPayload = [...(data.events ?? [])]
        .filter((e) => e.timestamp)
        .sort((a, b) => b.timestamp.localeCompare(a.timestamp))
        .slice(0, 8)
        .map((e) => ({ title: e.title, source: e.source, timestamp: e.timestamp }));
      const res = await fetch('/api/briefing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ regionName: mod?.name, stats, recent: recentPayload, situation }),
      });
      const json = await res.json();
      if (json.degraded === 'no_key') { setAiState('no_key'); return; }
      if (!json.briefing) { setAiState('error'); return; }
      setAiText(json.briefing);
      setAiState('done');
    } catch {
      setAiState('error');
    }
  }, [data, mod, stats]);

  const total =
    stats.events +
    stats.military +
    stats.diplomacy +
    stats.social +
    stats.persons +
    stats.facilities +
    stats.incidents;
  if (total === 0 || region === 'china' || region === 'north_america') return null;

  const coverage: [string, number][] = [
    ['事件', stats.events],
    ['军力', stats.military],
    ['外交', stats.diplomacy],
    ['区域态势', stats.social],
    ['人物', stats.persons],
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

        {/* AI 简报（按需生成 · 仅基于本区域真实数据 · 保留来源） */}
        <div className="rounded-md border border-brand-cyan/20 bg-brand-cyan/[0.04] p-2">
          <div className="mb-1 flex items-center gap-2">
            <span className="text-[10px] font-medium text-brand-cyan">✨ AI 态势简报</span>
            <button
              type="button"
              onClick={generateAi}
              disabled={aiState === 'loading'}
              className="ml-auto rounded px-1.5 py-0.5 text-[10px] text-brand-cyan transition-colors hover:bg-brand-cyan/15 disabled:opacity-50"
            >
              {aiState === 'loading' ? '生成中…' : aiState === 'done' ? '重新生成' : '生成'}
            </button>
          </div>
          {aiState === 'done' && (
            <p className="text-[11px] leading-relaxed text-dashboard-neutral/90">{aiText}</p>
          )}
          {aiState === 'no_key' && (
            <p className="text-[10px] leading-snug text-amber-300/80">未配置 LLM（设 LLM_API_KEY 即可启用）；当前展示下方规则化简报。</p>
          )}
          {aiState === 'error' && (
            <p className="text-[10px] text-dashboard-conflict/80">生成失败，请稍后重试。</p>
          )}
          {aiState === 'idle' && (
            <p className="text-[10px] leading-snug text-dashboard-neutral/55">基于本区域真实监测数据合成、保留来源、不编造。点击「生成」。</p>
          )}
          {aiState === 'done' && (
            <div className="mt-1.5 text-[9px] text-dashboard-neutral/45">来源见下方「近期动态」· AI 合成仅供研判</div>
          )}
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
