'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { AdminLoadingSkeleton } from '@/components/admin/AdminLoadingSkeleton';
import { AdminBadge } from '@/components/admin/AdminBadge';
import { formatDateTime } from '@/lib/admin/format';

interface HealthEndpoint {
  id: string;
  name: string;
  path: string;
  status: number;
  ok: boolean;
  latencyMs: number;
  error?: string;
  checkedAt: string;
}

interface HealthResponse {
  generatedAt: string;
  summary: { total: number; ok: number; failed: number };
  endpoints: HealthEndpoint[];
}

interface AdminApiHealthPanelProps {
  compact?: boolean;
  autoRefreshMs?: number;
}

function statusBadge(ok: boolean, status: number) {
  if (ok) return <AdminBadge variant="success" label="正常" />;
  if (status === 0) return <AdminBadge variant="danger" label="超时/离线" />;
  return <AdminBadge variant="warning" label={`HTTP ${status}`} />;
}

/** 管理后台 API 健康探测面板 */
export function AdminApiHealthPanel({
  compact = false,
  autoRefreshMs = 0,
}: AdminApiHealthPanelProps) {
  const [data, setData] = useState<HealthResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHealth = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/health', { cache: 'no-store' });
      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(body.error ?? `HTTP ${res.status}`);
      }
      setData((await res.json()) as HealthResponse);
    } catch (err) {
      setError(err instanceof Error ? err.message : '探测失败');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchHealth();
  }, [fetchHealth]);

  useEffect(() => {
    if (!autoRefreshMs) return;
    const id = setInterval(() => void fetchHealth(), autoRefreshMs);
    return () => clearInterval(id);
  }, [autoRefreshMs, fetchHealth]);

  return (
    <section className="rounded-xl border border-dashboard-neutral/15 bg-white/[0.02] p-4 sm:p-5">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-medium text-white">API 健康状态</h2>
          {!compact && (
            <p className="mt-1 text-xs text-dashboard-neutral/55">
              服务端 ping 各公开路由，测量延迟与 HTTP 状态
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          {data && (
            <span className="text-xs text-dashboard-neutral/50">
              {data.summary.ok}/{data.summary.total} 正常
            </span>
          )}
          <button
            type="button"
            onClick={() => void fetchHealth()}
            disabled={loading}
            className="rounded-lg border border-dashboard-neutral/25 px-3 py-1.5 text-xs text-dashboard-neutral hover:border-dashboard-military/40 hover:text-white disabled:opacity-50"
          >
            {loading ? '探测中…' : '重新探测'}
          </button>
          {!compact && (
            <Link
              href="/admin/operations/health"
              className="text-xs text-dashboard-military hover:underline"
            >
              详情 →
            </Link>
          )}
        </div>
      </div>

      {error && (
        <p className="mb-3 rounded-lg border border-red-500/25 bg-red-500/5 px-3 py-2 text-xs text-red-300">
          {error}
        </p>
      )}

      {loading && !data ? (
        <AdminLoadingSkeleton rows={compact ? 3 : 5} />
      ) : (
        <div className="overflow-x-auto rounded-lg border border-dashboard-neutral/10">
          <table className="w-full min-w-[480px] text-left text-sm">
            <thead className="border-b border-dashboard-neutral/10 bg-black/20 text-xs text-dashboard-neutral/55">
              <tr>
                <th className="px-3 py-2 font-medium">端点</th>
                <th className="px-3 py-2 font-medium">状态</th>
                <th className="px-3 py-2 font-medium">延迟</th>
                {!compact && <th className="px-3 py-2 font-medium">路径</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-dashboard-neutral/10">
              {(data?.endpoints ?? []).map((ep) => (
                <tr key={ep.id} className="hover:bg-white/[0.02]">
                  <td className="px-3 py-2 text-white">{ep.name}</td>
                  <td className="px-3 py-2">{statusBadge(ep.ok, ep.status)}</td>
                  <td className="px-3 py-2 tabular-nums text-dashboard-military">
                    {ep.latencyMs} ms
                  </td>
                  {!compact && (
                    <td className="px-3 py-2">
                      <code className="text-xs text-dashboard-neutral/60">{ep.path}</code>
                      {ep.error && (
                        <p className="mt-0.5 text-[10px] text-red-300/80">{ep.error}</p>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {data && (
        <p className="mt-3 text-[10px] text-dashboard-neutral/45">
          上次探测 {formatDateTime(data.generatedAt)}
        </p>
      )}
    </section>
  );
}
