import { person } from './helpers';

const SINGAPORE = [103.85, 1.35] as const;
const BANGKOK = [100.50, 13.75] as const;
const JAKARTA = [106.85, -6.21] as const;
const MANILA = [120.98, 14.60] as const;
const HANOI = [105.85, 21.03] as const;
const KUALA = [101.69, 3.14] as const;

/** 东南亚区域人物 */
export const SOUTHEAST_ASIA_PERSONS = [
  person('per-sea-1', '普拉博沃·苏比安托', '印尼总统', '政治', ['southeast_asia'], JAKARTA[0], JAKARTA[1], '东盟最大经济体领导人，延续不结盟外交。', { since: 2024, wikipedia: 'https://zh.wikipedia.org/wiki/普拉博沃·苏比安托' }),
  person('per-sea-2', '小马科斯', '菲律宾总统', '政治', ['southeast_asia'], MANILA[0], MANILA[1], '菲律宾领导人，强化美菲同盟与南海维权。', { since: 2022, wikipedia: 'https://zh.wikipedia.org/wiki/小费迪南德·马科斯' }),
  person('per-sea-3', '洪玛奈', '柬埔寨首相', '政治', ['southeast_asia'], 104.92, 11.56, '柬埔寨领导人，与中国在基建与军事上合作密切。', { since: 2023, wikipedia: 'https://zh.wikipedia.org/wiki/洪玛奈' }),
  person('per-sea-4', '通伦·西苏里', '老挝国家主席', '政治', ['southeast_asia'], 102.63, 17.98, '老挝最高领导人，参与中老铁路与区域一体化。', { since: 2021 }),
  person('per-sea-5', '范明政', '越南总理', '政治', ['southeast_asia'], HANOI[0], HANOI[1], '越南政府首脑，推动制造业外资与供应链转移。', { since: 2021, wikipedia: 'https://zh.wikipedia.org/wiki/范明政' }),
  person('per-sea-6', '阮富仲', '越共中央总书记', '政治', ['southeast_asia'], HANOI[0], HANOI[1], '越南最高政治领导人，2024 年病逝。', { status: 'deceased', wikipedia: 'https://zh.wikipedia.org/wiki/阮富仲' }),
  person('per-sea-7', '李显龙', '新加坡前总理', '政治', ['southeast_asia'], SINGAPORE[0], SINGAPORE[1], '长期执政者，2024 年交棒，奠定新加坡枢纽地位。', { status: 'restricted', wikipedia: 'https://zh.wikipedia.org/wiki/李显龙' }),
  person('per-sea-8', '黄循财', '新加坡总理', '政治', ['southeast_asia'], SINGAPORE[0], SINGAPORE[1], '新加坡第四任总理，延续务实外交与金融中心战略。', { since: 2024, wikipedia: 'https://zh.wikipedia.org/wiki/黄循财' }),
  person('per-sea-9', '赛塔·他威信', '泰国前总理', '政治', ['southeast_asia'], BANGKOK[0], BANGKOK[1], '2024 年被宪法法院解职，泰国政局动荡象征。', { status: 'restricted', wikipedia: 'https://en.wikipedia.org/wiki/Srettha_Thavisin' }),
  person('per-sea-10', '佩通坦·钦那瓦', '泰国总理', '政治', ['southeast_asia'], BANGKOK[0], BANGKOK[1], '他信之女，2024 年出任总理，面临军方与王室平衡。', { since: 2024, wikipedia: 'https://zh.wikipedia.org/wiki/佩通坦·钦那瓦' }),
  person('per-sea-11', '安瓦尔·易卜拉欣', '马来西亚总理', '政治', ['southeast_asia'], KUALA[0], KUALA[1], '团结政府领袖，推动多元种族治理与对华经贸。', { since: 2022, wikipedia: 'https://zh.wikipedia.org/wiki/安瓦尔·易卜拉欣' }),
  person('per-sea-12', '东姑·伊斯梅尔', '马来西亚国防部长', '军事', ['southeast_asia'], KUALA[0], KUALA[1], '负责南海方向军事合作与装备采购。'),
  person('per-sea-13', '佐科·维多多', '印尼前总统', '政治', ['southeast_asia'], JAKARTA[0], JAKARTA[1], '任内推动新首都建设与镍矿下游化。', { status: 'restricted', wikipedia: 'https://zh.wikipedia.org/wiki/佐科·维多多' }),
  person('per-sea-14', '米歇尔·乔科诺', '菲律宾外长', '政治', ['southeast_asia'], MANILA[0], MANILA[1], '负责南海仲裁与对美安全合作外交。'),

  // 新增（密度提升）
  person('per-sea-15', '苏林', '越共中央总书记', '政治', ['southeast_asia'], HANOI[0], HANOI[1], '2024 年接任越共最高领导职务，延续阮富仲路线。', { since: 2024, wikipedia: 'https://zh.wikipedia.org/wiki/苏林' }),
  person('per-sea-16', '阿努廷·查农', '泰国内政部长', '政治', ['southeast_asia'], BANGKOK[0], BANGKOK[1], '泰自豪党领袖，推动大麻合法化与医疗政策。', { since: 2023 }),
  person('per-sea-17', '穆希丁·亚辛', '马来西亚前总理', '政治', ['southeast_asia'], KUALA[0], KUALA[1], '土著团结党主席，2020–2021 年任总理。', { status: 'restricted', wikipedia: 'https://en.wikipedia.org/wiki/Muhyiddin_Yassin' }),
  person('per-sea-18', '庆特', '缅甸国家管理委员会主席', '政治', ['southeast_asia'], 96.16, 16.80, '缅甸军政府首脑，2021 年政变后掌权。', { since: 2021, wikipedia: 'https://zh.wikipedia.org/wiki/敏昂莱' }),
  person('per-sea-19', '阮春福', '越南前总理、前国家主席', '政治', ['southeast_asia'], HANOI[0], HANOI[1], '2021–2023 年任国家主席，因防疫腐败案辞任。', { status: 'restricted' }),
  person('per-sea-20', '吴作栋', '新加坡前总理', '政治', ['southeast_asia'], SINGAPORE[0], SINGAPORE[1], '1990–2004 年执政，奠定新加坡经济腾飞基础。', { since: 1990, status: 'restricted', wikipedia: 'https://zh.wikipedia.org/wiki/吴作栋' }),
  person('per-sea-21', '洪森', '柬埔寨前首相', '政治', ['southeast_asia'], 104.92, 11.56, '亚洲执政时间最长的领导人之一，2023 年交棒长子。', { status: 'restricted', wikipedia: 'https://zh.wikipedia.org/wiki/洪森' }),
  person('per-sea-22', '潘基文', '联合国前秘书长', '社会', ['southeast_asia'], 126.98, 37.57, '韩国外交官，2007–2016 年领导联合国，关注气候与和平。', { since: 2007, wikipedia: 'https://zh.wikipedia.org/wiki/潘基文' }),
  person('per-sea-23', '拉莫斯', '菲律宾前总统', '政治', ['southeast_asia'], MANILA[0], MANILA[1], '1992–1998 年领导菲律宾，推动经济自由化与东盟合作。', { status: 'deceased' }),
  person('per-sea-24', '马哈蒂尔·穆罕默德', '马来西亚前总理', '政治', ['southeast_asia'], KUALA[0], KUALA[1], '两度任总理（1981–2003、2018–2020），亚洲政坛传奇。', { since: 1981, status: 'restricted', wikipedia: 'https://zh.wikipedia.org/wiki/马哈蒂尔·穆罕默德' }),
];
