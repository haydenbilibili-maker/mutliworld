import Link from 'next/link';
import { UNIQUE_PERSONS, ALL_PERSONS } from '@/regions/persons';
import { auditPersons } from '@/lib/persons/dedup';
import { PersonCharts } from '@/components/persons/PersonCharts';
import { PersonsLibraryBrowser } from '@/components/persons/PersonsLibraryBrowser';

export const metadata = {
  title: '全球政经人物资料库 · 万象幻测',
  description: '政治/经济/军事/社会/文化领域全球公众人物资料库，维基百科式信息密度与可视化。',
};

export default function PersonsLibraryPage() {
  const unique = UNIQUE_PERSONS;
  const report = auditPersons(ALL_PERSONS);
  const wikiCount = unique.filter((p) => p.wikipedia).length;
  const wikiRatio = unique.length > 0 ? Math.round((wikiCount / unique.length) * 100) : 0;

  const stats = [
    { label: '去重人物总数', value: report.totalUnique, sub: `原始 ${report.totalRaw} 条` },
    { label: '领域覆盖', value: '5', sub: '政治·经济·军事·社会·文化' },
    { label: '区域覆盖', value: '9', sub: '全球 · 8 大区域' },
    { label: '维基百科链接', value: `${wikiRatio}%`, sub: `${wikiCount} 人有外链` },
  ];

  return (
    <main className="min-h-screen bg-dashboard-bg text-white">
      {/* 顶栏 */}
      <header className="sticky top-0 z-40 border-b border-dashboard-neutral/15 bg-dashboard-bg/95 px-4 py-3 backdrop-blur-md sm:px-6">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="rounded-md border border-dashboard-neutral/20 px-2.5 py-1.5 text-xs text-dashboard-neutral/70 transition-colors hover:bg-white/5 hover:text-white"
            >
              ← 态势地图
            </Link>
            <h1 className="text-base font-semibold text-white sm:text-lg">
              全球政经人物资料库
            </h1>
          </div>
          <span className="text-[11px] text-dashboard-neutral/45">
            万象幻测 · 人物档案
          </span>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        {/* 统计概览 */}
        <section className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s) => (
            <div
              key={s.label}
              className="rounded-xl border border-dashboard-neutral/15 bg-white/[0.02] p-4"
            >
              <p className="text-xs text-dashboard-neutral/55">{s.label}</p>
              <p className="mt-1 text-2xl font-semibold tabular-nums text-white">
                {s.value}
              </p>
              <p className="mt-0.5 text-[10px] text-dashboard-neutral/45">{s.sub}</p>
            </div>
          ))}
        </section>

        {/* 可视化图表 */}
        <section className="mb-8">
          <h2 className="mb-3 text-sm font-medium text-white">数据可视化</h2>
          <PersonCharts persons={unique} />
        </section>

        {/* 人物浏览 */}
        <section className="mb-8">
          <h2 className="mb-3 text-sm font-medium text-white">人物档案</h2>
          <PersonsLibraryBrowser persons={unique} />
        </section>

        {/* footer */}
        <footer className="border-t border-dashboard-neutral/10 pt-4 text-[10px] leading-relaxed text-dashboard-neutral/40">
          公开人物档案 · 中立并陈 · 坐标为代表性驻地。
          数据源：ALL_PERSONS 种子库（按姓名去重），头像解析链 Wikipedia → Dicebear → 领域色首字母。
          资料库扩展字段（履历/政党/净值等）渐进填充，空值如实标注。
        </footer>
      </div>
    </main>
  );
}
