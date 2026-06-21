/**
 * 人物信息框（维基百科式 infobox）— 详情页右侧固定栏
 * 大头像 + 结构化字段表 + 坐标定位 + 领域/区域标签。
 * Server Component（无交互态），数据直接从 Person 渲染。
 */

import Link from 'next/link';
import { resolvePersonAvatar } from '@/lib/person/avatar';
import { DOMAIN_AVATAR_HEX } from '@/lib/person/avatar';
import type { Person } from '@/types/person';
import type { RegionId } from '@/types/region';

interface PersonInfoboxProps {
  person: Person;
  className?: string;
}

const STATUS_LABEL: Record<string, string> = {
  active: '活跃',
  restricted: '受限',
  deceased: '已故',
};

/** 净资产格式化（美元 → 可读） */
function fmtNetWorth(usd: number): string {
  if (usd >= 1_000_000_000) return `${(usd / 1_000_000_000).toFixed(1)} 十亿美元`;
  if (usd >= 1_000_000) return `${(usd / 1_000_000).toFixed(1)} 百万美元`;
  return `${usd.toLocaleString('en-US')} 美元`;
}

/** infobox 行（label: value） */
function FieldRow({ label, children }: { label: string; children: React.ReactNode }) {
  if (children == null || children === '') return null;
  return (
    <div className="flex gap-2 border-b border-dashboard-neutral/8 py-1.5 last:border-0">
      <span className="w-16 shrink-0 text-[11px] text-dashboard-neutral/45">{label}</span>
      <span className="flex-1 text-[11px] text-dashboard-neutral/90">{children}</span>
    </div>
  );
}

export function PersonInfobox({ person: p, className = '' }: PersonInfoboxProps) {
  const color = DOMAIN_AVATAR_HEX[p.domain];
  const avatarUrl = resolvePersonAvatar(p);
  const lifeSpan =
    p.birthYear != null
      ? `${p.birthYear}${p.deathYear != null ? ` – ${p.deathYear}` : ' –'}`
      : p.deathYear != null
        ? `– ${p.deathYear}`
        : null;

  // 收集所有引用来源（wikipedia + sources[]）
  const allSources = [
    ...(p.wikipedia ? [{ label: '维基百科', url: p.wikipedia }] : []),
    ...(p.sources ?? []),
  ];

  return (
    <aside
      className={`rounded-xl border border-dashboard-neutral/15 bg-white/[0.02] p-4 ${className}`}
    >
      {/* 大头像 */}
      <div className="flex flex-col items-center text-center">
        <img
          src={avatarUrl}
          alt={p.name}
          width={120}
          height={120}
          className="rounded-lg border-2 object-cover"
          style={{ borderColor: color }}
          loading="lazy"
          decoding="async"
        />
        <h2 className="mt-3 text-base font-semibold text-white">{p.name}</h2>
        {p.nameEn && (
          <p className="text-[11px] text-dashboard-neutral/55">{p.nameEn}</p>
        )}
        <p className="mt-0.5 text-xs text-dashboard-neutral/70">{p.role}</p>
        {/* 领域标签 */}
        <span
          className="mt-2 rounded px-2 py-0.5 text-[10px] font-medium"
          style={{ color, backgroundColor: `${color}22` }}
        >
          {p.domain}
        </span>
        {/* 状态 */}
        {p.status && p.status !== 'active' && (
          <span className="mt-1 text-[10px] text-amber-400/80">
            {STATUS_LABEL[p.status]}
          </span>
        )}
      </div>

      {/* 结构化字段表 */}
      <div className="mt-4">
        <FieldRow label="生卒">{lifeSpan}</FieldRow>
        <FieldRow label="国籍">{p.nationality}</FieldRow>
        <FieldRow label="政党">{p.party}</FieldRow>
        <FieldRow label="阵营">{p.faction}</FieldRow>
        <FieldRow label="任职">
          {p.since ? `${p.since} 年起` : null}
        </FieldRow>
        <FieldRow label="净值">
          {p.netWorthUsd != null ? fmtNetWorth(p.netWorthUsd) : null}
        </FieldRow>
        <FieldRow label="坐标">
          {p.lng !== 0 || p.lat !== 0
            ? `${p.lat.toFixed(2)}°, ${p.lng.toFixed(2)}°`
            : null}
        </FieldRow>
      </div>

      {/* 教育 */}
      {p.education && p.education.length > 0 && (
        <div className="mt-3 border-t border-dashboard-neutral/8 pt-2">
          <div className="mb-1 text-[10px] text-dashboard-neutral/45">教育</div>
          <ul className="space-y-0.5">
            {p.education.map((e, i) => (
              <li key={i} className="text-[11px] text-dashboard-neutral/85">
                {e}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 别名 */}
      {p.aliases && p.aliases.length > 0 && (
        <div className="mt-3 border-t border-dashboard-neutral/8 pt-2">
          <div className="mb-1 text-[10px] text-dashboard-neutral/45">别名</div>
          <div className="flex flex-wrap gap-1">
            {p.aliases.map((a, i) => (
              <span
                key={i}
                className="rounded bg-white/5 px-1.5 py-0.5 text-[10px] text-dashboard-neutral/70"
              >
                {a}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* 标签 */}
      {p.tags && p.tags.length > 0 && (
        <div className="mt-3 border-t border-dashboard-neutral/8 pt-2">
          <div className="mb-1 text-[10px] text-dashboard-neutral/45">标签</div>
          <div className="flex flex-wrap gap-1">
            {p.tags.map((t, i) => (
              <span
                key={i}
                className="rounded bg-brand-cyan/10 px-1.5 py-0.5 text-[10px] text-brand-cyan/80"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* 区域标签 */}
      <div className="mt-3 border-t border-dashboard-neutral/8 pt-2">
        <div className="mb-1 text-[10px] text-dashboard-neutral/45">所属区域</div>
        <div className="flex flex-wrap gap-1">
          {p.regionIds.map((r) => (
            <span
              key={r}
              className="rounded bg-white/5 px-1.5 py-0.5 text-[10px] text-dashboard-neutral/70"
            >
              {r}
            </span>
          ))}
        </div>
      </div>

      {/* 地图定位按钮 */}
      {(p.lng !== 0 || p.lat !== 0) && (
        <Link
          href={`/?lat=${p.lat}&lon=${p.lng}&zoom=5&layers=persons`}
          className="mt-3 block rounded-md border border-dashboard-military/30 bg-dashboard-military/10 px-3 py-1.5 text-center text-[11px] text-dashboard-military transition-colors hover:bg-dashboard-military/20"
        >
          📍 在地图上定位
        </Link>
      )}

      {/* 引用来源 */}
      {allSources.length > 0 && (
        <div className="mt-3 border-t border-dashboard-neutral/8 pt-2">
          <div className="mb-1 text-[10px] text-dashboard-neutral/45">引用来源</div>
          <ul className="space-y-0.5">
            {allSources.map((s, i) => (
              <li key={i}>
                <a
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] text-brand-cyan hover:text-white"
                >
                  [{i + 1}] {s.label} ↗
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </aside>
  );
}
