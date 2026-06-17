import { person } from './helpers';

const BRASILIA = [-47.88, -15.79] as const;
const BUENOS_AIRES = [-58.38, -34.60] as const;
const MEXICO_CITY = [-99.13, 19.43] as const;
const BOGOTA = [-74.07, 4.71] as const;
const SANTIAGO = [-70.67, -33.45] as const;
const LIMA = [-77.04, -12.05] as const;

/** 拉美区域人物 */
export const LATIN_AMERICA_PERSONS = [
  person('per-la-1', '路易斯·伊纳西奥·卢拉', '巴西总统', '政治', ['latin_america'], BRASILIA[0], BRASILIA[1], '巴西劳工党领袖，推动亚马逊保护与金砖合作。', { since: 2023 }),
  person('per-la-2', '哈维尔·米莱', '阿根廷总统', '政治', ['latin_america'], BUENOS_AIRES[0], BUENOS_AIRES[1], '自由意志主义经济学家，推行休克疗法与美元化讨论。', { since: 2023 }),
  person('per-la-3', '克劳迪娅·辛鲍姆', '墨西哥总统', '政治', ['latin_america'], MEXICO_CITY[0], MEXICO_CITY[1], '墨西哥首位女总统，延续「墨西哥制造」与近岸外包。', { since: 2024 }),
  person('per-la-4', '古斯塔沃·佩特罗', '哥伦比亚总统', '政治', ['latin_america'], BOGOTA[0], BOGOTA[1], '左翼领导人，推动和平进程与能源转型。', { since: 2022 }),
  person('per-la-5', '加布里埃尔·博里奇', '智利总统', '政治', ['latin_america'], SANTIAGO[0], SANTIAGO[1], '智利最年轻总统，关注锂矿国有化与社会改革。', { since: 2022 }),
  person('per-la-6', '迪娜·博鲁阿尔特', '秘鲁总统', '政治', ['latin_america'], LIMA[0], LIMA[1], '秘鲁领导人，面临政治动荡与采矿冲突。', { since: 2022 }),
  person('per-la-7', '尼古拉斯·马杜罗', '委内瑞拉总统', '政治', ['latin_america'], -66.90, 10.49, '委内瑞拉领导人，面临美国制裁与石油出口困境。', { since: 2013 }),
  person('per-la-8', '保罗·盖梅尔', '巴西央行行长', '经济', ['latin_america'], BRASILIA[0], BRASILIA[1], '巴西货币政策制定者，管理通胀与汇率。', { since: 2019 }),
  person('per-la-9', '豪尔赫·保罗·莱曼', '3G 资本联合创始人', '经济', ['latin_america'], -43.17, -22.91, '巴西投资大亨，控股百威英博等跨国企业。'),
  person('per-la-10', '加夫列尔·加西亚·马尔克斯', '诺贝尔文学奖得主', '文化', ['latin_america'], BOGOTA[0], BOGOTA[1], '魔幻现实主义文学巨匠，《百年孤独》作者。', { status: 'deceased' }),
  person('per-la-11', '夏奇拉', '歌手', '文化', ['latin_america'], BOGOTA[0], BOGOTA[1], '哥伦比亚流行歌手，拉美文化全球传播代表。'),
  person('per-la-12', '亚历杭德罗·戈伊', '拉美工会领袖', '社会', ['latin_america'], BUENOS_AIRES[0], BUENOS_AIRES[1], '阿根廷劳工运动代表，关注通胀与就业权益。'),
];
