'use client';

/**
 * 人物资料库浏览器（资料库列表页核心交互组件）
 * 搜索 + 多维筛选（领域/区域/状态） + 卡片网格 + 分页。
 * 复用 AdminSearchInput / filterTableRows / PersonAvatar。
 */

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { AdminSearchInput, filterTableRows } from '@/components/admin/AdminSearchInput';
import { PersonAvatar } from '@/components/person/PersonAvatar';
import type { Person, PersonDomain } from '@/types/person';
import type { RegionId } from '@/types/region';

interface PersonsLibraryBrowserProps {
  persons: Person[];
  /** 预设筛选（如从 URL 带来的 region/domain） */
  initialDomain?: PersonDomain | 'all';
  initialRegion?: RegionId | 'all';
}

const DOMAIN_FILTERS: (PersonDomain | 'all')[] = [
  'all',
  '政治',
  '经济',
  '军事',
  '社会',
  '文化',
];

const DOMAIN_COLOR: Record<PersonDomain, string> = {
  政治: '#3b82f6',
  经济: '#22c55e',
  社会: '#f59e0b',
  文化: '#a855f7',
  军事: '#ef4444',
};

const STATUS_LABEL: Record<string, string> = {
  active: '活跃',
  restricted: '受限',
  deceased: '已故',
};

const PAGE_SIZE = 24;

export function PersonsLibraryBrowser({
  persons,
  initialDomain = 'all',
  initialRegion = 'all',
}: PersonsLibraryBrowserProps) {
  const [query, setQuery] = useState('');
  const [domain, setDomain] = useState<PersonDomain | 'all'>(initialDomain);
  const [region, setRegion] = useState<RegionId | 'all'>(initialRegion);
  const [page, setPage] = useState(0);

  // 当前数据集里实际存在的区域（动态生成区域筛选 chips）
  const availableRegions = useMemo(() => {
    const set = new Set<RegionId>();
    for (const p of persons) for (const r of p.regionIds) set.add(r);
    return Array.from(set);
  }, [persons]);

  const filtered = useMemo(() => {
    let list = filterTableRows(persons, query, (p) =>
      [p.name, p.nameEn ?? '', p.role, p.bio, p.nationality ?? ''].join(' '),
    );
    if (domain !== 'all') list = list.filter((p) => p.domain === domain);
    if (region !== 'all') list = list.filter((p) => p.regionIds.includes(region));
    return list;
  }, [persons, query, domain, region]);

  // 重置分页（筛选/搜索变化时）
  const filterKey = `${query}|${domain}|${region}`;
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages - 1);
  const pageItems = filtered.slice(safePage * PAGE_SIZE, (safePage + 1) * PAGE_SIZE);

  // 筛选变化时回到第一页
  const onFilterChange = <T,>(setter: (v: T) => void) => (v: T) => {
    setter(v);
    setPage(0);
  };

  return (
    <div>
      {/* 搜索 + 筛选栏 */}
      <div className="mb-4 space-y-3">
        <AdminSearchInput
          value={query}
          onChange={onFilterChange(setQuery)}
          placeholder="搜索姓名 / 职务 / 国籍 / 简介…"
          className="max-w-md"
        />

        {/* 领域筛选 */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[10px] text-dashboard-neutral/45">领域</span>
          {DOMAIN_FILTERS.map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => onFilterChange(setDomain)(d)}
              aria-pressed={domain === d}
              className={[
                'rounded-md px-2 py-1 text-[11px] transition-colors',
                domain === d
                  ? 'bg-brand-cyan/20 text-brand-cyan'
                  : 'text-dashboard-neutral/70 hover:bg-white/5 hover:text-white',
              ].join(' ')}
            >
              {d === 'all' ? '全部' : d}
            </button>
          ))}
        </div>

        {/* 区域筛选 */}
        {availableRegions.length > 1 && (
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[10px] text-dashboard-neutral/45">区域</span>
            <button
              type="button"
              onClick={() => onFilterChange(setRegion)('all' as RegionId | 'all')}
              aria-pressed={region === 'all'}
              className={[
                'rounded-md px-2 py-1 text-[11px] transition-colors',
                region === 'all'
                  ? 'bg-brand-cyan/20 text-brand-cyan'
                  : 'text-dashboard-neutral/70 hover:bg-white/5 hover:text-white',
              ].join(' ')}
            >
              全部
            </button>
            {availableRegions.map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => onFilterChange(setRegion)(r)}
                aria-pressed={region === r}
                className={[
                  'rounded-md px-2 py-1 text-[11px] transition-colors',
                  region === r
                    ? 'bg-brand-cyan/20 text-brand-cyan'
                    : 'text-dashboard-neutral/70 hover:bg-white/5 hover:text-white',
                ].join(' ')}
              >
                {r}
              </button>
            ))}
          </div>
        )}

        <div className="text-[11px] text-dashboard-neutral/55">
          共 <span className="tabular-nums text-white">{filtered.length}</span> 人
          {filtered.length !== persons.length && (
            <span className="text-dashboard-neutral/40">
              {' '}
              （筛选自 {persons.length}）
            </span>
          )}
        </div>
      </div>

      {/* 人物卡片网格 */}
      {pageItems.length === 0 ? (
        <div className="rounded-xl border border-dashboard-neutral/15 bg-white/[0.02] py-12 text-center text-sm text-dashboard-neutral/50">
          未找到匹配的人物。尝试调整搜索或筛选条件。
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {pageItems.map((p) => (
            <PersonCard key={p.id} person={p} />
          ))}
        </div>
      )}

      {/* 分页 */}
      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-center gap-2">
          <button
            type="button"
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={safePage === 0}
            className="rounded-md border border-dashboard-neutral/20 px-3 py-1.5 text-xs text-dashboard-neutral/80 transition-colors hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-40"
          >
            ← 上一页
          </button>
          <span className="tabular-nums text-xs text-dashboard-neutral/60">
            {safePage + 1} / {totalPages}
          </span>
          <button
            type="button"
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={safePage >= totalPages - 1}
            className="rounded-md border border-dashboard-neutral/20 px-3 py-1.5 text-xs text-dashboard-neutral/80 transition-colors hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-40"
          >
            下一页 →
          </button>
        </div>
      )}
      {/* filterKey 引用避免未使用告警，同时语义标记筛选状态键 */}
      <span className="sr-only" aria-hidden>
        {filterKey}
      </span>
    </div>
  );
}

/** 人物卡片（网格单元） */
function PersonCard({ person: p }: { person: Person }) {
  const color = DOMAIN_COLOR[p.domain];
  return (
    <Link
      href={`/persons/${p.id}`}
      className="group block rounded-xl border border-dashboard-neutral/15 bg-white/[0.02] p-3 transition-colors hover:border-dashboard-neutral/30 hover:bg-white/[0.05]"
    >
      <div className="flex items-start gap-3">
        <PersonAvatar person={p} size={44} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="truncate text-sm font-medium text-white group-hover:text-brand-cyan">
              {p.name}
            </span>
            {p.status && p.status !== 'active' && (
              <span className="text-[9px] text-amber-400/80">
                {STATUS_LABEL[p.status]}
              </span>
            )}
          </div>
          <div className="truncate text-[11px] text-dashboard-neutral/60">
            {p.role}
          </div>
          {p.nationality && (
            <div className="text-[10px] text-dashboard-neutral/45">
              {p.nationality}
            </div>
          )}
        </div>
        <span
          className="shrink-0 rounded px-1.5 py-0.5 text-[10px] font-medium"
          style={{ color, backgroundColor: `${color}22` }}
        >
          {p.domain}
        </span>
      </div>
      <p className="mt-2 line-clamp-2 text-[11px] leading-relaxed text-dashboard-neutral/70">
        {p.bio}
      </p>
      <div className="mt-2 flex items-center justify-between">
        {p.since && (
          <span className="text-[10px] tabular-nums text-dashboard-neutral/40">
            相关年份 {p.since}
          </span>
        )}
        <span className="text-[10px] text-brand-cyan/0 group-hover:text-brand-cyan/70">
          查看详情 →
        </span>
      </div>
    </Link>
  );
}
