import Link from 'next/link';
import { StatCard } from '@/components/admin/StatCard';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { AdminMetaBox } from '@/components/admin/AdminMetaBox';
import { AdminApiHealthPanel } from '@/components/admin/AdminApiHealthPanel';
import { AdminLiveSourcesPanel } from '@/components/admin/AdminLiveSourcesPanel';
import { AdminTleRefreshSection } from '@/components/admin/AdminTleRefreshSection';
import { AdminSectionErrorBoundary } from '@/components/admin/AdminSectionErrorBoundary';
import { formatDateTime } from '@/lib/admin/format';
import { getAdminStats } from '@/lib/admin/stats';
import { isAdminEnabled } from '@/lib/admin/config';

export default function AdminDashboardPage() {
  const stats = getAdminStats();
  const adminOn = isAdminEnabled();

  return (
    <div className="mx-auto max-w-7xl">
      <AdminPageHeader
        title="管理仪表盘"
        description="集中监控平台数据源、实时 API、图层配置、战略研究专题与 Geodata 缓存状态。"
        breadcrumbs={[{ label: '管理后台', href: '/admin' }, { label: '仪表盘' }]}
      />

      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs text-dashboard-neutral/50">
          统计生成于 {formatDateTime(stats.generatedAt)}
        </p>
        <Link
          href="/"
          className="rounded-lg border border-dashboard-military/30 bg-dashboard-military/10 px-3 py-1.5 text-xs font-medium text-dashboard-military hover:bg-dashboard-military/20 lg:hidden"
        >
          返回地图
        </Link>
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="已注册区域"
          description="ALL_REGION_IDS 九区域注册表"
          value={`${stats.summary.enabledRegionCount}/${stats.summary.regionCount}`}
          href="/admin/features/regions"
          icon="🌏"
        />
        <StatCard
          title="Geodata 要素"
          description="种子数据 + 静态缓存要素总量"
          value={stats.summary.totalSeedFeatures}
          href="/admin/data/geodata"
          icon="📍"
        />
        <StatCard
          title="图层定义"
          description={`含 ${stats.layers.liveApiCount} 个实时 API 图层`}
          value={stats.layers.total}
          href="/admin/features/layers"
          icon="🗺️"
        />
        <StatCard
          title="冲突区"
          description="全球军事冲突区多边形（静态内嵌）"
          value={stats.summary.conflictZoneCount}
          href="/admin/features/conflict-zones"
          icon="⚠️"
        />
        <StatCard
          title="区域人物"
          description={`Wikipedia ${stats.persons.avatarStats.wikipedia} · Dicebear ${stats.persons.avatarStats.generated}`}
          value={stats.summary.personCount}
          href="/admin/features/persons"
          icon="👤"
        />
        <StatCard
          title="跑马灯种子"
          description="NEWS_FEED_SEED 快讯库"
          value={stats.summary.newsFeedSeedCount}
          href="/admin/data/news-feed"
          icon="📰"
        />
        <StatCard
          title="区域态势"
          description="社媒 · 趋势 · 态势 feed"
          value={stats.summary.regionalSituationCount}
          href="/admin/features/regional-situation"
          icon="📊"
        />
        <StatCard
          title="股市指数"
          description="带 regionIds 的股指种子"
          value={stats.summary.stockIndexCount}
          href="/admin/data/markets"
          icon="📈"
        />
        <StatCard
          title="分级展示"
          description="L1 区域 · L2 面板过滤"
          value={stats.contentHierarchy.filteredPanels.length}
          href="/admin/features/content-hierarchy"
          icon="🎚️"
        />
        <StatCard
          title="天体探索"
          description={`${stats.summary.bodyCount} 天体 · ${stats.summary.bodySiteCount} 处探索痕迹`}
          value={stats.summary.bodyCount}
          href="/admin/features/body-traces"
          icon="🪐"
        />
        <StatCard
          title="在轨物体 TLE"
          description={`新鲜度 ${stats.summary.tleAgeLabel}`}
          value={stats.orbital.total}
          href="/admin/data/orbital"
          icon="🛰️"
        />
        <StatCard
          title="发射日志"
          description="Launch Library 2 本地库"
          value={stats.launchLog.count}
          href="/admin/data/launch-log"
          icon="🚀"
        />
        <StatCard
          title="战略研究"
          description="中美博弈 · 东北亚等专题"
          value={`${stats.summary.enabledStrategicPanelCount}/${stats.summary.strategicPanelCount}`}
          href="/admin/features/strategic-research"
          icon="📚"
        />
        <StatCard
          title="实时数据源"
          description="OpenSky · 天气 · 披萨指数"
          value={stats.layers.liveOverlays.pizza_index}
          href="/admin/data/live-sources"
          icon="📡"
        />
      </div>

      <div className="mb-8 grid gap-6 xl:grid-cols-2">
        <AdminSectionErrorBoundary title="API 健康">
          <AdminApiHealthPanel compact autoRefreshMs={120_000} />
        </AdminSectionErrorBoundary>
        <AdminSectionErrorBoundary title="实时数据源">
          <AdminLiveSourcesPanel compact />
        </AdminSectionErrorBoundary>
      </div>

      <section className="mb-8 rounded-xl border border-dashboard-neutral/15 bg-white/[0.02] p-4 sm:p-5">
        <h2 className="mb-4 text-sm font-medium text-white">系统信息</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <AdminMetaBox label="应用版本" value={`v${stats.system.version}`} sub={stats.system.appName} />
          <AdminMetaBox
            label="MapLibre GL"
            value={`v${stats.system.maplibreVersion}`}
            sub={stats.system.globeProjection ? 'Globe 投影已启用' : '平面模式'}
            accent
          />
          <AdminMetaBox label="运行环境" value={stats.system.nodeEnv} sub="NODE_ENV" />
          <AdminMetaBox
            label="地理底图"
            value={stats.system.geographicBasemap ? 'geographic' : '—'}
            sub="地表空间层默认底图"
          />
        </div>
      </section>

      <section className="mb-8 rounded-xl border border-dashboard-neutral/15 bg-white/[0.02] p-4 sm:p-5">
        <h2 className="mb-3 text-sm font-medium text-white">快速操作</h2>
        <div className="grid gap-4 lg:grid-cols-2">
          <AdminTleRefreshSection showAge />
          <div className="space-y-3">
            <div className="rounded-lg border border-dashboard-neutral/10 bg-black/20 p-4">
              <h3 className="text-sm font-medium text-white">开发文档</h3>
              <ul className="mt-2 space-y-1.5 text-xs">
                <li>
                  <Link href="/admin/operations/cache" className="text-dashboard-military hover:underline">
                    缓存策略说明 →
                  </Link>
                </li>
                <li>
                  <span className="text-dashboard-neutral/50">docs/PRD-寰宇态势感知平台.md</span>
                </li>
                <li>
                  <span className="text-dashboard-neutral/50">docs/三位一体空间PRD.md</span>
                </li>
                <li>
                  <span className="text-dashboard-neutral/50">docs/3D地球评估与迁移.md</span>
                </li>
              </ul>
            </div>
            <div className="rounded-lg border border-dashboard-neutral/10 bg-black/20 p-4">
              <h3 className="text-sm font-medium text-white">数据刷新命令</h3>
              <div className="mt-2 space-y-1 font-mono text-xs text-dashboard-military">
                <p>npm run data:fetch</p>
                <p>npm run data:launches</p>
                <p>npm run data:tle</p>
              </div>
            </div>
            <div className="rounded-lg border border-dashboard-neutral/10 bg-black/20 p-4">
              <h3 className="text-sm font-medium text-white">管理 API</h3>
              <div className="mt-2 space-y-1 font-mono text-[10px] text-dashboard-neutral/60">
                <p>GET /api/admin/stats</p>
                <p>GET /api/admin/health</p>
                <p>GET /api/admin/live-sources</p>
              </div>
              <p className="mt-2 text-[10px] text-dashboard-neutral/45">
                后台{adminOn ? '已启用' : '未启用'} · 生产需 NEXT_PUBLIC_ADMIN_ENABLED=true
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-dashboard-neutral/15 bg-white/[0.02] p-4 sm:p-5">
        <h2 className="mb-3 text-sm font-medium text-white">平台摘要</h2>
        <dl className="grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <dt className="text-dashboard-neutral/55">空间层</dt>
            <dd className="font-medium tabular-nums text-white">{stats.tiers.length} 层</dd>
          </div>
          <div>
            <dt className="text-dashboard-neutral/55">Geodata 缓存要素</dt>
            <dd className="font-medium tabular-nums text-dashboard-military">
              {stats.summary.cacheFeatureTotal}
            </dd>
          </div>
          <div>
            <dt className="text-dashboard-neutral/55">TLE 数据源</dt>
            <dd className="font-medium text-white">
              {stats.orbital.source}
              {stats.orbital.stale ? (
                <span className="ml-1 text-xs text-amber-400">（过期 · {stats.orbital.ageLabel}）</span>
              ) : (
                <span className="ml-1 text-xs text-dashboard-neutral/50">（{stats.orbital.ageLabel}）</span>
              )}
            </dd>
          </div>
          <div>
            <dt className="text-dashboard-neutral/55">发射日志更新</dt>
            <dd className="font-medium text-white">{formatDateTime(stats.launchLog.fetchedAt)}</dd>
          </div>
          <div>
            <dt className="text-dashboard-neutral/55">实时天气</dt>
            <dd className="text-xs text-dashboard-neutral/75">{stats.layers.liveOverlays.live_weather}</dd>
          </div>
          <div>
            <dt className="text-dashboard-neutral/55">实时航班</dt>
            <dd className="text-xs text-dashboard-neutral/75">{stats.layers.liveOverlays.live_flights}</dd>
          </div>
          <div>
            <dt className="text-dashboard-neutral/55">海运实时</dt>
            <dd className="text-xs text-dashboard-neutral/75">{stats.layers.liveOverlays.live_maritime}</dd>
          </div>
          <div>
            <dt className="text-dashboard-neutral/55">披萨指数门店</dt>
            <dd className="tabular-nums text-dashboard-military">{stats.layers.liveOverlays.pizza_index}</dd>
          </div>
          <div>
            <dt className="text-dashboard-neutral/55">区域人物</dt>
            <dd className="tabular-nums text-dashboard-military">{stats.summary.personCount}</dd>
          </div>
          <div>
            <dt className="text-dashboard-neutral/55">跑马灯种子</dt>
            <dd className="tabular-nums text-white">{stats.summary.newsFeedSeedCount}</dd>
          </div>
          <div>
            <dt className="text-dashboard-neutral/55">区域态势条目</dt>
            <dd className="tabular-nums text-white">{stats.summary.regionalSituationCount}</dd>
          </div>
          <div>
            <dt className="text-dashboard-neutral/55">股市指数</dt>
            <dd className="tabular-nums text-white">{stats.summary.stockIndexCount}</dd>
          </div>
          <div>
            <dt className="text-dashboard-neutral/55">Globe 投影</dt>
            <dd className="text-green-400">{stats.summary.globeProjection ? '已启用' : '未启用'}</dd>
          </div>
        </dl>
      </section>
    </div>
  );
}
