import { person } from './helpers';

const DC = [-77.04, 38.90] as const;
const NYC = [-74.01, 40.71] as const;
const NORFOLK = [-76.29, 36.85] as const;
const LA = [-118.24, 34.05] as const;
const OTTAWA = [-75.70, 45.42] as const;

/** 北美区域人物 */
export const NORTH_AMERICA_PERSONS = [
  person('per-na-1', '唐纳德·特朗普', '美国总统', '政治', ['north_america'], DC[0], DC[1], '美国最高行政长官，主导贸易、移民与外交政策。', { since: 2025 }),
  person('per-na-2', 'JD·万斯', '美国副总统', '政治', ['north_america'], DC[0], DC[1], '副总统兼参议院议长，参与经济民粹主义议程。', { since: 2025 }),
  person('per-na-3', '安东尼·布林肯', '国务卿', '政治', ['north_america'], DC[0], DC[1], '美国首席外交官，协调盟友体系与对华竞争。', { since: 2021 }),
  person('per-na-4', '劳埃德·奥斯汀', '国防部长', '军事', ['north_america'], DC[0], DC[1], '五角大楼首脑，管理全球军事部署与国防预算。', { since: 2021 }),
  person('per-na-5', '迈克尔·库里拉', '中央司令部司令', '军事', ['north_america'], NORFOLK[0], NORFOLK[1], '负责中东、中亚战区作战指挥。', { since: 2022 }),
  person('per-na-6', '查尔斯·布朗', '参联会主席', '军事', ['north_america'], DC[0], DC[1], '美军最高军职，向总统提供军事建议。', { since: 2023 }),
  person('per-na-7', '杰罗姆·鲍威尔', '美联储主席', '经济', ['north_america'], DC[0], DC[1], '货币政策制定者，影响全球利率与资产价格。', { since: 2018 }),
  person('per-na-8', '珍妮特·耶伦', '财政部长', '经济', ['north_america'], DC[0], DC[1], '负责财政政策、国债与对华经贸谈判。', { since: 2021 }),
  person('per-na-9', '吉娜·雷蒙多', '商务部长', '经济', ['north_america'], DC[0], DC[1], '主导芯片出口管制与产业补贴（CHIPS 法案）。', { since: 2021 }),
  person('per-na-10', '埃隆·马斯克', '特斯拉/SpaceX CEO', '经济', ['north_america'], LA[0], LA[1], '科技巨头，影响电动车、航天与 X 平台舆论。', { since: 2008 }),
  person('per-na-11', '蒂姆·库克', '苹果公司 CEO', '经济', ['north_america'], -122.03, 37.33, '全球市值最高公司掌门人，供应链布局影响中美贸易。', { since: 2011 }),
  person('per-na-12', '萨蒂亚·纳德拉', '微软 CEO', '经济', ['north_america'], -122.12, 47.64, 'AI 与云计算领军企业领袖，主导 OpenAI 合作。', { since: 2014 }),
  person('per-na-13', '泰勒·斯威夫特', '歌手', '文化', ['north_america'], -86.78, 36.16, '全球流行文化偶像，「时代之旅」巡演创纪录。', { since: 2006 }),
  person('per-na-14', '史蒂文·斯皮尔伯格', '电影导演', '文化', ['north_america'], LA[0], LA[1], '好莱坞标志性导演，作品跨越数十年。', { since: 1970 }),
  person('per-na-15', '马尔科姆·格拉德威尔', '作家、播客主', '文化', ['north_america'], NYC[0], NYC[1], '公共知识分子，探讨社会科学与流行文化。'),
  person('per-na-16', '伯尼·桑德斯', '参议员', '社会', ['north_america'], -72.58, 44.26, '进步派政治人物，倡导全民医保与财富再分配。', { since: 2007 }),
  person('per-na-17', '亚历山德里娅·奥卡西奥-科尔特斯', '众议员', '社会', ['north_america'], NYC[0], NYC[1], '年轻进步派代表，关注气候正义与移民权利。', { since: 2019 }),
  person('per-na-18', '贾斯汀·特鲁多', '加拿大总理', '政治', ['north_america'], OTTAWA[0], OTTAWA[1], '加拿大领导人，参与北约与对华经贸关系。', { since: 2015 }),
  person('per-na-19', '塔尼亚·胡斯', '美国劳工领袖', '社会', ['north_america'], DC[0], DC[1], '工会运动代表，关注工人权益与最低工资。'),
  person('per-na-20', '马克·米利', '前参联会主席', '军事', ['north_america'], DC[0], DC[1], '退役上将，曾主导美军全球战略调整。', { status: 'restricted' }),
  person('per-na-21', '凯瑟琳·伍德', 'ARK Invest 创始人', '经济', ['north_america'], NYC[0], NYC[1], '知名科技基金经理，押注颠覆性创新。', { since: 2014 }),
  person('per-na-22', '沃伦·巴菲特', '伯克希尔 CEO', '经济', ['north_america'], -96.10, 41.26, '价值投资教父，持仓影响市场风向。', { since: 1970 }),
];
