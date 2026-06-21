import { person } from './helpers';

const BRASILIA = [-47.88, -15.79] as const;
const BUENOS_AIRES = [-58.38, -34.60] as const;
const MEXICO_CITY = [-99.13, 19.43] as const;
const BOGOTA = [-74.07, 4.71] as const;
const SANTIAGO = [-70.67, -33.45] as const;
const LIMA = [-77.04, -12.05] as const;
const CARACAS = [-66.90, 10.49] as const;
const LA_PAZ = [-68.15, -16.50] as const;
const QUITO = [-78.52, -0.18] as const;
const HAVANA = [-82.38, 23.11] as const;
const SAO_PAULO = [-46.63, -23.55] as const;

/** 拉美区域人物 */
export const LATIN_AMERICA_PERSONS = [
  // ── 巴西 ──
  person('per-la-1', '路易斯·伊纳西奥·卢拉·达席尔瓦', '巴西总统', '政治', ['latin_america'], BRASILIA[0], BRASILIA[1], '巴西劳工党领袖，推动亚马逊保护与金砖合作。', { since: 2023, birthYear: 1945, nationality: '巴西', wikipedia: 'https://zh.wikipedia.org/wiki/路易斯·伊纳西奥·卢拉·达席尔瓦' }),
  person('per-la-13', '雅伊尔·博索纳罗', '巴西前总统', '政治', ['latin_america'], BRASILIA[0], BRASILIA[1], '巴西右翼前领导人，2023 年卸任。', { status: 'restricted', birthYear: 1955, nationality: '巴西', wikipedia: 'https://zh.wikipedia.org/wiki/雅伊尔·博索纳罗' }),
  person('per-la-8', '罗伯托·坎波斯·内托', '巴西央行行长', '经济', ['latin_america'], BRASILIA[0], BRASILIA[1], '巴西货币政策制定者。', { since: 2019, nationality: '巴西' }),
  person('per-la-9', '豪尔赫·保罗·莱曼', '3G 资本联合创始人', '经济', ['latin_america'], -43.17, -22.91, '巴西投资大亨，控股百威英博。', { nationality: '巴西', wikipedia: 'https://en.wikipedia.org/wiki/Jorge_Paulo_Lemann' }),
  person('per-la-29', '埃隆·马斯克', '巴西卫星互联网提供商', '经济', ['latin_america'], BRASILIA[0], BRASILIA[1], 'Starlink 在巴西运营。（跨区条目）', { since: 2022, nationality: '美国/南非' }),
  person('per-la-30', '内马尔', '巴西足球运动员', '文化', ['latin_america'], SAO_PAULO[0], SAO_PAULO[1], '巴西国家队核心球星。', { birthYear: 1992, nationality: '巴西', wikipedia: 'https://zh.wikipedia.org/wiki/内马尔' }),
  person('per-la-31', '维尼修斯·儒尼奥尔', '巴西足球运动员', '文化', ['latin_america'], -43.23, -22.91, '皇马前锋，反种族主义活动者。', { since: 2018, nationality: '巴西', wikipedia: 'https://zh.wikipedia.org/wiki/维尼修斯·儒尼奥尔' }),

  // ── 阿根廷 ──
  person('per-la-2', '哈维尔·米莱', '阿根廷总统', '政治', ['latin_america'], BUENOS_AIRES[0], BUENOS_AIRES[1], '自由意志主义经济学家，推行休克疗法。', { since: 2023, birthYear: 1970, nationality: '阿根廷', wikipedia: 'https://zh.wikipedia.org/wiki/哈维尔·米莱' }),
  person('per-la-32', '维多利亚·维拉鲁埃尔', '阿根廷副总统', '政治', ['latin_america'], BUENOS_AIRES[0], BUENOS_AIRES[1], '阿根廷副总统。', { since: 2023, nationality: '阿根廷' }),
  person('per-la-33', '圣地亚哥·卡菲耶罗', '阿根廷外长', '政治', ['latin_america'], BUENOS_AIRES[0], BUENOS_AIRES[1], '阿根廷外长。', { since: 2024, nationality: '阿根廷' }),
  person('per-la-34', '莱昂内尔·梅西', '阿根廷足球运动员', '文化', ['latin_america'], BUENOS_AIRES[0], BUENOS_AIRES[1], '率阿根廷夺 2022 世界杯，拉美体育标志人物。', { birthYear: 1987, nationality: '阿根廷', wikipedia: 'https://zh.wikipedia.org/wiki/利昂内尔·梅西' }),

  // ── 墨西哥 ──
  person('per-la-3', '克劳迪娅·辛鲍姆', '墨西哥总统', '政治', ['latin_america'], MEXICO_CITY[0], MEXICO_CITY[1], '墨西哥首位女总统，科学家出身。', { since: 2024, birthYear: 1962, nationality: '墨西哥', wikipedia: 'https://zh.wikipedia.org/wiki/克劳迪娅·辛鲍姆' }),
  person('per-la-14', '安德烈斯·曼努埃尔·洛佩斯·奥夫拉多尔', '墨西哥前总统', '政治', ['latin_america'], MEXICO_CITY[0], MEXICO_CITY[1], '左翼政治家 AMLO。', { status: 'restricted', birthYear: 1953, nationality: '墨西哥', wikipedia: 'https://zh.wikipedia.org/wiki/洛佩斯·奥夫拉多尔' }),
  person('per-la-15', '卡洛斯·斯利姆', '墨西哥电信大亨', '经济', ['latin_america'], MEXICO_CITY[0], MEXICO_CITY[1], '美洲电信集团掌门，长期位列拉美首富。', { since: 1990, birthYear: 1940, nationality: '墨西哥', netWorthUsd: 90_000_000_000, wikipedia: 'https://zh.wikipedia.org/wiki/卡洛斯·斯利姆' }),
  person('per-la-35', '亚历杭德罗·费尔南德斯', '墨西哥央行行长', '经济', ['latin_america'], MEXICO_CITY[0], MEXICO_CITY[1], '墨西哥央行行长。', { since: 2021, nationality: '墨西哥' }),

  // ── 哥伦比亚 ──
  person('per-la-4', '古斯塔沃·佩特罗', '哥伦比亚总统', '政治', ['latin_america'], BOGOTA[0], BOGOTA[1], '左翼领导人，推动和平进程与能源转型。', { since: 2022, birthYear: 1960, nationality: '哥伦比亚', wikipedia: 'https://zh.wikipedia.org/wiki/古斯塔沃·佩特罗' }),
  person('per-la-27', '弗朗西亚·马尔克斯', '哥伦比亚副总统', '政治', ['latin_america'], BOGOTA[0], BOGOTA[1], '哥首位非裔副总统。', { since: 2022, nationality: '哥伦比亚' }),
  person('per-la-10', '加夫列尔·加西亚·马尔克斯', '诺贝尔文学奖得主', '文化', ['latin_america'], BOGOTA[0], BOGOTA[1], '魔幻现实主义文学巨匠，《百年孤独》作者。', { birthYear: 1927, deathYear: 2014, status: 'deceased', nationality: '哥伦比亚', wikipedia: 'https://zh.wikipedia.org/wiki/加夫列尔·加西亚·马尔克斯' }),
  person('per-la-11', '夏奇拉', '歌手', '文化', ['latin_america'], BOGOTA[0], BOGOTA[1], '哥伦比亚流行歌手，拉美文化全球传播代表。', { birthYear: 1977, nationality: '哥伦比亚', wikipedia: 'https://zh.wikipedia.org/wiki/夏奇拉' }),

  // ── 智利 ──
  person('per-la-5', '加布里埃尔·博里奇', '智利总统', '政治', ['latin_america'], SANTIAGO[0], SANTIAGO[1], '智利最年轻总统，关注锂矿国有化与社会改革。', { since: 2022, birthYear: 1986, nationality: '智利', wikipedia: 'https://zh.wikipedia.org/wiki/加夫列尔·博里奇' }),
  person('per-la-36', '米歇尔·巴切莱特', '智利前总统', '政治', ['latin_america'], SANTIAGO[0], SANTIAGO[1], '前总统与联合国人权高专。', { since: 2014, nationality: '智利' }),

  // ── 秘鲁 ──
  person('per-la-6', '迪娜·博鲁阿尔特', '秘鲁总统', '政治', ['latin_america'], LIMA[0], LIMA[1], '秘鲁领导人。', { since: 2022, nationality: '秘鲁', wikipedia: 'https://zh.wikipedia.org/wiki/迪娜·博鲁阿尔特' }),

  // ── 委内瑞拉 ──
  person('per-la-7', '尼古拉斯·马杜罗', '委内瑞拉总统', '政治', ['latin_america'], CARACAS[0], CARACAS[1], '委内瑞拉领导人，面临美国制裁。', { since: 2013, birthYear: 1962, nationality: '委内瑞拉', wikipedia: 'https://zh.wikipedia.org/wiki/尼古拉斯·马杜罗' }),

  // ── 厄瓜多尔 ──
  person('per-la-16', '丹尼尔·诺沃亚', '厄瓜多尔总统', '政治', ['latin_america'], QUITO[0], QUITO[1], '青年企业家出身，主政打击有组织犯罪。', { since: 2023, nationality: '厄瓜多尔' }),

  // ── 玻利维亚 ──
  person('per-la-21', '路易斯·阿尔塞', '玻利维亚总统', '政治', ['latin_america'], LA_PAZ[0], LA_PAZ[1], '经济学家背景，主导锂矿工业化。', { since: 2020, nationality: '玻利维亚' }),
  person('per-la-24', '埃沃·莫拉莱斯', '玻利维亚前总统', '政治', ['latin_america'], LA_PAZ[0], LA_PAZ[1], '2006–2019 年执政。', { status: 'restricted', nationality: '玻利维亚', wikipedia: 'https://zh.wikipedia.org/wiki/埃沃·莫拉莱斯' }),

  // ── 萨尔瓦多 ──
  person('per-la-17', '纳伊布·布克尔', '萨尔瓦多总统', '政治', ['latin_america'], -89.22, 13.69, '以铁腕治安与比特币法币化引发全球关注。', { since: 2019, nationality: '萨尔瓦多', wikipedia: 'https://zh.wikipedia.org/wiki/纳伊布·布克尔' }),

  // ── 危地马拉 ──
  person('per-la-20', '贝尔纳多·阿雷瓦洛', '危地马拉总统', '政治', ['latin_america'], -90.51, 14.64, '反腐改革纲领上台。', { since: 2024, nationality: '危地马拉' }),

  // ── 古巴 ──
  person('per-la-37', '米格尔·迪亚斯-卡内尔', '古巴国家主席', '政治', ['latin_america'], HAVANA[0], HAVANA[1], '古巴共产党第一书记。', { since: 2021, nationality: '古巴' }),

  // ── 其他中美洲 ──
  person('per-la-38', '希奥马拉·卡斯特罗', '洪都拉斯总统', '政治', ['latin_america'], -87.19, 14.10, '洪都拉斯首位女总统。', { since: 2022, nationality: '洪都拉斯' }),
  person('per-la-39', '罗德里戈·查韦斯', '哥斯达黎加总统', '政治', ['latin_america'], -84.08, 9.93, '哥斯达黎加总统。', { since: 2022, nationality: '哥斯达黎加' }),
  person('per-la-40', '劳伦特诺·科尔蒂索', '巴拿马前总统', '政治', ['latin_america'], -79.52, 8.98, '巴拿马前总统。', { since: 2019, nationality: '巴拿马' }),
  person('per-la-41', '卢塞洛·阿多亚', '巴拿马总统', '政治', ['latin_america'], -79.52, 8.98, '巴拿马现任总统。', { since: 2024, nationality: '巴拿马' }),
  person('per-la-42', '路易斯·阿比纳德', '多米尼加总统', '政治', ['latin_america'], -69.94, 18.49, '多米尼加总统。', { since: 2020, nationality: '多米尼加' }),

  // ── 加勒比 ──
  person('per-la-43', '菲利普·戴维斯', '巴哈马总理', '政治', ['latin_america'], -77.35, 25.07, '巴哈马总理。', { since: 2021, nationality: '巴哈马' }),
  person('per-la-44', '米亚·莫特利', '巴巴多斯总理', '政治', ['latin_america'], -59.56, 13.10, '巴巴多斯总理，推动共和国体制过渡。', { since: 2018, nationality: '巴巴多斯' }),

  // ── 拉美文化 ──
  person('per-la-45', '巴勃罗·毕加索', '画家（西班牙-拉美关联）', '文化', ['latin_america'], -3.70, 40.42, '现代艺术大师，与拉美艺术运动深度关联。', { status: 'deceased', nationality: '西班牙' }),
  person('per-la-46', '迭戈·里维拉', '壁画家', '文化', ['latin_america'], MEXICO_CITY[0], MEXICO_CITY[1], '墨西哥壁画运动核心人物。', { since: 1930, status: 'deceased', nationality: '墨西哥' }),
  person('per-la-47', '弗里达·卡罗', '画家', '文化', ['latin_america'], MEXICO_CITY[0], MEXICO_CITY[1], '墨西哥传奇女画家。', { since: 1920, status: 'deceased', nationality: '墨西哥' }),
  person('per-la-48', '豪尔赫·路易斯·博尔赫斯', '作家', '文化', ['latin_america'], -58.38, -34.60, '阿根廷文学大师，「迷宫」与「图书馆」意象创造者。', { birthYear: 1899, deathYear: 1986, status: 'deceased', nationality: '阿根廷', wikipedia: 'https://zh.wikipedia.org/wiki/豪尔赫·路易斯·博尔赫斯' }),
  person('per-la-49', '巴勃罗·聂鲁达', '诗人', '文化', ['latin_america'], -70.67, -33.45, '智利诺贝尔文学奖得主诗人。', { birthYear: 1904, deathYear: 1973, status: 'deceased', nationality: '智利' }),
  person('per-la-50', '马里奥·巴尔加斯·略萨', '作家', '文化', ['latin_america'], -77.04, -12.05, '秘鲁诺贝尔文学奖得主，拉美文学爆炸代表。', { since: 1963, birthYear: 1936, nationality: '秘鲁', wikipedia: 'https://zh.wikipedia.org/wiki/马里奥·巴尔加斯·略萨' }),
  person('per-la-51', '保罗·科埃略', '作家', '文化', ['latin_america'], -46.63, -23.55, '巴西作家，《牧羊少年奇幻之旅》作者。', { since: 1982, birthYear: 1947, nationality: '巴西' }),
  person('per-la-52', '伊莎贝尔·阿连德', '作家', '文化', ['latin_america'], -70.67, -33.45, '智利裔作家，《幽灵之家》作者。', { since: 1982, birthYear: 1942, nationality: '智利/美国' }),
  person('per-la-53', '罗贝托·波拉尼奥', '作家', '文化', ['latin_america'], -70.67, -33.45, '智利作家，《2666》作者。', { birthYear: 1953, deathYear: 2003, status: 'deceased', nationality: '智利' }),
  person('per-la-54', '盖尔·加西亚·贝纳尔', '演员', '文化', ['latin_america'], MEXICO_CITY[0], MEXICO_CITY[1], '墨西哥著名演员，推动拉美电影走向世界。', { since: 2000, birthYear: 1978, nationality: '墨西哥' }),
  person('per-la-55', '萨尔玛·海耶克', '演员', '文化', ['latin_america'], MEXICO_CITY[0], MEXICO_CITY[1], '墨西哥裔好莱坞女星。', { since: 1995, birthYear: 1966, nationality: '墨西哥/美国' }),
  person('per-la-56', '维森特·费尔南德斯', '歌手', '文化', ['latin_america'], -103.35, 20.68, '墨西哥牧场音乐之王，2021 年逝世。', { birthYear: 1940, deathYear: 2021, status: 'deceased', nationality: '墨西哥' }),
  person('per-la-57', '贝利', '前足球运动员', '文化', ['latin_america'], -43.17, -22.91, '巴西球王，三夺世界杯。', { birthYear: 1940, deathYear: 2022, status: 'deceased', nationality: '巴西', wikipedia: 'https://zh.wikipedia.org/wiki/贝利' }),
  person('per-la-58', '迭戈·马拉多纳', '前足球运动员', '文化', ['latin_america'], -58.38, -34.60, '阿根廷足球传奇，1986 年世界杯英雄。', { birthYear: 1960, deathYear: 2020, status: 'deceased', nationality: '阿根廷', wikipedia: 'https://zh.wikipedia.org/wiki/迭戈·马拉多纳' }),
  person('per-la-59', '罗纳尔迪尼奥', '前足球运动员', '文化', ['latin_america'], -43.17, -22.91, '巴西足球魔术师，金球奖得主。', { since: 1998, birthYear: 1980, nationality: '巴西' }),
  person('per-la-60', '基利安·姆巴佩（拉美影响）', '足球运动员（跨区）', '文化', ['latin_america'], -58.38, -34.60, '法国球星与拉美足球圈密切。（跨区）', { since: 2015, birthYear: 1998, nationality: '法国' }),

  // ── 拉美商界与金融 ──
  person('per-la-61', '伊里斯·丰本', '巴西石油公司 CEO', '经济', ['latin_america'], -43.17, -22.91, 'Petrobras CEO，巴西国家石油公司。', { since: 2023, nationality: '巴西' }),
  person('per-la-62', '马里奥·塞伊萨', '巴西淡水河谷前 CEO', '经济', ['latin_america'], -43.17, -22.91, '全球最大铁矿石生产商。', { nationality: '巴西' }),
  person('per-la-63', '何塞·罗伯托·马林', '伊塔乌联合银行 CEO', '经济', ['latin_america'], -46.63, -23.55, '拉美最大私营银行之一 CEO。', { since: 2009, nationality: '巴西' }),
  person('per-la-64', '阿尔贝托·巴博萨', '美洲开发银行行长', '经济', ['latin_america'], -77.04, -12.05, 'IDB 行长，推动拉美发展融资。', { since: 2020, nationality: '巴西' }),
  person('per-la-65', '马丁·贝纳多·西富恩特斯', '阿根廷 YPF CEO', '经济', ['latin_america'], -58.38, -34.60, '阿根廷国家石油公司 YPF CEO。', { since: 2023, nationality: '阿根廷' }),
  person('per-la-66', '维克多·保罗·科斯塔', '巴西航空工业公司 CEO', '经济', ['latin_america'], -46.63, -23.55, '巴西航空工业（Embraer）CEO。', { since: 2022, nationality: '巴西' }),
  person('per-la-67', '丹尼尔·埃克', '流媒体 Spotify 创始人（拉美市场）', '经济', ['latin_america'], -58.38, -34.60, 'Spotify 在拉美有重要业务。（跨区）', { since: 2006, birthYear: 1983, nationality: '瑞典' }),

  // ── 拉美缺失国家领导人 ──
  person('per-la-68', '路易斯·拉卡列·波乌', '乌拉圭总统', '政治', ['latin_america'], -56.17, -34.87, '乌拉圭总统，保守派。', { since: 2020, birthYear: 1973, nationality: '乌拉圭', wikipedia: 'https://zh.wikipedia.org/wiki/路易斯·拉卡列·波乌' }),
  person('per-la-69', '圣地亚哥·培尼亚', '巴拉圭总统', '政治', ['latin_america'], -57.63, -25.30, '巴拉圭总统，经济学家出身。', { since: 2023, birthYear: 1978, nationality: '巴拉圭' }),
  person('per-la-70', '丹尼尔·奥尔特加', '尼加拉瓜总统', '政治', ['latin_america'], -86.25, 12.13, '尼加拉瓜长期执政的左翼领导人。', { since: 2007, birthYear: 1945, nationality: '尼加拉瓜', wikipedia: 'https://zh.wikipedia.org/wiki/丹尼尔·奥尔特加' }),
  person('per-la-71', '丹尼尔·诺博亚', '厄瓜多尔总统（备注）', '政治', ['latin_america'], QUITO[0], QUITO[1], '厄瓜多尔总统。（合并条目）', { since: 2023, nationality: '厄瓜多尔' }),
  person('per-la-72', '哈维尔·伊万·杜兰', '玻利维亚前总统（备注）', '政治', ['latin_america'], LA_PAZ[0], LA_PAZ[1], '玻利维亚政治人物。（备注）', { nationality: '玻利维亚' }),
  person('per-la-73', '拉斐尔·科雷亚', '厄瓜多尔前总统', '政治', ['latin_america'], QUITO[0], QUITO[1], '左翼前总统，现流亡比利时。', { status: 'restricted', birthYear: 1963, nationality: '厄瓜多尔' }),
  person('per-la-74', '埃沃·阿伊莫', '阿根廷前总统候选人', '政治', ['latin_america'], BUENOS_AIRES[0], BUENOS_AIRES[1], '阿根廷左翼民粹主义代表。', { nationality: '阿根廷' }),
  person('per-la-75', '马里奥·阿夫东·贝尼特斯', '巴拉圭前总统', '政治', ['latin_america'], -57.63, -25.30, '巴拉圭前总统，保守派。', { status: 'restricted', nationality: '巴拉圭' }),

  // ── 拉美左翼与社会运动 ──
  person('per-la-76', '埃沃·科雷亚（备注）', '玻利维亚前总统（备注2）', '政治', ['latin_america'], LA_PAZ[0], LA_PAZ[1], '玻利维亚首位原住民总统。（合并条目）', { status: 'restricted', nationality: '玻利维亚' }),
  person('per-la-77', '胡安·瓜伊多', '委内瑞拉前临时总统', '政治', ['latin_america'], CARACAS[0], CARACAS[1], '马杜罗的主要挑战者，西方曾承认其为临时总统。', { status: 'restricted', birthYear: 1983, nationality: '委内瑞拉', wikipedia: 'https://zh.wikipedia.org/wiki/胡安·瓜伊多' }),
  person('per-la-78', '莱奥波尔多·洛佩斯', '委内瑞拉反对派领袖', '政治', ['latin_america'], CARACAS[0], CARACAS[1], '委反对派核心，现流亡西班牙。', { status: 'restricted', nationality: '委内瑞拉' }),
  person('per-la-79', '玛丽亚·科里纳·马查多', '委内瑞拉反对派领袖', '政治', ['latin_america'], CARACAS[0], CARACAS[1], '2024 委大选反对派联合候选人支持者核心。', { birthYear: 1967, nationality: '委内瑞拉' }),
];
