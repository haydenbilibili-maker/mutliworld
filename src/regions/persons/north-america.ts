import { person } from './helpers';

const DC = [-77.04, 38.90] as const;
const NYC = [-74.01, 40.71] as const;
const NORFOLK = [-76.29, 36.85] as const;
const LA = [-118.24, 34.05] as const;
const OTTAWA = [-75.70, 45.42] as const;

/** 北美区域人物 */
export const NORTH_AMERICA_PERSONS = [
  person('per-na-1', '唐纳德·特朗普', '美国总统', '政治', ['north_america'], DC[0], DC[1], '美国最高行政长官，主导贸易、移民与外交政策。', { since: 2025, wikipedia: 'https://zh.wikipedia.org/wiki/唐納·川普' }),
  person('per-na-2', 'JD·万斯', '美国副总统', '政治', ['north_america'], DC[0], DC[1], '副总统兼参议院议长，参与经济民粹主义议程。', { since: 2025, wikipedia: 'https://zh.wikipedia.org/wiki/J·D·范斯' }),
  person('per-na-3', '安东尼·布林肯', '国务卿', '政治', ['north_america'], DC[0], DC[1], '美国首席外交官，协调盟友体系与对华竞争。', { since: 2021, wikipedia: 'https://zh.wikipedia.org/wiki/安東尼·布林肯' }),
  person('per-na-4', '劳埃德·奥斯汀', '国防部长', '军事', ['north_america'], DC[0], DC[1], '五角大楼首脑，管理全球军事部署与国防预算。', { since: 2021, wikipedia: 'https://zh.wikipedia.org/wiki/勞埃德·奧斯丁' }),
  person('per-na-5', '迈克尔·库里拉', '中央司令部司令', '军事', ['north_america'], NORFOLK[0], NORFOLK[1], '负责中东、中亚战区作战指挥。', { since: 2022 }),
  person('per-na-6', '查尔斯·布朗', '参联会主席', '军事', ['north_america'], DC[0], DC[1], '美军最高军职，向总统提供军事建议。', { since: 2023, wikipedia: 'https://en.wikipedia.org/wiki/Charles_Q._Brown_Jr.' }),
  person('per-na-7', '杰罗姆·鲍威尔', '美联储主席', '经济', ['north_america'], DC[0], DC[1], '货币政策制定者，影响全球利率与资产价格。', { since: 2018, wikipedia: 'https://zh.wikipedia.org/wiki/杰罗姆·鲍威尔' }),
  person('per-na-8', '珍妮特·耶伦', '财政部长', '经济', ['north_america'], DC[0], DC[1], '负责财政政策、国债与对华经贸谈判。', { since: 2021, wikipedia: 'https://zh.wikipedia.org/wiki/珍妮特·耶伦' }),
  person('per-na-9', '吉娜·雷蒙多', '商务部长', '经济', ['north_america'], DC[0], DC[1], '主导芯片出口管制与产业补贴（CHIPS 法案）。', { since: 2021, wikipedia: 'https://zh.wikipedia.org/wiki/吉娜·雷蒙多' }),
  person('per-na-10', '埃隆·马斯克', '特斯拉/SpaceX CEO', '经济', ['north_america'], LA[0], LA[1], '科技巨头，影响电动车、航天与 X 平台舆论。', { since: 2008, wikipedia: 'https://zh.wikipedia.org/wiki/埃隆·马斯克' }),
  person('per-na-11', '蒂姆·库克', '苹果公司 CEO', '经济', ['north_america'], -122.03, 37.33, '全球市值最高公司掌门人，供应链布局影响中美贸易。', { since: 2011, wikipedia: 'https://zh.wikipedia.org/wiki/蒂姆·库克' }),
  person('per-na-12', '萨蒂亚·纳德拉', '微软 CEO', '经济', ['north_america'], -122.12, 47.64, 'AI 与云计算领军企业领袖，主导 OpenAI 合作。', { since: 2014, wikipedia: 'https://zh.wikipedia.org/wiki/萨蒂亚·纳德拉' }),
  person('per-na-13', '泰勒·斯威夫特', '歌手', '文化', ['north_america'], -86.78, 36.16, '全球流行文化偶像，「时代之旅」巡演创纪录。', { since: 2006, wikipedia: 'https://zh.wikipedia.org/wiki/泰勒·斯威夫特' }),
  person('per-na-14', '史蒂文·斯皮尔伯格', '电影导演', '文化', ['north_america'], LA[0], LA[1], '好莱坞标志性导演，作品跨越数十年。', { since: 1970, wikipedia: 'https://zh.wikipedia.org/wiki/史蒂文·斯皮尔伯格' }),
  person('per-na-15', '马尔科姆·格拉德威尔', '作家、播客主', '文化', ['north_america'], NYC[0], NYC[1], '公共知识分子，探讨社会科学与流行文化。', { wikipedia: 'https://zh.wikipedia.org/wiki/马尔科姆·格拉德威尔' }),
  person('per-na-16', '伯尼·桑德斯', '参议员', '社会', ['north_america'], -72.58, 44.26, '进步派政治人物，倡导全民医保与财富再分配。', { since: 2007, wikipedia: 'https://zh.wikipedia.org/wiki/伯尼·桑德斯' }),
  person('per-na-17', '亚历山德里娅·奥卡西奥-科尔特斯', '众议员', '社会', ['north_america'], NYC[0], NYC[1], '年轻进步派代表，关注气候正义与移民权利。', { since: 2019, wikipedia: 'https://zh.wikipedia.org/wiki/亚历山德里娅·奥卡西奥-科尔特斯' }),
  person('per-na-18', '贾斯汀·特鲁多', '加拿大总理', '政治', ['north_america'], OTTAWA[0], OTTAWA[1], '加拿大领导人，参与北约与对华经贸关系。', { since: 2015, wikipedia: 'https://zh.wikipedia.org/wiki/贾斯汀·特鲁多' }),
  person('per-na-19', '塔尼亚·胡斯', '美国劳工领袖', '社会', ['north_america'], DC[0], DC[1], '工会运动代表，关注工人权益与最低工资。'),
  person('per-na-20', '马克·米利', '前参联会主席', '军事', ['north_america'], DC[0], DC[1], '退役上将，曾主导美军全球战略调整。', { status: 'restricted', wikipedia: 'https://zh.wikipedia.org/wiki/马克·米利' }),
  person('per-na-21', '凯瑟琳·伍德', 'ARK Invest 创始人', '经济', ['north_america'], NYC[0], NYC[1], '知名科技基金经理，押注颠覆性创新。', { since: 2014, wikipedia: 'https://en.wikipedia.org/wiki/Cathie_Wood' }),
  person('per-na-22', '沃伦·巴菲特', '伯克希尔 CEO', '经济', ['north_america'], -96.10, 41.26, '价值投资教父，持仓影响市场风向。', { since: 1970, wikipedia: 'https://zh.wikipedia.org/wiki/沃伦·巴菲特' }),

  // 新增（2026 年活跃人物 · 密度提升）
  person('per-na-23', '山姆·奥特曼', 'OpenAI CEO', '经济', ['north_america'], -122.4, 37.76, 'AI 浪潮核心人物，推动 GPT 系列与通用人工智能路线。', { since: 2015, wikipedia: 'https://zh.wikipedia.org/wiki/山姆·奥特曼' }),
  person('per-na-24', '马克·扎克伯格', 'Meta 创始人兼 CEO', '经济', ['north_america'], -122.08, 37.48, '掌管社交帝国与元宇宙转型，开源大模型 Llama 系列。', { since: 2004, wikipedia: 'https://zh.wikipedia.org/wiki/马克·扎克伯格' }),
  person('per-na-25', '苏珊·沃西基', 'YouTube 前 CEO', '经济', ['north_america'], -122.08, 37.42, '视频平台史上任期最长的掌门人，推动创作者经济生态。', { since: 2014, status: 'deceased', wikipedia: 'https://zh.wikipedia.org/wiki/苏珊·沃西基' }),
  person('per-na-26', '莱克斯·弗里德曼', 'AI 研究员、播客主持人', '文化', ['north_america'], -71.06, 42.36, 'MIT 研究员，长格式深度对话播客影响力覆盖科技界与公众。', { since: 2018, wikipedia: 'https://en.wikipedia.org/wiki/Lex_Fridman' }),
  person('per-na-27', '小罗伯特·F·肯尼迪', '独立政治活动家', '政治', ['north_america'], -74.01, 40.71, '2024 年美国总统独立候选人，反建制与公共卫生议题活跃。', { since: 2023, wikipedia: 'https://zh.wikipedia.org/wiki/小罗伯特·肯尼迪' }),
  person('per-na-28', '科比·布赖恩特', '前 NBA 球星·社会活动家', '文化', ['north_america'], -118.26, 34.04, '已故传奇球星，退役后致力于体育教育与青少年发展。', { since: 1996, status: 'deceased', wikipedia: 'https://zh.wikipedia.org/wiki/科比·布莱恩特' }),
  person('per-na-29', '约翰·罗伯茨', '美国首席大法官', '政治', ['north_america'], DC[0], DC[1], '最高法院保守派枢纽，裁决堕胎、平权与总统豁免权等里程碑案件。', { since: 2005, wikipedia: 'https://zh.wikipedia.org/wiki/约翰·罗伯茨' }),
  person('per-na-30', '比尔·盖茨', '微软联合创始人、慈善家', '经济', ['north_america'], -122.14, 47.64, '全球公共卫生与气候创新领域主要慈善力量，盖茨基金会联席主席。', { since: 1975, wikipedia: 'https://zh.wikipedia.org/wiki/比尔·盖茨' }),
];
