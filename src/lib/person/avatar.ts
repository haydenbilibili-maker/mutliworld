import type { Person, PersonDomain } from '@/types/person';
import { WIKIPEDIA_AVATAR_PRESETS } from '@/lib/person/avatar-presets';

/** 领域色 — Dicebear 背景与离线首字母圆 */
export const DOMAIN_AVATAR_COLORS: Record<PersonDomain, string> = {
  政治: '3b82f6',
  经济: '22c55e',
  社会: 'f59e0b',
  文化: 'a855f7',
  军事: 'ef4444',
};

export const DOMAIN_AVATAR_HEX: Record<PersonDomain, string> = {
  政治: '#3b82f6',
  经济: '#22c55e',
  社会: '#f59e0b',
  文化: '#a855f7',
  军事: '#ef4444',
};

const DICEBEAR_HOST = 'api.dicebear.com';
const WIKIMEDIA_HOST = 'upload.wikimedia.org';

/** Dicebear 首字母 SVG（无 API Key） */
export function dicebearAvatarUrl(name: string, domain: PersonDomain): string {
  const seed = encodeURIComponent(name.trim() || '未知');
  const bg = DOMAIN_AVATAR_COLORS[domain];
  return `https://${DICEBEAR_HOST}/7.x/initials/svg?seed=${seed}&backgroundColor=${bg}`;
}

function isWikipediaUrl(url: string): boolean {
  return url.includes(WIKIMEDIA_HOST);
}

function isDicebearUrl(url: string): boolean {
  return url.includes(DICEBEAR_HOST);
}

/** 提取显示用首字母（中文取前两字，西文取词首） */
export function personInitials(name: string): string {
  const trimmed = name.trim();
  if (!trimmed) return '?';
  if (/[\u4e00-\u9fff]/.test(trimmed)) {
    return trimmed.slice(0, 2);
  }
  const parts = trimmed.split(/[\s·.]+/).filter(Boolean);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return trimmed.slice(0, 2).toUpperCase();
}

/**
 * 头像解析链：显式 avatar → Wikipedia 预设 → Dicebear 生成
 * 组件层 onError 可再降级为首字母圆
 */
export function resolvePersonAvatar(person: Person): string {
  if (person.avatar?.trim()) return person.avatar.trim();
  const preset = WIKIPEDIA_AVATAR_PRESETS[person.id];
  if (preset) return preset;
  return dicebearAvatarUrl(person.name, person.domain);
}

export type AvatarSourceKind = 'custom' | 'wikipedia' | 'generated';

export function classifyAvatarSource(person: Person): AvatarSourceKind {
  const url = resolvePersonAvatar(person);
  if (person.avatar?.trim() && !isDicebearUrl(url) && !isWikipediaUrl(url)) {
    return 'custom';
  }
  if (isWikipediaUrl(url) || WIKIPEDIA_AVATAR_PRESETS[person.id]) {
    return 'wikipedia';
  }
  return 'generated';
}

export interface PersonAvatarStats {
  total: number;
  wikipedia: number;
  generated: number;
  custom: number;
}

export function getPersonAvatarStats(persons: Person[]): PersonAvatarStats {
  const stats: PersonAvatarStats = { total: persons.length, wikipedia: 0, generated: 0, custom: 0 };
  for (const p of persons) {
    const kind = classifyAvatarSource(p);
    stats[kind]++;
  }
  return stats;
}
