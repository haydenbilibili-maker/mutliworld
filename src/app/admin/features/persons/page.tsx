import Link from 'next/link';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { AdminBadge } from '@/components/admin/AdminBadge';
import { AdminPersonsTable } from '@/components/admin/AdminPersonsTable';
import { getAdminStats } from '@/lib/admin/stats';
import { listRegions } from '@/regions';
import { UNIQUE_PERSONS, ALL_PERSONS } from '@/regions/persons';
import { auditPersons } from '@/lib/persons/dedup';
import { PersonCharts } from '@/components/persons/PersonCharts';

const DOMAIN_LABELS = ['政治', '经济', '社会', '文化', '军事'] as const;

const AVATAR_KIND_LABEL = {
  wikipedia: 'Wikipedia',
  generated: 'Dicebear',
  custom: '自定义',
} as const;

export default function AdminPersonsPage() {
  const { persons } = getAdminStats();
  const regions = listRegions();
  const report = auditPersons(ALL_PERSONS);

  return (
    <div className="mx-auto max-w-6xl">
      <AdminPageHeader
        title="区域人物 · 资料库管理"
        description="ALL_PERSONS 种子库（按姓名去重）+ 资料库扩展字段 + 数据质检。点击「查看」跳转人物详情页。"
        breadcrumbs={[
          { label: '管理后台', href: '/admin' },
          { label: '功能配置' },
          { label: '区域人物' },
        ]}
      />

      {/* 质检概览（新增） */}
      <section className="mb-6">
        <h2 className="mb-3 text-sm font-medium text-white">数据质检</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <QualityCard label="去重总数" value={report.totalUnique} sub={`原始 ${report.totalRaw} 条`} tone="ok" />
          <QualityCard
            label="疑似重复（同名不同ID）"
            value={report.duplicates.length}
            sub={report.duplicates.length > 0 ? '需人工合并' : '无'}
            tone={report.duplicates.length > 0 ? 'warn' : 'ok'}
          />
          <QualityCard
            label="缺维基百科链接"
            value={report.missingWikipedia.length}
            sub={`占 ${report.totalUnique > 0 ? Math.round((report.missingWikipedia.length / report.totalUnique) * 100) : 0}%`}
            tone={report.missingWikipedia.length > report.totalUnique / 2 ? 'warn' : 'ok'}
          />
          <QualityCard
            label="无真实头像（Dicebear 降级）"
            value={report.dicebearAvatar.length}
            sub={`占 ${report.totalUnique > 0 ? Math.round((report.dicebearAvatar.length / report.totalUnique) * 100) : 0}%`}
            tone={report.dicebearAvatar.length > report.totalUnique / 2 ? 'warn' : 'ok'}
          />
        </div>
      </section>

      {/* 可视化图表（新增） */}
      <section className="mb-8">
        <h2 className="mb-3 text-sm font-medium text-white">分布可视化</h2>
        <PersonCharts persons={UNIQUE_PERSONS} />
      </section>

      {/* 人物表格（新增：可搜索 + 详情跳转） */}
      <section className="mb-8">
        <h2 className="mb-3 text-sm font-medium text-white">人物档案表</h2>
        <AdminPersonsTable persons={UNIQUE_PERSONS} />
      </section>

      {/* 疑似重复详情（新增） */}
      {report.duplicates.length > 0 && (
        <section className="mb-8">
          <h2 className="mb-3 text-sm font-medium text-white">
            疑似重复人物 <span className="text-dashboard-neutral/45">（同名不同 ID）</span>
          </h2>
          <div className="overflow-x-auto rounded-xl border border-dashboard-neutral/15">
            <table className="w-full min-w-[420px] text-left text-sm">
              <thead className="border-b border-dashboard-neutral/15 bg-white/[0.03] text-xs text-dashboard-neutral/60">
                <tr>
                  <th className="px-3 py-2 font-medium">姓名</th>
                  <th className="px-3 py-2 font-medium">重复 ID</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dashboard-neutral/10">
                {report.duplicates.map((d) => (
                  <tr key={d.name} className="hover:bg-white/[0.02]">
                    <td className="px-3 py-2 text-white">{d.name}</td>
                    <td className="px-3 py-2">
                      <div className="flex flex-wrap gap-1">
                        {d.ids.map((id) => (
                          <span
                            key={id}
                            className="rounded bg-black/30 px-1.5 py-0.5 text-[10px] text-dashboard-neutral/70"
                          >
                            {id}
                          </span>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* 原有统计卡 */}
      <section className="mb-6">
        <h2 className="mb-3 text-sm font-medium text-white">头像策略</h2>
        <div className="mb-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
      </section>

      {/* 按领域统计 */}
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
    </div>
  );
}

/** 质检卡片 */
function QualityCard({
  label,
  value,
  sub,
  tone,
}: {
  label: string;
  value: number;
  sub: string;
  tone: 'ok' | 'warn';
}) {
  return (
    <div
      className={[
        'rounded-xl border p-4',
        tone === 'warn'
          ? 'border-amber-500/25 bg-amber-500/[0.03]'
          : 'border-dashboard-neutral/15 bg-white/[0.02]',
      ].join(' ')}
    >
      <p className="text-xs text-dashboard-neutral/55">{label}</p>
      <p
        className={[
          'mt-1 text-2xl font-semibold tabular-nums',
          tone === 'warn' ? 'text-amber-400' : 'text-white',
        ].join(' ')}
      >
        {value}
      </p>
      <p className="mt-0.5 text-[10px] text-dashboard-neutral/45">{sub}</p>
    </div>
  );
}
