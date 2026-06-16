/**
 * 俄乌外交立场 — 联网检索可核实公开来源（检索日 2026-06-16）
 * 来源：中国驻欧盟使团、维基(China and the Russo-Ukrainian war)、USCC、EEAS、ECFR。
 */

import type { DiplomaticActor } from '@/types/middleeast';

export const EE_DIPLOMACY: DiplomaticActor[] = [
  {
    id: 'ee-dip-cn',
    name: '中国',
    nameEn: 'China',
    type: 'country',
    region: 'china_russia',
    flag: '🇨🇳',
    stance: 'mediation',
    stanceLabel: '客观公正、劝和促谈',
    reactions: [
      {
        date: '2026-04',
        statement:
          'EU 第 20 轮对俄制裁列入中国实体与个人，中方表示强烈不满与坚决反对（中国驻欧盟使团）。',
        source: '中国驻欧盟使团',
      },
      {
        date: '2026',
        statement:
          '反对未经安理会授权的单边制裁；称在推动和谈、促成政治解决中发挥建设性作用（未加入西方制裁、未谴责俄）。',
        source: 'USCC / 维基',
      },
    ],
  },
  {
    id: 'ee-dip-eu',
    name: '欧盟',
    nameEn: 'EU',
    type: 'org',
    region: 'europe',
    flag: '🇪🇺',
    stance: 'support_ukraine',
    stanceLabel: '制裁俄、援乌',
    reactions: [
      {
        date: '2026-04',
        statement:
          '通过第 20 轮对俄制裁，含针对向俄军工提供两用物项的中国实体；敦促中国停止对俄战争的物质支持（EEAS）。',
        source: 'EEAS / ECFR',
      },
      {
        date: '2026',
        statement: '持续升级制裁并加大对乌军援，承接美援收缩后的供给压力。',
        source: 'EEAS',
      },
    ],
  },
  {
    id: 'ee-dip-us',
    name: '美国',
    nameEn: 'United States',
    type: 'country',
    region: 'north_america',
    flag: '🇺🇸',
    stance: 'reduced_support',
    stanceLabel: '降低对乌支援',
    reactions: [
      {
        date: '2026',
        statement:
          '美国决定降低对基辅的支援水平，欧洲难以完全弥补，乌军压力上升（IISS）。',
        source: 'IISS',
      },
    ],
  },
];
