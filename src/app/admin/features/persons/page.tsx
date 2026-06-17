import Link from 'next/link';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { AdminBadge } from '@/components/admin/AdminBadge';
import { getAdminStats } from '@/lib/admin/stats';
import { listRegions } from '@/regions';

const DOMAIN_LABELS = ['政治', '经济', '社会', '文化', '军事'] as const;

const AVATAR_KIND_LABEL = {
  wikipedia: 'Wikipedia',
  generated: 'Dicebear',
  custom: '自定义',
} as const;

export default function AdminPersonsPage() {
  const { persons } = getAdminStats();
  const regions = listRegions();

  return (
    <div className="mx-auto max-w-6xl">
      <AdminPageHeader
        title="区域人物"
        description="ALL_PERSONS 种子库：政治/经济/社会/文化/军事公众人物，按 regionIds 注入各区域数据集与 persons 图层。"
        breadcrumbs={[
          { label: '管理后台', href: '/admin' },
          { label: '功能配置' },
          { label: '区域人物' },
        ]}
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-dashboard-neutral/15 bg-white/[0.02] p-4">
          <p className="text-xs text-dashboard-neutral/55">去重人物总数</p>
          <p className="mt-1 text-2xl font-semibold tabular-nums text-white">{persons.total}</p>
        </div>
        <div className="rounded-xl border border-dashboard-neutral/15 bg-white/[0.02] p-4">
          <p className="text-xs text-dashboard-neutral/55">Wikipedia 头像</p>
          <p className="mt-1 text-2xl font-semibold tabular-nums text-dashboard-military">
            {persons.avatarStats.wikipedia}
          </p>
        </div>
        <div className="rounded-xl border border-dashboard-neutral/15 bg-white/[0.02] p-4">
          <p className="text-xs text-dashboard-neutral/55">Dicebear 生成</p>
          <p className="mt-1 text-2xl font-semibold tabular-nums text-white">
            {persons.avatarStats.generated}
          </p>
        </div>
        <div className="rounded-xl border border-dashboard-neutral/15 bg-white/[0.02] p-4">
          <p className="text-xs text-dashboard-neutral/55">种子自定义</p>
          <p className="mt-1 text-2xl font-semibold tabular-nums text-white">
            {persons.avatarStats.custom}
          </p>
        </div>
      </div>

      <section className="mb-8">
        <h2 className="mb-3 text-sm font-medium text-white">按区域统计</h2>
        <div className="overflow-x-auto rounded-xl border border-dashboard-neutral/15">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="border-b border-dashboard-neutral/15 bg-white/[0.03] text-xs text-dashboard-neutral/60">
              <tr>
                <th className="px-3 py-2 font-medium">区域</th>
                <th className="px-3 py-2 font-medium">人物数</th>
                <th className="px-3 py-2 font-medium">样例</th>
                <th className="px-3 py-2 font-medium">地图</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dashboard-neutral/10">
              {regions.map((region) => (
                <tr key={region.id} className="hover:bg-white/[0.02]">
                  <td className="px-3 py-2 text-white">{region.name}</td>
                  <td className="px-3 py-2 tabular-nums text-dashboard-military">
                    {persons.byRegion[region.id] ?? 0}
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex flex-wrap gap-1">
                      {(persons.samples[region.id] ?? []).map((p) => (
                        <span
                          key={p.id}
                          className="rounded bg-black/30 px-1.5 py-0.5 text-[10px] text-dashboard-neutral/80"
                          title={p.role}
                        >
                          {p.name}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-3 py-2">
                    <Link
                      href={`/?region=${region.id}&layers=persons`}
                      className="text-xs text-dashboard-military hover:underline"
                    >
                      预览
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="mb-3 text-sm font-medium text-white">按领域统计</h2>
        <div className="flex flex-wrap gap-2">
          {DOMAIN_LABELS.map((d) => (
            <span
              key={d}
              className="rounded-lg border border-dashboard-neutral/15 bg-white/[0.02] px-3 py-2 text-sm"
            >
              <span className="text-dashboard-neutral/60">{d}</span>
              <span className="ml-2 tabular-nums font-medium text-white">
                {persons.byDomain[d]}
              </span>
            </span>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-sm font-medium text-white">头像策略</h2>
        <p className="mb-3 text-xs leading-relaxed text-dashboard-neutral/65">
          <code className="text-dashboard-military">resolvePersonAvatar</code> 解析链：种子显式
          avatar → Wikipedia 预设（avatar-presets.ts）→ Dicebear 7.x initials SVG。组件层加载失败时降级为领域色首字母圆。
        </p>
        <div className="overflow-x-auto rounded-xl border border-dashboard-neutral/15">
          <table className="w-full min-w-[480px] text-left text-sm">
            <thead className="border-b border-dashboard-neutral/15 bg-white/[0.03] text-xs text-dashboard-neutral/60">
              <tr>
                <th className="px-3 py-2 font-medium">样例人物</th>
                <th className="px-3 py-2 font-medium">领域</th>
                <th className="px-3 py-2 font-medium">头像来源</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dashboard-neutral/10">
              {Object.values(persons.samples)
                .flat()
                .slice(0, 12)
                .map((p) => (
                  <tr key={p.id} className="hover:bg-white/[0.02]">
                    <td className="px-3 py-2 text-white">{p.name}</td>
                    <td className="px-3 py-2 text-dashboard-neutral/70">{p.domain}</td>
                    <td className="px-3 py-2">
                      <AdminBadge
                        variant={p.avatarKind === 'wikipedia' ? 'success' : 'muted'}
                        label={AVATAR_KIND_LABEL[p.avatarKind]}
                      />
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
