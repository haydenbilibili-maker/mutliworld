/**
 * 人物去重与数据质检工具（资料库专项）
 *
 * 解决核心问题：ALL_PERSONS 按 id 去重，但跨区域文件中同一人物用不同 id
 * （如习近平 = per-g-15 + per-cn-1），导致 256 条中存在大量"同人不同 id"重复。
 * 资料库列表页/详情页需要按 name 去重的唯一人物视图。
 *
 * 设计约定：
 *  - 按 name（中文名）去重，合并 regionIds，保留信息最完整的条目作为主体
 *  - "信息最完整" = 已填充字段数最多（含资料库扩展字段权重更高）
 *  - 质检工具用于管理后台：检测缺字段、疑似重复、头像降级等
 */

import type { Person, PersonDomain, PersonStatus } from '@/types/person';
import type { RegionId } from '@/types/region';

/**
 * 计算人物条目的"信息完整度"分数，用于去重时择优保留。
 * 资料库扩展字段（career/sources/birthYear 等）权重更高，
 * 鼓励保留信息更丰富的条目。
 */
function infoScore(p: Person): number {
  let score = 0;
  // 基础字段（每项 1 分）
  if (p.nameEn) score += 1;
  if (p.bio && p.bio.length > 20) score += 1;
  if (p.since) score += 1;
  if (p.status) score += 1;
  if (p.wikipedia) score += 2;
  if (p.avatar && !p.avatar.includes('dicebear')) score += 2;
  if (p.actions?.length) score += p.actions.length;
  // 资料库扩展字段（权重更高，每项 2-3 分）
  if (p.birthYear) score += 3;
  if (p.nationality) score += 2;
  if (p.party) score += 2;
  if (p.education?.length) score += 2 * p.education.length;
  if (p.career?.length) score += 3 * p.career.length;
  if (p.netWorthUsd != null) score += 2;
  if (p.aliases?.length) score += 1;
  if (p.sources?.length) score += 2 * p.sources.length;
  if (p.tags?.length) score += 1 * p.tags.length;
  return score;
}

/**
 * 按 name 去重人物列表，合并 regionIds，保留信息最完整的条目。
 * @returns 去重后的唯一人物数组（顺序稳定，按首次出现排序）
 */
export function dedupePersonsByName(persons: Person[]): Person[] {
  const byName = new Map<string, Person>();
  for (const p of persons) {
    const existing = byName.get(p.name);
    if (!existing) {
      byName.set(p.name, p);
      continue;
    }
    // 同名：择优保留信息更完整的，合并 regionIds
    const keeper = infoScore(p) >= infoScore(existing) ? p : existing;
    const merged: Person = {
      ...keeper,
      regionIds: Array.from(new Set([...existing.regionIds, ...p.regionIds])),
    };
    byName.set(p.name, merged);
  }
  return Array.from(byName.values());
}

/**
 * 获取去重后的唯一人物列表（按 name 去重）。
 * 结果按领域 → 姓名排序，便于资料库稳定展示。
 */
export function getUniquePersons(persons: Person[]): Person[] {
  const deduped = dedupePersonsByName(persons);
  const domainOrder: PersonDomain[] = ['政治', '经济', '军事', '社会', '文化'];
  return deduped.sort((a, b) => {
    const da = domainOrder.indexOf(a.domain);
    const db = domainOrder.indexOf(b.domain);
    if (da !== db) return da - db;
    return a.name.localeCompare(b.name, 'zh-CN');
  });
}

// ── 数据质检工具（管理后台用） ──

export interface PersonQualityReport {
  /** 总数（去重前） */
  totalRaw: number;
  /** 总数（去重后） */
  totalUnique: number;
  /** 疑似重复（同名不同 id） */
  duplicates: { name: string; ids: string[] }[];
  /** 缺 nameEn */
  missingNameEn: Person[];
  /** 缺 wikipedia */
  missingWikipedia: Person[];
  /** 缺 bio 或 bio 过短（<10 字） */
  thinBio: Person[];
  /** 头像降级为 Dicebear（无真实头像） */
  dicebearAvatar: Person[];
  /** 缺坐标（lng/lat 为 0） */
  missingCoords: Person[];
}

/** 生成数据质检报告 */
export function auditPersons(persons: Person[]): PersonQualityReport {
  // 同名分组（检测重复）
  const nameGroups = new Map<string, Person[]>();
  for (const p of persons) {
    const arr = nameGroups.get(p.name) ?? [];
    arr.push(p);
    nameGroups.set(p.name, arr);
  }
  const duplicates = Array.from(nameGroups.entries())
    .filter(([, arr]) => arr.length > 1)
    .map(([name, arr]) => ({ name, ids: arr.map((p) => p.id) }));

  const unique = dedupePersonsByName(persons);

  return {
    totalRaw: persons.length,
    totalUnique: unique.length,
    duplicates,
    missingNameEn: unique.filter((p) => !p.nameEn),
    missingWikipedia: unique.filter((p) => !p.wikipedia),
    thinBio: unique.filter((p) => !p.bio || p.bio.length < 10),
    dicebearAvatar: unique.filter(
      (p) => !p.avatar || p.avatar.includes('dicebear'),
    ),
    missingCoords: unique.filter((p) => p.lng === 0 && p.lat === 0),
  };
}

// ── 统计工具（图表用） ──

/** 按领域计数 */
export function countByDomain(persons: Person[]): Record<PersonDomain, number> {
  const out: Record<PersonDomain, number> = {
    政治: 0,
    经济: 0,
    社会: 0,
    文化: 0,
    军事: 0,
  };
  for (const p of persons) out[p.domain]++;
  return out;
}

/** 按状态计数 */
export function countByStatus(
  persons: Person[],
): Record<PersonStatus | 'unknown', number> {
  const out: Record<PersonStatus | 'unknown', number> = {
    active: 0,
    restricted: 0,
    deceased: 0,
    unknown: 0,
  };
  for (const p of persons) {
    const key = p.status ?? 'unknown';
    out[key]++;
  }
  return out;
}

/** 按 regionId 计数（含跨区人物在多个区域的计数） */
export function countByRegion(
  persons: Person[],
): Partial<Record<RegionId, number>> {
  const out: Partial<Record<RegionId, number>> = {};
  for (const p of persons) {
    for (const r of p.regionIds) {
      out[r] = (out[r] ?? 0) + 1;
    }
  }
  return out;
}

/**
 * 按代际（出生/任职年份）分桶，用于时间轴图表。
 * 优先用 birthYear，其次 since。
 */
export function bucketByDecade(persons: Person[]): { decade: string; count: number }[] {
  const buckets = new Map<number, number>();
  for (const p of persons) {
    const year = p.birthYear ?? p.since;
    if (year == null || !Number.isFinite(year)) continue;
    const decade = Math.floor(year / 10) * 10;
    buckets.set(decade, (buckets.get(decade) ?? 0) + 1);
  }
  return Array.from(buckets.entries())
    .sort((a, b) => a[0] - b[0])
    .map(([decade, count]) => ({ decade: `${decade}s`, count }));
}
