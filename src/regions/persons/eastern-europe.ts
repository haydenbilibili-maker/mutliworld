import { person } from './helpers';

const MOSCOW = [37.62, 55.75] as const;
const KYIV = [30.52, 50.45] as const;
const WARSAW = [21.01, 52.23] as const;
const BUDAPEST = [19.04, 47.50] as const;
const ASTANA = [71.47, 51.17] as const;
const TBILISI = [44.79, 41.72] as const;
const BAKU = [49.87, 40.38] as const;
const BRUSSELS = [4.35, 50.85] as const;

/** 东欧·俄乌区域人物 */
export const EASTERN_EUROPE_PERSONS = [
  // ── 俄罗斯联邦 ──
  person('per-ee-1', '弗拉基米尔·普京', '俄罗斯总统', '政治', ['eastern_europe'], MOSCOW[0], MOSCOW[1], '俄罗斯最高领导人，发起对乌克兰特别军事行动。', { since: 2000, birthYear: 1952, nationality: '俄罗斯', wikipedia: 'https://zh.wikipedia.org/wiki/弗拉基米尔·普京' }),
  person('per-ee-21', '米哈伊尔·米舒斯京', '俄罗斯总理', '政治', ['eastern_europe'], MOSCOW[0], MOSCOW[1], '俄政府首脑，管理经济与财政。', { since: 2020, birthYear: 1966, nationality: '俄罗斯', wikipedia: 'https://zh.wikipedia.org/wiki/米哈伊尔·米舒斯京' }),
  person('per-ee-9', '谢尔盖·拉夫罗夫', '俄罗斯外长', '政治', ['eastern_europe'], MOSCOW[0], MOSCOW[1], '俄罗斯首席外交官，在联合国与多边场合为俄方辩护。', { since: 2004, birthYear: 1950, nationality: '俄罗斯', wikipedia: 'https://zh.wikipedia.org/wiki/谢尔盖·拉夫罗夫' }),
  person('per-ee-2', '谢尔盖·绍伊古', '俄罗斯前国防部长', '军事', ['eastern_europe'], MOSCOW[0], MOSCOW[1], '俄军建设负责人，主导乌克兰战场后勤与动员。', { since: 2012, birthYear: 1955, nationality: '俄罗斯', wikipedia: 'https://zh.wikipedia.org/wiki/谢尔盖·绍伊古' }),
  person('per-ee-3', '瓦列里·格拉西莫夫', '俄军总参谋长', '军事', ['eastern_europe'], MOSCOW[0], MOSCOW[1], '俄军最高军职，制定乌克兰作战计划。', { since: 2012, birthYear: 1955, nationality: '俄罗斯', wikipedia: 'https://en.wikipedia.org/wiki/Valery_Gerasimov' }),
  person('per-ee-7', '安德烈·别洛乌索夫', '俄罗斯国防部长', '军事', ['eastern_europe'], MOSCOW[0], MOSCOW[1], '经济学家出身，2024 年接任国防部长。', { since: 2024, birthYear: 1959, nationality: '俄罗斯', wikipedia: 'https://zh.wikipedia.org/wiki/安德烈·别洛乌索夫' }),
  person('per-ee-8', '德米特里·梅德韦杰夫', '俄联邦安全会议副主席', '政治', ['eastern_europe'], MOSCOW[0], MOSCOW[1], '对乌强硬言论代表，曾任俄罗斯总统。', { since: 2020, birthYear: 1965, nationality: '俄罗斯', wikipedia: 'https://zh.wikipedia.org/wiki/德米特里·梅德韦杰夫' }),
  person('per-ee-29', '纳比乌林娜·韦列瓦', '俄央行行长', '经济', ['eastern_europe'], MOSCOW[0], MOSCOW[1], '俄罗斯央行行长，管理卢布汇率与抗制裁政策。', { since: 2013, nationality: '俄罗斯' }),
  person('per-ee-30', '亚历山大·诺瓦克', '俄罗斯副总理', '经济', ['eastern_europe'], MOSCOW[0], MOSCOW[1], '负责能源政策。', { since: 2020, nationality: '俄罗斯' }),
  person('per-ee-31', '德米特里·帕特鲁舍夫', '俄罗斯农业部长', '经济', ['eastern_europe'], MOSCOW[0], MOSCOW[1], '农业与粮食出口。', { since: 2018, nationality: '俄罗斯' }),
  person('per-ee-32', '谢尔盖·纳雷什金', '俄对外情报局局长', '军事', ['eastern_europe'], MOSCOW[0], MOSCOW[1], '对外情报负责人。', { since: 2016, nationality: '俄罗斯' }),
  person('per-ee-33', '亚历山大·博尔特尼科夫', '俄联邦安全局局长', '军事', ['eastern_europe'], MOSCOW[0], MOSCOW[1], 'FSB 局长。', { since: 2008, nationality: '俄罗斯' }),
  person('per-ee-17', '玛丽亚·扎哈罗娃', '俄外交部发言人', '政治', ['eastern_europe'], MOSCOW[0], MOSCOW[1], '俄罗斯对外舆论代表。', { since: 2015, nationality: '俄罗斯', wikipedia: 'https://en.wikipedia.org/wiki/Maria_Zakharova' }),

  // ── 俄罗斯寡头与商界 ──
  person('per-ee-28', '罗曼·阿布拉莫维奇', '俄商界寡头', '经济', ['eastern_europe'], MOSCOW[0], MOSCOW[1], '前切尔西老板，俄乌谈判中间人，受到西方制裁。', { status: 'restricted', birthYear: 1966, nationality: '俄罗斯', wikipedia: 'https://zh.wikipedia.org/wiki/罗曼·阿布拉莫维奇' }),
  person('per-ee-34', '阿列克谢·莫尔达绍夫', '谢韦尔钢铁 CEO', '经济', ['eastern_europe'], MOSCOW[0], MOSCOW[1], '俄罗斯钢铁大亨。', { since: 1996, nationality: '俄罗斯' }),
  person('per-ee-35', '米哈伊尔·弗里德曼', '阿尔法集团创始人', '经济', ['eastern_europe'], MOSCOW[0], MOSCOW[1], '俄罗斯金融与能源寡头。', { since: 1990, nationality: '俄罗斯/以色列' }),

  // ── 乌克兰 ──
  person('per-ee-4', '弗拉基米尔·泽连斯基', '乌克兰总统', '政治', ['eastern_europe'], KYIV[0], KYIV[1], '乌克兰战时领导人，争取西方军援与国际支持。', { since: 2019, birthYear: 1978, nationality: '乌克兰', wikipedia: 'https://zh.wikipedia.org/wiki/弗拉基米尔·泽连斯基' }),
  person('per-ee-5', '鲁斯捷姆·乌梅罗夫', '乌克兰国防部长', '军事', ['eastern_europe'], KYIV[0], KYIV[1], '负责乌军改革与西方武器整合。', { since: 2023, nationality: '乌克兰' }),
  person('per-ee-6', '亚历山大·瑟尔斯基', '乌军总司令', '军事', ['eastern_europe'], KYIV[0], KYIV[1], '指挥乌克兰地面作战与反攻行动。', { since: 2024, nationality: '乌克兰' }),
  person('per-ee-10', '德米特里·库列巴', '乌克兰外长', '政治', ['eastern_europe'], KYIV[0], KYIV[1], '乌克兰外交门面，游说西方军援与入盟进程。', { since: 2020, birthYear: 1981, nationality: '乌克兰', wikipedia: 'https://zh.wikipedia.org/wiki/德米特罗·库列巴' }),
  person('per-ee-11', '安德烈·叶尔马克', '乌总统办公室主任', '政治', ['eastern_europe'], KYIV[0], KYIV[1], '泽连斯基核心幕僚，参与和平谈判与对美沟通。', { since: 2020, nationality: '乌克兰' }),
  person('per-ee-36', '基里洛·布达诺夫', '乌国防部情报总局局长', '军事', ['eastern_europe'], KYIV[0], KYIV[1], '乌克兰军事情报负责人。', { since: 2020, nationality: '乌克兰' }),

  // ── 波兰 ──
  person('per-ee-12', '唐纳德·图斯克', '波兰总理', '政治', ['eastern_europe'], WARSAW[0], WARSAW[1], '波兰领导人，坚定支持乌克兰与北约东翼强化。', { since: 2023, birthYear: 1957, nationality: '波兰', wikipedia: 'https://zh.wikipedia.org/wiki/唐纳德·图斯克' }),
  person('per-ee-37', '安杰伊·杜达', '波兰总统', '政治', ['eastern_europe'], WARSAW[0], WARSAW[1], '波兰总统。', { since: 2015, nationality: '波兰', wikipedia: 'https://zh.wikipedia.org/wiki/安杰伊·杜达' }),
  person('per-ee-38', '拉多斯瓦夫·西科尔斯基', '波兰外长', '政治', ['eastern_europe'], WARSAW[0], WARSAW[1], '波兰外长。', { since: 2023, nationality: '波兰' }),

  // ── 波罗的海 ──
  person('per-ee-23', '吉塔纳斯·瑙塞达', '立陶宛总统', '政治', ['eastern_europe'], 25.28, 54.68, '对俄立场强硬。', { since: 2019, nationality: '立陶宛', wikipedia: 'https://zh.wikipedia.org/wiki/吉塔纳斯·瑙塞达' }),
  person('per-ee-39', '埃德加斯·林克维奇', '拉脱维亚总统', '政治', ['eastern_europe'], 24.10, 56.94, '前外长出身，持续推动北约东翼防务强化。', { since: 2023, nationality: '拉脱维亚' }),
  person('per-ee-25', '阿拉尔·卡里斯', '爱沙尼亚总统', '政治', ['eastern_europe'], 24.75, 59.44, '爱沙尼亚国家元首。', { since: 2021, nationality: '爱沙尼亚' }),
  person('per-ee-40', '卡娅·卡拉斯', '欧盟外长', '政治', ['eastern_europe'], BRUSSELS[0], BRUSSELS[1], '前爱沙尼亚总理，2024 年任欧盟外长。', { since: 2024, nationality: '爱沙尼亚', wikipedia: 'https://zh.wikipedia.org/wiki/卡娅·卡拉斯' }),

  // ── 匈牙利 ──
  person('per-ee-26', '维克托·欧尔班', '匈牙利总理', '政治', ['eastern_europe'], BUDAPEST[0], BUDAPEST[1], '欧盟内部对俄制裁与对华政策的异见者。', { since: 2010, birthYear: 1963, nationality: '匈牙利', wikipedia: 'https://zh.wikipedia.org/wiki/维克托·欧尔班' }),
  person('per-ee-41', '安娜丽塔·维科', '匈牙利外长', '政治', ['eastern_europe'], BUDAPEST[0], BUDAPEST[1], '匈牙利外长。', { since: 2022, nationality: '匈牙利' }),

  // ── 巴尔干 ──
  person('per-ee-42', '亚历山大·武契奇', '塞尔维亚总统', '政治', ['eastern_europe'], 20.47, 44.81, '塞尔维亚总统。', { since: 2017, nationality: '塞尔维亚' }),
  person('per-ee-43', '米洛·久卡诺维奇', '黑山前总统', '政治', ['eastern_europe'], 19.27, 42.44, '黑山长期领导人。', { since: 2018, nationality: '黑山' }),
  person('per-ee-44', '佐兰·米拉诺维奇', '克罗地亚总统', '政治', ['eastern_europe'], 15.98, 45.81, '克罗地亚总统。', { since: 2020, nationality: '克罗地亚' }),
  person('per-ee-45', '久尔杰·科斯塔', '罗马尼亚总理', '政治', ['eastern_europe'], 26.10, 44.43, '罗马尼亚总理。', { since: 2023, nationality: '罗马尼亚' }),
  person('per-ee-46', '博伊科·鲍里索夫', '保加利亚前总理', '政治', ['eastern_europe'], 23.32, 42.70, '保加利亚政坛老将。', { since: 2009, nationality: '保加利亚' }),
  person('per-ee-47', '埃迪·拉马', '阿尔巴尼亚总理', '政治', ['eastern_europe'], 19.82, 41.33, '阿尔巴尼亚总理。', { since: 2013, nationality: '阿尔巴尼亚' }),
  person('per-ee-48', '米洛·朱卡诺维奇', '黑山总统', '政治', ['eastern_europe'], 19.27, 42.44, '黑山总统。', { since: 2018, nationality: '黑山' }),
  person('per-ee-49', '斯特沃·彭达罗夫斯基', '北马其顿总统', '政治', ['eastern_europe'], 21.43, 41.99, '北马其顿总统。', { since: 2019, nationality: '北马其顿' }),

  // ── 白俄罗斯与摩尔多瓦 ──
  person('per-ee-20', '亚历山大·卢卡申科', '白俄罗斯总统', '政治', ['eastern_europe'], 27.57, 53.90, '长期执政者，允许俄军借道白俄罗斯进攻乌克兰。', { since: 1994, birthYear: 1954, nationality: '白俄罗斯', wikipedia: 'https://zh.wikipedia.org/wiki/亚历山大·卢卡申科' }),
  person('per-ee-19', '斯维特兰娜·季哈诺夫斯卡娅', '白俄罗斯反对派领袖', '社会', ['eastern_europe'], 23.73, 52.10, '2020 年白俄罗斯大选后流亡，领导民主运动。', { nationality: '白俄罗斯', wikipedia: 'https://zh.wikipedia.org/wiki/斯维特兰娜·季哈诺夫斯卡娅' }),
  person('per-ee-27', '马娅·桑杜', '摩尔多瓦总统', '政治', ['eastern_europe'], 28.86, 47.03, '亲欧改革派，面临俄方能源施压与德左问题。', { since: 2020, nationality: '摩尔多瓦', wikipedia: 'https://zh.wikipedia.org/wiki/马娅·桑杜' }),

  // ── 高加索 ──
  person('per-ee-50', '伊利哈姆·阿利耶夫', '阿塞拜疆总统', '政治', ['eastern_europe'], BAKU[0], BAKU[1], '阿塞拜疆总统。', { since: 2003, nationality: '阿塞拜疆' }),
  person('per-ee-51', '尼科尔·帕希尼扬', '亚美尼亚总理', '政治', ['eastern_europe'], 44.52, 40.18, '亚美尼亚总理，推动与土耳其关系正常化。', { since: 2018, nationality: '亚美尼亚' }),
  person('per-ee-16', '拉姆赞·卡德罗夫', '车臣领导人', '军事', ['eastern_europe'], 45.70, 43.32, '车臣共和国首脑，派遣部队参与乌克兰作战。', { since: 2007, birthYear: 1976, nationality: '俄罗斯', wikipedia: 'https://zh.wikipedia.org/wiki/拉姆赞·卡德罗夫' }),
  person('per-ee-52', '萨洛梅·祖拉比什维利', '格鲁吉亚前总统', '政治', ['eastern_europe'], TBILISI[0], TBILISI[1], '格鲁吉亚前总统。', { since: 2018, nationality: '格鲁吉亚/法国' }),
  person('per-ee-53', '伊拉克利·科巴希泽', '格鲁吉亚总理', '政治', ['eastern_europe'], TBILISI[0], TBILISI[1], '格鲁吉亚总理。', { since: 2024, nationality: '格鲁吉亚' }),

  // ── 中亚 ──
  person('per-ee-54', '卡西姆若马尔特·托卡耶夫', '哈萨克斯坦总统', '政治', ['eastern_europe'], ASTANA[0], ASTANA[1], '哈萨克斯坦总统。', { since: 2019, nationality: '哈萨克斯坦' }),
  person('per-ee-55', '沙夫卡特·米尔济约耶夫', '乌兹别克斯坦总统', '政治', ['eastern_europe'], 69.28, 41.29, '乌兹别克斯坦总统。', { since: 2016, nationality: '乌兹别克斯坦' }),
  person('per-ee-56', '萨德尔·扎帕罗夫', '吉尔吉斯斯坦总统', '政治', ['eastern_europe'], 74.60, 42.87, '吉尔吉斯斯坦总统。', { since: 2021, nationality: '吉尔吉斯斯坦' }),
  person('per-ee-57', '埃莫马利·拉赫蒙', '塔吉克斯坦总统', '政治', ['eastern_europe'], 68.79, 38.54, '塔吉克斯坦长期领导人。', { since: 1992, nationality: '塔吉克斯坦' }),
  person('per-ee-58', '古尔班古力·别尔德穆哈梅多夫', '土库曼斯坦总统', '政治', ['eastern_europe'], 58.38, 37.95, '土库曼斯坦领导人。', { since: 2022, nationality: '土库曼斯坦' }),

  // ── 瓦格纳与安全 ──
  person('per-ee-15', '叶夫根尼·普里戈任', '瓦格纳创始人', '军事', ['eastern_europe'], MOSCOW[0], MOSCOW[1], '私营军事公司领导人，2023 年发动兵变后身亡。', { birthYear: 1961, deathYear: 2023, status: 'deceased', nationality: '俄罗斯', wikipedia: 'https://zh.wikipedia.org/wiki/叶夫根尼·普里戈任' }),
];
