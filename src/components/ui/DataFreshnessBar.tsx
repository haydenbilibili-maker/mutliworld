'use client';

import { useGeodataContext } from '@/context/GeodataContext';
import { REFRESH_INTERVAL_MS } from '@/lib/timeRange';
import type { TimeRange } from '@/types/geo';

interface DataFreshnessBarProps {
  className?: string;
}

function formatTime(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  const HH = String(d.getHours()).padStart(2, '0');
  const MM = String(d.getMinutes()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd} ${HH}:${MM}`;
}

const REFRESH_LABEL: Record<TimeRange, string> = {
  '24h': '30 秒',
  '7d': '60 秒',
  '30d': '120 秒',
};

export function DataFreshnessBar({ className = '' }: DataFreshnessBarProps) {
  const { meta, isValidating, isLoading, mutate, error } = useGeodataContext();

  if (!meta && isLoading) {
    return (
      <div
        className={`rounded-lg bg-dashboard-bg/90 border border-dashboard-neutral/20 px-3 py-2 text-sm text-dashboard-neutral ${className}`}
      >
        正在加载态势数据…
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={`rounded-lg bg-dashboard-bg/90 border border-dashboard-conflict/40 px-3 py-2 text-sm ${className}`}
      >
        <span className="text-dashboard-conflict">数据拉取失败</span>
        <button
          type="button"
          onClick={() => mutate()}
          className="ml-3 text-dashboard-military hover:underline"
        >
          重试
        </button>
      </div>
    );
  }

  if (!meta) return null;

  const timeRange = meta.timeRange as TimeRange;

  return (
    <div
      className={`flex flex-wrap items-center gap-x-3 gap-y-0.5 rounded-lg bg-dashboard-bg/85 border border-dashboard-neutral/20 px-3 py-1.5 text-xs backdrop-blur-sm ${className}`}
      role="status"
      aria-live="polite"
    >
      <span className="text-dashboard-neutral">
        数据更新：{formatTime(meta.generatedAt)}
        {isValidating ? ' · 刷新中…' : ''}
      </span>
      <span className="text-dashboard-neutral">
        点位 {meta.featureCount} 个
      </span>
      {meta.latestEventAt && (
        <span className="text-dashboard-neutral">
          最新事件 {formatTime(meta.latestEventAt)}
        </span>
      )}
      <span className="text-dashboard-neutral/70">
        自动刷新 {REFRESH_LABEL[timeRange]}
      </span>
      <button
        type="button"
        onClick={() => mutate()}
        className="text-dashboard-military hover:underline"
        aria-label="手动刷新态势数据"
      >
        立即刷新
      </button>
    </div>
  );
}
