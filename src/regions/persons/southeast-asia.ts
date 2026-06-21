import { person } from './helpers';

const SINGAPORE = [103.85, 1.35] as const;
const BANGKOK = [100.50, 13.75] as const;
const JAKARTA = [106.85, -6.21] as const;
const MANILA = [120.98, 14.60] as const;
const HANOI = [105.85, 21.03] as const;
const KUALA = [101.69, 3.14] as const;
const NAYPYIDAW = [96.16, 19.75] as const;
const DILI = [125.57, -8.56] as const;
const BANDAR = [114.94, 4.94] as const;

/** 东南亚区域人物（东盟十国 + 东帝汶） */
export const SOUTHEAST_ASIA_PERSONS = [
  // ── 印度尼西亚 ──
  person('per-sea-1', '普拉博沃·苏比安托', '印尼总统', '政治', ['southeast_asia'], JAKARTA[0], JAKARTA[1], '东盟最大经济体领导人，延续不结盟外交。', { since: 2024, birthYear: 1951, nationality: '印度尼西亚', wikipedia: 'https://zh.wikipedia.org/wiki/普拉博沃·苏比安托' }),
  person('per-sea-13', '佐科·维多多', '印尼前总统', '政治', ['southeast_asia'], JAKARTA[0], JAKARTA[1], '任内推动新首都建设与镍矿下游化。', { status: 'restricted', birthYear: 1961, nationality: '印度尼西亚', wikipedia: 'https://zh.wikipedia.org/wiki/佐科·维多多' }),
  person('per-sea-25', '吉布兰·拉卡布明·拉卡', '印尼副总统', '政治', ['southeast_asia'], JAKARTA[0], JAKARTA[1], '佐科长子，2024 年当选副总统。', { since: 2024, nationality: '印度尼西亚' }),
  person('per-sea-26', '马尔夫·阿明', '印尼伊斯兰学者委员会主席', '社会', ['southeast_asia'], JAKARTA[0], JAKARTA[1], '印尼最大穆斯林组织领袖。', { since: 2024, nationality: '印度尼西亚' }),

  // ── 越南 ──
  person('per-sea-15', '苏林', '越共中央总书记', '政治', ['southeast_asia'], HANOI[0], HANOI[1], '2024 年接任越共最高领导职务。', { since: 2024, nationality: '越南', wikipedia: 'https://zh.wikipedia.org/wiki/苏林' }),
  person('per-sea-5', '范明政', '越南总理', '政治', ['southeast_asia'], HANOI[0], HANOI[1], '越南政府首脑，推动制造业外资与供应链转移。', { since: 2021, nationality: '越南', wikipedia: 'https://zh.wikipedia.org/wiki/范明政' }),
  person('per-sea-6', '阮富仲', '越共前总书记', '政治', ['southeast_asia'], HANOI[0], HANOI[1], '越南前最高政治领导人，2024 年病逝。', { birthYear: 1944, deathYear: 2024, status: 'deceased', nationality: '越南', wikipedia: 'https://zh.wikipedia.org/wiki/阮富仲' }),
  person('per-sea-27', '武文赏', '越南前国家主席', '政治', ['southeast_asia'], HANOI[0], HANOI[1], '前国家主席。', { status: 'restricted', nationality: '越南' }),
  person('per-sea-28', '裴青山', '越南外长', '政治', ['southeast_asia'], HANOI[0], HANOI[1], '越南外长。', { since: 2024, nationality: '越南' }),
  person('per-sea-29', '潘文江', '越南国防部长', '军事', ['southeast_asia'], HANOI[0], HANOI[1], '越南防长。', { since: 2021, nationality: '越南' }),

  // ── 泰国 ──
  person('per-sea-10', '佩通坦·钦那瓦', '泰国总理', '政治', ['southeast_asia'], BANGKOK[0], BANGKOK[1], '他信之女，2024 年出任总理。', { since: 2024, birthYear: 1986, nationality: '泰国', wikipedia: 'https://zh.wikipedia.org/wiki/佩通坦·钦那瓦' }),
  person('per-sea-9', '赛塔·他威信', '泰国前总理', '政治', ['southeast_asia'], BANGKOK[0], BANGKOK[1], '2024 年被宪法法院解职。', { status: 'restricted', nationality: '泰国', wikipedia: 'https://en.wikipedia.org/wiki/Srettha_Thavisin' }),
  person('per-sea-30', '巴育·占奥差', '泰国前总理', '政治', ['southeast_asia'], BANGKOK[0], BANGKOK[1], '2014 年政变后任总理。', { since: 2014, status: 'restricted', nationality: '泰国' }),
  person('per-sea-31', '玛哈·哇集拉隆功', '泰国国王', '文化', ['southeast_asia'], BANGKOK[0], BANGKOK[1], '泰国拉玛十世国王。', { since: 2016, nationality: '泰国' }),

  // ── 马来西亚 ──
  person('per-sea-11', '安瓦尔·易卜拉欣', '马来西亚总理', '政治', ['southeast_asia'], KUALA[0], KUALA[1], '团结政府领袖，推动多元种族治理与对华经贸。', { since: 2022, birthYear: 1947, nationality: '马来西亚', wikipedia: 'https://zh.wikipedia.org/wiki/安瓦尔·易卜拉欣' }),
  person('per-sea-24', '马哈蒂尔·穆罕默德', '马来西亚前总理', '政治', ['southeast_asia'], KUALA[0], KUALA[1], '两度任总理，亚洲政坛传奇。', { status: 'restricted', birthYear: 1925, nationality: '马来西亚', wikipedia: 'https://zh.wikipedia.org/wiki/马哈蒂尔·穆罕默德' }),
  person('per-sea-32', '阿兹莎·拉扎克', '马来西亚家庭发展部长', '政治', ['southeast_asia'], KUALA[0], KUALA[1], '安瓦尔夫人。', { since: 2022, nationality: '马来西亚' }),
  person('per-sea-33', '穆希丁·亚辛', '马来西亚前总理', '政治', ['southeast_asia'], KUALA[0], KUALA[1], '土著团结党主席。', { status: 'restricted', nationality: '马来西亚', wikipedia: 'https://en.wikipedia.org/wiki/Muhyiddin_Yassin' }),

  // ── 新加坡 ──
  person('per-sea-8', '黄循财', '新加坡总理', '政治', ['southeast_asia'], SINGAPORE[0], SINGAPORE[1], '新加坡第四任总理，延续务实外交与金融中心战略。', { since: 2024, nationality: '新加坡', wikipedia: 'https://zh.wikipedia.org/wiki/黄循财' }),
  person('per-sea-7', '李显龙', '新加坡前总理', '政治', ['southeast_asia'], SINGAPORE[0], SINGAPORE[1], '长期执政者，2024 年交棒。', { status: 'restricted', birthYear: 1952, nationality: '新加坡', wikipedia: 'https://zh.wikipedia.org/wiki/李显龙' }),
  person('per-sea-34', '李光耀', '新加坡开国总理', '政治', ['southeast_asia'], SINGAPORE[0], SINGAPORE[1], '新加坡建国之父。', { birthYear: 1923, deathYear: 2015, status: 'deceased', nationality: '新加坡' }),
  person('per-sea-35', '尚达曼', '新加坡总统', '政治', ['southeast_asia'], SINGAPORE[0], SINGAPORE[1], '新加坡总统。', { since: 2023, nationality: '新加坡' }),

  // ── 菲律宾 ──
  person('per-sea-2', '小马科斯', '菲律宾总统', '政治', ['southeast_asia'], MANILA[0], MANILA[1], '菲律宾领导人，强化美菲同盟与南海维权。', { since: 2022, nationality: '菲律宾', wikipedia: 'https://zh.wikipedia.org/wiki/小费迪南德·马科斯' }),
  person('per-sea-36', '萨拉·杜特尔特', '菲律宾副总统', '政治', ['southeast_asia'], MANILA[0], MANILA[1], '前总统杜特尔特长女。', { since: 2022, nationality: '菲律宾' }),
  person('per-sea-37', '罗德里戈·杜特尔特', '菲律宾前总统', '政治', ['southeast_asia'], 125.59, 7.12, '前总统，禁毒战争核心人物。', { status: 'restricted', birthYear: 1945, nationality: '菲律宾' }),

  // ── 柬埔寨 ──
  person('per-sea-3', '洪玛奈', '柬埔寨首相', '政治', ['southeast_asia'], 104.92, 11.56, '柬埔寨领导人，与中国在基建与军事上合作密切。', { since: 2023, nationality: '柬埔寨', wikipedia: 'https://zh.wikipedia.org/wiki/洪玛奈' }),
  person('per-sea-21', '洪森', '柬埔寨前首相', '政治', ['southeast_asia'], 104.92, 11.56, '亚洲执政时间最长的领导人之一。', { status: 'restricted', birthYear: 1952, nationality: '柬埔寨', wikipedia: 'https://zh.wikipedia.org/wiki/洪森' }),

  // ── 老挝 ──
  person('per-sea-4', '通伦·西苏里', '老挝国家主席', '政治', ['southeast_asia'], 102.63, 17.98, '老挝最高领导人，参与中老铁路与区域一体化。', { since: 2021, nationality: '老挝' }),
  person('per-sea-38', '松赛·西潘敦', '老挝总理', '政治', ['southeast_asia'], 102.63, 17.98, '老挝总理。', { since: 2022, nationality: '老挝' }),

  // ── 缅甸 ──
  person('per-sea-18', '敏昂莱', '缅甸国家管理委员会主席', '政治', ['southeast_asia'], NAYPYIDAW[0], NAYPYIDAW[1], '缅甸军政府首脑，2021 年政变后掌权。', { since: 2021, nationality: '缅甸', wikipedia: 'https://zh.wikipedia.org/wiki/敏昂莱' }),
  person('per-sea-39', '昂山素季', '缅甸前国务资政', '政治', ['southeast_asia'], 96.16, 16.80, '全国民主联盟领袖，2021 年政变后被拘。', { status: 'restricted', birthYear: 1945, nationality: '缅甸', wikipedia: 'https://zh.wikipedia.org/wiki/昂山素季' }),

  // ── 文莱 ──
  person('per-sea-40', '哈桑纳尔·博尔基亚', '文莱苏丹', '政治', ['southeast_asia'], BANDAR[0], BANDAR[1], '文莱绝对君主。', { since: 1967, nationality: '文莱' }),

  // ── 东帝汶 ──
  person('per-sea-41', '若泽·拉莫斯-奥尔塔', '东帝汶总统', '政治', ['southeast_asia'], DILI[0], DILI[1], '诺贝尔和平奖得主。', { since: 2022, birthYear: 1949, nationality: '东帝汶' }),
  person('per-sea-42', '沙纳纳·古斯芒', '东帝汶总理', '政治', ['southeast_asia'], DILI[0], DILI[1], '独立运动领袖。', { since: 2023, nationality: '东帝汶' }),
];
