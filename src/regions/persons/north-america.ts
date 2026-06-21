import { person } from './helpers';

const DC = [-77.04, 38.90] as const;
const NYC = [-74.01, 40.71] as const;
const NORFOLK = [-76.29, 36.85] as const;
const LA = [-118.24, 34.05] as const;
const OTTAWA = [-75.70, 45.42] as const;
const SF = [-122.42, 37.78] as const;
const SEA = [-122.33, 47.61] as const;
const BOS = [-71.06, 42.36] as const;
const CHI = [-87.65, 41.88] as const;
const HOU = [-95.37, 29.76] as const;
const MEX = [-99.13, 19.43] as const;

/** 北美区域人物 */
export const NORTH_AMERICA_PERSONS = [
  // ── 美国行政与外交 ──
  person('per-na-1', '唐纳德·特朗普', '美国总统', '政治', ['north_america'], DC[0], DC[1], '美国最高行政长官，主导贸易、移民与外交政策。', { since: 2025, birthYear: 1946, nationality: '美国', wikipedia: 'https://zh.wikipedia.org/wiki/唐納·川普' }),
  person('per-na-2', 'JD·万斯', '美国副总统', '政治', ['north_america'], DC[0], DC[1], '副总统兼参议院议长，参与经济民粹主义议程。', { since: 2025, birthYear: 1984, nationality: '美国', wikipedia: 'https://zh.wikipedia.org/wiki/J·D·范斯' }),
  person('per-na-3', '安东尼·布林肯', '前国务卿', '政治', ['north_america'], DC[0], DC[1], '前美国首席外交官，协调盟友体系与对华竞争。', { since: 2021, birthYear: 1962, nationality: '美国', wikipedia: 'https://zh.wikipedia.org/wiki/安東尼·布林肯' }),
  person('per-na-31', '马尔科·卢比奥', '国务卿', '政治', ['north_america'], DC[0], DC[1], '古巴裔参议员转任国务卿，对华对伊强硬派。', { since: 2025, birthYear: 1971, nationality: '美国', wikipedia: 'https://zh.wikipedia.org/wiki/马可·鲁比奥' }),
  person('per-na-32', '皮特·赫格塞斯', '国防部长', '政治', ['north_america'], DC[0], DC[1], '前福克斯新闻主持人转任国防部长。', { since: 2025, birthYear: 1980, nationality: '美国' }),
  person('per-na-33', '斯科特·贝森特', '财政部长', '经济', ['north_america'], DC[0], DC[1], '对冲基金经理转任财政部长。', { since: 2025, birthYear: 1962, nationality: '美国' }),
  person('per-na-34', '霍华德·卢特尼克', '商务部长', '经济', ['north_america'], DC[0], DC[1], 'Cantor Fitzgerald CEO 转任商务部长。', { since: 2025, birthYear: 1961, nationality: '美国' }),
  person('per-na-35', '苏西·怀尔斯', '白宫办公厅主任', '政治', ['north_america'], DC[0], DC[1], '美国首位女性白宫幕僚长。', { since: 2025, nationality: '美国' }),
  person('per-na-36', '图尔西·加巴德', '国家情报总监', '政治', ['north_america'], DC[0], DC[1], '前民主党众议员转任国家情报总监。', { since: 2025, birthYear: 1981, nationality: '美国' }),
  person('per-na-37', '罗伯特·F·肯尼迪二世', '卫生与公众服务部长', '政治', ['north_america'], DC[0], DC[1], '疫苗怀疑论者，转任卫生部长。', { since: 2025, birthYear: 1954, nationality: '美国', wikipedia: 'https://zh.wikipedia.org/wiki/小罗伯特·肯尼迪' }),
  person('per-na-38', '皮特·布蒂吉格', '前交通部长', '政治', ['north_america'], DC[0], DC[1], '前南本德市长，首位公开同性恋身份内阁成员。', { since: 2021, birthYear: 1982, nationality: '美国', wikipedia: 'https://zh.wikipedia.org/wiki/皮特·布蒂吉格' }),
  person('per-na-39', '卡玛拉·哈里斯', '前副总统', '政治', ['north_america'], DC[0], DC[1], '美国首位女性/非裔/亚裔副总统。', { since: 2021, birthYear: 1964, nationality: '美国', wikipedia: 'https://zh.wikipedia.org/wiki/卡玛拉·哈里斯' }),
  person('per-na-40', '乔·拜登', '前美国总统', '政治', ['north_america'], DC[0], DC[1], '第46任美国总统，推动基建与芯片法案。', { since: 2021, birthYear: 1942, nationality: '美国', wikipedia: 'https://zh.wikipedia.org/wiki/乔·拜登' }),
  person('per-na-41', '希拉里·克林顿', '前国务卿', '政治', ['north_america'], DC[0], DC[1], '前国务卿与总统候选人。', { since: 2009, birthYear: 1947, nationality: '美国', wikipedia: 'https://zh.wikipedia.org/wiki/希拉里·克林顿' }),
  person('per-na-42', '约翰·克里', '前气候特使', '政治', ['north_america'], DC[0], DC[1], '前国务卿，拜登政府气候特使。', { since: 2021, birthYear: 1943, nationality: '美国', wikipedia: 'https://zh.wikipedia.org/wiki/约翰·克里' }),

  // ── 美国国会 ──
  person('per-na-43', '迈克·约翰逊', '众议院议长', '政治', ['north_america'], DC[0], DC[1], '共和党众议院议长。', { since: 2023, birthYear: 1972, nationality: '美国', wikipedia: 'https://zh.wikipedia.org/wiki/迈克·约翰逊_(路易斯安那州政治人物)' }),
  person('per-na-44', '查克·舒默', '参议院多数党领袖', '政治', ['north_america'], DC[0], DC[1], '民主党参议院领袖。', { since: 2021, birthYear: 1950, nationality: '美国', wikipedia: 'https://zh.wikipedia.org/wiki/查克·舒默' }),
  person('per-na-45', '米奇·麦康奈尔', '参议院前多数党领袖', '政治', ['north_america'], DC[0], DC[1], '共和党参议院前领袖。', { since: 2015, birthYear: 1942, nationality: '美国', wikipedia: 'https://zh.wikipedia.org/wiki/米奇·麦康奈尔' }),
  person('per-na-46', '南希·佩洛西', '前众议院议长', '政治', ['north_america'], DC[0], DC[1], '前众议院议长，民主党重量级人物。', { since: 2007, birthYear: 1940, nationality: '美国', wikipedia: 'https://zh.wikipedia.org/wiki/南希·佩洛西' }),
  person('per-na-16', '伯尼·桑德斯', '参议员', '社会', ['north_america'], -72.58, 44.26, '进步派政治人物，倡导全民医保与财富再分配。', { since: 2007, birthYear: 1941, nationality: '美国', wikipedia: 'https://zh.wikipedia.org/wiki/伯尼·桑德斯' }),
  person('per-na-17', '亚历山德里娅·奥卡西奥-科尔特斯', '众议员', '社会', ['north_america'], NYC[0], NYC[1], '年轻进步派代表，关注气候正义与移民权利。', { since: 2019, birthYear: 1989, nationality: '美国', wikipedia: 'https://zh.wikipedia.org/wiki/亚历山德里娅·奥卡西奥-科尔特斯' }),
  person('per-na-47', '伊丽莎白·沃伦', '参议员', '政治', ['north_america'], -71.06, 42.36, '消费者保护倡导者，进步派领军人物。', { since: 2013, birthYear: 1949, nationality: '美国', wikipedia: 'https://zh.wikipedia.org/wiki/伊丽莎白·沃伦' }),
  person('per-na-48', '林赛·格雷厄姆', '参议员', '政治', ['north_america'], -81.16, 34.00, '南卡共和党参议员，外交军事委员会要员。', { since: 2003, birthYear: 1955, nationality: '美国' }),
  person('per-na-49', '特德·克鲁兹', '参议员', '政治', ['north_america'], -97.74, 30.27, '得州共和党参议员，2016 年总统初选人。', { since: 2013, birthYear: 1970, nationality: '美国', wikipedia: 'https://zh.wikipedia.org/wiki/泰德·克鲁兹' }),
  person('per-na-50', '马可·鲁比奥', '前参议员', '政治', ['north_america'], -80.27, 25.78, '佛州古巴裔参议员，外交委员会要员。', { since: 2011, birthYear: 1971, nationality: '美国' }),
  person('per-na-51', '米特·罗姆尼', '前参议员', '政治', ['north_america'], -111.89, 40.77, '前总统候选人，犹他州参议员。', { since: 2019, birthYear: 1947, nationality: '美国', wikipedia: 'https://zh.wikipedia.org/wiki/米特·罗姆尼' }),
  person('per-na-52', '科里·布克', '参议员', '政治', ['north_america'], -74.35, 40.09, '新泽西民主党参议员。', { since: 2013, birthYear: 1969, nationality: '美国' }),
  person('per-na-53', '兰德·保罗', '参议员', '政治', ['north_america'], -84.51, 38.20, '肯塔基自由意志派共和党参议员。', { since: 2011, birthYear: 1963, nationality: '美国' }),
  person('per-na-54', '乔·曼钦', '前参议员', '政治', ['north_america'], -80.41, 38.35, '西弗吉尼亚温和派民主党人。', { since: 2010, birthYear: 1947, nationality: '美国' }),

  // ── 美国司法 ──
  person('per-na-29', '约翰·罗伯茨', '美国首席大法官', '政治', ['north_america'], DC[0], DC[1], '最高法院保守派枢纽，裁决堕胎、平权与总统豁免权等里程碑案件。', { since: 2005, birthYear: 1955, nationality: '美国', wikipedia: 'https://zh.wikipedia.org/wiki/约翰·罗伯茨' }),
  person('per-na-55', '克拉伦斯·托马斯', '最高法院大法官', '政治', ['north_america'], DC[0], DC[1], '任期最长的非裔大法官。', { since: 1991, birthYear: 1948, nationality: '美国' }),
  person('per-na-56', '埃琳娜·卡根', '最高法院大法官', '政治', ['north_america'], DC[0], DC[1], '自由派大法官。', { since: 2010, birthYear: 1960, nationality: '美国' }),
  person('per-na-57', '索尼娅·索托马约尔', '最高法院大法官', '政治', ['north_america'], DC[0], DC[1], '首位拉美裔大法官。', { since: 2009, birthYear: 1954, nationality: '美国' }),
  person('per-na-58', '布雷特·卡瓦诺', '最高法院大法官', '政治', ['north_america'], DC[0], DC[1], '保守派大法官。', { since: 2018, birthYear: 1965, nationality: '美国' }),
  person('per-na-59', '艾米·康尼·巴雷特', '最高法院大法官', '政治', ['north_america'], DC[0], DC[1], '特朗普任命的保守派大法官。', { since: 2020, birthYear: 1972, nationality: '美国' }),

  // ── 美国军方 ──
  person('per-na-4', '劳埃德·奥斯汀', '前国防部长', '军事', ['north_america'], DC[0], DC[1], '美国首位非裔国防部长，协调乌克兰与印太安全。', { since: 2021, birthYear: 1953, nationality: '美国', wikipedia: 'https://zh.wikipedia.org/wiki/勞埃德·奧斯丁' }),
  person('per-na-5', '迈克尔·库里拉', '中央司令部司令', '军事', ['north_america'], NORFOLK[0], NORFOLK[1], '负责中东、中亚战区作战指挥。', { since: 2022, nationality: '美国' }),
  person('per-na-6', '查尔斯·布朗', '前参联会主席', '军事', ['north_america'], DC[0], DC[1], '美军最高军职，向总统提供军事建议。', { since: 2023, nationality: '美国' }),
  person('per-na-20', '马克·米利', '前参联会主席', '军事', ['north_america'], DC[0], DC[1], '退役上将，曾主导美军全球战略调整。', { status: 'restricted', wikipedia: 'https://zh.wikipedia.org/wiki/马克·米利' }),
  person('per-na-60', '约翰·阿奎利诺', '前印太司令部司令', '军事', ['north_america'], -157.86, 21.33, '前太平洋美军司令，对华威慑核心。', { since: 2021, nationality: '美国' }),
  person('per-na-61', '塞缪尔·帕帕罗', '印太司令部司令', '军事', ['north_america'], -157.86, 21.33, '现任印太司令部司令，海军上将。', { since: 2024, nationality: '美国' }),
  person('per-na-62', '詹姆斯·康威', '海军陆战队前司令', '军事', ['north_america'], DC[0], DC[1], '海军陆战队前司令。', { since: 2020, nationality: '美国' }),
  person('per-na-63', '劳拉·戈德堡', '太空军作战部长', '军事', ['north_america'], DC[0], DC[1], '美国太空军作战部长。', { since: 2023, nationality: '美国' }),
  person('per-na-64', '威廉·伯恩斯', '中情局局长', '军事', ['north_america'], DC[0], DC[1], '前副国务卿，CIA 局长。', { since: 2021, birthYear: 1956, nationality: '美国', wikipedia: 'https://zh.wikipedia.org/wiki/威廉·伯恩斯' }),

  // ── 美国经济/金融 ──
  person('per-na-7', '杰罗姆·鲍威尔', '美联储主席', '经济', ['north_america'], DC[0], DC[1], '货币政策制定者，影响全球利率与资产价格。', { since: 2018, birthYear: 1953, nationality: '美国', wikipedia: 'https://zh.wikipedia.org/wiki/杰罗姆·鲍威尔' }),
  person('per-na-8', '珍妮特·耶伦', '前财政部长', '经济', ['north_america'], DC[0], DC[1], '前美联储主席，美国首位女性财政部长。', { since: 2021, birthYear: 1946, nationality: '美国', wikipedia: 'https://zh.wikipedia.org/wiki/珍妮特·耶伦' }),
  person('per-na-9', '吉娜·雷蒙多', '前商务部长', '经济', ['north_america'], DC[0], DC[1], '主导芯片出口管制与产业补贴（CHIPS 法案）。', { since: 2021, birthYear: 1971, nationality: '美国', wikipedia: 'https://zh.wikipedia.org/wiki/吉娜·雷蒙多' }),
  person('per-na-22', '沃伦·巴菲特', '伯克希尔 CEO', '经济', ['north_america'], -96.10, 41.26, '价值投资教父，持仓影响市场风向。', { since: 1970, birthYear: 1930, nationality: '美国', netWorthUsd: 130_000_000_000, wikipedia: 'https://zh.wikipedia.org/wiki/沃伦·巴菲特' }),
  person('per-na-65', '拉里·芬克', '贝莱德 CEO', '经济', ['north_america'], NYC[0], NYC[1], '全球最大资管公司掌门，ESG 投资。', { since: 1988, birthYear: 1952, nationality: '美国', wikipedia: 'https://zh.wikipedia.org/wiki/拉里·芬克' }),
  person('per-na-66', '杰米·戴蒙', '摩根大通 CEO', '经济', ['north_america'], NYC[0], NYC[1], '美国最大银行 CEO。', { since: 2005, birthYear: 1956, nationality: '美国', wikipedia: 'https://zh.wikipedia.org/wiki/杰米·戴蒙' }),
  person('per-na-67', '雷·达里奥', '桥水基金创始人', '经济', ['north_america'], -73.83, 41.13, '全球宏观投资先驱，《原则》作者。', { since: 1975, birthYear: 1949, nationality: '美国', wikipedia: 'https://zh.wikipedia.org/wiki/雷·达里奥' }),
  person('per-na-68', '卡尔·伊坎', '激进投资者', '经济', ['north_america'], NYC[0], NYC[1], '华尔街激进投资者。', { since: 1968, birthYear: 1936, nationality: '美国' }),
  person('per-na-69', '乔治·索罗斯', '索罗斯基金创始人', '经济', ['north_america'], NYC[0], NYC[1], '量子基金创始人，开放社会基金会。', { since: 1970, birthYear: 1930, nationality: '美国/匈牙利', wikipedia: 'https://zh.wikipedia.org/wiki/乔治·索罗斯' }),
  person('per-na-21', '凯瑟琳·伍德', 'ARK Invest 创始人', '经济', ['north_america'], NYC[0], NYC[1], '知名科技基金经理，押注颠覆性创新。', { since: 2014, birthYear: 1955, nationality: '美国', wikipedia: 'https://en.wikipedia.org/wiki/Cathie_Wood' }),
  person('per-na-70', '加里·根斯勒', 'SEC 主席', '经济', ['north_america'], DC[0], DC[1], '前 MIT 教授，加密货币监管核心。', { since: 2021, birthYear: 1957, nationality: '美国' }),
  person('per-na-71', '迈克尔·巴尔', '美联储副主席', '经济', ['north_america'], DC[0], DC[1], '美联储负责监管的副主席。', { since: 2022, nationality: '美国' }),

  // ── 美国科技领袖 ──
  person('per-na-10', '埃隆·马斯克', '特斯拉/SpaceX CEO', '经济', ['north_america'], LA[0], LA[1], '科技巨头，影响电动车、航天与 X 平台舆论。', { since: 2002, birthYear: 1971, nationality: '美国', netWorthUsd: 350_000_000_000, wikipedia: 'https://zh.wikipedia.org/wiki/埃隆·马斯克' }),
  person('per-na-11', '蒂姆·库克', '苹果公司 CEO', '经济', ['north_america'], -122.03, 37.33, '全球市值最高公司掌门人，供应链布局影响中美贸易。', { since: 2011, birthYear: 1960, nationality: '美国', wikipedia: 'https://zh.wikipedia.org/wiki/蒂姆·库克' }),
  person('per-na-12', '萨蒂亚·纳德拉', '微软 CEO', '经济', ['north_america'], -122.12, 47.64, 'AI 与云计算领军企业领袖，主导 OpenAI 合作。', { since: 2014, birthYear: 1967, nationality: '美国/印度', wikipedia: 'https://zh.wikipedia.org/wiki/萨蒂亚·纳德拉' }),
  person('per-na-23', '山姆·奥特曼', 'OpenAI CEO', '经济', ['north_america'], -122.4, 37.76, 'AI 浪潮核心人物，推动 GPT 系列与通用人工智能路线。', { since: 2015, birthYear: 1985, nationality: '美国', wikipedia: 'https://zh.wikipedia.org/wiki/山姆·奥特曼' }),
  person('per-na-24', '马克·扎克伯格', 'Meta 创始人兼 CEO', '经济', ['north_america'], -122.08, 37.48, '掌管社交帝国与元宇宙转型，开源大模型 Llama 系列。', { since: 2004, birthYear: 1984, nationality: '美国', netWorthUsd: 180_000_000_000, wikipedia: 'https://zh.wikipedia.org/wiki/马克·扎克伯格' }),
  person('per-na-30', '比尔·盖茨', '微软联合创始人、慈善家', '经济', ['north_america'], -122.14, 47.64, '全球公共卫生与气候创新领域主要慈善力量，盖茨基金会联席主席。', { since: 1975, birthYear: 1955, nationality: '美国', netWorthUsd: 130_000_000_000, wikipedia: 'https://zh.wikipedia.org/wiki/比尔·盖茨' }),
  person('per-na-72', '杰夫·贝索斯', '亚马逊创始人', '经济', ['north_america'], -122.33, 47.61, '亚马逊与蓝色起源创始人，《华盛顿邮报》老板。', { since: 1994, birthYear: 1964, nationality: '美国', netWorthUsd: 200_000_000_000, wikipedia: 'https://zh.wikipedia.org/wiki/杰夫·贝索斯' }),
  person('per-na-73', '黄仁勋', '英伟达 CEO', '经济', ['north_america'], -122.10, 37.38, '英伟达创始人，引领全球 GPU 与 AI 算力浪潮。', { since: 1993, birthYear: 1963, nationality: '美国/中国台湾', wikipedia: 'https://zh.wikipedia.org/wiki/黄仁勋' }),
  person('per-na-74', '桑达尔·皮查伊', 'Alphabet/谷歌 CEO', '经济', ['north_america'], -122.08, 37.42, '谷歌搜索、Android 与 AI 战略掌舵人。', { since: 2015, birthYear: 1972, nationality: '美国/印度', wikipedia: 'https://zh.wikipedia.org/wiki/桑达尔·皮查伊' }),
  person('per-na-75', '帕特·格尔辛格', '英特尔 CEO', '经济', ['north_america'], -121.96, 37.38, '推动芯片制造复兴与代工战略。', { since: 2021, birthYear: 1961, nationality: '美国' }),
  person('per-na-76', '布莱恩·阿姆斯特朗', 'Coinbase CEO', '经济', ['north_america'], -122.42, 37.78, '美国最大加密交易所创始人。', { since: 2012, birthYear: 1983, nationality: '美国' }),
  person('per-na-77', '帕特里克·科里森', 'Stripe CEO', '经济', ['north_america'], -122.42, 37.78, 'Stripe 联合创始人，全球在线支付基础设施。', { since: 2010, birthYear: 1988, nationality: '爱尔兰/美国' }),
  person('per-na-78', '里德·哈斯廷斯', 'Netflix 联合创始人', '经济', ['north_america'], -122.42, 37.78, 'Netflix 联合创始人，流媒体革命先驱。', { since: 1997, birthYear: 1960, nationality: '美国' }),
  person('per-na-79', '埃文·斯皮格尔', 'Snap CEO', '经济', ['north_america'], -118.49, 34.02, 'Snapchat 联合创始人。', { since: 2011, birthYear: 1990, nationality: '美国' }),
  person('per-na-80', '杰克·多西', 'Block/Square 创始人', '经济', ['north_america'], -122.42, 37.78, 'Twitter 联合创始人，Block (Square) CEO。', { since: 2006, birthYear: 1976, nationality: '美国' }),
  person('per-na-81', '亚当·诺伊曼', 'Flow 创始人', '经济', ['north_america'], -73.99, 40.72, 'WeWork 前创始人，现 Flow 创始人。', { since: 2010, birthYear: 1979, nationality: '以色列/美国' }),
  person('per-na-82', '迈克尔·戴尔', '戴尔科技创始人', '经济', ['north_america'], -97.74, 30.27, '戴尔公司创始人。', { since: 1984, birthYear: 1965, nationality: '美国' }),
  person('per-na-83', '彼得·蒂尔', 'Founders Fund 创始人', '经济', ['north_america'], -122.42, 37.78, 'PayPal 联合创始人，《从0到1》作者。', { since: 1998, birthYear: 1967, nationality: '美国/德国', wikipedia: 'https://zh.wikipedia.org/wiki/彼得·蒂尔' }),

  // ── 美国能源/制药/制造 ──
  person('per-na-84', '达伦·伍兹', '埃克森美孚 CEO', '经济', ['north_america'], -95.37, 29.76, '埃克森美孚 CEO。', { since: 2017, nationality: '美国' }),
  person('per-na-85', '艾伯特·博尔拉', '辉瑞 CEO', '经济', ['north_america'], -74.01, 40.71, '辉瑞 CEO，主导新冠疫苗。', { since: 2019, nationality: '希腊/美国' }),
  person('per-na-86', '戴夫·里克斯', '礼来 CEO', '经济', ['north_america'], -86.16, 39.77, '礼来 CEO，GLP-1 减肥药浪潮。', { since: 2017, nationality: '美国' }),
  person('per-na-87', '斯特凡·班塞尔', 'Moderna CEO', '经济', ['north_america'], -71.08, 42.36, 'Moderna CEO，mRNA 商业化先驱。', { since: 2011, birthYear: 1972, nationality: '法国/美国', wikipedia: 'https://zh.wikipedia.org/wiki/斯特凡·班塞尔' }),
  person('per-na-88', '玛丽·巴拉', '通用汽车 CEO', '经济', ['north_america'], -83.05, 42.33, '通用汽车 CEO，推动电动化。', { since: 2014, birthYear: 1961, nationality: '美国', wikipedia: 'https://zh.wikipedia.org/wiki/玛丽·巴拉' }),
  person('per-na-89', '吉姆·法利', '福特 CEO', '经济', ['north_america'], -83.05, 42.33, '福特汽车 CEO。', { since: 2020, nationality: '美国' }),
  person('per-na-90', '博古睿', '波音 CEO', '经济', ['north_america'], -122.31, 47.53, '波音 CEO，应对 737 MAX 危机。', { since: 2024, nationality: '美国' }),

  // ── 美国科学与知识界 ──
  person('per-na-91', '杰弗里·辛顿', 'AI 科学家', '文化', ['north_america'], -79.38, 43.65, '深度学习之父，2024 诺贝尔物理学奖。', { since: 1980, birthYear: 1947, nationality: '加拿大/英国', wikipedia: 'https://zh.wikipedia.org/wiki/杰弗里·辛顿' }),
  person('per-na-92', '安德鲁·吴', 'AI 教育家', '文化', ['north_america'], -122.17, 37.43, '斯坦福教授，Coursera 联合创始人。', { since: 2011, birthYear: 1976, nationality: '美国', wikipedia: 'https://zh.wikipedia.org/wiki/吴恩达' }),
  person('per-na-93', '李飞飞', 'AI 科学家', '文化', ['north_america'], -122.17, 37.43, 'ImageNet 创立者，斯坦福以人为本 AI 研究院。', { since: 2009, birthYear: 1976, nationality: '美国', wikipedia: 'https://zh.wikipedia.org/wiki/李飞飞' }),
  person('per-na-94', '珍妮弗·杜德纳', 'CRISPR 先驱', '文化', ['north_america'], -122.26, 37.87, 'CRISPR 基因编辑先驱，诺贝尔化学奖。', { since: 2012, birthYear: 1964, nationality: '美国', wikipedia: 'https://zh.wikipedia.org/wiki/珍妮弗·杜德纳' }),
  person('per-na-95', '卡塔琳·考里科', 'mRNA 先驱', '文化', ['north_america'], -75.16, 39.98, 'mRNA 疫苗先驱，诺贝尔奖。', { since: 2020, birthYear: 1955, nationality: '美国/匈牙利', wikipedia: 'https://zh.wikipedia.org/wiki/卡塔琳·考里科' }),
  person('per-na-96', '尼尔·德格拉斯·泰森', '天体物理学家', '文化', ['north_america'], -73.95, 40.79, '科学传播者，海登天文馆馆长。', { since: 1990, birthYear: 1958, nationality: '美国' }),
  person('per-na-97', '理查德·道金斯', '进化生物学家', '文化', ['north_america'], -122.17, 37.43, '《自私的基因》作者，无神论倡导者。', { since: 1976, birthYear: 1941, nationality: '英国' }),
  person('per-na-98', '弗朗西斯·柯林斯', '前 NIH 院长', '文化', ['north_america'], -77.10, 39.00, '人类基因组计划领导者，前 NIH 院长。', { since: 2009, birthYear: 1950, nationality: '美国' }),
  person('per-na-99', '安东尼·福奇', '前 NIAID 院长', '社会', ['north_america'], -77.10, 39.00, '美国首席传染病专家，新冠应对核心。', { since: 1984, birthYear: 1940, nationality: '美国', wikipedia: 'https://zh.wikipedia.org/wiki/安东尼·福奇' }),

  // ── 美国智库与学者 ──
  person('per-na-100', '亨利·基辛格', '前国务卿', '政治', ['north_america'], NYC[0], NYC[1], '前国务卿，地缘战略思想家，2023 年逝世。', { since: 1969, birthYear: 1923, deathYear: 2023, status: 'deceased', nationality: '美国/德国', wikipedia: 'https://zh.wikipedia.org/wiki/亨利·基辛格' }),
  person('per-na-101', '约翰·米尔斯海默', '国际关系学者', '文化', ['north_america'], -87.65, 41.88, '芝加哥大学，进攻性现实主义理论。', { since: 1990, birthYear: 1947, nationality: '美国', wikipedia: 'https://zh.wikipedia.org/wiki/约翰·米尔斯海默' }),
  person('per-na-102', '弗朗西斯·福山', '政治学家', '文化', ['north_america'], -122.17, 37.43, '《历史的终结》作者。', { since: 1989, birthYear: 1952, nationality: '美国', wikipedia: 'https://zh.wikipedia.org/wiki/弗朗西斯·福山' }),
  person('per-na-103', '约瑟夫·奈', '国际关系学者', '文化', ['north_america'], -71.12, 42.38, '软实力概念提出者。', { since: 1990, birthYear: 1937, nationality: '美国', wikipedia: 'https://zh.wikipedia.org/wiki/约瑟夫·奈' }),
  person('per-na-104', '格雷厄姆·艾利森', '政治学家', '文化', ['north_america'], -71.12, 42.38, '「修昔底德陷阱」概念提出者。', { since: 2010, nationality: '美国' }),
  person('per-na-105', '保罗·克鲁格曼', '经济学家', '文化', ['north_america'], NYC[0], NYC[1], '纽约时报专栏作家，诺贝尔经济学奖。', { since: 2000, birthYear: 1953, nationality: '美国', wikipedia: 'https://zh.wikipedia.org/wiki/保罗·克鲁格曼' }),
  person('per-na-106', '约瑟夫·斯蒂格利茨', '经济学家', '文化', ['north_america'], NYC[0], NYC[1], '诺贝尔经济学奖，不平等研究。', { since: 2001, birthYear: 1943, nationality: '美国', wikipedia: 'https://zh.wikipedia.org/wiki/约瑟夫·斯蒂格利茨' }),
  person('per-na-107', '克劳迪娅·戈尔丁', '经济学家', '文化', ['north_america'], -71.12, 42.38, '哈佛，2023 诺贝尔经济学奖。', { since: 1990, birthYear: 1946, nationality: '美国', wikipedia: 'https://zh.wikipedia.org/wiki/克劳迪娅·戈尔丁' }),
  person('per-na-108', '达隆·阿西莫格鲁', '经济学家', '文化', ['north_america'], -71.12, 42.38, 'MIT，2024 诺贝尔经济学奖，《国家为什么会失败》。', { since: 1990, nationality: '美国/土耳其', wikipedia: 'https://zh.wikipedia.org/wiki/达隆·阿西莫格鲁' }),
  person('per-na-109', '丹尼尔·卡内曼', '心理学家', '文化', ['north_america'], -74.66, 40.35, '行为经济学先驱，《思考快与慢》，2024 年逝世。', { since: 1990, birthYear: 1934, deathYear: 2024, status: 'deceased', nationality: '以色列/美国', wikipedia: 'https://zh.wikipedia.org/wiki/丹尼尔·卡内曼' }),
  person('per-na-110', '理查德·泰勒', '行为经济学家', '文化', ['north_america'], -87.65, 41.88, '行为经济学之父，诺贝尔奖。', { since: 2017, birthYear: 1945, nationality: '美国', wikipedia: 'https://zh.wikipedia.org/wiki/理查德·泰勒' }),

  // ── 美国文化与媒体 ──
  person('per-na-13', '泰勒·斯威夫特', '歌手', '文化', ['north_america'], -86.78, 36.16, '全球流行文化偶像，「时代之旅」巡演创纪录。', { since: 2006, birthYear: 1989, nationality: '美国', wikipedia: 'https://zh.wikipedia.org/wiki/泰勒·斯威夫特' }),
  person('per-na-14', '史蒂文·斯皮尔伯格', '电影导演', '文化', ['north_america'], LA[0], LA[1], '好莱坞标志性导演。', { since: 1970, birthYear: 1946, nationality: '美国', wikipedia: 'https://zh.wikipedia.org/wiki/史蒂文·斯皮尔伯格' }),
  person('per-na-15', '马尔科姆·格拉德威尔', '作家', '文化', ['north_america'], NYC[0], NYC[1], '公共知识分子，探讨社会科学。', { birthYear: 1963, wikipedia: 'https://zh.wikipedia.org/wiki/马尔科姆·格拉德威尔' }),
  person('per-na-111', '克里斯托弗·诺兰', '电影导演', '文化', ['north_america'], LA[0], LA[1], '《奥本海默》奥斯卡最佳导演。', { since: 1998, birthYear: 1970, nationality: '英国/美国', wikipedia: 'https://zh.wikipedia.org/wiki/克里斯托弗·诺兰' }),
  person('per-na-112', '汤姆·汉克斯', '演员', '文化', ['north_america'], LA[0], LA[1], '两届奥斯卡最佳男主角。', { since: 1980, birthYear: 1956, nationality: '美国' }),
  person('per-na-113', '奥普拉·温弗瑞', '媒体巨头', '文化', ['north_america'], -87.65, 41.88, '脱口秀女王与媒体帝国创始人。', { since: 1986, birthYear: 1954, nationality: '美国' }),
  person('per-na-114', '碧昂丝', '歌手', '文化', ['north_america'], -95.37, 29.76, '获格莱美奖最多的艺人。', { since: 1997, birthYear: 1981, nationality: '美国', wikipedia: 'https://zh.wikipedia.org/wiki/碧昂丝' }),
  person('per-na-115', '比莉·艾利什', '歌手', '文化', ['north_america'], LA[0], LA[1], '多座格莱美奖年轻歌手。', { since: 2015, birthYear: 2001, nationality: '美国', wikipedia: 'https://zh.wikipedia.org/wiki/比莉·艾利什' }),
  person('per-na-116', '坎耶·维斯特', '音乐人', '文化', ['north_america'], LA[0], LA[1], '争议性音乐人与时尚设计师。', { since: 2000, birthYear: 1977, nationality: '美国' }),
  person('per-na-117', '德雷克', '说唱歌手', '文化', ['north_america'], -79.38, 43.65, '加拿大说唱歌手，全球流媒体纪录保持者。', { since: 2006, birthYear: 1986, nationality: '加拿大' }),
  person('per-na-118', '鲍勃·艾格', '迪士尼 CEO', '经济', ['north_america'], -81.52, 28.38, '迪士尼 CEO。', { since: 2022, birthYear: 1950, nationality: '美国' }),
  person('per-na-119', '莎丽·雷德斯通', '派拉蒙前董事长', '经济', ['north_america'], LA[0], LA[1], '派拉蒙全球董事长。', { since: 2020, nationality: '美国' }),
  person('per-na-120', '鲁伯特·默多克', '新闻集团创始人', '文化', ['north_america'], NYC[0], NYC[1], '传媒大亨。', { since: 1950, birthYear: 1931, nationality: '澳大利亚/美国', wikipedia: 'https://zh.wikipedia.org/wiki/鲁伯特·默多克' }),
  person('per-na-121', '莱克斯·弗里德曼', '播客主持人', '文化', ['north_america'], BOS[0], BOS[1], 'MIT 研究员，长格式深度对话播客。', { since: 2018, wikipedia: 'https://en.wikipedia.org/wiki/Lex_Fridman' }),
  person('per-na-122', '乔·罗根', '播客主持人', '文化', ['north_america'], -97.74, 30.27, '全球收听量最大的播客主持人。', { since: 2009, birthYear: 1967, nationality: '美国' }),
  person('per-na-123', '马尔科姆·格拉德威尔', '作家', '文化', ['north_america'], NYC[0], NYC[1], '畅销书作家与播客主。（合并条目）', { birthYear: 1963, nationality: '加拿大/英国' }),

  // ── 美国体育 ──
  person('per-na-124', '勒布朗·詹姆斯', '篮球运动员', '文化', ['north_america'], LA[0], LA[1], 'NBA 历史总得分王。', { since: 2003, birthYear: 1984, nationality: '美国', wikipedia: 'https://zh.wikipedia.org/wiki/勒布朗·詹姆斯' }),
  person('per-na-125', '斯蒂芬·库里', '篮球运动员', '文化', ['north_america'], -122.42, 37.78, 'NBA 三分球革命引领者。', { since: 2009, birthYear: 1988, nationality: '美国' }),
  person('per-na-126', '科比·布莱恩特', '前篮球运动员', '文化', ['north_america'], -118.26, 34.04, '已故传奇球星。', { since: 1996, status: 'deceased', nationality: '美国', wikipedia: 'https://zh.wikipedia.org/wiki/科比·布莱恩特' }),
  person('per-na-127', '老虎伍兹', '高尔夫球手', '文化', ['north_america'], -80.27, 25.78, '高尔夫传奇。', { since: 1996, birthYear: 1975, nationality: '美国' }),
  person('per-na-128', '塞雷娜·威廉姆斯', '网球运动员', '文化', ['north_america'], -80.27, 25.78, '23 座大满贯冠军。', { since: 1995, birthYear: 1981, nationality: '美国' }),
  person('per-na-129', '帕特里克·马霍姆斯', '橄榄球运动员', '文化', ['north_america'], -94.59, 39.10, 'NFL 四分卫，三度超级碗 MVP。', { since: 2017, birthYear: 1995, nationality: '美国' }),
  person('per-na-130', '里奥·梅西', '足球运动员', '文化', ['north_america'], -80.27, 25.78, '现效力于迈阿密国际。', { since: 2004, birthYear: 1987, nationality: '阿根廷', wikipedia: 'https://zh.wikipedia.org/wiki/利昂内尔·梅西' }),

  // ── 美国州长 ──
  person('per-na-131', '加文·纽森', '加州州长', '政治', ['north_america'], -122.42, 37.78, '加州州长，民主党明日之星。', { since: 2019, birthYear: 1967, nationality: '美国' }),
  person('per-na-132', '罗恩·德桑蒂斯', '佛州州长', '政治', ['north_america'], -82.36, 30.34, '佛州州长，2024 总统初选人。', { since: 2019, birthYear: 1978, nationality: '美国', wikipedia: 'https://zh.wikipedia.org/wiki/罗恩·德桑蒂斯' }),
  person('per-na-133', '格雷格·阿博特', '得州州长', '政治', ['north_america'], -97.74, 30.27, '得州州长，边境安全强硬派。', { since: 2015, birthYear: 1957, nationality: '美国' }),
  person('per-na-134', '格蕾琴·惠特默', '密歇根州州长', '政治', ['north_america'], -84.56, 42.73, '密歇根州州长。', { since: 2019, birthYear: 1971, nationality: '美国' }),
  person('per-na-135', '乔什·夏皮罗', '宾州州长', '政治', ['north_america'], -77.86, 40.29, '宾州州长。', { since: 2023, birthYear: 1973, nationality: '美国' }),

  // ── 加拿大人物 ──
  person('per-na-18', '贾斯汀·特鲁多', '加拿大总理', '政治', ['north_america'], OTTAWA[0], OTTAWA[1], '加拿大领导人，参与北约与对华经贸关系。', { since: 2015, birthYear: 1971, nationality: '加拿大', wikipedia: 'https://zh.wikipedia.org/wiki/贾斯汀·特鲁多' }),
  person('per-na-136', '克里斯蒂娅·弗里兰', '加拿大副总理', '政治', ['north_america'], OTTAWA[0], OTTAWA[1], '记者出身的副总理兼财政部长。', { since: 2019, birthYear: 1968, nationality: '加拿大', wikipedia: 'https://zh.wikipedia.org/wiki/方慧兰' }),
  person('per-na-137', '皮埃尔·普瓦利耶', '保守党领袖', '政治', ['north_america'], OTTAWA[0], OTTAWA[1], '加拿大保守党领袖。', { since: 2022, birthYear: 1979, nationality: '加拿大' }),
  person('per-na-138', '蒂夫·麦克勒', '加拿大央行行长', '经济', ['north_america'], OTTAWA[0], OTTAWA[1], '加拿大央行行长。', { since: 2023, nationality: '加拿大' }),
  person('per-na-139', '加尔·韦斯顿', 'Loblaw 董事长', '经济', ['north_america'], -79.38, 43.65, '加拿大零售巨头 Loblaw 董事长。', { since: 2006, nationality: '加拿大' }),
  person('per-na-140', '达伦·伍兹', 'Shopify CEO', '经济', ['north_america'], -79.38, 43.65, 'Shopify CEO，加拿大最大科技公司。', { since: 2008, nationality: '加拿大' }),
  person('per-na-141', '玛格丽特·阿特伍德', '作家', '文化', ['north_america'], -79.38, 43.65, '《使女的故事》作者。', { since: 1985, birthYear: 1939, nationality: '加拿大' }),
  person('per-na-142', '詹姆斯·卡梅隆', '电影导演', '文化', ['north_america'], -79.38, 43.65, '《阿凡达》《泰坦尼克号》导演。', { since: 1980, birthYear: 1954, nationality: '加拿大' }),
  person('per-na-143', '威肯', '歌手', '文化', ['north_america'], -79.38, 43.65, '加拿大 R&B 歌手。', { since: 2010, birthYear: 1990, nationality: '加拿大' }),
  person('per-na-144', '肖恩·蒙德兹', '歌手', '文化', ['north_america'], -79.38, 43.65, '加拿大流行歌手。', { since: 2013, birthYear: 1998, nationality: '加拿大' }),

  // ── 墨西哥人物 ──
  person('per-na-145', '克劳迪娅·辛鲍姆', '墨西哥总统', '政治', ['north_america'], MEX[0], MEX[1], '墨西哥首位女性总统，科学家出身。', { since: 2024, birthYear: 1962, nationality: '墨西哥', wikipedia: 'https://zh.wikipedia.org/wiki/克劳迪娅·辛鲍姆' }),
  person('per-na-146', '安德烈斯·曼努埃尔·洛佩斯·奥夫拉多尔', '墨西哥前总统', '政治', ['north_america'], MEX[0], MEX[1], '墨西哥左翼前总统。', { since: 2018, birthYear: 1953, nationality: '墨西哥' }),
  person('per-na-147', '马塞洛·埃布拉德', '墨西哥前外长', '政治', ['north_america'], MEX[0], MEX[1], '墨西哥前外交部长。', { since: 2022, nationality: '墨西哥' }),
  person('per-na-148', '卡洛斯·斯利姆', '美洲电信创始人', '经济', ['north_america'], MEX[0], MEX[1], '墨西哥电信大亨，拉美首富。', { since: 1990, birthYear: 1940, nationality: '墨西哥', netWorthUsd: 90_000_000_000, wikipedia: 'https://zh.wikipedia.org/wiki/卡洛斯·斯利姆' }),
  person('per-na-149', '里卡多·萨利纳斯·普利戈', 'Grupo Salinas 创始人', '经济', ['north_america'], MEX[0], MEX[1], '墨西哥零售与传媒大亨。', { since: 1980, nationality: '墨西哥' }),
  person('per-na-150', '奥克塔维奥·帕兹', '诗人', '文化', ['north_america'], MEX[0], MEX[1], '诺贝尔文学奖得主。', { since: 1990, status: 'deceased', nationality: '墨西哥' }),
  person('per-na-151', '吉尔莫·德尔·托罗', '电影导演', '文化', ['north_america'], MEX[0], MEX[1], '奥斯卡最佳导演。', { since: 1990, birthYear: 1964, nationality: '墨西哥' }),

  // ── 更多美国商界 ──
  person('per-na-152', '肯·格里芬', '城堡投资创始人', '经济', ['north_america'], -87.65, 41.88, '城堡对冲基金创始人。', { since: 1990, birthYear: 1968, nationality: '美国' }),
  person('per-na-153', '莱昂·库珀曼', '对冲基金经理', '经济', ['north_america'], NYC[0], NYC[1], 'Omega Advisors 创始人。', { since: 1991, nationality: '美国' }),
  person('per-na-154', '雷·达利奥', '桥水创始人', '经济', ['north_america'], -73.83, 41.13, '桥水基金创始人。（合并条目）', { since: 1975, birthYear: 1949, nationality: '美国' }),
  person('per-na-155', '大卫·泰珀', 'Appaloosa 创始人', '经济', ['north_america'], -80.01, 40.44, '对冲基金经理，NFL 卡罗莱纳黑豹队老板。', { since: 1993, nationality: '美国' }),
  person('per-na-156', '斯蒂芬·施瓦茨曼', '黑石集团 CEO', '经济', ['north_america'], NYC[0], NYC[1], '黑石集团联合创始人。', { since: 1985, birthYear: 1947, nationality: '美国' }),
  person('per-na-157', '莱昂·布莱克', '阿波罗全球管理创始人', '经济', ['north_america'], NYC[0], NYC[1], '阿波罗全球管理联合创始人。', { since: 1990, nationality: '美国' }),
  person('per-na-158', '约翰·杜尔', 'Kleiner Perkins 合伙人', '经济', ['north_america'], -122.17, 37.43, '风险投资家，投资 Google/Amazon。', { since: 1980, nationality: '美国' }),
  person('per-na-159', '彼得·蒂尔', 'Founders Fund 创始人', '经济', ['north_america'], -122.42, 37.78, 'PayPal 黑帮核心。（合并条目）', { since: 1998, birthYear: 1967, nationality: '美国/德国', wikipedia: 'https://zh.wikipedia.org/wiki/彼得·蒂尔' }),
  person('per-na-160', '里德·霍夫曼', 'LinkedIn 联合创始人', '经济', ['north_america'], -122.17, 37.43, 'LinkedIn 联合创始人，Greylock。', { since: 2002, birthYear: 1967, nationality: '美国' }),
  person('per-na-161', '维诺德·科斯拉', 'Khosla Ventures 创始人', '经济', ['north_america'], -122.17, 37.43, 'Sun 联合创始人，清洁技术 VC。', { since: 1982, nationality: '美国/印度' }),
  person('per-na-162', '马克·安德森', 'a16z 联合创始人', '经济', ['north_america'], -122.17, 37.43, '网景联合创始人，a16z。', { since: 2009, birthYear: 1971, nationality: '美国' }),
  person('per-na-163', '本·霍洛维茨', 'a16z 联合创始人', '经济', ['north_america'], -122.17, 37.43, 'a16z 联合创始人。', { since: 2009, nationality: '美国' }),

  // ── 更多美国社会与活动家 ──
  person('per-na-164', '格蕾塔·通贝里', '气候活动家', '社会', ['north_america'], NYC[0], NYC[1], '瑞典青年气候运动领袖。（跨区）', { since: 2018, birthYear: 2003, nationality: '瑞典', wikipedia: 'https://zh.wikipedia.org/wiki/格蕾塔·通贝里' }),
  person('per-na-165', '马尔科姆·X', '民权领袖', '社会', ['north_america'], NYC[0], NYC[1], '非裔美国人民权运动人物。', { since: 1950, status: 'deceased', nationality: '美国' }),
  person('per-na-166', '艾尔顿·马斯克', 'DOGE 负责人', '经济', ['north_america'], DC[0], DC[1], '政府效率部门负责人（合并条目）。', { since: 2025, birthYear: 1971, nationality: '美国' }),
  person('per-na-167', '维韦克·拉马斯瓦米', '企业家、政治活动家', '政治', ['north_america'], -84.51, 39.14, '生物制药企业家，2024 共和党初选人。', { since: 2023, birthYear: 1985, nationality: '美国' }),

  // ── NASA 与航天 ──
  person('per-na-168', '比尔·尼尔森', 'NASA 局长', '政治', ['north_america'], -80.65, 28.57, '前佛州参议员，NASA 局长。', { since: 2021, birthYear: 1942, nationality: '美国', wikipedia: 'https://zh.wikipedia.org/wiki/比尔·尼尔森' }),
  person('per-na-169', '帕姆·梅尔罗伊', 'NASA 副局长', '政治', ['north_america'], -80.65, 28.57, '前宇航员，NASA 副局长。', { since: 2021, nationality: '美国' }),
  person('per-na-170', '埃隆·马斯克', 'SpaceX 创始人', '经济', ['north_america'], -80.65, 28.57, 'SpaceX 创始人。（合并条目）', { since: 2002, birthYear: 1971, nationality: '美国' }),

  // ── 传媒与新闻 ──
  person('per-na-171', '杰夫·贝索斯', '《华盛顿邮报》老板', '经济', ['north_america'], -77.04, 38.90, '拥有《华盛顿邮报》。（合并条目）', { since: 2013, birthYear: 1964, nationality: '美国' }),
  person('per-na-172', '马克·汤普森', 'CNN 前 CEO', '文化', ['north_america'], -73.99, 40.72, '前 BBC 与纽约时报 CEO，CNN 前 CEO。', { since: 2023, nationality: '英国' }),
  person('per-na-173', '雷切尔·玛多', 'MSNBC 主持人', '文化', ['north_america'], NYC[0], NYC[1], 'MSNBC 黄金时段主持人。', { since: 2008, birthYear: 1973, nationality: '美国' }),
  person('per-na-174', '塔克·卡尔森', '保守派评论员', '文化', ['north_america'], DC[0], DC[1], '前 Fox News 主持人。', { since: 2016, birthYear: 1969, nationality: '美国' }),

  // ── 更多科学界 ──
  person('per-na-175', '埃里克·兰德', '前白宫科学顾问', '文化', ['north_america'], -71.06, 42.36, '人类基因组计划领导者。', { since: 2021, nationality: '美国' }),
  person('per-na-176', '费斯·丹尼尔', 'Broad 研究所所长', '文化', ['north_america'], -71.10, 42.36, 'Broad 研究所所长。', { since: 2009, nationality: '美国' }),
  person('per-na-177', '杨振宁', '物理学家', '文化', ['north_america'], -71.06, 42.36, '诺贝尔物理学奖，杨-米尔斯理论。（在美工作）', { since: 1957, birthYear: 1922, nationality: '中国/美国', wikipedia: 'https://zh.wikipedia.org/wiki/杨振宁' }),
  person('per-na-178', '丘成桐', '数学家', '文化', ['north_america'], -71.06, 42.36, '哈佛数学教授，菲尔兹奖得主。', { since: 1980, birthYear: 1949, nationality: '中国/美国' }),
  person('per-na-179', '张锋', '生物学家', '文化', ['north_america'], -71.10, 42.36, 'MIT，CRISPR 基因编辑先驱。', { since: 2013, birthYear: 1982, nationality: '美国/中国' }),
  person('per-na-180', '沙菲·戈德瓦塞尔', '密码学家', '文化', ['north_america'], -71.06, 42.36, 'MIT，图灵奖得主。', { since: 2012, nationality: '美国/以色列' }),

  // ── 更多文化界 ──
  person('per-na-181', '乔治·R·R·马丁', '作家', '文化', ['north_america'], -106.65, 35.08, '《冰与火之歌》作者。', { since: 1996, birthYear: 1948, nationality: '美国' }),
  person('per-na-182', '尼尔·盖曼', '作家', '文化', ['north_america'], -87.65, 41.88, '幻想文学作家。', { since: 1990, birthYear: 1960, nationality: '英国/美国' }),
  person('per-na-183', 'Lady Gaga', '歌手', '文化', ['north_america'], NYC[0], NYC[1], '流行歌手与演员。', { since: 2008, birthYear: 1986, nationality: '美国' }),
  person('per-na-184', '布鲁诺·马尔斯', '歌手', '文化', ['north_america'], -157.86, 21.31, '流行歌手。', { since: 2004, birthYear: 1985, nationality: '美国' }),
  person('per-na-185', '德韦恩·约翰逊', '演员', '文化', ['north_america'], -80.19, 25.76, '「巨石强森」演员与前摔角手。', { since: 1996, birthYear: 1972, nationality: '美国' }),
  person('per-na-186', '汤姆·克鲁斯', '演员', '文化', ['north_america'], -118.24, 34.05, '好莱坞巨星。', { since: 1980, birthYear: 1962, nationality: '美国' }),
  person('per-na-187', '小罗伯特·唐尼', '演员', '文化', ['north_america'], -118.24, 34.05, '钢铁侠扮演者。', { since: 1980, birthYear: 1965, nationality: '美国' }),
  person('per-na-188', '斯嘉丽·约翰逊', '演员', '文化', ['north_america'], -118.24, 34.05, '好莱坞女演员。', { since: 1994, birthYear: 1984, nationality: '美国' }),
  person('per-na-189', '莱昂纳多·迪卡普里奥', '演员', '文化', ['north_america'], -118.24, 34.05, '奥斯卡最佳男主角。', { since: 1990, birthYear: 1974, nationality: '美国' }),
  person('per-na-190', '梅丽尔·斯特里普', '演员', '文化', ['north_america'], -73.95, 40.79, '获奥斯卡提名最多的演员。', { since: 1970, birthYear: 1949, nationality: '美国' }),
];
