import { person } from './helpers';

const BRASILIA = [-47.88, -15.79] as const;
const BUENOS_AIRES = [-58.38, -34.60] as const;
const MEXICO_CITY = [-99.13, 19.43] as const;
const BOGOTA = [-74.07, 4.71] as const;
const SANTIAGO = [-70.67, -33.45] as const;
const LIMA = [-77.04, -12.05] as const;

/** 拉美区域人物 */
export const LATIN_AMERICA_PERSONS = [
  person('per-la-1', '路易斯·伊纳西奥·卢拉', '巴西总统', '政治', ['latin_america'], BRASILIA[0], BRASILIA[1], '巴西劳工党领袖，推动亚马逊保护与金砖合作。', { since: 2023, wikipedia: 'https://zh.wikipedia.org/wiki/路易斯·伊纳西奥·卢拉·达席尔瓦' }),
  person('per-la-2', '哈维尔·米莱', '阿根廷总统', '政治', ['latin_america'], BUENOS_AIRES[0], BUENOS_AIRES[1], '自由意志主义经济学家，推行休克疗法与美元化讨论。', { since: 2023, wikipedia: 'https://zh.wikipedia.org/wiki/哈维尔·米莱' }),
  person('per-la-3', '克劳迪娅·辛鲍姆', '墨西哥总统', '政治', ['latin_america'], MEXICO_CITY[0], MEXICO_CITY[1], '墨西哥首位女总统，延续「墨西哥制造」与近岸外包。', { since: 2024, wikipedia: 'https://zh.wikipedia.org/wiki/克劳迪娅·辛鲍姆' }),
  person('per-la-4', '古斯塔沃·佩特罗', '哥伦比亚总统', '政治', ['latin_america'], BOGOTA[0], BOGOTA[1], '左翼领导人，推动和平进程与能源转型。', { since: 2022, wikipedia: 'https://zh.wikipedia.org/wiki/古斯塔沃·佩特罗' }),
  person('per-la-5', '加布里埃尔·博里奇', '智利总统', '政治', ['latin_america'], SANTIAGO[0], SANTIAGO[1], '智利最年轻总统，关注锂矿国有化与社会改革。', { since: 2022, wikipedia: 'https://zh.wikipedia.org/wiki/加夫列尔·博里奇' }),
  person('per-la-6', '迪娜·博鲁阿尔特', '秘鲁总统', '政治', ['latin_america'], LIMA[0], LIMA[1], '秘鲁领导人，面临政治动荡与采矿冲突。', { since: 2022, wikipedia: 'https://zh.wikipedia.org/wiki/迪娜·博鲁阿尔特' }),
  person('per-la-7', '尼古拉斯·马杜罗', '委内瑞拉总统', '政治', ['latin_america'], -66.90, 10.49, '委内瑞拉领导人，面临美国制裁与石油出口困境。', { since: 2013, wikipedia: 'https://zh.wikipedia.org/wiki/尼古拉斯·马杜罗' }),
  person('per-la-8', '保罗·盖梅尔', '巴西央行行长', '经济', ['latin_america'], BRASILIA[0], BRASILIA[1], '巴西货币政策制定者，管理通胀与汇率。', { since: 2019 }),
  person('per-la-9', '豪尔赫·保罗·莱曼', '3G 资本联合创始人', '经济', ['latin_america'], -43.17, -22.91, '巴西投资大亨，控股百威英博等跨国企业。', { wikipedia: 'https://en.wikipedia.org/wiki/Jorge_Paulo_Lemann' }),
  person('per-la-10', '加夫列尔·加西亚·马尔克斯', '诺贝尔文学奖得主', '文化', ['latin_america'], BOGOTA[0], BOGOTA[1], '魔幻现实主义文学巨匠，《百年孤独》作者。', { status: 'deceased', wikipedia: 'https://zh.wikipedia.org/wiki/加夫列尔·加西亚·马尔克斯' }),
  person('per-la-11', '夏奇拉', '歌手', '文化', ['latin_america'], BOGOTA[0], BOGOTA[1], '哥伦比亚流行歌手，拉美文化全球传播代表。', { wikipedia: 'https://zh.wikipedia.org/wiki/夏奇拉' }),
  person('per-la-12', '亚历杭德罗·戈伊', '拉美工会领袖', '社会', ['latin_america'], BUENOS_AIRES[0], BUENOS_AIRES[1], '阿根廷劳工运动代表，关注通胀与就业权益。'),
  person('per-la-13', '雅伊尔·博索纳罗', '巴西前总统', '政治', ['latin_america'], BRASILIA[0], BRASILIA[1], '巴西右翼前领导人，2023 年卸任后面临多项司法调查。', { status: 'restricted', wikipedia: 'https://zh.wikipedia.org/wiki/雅伊尔·博索纳罗' }),
  person('per-la-14', '安德烈斯·曼努埃尔·洛佩斯·奥夫拉多尔', '墨西哥前总统', '政治', ['latin_america'], MEXICO_CITY[0], MEXICO_CITY[1], '左翼政治家 AMLO，任内推动社会福利与能源国有化。', { status: 'restricted', wikipedia: 'https://zh.wikipedia.org/wiki/洛佩斯·奥夫拉多尔' }),
  person('per-la-15', '卡洛斯·斯利姆', '墨西哥电信大亨', '经济', ['latin_america'], MEXICO_CITY[0], MEXICO_CITY[1], '美洲电信集团掌门，长期位列全球与拉美首富。', { since: 1990, wikipedia: 'https://zh.wikipedia.org/wiki/卡洛斯·斯利姆' }),
  person('per-la-16', '丹尼尔·诺沃亚', '厄瓜多尔总统', '政治', ['latin_america'], -78.52, -0.18, '青年企业家出身，主政打击有组织犯罪与安全危机。', { since: 2023 }),
  person('per-la-17', '纳伊布·布克尔', '萨尔瓦多总统', '政治', ['latin_america'], -89.22, 13.69, '以铁腕治安与比特币法币化引发全球关注。', { since: 2019, wikipedia: 'https://zh.wikipedia.org/wiki/纳伊布·布克尔' }),
  person('per-la-18', '莱昂内尔·梅西', '阿根廷足球运动员', '文化', ['latin_america'], -60.64, -32.95, '率阿根廷夺 2022 世界杯，拉美体育文化标志人物。', { wikipedia: 'https://zh.wikipedia.org/wiki/利昂内尔·梅西' }),
  person('per-la-19', '古斯塔沃·杜达梅尔', '指挥家', '文化', ['latin_america'], -66.90, 10.49, '委内瑞拉「音乐救助体系」代表，执棒世界顶级乐团。'),
  person('per-la-20', '贝尔纳多·阿雷瓦洛', '危地马拉总统', '政治', ['latin_america'], -90.51, 14.64, '社会学者出身，以反腐改革纲领上台。', { since: 2024 }),
  person('per-la-21', '路易斯·阿尔塞', '玻利维亚总统', '政治', ['latin_america'], -68.15, -16.50, '经济学家背景，主导锂矿工业化与天然气出口。', { since: 2020 }),
  person('per-la-22', '内马尔', '巴西足球运动员', '文化', ['latin_america'], -46.63, -23.55, '巴西国家队核心球星，拉美体育全球影响力代表。', { wikipedia: 'https://zh.wikipedia.org/wiki/内马尔' }),

  person('per-la-23', '费尔南多·恩里克·卡多佐', '巴西前总统', '政治', ['latin_america'], BRASILIA[0], BRASILIA[1], '1995–2002 年执政，奠定巴西经济稳定基础的社会学家。', { status: 'restricted', wikipedia: 'https://zh.wikipedia.org/wiki/费尔南多·恩里克·卡多佐' }),
  person('per-la-24', '埃沃·莫拉莱斯', '玻利维亚前总统', '政治', ['latin_america'], -68.15, -16.50, '2006–2019 年执政，推动古柯合法化与锂矿国有化。', { status: 'restricted', wikipedia: 'https://zh.wikipedia.org/wiki/埃沃·莫拉莱斯' }),
  person('per-la-25', '拉斐尔·科雷亚', '厄瓜多尔前总统', '政治', ['latin_america'], -78.52, -0.18, '2007–2017 年执政的左翼经济学家。', { status: 'restricted', wikipedia: 'https://zh.wikipedia.org/wiki/拉斐尔·科雷亚' }),
  person('per-la-26', '帕特里夏·埃斯皮诺萨', '墨西哥外长', '政治', ['latin_america'], MEXICO_CITY[0], MEXICO_CITY[1], '墨西哥首位女外长，协调美墨边境与贸易。', { since: 2024 }),
  person('per-la-27', '弗朗西亚·马尔克斯', '哥伦比亚副总统', '政治', ['latin_america'], BOGOTA[0], BOGOTA[1], '哥首位非裔副总统，关注社会正义与和平进程。', { since: 2022 }),
  person('per-la-28', '维尼修斯·儒尼奥尔', '巴西足球运动员', '文化', ['latin_america'], -43.23, -22.91, '皇马前锋，巴西新生代球星代表，反种族主义活动者。', { since: 2018, wikipedia: 'https://zh.wikipedia.org/wiki/维尼修斯·儒尼奥尔' }),
];
