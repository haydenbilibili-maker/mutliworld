import { StatCard } from '@/components/admin/StatCard';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { formatDateTime } from '@/lib/admin/format';
import { getAdminStats } from '@/lib/admin/stats';

export default function AdminDashboardPage() {
  const stats = getAdminStats();

  return (
    <div className="mx-auto max-w-6xl">
      <AdminPageHeader
        title="管理仪表盘"
        description="集中查看与维护平台的数据源、图层配置、战略研究专题及 Geodata 缓存状态。"
      />

      <p className="mb-6 text-xs text-dashboard-neutral/50">
        统计生成于 {formatDateTime(stats.generatedAt)}
      </p>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard
          title="区域与图层配置"
          description="查看全部 LayerId、区域启用图层与空间层分组"
          value={stats.layers.total}
          href="/admin/features/layers"
          icon="🗺️"
        />
        <StatCard
          title="发射日志数据"
          description="launch-log 本地库统计与最近发射记录"
          value={stats.launchLog.count}
          href="/admin/data/launch-log"
          icon="🚀"
        />
        <StatCard
          title="轨道 TLE 数据"
          description="在轨物体 TLE 数据库分类统计"
          value={stats.orbital.total}
          href="/admin/data/orbital"
          icon="🛰️"
        />
        <StatCard
          title="战略研究专题"
          description="研究主题注册表与模块数量"
          value={`${stats.summary.enabledStrategicPanelCount}/${stats.summary.strategicPanelCount}`}
          href="/admin/features/strategic-research"
          icon="📚"
        />
        <StatCard
          title="种子数据概览"
          description="各区域 dataset 聚合要素数量"
          value={stats.summary.totalSeedFeatures}
          href="/admin/features/regions"
          icon="🌱"
        />
        <StatCard
          title="空间层配置"
          description="地表 / 洋底 / 宇宙三层模块与默认图层"
          value={stats.tiers.length}
          href="/admin/features/tiers"
          icon="🌌"
        />
        <StatCard
          title="Geodata 缓存状态"
          description="public/cache 静态抓取缓存文件"
          value={stats.summary.cacheFeatureTotal}
          href="/admin/data/geodata"
          icon="💾"
        />
      </div>

      <section className="mt-8 rounded-xl border border-dashboard-neutral/15 bg-white/[0.02] p-4 sm:p-5">
        <h2 className="mb-3 text-sm font-medium text-white">快速摘要</h2>
        <dl className="grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <dt className="text-dashboard-neutral/55">已启用区域</dt>
            <dd className="font-medium tabular-nums text-white">
              {stats.summary.enabledRegionCount} / {stats.summary.regionCount}
            </dd>
          </div>
          <div>
            <dt className="text-dashboard-neutral/55">发射日志更新</dt>
            <dd className="font-medium text-white">
              {formatDateTime(stats.launchLog.fetchedAt)}
            </dd>
          </div>
          <div>
            <dt className="text-dashboard-neutral/55">TLE 数据源</dt>
            <dd className="font-medium text-white">{stats.orbital.source}</dd>
          </div>
          <div>
            <dt className="text-dashboard-neutral/55">API 端点</dt>
            <dd className="font-mono text-xs text-dashboard-military">GET /api/admin/stats</dd>
          </div>
        </dl>
      </section>
    </div>
  );
}
