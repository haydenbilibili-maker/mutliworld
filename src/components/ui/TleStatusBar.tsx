'use client';

import { useState } from 'react';
import { formatDateTime } from '@/lib/admin/format';
import { ageLabel, isStale } from '@/lib/format/time';
import { useRelativeTimeTick } from '@/hooks/useRelativeTimeTick';
import { formatTleSource } from '@/lib/orbital/tleMeta';
import { useTleMeta } from '@/hooks/useTleMeta';
import type { TleRefreshResponse } from '@/types/orbital';

interface TleStatusBarProps {
  enabled?: boolean;
  compact?: boolean;
  className?: string;
  /** 刷新成功后回调（用于失效轨道位置 SWR） */
  onRefreshSuccess?: () => void | Promise<void>;
}

/** TLE 数据「陈旧」阈值：超过 72 小时（与 admin/stats.ts TLE_STALE_HOURS 一致） */
const TLE_STALE_MS = 72 * 60 * 60 * 1000;

export function TleStatusBar({
  enabled = true,
  compact = false,
  className = '',
  onRefreshSuccess,
}: TleStatusBarProps) {
  const { meta, isLoading, refresh: refreshMeta } = useTleMeta(enabled);
  const [refreshing, setRefreshing] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [statusError, setStatusError] = useState(false);
  // 相对龄期自动刷新：TLE 抓取时刻的「X小时前」随停留持续更新
  useRelativeTimeTick(60_000, enabled);

  const handleRefresh = async () => {
    setRefreshing(true);
    setStatusMessage('更新中…');
    setStatusError(false);

    try {
      const res = await fetch('/api/orbital/tle/refresh', { method: 'POST' });
      const data = (await res.json()) as TleRefreshResponse;

      if (!res.ok || !data.ok) {
        setStatusError(true);
        setStatusMessage(`更新失败：${data.error ?? '未知错误'}`);
        return;
      }

      await refreshMeta();
      await onRefreshSuccess?.();
      setStatusError(false);
      setStatusMessage(`更新成功，共 ${data.count} 条轨道数据`);
    } catch (err) {
      setStatusError(true);
      const msg = err instanceof Error ? err.message : '网络错误';
      setStatusMessage(`更新失败：${msg}`);
    } finally {
      setRefreshing(false);
    }
  };

  const counts = meta?.counts ?? { station: 0, satellite: 0, debris: 0 };
  const sourceLabel = formatTleSource(meta?.source ?? 'seed-fallback');
  const fetchedLabel = meta?.fetchedAt ? formatDateTime(meta.fetchedAt) : '—';
  const fetchedAge = meta?.fetchedAt ? ageLabel(meta.fetchedAt) : '';
  const tleStale = meta?.fetchedAt ? isStale(meta.fetchedAt, TLE_STALE_MS) : true;

  return (
    <div
      className={[
        'rounded-md border bg-violet-500/5',
        tleStale ? 'border-amber-500/30' : 'border-violet-500/15',
        compact ? 'px-2 py-1.5' : 'px-2.5 py-2',
        className,
      ].join(' ')}
    >
      <div className="space-y-0.5 text-[10px] text-dashboard-neutral/75">
        <div className="flex flex-wrap gap-x-3 gap-y-0.5">
          <span>
            数据源：<span className="text-dashboard-neutral">{sourceLabel}</span>
          </span>
          <span title={fetchedLabel}>
            上次更新：
            <span className="tabular-nums text-dashboard-neutral">
              {isLoading && !meta ? '…' : fetchedLabel}
            </span>
            {fetchedAge && (
              <span
                className={[
                  'ml-1 tabular-nums',
                  tleStale ? 'text-amber-400' : 'text-emerald-400/80',
                ].join(' ')}
              >
                ({fetchedAge}{tleStale ? ' · 建议刷新' : ''})
              </span>
            )}
          </span>
        </div>
        <div>
          记录数：
          <span className="tabular-nums text-dashboard-neutral">
            空间站 {counts.station} / 卫星 {counts.satellite} / 碎片 {counts.debris}
          </span>
        </div>
      </div>

      <div className={compact ? 'mt-1.5' : 'mt-2'}>
        <button
          type="button"
          onClick={handleRefresh}
          disabled={refreshing}
          className={[
            'inline-flex items-center gap-1.5 rounded border border-violet-500/30 bg-violet-500/10',
            'px-2 py-1 text-[10px] font-medium text-violet-200 transition-colors',
            'hover:border-violet-400/50 hover:bg-violet-500/20 disabled:cursor-not-allowed disabled:opacity-60',
          ].join(' ')}
        >
          {refreshing && (
            <span
              className="inline-block h-3 w-3 animate-spin rounded-full border border-violet-300/30 border-t-violet-200"
              aria-hidden
            />
          )}
          {refreshing ? '更新中…' : '一键更新轨道数据'}
        </button>
      </div>

      {statusMessage && (
        <p
          role="status"
          aria-live="polite"
          className={[
            'mt-1.5 text-[10px] leading-snug',
            statusError ? 'text-dashboard-conflict/90' : 'text-emerald-400/90',
          ].join(' ')}
        >
          {statusMessage}
        </p>
      )}
    </div>
  );
}
