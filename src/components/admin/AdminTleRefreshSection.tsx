'use client';

import { TleStatusBar } from '@/components/ui/TleStatusBar';

/** 管理后台 — TLE 一键刷新区块 */
export function AdminTleRefreshSection() {
  return (
    <section className="mb-8 rounded-xl border border-dashboard-neutral/15 bg-white/[0.02] p-4 sm:p-5">
      <h2 className="mb-2 text-sm font-medium text-white">刷新数据</h2>
      <p className="mb-3 text-sm text-dashboard-neutral/70">
        从 CelesTrak 拉取最新 TLE 并写入本地 <code className="text-dashboard-military">data/orbital/tle.json</code>
        （等效于终端执行 <code className="text-dashboard-military">npm run data:tle</code>）。
      </p>
      <TleStatusBar enabled className="max-w-xl" />
      <p className="mt-3 text-xs text-dashboard-neutral/50">
        无缓存文件时将使用种子 TLE 兜底（ISS、天宫等）。生产环境需设置{' '}
        <code className="text-dashboard-military">NEXT_PUBLIC_ADMIN_ENABLED=true</code>。
      </p>
    </section>
  );
}
