'use client';

/**
 * 区域人物面板 — LIFEOS-005（全区域通用）
 * 领域筛选 + 人物卡(状态着色) + 展开看简介与关联行动。
 */

import { useCallback, useMemo, useState } from 'react';
import { useRegionData } from '@/hooks/useRegionData';
import { useMapStore } from '@/store/useMapStore';
import { DockPanel } from '@/components/region/DockPanel';
import { PersonAvatar } from '@/components/person/PersonAvatar';
import { EMPTY_REGION_MESSAGE } from '@/lib/region/contentFilter';
import { MIDEAST_FACTION_LABEL } from '@/regions/middleeast.factions';
import type { Person, PersonDomain } from '@/types/person';
import type { MideastFaction } from '@/regions/middleeast.factions';
import type { EventDetail } from '@/types/geo';

interface PersonsPanelProps {
  className?: string;
}

const STATUS_LABEL: Record<string, string> = {
  active: '活跃',
  restricted: '受限',
  deceased: '已故',
};
const STATUS_COLOR: Record<string, string> = {
  active: '#22c55e',
  restricted: '#f59e0b',
  deceased: '#94a3b8',
};
const DOMAIN_COLOR: Record<PersonDomain, string> = {
  政治: '#3b82f6',
  经济: '#22c55e',
  社会: '#f59e0b',
  文化: '#a855f7',
  军事: '#ef4444',
};

type DomainFilter = 'all' | PersonDomain;
type FactionFilter = 'all' | MideastFaction;

export function PersonsPanel({ className = '' }: PersonsPanelProps) {
  const { persons, regionId } = useRegionData();
  const setViewport = useMapStore((s) => s.setViewport);
  const selectEvent = useMapStore((s) => s.selectEvent);
  const [domainFilter, setDomainFilter] = useState<DomainFilter>('all');
  const [factionFilter, setFactionFilter] = useState<FactionFilter>('all');
  const [openId, setOpenId] = useState<string | null>(null);

  const hasFactions = regionId === 'middleeast';

  /** 人物-地图联动：飞行至驻地坐标并选中（与地图人物层共享选中事件） */
  const locateOnMap = useCallback(
    (p: Person) => {
      setViewport([p.lng, p.lat], 5);
      const detail: EventDetail = {
        id: `person-${p.id}`,
        title: p.name,
        source: '公开人物档案 · 中立表述',
        timestamp: new Date().toISOString(),
        location: [p.lng, p.lat],
        impact_level: 'medium',
        category: 'persons',
        description: `${p.domain} · ${p.role} — ${p.bio}`,
      };
      selectEvent(detail);
    },
    [setViewport, selectEvent],
  );

  const list = useMemo(() => {
    return (persons ?? []).filter((p) => {
      if (domainFilter !== 'all' && p.domain !== domainFilter) return false;
      if (hasFactions && factionFilter !== 'all' && p.faction !== factionFilter) return false;
      return true;
    });
  }, [persons, domainFilter, factionFilter, hasFactions]);

  if (!persons || persons.length === 0) return null;

  const domainFilters: DomainFilter[] = ['all', '政治', '经济', '社会', '文化', '军事'];
  const filterChips = (
    <div className="flex flex-wrap gap-1 text-[10px] max-w-[12rem] justify-end">
      {domainFilters.map((f) => (
        <button
          key={f}
          type="button"
          onClick={() => setDomainFilter(f)}
          className={`px-1.5 py-0.5 rounded ${domainFilter === f ? 'bg-white/15 text-white' : 'text-dashboard-neutral'}`}
        >
          {f === 'all' ? '全部' : f}
        </button>
      ))}
      {hasFactions && (
        <>
          <span className="w-full" />
          {(['all', 'iran', 'israel', 'us'] as FactionFilter[]).map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFactionFilter(f)}
              className={`px-1.5 py-0.5 rounded ${factionFilter === f ? 'bg-white/15 text-white' : 'text-dashboard-neutral'}`}
            >
              {f === 'all' ? '全阵营' : MIDEAST_FACTION_LABEL[f]}
            </button>
          ))}
        </>
      )}
    </div>
  );

  return (
    <DockPanel
      id="persons"
      title="人物"
      count={list.length}
      headerRight={filterChips}
      className={`w-72 max-h-[60vh] ${className}`}
    >
      <ul className="space-y-1.5">
        {list.length === 0 ? (
          <li className="text-[11px] text-dashboard-neutral/60 py-2">
            {EMPTY_REGION_MESSAGE}
          </li>
        ) : (
          list.map((p) => {
          const open = openId === p.id;
          return (
            <li key={p.id} className="rounded-md border border-dashboard-neutral/15">
              <button
                type="button"
                onClick={() => {
                  const next = open ? null : p.id;
                  setOpenId(next);
                  if (next) locateOnMap(p);
                }}
                title="点击定位至地图"
                className="w-full flex items-center gap-2 px-2.5 py-1.5 text-left hover:bg-white/5"
              >
                <PersonAvatar person={p} size={24} />
                <span className="flex-1 min-w-0">
                  <span className="text-xs text-white">{p.name}</span>
                  <span className="block text-[10px] text-dashboard-neutral truncate">{p.role}</span>
                </span>
                <span
                  className="text-[10px] shrink-0 px-1 rounded"
                  style={{ color: DOMAIN_COLOR[p.domain], backgroundColor: `${DOMAIN_COLOR[p.domain]}22` }}
                >
                  {p.domain}
                </span>
                {p.status && (
                  <span
                    className="text-[10px] shrink-0"
                    style={{ color: STATUS_COLOR[p.status] }}
                  >
                    {STATUS_LABEL[p.status] ?? p.status}
                  </span>
                )}
              </button>

              {open && (
                <div className="px-2.5 pb-2 space-y-1.5">
                  <div className="flex items-center gap-2">
                    <PersonAvatar person={p} size={36} />
                    <div className="min-w-0 flex-1">
                      <div className="text-xs text-white">{p.name}</div>
                      {p.nameEn && (
                        <div className="text-[10px] text-dashboard-neutral/60 truncate">{p.nameEn}</div>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => locateOnMap(p)}
                      title="定位至地图"
                      className="shrink-0 rounded px-1.5 py-0.5 text-[10px] text-dashboard-neutral hover:bg-white/10 hover:text-white"
                    >
                      📍 定位
                    </button>
                  </div>
                  <div className="text-[11px] text-dashboard-neutral/85 leading-snug">{p.bio}</div>
                  {p.since && (
                    <div className="text-[10px] text-dashboard-neutral/60">相关年份：{p.since}</div>
                  )}
                  {(p.actions?.length ?? 0) > 0 && (
                    <div className="space-y-1">
                      {p.actions!.map((a, i) => (
                        <div key={i} className="text-[10px] leading-snug">
                          <span className="text-white">{a.codeName}</span>
                          <span className="text-dashboard-neutral/60 ml-1">{a.date}</span>
                          <div className="text-dashboard-neutral/80">{a.description}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </li>
          );
        })
        )}
      </ul>

      <div className="text-[10px] text-dashboard-neutral/60 pt-2 mt-1 border-t border-dashboard-neutral/10">
        公开人物档案 · 中立表述 · 坐标为代表性驻地
      </div>
    </DockPanel>
  );
}
