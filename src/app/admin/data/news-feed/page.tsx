import Link from 'next/link';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { getAdminStats } from '@/lib/admin/stats';
import { NEWS_CATEGORY_COLORS } from '@/data/news-feed';
import type { NewsFeedCategory } from '@/data/news-feed';
import { listRegions } from '@/regions';

const CATEGORIES: NewsFeedCategory[] = ['时政', '政经', '国际局势', '军事安全', '能源市场'];

export default function AdminNewsFeedPage() {
  const { newsFeed } = getAdminStats();
  const regions = listRegions();

  return (
    <div className="mx-auto max-w-6xl">
      <AdminPageHeader
        title="跑马灯新闻种子"
        description="NEWS_FEED_SEED 静态快讯库，供 MarqueeTicker 与侧栏联动；可与 /api/news RSS 混排。"
        breadcrumbs={[
          { label: '管理后台', href: '/admin' },
          { label: '数据管理' },
          { label: '跑马灯' },
        ]}
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-dashboard-neutral/15 bg-white/[0.02] p-4">
          <p className="text-xs text-dashboard-neutral/55">种子总数</p>
          <p className="mt-1 text-2xl font-semibold tabular-nums text-white">{newsFeed.total}</p>
        </div>
        <div className="rounded-xl border border-dashboard-neutral/15 bg-white/[0.02] p-4">
          <p className="text-xs text-dashboard-neutral/55">含地图坐标</p>
          <p className="mt-1 text-2xl font-semibold tabular-nums text-dashboard-military">
            {newsFeed.withLocation}
          </p>
        </div>
        <div className="rounded-xl border border-dashboard-neutral/15 bg-white/[0.02] p-4">
          <p className="text-xs text-dashboard-neutral/55">数据源</p>
          <p className="mt-1 text-sm text-dashboard-neutral/80">src/data/news-feed.ts</p>
        </div>
      </div>

      <section className="mb-8">
        <h2 className="mb-3 text-sm font-medium text-white">按分类</h2>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <span
              key={cat}
              className="rounded-lg px-3 py-2 text-sm"
              style={{
                backgroundColor: `${NEWS_CATEGORY_COLORS[cat]}22`,
                color: NEWS_CATEGORY_COLORS[cat],
              }}
            >
              {cat}
              <span className="ml-2 tabular-nums font-medium">{newsFeed.byCategory[cat]}</span>
            </span>
          ))}
        </div>
      </section>

      <section className="mb-8">
        <h2 className="mb-3 text-sm font-medium text-white">按区域标签（可重叠计数）</h2>
        <div className="overflow-x-auto rounded-xl border border-dashboard-neutral/15">
          <table className="w-full min-w-[480px] text-left text-sm">
            <thead className="border-b border-dashboard-neutral/15 bg-white/[0.03] text-xs text-dashboard-neutral/60">
              <tr>
                <th className="px-3 py-2 font-medium">区域</th>
                <th className="px-3 py-2 font-medium">关联条数</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dashboard-neutral/10">
              {regions.map((region) => (
                <tr key={region.id} className="hover:bg-white/[0.02]">
                  <td className="px-3 py-2 text-white">{region.name}</td>
                  <td className="px-3 py-2 tabular-nums text-dashboard-military">
                    {newsFeed.byRegion[region.id] ?? 0}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <p className="text-xs text-dashboard-neutral/50">
        在地图上预览跑马灯：{' '}
        <Link href="/?region=global" className="text-dashboard-military hover:underline">
          全球视图 · 顶部跑马灯面板
        </Link>
      </p>
    </div>
  );
}
