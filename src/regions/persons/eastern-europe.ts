import { person } from './helpers';

const MOSCOW = [37.62, 55.75] as const;
const KYIV = [30.52, 50.45] as const;
const WARSAW = [21.01, 52.23] as const;
const BUCHAREST = [26.10, 44.43] as const;

/** 东欧·俄乌区域人物 */
export const EASTERN_EUROPE_PERSONS = [
  person('per-ee-1', '弗拉基米尔·普京', '俄罗斯总统', '政治', ['eastern_europe'], MOSCOW[0], MOSCOW[1], '俄罗斯最高领导人，发起对乌克兰特别军事行动。', { since: 2012, wikipedia: 'https://zh.wikipedia.org/wiki/弗拉基米尔·普京' }),
  person('per-ee-2', '谢尔盖·绍伊古', '俄罗斯国防部长', '军事', ['eastern_europe'], MOSCOW[0], MOSCOW[1], '俄军建设负责人，主导乌克兰战场后勤与动员。', { since: 2012, wikipedia: 'https://zh.wikipedia.org/wiki/谢尔盖·绍伊古' }),
  person('per-ee-3', '瓦列里·格拉西莫夫', '俄军总参谋长', '军事', ['eastern_europe'], MOSCOW[0], MOSCOW[1], '俄军最高军职，制定乌克兰作战计划。', { since: 2012, wikipedia: 'https://en.wikipedia.org/wiki/Valery_Gerasimov' }),
  person('per-ee-4', '弗拉基米尔·泽连斯基', '乌克兰总统', '政治', ['eastern_europe'], KYIV[0], KYIV[1], '乌克兰战时领导人，争取西方军援与国际支持。', { since: 2019, wikipedia: 'https://zh.wikipedia.org/wiki/弗拉基米尔·泽连斯基' }),
  person('per-ee-5', '鲁斯捷姆·乌梅罗夫', '乌克兰国防部长', '军事', ['eastern_europe'], KYIV[0], KYIV[1], '负责乌军改革与西方武器整合。', { since: 2023 }),
  person('per-ee-6', '亚历山大·瑟尔斯基', '乌军总司令', '军事', ['eastern_europe'], KYIV[0], KYIV[1], '指挥乌克兰地面作战与反攻行动。', { since: 2024 }),
  person('per-ee-7', '安德烈·别洛乌索夫', '俄罗斯国防部长', '军事', ['eastern_europe'], MOSCOW[0], MOSCOW[1], '经济学家出身，2024 年接任国防部长。', { since: 2024 }),
  person('per-ee-8', '德米特里·梅德韦杰夫', '俄联邦安全会议副主席', '政治', ['eastern_europe'], MOSCOW[0], MOSCOW[1], '对乌强硬言论代表，曾任俄罗斯总统。', { since: 2020, wikipedia: 'https://zh.wikipedia.org/wiki/德米特里·梅德韦杰夫' }),
  person('per-ee-9', '谢尔盖·拉夫罗夫', '俄罗斯外长', '政治', ['eastern_europe'], MOSCOW[0], MOSCOW[1], '俄罗斯首席外交官，在联合国与多边场合为俄方辩护。', { since: 2004, wikipedia: 'https://zh.wikipedia.org/wiki/谢尔盖·拉夫罗夫' }),
  person('per-ee-10', '德米特里·库列巴', '乌克兰外长', '政治', ['eastern_europe'], KYIV[0], KYIV[1], '乌克兰外交门面，游说西方军援与入盟进程。', { since: 2020, wikipedia: 'https://zh.wikipedia.org/wiki/德米特罗·库列巴' }),
  person('per-ee-11', '安德烈·叶尔马克', '乌总统办公室主任', '政治', ['eastern_europe'], KYIV[0], KYIV[1], '泽连斯基核心幕僚，参与和平谈判与对美沟通。', { since: 2020 }),
  person('per-ee-12', '唐纳德·图斯克', '波兰总理', '政治', ['eastern_europe', 'western_europe'], WARSAW[0], WARSAW[1], '波兰领导人，坚定支持乌克兰与北约东翼强化。', { since: 2023, wikipedia: 'https://zh.wikipedia.org/wiki/唐纳德·图斯克' }),
  person('per-ee-13', '克劳斯·约翰尼斯', '罗马尼亚总统', '政治', ['eastern_europe'], BUCHAREST[0], BUCHAREST[1], '黑海沿岸北约成员国元首，关注乌战外溢风险。', { since: 2014 }),
  person('per-ee-14', '埃斯彭·巴特·艾德', '挪威首相', '政治', ['eastern_europe', 'western_europe'], 10.75, 59.91, '北欧能源大国领导人，对俄能源脱钩参与者。', { since: 2021 }),
  person('per-ee-15', '叶夫根尼·普里戈任', '瓦格纳创始人', '军事', ['eastern_europe'], MOSCOW[0], MOSCOW[1], '私营军事公司领导人，2023 年发动兵变后身亡。', { status: 'deceased', wikipedia: 'https://zh.wikipedia.org/wiki/叶夫根尼·普里戈任' }),
  person('per-ee-16', '拉姆赞·卡德罗夫', '车臣领导人', '军事', ['eastern_europe'], 45.70, 43.32, '车臣共和国首脑，派遣部队参与乌克兰作战。', { since: 2007, wikipedia: 'https://zh.wikipedia.org/wiki/拉姆赞·卡德罗夫' }),
  person('per-ee-17', '玛丽亚·扎哈罗娃', '俄外交部发言人', '政治', ['eastern_europe'], MOSCOW[0], MOSCOW[1], '俄罗斯对外舆论代表，在社交媒体上活跃。', { since: 2015, wikipedia: 'https://en.wikipedia.org/wiki/Maria_Zakharova' }),
  person('per-ee-18', '奥列克西·列兹尼科夫', '乌克兰前国防部长', '军事', ['eastern_europe'], KYIV[0], KYIV[1], '任内推动西方主战坦克与战机援助。', { status: 'restricted' }),
  person('per-ee-19', '斯维特兰娜·季哈诺夫斯卡娅', '白俄罗斯反对派领袖', '社会', ['eastern_europe'], 23.73, 52.10, '2020 年白俄罗斯大选后流亡，领导民主运动。', { wikipedia: 'https://zh.wikipedia.org/wiki/斯维特兰娜·季哈诺夫斯卡娅' }),
  person('per-ee-20', '亚历山大·卢卡申科', '白俄罗斯总统', '政治', ['eastern_europe'], 27.57, 53.90, '长期执政者，允许俄军借道白俄罗斯进攻乌克兰。', { since: 1994, wikipedia: 'https://zh.wikipedia.org/wiki/亚历山大·卢卡申科' }),

  person('per-ee-21', '米哈伊尔·米舒斯京', '俄罗斯总理', '政治', ['eastern_europe'], MOSCOW[0], MOSCOW[1], '俄政府首脑，管理经济与财政。', { since: 2020, wikipedia: 'https://zh.wikipedia.org/wiki/米哈伊尔·米舒斯京' }),
  person('per-ee-22', '安德烈·西比加', '乌克兰总理', '政治', ['eastern_europe'], KYIV[0], KYIV[1], '2024 年上任，主抓经济重建与西方融资。', { since: 2024 }),
  person('per-ee-23', '吉塔纳斯·瑙塞达', '立陶宛总统', '政治', ['eastern_europe'], 25.28, 54.68, '波罗的海三国领导人之一，对俄立场强硬。', { since: 2019, wikipedia: 'https://zh.wikipedia.org/wiki/吉塔纳斯·瑙塞达' }),
  person('per-ee-24', '埃德加斯·林克维奇', '拉脱维亚总统', '政治', ['eastern_europe'], 24.10, 56.94, '前外长出身，持续推动北约东翼防务强化。', { since: 2023 }),
  person('per-ee-25', '阿拉尔·卡里斯', '爱沙尼亚总统', '政治', ['eastern_europe'], 24.75, 59.44, '爱沙尼亚国家元首，活跃于数字治理与网络安全。', { since: 2021 }),
  person('per-ee-26', '维克托·欧尔班', '匈牙利总理', '政治', ['eastern_europe'], 19.04, 47.50, '欧盟内部对俄制裁与对华政策的异见者。', { since: 2010, wikipedia: 'https://zh.wikipedia.org/wiki/维克托·欧尔班' }),
  person('per-ee-27', '马娅·桑杜', '摩尔多瓦总统', '政治', ['eastern_europe'], 28.86, 47.03, '亲欧改革派，面临俄方能源施压与德左问题。', { since: 2020, wikipedia: 'https://zh.wikipedia.org/wiki/马娅·桑杜' }),
  person('per-ee-28', '罗曼·阿布拉莫维奇', '俄商界寡头', '经济', ['eastern_europe'], MOSCOW[0], MOSCOW[1], '前切尔西老板，俄乌谈判中间人，受到西方制裁。', { status: 'restricted', wikipedia: 'https://zh.wikipedia.org/wiki/罗曼·阿布拉莫维奇' }),
];
