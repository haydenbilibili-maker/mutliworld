'use client';

import { useState } from 'react';
import { useGeodataContext } from '@/context/GeodataContext';
import { useMapStore } from '@/store/useMapStore';
import type { GeoJSONFeature, ImpactLevel } from '@/types/geo';

const IMPACT_COLOR: Record<ImpactLevel, string> = {
  critical: 'text-red-400',
  high: 'text-orange-400',
  medium: 'text-yellow-400',
  low: 'text-blue-400',
};

const IMPACT_DOT: Record<ImpactLevel, string> = {
  critical: 'bg-red-400',
  high: 'bg-orange-400',
  medium: 'bg-yellow-400',
  low: 'bg-blue-400',
};

const LAYER_LABEL: Record<string, string> = {
  conflicts: '冲突',
  military: '军事',
  hotspots: '热点',
  economic: '经济',
  waterways: '航运',
  natural: '自然',
  weather: '气象',
  bases: '基地',
  nuclear: '核',
  sanctions: '制裁',
  outages: '中断',
  aviation: '航空',
  maritime: '海运',
  cables: '海缆',
  econ_hubs: '经济中心',
  minerals: '矿产',
  daynight: '晨昏线',
  pipelines: '管线',
  datacenters: '数据中心',
  protests: '抗议',
  climate: '气候',
  launch_sites: '发射场',
  launch_log: '发射',
};

function formatTimestamp(iso: string): string {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso.slice(0, 10);
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  const HH = String(d.getHours()).padStart(2, '0');
  const MM = String(d.getMinutes()).padStart(2, '0');
  return `${mm}-${dd} ${HH}:${MM}`;
}

function toImpact(raw: string): ImpactLevel {
  if (raw === 'critical' || raw === 'high' || raw === 'medium' || raw === 'low') {
    return raw;
  }
  return 'medium';
}

interface LiveEventFeedProps {
  className?: string;
  /** 最多显示条数，默认 12 */
  maxItems?: number;
}

/**
 * 实时事件列表：消费 GeodataProvider 的同一份 /api/geodata 数据，
 * 按时间倒序列出，点击跳转地图 + 打开 SidePanel。
 */
export function LiveEventFeed({ className = '', maxItems = 12 }: LiveEventFeedProps) {
  const { data, isLoading, isValidating, error } = useGeodataContext();
  const { selectEvent, setCenter, setZoom } = useMapStore();
  const [collapsed, setCollapsed] = useState(true);

  const items = [...(data?.features ?? [])]
    .sort((a, b) => {
      const ta = new Date(String(a.properties?.timestamp ?? '')).getTime() || 0;
      const tb = new Date(String(b.properties?.timestamp ?? '')).getTime() || 0;
      return tb - ta;
    })
    .slice(0, maxItems);

  const handleClick = (f: GeoJSONFeature) => {
    const p = f.properties ?? {};
    const lng = Number(p.lng ?? 0);
    const lat = Number(p.lat ?? 0);
    const impact = toImpact(String(p.impact ?? ''));
    selectEvent({
      id: String(p.id ?? ''),
      title: String(p.title ?? ''),
      source: String(p.source ?? ''),
      timestamp: String(p.timestamp ?? ''),
      location: [lng, lat],
      impact_level: impact,
      category: String(p.category ?? p.layerId ?? ''),
      description: String(p.description ?? ''),
    });
    setCenter([lng, lat]);
    setZoom(5);
  };

  return (
    <div
      className={`rounded-lg bg-dashboard-bg/90 border border-dashboard-neutral/20 text-sm overflow-hidden ${className}`}
    >
      {/* 标题栏 */}
      <div
        className="flex cursor-pointer select-none items-center justify-between border-b border-dashboard-neutral/10 px-3 py-2"
        onClick={() => setCollapsed((c) => !c)}
        role="button"
        tabIndex={0}
        aria-expanded={!collapsed}
        aria-label="实时事件流"
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setCollapsed((c) => !c);
          }
        }}
      >
        <span className="text-sm font-medium text-white">
          实时事件流
          {isValidating && !isLoading && (
            <span className="ml-2 text-xs text-dashboard-neutral/50">刷新中…</span>
          )}
        </span>
        <span className="text-dashboard-neutral/50 text-xs">
          {collapsed ? '展开' : `共 ${data?.meta?.featureCount ?? 0} 条`}
        </span>
      </div>

      {!collapsed && (
        <div className="max-h-72 overflow-y-auto divide-y divide-dashboard-neutral/10">
          {error ? (
            <div className="px-3 py-3 text-dashboard-conflict/80">事件数据暂不可用</div>
          ) : isLoading ? (
            <div className="px-3 py-3 text-dashboard-neutral/50">加载中…</div>
          ) : items.length === 0 ? (
            <div className="px-3 py-3 text-dashboard-neutral/50">
              当前时间范围内无事件
            </div>
          ) : null}
          {!error &&
            !isLoading &&
            items.map((f) => {
            const p = f.properties ?? {};
            const impact = toImpact(String(p.impact ?? ''));
            const layerId = String(p.layerId ?? '');
            const title = String(p.title ?? '');
            const ts = String(p.timestamp ?? '');
            const markerEmoji = String(p.markerEmoji ?? '');
            return (
              <button
                key={String(p.id ?? Math.random())}
                type="button"
                onClick={() => handleClick(f)}
                className="w-full text-left px-3 py-2 hover:bg-white/5 transition-colors flex gap-2 items-start"
              >
                {markerEmoji ? (
                  <span className="mt-0.5 flex-shrink-0 text-base leading-none" aria-hidden>
                    {markerEmoji}
                  </span>
                ) : (
                  <span
                    className={`mt-1.5 flex-shrink-0 w-1.5 h-1.5 rounded-full ${IMPACT_DOT[impact]}`}
                  />
                )}
                <div className="min-w-0 flex-1">
                  <div className="truncate text-dashboard-neutral leading-snug">{title}</div>
                  <div className="flex gap-2 mt-0.5">
                    {layerId && (
                      <span className="text-dashboard-neutral/50">
                        {LAYER_LABEL[layerId] ?? layerId}
                      </span>
                    )}
                    <span className={`${IMPACT_COLOR[impact]}`}>
                      {impact === 'critical'
                        ? '严重'
                        : impact === 'high'
                        ? '高'
                        : impact === 'medium'
                        ? '中'
                        : '低'}
                    </span>
                    {ts && (
                      <span className="text-dashboard-neutral/40">{formatTimestamp(ts)}</span>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
