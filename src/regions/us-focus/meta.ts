import type { MideastMilitarySection, DiplomaticActor } from '@/types/middleeast';

/** 美国战略态势 · 阵营图例 */
export const US_FACTIONS = {
  label: {
    us: '美国',
    nato: '北约',
    ally: '盟友',
    adversary: '对手',
    contested: '争议区',
  },
  color: {
    us: '#3b82f6',
    nato: '#6366f1',
    ally: '#22c55e',
    adversary: '#ef4444',
    contested: '#f97316',
  },
};

/** 美国战略 · 军力要点 */
export const US_MILITARY: MideastMilitarySection[] = [
  {
    id: 'us-mil-triad',
    side: 'us',
    title: '美国战略核三位一体',
    summary: '陆基民兵 III、海基俄亥俄级 SSBN、空基 B-52/B-2/B-21',
    items: [
      { label: '部署弹头', value: '约 1,770 枚（新 START 上限）' },
      { label: 'ICBM 发射井', value: '约 400 枚民兵 III' },
      { label: 'SSBN', value: '14 艘俄亥俄级（大西洋/太平洋）' },
    ],
    updatedAt: '2026-06-16',
  },
  {
    id: 'us-mil-indopacom',
    side: 'us',
    title: '美国印太司令部',
    summary: '第一岛链前沿部署与西太平洋力量投送',
    items: [
      { label: '前沿兵力', value: '约 30 万' },
      { label: '航母打击群', value: '常态化 1–2 个 CSG' },
      { label: '关键基地', value: '关岛、冲绳、横须贺、菲律宾 EDCA' },
    ],
    updatedAt: '2026-06-16',
  },
  {
    id: 'us-mil-eucom',
    side: 'nato',
    title: '美国欧洲司令部 / 北约',
    summary: '东欧前沿强化与跨大西洋力量枢纽',
    items: [
      { label: '驻欧美军', value: '约 10 万' },
      { label: '前沿旅', value: '波兰/波罗的海轮驻' },
      { label: '指挥节点', value: '斯图加特 EUCOM、布鲁塞尔 SHAPE' },
    ],
    updatedAt: '2026-06-16',
  },
  {
    id: 'us-mil-homeland',
    side: 'us',
    title: '本土防御与关键基础设施',
    summary: 'NORAD、北美防空、电网与港口安全',
    items: [
      { label: 'NORAD', value: '夏延山 + 彼得森太空军基地' },
      { label: '海岸警卫队', value: '港口与海上通道安全' },
      { label: '网络司令部', value: 'Fort Meade / NSA 枢纽' },
    ],
    updatedAt: '2026-06-16',
  },
];

/** 美国战略 · 外交与安全政策 */
export const US_DIPLOMACY: DiplomaticActor[] = [
  {
    id: 'us-dip-indo',
    name: '美国',
    flag: '🇺🇸',
    type: 'country',
    region: 'international_org',
    stance: 'indo_pacific',
    stanceLabel: '印太战略：联盟网络化与第一岛链前沿存在',
    reactions: [
      {
        date: '2026-06-16',
        statement: '强化 AUKUS、美菲 EDCA 基地准入，维持《台湾关系法》框架下对台安全承诺。',
        source: '国务院 / 国防部',
      },
    ],
  },
  {
    id: 'us-dip-nato',
    name: '北约',
    flag: '🇺🇸',
    type: 'org',
    region: 'europe',
    stance: 'collective_defense',
    stanceLabel: '集体防御第五条，东欧前沿强化',
    reactions: [
      {
        date: '2026-06-15',
        statement: '北约东翼前沿部署与跨大西洋军演常态化，拉姆施泰因为欧洲空运枢纽。',
        source: 'NATO',
      },
    ],
  },
  {
    id: 'us-dip-supply',
    name: '美国',
    flag: '🇺🇸',
    type: 'country',
    region: 'china_russia',
    stance: 'supply_chain',
    stanceLabel: '半导体回流、稀土依赖缓解与能源出口',
    reactions: [
      {
        date: '2026-06-16',
        statement: 'CHIPS 法案推动亚利桑那/俄亥俄晶圆厂，评估稀土战略储备与盟友采购多元化。',
        source: '商务部 / 能源部',
      },
    ],
  },
];
