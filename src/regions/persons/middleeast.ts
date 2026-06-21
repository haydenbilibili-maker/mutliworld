import { person } from './helpers';

const TEHRAN = [51.39, 35.69] as const;
const WDC = [-77.04, 38.90] as const;
const JERUSALEM = [35.21, 31.77] as const;
const BEIRUT = [35.50, 33.89] as const;
const RIYADH = [46.72, 24.69] as const;
const DOHA = [51.53, 25.29] as const;
const ABU_DHABI = [54.37, 24.45] as const;
const CAIRO = [31.24, 30.04] as const;
const ANKARA = [32.86, 39.93] as const;
const BAGHDAD = [44.37, 33.31] as const;
const AMMAN = [35.93, 31.95] as const;
const KUWAIT = [47.97, 29.37] as const;
const MUSCAT = [58.59, 23.59] as const;
const SANAA = [44.21, 15.35] as const;
const ALGIERS = [3.06, 36.75] as const;
const RABAT = [-6.83, 34.01] as const;
const TUNIS = [10.18, 36.80] as const;

const WIKI = 'https://upload.wikimedia.org/wikipedia/commons';

/** 中东区域人物（含原目标人物数据迁移） */
export const MIDDLEEAST_PERSONS = [
  // ── 伊朗 ──
  person('per-ir-1', '阿里·哈梅内伊', '伊朗前最高领袖（已故）', '政治', ['middleeast'], TEHRAN[0], TEHRAN[1], '前最高领袖，美以联合行动中遇袭身亡。', { faction: 'iran', status: 'deceased', birthYear: 1939, deathYear: 2026, nationality: '伊朗', avatar: `${WIKI}/a/a4/Ali_khamenei_in_January_2021.jpg`, wikipedia: 'https://zh.wikipedia.org/wiki/阿里·哈梅内伊' }),
  person('per-ir-2', '阿里·拉里贾尼', '伊朗最高国家安全委员会秘书', '政治', ['middleeast'], TEHRAN[0], TEHRAN[1], '领袖空缺期间主导国安会与战略协调。', { faction: 'iran', nationality: '伊朗', avatar: `${WIKI}/6/6f/Ali_Larijani_13991023_1147094.jpg` }),
  person('per-ir-3', '侯赛因·阿米尔-阿卜杜拉希扬', '伊朗外交部长', '政治', ['middleeast'], TEHRAN[0], TEHRAN[1], '主导伊方对外表态与多边接触。', { faction: 'iran', nationality: '伊朗', avatar: `${WIKI}/e/ee/H-Amirabdollahian.jpg` }),
  person('per-ir-4', '侯赛因·萨拉米', '伊斯兰革命卫队司令', '军事', ['middleeast'], TEHRAN[0], TEHRAN[1], '革命卫队最高军事负责人。', { faction: 'iran', nationality: '伊朗' }),
  person('per-ir-5', '伊斯梅尔·卡尼', '圣城旅指挥官', '军事', ['middleeast'], TEHRAN[0], TEHRAN[1], '负责境外行动与代理人协调。', { faction: 'iran', nationality: '伊朗' }),
  person('per-ir-6', '穆罕默德·礼萨·纳克迪', '伊朗武装部队副总司令', '军事', ['middleeast'], TEHRAN[0], TEHRAN[1], '协调革命卫队与正规军。', { faction: 'iran', nationality: '伊朗' }),

  // ── 以色列 ──
  person('per-il-1', '本雅明·内塔尼亚胡', '以色列总理', '政治', ['middleeast'], JERUSALEM[0], JERUSALEM[1], '以方战时决策核心，协调国防与外交。', { faction: 'israel', since: 2022, birthYear: 1949, nationality: '以色列', avatar: `${WIKI}/7/7a/Benjamin_Netanyahu_Portrait_February_2023_(3x4_cropped).jpg`, wikipedia: 'https://zh.wikipedia.org/wiki/本雅明·内塔尼亚胡' }),
  person('per-il-2', '约阿夫·加兰特', '以色列国防部长', '军事', ['middleeast'], JERUSALEM[0], JERUSALEM[1], '负责国防与以军对黎巴嫩、真主党等战线。', { faction: 'israel', nationality: '以色列', wikipedia: 'https://en.wikipedia.org/wiki/Yoav_Gallant' }),
  person('per-il-3', '赫齐·哈勒维', '以色列国防军参谋长', '军事', ['middleeast'], JERUSALEM[0], JERUSALEM[1], '以军最高军职，负责作战计划与执行。', { faction: 'israel', nationality: '以色列' }),
  person('per-il-4', '艾萨克·赫尔佐格', '以色列总统', '政治', ['middleeast'], JERUSALEM[0], JERUSALEM[1], '以色列总统。', { faction: 'israel', since: 2021, nationality: '以色列' }),
  person('per-il-5', '伊斯雷尔·卡茨', '以色列外长', '政治', ['middleeast'], JERUSALEM[0], JERUSALEM[1], '以色列外长。', { faction: 'israel', nationality: '以色列' }),
  person('per-il-6', '伊塔马尔·本-格维尔', '以色列国家安全部长', '政治', ['middleeast'], JERUSALEM[0], JERUSALEM[1], '极右翼政治人物。', { faction: 'israel', nationality: '以色列' }),

  // ── 黎巴嫩 ──
  person('per-hz-1', '哈桑·纳斯鲁拉', '黎巴嫩真主党总书记', '政治', ['middleeast'], BEIRUT[0], BEIRUT[1], '真主党最高领导人，与伊朗协调对以行动。', { faction: 'iran', nationality: '黎巴嫩', avatar: `${WIKI}/2/2c/Sayyid_Nasrallah.jpg`, wikipedia: 'https://zh.wikipedia.org/wiki/哈桑·纳斯鲁拉' }),
  person('per-me-15', '纳吉布·米卡提', '黎巴嫩总理', '政治', ['middleeast'], BEIRUT[0], BEIRUT[1], '黎巴嫩看守总理。', { since: 2021, nationality: '黎巴嫩' }),

  // ── 沙特阿拉伯 ──
  person('per-me-1', '穆罕默德·本·萨勒曼', '沙特王储兼首相', '政治', ['middleeast'], RIYADH[0], RIYADH[1], '沙特实际统治者，主导 Vision 2030 与欧佩克+政策。', { since: 2017, birthYear: 1985, nationality: '沙特阿拉伯', wikipedia: 'https://zh.wikipedia.org/wiki/穆罕默德·本·萨勒曼' }),
  person('per-me-16', '萨勒曼·本·阿卜杜勒阿齐兹', '沙特国王', '政治', ['middleeast'], RIYADH[0], RIYADH[1], '沙特国王。', { since: 2015, nationality: '沙特阿拉伯' }),
  person('per-me-17', '费萨尔·本·法尔汉', '沙特外交大臣', '政治', ['middleeast'], RIYADH[0], RIYADH[1], '沙特外交大臣。', { since: 2019, nationality: '沙特阿拉伯' }),
  person('per-me-18', '阿明·纳赛尔', '沙特阿美 CEO', '经济', ['middleeast'], RIYADH[0], RIYADH[1], '全球最大石油公司 CEO。', { since: 2015, nationality: '沙特阿拉伯' }),

  // ── 阿联酋 ──
  person('per-me-3', '穆罕默德·本·扎耶德', '阿联酋总统', '政治', ['middleeast'], ABU_DHABI[0], ABU_DHABI[1], '阿联酋领导人，推动经济多元化与地区安全合作。', { since: 2022, nationality: '阿联酋', wikipedia: 'https://zh.wikipedia.org/wiki/穆罕默德·本·扎耶德·阿勒纳哈扬' }),
  person('per-me-19', '穆罕默德·本·拉希德', '阿联酋副总统兼总理', '政治', ['middleeast'], 55.30, 25.20, '迪拜统治者。', { since: 2006, nationality: '阿联酋' }),
  person('per-me-20', '阿卜杜拉·本·扎耶德', '阿联酋外长', '政治', ['middleeast'], ABU_DHABI[0], ABU_DHABI[1], '阿联酋外长。', { since: 2006, nationality: '阿联酋' }),
  person('per-me-21', '艾哈迈德·阿尔·马克图姆', '阿联酋主权基金 CEO', '经济', ['middleeast'], ABU_DHABI[0], ABU_DHABI[1], '阿布扎比投资局负责人。', { since: 2016, nationality: '阿联酋' }),

  // ── 卡塔尔 ──
  person('per-me-2', '谢赫·塔米姆', '卡塔尔埃米尔', '政治', ['middleeast'], DOHA[0], DOHA[1], '卡塔尔元首，在斡旋冲突与液化天然气出口中发挥影响力。', { since: 2013, nationality: '卡塔尔', wikipedia: 'https://zh.wikipedia.org/wiki/塔米姆·本·哈迈德·阿勒萨尼' }),
  person('per-me-22', '穆罕默德·本·阿卜杜勒拉赫曼', '卡塔尔首相兼外长', '政治', ['middleeast'], DOHA[0], DOHA[1], '卡塔尔首相。', { since: 2023, nationality: '卡塔尔' }),

  // ── 土耳其 ──
  person('per-me-6', '雷杰普·塔伊普·埃尔多安', '土耳其总统', '政治', ['middleeast'], ANKARA[0], ANKARA[1], '土耳其领导人，在北约与中东事务中寻求平衡角色。', { since: 2014, birthYear: 1954, nationality: '土耳其', wikipedia: 'https://zh.wikipedia.org/wiki/雷杰普·塔伊普·埃尔多安' }),
  person('per-me-23', '哈坎·菲丹', '土耳其外长', '政治', ['middleeast'], ANKARA[0], ANKARA[1], '土耳其外长。', { since: 2023, nationality: '土耳其' }),
  person('per-me-24', '亚沙尔·居莱尔', '土耳其国防部长', '军事', ['middleeast'], ANKARA[0], ANKARA[1], '土耳其防长。', { since: 2023, nationality: '土耳其' }),
  person('per-me-25', '哈菲兹·盖伊·埃尔坎', '土耳其央行行长', '经济', ['middleeast'], ANKARA[0], ANKARA[1], '土耳其央行行长。', { since: 2023, nationality: '土耳其' }),

  // ── 埃及 ──
  person('per-me-4', '阿卜杜勒-法塔赫·塞西', '埃及总统', '政治', ['middleeast'], CAIRO[0], CAIRO[1], '埃及领导人，在加沙人道走廊与地区稳定中居关键位置。', { since: 2014, birthYear: 1954, nationality: '埃及', wikipedia: 'https://zh.wikipedia.org/wiki/阿卜杜勒-法塔赫·塞西' }),
  person('per-me-26', '穆斯塔法·马德布利', '埃及总理', '政治', ['middleeast'], CAIRO[0], CAIRO[1], '埃及总理。', { since: 2018, nationality: '埃及' }),
  person('per-me-27', '萨迈赫·舒凯里', '埃及外长', '政治', ['middleeast'], CAIRO[0], CAIRO[1], '埃及外长。', { since: 2014, nationality: '埃及' }),

  // ── 伊拉克 ──
  person('per-me-28', '阿卜杜勒·拉蒂夫·拉希德', '伊拉克总统', '政治', ['middleeast'], BAGHDAD[0], BAGHDAD[1], '伊拉克总统。', { since: 2022, nationality: '伊拉克' }),
  person('per-me-29', '穆罕默德·希亚·苏达尼', '伊拉克总理', '政治', ['middleeast'], BAGHDAD[0], BAGHDAD[1], '伊拉克总理。', { since: 2022, nationality: '伊拉克' }),
  person('per-me-30', '福阿德·侯赛因', '伊拉克外长', '政治', ['middleeast'], BAGHDAD[0], BAGHDAD[1], '伊拉克外长。', { since: 2020, nationality: '伊拉克' }),

  // ── 约旦 ──
  person('per-me-12', '阿卜杜拉二世', '约旦国王', '政治', ['middleeast'], AMMAN[0], AMMAN[1], '哈希姆王国元首，在巴以冲突中居调解关键位置。', { since: 1999, birthYear: 1962, nationality: '约旦', wikipedia: 'https://zh.wikipedia.org/wiki/阿卜杜拉二世' }),
  person('per-me-31', '奥马尔·拉扎兹', '约旦首相', '政治', ['middleeast'], AMMAN[0], AMMAN[1], '约旦首相。', { since: 2023, nationality: '约旦' }),

  // ── 也门 ──
  person('per-me-5', '阿卜杜勒·马利克·胡塞', '胡塞武装领导人', '军事', ['middleeast'], SANAA[0], SANAA[1], '也门胡塞武装最高领导人，控制红海航运威胁。', { since: 2004, nationality: '也门', wikipedia: 'https://en.wikipedia.org/wiki/Abdul-Malik_al-Houthi' }),

  // ── 海湾国家 ──
  person('per-me-32', '米沙勒·艾哈迈德·萨巴赫', '科威特埃米尔', '政治', ['middleeast'], KUWAIT[0], KUWAIT[1], '科威特埃米尔。', { since: 2023, nationality: '科威特' }),
  person('per-me-33', '海塞姆·本·塔里克', '阿曼苏丹', '政治', ['middleeast'], MUSCAT[0], MUSCAT[1], '阿曼苏丹。', { since: 2020, nationality: '阿曼' }),
  person('per-me-34', '哈马德·本·伊萨', '巴林国王', '政治', ['middleeast'], 50.56, 26.21, '巴林国王。', { since: 1999, nationality: '巴林' }),

  // ── 巴勒斯坦 ──
  person('per-me-11', '马哈茂德·阿巴斯', '巴勒斯坦总统', '政治', ['middleeast'], 35.20, 31.90, '法塔赫领导人，年逾九旬仍掌握巴权力机构。', { since: 2005, birthYear: 1935, nationality: '巴勒斯坦', wikipedia: 'https://zh.wikipedia.org/wiki/马哈茂德·阿巴斯' }),
  person('per-me-35', '穆罕默德·穆斯塔法', '巴勒斯坦总理', '政治', ['middleeast'], 35.20, 31.90, '巴勒斯坦权力机构行政首脑。', { since: 2024, nationality: '巴勒斯坦' }),
  person('per-me-36', '伊斯梅尔·哈尼亚', '哈马斯政治局前主席', '政治', ['middleeast'], 51.53, 25.29, '哈马斯前政治领袖。', { status: 'deceased', nationality: '巴勒斯坦' }),

  // ── 北非 ──
  person('per-me-37', '阿卜杜勒-马吉德·特本', '阿尔及利亚总统', '政治', ['middleeast'], ALGIERS[0], ALGIERS[1], '阿尔及利亚总统。', { since: 2019, nationality: '阿尔及利亚' }),
  person('per-me-38', '穆罕默德六世', '摩洛哥国王', '政治', ['middleeast'], RABAT[0], RABAT[1], '摩洛哥国王。', { since: 1999, nationality: '摩洛哥' }),
  person('per-me-39', '凯斯·赛义德', '突尼斯总统', '政治', ['middleeast'], TUNIS[0], TUNIS[1], '突尼斯总统。', { since: 2019, nationality: '突尼斯' }),
  person('per-me-40', '阿卜杜勒-哈米德·德贝巴', '利比亚总理', '政治', ['middleeast'], 13.18, 32.89, '利比亚民族团结政府总理。', { since: 2021, nationality: '利比亚' }),
  person('per-me-41', '穆罕默德·门菲', '利比亚总统委员会主席', '政治', ['middleeast'], 13.18, 32.89, '利比亚国家元首。', { since: 2021, nationality: '利比亚' }),
  person('per-me-42', '易卜拉欣·特拉奥雷', '布基纳法索过渡总统', '政治', ['middleeast'], -1.53, 12.37, '萨赫勒地区军政府领导人。', { since: 2022, nationality: '布基纳法索' }),
];
