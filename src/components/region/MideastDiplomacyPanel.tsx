'use client';

/**
 * 中东外交反应面板 — LIFEOS-005（已纳入面板停靠系统）
 * 按区域分组的国家/组织立场 + 展开看反应记录。
 */

import { useState } from 'react';
import { useRegionData } from '@/hooks/useRegionData';
import { DockPanel } from '@/components/region/DockPanel';
import type { DiplomaticRegion } from '@/types/middleeast';

interface MideastDiplomacyPanelProps {
  className?: string;
}

const REGION_LABEL: Record<DiplomaticRegion, string> = {
  china_russia: '中国与俄罗斯',
  europe: '欧洲',
  middle_east_gulf: '中东与海湾',
  international_org: '国际组织',
  religious: '宗教势力',
  north_america: '美国 / 北美',
};

const REGION_ORDER: DiplomaticRegion[] = [
  'china_russia',
  'north_america',
  'europe',
  'middle_east_gulf',
  'international_org',
  'religious',
];

export function MideastDiplomacyPanel({
  className = '',
}: MideastDiplomacyPanelProps) {
  const { diplomacy } = useRegionData();
  const [openId, setOpenId] = useState<string | null>(null);

  if (!diplomacy || diplomacy.length === 0) return null;

  return (
    <DockPanel
      id="diplomacy"
      title="外交反应"
      count={diplomacy.length}
      className={`w-72 max-h-[60vh] ${className}`}
    >
      <div className="space-y-3">
        {REGION_ORDER.map((rg) => {
          const actors = diplomacy.filter((a) => a.region === rg);
          if (actors.length === 0) return null;
          return (
            <div key={rg} className="space-y-1">
              <div className="text-[10px] text-dashboard-neutral/70 uppercase tracking-wide">
                {REGION_LABEL[rg]}
              </div>
              {actors.map((a) => {
                const open = openId === a.id;
                return (
                  <div
                    key={a.id}
                    className="rounded-md border border-dashboard-neutral/15"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenId(open ? null : a.id)}
                      className="w-full flex items-center gap-2 px-2.5 py-1.5 text-left hover:bg-white/5"
                    >
                      <span className="text-sm">{a.flag ?? '🏳️'}</span>
                      <span className="flex-1 min-w-0">
                        <span className="text-xs text-white">{a.name}</span>
                        <span className="block text-[10px] text-dashboard-neutral truncate">
                          {a.stanceLabel}
                        </span>
                      </span>
                      <span className="text-dashboard-neutral text-xs shrink-0">
                        {open ? '−' : '+'}
                      </span>
                    </button>
                    {open && (
                      <div className="px-2.5 pb-2 space-y-1.5">
                        {a.reactions.map((r, i) => (
                          <div key={i} className="text-[10px] leading-snug">
                            <span className="text-dashboard-neutral/60">
                              {r.date}
                              {r.source ? ` · ${r.source}` : ''}
                            </span>
                            <div className="text-dashboard-neutral/85">
                              {r.statement}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          );
        })}

        <div className="text-[10px] text-dashboard-neutral/60 pt-1 border-t border-dashboard-neutral/10">
          数据迁自 Iran 中东大屏 · 公开表态
        </div>
      </div>
    </DockPanel>
  );
}
