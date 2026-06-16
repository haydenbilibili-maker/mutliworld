/**
 * 俄乌军力对比 — 联网检索可核实来源（检索日 2026-06-16）
 * ⚠ 含估算（伤亡/库存等），均带口径与来源；时效性数据需定期核实更新。
 * 来源：CFR、IISS Military Balance、Statista、GlobalFirePower、CSIS（2026）。
 */

import type { MideastMilitarySection } from '@/types/middleeast';

export const EE_MILITARY_SECTIONS: MideastMilitarySection[] = [
  {
    id: 'ee-ru',
    side: 'ru',
    title: '俄罗斯军力（规模优势）',
    summary: '兵力与装备数量占优，持续渐进推进',
    updatedAt: '2026',
    items: [
      { label: '现役兵力（估算）', value: '约 132 万', sub: 'Statista/CFR 2026' },
      { label: '阵亡估算', value: '约 30 万', sub: '截至 2026 年初（估算）' },
      { label: '作战飞机', value: '约 4,300 架', sub: '远多于乌方' },
      { label: '坦克', value: '约为乌方 5 倍以上', sub: 'CFR' },
      { label: '远程打击', value: '弹道/巡航导弹 + 无人机', sub: '持续打击乌能源系统' },
      { label: '控制区', value: '约乌克兰领土 20%', sub: '渐进推进（CFR/CSIS）' },
    ],
  },
  {
    id: 'ee-ua',
    side: 'ua',
    title: '乌克兰军力（无人机与防御）',
    summary: '数量劣势但持续抵抗，无人机能力突出',
    updatedAt: '2026',
    items: [
      { label: '现役兵力（估算）', value: '约 90 万', sub: 'Statista 2026' },
      { label: '伤亡估算', value: '约 50–60 万', sub: '2022.2–2025.12（估算）' },
      { label: '作战飞机', value: '约 347 架', sub: '远少于俄方' },
      { label: '坦克', value: '逾 1,100 辆', sub: '2025' },
      { label: '无人机', value: '战场/海上/远程打击全谱系', sub: '混合导弹-无人机自研增长（IISS）' },
      { label: '最急需', value: '防空拦截弹与系统', sub: 'IISS：保护能源与城市' },
    ],
  },
  {
    id: 'ee-west',
    side: 'nato',
    title: '西方援助（变量）',
    summary: '美援收缩、欧洲承接，援助强度是关键变量',
    updatedAt: '2026',
    items: [
      { label: '美国支持', value: '降低对乌支援', sub: '欧洲难完全填补（IISS）' },
      { label: '欧洲', value: '加大军援与防空供给', sub: '弥补美援缺口压力大' },
      { label: '能源冲击', value: '乌电网仅满足约 60% 需求', sub: '2026.1，遭俄持续打击' },
      { label: '对俄军工外援争议', value: 'EU 第 20 轮制裁列入中国实体', sub: '指两用物项流入俄军工（2026.4）' },
    ],
  },
];
