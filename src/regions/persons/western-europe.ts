import { person } from './helpers';

const BRUSSELS = [4.35, 50.85] as const;
const PARIS = [2.35, 48.86] as const;
const BERLIN = [13.40, 52.52] as const;
const LONDON = [-0.13, 51.51] as const;
const ROME = [12.50, 41.90] as const;
const MADRID = [-3.70, 40.42] as const;
const FRANKFURT = [8.68, 50.11] as const;
const AMSTERDAM = [4.90, 52.37] as const;
const STOCKHOLM = [18.07, 59.33] as const;
const OSLO = [10.75, 59.91] as const;
const COPENHAGEN = [12.57, 55.68] as const;
const VIENNA = [16.37, 48.21] as const;
const BERN = [7.45, 46.95] as const;
const DUBLIN = [-6.26, 53.35] as const;

/** 西欧区域人物 */
export const WESTERN_EUROPE_PERSONS = [
  // ── 欧盟机构 ──
  person('per-we-1', '乌尔苏拉·冯德莱恩', '欧盟委员会主席', '政治', ['western_europe'], BRUSSELS[0], BRUSSELS[1], '欧盟行政首脑，推动绿色协议与防务一体化。', { since: 2019, birthYear: 1958, nationality: '德国', wikipedia: 'https://zh.wikipedia.org/wiki/乌尔苏拉·冯德莱恩' }),
  person('per-we-25', '安东尼奥·科斯塔', '欧洲理事会主席', '政治', ['western_europe'], BRUSSELS[0], BRUSSELS[1], '前葡萄牙总理，2024 年起主导欧盟战略议程。', { since: 2024, birthYear: 1961, nationality: '葡萄牙', wikipedia: 'https://zh.wikipedia.org/wiki/安东尼奥·科斯塔' }),
  person('per-we-19', '何塞普·博雷利', '欧盟外长', '政治', ['western_europe'], BRUSSELS[0], BRUSSELS[1], '协调欧盟对外行动与对俄制裁工具。', { since: 2019, birthYear: 1947, nationality: '西班牙', wikipedia: 'https://zh.wikipedia.org/wiki/何塞普·博雷利' }),
  person('per-we-2', '克里斯蒂娜·拉加德', '欧洲央行行长', '经济', ['western_europe'], FRANKFURT[0], FRANKFURT[1], '欧元区货币政策制定者，应对通胀与银行业稳定。', { since: 2019, birthYear: 1956, nationality: '法国', wikipedia: 'https://zh.wikipedia.org/wiki/克里斯蒂娜·拉加德' }),
  person('per-we-29', '海伦·基萨', '欧洲央行监事会主席', '经济', ['western_europe'], FRANKFURT[0], FRANKFURT[1], '银行业监管负责人。', { since: 2024, nationality: '葡萄牙' }),

  // ── 法国 ──
  person('per-we-3', '埃马纽埃尔·马克龙', '法国总统', '政治', ['western_europe'], PARIS[0], PARIS[1], '法国领导人，倡导欧洲战略自主与核威慑。', { since: 2017, birthYear: 1977, nationality: '法国', wikipedia: 'https://zh.wikipedia.org/wiki/埃马纽埃尔·马克龙' }),
  person('per-we-30', '弗朗索瓦·贝鲁', '法国总理', '政治', ['western_europe'], PARIS[0], PARIS[1], '法国总理。', { since: 2024, nationality: '法国' }),
  person('per-we-31', '斯特凡纳·塞茹尔纳', '法国外交部长', '政治', ['western_europe'], PARIS[0], PARIS[1], '法国外长。', { since: 2024, nationality: '法国' }),
  person('per-we-10', '塞巴斯蒂安·勒科尔努', '法国国防部长', '军事', ['western_europe'], PARIS[0], PARIS[1], '法国军力建设负责人，强调欧洲防务工业。', { since: 2024, nationality: '法国' }),
  person('per-we-12', '贝尔纳·阿尔诺', 'LVMH 董事长', '经济', ['western_europe'], PARIS[0], PARIS[1], '奢侈品巨头，多次登顶全球首富。', { since: 1989, birthYear: 1949, nationality: '法国', netWorthUsd: 200_000_000_000, wikipedia: 'https://zh.wikipedia.org/wiki/贝尔纳·阿尔诺' }),
  person('per-we-32', '克里斯塔尔·所罗门', '道达尔能源董事长', '经济', ['western_europe'], PARIS[0], PARIS[1], '法国石油巨头董事长。', { since: 2023, nationality: '法国' }),
  person('per-we-33', '多米尼克·德维尔潘', '前总理', '政治', ['western_europe'], PARIS[0], PARIS[1], '前总理，诗人与外交家。', { since: 2005, nationality: '法国' }),
  person('per-we-34', '斯特凡·班塞尔', 'Moderna CEO', '经济', ['western_europe'], PARIS[0], PARIS[1], 'mRNA 技术商业化先驱。', { since: 2011, nationality: '法国/美国', wikipedia: 'https://zh.wikipedia.org/wiki/斯特凡·班塞尔' }),

  // ── 德国 ──
  person('per-we-4', '奥拉夫·朔尔茨', '德国总理', '政治', ['western_europe'], BERLIN[0], BERLIN[1], '德国联邦政府首脑，主导对乌援助与能源转型。', { since: 2021, birthYear: 1958, nationality: '德国', wikipedia: 'https://zh.wikipedia.org/wiki/奥拉夫·朔尔茨' }),
  person('per-we-26', '罗伯特·哈贝克', '德国副总理兼经济部长', '经济', ['western_europe'], BERLIN[0], BERLIN[1], '绿党领袖，推动德国能源转型与产业政策。', { since: 2021, birthYear: 1969, nationality: '德国', wikipedia: 'https://zh.wikipedia.org/wiki/罗伯特·哈贝克' }),
  person('per-we-9', '鲍里斯·皮斯托里乌斯', '德国国防部长', '军事', ['western_europe'], BERLIN[0], BERLIN[1], '推动德军现代化与北约 2% GDP 防务目标。', { since: 2023, nationality: '德国', wikipedia: 'https://en.wikipedia.org/wiki/Boris_Pistorius' }),
  person('per-we-35', '安娜·贝尔伯克', '德国外长', '政治', ['western_europe'], BERLIN[0], BERLIN[1], '绿党政治家，德国外长。', { since: 2021, birthYear: 1980, nationality: '德国', wikipedia: 'https://zh.wikipedia.org/wiki/安娜·贝尔伯克' }),
  person('per-we-36', '约阿希姆·纳格尔', '德国央行行长', '经济', ['western_europe'], FRANKFURT[0], FRANKFURT[1], '德国央行行长。', { since: 2022, nationality: '德国' }),
  person('per-we-37', '奥利弗·布鲁姆', '大众/保时捷 CEO', '经济', ['western_europe'], 16.37, 48.21, '大众集团与保时捷双料 CEO。', { since: 2022, nationality: '德国' }),
  person('per-we-38', '康林松', '梅赛德斯-奔驰 CEO', '经济', ['western_europe'], 9.18, 48.78, '奔驰 CEO。', { since: 2019, nationality: '瑞典/德国' }),
  person('per-we-39', '安吉拉·默克尔', '德国前总理', '政治', ['western_europe'], BERLIN[0], BERLIN[1], '德国史上首位女总理（2005-2021），欧洲危机管理者。', { status: 'restricted', birthYear: 1954, nationality: '德国', wikipedia: 'https://zh.wikipedia.org/wiki/安吉拉·默克尔' }),

  // ── 英国 ──
  person('per-we-5', '基尔·斯塔默', '英国首相', '政治', ['western_europe'], LONDON[0], LONDON[1], '工党领袖，重塑脱欧后英国外交与安全政策。', { since: 2024, birthYear: 1962, nationality: '英国', wikipedia: 'https://zh.wikipedia.org/wiki/基尔·斯塔默' }),
  person('per-we-40', '戴维·拉米', '英国外交大臣', '政治', ['western_europe'], LONDON[0], LONDON[1], '英国外长。', { since: 2024, nationality: '英国' }),
  person('per-we-41', '约翰·希利', '英国国防大臣', '军事', ['western_europe'], LONDON[0], LONDON[1], '英国防长。', { since: 2024, nationality: '英国' }),
  person('per-we-42', '雷切尔·里夫斯', '英国财政大臣', '经济', ['western_europe'], LONDON[0], LONDON[1], '英国首位女性财政大臣。', { since: 2024, nationality: '英国' }),
  person('per-we-43', '安德鲁·贝利', '英格兰银行行长', '经济', ['western_europe'], LONDON[0], LONDON[1], '英国央行行长。', { since: 2020, birthYear: 1959, nationality: '英国', wikipedia: 'https://zh.wikipedia.org/wiki/安德鲁·贝利' }),
  person('per-we-44', '里希·苏纳克', '英国前首相', '政治', ['western_europe'], LONDON[0], LONDON[1], '前首相。', { since: 2022, birthYear: 1980, nationality: '英国', wikipedia: 'https://zh.wikipedia.org/wiki/里希·苏纳克' }),
  person('per-we-45', '鲍里斯·约翰逊', '英国前首相', '政治', ['western_europe'], LONDON[0], LONDON[1], '前首相，脱欧核心人物。', { since: 2019, birthYear: 1964, nationality: '英国', wikipedia: 'https://zh.wikipedia.org/wiki/鲍里斯·约翰逊' }),
  person('per-we-46', '戴维·卡梅伦', '英国前首相', '政治', ['western_europe'], LONDON[0], LONDON[1], '前首相，推动中英黄金时代。', { since: 2010, birthYear: 1966, nationality: '英国' }),
  person('per-we-47', '杰米·戴蒙', '摩根大通 CEO', '经济', ['western_europe'], LONDON[0], LONDON[1], '美国银行家，在英运营全球最大投行。', { since: 2005, nationality: '美国' }),

  // ── 意大利 ──
  person('per-we-6', '焦尔吉娅·梅洛尼', '意大利总理', '政治', ['western_europe'], ROME[0], ROME[1], '意大利右翼联盟领导人，关注移民与地中海安全。', { since: 2022, birthYear: 1977, nationality: '意大利', wikipedia: 'https://zh.wikipedia.org/wiki/焦尔吉娅·梅洛尼' }),
  person('per-we-48', '安东尼奥·塔亚尼', '意大利外长', '政治', ['western_europe'], ROME[0], ROME[1], '意大利副总理兼外长。', { since: 2022, nationality: '意大利' }),
  person('per-we-49', '圭多·克罗塞托', '意大利国防部长', '军事', ['western_europe'], ROME[0], ROME[1], '意大利防长。', { since: 2022, nationality: '意大利' }),
  person('per-we-50', '法比奥·帕内塔', '意大利央行行长', '经济', ['western_europe'], ROME[0], ROME[1], '意大利央行行长。', { since: 2023, nationality: '意大利' }),

  // ── 西班牙 ──
  person('per-we-7', '佩德罗·桑切斯', '西班牙首相', '政治', ['western_europe'], MADRID[0], MADRID[1], '西班牙社会党领袖，推动可再生能源与欧盟团结。', { since: 2018, birthYear: 1972, nationality: '西班牙', wikipedia: 'https://zh.wikipedia.org/wiki/佩德罗·桑切斯' }),
  person('per-we-51', '纳迪娅·卡尔维尼奥', '西班牙第一副首相', '经济', ['western_europe'], MADRID[0], MADRID[1], '经济事务负责人。', { since: 2021, nationality: '西班牙' }),
  person('per-we-52', '费利佩六世', '西班牙国王', '文化', ['western_europe'], MADRID[0], MADRID[1], '西班牙国家元首。', { since: 2014, birthYear: 1968, nationality: '西班牙' }),

  // ── 荷兰 ──
  person('per-we-17', '马克·吕特', '北约秘书长', '政治', ['western_europe'], BRUSSELS[0], BRUSSELS[1], '2024 年接任北约秘书长，此前长期任荷兰首相。', { since: 2024, birthYear: 1967, nationality: '荷兰', wikipedia: 'https://zh.wikipedia.org/wiki/马克·吕特' }),
  person('per-we-53', '迪克·肖夫', '荷兰首相', '政治', ['western_europe'], AMSTERDAM[0], AMSTERDAM[1], '荷兰首相。', { since: 2024, nationality: '荷兰' }),
  person('per-we-54', '克拉斯·诺特', '荷兰外长', '政治', ['western_europe'], AMSTERDAM[0], AMSTERDAM[1], '荷兰外长。', { since: 2024, nationality: '荷兰' }),

  // ── 比利时 ──
  person('per-we-18', '亚历山大·德克罗', '比利时首相', '政治', ['western_europe'], BRUSSELS[0], BRUSSELS[1], '欧盟总部所在国领导人。', { since: 2020, nationality: '比利时' }),

  // ── 瑞士 ──
  person('per-we-55', '阿兰·贝尔塞', '瑞士联邦主席', '政治', ['western_europe'], BERN[0], BERN[1], '瑞士联邦主席。', { since: 2024, nationality: '瑞士' }),
  person('per-we-56', '托马斯·乔丹', '瑞士央行行长', '经济', ['western_europe'], BERN[0], BERN[1], '瑞士央行行长。', { since: 2012, nationality: '瑞士' }),

  // ── 北欧 ──
  person('per-we-57', '乌尔夫·克里斯特松', '瑞典首相', '政治', ['western_europe'], STOCKHOLM[0], STOCKHOLM[1], '瑞典首相，推动瑞典加入北约。', { since: 2022, nationality: '瑞典' }),
  person('per-we-58', '约纳斯·加尔·斯特勒', '挪威首相', '政治', ['western_europe'], OSLO[0], OSLO[1], '挪威首相。', { since: 2021, nationality: '挪威' }),
  person('per-we-59', '梅特·弗雷德里克森', '丹麦首相', '政治', ['western_europe'], COPENHAGEN[0], COPENHAGEN[1], '丹麦首相。', { since: 2019, nationality: '丹麦' }),
  person('per-we-60', '佩特里·奥波', '芬兰总统', '政治', ['western_europe'], 24.94, 60.17, '芬兰总统。', { since: 2024, nationality: '芬兰' }),
  person('per-we-61', '卡特琳·雅各布斯多蒂尔', '冰岛总理', '政治', ['western_europe'], -21.94, 64.15, '冰岛总理。', { since: 2024, nationality: '冰岛' }),

  // ── 爱尔兰 ──
  person('per-we-62', '西蒙·哈里斯', '爱尔兰总理', '政治', ['western_europe'], DUBLIN[0], DUBLIN[1], '爱尔兰总理。', { since: 2024, nationality: '爱尔兰' }),
  person('per-we-63', '帕特里克·科里森', 'Stripe CEO', '经济', ['western_europe'], DUBLIN[0], DUBLIN[1], '全球在线支付巨头联合创始人。', { since: 2010, birthYear: 1988, nationality: '爱尔兰' }),

  // ── 奥地利 ──
  person('per-we-64', '卡尔·内哈默', '奥地利总理', '政治', ['western_europe'], VIENNA[0], VIENNA[1], '奥地利总理。', { since: 2021, nationality: '奥地利' }),
];
