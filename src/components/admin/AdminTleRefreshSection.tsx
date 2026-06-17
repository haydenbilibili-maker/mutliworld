'use client';

import Link from 'next/link';
import { TleStatusBar } from '@/components/ui/TleStatusBar';
import { formatDateTime } from '@/lib/admin/format';
import { useTleMeta } from '@/hooks/useTleMeta';
import { formatTleAgeHours } from '@/lib/admin/format';

interface AdminTleRefreshSectionProps {
  showAge?: boolean;
}

/** 管理后台 — TLE 一键刷新区块 */
export function AdminTleRefreshSection({ showAge = true }: AdminTleRefreshSectionProps) {
  const { meta } = useTleMeta(true);
  const ageLabel = formatTleAgeHours(meta?.fetchedAt ?? null);

  return (
    <section className="mb-8 rounded-xl border border-dashboard-neutral/15 bg-white/[0.02] p-4 sm:p-5">
      <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-sm font-medium text-white">刷新 TLE 数据</h2>
          <p className="mt-1 text-sm text-dashboard-neutral/70">
            从 CelesTrak 拉取最新 TLE 并写入本地{' '}
            <code className="text-dashboard-military">data/orbital/tle.json</code>
          </p>
        </div>
        {showAge && meta && (
          <div className="rounded-lg border border-violet-500/20 bg-violet-500/5 px-3 py-2 text-right">
            <p className="text-[10px] text-dashboard-neutral/50">数据新鲜度</p>
            <p className="text-sm font-medium text-violet-200">{ageLabel}</p>
            <p className="text-[10px] tabular-nums text-dashboard-neutral/45">
              {formatDateTime(meta.fetchedAt)}
            </p>
          </div>
        )}
      </div>

      <TleStatusBar enabled className="max-w-xl" />

      <div className="mt-4 flex flex-wrap gap-3 text-xs">
        <Link
          href="/admin/data/orbital"
          className="text-dashboard-military hover:underline"
        >
          轨道数据详情 →
        </Link>
        <span className="text-dashboard-neutral/35">·</span>
        <code className="text-dashboard-neutral/50">npm run data:tle</code>
      </div>

      <p className="mt-3 text-xs text-dashboard-neutral/50">
        物体数 {meta?.counts ? meta.counts.station + meta.counts.satellite + meta.counts.debris : '—'} ·
        无缓存时使用种子 TLE 兜底（ISS、天宫等）
      </p>
    </section>
  );
}
