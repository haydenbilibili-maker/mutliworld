'use client';

import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { AdminLiveSourcesPanel } from '@/components/admin/AdminLiveSourcesPanel';
import { AdminSectionErrorBoundary } from '@/components/admin/AdminSectionErrorBoundary';

export default function AdminLiveSourcesPage() {
  return (
    <div className="mx-auto max-w-6xl">
      <AdminPageHeader
        title="实时数据源"
        description="监控 OpenSky、Open-Meteo、RainViewer、pizzint.watch 与 CelesTrak TLE 的上游连通性与最近抓取状态。"
        breadcrumbs={[
          { label: '管理后台', href: '/admin' },
          { label: '数据管理' },
          { label: '实时数据源' },
        ]}
      />

      <AdminSectionErrorBoundary title="实时数据源">
        <AdminLiveSourcesPanel />
      </AdminSectionErrorBoundary>

      <section className="mt-8 rounded-xl border border-dashboard-neutral/15 bg-white/[0.02] p-4 sm:p-5">
        <h2 className="mb-3 text-sm font-medium text-white">关联地图图层</h2>
        <dl className="grid gap-3 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-xs text-dashboard-neutral/55">live_flights</dt>
            <dd className="text-dashboard-neutral/80">OpenSky ADS-B · /api/flights</dd>
          </div>
          <div>
            <dt className="text-xs text-dashboard-neutral/55">live_weather</dt>
            <dd className="text-dashboard-neutral/80">Open-Meteo + RainViewer · /api/weather</dd>
          </div>
          <div>
            <dt className="text-xs text-dashboard-neutral/55">pizza_index</dt>
            <dd className="text-dashboard-neutral/80">pizzint.watch OSINT · /api/osint/pentagon-pizza</dd>
          </div>
          <div>
            <dt className="text-xs text-dashboard-neutral/55">live_maritime</dt>
            <dd className="text-dashboard-neutral/80">AISStream AIS / 航运通道模拟 · /api/maritime/live</dd>
          </div>
          <div>
            <dt className="text-xs text-dashboard-neutral/55">space_stations / satellites / space_debris</dt>
            <dd className="text-dashboard-neutral/80">CelesTrak TLE + SGP4 · /api/orbital-objects</dd>
          </div>
        </dl>
      </section>
    </div>
  );
}
