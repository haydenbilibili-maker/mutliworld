'use client';

import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { AdminApiHealthPanel } from '@/components/admin/AdminApiHealthPanel';
import { AdminSectionErrorBoundary } from '@/components/admin/AdminSectionErrorBoundary';

export default function AdminHealthPage() {
  return (
    <div className="mx-auto max-w-6xl">
      <AdminPageHeader
        title="API 健康"
        description="探测各公开 API 路由的 HTTP 状态与响应延迟，用于运维监控与故障排查。"
        breadcrumbs={[
          { label: '管理后台', href: '/admin' },
          { label: '运维' },
          { label: 'API 健康' },
        ]}
      />

      <AdminSectionErrorBoundary title="API 健康">
        <AdminApiHealthPanel autoRefreshMs={60_000} />
      </AdminSectionErrorBoundary>

      <section className="mt-8 rounded-xl border border-dashboard-neutral/15 bg-white/[0.02] p-4 sm:p-5">
        <h2 className="mb-3 text-sm font-medium text-white">探测端点清单</h2>
        <ul className="space-y-2 text-xs text-dashboard-neutral/70">
          <li>
            <code className="text-dashboard-military">/api/geodata</code> — 区域 Geodata 聚合（种子 + 缓存）
          </li>
          <li>
            <code className="text-dashboard-military">/api/flights</code> — OpenSky 实时航班代理
          </li>
          <li>
            <code className="text-dashboard-military">/api/weather</code> — Open-Meteo 城市实况
          </li>
          <li>
            <code className="text-dashboard-military">/api/weather/radar</code> — RainViewer 降水雷达
          </li>
          <li>
            <code className="text-dashboard-military">/api/osint/pentagon-pizza</code> — 披萨指数
          </li>
          <li>
            <code className="text-dashboard-military">/api/orbital-objects</code> — TLE 传播在轨位置
          </li>
          <li>
            <code className="text-dashboard-military">/api/launch-log</code> — 发射日志 API
          </li>
        </ul>
      </section>
    </div>
  );
}
