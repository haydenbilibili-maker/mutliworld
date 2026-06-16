import type { MideastMilitarySection, DiplomaticActor } from '@/types/middleeast';

/** 中国周边态势 · 阵营图例 */
export const CHINA_FACTIONS = {
  label: {
    cn: '中国',
    us: '美国',
    tw: '台湾',
    jp: '日本',
    kr: '韩国',
    kp: '朝鲜',
    ph: '菲律宾',
    vn: '越南',
    my: '马来西亚',
    bn: '文莱',
    contested: '争议区',
  },
  color: {
    cn: '#ef4444',
    us: '#3b82f6',
    tw: '#22c55e',
    jp: '#f59e0b',
    kr: '#8b5cf6',
    kp: '#6b7280',
    ph: '#06b6d4',
    vn: '#ec4899',
    my: '#14b8a6',
    bn: '#a855f7',
    contested: '#f97316',
  },
};

/** 中国周边 · 军力要点 */
export const CHINA_MILITARY: MideastMilitarySection[] = [
  {
    id: 'cn-mil-pla',
    side: 'cn',
    title: '解放军东部/南部战区',
    summary: '台海、东海、南海方向主要作战力量',
    items: [
      { label: '现役兵力', value: '约 200 万' },
      { label: '航母', value: '3 艘（辽宁、山东、福建）' },
      { label: '驱逐舰', value: '50+ 艘（含 055 型）' },
    ],
    updatedAt: '2026-06-16',
  },
  {
    id: 'cn-mil-us-pacific',
    side: 'us',
    title: '美国印太司令部',
    summary: '第一、二岛链前沿部署',
    items: [
      { label: '前沿兵力', value: '约 30 万' },
      { label: '航母打击群', value: '常态化部署 1–2 个' },
      { label: '基地', value: '冲绳、关岛、横须贺等' },
    ],
    updatedAt: '2026-06-16',
  },
  {
    id: 'cn-mil-tw',
    side: 'tw',
    title: '台湾当局军力',
    summary: '以防御为主，倚重美军售',
    items: [
      { label: '现役兵力', value: '约 16.5 万' },
      { label: '主战战机', value: 'F-16V、IDF 等约 400 架' },
      { label: '舰艇', value: '约 100 艘' },
    ],
    updatedAt: '2026-06-16',
  },
  {
    id: 'cn-mil-kp',
    side: 'kp',
    title: '朝鲜人民军',
    summary: '核导能力 + 常规火力',
    items: [
      { label: '现役兵力', value: '约 128 万' },
      { label: '核弹头', value: '估计 40–50 枚' },
      { label: '弹道导弹', value: '短中远程型号齐全' },
    ],
    updatedAt: '2026-06-16',
  },
];

/** 中国周边 · 外交立场 */
export const CHINA_DIPLOMACY: DiplomaticActor[] = [
  {
    id: 'cn-dip-cn',
    name: '中国',
    flag: '🇨🇳',
    type: 'country',
    region: 'china_russia',
    stance: 'one_china',
    stanceLabel: '一个中国原则，反对台独与外部干涉',
    reactions: [
      {
        date: '2026-06-16',
        statement: '主张通过和平统一解决台湾问题，反对外部势力介入南海与台海。',
        source: '外交部',
      },
    ],
  },
  {
    id: 'cn-dip-us',
    name: '美国',
    flag: '🇺🇸',
    type: 'country',
    region: 'international_org',
    stance: 'strategic_competition',
    stanceLabel: '战略竞争，维持台海现状',
    reactions: [
      {
        date: '2026-06-16',
        statement: '《台湾关系法》框架下对台军售，南海开展「航行自由」行动。',
        source: '国务院',
      },
    ],
  },
  {
    id: 'cn-dip-jp',
    name: '日本',
    flag: '🇯🇵',
    type: 'country',
    region: 'europe',
    stance: 'island_chain',
    stanceLabel: '强化西南诸岛防卫，介入台海危机',
    reactions: [
      {
        date: '2026-06-15',
        statement: '钓鱼岛主权主张，与美军协同强化第一岛链防御。',
        source: '防卫省',
      },
    ],
  },
  {
    id: 'cn-dip-ph',
    name: '菲律宾',
    flag: '🇵🇭',
    type: 'country',
    region: 'middle_east_gulf',
    stance: 'arbitration',
    stanceLabel: '南海仲裁案立场，倚重美菲同盟',
    reactions: [
      {
        date: '2026-06-16',
        statement: '在黄岩岛、礼乐滩等海域与中国存在争议，寻求美方支持。',
        source: '外交部',
      },
    ],
  },
];
