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
  person('per-ee-59', '弗拉基米尔·波塔宁', '诺里尔斯克镍业 CEO', '经济', ['eastern_europe'], MOSCOW[0], MOSCOW[1], '俄罗斯首富之一，镍业与金融巨头。', { since: 1990, birthYear: 1961, nationality: '俄罗斯', wikipedia: 'https://zh.wikipedia.org/wiki/弗拉基米尔·波塔宁' }),
  person('per-ee-60', '阿利舍尔·乌斯马诺夫', 'USM 控股创始人', '经济', ['eastern_europe'], MOSCOW[0], MOSCOW[1], '乌兹别克裔俄罗斯寡头，电信与矿业。', { since: 1990, birthYear: 1953, nationality: '俄罗斯/乌兹别克斯坦', wikipedia: 'https://zh.wikipedia.org/wiki/阿利舍尔·乌斯马诺夫' }),
  person('per-ee-61', '瓦吉特·阿列克佩罗夫', '卢克石油前 CEO', '经济', ['eastern_europe'], MOSCOW[0], MOSCOW[1], '俄罗斯石油巨头卢克石油前掌门。', { since: 1993, birthYear: 1950, nationality: '俄罗斯' }),
  person('per-ee-62', '根纳季·季姆琴科', '伏尔加集团创始人', '经济', ['eastern_europe'], MOSCOW[0], MOSCOW[1], '能源与铁路运输寡头，普京密友。', { since: 1990, birthYear: 1952, nationality: '俄罗斯' }),
  person('per-ee-63', '彼得·阿文', '阿尔法集团联合创始人', '经济', ['eastern_europe'], MOSCOW[0], MOSCOW[1], '俄罗斯金融寡头。', { status: 'restricted', nationality: '俄罗斯' }),
  person('per-ee-64', '鲍里斯·罗滕贝格', 'Stroygazmontazh 创始人', '经济', ['eastern_europe'], MOSCOW[0], MOSCOW[1], '普京密友家族，基建与天然气管道。', { since: 1990, birthYear: 1957, nationality: '俄罗斯' }),
  person('per-ee-65', '伊戈尔·谢钦', '俄罗斯石油公司 CEO', '经济', ['eastern_europe'], MOSCOW[0], MOSCOW[1], 'Rosneft 总裁，普京核心能源幕僚。', { since: 2012, birthYear: 1960, nationality: '俄罗斯', wikipedia: 'https://zh.wikipedia.org/wiki/伊戈尔·谢钦' }),
  person('per-ee-66', '米哈伊尔·普罗霍罗夫', '前俄罗斯总统候选人', '经济', ['eastern_europe'], MOSCOW[0], MOSCOW[1], '镍业大亨转政治人物。', { status: 'restricted', birthYear: 1965, nationality: '俄罗斯' }),

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
  person('per-ee-67', '德米特里·乌特金', '瓦格纳联合创始人', '军事', ['eastern_europe'], MOSCOW[0], MOSCOW[1], '前 GRU 军官，瓦格纳军事指挥官，2023 年坠机身亡。', { birthYear: 1970, deathYear: 2023, status: 'deceased', nationality: '俄罗斯' }),
  person('per-ee-68', '尼古拉·帕特鲁舍夫', '俄联邦安全会议秘书', '政治', ['eastern_europe'], MOSCOW[0], MOSCOW[1], '前 FSB 局长，普京核心安全幕僚。', { since: 2008, birthYear: 1951, nationality: '俄罗斯', wikipedia: 'https://zh.wikipedia.org/wiki/尼古拉·帕特鲁舍夫' }),
  person('per-ee-69', '维克托·佐洛托夫', '俄联邦近卫军总司令', '军事', ['eastern_europe'], MOSCOW[0], MOSCOW[1], '近卫军（Rosgvardiya）总司令。', { since: 2016, birthYear: 1954, nationality: '俄罗斯' }),
  person('per-ee-70', '谢尔盖·苏罗维金', '俄罗斯空天军总司令', '军事', ['eastern_europe'], MOSCOW[0], MOSCOW[1], '「末日将军」，曾任驻乌俄军总指挥。', { since: 2017, birthYear: 1966, nationality: '俄罗斯', wikipedia: 'https://zh.wikipedia.org/wiki/谢尔盖·苏罗维金' }),

  // ── 乌克兰军政扩展 ──
  person('per-ee-71', '奥莱克西·丹尼洛夫', '乌克兰国家安全与国防委员会前秘书', '政治', ['eastern_europe'], KYIV[0], KYIV[1], '前国安与国防委员会秘书。', { since: 2019, nationality: '乌克兰' }),
  person('per-ee-72', '瓦列里·扎卢日内', '乌克兰前武装部队总司令', '军事', ['eastern_europe'], KYIV[0], KYIV[1], '前乌军总司令，现驻英大使。', { since: 2021, birthYear: 1973, nationality: '乌克兰', wikipedia: 'https://zh.wikipedia.org/wiki/瓦列里·扎卢日内' }),
  person('per-ee-73', '奥莱克桑德尔·瑟尔斯基', '乌克兰武装部队总司令', '军事', ['eastern_europe'], KYIV[0], KYIV[1], '现任乌军总司令，接替扎卢日内。（合并条目）', { since: 2024, nationality: '乌克兰' }),
  person('per-ee-74', '奥克萨娜·马尔哈尔', '乌克兰第一夫人', '社会', ['eastern_europe'], KYIV[0], KYIV[1], '泽连斯基夫人，作家。', { since: 2019, nationality: '乌克兰' }),
  person('per-ee-75', '杰尼斯·什米加尔', '乌克兰总理', '政治', ['eastern_europe'], KYIV[0], KYIV[1], '乌克兰政府首脑。', { since: 2020, birthYear: 1975, nationality: '乌克兰', wikipedia: 'https://zh.wikipedia.org/wiki/杰尼斯·什米加尔' }),
  person('per-ee-76', '安德里·叶尔马克', '乌总统办公室主任（备注）', '政治', ['eastern_europe'], KYIV[0], KYIV[1], '泽连斯基核心幕僚。（合并条目）', { nationality: '乌克兰' }),
  person('per-ee-77', '奥莱娜·泽连斯卡', '乌克兰第一夫人（备注）', '社会', ['eastern_europe'], KYIV[0], KYIV[1], '泽连斯基夫人（合并条目）。', { nationality: '乌克兰' }),

  // ── 俄罗斯反对派与异见 ──
  person('per-ee-78', '阿列克谢·纳瓦尔尼', '俄罗斯反对派领袖', '社会', ['eastern_europe'], MOSCOW[0], MOSCOW[1], '普京主要反对者，2024 年在狱中死亡。', { birthYear: 1976, deathYear: 2024, status: 'deceased', nationality: '俄罗斯', wikipedia: 'https://zh.wikipedia.org/wiki/阿列克谢·纳瓦尔尼' }),
  person('per-ee-79', '尤利娅·纳瓦尔纳亚', '俄罗斯反对派领袖', '政治', ['eastern_europe'], MOSCOW[0], MOSCOW[1], '纳瓦尔尼遗孀，现领导俄罗斯反对派。', { since: 2024, birthYear: 1976, nationality: '俄罗斯' }),
  person('per-ee-80', '加里·卡斯帕罗夫', '前国际象棋世界冠军、反对派活动家', '社会', ['eastern_europe'], MOSCOW[0], MOSCOW[1], '棋王转政治活动家，现流亡。', { since: 2005, birthYear: 1963, nationality: '俄罗斯', wikipedia: 'https://zh.wikipedia.org/wiki/加里·卡斯帕罗夫' }),
  person('per-ee-81', '米哈伊尔·霍多尔科夫斯基', '尤科斯前 CEO、反对派', '政治', ['eastern_europe'], MOSCOW[0], MOSCOW[1], '前俄首富，被普京投入监狱后流亡。', { status: 'restricted', birthYear: 1963, nationality: '俄罗斯' }),
  person('per-ee-82', '弗拉基米尔·卡拉-穆尔扎', '俄罗斯反对派政治家', '社会', ['eastern_europe'], MOSCOW[0], MOSCOW[1], '两度遭下毒，因反对战争被判刑。', { since: 2022, birthYear: 1981, nationality: '俄罗斯' }),
  person('per-ee-83', '柳德米拉·乌利茨卡娅', '作家、异见人士', '文化', ['eastern_europe'], MOSCOW[0], MOSCOW[1], '俄罗斯当代重要作家，批评普京政权。', { since: 1990, birthYear: 1943, nationality: '俄罗斯' }),

  // ── 苏联历史人物 ──
  person('per-ee-84', '米哈伊尔·戈尔巴乔夫', '前苏联总统', '政治', ['eastern_europe'], MOSCOW[0], MOSCOW[1], '苏联末代领导人，推动改革开放，诺贝尔和平奖，2022 年逝世。', { since: 1985, birthYear: 1931, deathYear: 2022, status: 'deceased', nationality: '俄罗斯', wikipedia: 'https://zh.wikipedia.org/wiki/米哈伊尔·谢尔盖耶维奇·戈尔巴乔夫' }),
  person('per-ee-85', '鲍里斯·叶利钦', '前俄罗斯总统', '政治', ['eastern_europe'], MOSCOW[0], MOSCOW[1], '俄罗斯首任总统（1991-1999），2007 年逝世。', { since: 1991, birthYear: 1931, deathYear: 2007, status: 'deceased', nationality: '俄罗斯', wikipedia: 'https://zh.wikipedia.org/wiki/鲍里斯·叶利钦' }),
  person('per-ee-86', '约瑟夫·斯大林', '前苏联领导人', '政治', ['eastern_europe'], MOSCOW[0], MOSCOW[1], '苏联最高领导人（1924-1953），1953 年逝世。', { since: 1924, birthYear: 1878, deathYear: 1953, status: 'deceased', nationality: '苏联/格鲁吉亚', wikipedia: 'https://zh.wikipedia.org/wiki/约瑟夫·斯大林' }),
  person('per-ee-87', '弗拉基米尔·列宁', '前苏联缔造者', '政治', ['eastern_europe'], MOSCOW[0], MOSCOW[1], '布尔什维克革命领袖，苏联缔造者，1924 年逝世。', { since: 1917, birthYear: 1870, deathYear: 1924, status: 'deceased', nationality: '苏联/俄罗斯', wikipedia: 'https://zh.wikipedia.org/wiki/弗拉基米尔·列宁' }),
];
