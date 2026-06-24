import { person } from './helpers';

const TEHRAN = [51.39, 35.69] as const;
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
  person('per-ir-7', '马苏德·佩泽希齐扬', '伊朗总统', '政治', ['middleeast'], TEHRAN[0], TEHRAN[1], '改革派医生出身，2024 年当选总统，主张与西方接触。', { faction: 'iran', since: 2024, birthYear: 1954, nationality: '伊朗', wikipedia: 'https://zh.wikipedia.org/wiki/马苏德·佩泽希齐扬' }),
  person('per-ir-8', '穆罕默德·巴盖里', '伊朗武装部队总参谋长', '军事', ['middleeast'], TEHRAN[0], TEHRAN[1], '伊军最高军事指挥官，统筹革命卫队与正规军。', { faction: 'iran', nationality: '伊朗' }),
  person('per-ir-9', '埃卜拉希姆·莱希', '伊朗前总统', '政治', ['middleeast'], TEHRAN[0], TEHRAN[1], '强硬派总统，2024 年直升机坠毁身亡。', { faction: 'iran', birthYear: 1960, deathYear: 2024, status: 'deceased', nationality: '伊朗', wikipedia: 'https://zh.wikipedia.org/wiki/易卜拉欣·莱希' }),
  person('per-ir-10', '吴拉姆-侯赛因·穆赫贝里', '伊朗第一副总统', '政治', ['middleeast'], TEHRAN[0], TEHRAN[1], '莱希坠机后代理总统，现任第一副总统。', { faction: 'iran', nationality: '伊朗' }),
  person('per-ir-11', '穆罕默德·贾瓦德·扎里夫', '伊朗前外长、副总统', '政治', ['middleeast'], TEHRAN[0], TEHRAN[1], '伊核协议首席谈判代表，改革派核心。', { faction: 'iran', birthYear: 1960, nationality: '伊朗', wikipedia: 'https://zh.wikipedia.org/wiki/穆罕默德·贾瓦德·扎里夫' }),
  person('per-ir-12', '阿里·海德里', '伊朗石油部长', '经济', ['middleeast'], TEHRAN[0], TEHRAN[1], '主管伊朗能源出口与制裁规避。', { faction: 'iran', nationality: '伊朗' }),
  person('per-ir-13', '叶海亚·萨菲', '伊朗央行行长', '经济', ['middleeast'], TEHRAN[0], TEHRAN[1], '主管里亚尔汇率与通胀应对。', { faction: 'iran', nationality: '伊朗' }),

  // ── 伊朗代理人网络 ──
  person('per-ir-14', '哈立德·梅萨尔·达德', '伊拉克人民动员组织副指挥', '军事', ['middleeast'], BAGHDAD[0], BAGHDAD[1], '伊拉克什叶派民兵核心人物。', { faction: 'iran', nationality: '伊拉克' }),
  person('per-ir-15', '法尔汉·卡吉姆', '巴勒斯坦伊斯兰圣战组织秘书长', '军事', ['middleeast'], 35.21, 31.77, '杰哈德组织领导层，受伊朗支持。', { faction: 'iran', nationality: '巴勒斯坦' }),
  person('per-ir-16', '叶海亚·辛瓦尔', '哈马斯加沙地带前领导人', '军事', ['middleeast'], 34.45, 31.50, '2024 年 10 月被以军击毙，10·7 袭击主谋。', { faction: 'iran', birthYear: 1962, deathYear: 2024, status: 'deceased', nationality: '巴勒斯坦', wikipedia: 'https://zh.wikipedia.org/wiki/叶海亚·辛瓦尔' }),
  person('per-ir-17', '穆罕默德·戴夫', '哈马斯军事分支卡桑旅前指挥官', '军事', ['middleeast'], 34.45, 31.50, '哈马斯军事首脑，2024 年在以军空袭中身亡。', { faction: 'iran', birthYear: 1965, deathYear: 2024, status: 'deceased', nationality: '巴勒斯坦', wikipedia: 'https://zh.wikipedia.org/wiki/穆罕默德·戴夫' }),
  person('per-ir-18', '纳伊姆·卡西姆', '黎巴嫩真主党总书记', '政治', ['middleeast'], BEIRUT[0], BEIRUT[1], '纳斯鲁拉身亡后接任真主党领袖。', { faction: 'iran', nationality: '黎巴嫩', wikipedia: 'https://zh.wikipedia.org/wiki/纳伊姆·卡西姆' }),

  // ── 以色列 ──
  person('per-il-1', '本雅明·内塔尼亚胡', '以色列总理', '政治', ['middleeast'], JERUSALEM[0], JERUSALEM[1], '以方战时决策核心，协调国防与外交。', { faction: 'israel', since: 2022, birthYear: 1949, nationality: '以色列', avatar: `${WIKI}/7/7a/Benjamin_Netanyahu_Portrait_February_2023_(3x4_cropped).jpg`, wikipedia: 'https://zh.wikipedia.org/wiki/本雅明·内塔尼亚胡' }),
  person('per-il-2', '约阿夫·加兰特', '以色列国防部长', '军事', ['middleeast'], JERUSALEM[0], JERUSALEM[1], '负责国防与以军对黎巴嫩、真主党等战线。', { faction: 'israel', nationality: '以色列', wikipedia: 'https://en.wikipedia.org/wiki/Yoav_Gallant' }),
  person('per-il-3', '赫齐·哈勒维', '以色列国防军参谋长', '军事', ['middleeast'], JERUSALEM[0], JERUSALEM[1], '以军最高军职，负责作战计划与执行。', { faction: 'israel', nationality: '以色列' }),
  person('per-il-4', '艾萨克·赫尔佐格', '以色列总统', '政治', ['middleeast'], JERUSALEM[0], JERUSALEM[1], '以色列总统。', { faction: 'israel', since: 2021, nationality: '以色列' }),
  person('per-il-5', '伊斯雷尔·卡茨', '以色列外长', '政治', ['middleeast'], JERUSALEM[0], JERUSALEM[1], '以色列外长。', { faction: 'israel', nationality: '以色列' }),
  person('per-il-6', '伊塔马尔·本-格维尔', '以色列国家安全部长', '政治', ['middleeast'], JERUSALEM[0], JERUSALEM[1], '极右翼政治人物。', { faction: 'israel', nationality: '以色列' }),
  person('per-il-7', '埃亚勒·扎米尔', '以色列国防军新任总参谋长', '军事', ['middleeast'], JERUSALEM[0], JERUSALEM[1], '2025 年接任以军总参谋长。', { faction: 'israel', nationality: '以色列' }),
  person('per-il-8', '戴维·巴尔内亚', '摩萨德局长', '军事', ['middleeast'], JERUSALEM[0], JERUSALEM[1], '以色列情报与特勤局（摩萨德）局长。', { faction: 'israel', nationality: '以色列' }),
  person('per-il-9', '罗南·巴尔', '辛贝特局长', '军事', ['middleeast'], JERUSALEM[0], JERUSALEM[1], '以色列国家安全总局（辛贝特）局长。', { faction: 'israel', nationality: '以色列' }),
  person('per-il-10', '贝扎莱尔·斯莫特里奇', '以色列财政部长', '经济', ['middleeast'], JERUSALEM[0], JERUSALEM[1], '极右翼财政部长，定居点运动代表。', { faction: 'israel', nationality: '以色列' }),
  person('per-il-11', '亚伊尔·拉皮德', '以色列反对党领袖', '政治', ['middleeast'], JERUSALEM[0], JERUSALEM[1], '未来党党魁，前总理。', { faction: 'israel', birthYear: 1963, nationality: '以色列' }),
  person('per-il-12', '本尼·甘茨', '以色列国家团结党领袖', '政治', ['middleeast'], JERUSALEM[0], JERUSALEM[1], '前国防军总参谋长、前防长。', { faction: 'israel', birthYear: 1959, nationality: '以色列' }),
  person('per-il-13', '阿维格多·利伯曼', '以色列我们的家园党领袖', '政治', ['middleeast'], JERUSALEM[0], JERUSALEM[1], '前外长、前防长，右翼强硬派。', { faction: 'israel', nationality: '以色列' }),
  person('per-il-14', '埃亚勒·胡莱夫', '以色列央行行长', '经济', ['middleeast'], JERUSALEM[0], JERUSALEM[1], '以色列银行行长。', { faction: 'israel', nationality: '以色列' }),

  // ── 黎巴嫩 ──
  person('per-hz-1', '哈桑·纳斯鲁拉', '黎巴嫩真主党总书记', '政治', ['middleeast'], BEIRUT[0], BEIRUT[1], '真主党最高领导人，与伊朗协调对以行动。', { faction: 'iran', nationality: '黎巴嫩', avatar: `${WIKI}/2/2c/Sayyid_Nasrallah.jpg`, wikipedia: 'https://zh.wikipedia.org/wiki/哈桑·纳斯鲁拉' }),
  person('per-me-15', '纳吉布·米卡提', '黎巴嫩总理', '政治', ['middleeast'], BEIRUT[0], BEIRUT[1], '黎巴嫩看守总理。', { since: 2021, nationality: '黎巴嫩' }),
  person('per-hz-2', '纳伊姆·卡西姆（真主党现任）', '黎巴嫩真主党总书记', '政治', ['middleeast'], BEIRUT[0], BEIRUT[1], '纳斯鲁拉身亡后接任。（合并条目）', { faction: 'iran', nationality: '黎巴嫩' }),
  person('per-hz-3', '约瑟夫·奥恩', '黎巴嫩总统', '政治', ['middleeast'], BEIRUT[0], BEIRUT[1], '黎巴嫩军方总司令转任总统。', { since: 2025, nationality: '黎巴嫩' }),
  person('per-hz-4', '里雅德·萨拉马', '黎巴嫩前央行行长', '经济', ['middleeast'], BEIRUT[0], BEIRUT[1], '执掌黎央行 30 年，金融危机核心人物。', { status: 'restricted', nationality: '黎巴嫩', wikipedia: 'https://zh.wikipedia.org/wiki/里雅德·萨拉马' }),
  person('per-hz-5', '萨阿德·哈里里', '黎巴嫩前总理', '政治', ['middleeast'], BEIRUT[0], BEIRUT[1], '未来阵线领袖，逊尼派代表。', { status: 'restricted', birthYear: 1970, nationality: '黎巴嫩' }),
  person('per-hz-6', '米歇尔·奥恩', '黎巴嫩前总统', '政治', ['middleeast'], BEIRUT[0], BEIRUT[1], '自由爱国运动创建者，2016-2022 年任总统。', { status: 'restricted', nationality: '黎巴嫩' }),

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
  person('per-me-43', '阿西曼·戈马', '利比亚国民军司令', '军事', ['middleeast'], 13.18, 32.89, '东部军事强人哈夫塔尔麾下。（备注）', { nationality: '利比亚' }),
  person('per-me-44', '哈利法·贝卡西姆·哈夫塔尔', '利比亚国民军总司令', '军事', ['middleeast'], 20.27, 32.76, '利比亚东部军事强人。', { since: 2014, birthYear: 1943, nationality: '利比亚', wikipedia: 'https://zh.wikipedia.org/wiki/哈利法·哈夫塔尔' }),
  person('per-me-45', '阿卜杜勒·马吉德·特布恩', '阿尔及利亚总理（备注）', '政治', ['middleeast'], ALGIERS[0], ALGIERS[1], '阿尔及利亚行政首脑。', { nationality: '阿尔及利亚' }),
  person('per-me-46', '阿齐兹·阿卡努什', '摩洛哥前总理', '政治', ['middleeast'], RABAT[0], RABAT[1], '摩洛哥前首相。', { status: 'restricted', nationality: '摩洛哥' }),
  person('per-me-47', '穆罕默德·本·萨勒曼（北非影响）', '沙特王储（跨区）', '政治', ['middleeast'], CAIRO[0], CAIRO[1], '对北非有重要影响。（合并条目）', { since: 2017, nationality: '沙特阿拉伯' }),

  // ── 中东商界与金融 ──
  person('per-me-48', '瓦利德·本·塔拉勒', '沙特王子、投资家', '经济', ['middleeast'], RIYADH[0], RIYADH[1], '王国控股公司创始人，中东知名投资人。', { since: 1980, birthYear: 1955, nationality: '沙特阿拉伯', wikipedia: 'https://zh.wikipedia.org/wiki/瓦利德·本·塔拉勒' }),
  person('per-me-49', '苏尔坦·本·萨勒曼', '沙特旅游大臣', '经济', ['middleeast'], RIYADH[0], RIYADH[1], '推动沙特旅游业开放。', { nationality: '沙特阿拉伯' }),
  person('per-me-50', '穆罕默德·阿布纳扬', 'ACWA Power CEO', '经济', ['middleeast'], RIYADH[0], RIYADH[1], '沙特最大电力与海水淡化公司 CEO。', { since: 2020, nationality: '沙特阿拉伯' }),
  person('per-me-51', '易卜拉欣·阿勒易卜拉欣', '卡塔尔投资局 CEO', '经济', ['middleeast'], DOHA[0], DOHA[1], '卡塔尔主权财富基金负责人。', { since: 2018, nationality: '卡塔尔' }),
  person('per-me-52', '萨瓦尔·阿尔·纳贾尔', '阿联酋阿布扎比国家石油公司 CEO', '经济', ['middleeast'], ABU_DHABI[0], ABU_DHABI[1], 'ADNOC 掌门。', { since: 2018, nationality: '阿联酋' }),
  person('per-me-53', '亚西尔·鲁梅扬', '沙特公共投资基金（PIF）总裁', '经济', ['middleeast'], RIYADH[0], RIYADH[1], '全球最大主权基金之一 PIF 掌门，主导 Vision 2030 投资。', { since: 2015, nationality: '沙特阿拉伯' }),
  person('per-me-54', '纳赛尔·阿勒纳赛尔', '沙特公共投资基金高管', '经济', ['middleeast'], RIYADH[0], RIYADH[1], 'PIF 多元化投资负责人。', { nationality: '沙特阿拉伯' }),

  // ── 中东宗教领袖 ──
  person('per-me-55', '艾哈迈德·塔耶布', '爱资哈尔大伊玛目', '文化', ['middleeast'], CAIRO[0], CAIRO[1], '逊尼派最高权威，推动宗教对话与和平。', { since: 2010, nationality: '埃及' }),
  person('per-me-56', '阿亚图拉·西斯塔尼', '什叶派大阿亚图拉', '文化', ['middleeast'], 44.02, 32.62, '伊拉克纳杰夫什叶派最高宗教权威。', { since: 1990, birthYear: 1930, nationality: '伊拉克' }),
  person('per-me-57', '穆罕默德·赛义德·哈基姆', '什叶派阿亚图拉', '文化', ['middleeast'], 44.02, 32.62, '伊拉克什叶派高阶教法学家。', { nationality: '伊拉克' }),
  person('per-me-58', '提比略·阿尔卡拉', '耶路撒冷东正教主教', '文化', ['middleeast'], JERUSALEM[0], JERUSALEM[1], '耶路撒冷东正教宗主教。', { nationality: '以色列/巴勒斯坦' }),

  // ── 中东媒体与舆论 ──
  person('per-me-59', '瓦利德·阿尔-易卜拉欣', 'MBC 集团董事长', '文化', ['middleeast'], RIYADH[0], RIYADH[1], '中东广播中心（MBC）掌门，泛阿拉伯媒体。', { since: 1991, nationality: '沙特阿拉伯' }),
  person('per-me-60', '谢赫·哈马德·本·塔米尔', '半岛电视台创始人', '文化', ['middleeast'], DOHA[0], DOHA[1], '卡塔尔半岛媒体集团创始人之一。', { nationality: '卡塔尔' }),
  person('per-me-61', '穆罕默德·奥贝德', '阿拉比亚电视台台长', '文化', ['middleeast'], DOHA[0], DOHA[1], '与半岛竞争的泛阿拉伯新闻台。', { nationality: '阿联酋' }),

  // ── 中东异见人士与社会活动家 ──
  person('per-me-62', '拉伊夫·巴达维', '沙特博客作者、活动家', '社会', ['middleeast'], RIYADH[0], RIYADH[1], '因言获罪，言论自由象征。', { since: 2012, birthYear: 1984, nationality: '沙特阿拉伯' }),
  person('per-me-63', '纳齐克·阿勒艾比', '伊拉克女权活动家', '社会', ['middleeast'], BAGHDAD[0], BAGHDAD[1], '推动伊拉克女性权益。', { nationality: '伊拉克' }),
  person('per-me-64', '希琳·阿布·阿克利', '半岛电视台巴裔记者', '社会', ['middleeast'], 35.21, 31.77, '2022 年报道中被以军枪击身亡。', { birthYear: 1971, deathYear: 2022, status: 'deceased', nationality: '巴勒斯坦/美国' }),
];
