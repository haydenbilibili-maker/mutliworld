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
  person('per-sea-43', '苏吉约诺', '印尼外交部长', '政治', ['southeast_asia'], JAKARTA[0], JAKARTA[1], '普拉博沃政府外交部长。', { since: 2024, nationality: '印度尼西亚' }),
  person('per-sea-44', '沙弗里·沙姆苏丁', '印尼国防部长', '军事', ['southeast_asia'], JAKARTA[0], JAKARTA[1], '前海军参谋长，现任防长。', { since: 2024, nationality: '印度尼西亚' }),
  person('per-sea-45', '阿古斯·苏比延托', '印尼国民军总司令', '军事', ['southeast_asia'], JAKARTA[0], JAKARTA[1], '印尼军队最高指挥官。', { since: 2023, nationality: '印度尼西亚' }),
  person('per-sea-46', '佩里·瓦吉约', '印尼央行行长', '经济', ['southeast_asia'], JAKARTA[0], JAKARTA[1], '印度尼西亚银行行长。', { since: 2023, nationality: '印度尼西亚' }),
  person('per-sea-47', '彭云鹏', '巴里托太平洋集团创始人', '经济', ['southeast_asia'], JAKARTA[0], JAKARTA[1], '印尼华裔富豪，林业与石化大亨。', { since: 1977, birthYear: 1944, nationality: '印度尼西亚' }),
  person('per-sea-48', '黄惠祥', '针记集团副主席', '经济', ['southeast_asia'], JAKARTA[0], JAKARTA[1], '印尼华裔富豪，针记烟草与中亚银行。', { birthYear: 1940, nationality: '印度尼西亚' }),
  person('per-sea-49', '黄惠忠', '中亚银行董事长', '经济', ['southeast_asia'], JAKARTA[0], JAKARTA[1], '印尼华裔首富，中亚银行。', { birthYear: 1940, nationality: '印度尼西亚' }),

  // ── 越南 ──
  person('per-sea-15', '苏林', '越共中央总书记', '政治', ['southeast_asia'], HANOI[0], HANOI[1], '2024 年接任越共最高领导职务。', { since: 2024, nationality: '越南', wikipedia: 'https://zh.wikipedia.org/wiki/苏林' }),
  person('per-sea-5', '范明政', '越南总理', '政治', ['southeast_asia'], HANOI[0], HANOI[1], '越南政府首脑，推动制造业外资与供应链转移。', { since: 2021, nationality: '越南', wikipedia: 'https://zh.wikipedia.org/wiki/范明政' }),
  person('per-sea-6', '阮富仲', '越共前总书记', '政治', ['southeast_asia'], HANOI[0], HANOI[1], '越南前最高政治领导人，2024 年病逝。', { birthYear: 1944, deathYear: 2024, status: 'deceased', nationality: '越南', wikipedia: 'https://zh.wikipedia.org/wiki/阮富仲' }),
  person('per-sea-27', '武文赏', '越南前国家主席', '政治', ['southeast_asia'], HANOI[0], HANOI[1], '前国家主席。', { status: 'restricted', nationality: '越南' }),
  person('per-sea-28', '裴青山', '越南外长', '政治', ['southeast_asia'], HANOI[0], HANOI[1], '越南外长。', { since: 2024, nationality: '越南' }),
  person('per-sea-29', '潘文江', '越南国防部长', '军事', ['southeast_asia'], HANOI[0], HANOI[1], '越南防长。', { since: 2021, nationality: '越南' }),
  person('per-sea-50', '梁强', '越南国家主席', '政治', ['southeast_asia'], HANOI[0], HANOI[1], '2024 年接任越南国家主席。', { since: 2024, nationality: '越南' }),
  person('per-sea-51', '陈青敏', '越南国会主席', '政治', ['southeast_asia'], HANOI[0], HANOI[1], '越南国会主席。', { since: 2024, nationality: '越南' }),
  person('per-sea-52', '阮氏红', '越南国家银行行长', '经济', ['southeast_asia'], HANOI[0], HANOI[1], '越南央行行长。', { since: 2020, nationality: '越南' }),
  person('per-sea-53', '范日旺', 'Vingroup 创始人', '经济', ['southeast_asia'], HANOI[0], HANOI[1], '越南首富，地产、汽车（VinFast）、科技跨界。', { since: 2002, birthYear: 1968, nationality: '越南', wikipedia: 'https://zh.wikipedia.org/wiki/范日旺' }),

  // ── 泰国 ──
  person('per-sea-10', '佩通坦·钦那瓦', '泰国总理', '政治', ['southeast_asia'], BANGKOK[0], BANGKOK[1], '他信之女，2024 年出任总理。', { since: 2024, birthYear: 1986, nationality: '泰国', wikipedia: 'https://zh.wikipedia.org/wiki/佩通坦·钦那瓦' }),
  person('per-sea-9', '赛塔·他威信', '泰国前总理', '政治', ['southeast_asia'], BANGKOK[0], BANGKOK[1], '2024 年被宪法法院解职。', { status: 'restricted', nationality: '泰国', wikipedia: 'https://en.wikipedia.org/wiki/Srettha_Thavisin' }),
  person('per-sea-30', '巴育·占奥差', '泰国前总理', '政治', ['southeast_asia'], BANGKOK[0], BANGKOK[1], '2014 年政变后任总理。', { since: 2014, status: 'restricted', nationality: '泰国' }),
  person('per-sea-31', '玛哈·哇集拉隆功', '泰国国王', '文化', ['southeast_asia'], BANGKOK[0], BANGKOK[1], '泰国拉玛十世国王。', { since: 2016, nationality: '泰国' }),
  person('per-sea-54', '他信·钦那瓦', '泰国前总理', '政治', ['southeast_asia'], BANGKOK[0], BANGKOK[1], '佩通坦之父，电信大亨转政坛，流亡后回国。', { since: 2001, birthYear: 1949, nationality: '泰国', wikipedia: 'https://zh.wikipedia.org/wiki/他信·钦那瓦' }),
  person('per-sea-55', '玛诺帕·萨欧', '泰国央行行长', '经济', ['southeast_asia'], BANGKOK[0], BANGKOK[1], '泰国银行行长。', { since: 2022, nationality: '泰国' }),
  person('per-sea-56', '谢国民', '正大集团董事长', '经济', ['southeast_asia'], BANGKOK[0], BANGKOK[1], '泰籍华裔首富，正大（卜蜂）集团掌门。', { since: 1989, birthYear: 1939, nationality: '泰国', wikipedia: 'https://zh.wikipedia.org/wiki/谢国民' }),
  person('per-sea-57', '苏旭明', '泰国酿酒巨头', '经济', ['southeast_asia'], BANGKOK[0], BANGKOK[1], '泰籍华裔，泰国啤酒大亨。', { birthYear: 1944, nationality: '泰国' }),

  // ── 马来西亚 ──
  person('per-sea-11', '安瓦尔·易卜拉欣', '马来西亚总理', '政治', ['southeast_asia'], KUALA[0], KUALA[1], '团结政府领袖，推动多元种族治理与对华经贸。', { since: 2022, birthYear: 1947, nationality: '马来西亚', wikipedia: 'https://zh.wikipedia.org/wiki/安瓦尔·易卜拉欣' }),
  person('per-sea-24', '马哈蒂尔·穆罕默德', '马来西亚前总理', '政治', ['southeast_asia'], KUALA[0], KUALA[1], '两度任总理，亚洲政坛传奇。', { status: 'restricted', birthYear: 1925, nationality: '马来西亚', wikipedia: 'https://zh.wikipedia.org/wiki/马哈蒂尔·穆罕默德' }),
  person('per-sea-32', '阿兹莎·拉扎克', '马来西亚家庭发展部长', '政治', ['southeast_asia'], KUALA[0], KUALA[1], '安瓦尔夫人。', { since: 2022, nationality: '马来西亚' }),
  person('per-sea-33', '穆希丁·亚辛', '马来西亚前总理', '政治', ['southeast_asia'], KUALA[0], KUALA[1], '土著团结党主席。', { status: 'restricted', nationality: '马来西亚', wikipedia: 'https://en.wikipedia.org/wiki/Muhyiddin_Yassin' }),
  person('per-sea-58', '易卜拉欣·伊斯干达', '马来西亚最高元首', '文化', ['southeast_asia'], KUALA[0], KUALA[1], '柔佛苏丹，2024 年出任最高元首。', { since: 2024, nationality: '马来西亚' }),
  person('per-sea-59', '莫哈末·阿赞', '马来西亚央行行长', '经济', ['southeast_asia'], KUALA[0], KUALA[1], '马来西亚国家银行行长。', { since: 2023, nationality: '马来西亚' }),
  person('per-sea-60', '郭鹤年', '嘉里集团创始人', '经济', ['southeast_asia'], KUALA[0], KUALA[1], '「亚洲糖王」，香格里拉酒店与金龙鱼掌门。', { since: 1949, birthYear: 1923, nationality: '马来西亚', wikipedia: 'https://zh.wikipedia.org/wiki/郭鹤年' }),
  person('per-sea-61', '阿南达·克里希南', 'Maxis 电信创始人', '经济', ['southeast_asia'], KUALA[0], KUALA[1], '马来西亚电信与媒体大亨。', { since: 1980, birthYear: 1938, nationality: '马来西亚' }),
  person('per-sea-62', '杨紫琼', '演员', '文化', ['southeast_asia'], KUALA[0], KUALA[1], '奥斯卡影后，马来西亚华裔。（合并条目）', { since: 1980, birthYear: 1962, nationality: '马来西亚', wikipedia: 'https://zh.wikipedia.org/wiki/杨紫琼' }),

  // ── 新加坡 ──
  person('per-sea-8', '黄循财', '新加坡总理', '政治', ['southeast_asia'], SINGAPORE[0], SINGAPORE[1], '新加坡第四任总理，延续务实外交与金融中心战略。', { since: 2024, nationality: '新加坡', wikipedia: 'https://zh.wikipedia.org/wiki/黄循财' }),
  person('per-sea-7', '李显龙', '新加坡前总理', '政治', ['southeast_asia'], SINGAPORE[0], SINGAPORE[1], '长期执政者，2024 年交棒。', { status: 'restricted', birthYear: 1952, nationality: '新加坡', wikipedia: 'https://zh.wikipedia.org/wiki/李显龙' }),
  person('per-sea-34', '李光耀', '新加坡开国总理', '政治', ['southeast_asia'], SINGAPORE[0], SINGAPORE[1], '新加坡建国之父。', { birthYear: 1923, deathYear: 2015, status: 'deceased', nationality: '新加坡' }),
  person('per-sea-35', '尚达曼', '新加坡总统', '政治', ['southeast_asia'], SINGAPORE[0], SINGAPORE[1], '新加坡总统。', { since: 2023, nationality: '新加坡' }),
  person('per-sea-63', '颜金勇', '新加坡副总理', '政治', ['southeast_asia'], SINGAPORE[0], SINGAPORE[1], '黄循财政府副总理。', { since: 2024, nationality: '新加坡' }),
  person('per-sea-64', '维文', '新加坡外交部长', '政治', ['southeast_asia'], SINGAPORE[0], SINGAPORE[1], '新加坡外长。', { since: 2015, nationality: '新加坡' }),
  person('per-sea-65', '黄国松', '新加坡金融管理局局长', '经济', ['southeast_asia'], SINGAPORE[0], SINGAPORE[1], '新加坡金管局局长。', { since: 2023, nationality: '新加坡' }),
  person('per-sea-66', '李一星', '淡马锡控股 CEO', '经济', ['southeast_asia'], SINGAPORE[0], SINGAPORE[1], '新加坡主权基金淡马锡 CEO。', { since: 2024, nationality: '新加坡' }),
  person('per-sea-67', '郭氏兄弟（新加坡）', '丰益国际创始人', '经济', ['southeast_asia'], SINGAPORE[0], SINGAPORE[1], '丰益国际（Wilmar），全球棕榈油与粮油巨头。', { since: 1991, nationality: '新加坡/马来西亚' }),

  // ── 菲律宾 ──
  person('per-sea-2', '小马科斯', '菲律宾总统', '政治', ['southeast_asia'], MANILA[0], MANILA[1], '菲律宾领导人，强化美菲同盟与南海维权。', { since: 2022, nationality: '菲律宾', wikipedia: 'https://zh.wikipedia.org/wiki/小费迪南德·马科斯' }),
  person('per-sea-36', '萨拉·杜特尔特', '菲律宾副总统', '政治', ['southeast_asia'], MANILA[0], MANILA[1], '前总统杜特尔特长女。', { since: 2022, nationality: '菲律宾' }),
  person('per-sea-37', '罗德里戈·杜特尔特', '菲律宾前总统', '政治', ['southeast_asia'], 125.59, 7.12, '前总统，禁毒战争核心人物。', { status: 'restricted', birthYear: 1945, nationality: '菲律宾' }),
  person('per-sea-68', '恩里克·马纳洛', '菲律宾外交部长', '政治', ['southeast_asia'], MANILA[0], MANILA[1], '菲律宾外长。', { since: 2022, nationality: '菲律宾' }),
  person('per-sea-69', '吉尔贝托·特奥多罗', '菲律宾国防部长', '军事', ['southeast_asia'], MANILA[0], MANILA[1], '菲律宾国防部长，南海议题核心。', { since: 2023, nationality: '菲律宾' }),
  person('per-sea-70', '罗密欧·布劳纳', '菲律宾武装部队总参谋长', '军事', ['southeast_asia'], MANILA[0], MANILA[1], '菲军最高指挥官。', { since: 2023, nationality: '菲律宾' }),
  person('per-sea-71', '埃利奥多罗·蒙波松', '菲律宾央行行长', '经济', ['southeast_asia'], MANILA[0], MANILA[1], '菲律宾中央银行行长。', { since: 2023, nationality: '菲律宾' }),
  person('per-sea-72', '施至成', 'SM 投资集团创始人', '经济', ['southeast_asia'], MANILA[0], MANILA[1], '菲华商巨头，SM 零售与地产帝国。（已故）', { status: 'deceased', nationality: '菲律宾' }),
  person('per-sea-73', '曼尼·帕奎奥', '前拳击运动员、参议员', '文化', ['southeast_asia'], MANILA[0], MANILA[1], '拳王转参议员，菲律宾国民英雄。', { since: 1995, birthYear: 1978, nationality: '菲律宾', wikipedia: 'https://zh.wikipedia.org/wiki/曼尼·帕奎奥' }),

  // ── 柬埔寨 ──
  person('per-sea-3', '洪玛奈', '柬埔寨首相', '政治', ['southeast_asia'], 104.92, 11.56, '柬埔寨领导人，与中国在基建与军事上合作密切。', { since: 2023, nationality: '柬埔寨', wikipedia: 'https://zh.wikipedia.org/wiki/洪玛奈' }),
  person('per-sea-21', '洪森', '柬埔寨前首相', '政治', ['southeast_asia'], 104.92, 11.56, '亚洲执政时间最长的领导人之一。', { status: 'restricted', birthYear: 1952, nationality: '柬埔寨', wikipedia: 'https://zh.wikipedia.org/wiki/洪森' }),
  person('per-sea-74', '狄班', '柬埔寨前副首相兼国防部长', '军事', ['southeast_asia'], 104.92, 11.56, '长期担任柬埔寨防长。', { since: 2006, nationality: '柬埔寨' }),
  person('per-sea-75', '何南丰', '柬埔寨前副首相兼外交大臣', '政治', ['southeast_asia'], 104.92, 11.56, '柬埔寨资深外交家，2023 年逝世。', { birthYear: 1943, deathYear: 2023, status: 'deceased', nationality: '柬埔寨' }),
  person('per-sea-76', '陈丰明', '加华银行董事长', '经济', ['southeast_asia'], 104.92, 11.56, '柬埔寨华裔首富，加华集团掌门。', { since: 1991, birthYear: 1965, nationality: '柬埔寨' }),

  // ── 老挝 ──
  person('per-sea-4', '通伦·西苏里', '老挝国家主席', '政治', ['southeast_asia'], 102.63, 17.98, '老挝最高领导人，参与中老铁路与区域一体化。', { since: 2021, nationality: '老挝' }),
  person('per-sea-38', '松赛·西潘敦', '老挝总理', '政治', ['southeast_asia'], 102.63, 17.98, '老挝总理。', { since: 2022, nationality: '老挝' }),
  person('per-sea-77', '本扬·沃拉吉', '老挝前国家主席', '政治', ['southeast_asia'], 102.63, 17.98, '老挝前国家主席。', { status: 'restricted', nationality: '老挝' }),

  // ── 缅甸 ──
  person('per-sea-18', '敏昂莱', '缅甸国家管理委员会主席', '政治', ['southeast_asia'], NAYPYIDAW[0], NAYPYIDAW[1], '缅甸军政府首脑，2021 年政变后掌权。', { since: 2021, nationality: '缅甸', wikipedia: 'https://zh.wikipedia.org/wiki/敏昂莱' }),
  person('per-sea-39', '昂山素季', '缅甸前国务资政', '政治', ['southeast_asia'], 96.16, 16.80, '全国民主联盟领袖，2021 年政变后被拘。', { status: 'restricted', birthYear: 1945, nationality: '缅甸', wikipedia: 'https://zh.wikipedia.org/wiki/昂山素季' }),
  person('per-sea-78', '梭温', '缅甸国防军副总司令', '军事', ['southeast_asia'], NAYPYIDAW[0], NAYPYIDAW[1], '军政府二号人物，空军出身。', { since: 2021, nationality: '缅甸' }),
  person('per-sea-79', '登盛', '缅甸前总统', '政治', ['southeast_asia'], NAYPYIDAW[0], NAYPYIDAW[1], '前总统，主导政治改革过渡。', { status: 'restricted', nationality: '缅甸' }),
  person('per-sea-80', '敏哥奈', '缅甸民族团结政府代总统', '政治', ['southeast_asia'], 96.16, 16.80, '军政府反对派流亡政府代总统。', { since: 2024, nationality: '缅甸' }),

  // ── 文莱 ──
  person('per-sea-40', '哈桑纳尔·博尔基亚', '文莱苏丹', '政治', ['southeast_asia'], BANDAR[0], BANDAR[1], '文莱绝对君主。', { since: 1967, nationality: '文莱' }),
  person('per-sea-81', '马丁王子', '文莱王子', '文化', ['southeast_asia'], BANDAR[0], BANDAR[1], '文莱王室网红成员，社交媒体影响力大。', { birthYear: 1991, nationality: '文莱' }),

  // ── 东帝汶 ──
  person('per-sea-41', '若泽·拉莫斯-奥尔塔', '东帝汶总统', '政治', ['southeast_asia'], DILI[0], DILI[1], '诺贝尔和平奖得主。', { since: 2022, birthYear: 1949, nationality: '东帝汶' }),
  person('per-sea-42', '沙纳纳·古斯芒', '东帝汶总理', '政治', ['southeast_asia'], DILI[0], DILI[1], '独立运动领袖。', { since: 2023, nationality: '东帝汶' }),
  person('per-sea-82', '马里·阿尔卡蒂里', '东帝汶前总理', '政治', ['southeast_asia'], DILI[0], DILI[1], '首任总理，革阵党领袖。', { status: 'restricted', nationality: '东帝汶' }),

  // ── 东南亚文化与体育 ──
  person('per-sea-83', '马赛多', '印尼羽毛球名将', '文化', ['southeast_asia'], JAKARTA[0], JAKARTA[1], '印尼羽毛球男单运动员。', { since: 2010, nationality: '印度尼西亚' }),
  person('per-sea-84', '李宗伟', '前马来西亚羽毛球运动员', '文化', ['southeast_asia'], KUALA[0], KUALA[1], '马来西亚羽毛球名将，三届奥运银牌。', { since: 2000, birthYear: 1982, nationality: '马来西亚', wikipedia: 'https://zh.wikipedia.org/wiki/李宗伟' }),
  person('per-sea-85', '阮氏玲', '越南裔时尚人物', '文化', ['southeast_asia'], HANOI[0], HANOI[1], '国际时尚领域越南裔代表。', { nationality: '越南' }),
  person('per-sea-86', 'Joji（乔治·米勒）', '日裔歌手（在东南亚活跃）', '文化', ['southeast_asia'], MANILA[0], MANILA[1], 'Pink Guy 转型 R&B 歌手，亚太影响力。', { since: 2017, birthYear: 1992, nationality: '日本/澳大利亚' }),
  person('per-sea-87', '沙尼·林', '东南亚时装设计师', '文化', ['southeast_asia'], KUALA[0], KUALA[1], '马来西亚裔时装设计师，国际秀场。', { since: 2010, nationality: '马来西亚' }),

  // ── 东南亚宗教与社会 ──
  person('per-sea-88', '阿里·宾·阿卜杜勒·拉赫曼', '印尼穆罕默迪雅主席', '社会', ['southeast_asia'], JAKARTA[0], JAKARTA[1], '印尼第二大穆斯林组织领袖。', { since: 2022, nationality: '印度尼西亚' }),
  person('per-sea-89', '达赖喇嘛（东南亚影响）', '藏传佛教精神领袖（跨区）', '文化', ['southeast_asia'], BANGKOK[0], BANGKOK[1], '藏传佛教在东南亚佛教圈有影响。（合并条目）', { since: 1950, birthYear: 1935, nationality: '中国西藏' }),
];
