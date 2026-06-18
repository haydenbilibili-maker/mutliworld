import { person } from './helpers';

const BRUSSELS = [4.35, 50.85] as const;
const PARIS = [2.35, 48.86] as const;
const BERLIN = [13.40, 52.52] as const;
const LONDON = [-0.13, 51.51] as const;
const ROME = [12.50, 41.90] as const;
const MADRID = [-3.70, 40.42] as const;
const FRANKFURT = [8.68, 50.11] as const;

/** 西欧区域人物 */
export const WESTERN_EUROPE_PERSONS = [
  person('per-we-1', '乌尔苏拉·冯德莱恩', '欧盟委员会主席', '政治', ['western_europe'], BRUSSELS[0], BRUSSELS[1], '欧盟行政首脑，推动绿色协议与防务一体化。', { since: 2019, wikipedia: 'https://zh.wikipedia.org/wiki/乌尔苏拉·冯德莱恩' }),
  person('per-we-2', '克里斯蒂娜·拉加德', '欧洲央行行长', '经济', ['western_europe'], FRANKFURT[0], FRANKFURT[1], '欧元区货币政策制定者，应对通胀与银行业稳定。', { since: 2019, wikipedia: 'https://zh.wikipedia.org/wiki/克里斯蒂娜·拉加德' }),
  person('per-we-3', '埃马纽埃尔·马克龙', '法国总统', '政治', ['western_europe'], PARIS[0], PARIS[1], '法国领导人，倡导欧洲战略自主与核威慑。', { since: 2017, wikipedia: 'https://zh.wikipedia.org/wiki/埃马纽埃尔·马克龙' }),
  person('per-we-4', '奥拉夫·朔尔茨', '德国总理', '政治', ['western_europe'], BERLIN[0], BERLIN[1], '德国联邦政府首脑，主导对乌援助与能源转型。', { since: 2021, wikipedia: 'https://zh.wikipedia.org/wiki/奥拉夫·朔尔茨' }),
  person('per-we-5', '基尔·斯塔默', '英国首相', '政治', ['western_europe'], LONDON[0], LONDON[1], '工党领袖，重塑脱欧后英国外交与安全政策。', { since: 2024, wikipedia: 'https://zh.wikipedia.org/wiki/基尔·斯塔默' }),
  person('per-we-6', '焦尔吉娅·梅洛尼', '意大利总理', '政治', ['western_europe'], ROME[0], ROME[1], '意大利右翼联盟领导人，关注移民与地中海安全。', { since: 2022, wikipedia: 'https://zh.wikipedia.org/wiki/焦尔吉娅·梅洛尼' }),
  person('per-we-7', '佩德罗·桑切斯', '西班牙首相', '政治', ['western_europe'], MADRID[0], MADRID[1], '西班牙社会党领袖，推动可再生能源与欧盟团结。', { since: 2018, wikipedia: 'https://zh.wikipedia.org/wiki/佩德罗·桑切斯' }),
  person('per-we-8', '延斯·斯托尔滕贝格', '北约秘书长', '军事', ['western_europe'], BRUSSELS[0], BRUSSELS[1], '协调北约东翼防务与乌克兰军事援助。', { since: 2014, wikipedia: 'https://zh.wikipedia.org/wiki/延斯·斯托尔滕贝格' }),
  person('per-we-9', '鲍里斯·皮斯托里乌斯', '德国国防部长', '军事', ['western_europe'], BERLIN[0], BERLIN[1], '推动德军现代化与北约 2% GDP 防务目标。', { since: 2023, wikipedia: 'https://en.wikipedia.org/wiki/Boris_Pistorius' }),
  person('per-we-10', '塞巴斯蒂安·勒科尔努', '法国国防部长', '军事', ['western_europe'], PARIS[0], PARIS[1], '法国军力建设负责人，强调欧洲防务工业。', { since: 2024 }),
  person('per-we-11', '菲利普·莱恩', '欧洲央行首席经济学家', '经济', ['western_europe'], FRANKFURT[0], FRANKFURT[1], '参与欧元区利率决策与通胀展望。'),
  person('per-we-12', '贝尔纳·阿尔诺', 'LVMH 董事长', '经济', ['western_europe'], PARIS[0], PARIS[1], '奢侈品巨头，象征法国高端消费与全球品牌。', { since: 1989, wikipedia: 'https://zh.wikipedia.org/wiki/贝尔纳·阿尔诺' }),
  person('per-we-13', '克里斯蒂安·林德纳', '德国财政部长', '经济', ['western_europe'], BERLIN[0], BERLIN[1], '自由民主党领袖，主张财政纪律与减税。', { since: 2021 }),
  person('per-we-14', '格蕾塔·通贝里', '气候活动家', '社会', ['western_europe'], 18.07, 59.33, '瑞典青年气候运动象征，推动欧洲绿色议程。', { since: 2018, wikipedia: 'https://zh.wikipedia.org/wiki/格蕾塔·通贝里' }),
  person('per-we-15', '阿涅斯·卡拉马尔', '国际特赦组织秘书长', '社会', ['western_europe'], LONDON[0], LONDON[1], '关注难民权利与欧洲边境政策。'),
  person('per-we-16', '丹尼尔·巴伦博伊姆', '指挥家', '文化', ['western_europe'], BERLIN[0], BERLIN[1], '柏林国家歌剧院音乐总监，中东和平音乐项目发起人。'),
  person('per-we-17', '马克·吕特', '北约秘书长', '政治', ['western_europe'], 4.90, 52.37, '2024 年接任北约秘书长，此前长期任荷兰首相。', { since: 2010, wikipedia: 'https://zh.wikipedia.org/wiki/马克·吕特' }),
  person('per-we-18', '亚历山大·德克罗', '比利时首相', '政治', ['western_europe'], BRUSSELS[0], BRUSSELS[1], '欧盟总部所在国领导人，协调欧洲机构运作。', { since: 2020 }),
  person('per-we-19', '何塞普·博雷利', '欧盟外交与安全政策高级代表', '政治', ['western_europe'], BRUSSELS[0], BRUSSELS[1], '协调欧盟对外行动与对俄制裁工具。', { since: 2019, wikipedia: 'https://zh.wikipedia.org/wiki/何塞普·博雷利' }),
  person('per-we-20', '伯纳德·亨利-莱维', '哲学家、作家', '文化', ['western_europe'], PARIS[0], PARIS[1], '法国公共知识分子，关注中东与乌克兰议题。'),
  person('per-we-21', '米歇尔·巴尼耶', '欧盟前脱欧谈判代表', '政治', ['western_europe'], BRUSSELS[0], BRUSSELS[1], '资深欧洲政治家，2024 年短暂出任法国总理。'),
  person('per-we-22', '汉斯·季默', '电影配乐家', '文化', ['western_europe'], LONDON[0], LONDON[1], '德裔作曲家，好莱坞与欧洲电影配乐巨匠。', { wikipedia: 'https://zh.wikipedia.org/wiki/汉斯·季默' }),

  person('per-we-23', '米歇尔·奥巴马', '美国前第一夫人', '文化', ['western_europe', 'north_america'], -87.62, 41.88, '畅销书《成为》作者，女性教育与健康倡导者。', { since: 2009, wikipedia: 'https://zh.wikipedia.org/wiki/米歇尔·奥巴马' }),
  person('per-we-24', '凯瑟琳·德纳芙', '演员', '文化', ['western_europe'], PARIS[0], PARIS[1], '法国电影标志性女演员，《瑟堡的雨伞》等作品。', { since: 1957, wikipedia: 'https://zh.wikipedia.org/wiki/凯瑟琳·德纳芙' }),
  person('per-we-25', '安东尼奥·科斯塔', '欧洲理事会主席', '政治', ['western_europe'], BRUSSELS[0], BRUSSELS[1], '前葡萄牙总理，2024 年起主导欧盟战略议程。', { since: 2024, wikipedia: 'https://zh.wikipedia.org/wiki/安东尼奥·科斯塔' }),
  person('per-we-26', '罗伯特·哈贝克', '德国副总理兼经济部长', '经济', ['western_europe'], BERLIN[0], BERLIN[1], '绿党领袖，推动德国能源转型与产业政策。', { since: 2021, wikipedia: 'https://zh.wikipedia.org/wiki/罗伯特·哈贝克' }),
  person('per-we-27', '安娜·克劳德·维耶纳', '无国界医生组织主席', '社会', ['western_europe'], PARIS[0], PARIS[1], '人道医疗组织领袖，活跃于冲突地区医疗响应。', { since: 2022 }),
  person('per-we-28', '帕特里克·莫迪亚诺', '诺贝尔文学奖得主', '文化', ['western_europe'], PARIS[0], PARIS[1], '法国作家，2014 年诺奖得主，关注记忆与身份。', { since: 2014, wikipedia: 'https://zh.wikipedia.org/wiki/帕特里克·莫迪亚诺' }),
];
