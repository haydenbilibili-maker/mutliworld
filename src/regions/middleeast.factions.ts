/**
 * 中东区域 · 阵营域数据 — LIFEOS-005 阶段2
 * 由 Iran「中东冲突态势大屏」constants/factions.ts 迁入，改为 China 自包含类型。
 */

export type MideastFaction = 'us' | 'israel' | 'iran';

export const MIDEAST_FACTION_LABEL: Record<MideastFaction, string> = {
  us: '美国',
  israel: '以色列',
  iran: '伊朗',
};

export const MIDEAST_FACTION_FLAG: Record<MideastFaction, string> = {
  us: '🇺🇸',
  israel: '🇮🇱',
  iran: '🇮🇷',
};

/** 阵营色（HEX，地图/头像用）：美军蓝、以色列白、伊朗红 */
export const MIDEAST_FACTION_HEX: Record<MideastFaction, string> = {
  us: '#3b82f6',
  israel: '#e2e8f0',
  iran: '#ef4444',
};
