'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useMapStore } from '@/store/useMapStore';
import { useLaunchLogStore } from '@/store/useLaunchLogStore';
import { useLaunchLog } from '@/hooks/useLaunchLog';
import { GLOBAL_LAUNCH_SITES } from '@/regions/global.launchSites';
import type { LaunchLogEntry, LaunchStatus } from '@/regions/global.launchLog';
import type { EventDetail } from '@/types/geo';

const STATUS_LABEL: Record<LaunchStatus, string> = {
  success: '成功',
  failure: '失败',
  partial: '部分成功',
  scheduled: '计划中',
  scrubbed: '推迟',
};

const STATUS_BADGE: Record<LaunchStatus, string> = {
  success: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
  failure: 'bg-red-500/20 text-red-300 border-red-500/40',
  partial: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
  scheduled: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
  scrubbed: 'bg-slate-500/20 text-slate-300 border-slate-500/40',
};

const SITE_NAME = new Map(GLOBAL_LAUNCH_SITES.map((s) => [s.id, s.name]));

function formatLaunchTime(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso.slice(0, 16);
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  const HH = String(d.getHours()).padStart(2, '0');
  const MM = String(d.getMinutes()).padStart(2, '0');
  return `${mm}-${dd} ${HH}:${MM}`;
}

function entryToEvent(e: LaunchLogEntry): EventDetail {
  const statusLabel = STATUS_LABEL[e.status];
  const parts = [e.provider, statusLabel];
  if (e.orbit) parts.push(e.orbit);
  if (e.payload) parts.push(e.payload);
  const description = parts.join(' · ') + (e.note ? ` — ${e.note}` : '');
  const impact =
    e.status === 'failure'
      ? 'critical'
      : e.status === 'partial'
        ? 'high'
        : e.status === 'scheduled'
          ? 'medium'
          : 'low';

  return {
    id: e.id,
    title: e.title,
    source: e.provider,
    timestamp: e.launchTime,
    location: [e.location.lng, e.location.lat],
    impact_level: impact,
    category: 'launch_log',
    description,
  };
}

interface LaunchLogPanelProps {
  className?: string;
}

/** 全球航天发射日志面板：近一年、按时间倒序，点击飞向发射点并打开侧栏 */
export function LaunchLogPanel({ className = '' }: LaunchLogPanelProps) {
  const open = useLaunchLogStore((s) => s.open);
  const setOpen = useLaunchLogStore((s) => s.setOpen);
  const selectEvent = useMapStore((s) => s.selectEvent);
  const setCenter = useMapStore((s) => s.setCenter);
  const setZoom = useMapStore((s) => s.setZoom);
  const toggleLayer = useMapStore((s) => s.toggleLayer);
  const activeLayers = useMapStore((s) => s.activeLayers);

  const { entries, total, isLoading } = useLaunchLog('1y');

  const handleClick = (e: LaunchLogEntry) => {
    if (!activeLayers.includes('launch_log')) {
      toggleLayer('launch_log');
    }
    selectEvent(entryToEvent(e));
    setCenter([e.location.lng, e.location.lat]);
    setZoom(6);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.15 }}
          className={`rounded-lg bg-dashboard-bg/95 border border-dashboard-neutral/25 text-sm shadow-xl backdrop-blur-md overflow-hidden ${className}`}
        >
          <div className="flex items-center justify-between px-3 py-2 border-b border-dashboard-neutral/15">
            <span className="font-semibold text-dashboard-neutral tracking-wide">
              🚀 全球航天发射日志
            </span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="关闭发射日志"
              className="rounded px-1.5 py-0.5 text-dashboard-neutral/60 hover:bg-white/5 hover:text-white"
            >
              ×
            </button>
          </div>

          <div className="px-3 py-1.5 text-[11px] text-dashboard-neutral/50 border-b border-dashboard-neutral/10">
            近一年
            {' · '}
            共 {isLoading ? '…' : total} 条任务
          </div>

          <div className="max-h-[min(50vh,22rem)] overflow-y-auto">
            {isLoading && entries.length === 0 ? (
              <div className="px-3 py-4 text-dashboard-neutral/50">加载发射记录…</div>
            ) : entries.length === 0 ? (
              <div className="px-3 py-4 text-dashboard-neutral/50">
                近一年内无发射记录
              </div>
            ) : (
              <table className="w-full text-left text-xs">
                <thead className="sticky top-0 bg-dashboard-bg/95 text-dashboard-neutral/50">
                  <tr>
                    <th className="px-2 py-1.5 font-medium">时间</th>
                    <th className="px-2 py-1.5 font-medium">机构</th>
                    <th className="px-2 py-1.5 font-medium hidden sm:table-cell">任务</th>
                    <th className="px-2 py-1.5 font-medium hidden md:table-cell">发射场</th>
                    <th className="px-2 py-1.5 font-medium">状态</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-dashboard-neutral/10">
                  {entries.map((e) => {
                    const siteName = e.siteId ? SITE_NAME.get(e.siteId) : undefined;
                    return (
                      <tr
                        key={e.id}
                        onClick={() => handleClick(e)}
                        className="cursor-pointer hover:bg-white/5 transition-colors"
                      >
                        <td className="px-2 py-2 whitespace-nowrap text-dashboard-neutral/70 tabular-nums">
                          {formatLaunchTime(e.launchTime)}
                        </td>
                        <td className="px-2 py-2 text-dashboard-neutral/80 whitespace-nowrap">
                          {e.provider}
                        </td>
                        <td className="px-2 py-2 hidden sm:table-cell max-w-[10rem] truncate text-dashboard-neutral">
                          {e.title}
                        </td>
                        <td className="px-2 py-2 hidden md:table-cell max-w-[8rem] truncate text-dashboard-neutral/60">
                          {siteName ?? '—'}
                        </td>
                        <td className="px-2 py-2">
                          <span
                            className={`inline-block rounded border px-1.5 py-0.5 text-[10px] font-medium whitespace-nowrap ${STATUS_BADGE[e.status]}`}
                          >
                            {STATUS_LABEL[e.status]}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>

          {entries[0] && (
            <div className="px-3 py-2 border-t border-dashboard-neutral/10 text-[11px] text-dashboard-neutral/50 truncate">
              最新：{entries[0].title}
              {entries[0].payload ? ` · ${entries[0].payload}` : ''}
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
