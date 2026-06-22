'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { AdminBadge } from '@/components/admin/AdminBadge';
import { AdminLoadingSkeleton } from '@/components/admin/AdminLoadingSkeleton';
import { formatDateTime } from '@/lib/admin/format';

interface LiveSource {
  id: string;
  name: string;
  provider: string;
  layerIds: string[];
  status: 'ok' | 'degraded' | 'error' | 'unknown';
  lastCheckedAt: string;
  lastFetchAt: string | null;
  latencyMs: number | null;
  detail: string;
  error?: string;
  cacheTtl: string;
  apiRoute: string;
  /** 鉴权方式：无 Key / 免费 Key / 付费 Key */
  keyRequirement?: 'none' | 'free_key' | 'paid_key';
  /** 所需 env 变量名 */
  keyEnvVar?: string | null;
  /** 运行时是否已配置所需 Key */
  keyConfigured?: boolean;
}

interface LiveSourcesResponse {
  generatedAt: string;
  summary: { total: number; ok: number; degraded: number; error: number };
  sources: LiveSource[];
}

function sourceBadge(status: LiveSource['status']) {
  switch (status) {
    case 'ok':
      return <AdminBadge variant="success" label="正常" />;
    case 'degraded':
      return <AdminBadge variant="warning" label="降级" />;
    case 'error':
      return <AdminBadge variant="danger" label="异常" />;
    default:
      return <AdminBadge variant="muted" label="未知" />;
  }
}

/** Key 需求徽标：免费无Key（绿）/ 免费Key（蓝）/ 未配置Key（灰降级） */
function keyBadge(src: LiveSource) {
  const req = src.keyRequirement ?? 'none';
  if (req === 'none') {
    return <AdminBadge variant="success" label="免费无Key" />;
  }
  if (src.keyConfigured === false) {
    const env = src.keyEnvVar ? `（需配置 ${src.keyEnvVar}）` : '';
    return <AdminBadge variant="warning" label={`未配置Key${env}`} />;
  }
  const label = req === 'free_key' ? '免费Key' : '付费Key';
  return <AdminBadge variant="info" label={label} />;
}

/** 管理后台实时数据源探测面板 */
export function AdminLiveSourcesPanel({ compact = false }: { compact?: boolean }) {
  const [data, setData] = useState<LiveSourcesResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSources = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/live-sources', { cache: 'no-store' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setData((await res.json()) as LiveSourcesResponse);
    } catch (err) {
      setError(err instanceof Error ? err.message : '探测失败');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchSources();
  }, [fetchSources]);

  return (
    <section className="rounded-xl border border-dashboard-neutral/15 bg-white/[0.02] p-4 sm:p-5">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-medium text-white">实时数据源</h2>
          {!compact && (
            <p className="mt-1 text-xs text-dashboard-neutral/55">
              OpenSky · Open-Meteo · RainViewer · pizzint.watch · CelesTrak
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => void fetchSources()}
            disabled={loading}
            className="rounded-lg border border-dashboard-neutral/25 px-3 py-1.5 text-xs text-dashboard-neutral hover:text-white disabled:opacity-50"
          >
            {loading ? '探测中…' : '重新探测'}
          </button>
          {!compact && (
            <Link href="/admin/data/live-sources" className="text-xs text-dashboard-military hover:underline">
              详情 →
            </Link>
          )}
        </div>
      </div>

      {error && (
        <p className="mb-3 text-xs text-red-300">{error}</p>
      )}

      {loading && !data ? (
        <AdminLoadingSkeleton rows={4} />
      ) : (
        <div className="space-y-3">
          {(data?.sources ?? []).map((src) => (
            <div
              key={src.id}
              className="rounded-lg border border-dashboard-neutral/10 bg-black/20 px-3 py-2.5"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <span className="text-sm text-white">{src.name}</span>
                  <span className="ml-2 text-xs text-dashboard-neutral/50">{src.provider}</span>
                </div>
                <div className="flex flex-wrap items-center gap-1.5">
                  {keyBadge(src)}
                  {sourceBadge(src.status)}
                </div>
              </div>
              <p className="mt-1 text-xs text-dashboard-neutral/70">{src.detail}</p>
              <div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1 text-[10px] text-dashboard-neutral/45">
                {src.latencyMs != null && <span>延迟 {src.latencyMs} ms</span>}
                <span>缓存 {src.cacheTtl}</span>
                <span className="font-mono">{src.apiRoute}</span>
                {src.lastFetchAt && <span>数据 {formatDateTime(src.lastFetchAt)}</span>}
              </div>
              {src.error && <p className="mt-1 text-[10px] text-amber-300/80">{src.error}</p>}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
