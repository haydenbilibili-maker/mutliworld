'use client';

/**
 * 管理后台人物表格（资料库专项）
 * 可搜索（name/id/role/nationality）+ 可按领域筛选的标准表格，
 * 每行含「查看详情→」（跳转 /persons/[id]）。仿 AdminLayersTable 模式。
 */

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { AdminSearchInput, filterTableRows } from '@/components/admin/AdminSearchInput';
import { AdminBadge } from '@/components/admin/AdminBadge';
import type { Person, PersonDomain } from '@/types/person';

const DOMAIN_FILTERS: (PersonDomain | 'all')[] = [
  'all',
  '政治',
  '经济',
  '军事',
  '社会',
  '文化',
];

interface AdminPersonsTableProps {
  persons: Person[];
}

/** 可搜索的人物配置表 */
export function AdminPersonsTable({ persons }: AdminPersonsTableProps) {
  const [query, setQuery] = useState('');
  const [domain, setDomain] = useState<PersonDomain | 'all'>('all');

  const filtered = useMemo(
    () =>
      filterTableRows(persons, query, (p) =>
        [p.id, p.name, p.nameEn ?? '', p.role, p.nationality ?? '', p.bio].join(' '),
      ).filter((p) => domain === 'all' || p.domain === domain),
    [persons, query, domain],
  );

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <AdminSearchInput
          value={query}
          onChange={setQuery}
          placeholder="搜索姓名 / ID / 职务 / 国籍…"
          className="max-w-xs"
        />
        <div className="flex flex-wrap gap-1">
          {DOMAIN_FILTERS.map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => setDomain(d)}
              aria-pressed={domain === d}
              className={[
                'rounded px-2 py-1 text-[10px] transition-colors',
                domain === d
                  ? 'bg-brand-cyan/20 text-brand-cyan'
                  : 'text-dashboard-neutral/60 hover:bg-white/5',
              ].join(' ')}
            >
              {d === 'all' ? '全部' : d}
            </button>
          ))}
        </div>
        <span className="ml-auto text-[10px] text-dashboard-neutral/45">
          共 <span className="tabular-nums">{filtered.length}</span> · 显示{' '}
          {Math.min(filtered.length, 200)} 条
        </span>
      </div>

      <div className="overflow-x-auto rounded-xl border border-dashboard-neutral/15">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="border-b border-dashboard-neutral/15 bg-white/[0.03] text-xs text-dashboard-neutral/60">
            <tr>
              <th className="px-3 py-2 font-medium">姓名</th>
              <th className="px-3 py-2 font-medium">领域</th>
              <th className="px-3 py-2 font-medium">职务</th>
              <th className="px-3 py-2 font-medium">国籍</th>
              <th className="px-3 py-2 font-medium">维基</th>
              <th className="px-3 py-2 font-medium">详情</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-dashboard-neutral/10">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-3 py-6 text-center text-xs text-dashboard-neutral/40">
                  无匹配人物
                </td>
              </tr>
            ) : (
              filtered.slice(0, 200).map((p) => (
                <tr key={p.id} className="hover:bg-white/[0.02]">
                  <td className="px-3 py-2">
                    <div className="text-white">{p.name}</div>
                    <div className="text-[10px] text-dashboard-neutral/45">{p.id}</div>
                  </td>
                  <td className="px-3 py-2 text-dashboard-neutral/70">{p.domain}</td>
                  <td className="px-3 py-2 text-dashboard-neutral/70">{p.role}</td>
                  <td className="px-3 py-2 text-dashboard-neutral/70">{p.nationality ?? '—'}</td>
                  <td className="px-3 py-2">
                    <AdminBadge
                      variant={p.wikipedia ? 'success' : 'muted'}
                      label={p.wikipedia ? '有' : '缺'}
                    />
                  </td>
                  <td className="px-3 py-2">
                    <Link
                      href={`/persons/${p.id}`}
                      target="_blank"
                      className="text-xs text-dashboard-military hover:underline"
                    >
                      查看 →
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {filtered.length > 200 && (
        <p className="mt-2 text-[10px] text-dashboard-neutral/45">
          仅显示前 200 条，请用搜索缩小范围。
        </p>
      )}
    </div>
  );
}
