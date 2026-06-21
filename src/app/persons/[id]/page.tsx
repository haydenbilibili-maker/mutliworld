import Link from 'next/link';
import { notFound } from 'next/navigation';
import { UNIQUE_PERSONS, getPersonById } from '@/regions/persons';
import { PersonInfobox } from '@/components/persons/PersonInfobox';
import { PersonCareerTimeline } from '@/components/persons/PersonCareerTimeline';

/** 预生成全部人物详情静态页（SEO + 快速访问） */
export function generateStaticParams() {
  return UNIQUE_PERSONS.map((p) => ({ id: p.id }));
}

/** 动态生成 metadata（SEO） */
export function generateMetadata({ params }: { params: { id: string } }) {
  const person = getPersonById(params.id);
  if (!person) return { title: '人物未找到 · 万象幻测' };
  return {
    title: `${person.name} · 人物资料 · 万象幻测`,
    description: `${person.role} — ${person.bio}`,
  };
}

export default function PersonDetailPage({ params }: { params: { id: string } }) {
  const person = getPersonById(params.id);
  if (!person) notFound();

  const p = person;
  const idx = UNIQUE_PERSONS.findIndex((x) => x.id === p.id);
  const prev = idx > 0 ? UNIQUE_PERSONS[idx - 1] : null;
  const next = idx < UNIQUE_PERSONS.length - 1 ? UNIQUE_PERSONS[idx + 1] : null;

  const hasCareer = (p.career?.length ?? 0) > 0;
  const hasActions = (p.actions?.length ?? 0) > 0;
  const hasTimeline = hasCareer || hasActions;

  return (
    <main className="min-h-screen bg-dashboard-bg text-white">
      {/* 顶栏 */}
      <header className="sticky top-0 z-40 border-b border-dashboard-neutral/15 bg-dashboard-bg/95 px-4 py-3 backdrop-blur-md sm:px-6">
        <div className="mx-auto flex max-w-6xl items-center gap-3">
          <Link
            href="/persons"
            className="rounded-md border border-dashboard-neutral/20 px-2.5 py-1.5 text-xs text-dashboard-neutral/70 transition-colors hover:bg-white/5 hover:text-white"
          >
            ← 资料库
          </Link>
          <span className="truncate text-sm text-dashboard-neutral/60">
            人物档案
          </span>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
        {/* 双栏布局：左主栏 + 右信息框 */}
        <div className="flex flex-col gap-6 lg:flex-row">
          {/* 左主栏 */}
          <article className="min-w-0 flex-1">
            {/* 标题区 */}
            <header className="mb-4 border-b border-dashboard-neutral/15 pb-4">
              <h1 className="text-2xl font-bold text-white">{p.name}</h1>
              {p.nameEn && (
                <p className="mt-0.5 text-sm text-dashboard-neutral/55">{p.nameEn}</p>
              )}
              {p.aliases && p.aliases.length > 0 && (
                <p className="mt-0.5 text-[11px] text-dashboard-neutral/45">
                  又称：{p.aliases.join('、')}
                </p>
              )}
              <p className="mt-1 text-sm text-dashboard-neutral/75">{p.role}</p>
            </header>

            {/* Lead 段 */}
            <section className="mb-6">
              <p className="text-sm leading-relaxed text-dashboard-neutral/90">
                {p.bio}
              </p>
            </section>

            {/* 履历时间线 + 关联行动 */}
            {hasTimeline && (
              <section className="mb-6">
                <h2 className="mb-3 text-sm font-medium text-white">履历与行动</h2>
                {hasCareer && (
                  <div className="mb-4">
                    <h3 className="mb-2 text-[11px] text-dashboard-neutral/50">职务履历</h3>
                    <PersonCareerTimeline career={p.career!} />
                  </div>
                )}
                {hasActions && (
                  <div>
                    <h3 className="mb-2 text-[11px] text-dashboard-neutral/50">关联行动</h3>
                    <div className="space-y-2">
                      {p.actions!.map((a, i) => (
                        <div
                          key={i}
                          className="rounded-lg border border-dashboard-neutral/12 bg-white/[0.02] p-2.5"
                        >
                          <div className="flex items-baseline gap-2">
                            <span className="text-xs font-medium text-white">
                              {a.codeName}
                            </span>
                            <span className="text-[10px] tabular-nums text-dashboard-neutral/50">
                              {a.date}
                            </span>
                          </div>
                          {a.description && (
                            <p className="mt-0.5 text-[11px] leading-relaxed text-dashboard-neutral/75">
                              {a.description}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </section>
            )}

            {/* 暂无扩展数据提示 */}
            {!hasTimeline && !p.nationality && !p.party && (
              <section className="mb-6 rounded-lg border border-dashboard-neutral/10 bg-white/[0.01] p-4 text-center text-[11px] text-dashboard-neutral/40">
                该人物的资料库扩展信息（履历/政党/净值等）尚未填充，
                当前展示基础档案。维基百科式详情将随数据渐进丰富。
              </section>
            )}

            {/* 相邻导航 */}
            <nav className="mt-8 flex items-center justify-between gap-4 border-t border-dashboard-neutral/15 pt-4">
              {prev ? (
                <Link
                  href={`/persons/${prev.id}`}
                  className="group flex min-w-0 flex-1 items-center gap-2 rounded-lg border border-dashboard-neutral/15 bg-white/[0.02] px-3 py-2 transition-colors hover:bg-white/5"
                >
                  <span className="text-dashboard-neutral/40">←</span>
                  <span className="min-w-0">
                    <span className="block text-[10px] text-dashboard-neutral/45">上一个</span>
                    <span className="block truncate text-xs text-white group-hover:text-brand-cyan">
                      {prev.name}
                    </span>
                  </span>
                </Link>
              ) : (
                <span className="flex-1" />
              )}
              {next ? (
                <Link
                  href={`/persons/${next.id}`}
                  className="group flex min-w-0 flex-1 items-center justify-end gap-2 rounded-lg border border-dashboard-neutral/15 bg-white/[0.02] px-3 py-2 text-right transition-colors hover:bg-white/5"
                >
                  <span className="min-w-0">
                    <span className="block text-[10px] text-dashboard-neutral/45">下一个</span>
                    <span className="block truncate text-xs text-white group-hover:text-brand-cyan">
                      {next.name}
                    </span>
                  </span>
                  <span className="text-dashboard-neutral/40">→</span>
                </Link>
              ) : (
                <span className="flex-1" />
              )}
            </nav>
          </article>

          {/* 右信息框（桌面固定，移动端在下方） */}
          <div className="lg:w-80 lg:shrink-0">
            <div className="lg:sticky lg:top-20">
              <PersonInfobox person={p} />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
