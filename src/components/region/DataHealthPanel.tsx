'use client';

/**
 * 数据健康看板 — 集中监控各免密钥真实数据源的可用性 / 延迟 / 探测时刻。
 * 数据来自 /api/health 的实时探测（非缓存、非编造）；自动每 2 分钟刷新，可手动刷新。
 */

import useSWR from 'swr';
import { DockPanel } from '@/components/region/DockPanel';
import { SkeletonRows } from '@/components/ui/Skeleton';
import { timeAgo } from '@/lib/format/time';

const fetcher = (url: string) => fetch(url).then((r) => r.json());

type HealthState = 'up' | 'slow' | 'down';

interface SourceResult {
  id: string;
  label: string;
  category: string;
  ok: boolean;
  status: number | null;
  latencyMs: number | null;
  state: HealthState;
  error?: string;
}

interface HealthResponse {
  checkedAt: string;
  total: number;
  up: number;
  slow: number;
  down: number;
  sources: SourceResult[];
}

const STATE_DOT: Record<HealthState, string> = { up: '#34d399', slow: '#fbbf24', down: '#f87171' };
const STATE_TEXT: Record<HealthState, string> = { up: '在线', slow: '缓慢', down: '不可达' };

export function DataHealthPanel({ className = '' }: { className?: string }) {
  const { data, isLoading, isValidating, mutate } = useSWR<HealthResponse>(
    '/api/health',
    fetcher,
    { refreshInterval: 2 * 60 * 1000, revalidateOnFocus: false, dedupingInterval: 30 * 1000 },
  );

  const summary = data
    ? `${data.up} 在线 · ${data.slow} 缓慢 · ${data.down} 不可达 / 共 ${data.total}`
    : isLoading
      ? '探测中…'
      : '—';

  return (
    <DockPanel
      id="data-health"
      icon="🩺"
      title="数据健康看板"
      className={`w-[min(20rem,calc(100vw-2rem))] border-emerald-500/25 bg-dashboard-bg/95 shadow-xl backdrop-blur-md ${className}`}
      headerRight={
        <button
          type="button"
          onClick={() => mutate()}
          disabled={isValidating}
          title="立即重新探测"
          className="rounded px-1.5 py-0.5 text-[11px] text-dashboard-neutral/70 transition-colors hover:bg-white/5 hover:text-white disabled:opacity-40"
        >
          {isValidating ? '探测中…' : '↻ 刷新'}
        </button>
      }
    >
      <div className="space-y-1.5 text-[11px]">
        <div className="flex items-center justify-between rounded-md border border-emerald-500/15 bg-emerald-500/[0.05] px-2 py-1.5">
          <span className="text-dashboard-neutral/85">{summary}</span>
          {data?.checkedAt && (
            <span className="text-[9px] text-dashboard-neutral/45">{timeAgo(data.checkedAt)}</span>
          )}
        </div>

        {!data && isLoading ? (
          <SkeletonRows rows={6} />
        ) : (
          <div className="space-y-1">
            {(data?.sources ?? []).map((s) => (
              <div key={s.id} className="flex items-center gap-2 rounded-md bg-white/5 px-2 py-1.5">
                <span
                  className="h-2 w-2 shrink-0 rounded-full"
                  style={{ background: STATE_DOT[s.state], boxShadow: `0 0 6px ${STATE_DOT[s.state]}` }}
                  aria-hidden
                />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-dashboard-neutral/85">{s.label}</span>
                  <span className="block truncate text-[9px] text-dashboard-neutral/45">
                    {s.category} · {STATE_TEXT[s.state]}
                    {s.status != null ? ` · HTTP ${s.status}` : s.error ? ` · ${s.error}` : ''}
                  </span>
                </span>
                {s.latencyMs != null && (
                  <span className="shrink-0 tabular-nums text-[10px] text-dashboard-neutral/60">{s.latencyMs}ms</span>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="border-t border-dashboard-neutral/10 pt-1 text-[9px] text-dashboard-neutral/40">
          实时探测上游连通性·非缓存·诚实反映可达性
        </div>
      </div>
    </DockPanel>
  );
}
