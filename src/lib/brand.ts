/**
 * 品牌常量 — 单一事实来源
 *
 * 万象幻测 · OmniLens：取「包罗万象、变幻可测」之意。
 * 中国视角的全球态势感知引擎；由独立开发者超级个体 Hayden 携多平台 AI agent 协作打造。
 */

export const BRAND = {
  nameZh: '万象幻测',
  nameEn: 'OmniLens',
  /** 组合展示名 */
  full: '万象幻测 · OmniLens',
  tagline: '包罗万象 · 变幻可测',
  taglineEn: 'All under heaven, observable.',
  description: '中国视角的全球地缘政治、经济、能源、安全与自然灾害态势实时可视化引擎',
  version: '1.3.0',
  versionName: '万象幻测',
  author: 'Hayden',
  /** 协作署名 */
  authorship: '独立开发者 · 超级个体 Hayden ✕ 多平台 AI agent 协作',
  repoUrl: 'https://github.com/haydenbilibili-maker/mutliworld.git',
} as const;

/** 致敬与版权 */
export const CREDITS = {
  openSource:
    '致敬开源精神 —— 站在 MapLibre、satellite.js、ECharts、Next.js 等开源巨人的肩膀上，本项目亦以开放心态持续迭代。',
  predecessor:
    '致敬先行者 WorldMonitor —— 感谢其在全球态势可视化上的开创探索；本项目独立实现、不抄袭其代码，并坚持中国视角与三位一体（天/地/海）的差异化路径。',
  perspective:
    '中国视角优先 —— 国界与敏感地理以官方合规底图（天地图）呈现，数据标注来源与时效，冲突信息中立表述、不编造。',
  collaboration:
    '由超级个体 Hayden 主导，携 Linus / Turing 等多平台 AI agent 协作共创，验证环节坚持异源复核。',
} as const;

/** 友好外链 */
export const FRIENDLY_LINKS: { label: string; desc: string; url: string }[] = [
  {
    label: '国情调研系统 · 政地模块',
    desc: '同为 Hayden 作品：结构化的中国国情与区域调研工具',
    url: 'https://chinaos.hayden-bilibili.workers.dev/#/modules/zhengdi',
  },
];
