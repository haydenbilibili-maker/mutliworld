import { person } from './helpers';

const BJ = [116.40, 39.90] as const;
const SH = [121.47, 31.23] as const;
const TW = [121.56, 25.03] as const;
const HK = [114.17, 22.32] as const;
const SZ = [114.06, 22.55] as const;
const HZ = [120.16, 30.27] as const;

/** 中国及周边区域人物 */
export const CHINA_PERSONS = [
  // ── 党和国家领导人 ──
  person('per-cn-1', '习近平', '中共中央总书记、国家主席', '政治', ['china'], BJ[0], BJ[1], '中国最高领导人，统筹发展与安全、推进中国式现代化。', { since: 2012, birthYear: 1953, nationality: '中国', wikipedia: 'https://zh.wikipedia.org/wiki/习近平' }),
  person('per-cn-2', '李强', '国务院总理', '政治', ['china'], BJ[0], BJ[1], '国务院首脑，负责宏观经济调控与民生政策执行。', { since: 2023, birthYear: 1959, nationality: '中国', wikipedia: 'https://zh.wikipedia.org/wiki/李强' }),
  person('per-cn-33', '赵乐际', '全国人大常委会委员长', '政治', ['china'], BJ[0], BJ[1], '全国人大立法与监督首长。', { since: 2023, birthYear: 1957, nationality: '中国' }),
  person('per-cn-23', '王沪宁', '全国政协主席', '政治', ['china'], BJ[0], BJ[1], '分管统战与政协工作，参与意识形态与对台政策。', { since: 2023, birthYear: 1955, nationality: '中国' }),
  person('per-cn-34', '丁薛祥', '国务院副总理', '政治', ['china'], BJ[0], BJ[1], '分管科技、环保与教育，推动新质生产力。', { since: 2023, birthYear: 1962, nationality: '中国', wikipedia: 'https://zh.wikipedia.org/wiki/丁薛祥' }),
  person('per-cn-35', '李希', '中纪委书记', '政治', ['china'], BJ[0], BJ[1], '中纪委反腐监察首长。', { since: 2022, birthYear: 1956, nationality: '中国' }),
  person('per-cn-36', '韩正', '国家副主席', '政治', ['china'], BJ[0], BJ[1], '前副总理，现国家副主席。', { since: 2023, birthYear: 1954, nationality: '中国' }),
  person('per-cn-37', '蔡奇', '中央书记处书记', '政治', ['china'], BJ[0], BJ[1], '中央书记处常务书记。', { since: 2022, birthYear: 1955, nationality: '中国' }),
  person('per-cn-38', '张国清', '国务院副总理', '政治', ['china'], BJ[0], BJ[1], '分管工业与安全生产。', { since: 2023, birthYear: 1964, nationality: '中国' }),
  person('per-cn-39', '陈吉宁', '上海市委书记', '政治', ['china'], SH[0], SH[1], '上海市委一把手。', { since: 2022, birthYear: 1964, nationality: '中国' }),
  person('per-cn-40', '袁家军', '北京市委书记', '政治', ['china'], BJ[0], BJ[1], '北京市委一把手。', { since: 2023, birthYear: 1962, nationality: '中国' }),
  person('per-cn-41', '黄坤明', '广东省委书记', '政治', ['china'], 113.27, 23.13, '广东省委一把手。', { since: 2022, birthYear: 1956, nationality: '中国' }),
  person('per-cn-28', '马兴瑞', '新疆自治区党委书记', '政治', ['china'], 87.58, 43.83, '主管新疆工作，推进向西开放。', { since: 2021, birthYear: 1959, nationality: '中国' }),
  person('per-cn-42', '沈晓明', '湖南省委书记', '政治', ['china'], 112.98, 28.19, '湖南省委一把手。', { since: 2023, birthYear: 1963, nationality: '中国' }),

  // ── 中央政府部委 ──
  person('per-cn-3', '王毅', '外交部长', '政治', ['china'], BJ[0], BJ[1], '中国首席外交官，主持中美、中欧及多边外交。', { since: 2023, birthYear: 1953, nationality: '中国', wikipedia: 'https://zh.wikipedia.org/wiki/王毅' }),
  person('per-cn-4', '何立峰', '国务院副总理', '经济', ['china'], BJ[0], BJ[1], '分管金融与经贸，协调房地产与地方债务风险化解。', { since: 2023, birthYear: 1955, nationality: '中国', wikipedia: 'https://zh.wikipedia.org/wiki/何立峰' }),
  person('per-cn-5', '潘功胜', '中国人民银行行长', '经济', ['china'], BJ[0], BJ[1], '货币政策制定者，管理人民币汇率与金融稳定。', { since: 2023, birthYear: 1963, nationality: '中国', wikipedia: 'https://zh.wikipedia.org/wiki/潘功胜' }),
  person('per-cn-43', '王文涛', '商务部长', '经济', ['china'], BJ[0], BJ[1], '推动自贸区协定与中美经贸谈判。', { since: 2022, birthYear: 1964, nationality: '中国', wikipedia: 'https://zh.wikipedia.org/wiki/王文涛' }),
  person('per-cn-26', '刘建超', '中央外办主任', '政治', ['china'], BJ[0], BJ[1], '负责对外联络与政党外交，协调中美联委会。', { since: 2023, birthYear: 1964, nationality: '中国', wikipedia: 'https://zh.wikipedia.org/wiki/刘建超' }),
  person('per-cn-44', '陈文清', '中央政法委书记', '政治', ['china'], BJ[0], BJ[1], '政法维稳与国安事务。', { since: 2022, birthYear: 1960, nationality: '中国' }),
  person('per-cn-81', '蓝佛安', '财政部长', '经济', ['china'], BJ[0], BJ[1], '财政部部长，负责财政政策与地方债务。', { since: 2023, birthYear: 1962, nationality: '中国', wikipedia: 'https://zh.wikipedia.org/wiki/蓝佛安' }),
  person('per-cn-82', '怀进鹏', '教育部长', '社会', ['china'], BJ[0], BJ[1], '教育部长，前中国科协党组书记。', { since: 2021, birthYear: 1962, nationality: '中国' }),
  person('per-cn-83', '王晓萍', '人力资源和社会保障部长', '社会', ['china'], BJ[0], BJ[1], '人社部长，负责就业与社保政策。', { since: 2022, nationality: '中国' }),
  person('per-cn-84', '金壮龙', '工业和信息化部长', '经济', ['china'], BJ[0], BJ[1], '工信部长，主管制造业升级与芯片产业。', { since: 2022, birthYear: 1964, nationality: '中国' }),
  person('per-cn-85', '阴和俊', '科学技术部长', '社会', ['china'], BJ[0], BJ[1], '科技部长，主管国家科技攻关。', { since: 2023, birthYear: 1963, nationality: '中国' }),
  person('per-cn-86', '孙业礼', '文化和旅游部长', '文化', ['china'], BJ[0], BJ[1], '文旅部长，推动文旅融合。', { since: 2023, nationality: '中国' }),
  person('per-cn-87', '雷海潮', '国家卫生健康委员会主任', '社会', ['china'], BJ[0], BJ[1], '卫健委主任，主管公共卫生。', { since: 2024, nationality: '中国' }),
  person('per-cn-88', '郑栅洁', '国家发展和改革委员会主任', '经济', ['china'], BJ[0], BJ[1], '发改委主任，主管宏观经济规划。', { since: 2023, birthYear: 1961, nationality: '中国' }),
  person('per-cn-89', '吴政隆', '国务院秘书长', '政治', ['china'], BJ[0], BJ[1], '国务院秘书长，协调各部委。', { since: 2023, birthYear: 1964, nationality: '中国' }),
  person('per-cn-90', '应勇', '最高人民检察院检察长', '政治', ['china'], BJ[0], BJ[1], '首席大检察官，主管检察工作。', { since: 2022, birthYear: 1957, nationality: '中国' }),
  person('per-cn-91', '张军', '最高人民法院院长', '政治', ['china'], BJ[0], BJ[1], '首席大法官，主管司法审判。', { since: 2018, birthYear: 1956, nationality: '中国' }),

  // ── 中国军队（战区与军种主官）──
  person('per-cn-6', '张又侠', '中央军委副主席', '军事', ['china'], BJ[0], BJ[1], '军队高级将领，参与国防与军队现代化决策。', { since: 2017, birthYear: 1950, nationality: '中国' }),
  person('per-cn-7', '董军', '国防部长', '军事', ['china'], BJ[0], BJ[1], '负责国防事务对外沟通与军事外交。', { since: 2023, birthYear: 1961, nationality: '中国' }),
  person('per-cn-45', '刘振立', '联合参谋部参谋长', '军事', ['china'], BJ[0], BJ[1], '军队联合作战指挥负责人。', { since: 2022, nationality: '中国' }),
  person('per-cn-24', '吴谦', '国防部新闻发言人', '军事', ['china'], BJ[0], BJ[1], '军方对外发声渠道，就台海与南海议题发布信息。', { since: 2016, nationality: '中国' }),
  person('per-cn-68', '何卫东', '中央军委副主席', '军事', ['china'], BJ[0], BJ[1], '中央军委副主席，曾任东部战区司令，主管对台方向。', { since: 2022, birthYear: 1957, nationality: '中国', wikipedia: 'https://zh.wikipedia.org/wiki/何卫东' }),
  person('per-cn-69', '李尚福', '前国防部长', '军事', ['china'], BJ[0], BJ[1], '装备发展部出身的前国防部长，2023 年被免职。', { since: 2023, birthYear: 1958, status: 'restricted', nationality: '中国', wikipedia: 'https://zh.wikipedia.org/wiki/李尚福' }),
  person('per-cn-70', '苗华', '中央军委政治工作部主任', '军事', ['china'], BJ[0], BJ[1], '海军上将，主管军队政治工作。', { since: 2017, birthYear: 1955, nationality: '中国', wikipedia: 'https://zh.wikipedia.org/wiki/苗华' }),
  person('per-cn-71', '张升民', '中央军委纪律检查委员会书记', '军事', ['china'], BJ[0], BJ[1], '军队纪检与政治工作负责人。', { since: 2017, nationality: '中国' }),
  person('per-cn-72', '林向阳', '东部战区司令', '军事', ['china'], 118.78, 32.06, '东部战区司令，负责对台军事方向。', { since: 2023, nationality: '中国' }),
  person('per-cn-73', '王秀斌', '南部战区司令', '军事', ['china'], 113.27, 23.13, '南部战区司令，主管南海方向。', { since: 2021, nationality: '中国' }),
  person('per-cn-74', '吴亚男', '中部战区司令', '军事', ['china'], BJ[0], BJ[1], '中部战区司令，拱卫京畿。', { since: 2024, nationality: '中国' }),
  person('per-cn-75', '黄铭', '北部战区司令', '军事', ['china'], 123.43, 41.80, '北部战区司令，负责东北亚方向。', { since: 2023, nationality: '中国' }),
  person('per-cn-76', '王强', '西部战区司令', '军事', ['china'], 104.07, 30.67, '西部战区司令，主管中印边境方向。', { since: 2023, nationality: '中国' }),
  person('per-cn-77', '董军海军上将', '前海军司令', '军事', ['china'], BJ[0], BJ[1], '海军出身，首位海军背景国防部长。', { since: 2021, nationality: '中国' }),
  person('per-cn-78', '徐四清', '空军司令', '军事', ['china'], BJ[0], BJ[1], '解放军空军司令员。', { since: 2022, nationality: '中国' }),
  person('per-cn-79', '周亚宁', '火箭军司令', '军事', ['china'], BJ[0], BJ[1], '战略导弹部队火箭军司令员。', { since: 2017, nationality: '中国' }),
  person('per-cn-80', '巨乾生', '战略支援部队司令', '军事', ['china'], BJ[0], BJ[1], '战略支援部队司令员，主管太空与网络战。', { since: 2021, nationality: '中国' }),

  // ── 中国科技 ──
  person('per-cn-19', '任正非', '华为创始人', '经济', ['china'], SZ[0], SZ[1], '中国科技企业家，领导华为在通信与芯片领域攻关。', { since: 1987, birthYear: 1944, nationality: '中国', wikipedia: 'https://zh.wikipedia.org/wiki/任正非' }),
  person('per-cn-46', '马云', '阿里巴巴创始人', '经济', ['china'], HZ[0], HZ[1], '中国电商与数字支付先驱。', { since: 1999, birthYear: 1964, nationality: '中国', wikipedia: 'https://zh.wikipedia.org/wiki/马云' }),
  person('per-cn-47', '马化腾', '腾讯创始人', '经济', ['china'], SZ[0], SZ[1], '微信与中国互联网社交核心。', { since: 1998, birthYear: 1971, nationality: '中国', wikipedia: 'https://zh.wikipedia.org/wiki/马化腾' }),
  person('per-cn-30', '雷军', '小米创始人', '经济', ['china'], BJ[0], BJ[1], '科技企业家，跨界手机、智能家居与电动车。', { since: 2010, birthYear: 1969, nationality: '中国', wikipedia: 'https://zh.wikipedia.org/wiki/雷军' }),
  person('per-cn-48', '张一鸣', '字节跳动创始人', '经济', ['china'], BJ[0], BJ[1], 'TikTok/抖音 全球短视频生态创始人。', { since: 2012, birthYear: 1983, nationality: '中国' }),
  person('per-cn-49', '黄峥', '拼多多创始人', '经济', ['china'], SH[0], SH[1], '拼多多与Temu创始人。', { since: 2015, birthYear: 1980, nationality: '中国' }),
  person('per-cn-50', '王传福', '比亚迪创始人', '经济', ['china'], SZ[0], SZ[1], '全球最大新能源汽车制造商掌门。', { since: 1995, birthYear: 1966, nationality: '中国', wikipedia: 'https://zh.wikipedia.org/wiki/王传福' }),
  person('per-cn-51', '曾毓群', '宁德时代创始人', '经济', ['china'], 119.50, 26.65, '全球最大动力电池制造商创始人。', { since: 2011, birthYear: 1968, nationality: '中国' }),
  person('per-cn-29', '李书福', '吉利创始人', '经济', ['china'], HZ[0], HZ[1], '中国汽车出海领军者。', { since: 1986, birthYear: 1963, nationality: '中国', wikipedia: 'https://zh.wikipedia.org/wiki/李书福' }),
  person('per-cn-52', '刘强东', '京东创始人', '经济', ['china'], BJ[0], BJ[1], '京东物流与电商。', { since: 1998, birthYear: 1974, nationality: '中国', wikipedia: 'https://zh.wikipedia.org/wiki/刘强东' }),
  person('per-cn-53', '李彦宏', '百度创始人', '经济', ['china'], BJ[0], BJ[1], '百度搜索与 AI 文心一言。', { since: 2000, birthYear: 1968, nationality: '中国', wikipedia: 'https://zh.wikipedia.org/wiki/李彦宏' }),
  person('per-cn-54', '丁磊', '网易创始人', '经济', ['china'], HZ[0], HZ[1], '网易与游戏业务。', { since: 1997, birthYear: 1971, nationality: '中国' }),
  person('per-cn-55', '董明珠', '格力电器董事长', '经济', ['china'], 113.90, 22.30, '格力电器女掌门。', { since: 2012, birthYear: 1954, nationality: '中国', wikipedia: 'https://zh.wikipedia.org/wiki/董明珠' }),
  person('per-cn-56', '曹德旺', '福耀玻璃创始人', '经济', ['china'], 119.38, 25.67, '福耀集团创始人，全球汽车玻璃巨头。', { since: 1987, birthYear: 1946, nationality: '中国' }),
  person('per-cn-57', '许家印', '恒大集团前董事长', '经济', ['china'], SZ[0], SZ[1], '恒大集团创始人，债务危机核心人物。', { since: 1996, birthYear: 1958, nationality: '中国', wikipedia: 'https://zh.wikipedia.org/wiki/许家印' }),

  // ── 中国金融 ──
  person('per-cn-58', '易纲', '前央行行长', '经济', ['china'], BJ[0], BJ[1], '前中国人民银行行长，货币政策专家。', { since: 2018, birthYear: 1958, nationality: '中国', wikipedia: 'https://zh.wikipedia.org/wiki/易纲' }),
  person('per-cn-59', '林毅夫', '经济学家', '经济', ['china'], BJ[0], BJ[1], '前世界银行副行长，发展经济学权威。', { since: 2008, birthYear: 1952, nationality: '中国', wikipedia: 'https://zh.wikipedia.org/wiki/林毅夫' }),
  person('per-cn-92', '刘鹤', '前国务院副总理', '经济', ['china'], BJ[0], BJ[1], '习近平核心经济智囊，主导中美贸易谈判。', { since: 2018, birthYear: 1952, status: 'restricted', nationality: '中国', wikipedia: 'https://zh.wikipedia.org/wiki/刘鹤' }),
  person('per-cn-93', '郭树清', '前银保监会主席', '经济', ['china'], BJ[0], BJ[1], '前银保监会主席，金融监管改革推手。', { since: 2017, birthYear: 1956, nationality: '中国' }),
  person('per-cn-94', '易会满', '前证监会主席', '经济', ['china'], BJ[0], BJ[1], '前证监会主席，曾掌管工商银行。', { since: 2019, birthYear: 1964, nationality: '中国' }),
  person('per-cn-95', '吴清', '证监会主席', '经济', ['china'], BJ[0], BJ[1], '现任证监会主席，金融监管背景。', { since: 2024, birthYear: 1965, nationality: '中国' }),
  person('per-cn-96', '朱鹤新', '国家外汇管理局局长', '经济', ['china'], BJ[0], BJ[1], '外汇管理局局长，主管外汇储备。', { since: 2023, birthYear: 1968, nationality: '中国' }),

  // ── 中国新能源与硬科技企业家 ──
  person('per-cn-97', '雷军', '小米集团创始人', '经济', ['china'], BJ[0], BJ[1], '小米与汽车跨界。（合并条目）', { since: 2010, birthYear: 1969, nationality: '中国', wikipedia: 'https://zh.wikipedia.org/wiki/雷军' }),
  person('per-cn-98', '李斌', '蔚来汽车创始人', '经济', ['china'], SH[0], SH[1], '蔚来汽车创始人，中国造车新势力代表。', { since: 2014, birthYear: 1974, nationality: '中国', wikipedia: 'https://zh.wikipedia.org/wiki/李斌_(企业家)' }),
  person('per-cn-99', '何小鹏', '小鹏汽车创始人', '经济', ['china'], 113.27, 23.13, '小鹏汽车创始人，智能电动车与自动驾驶。', { since: 2014, birthYear: 1977, nationality: '中国' }),
  person('per-cn-100', '李想', '理想汽车创始人', '经济', ['china'], BJ[0], BJ[1], '理想汽车创始人，增程式电动车代表。', { since: 2015, birthYear: 1981, nationality: '中国' }),
  person('per-cn-101', '余承东', '华为消费者业务 CEO', '经济', ['china'], SZ[0], SZ[1], '华为终端 BG CEO，Mate 与鸿蒙操盘手。', { since: 2011, birthYear: 1969, nationality: '中国', wikipedia: 'https://zh.wikipedia.org/wiki/余承东' }),
  person('per-cn-102', '徐直军', '华为轮值董事长', '经济', ['china'], SZ[0], SZ[1], '华为轮值董事长，战略与技术主管。', { since: 2011, birthYear: 1968, nationality: '中国' }),
  person('per-cn-103', '梁建章', '携程创始人、人口学者', '经济', ['china'], SH[0], SH[1], '携程联合创始人，呼吁生育政策放开。', { since: 1999, birthYear: 1969, nationality: '中国', wikipedia: 'https://zh.wikipedia.org/wiki/梁建章' }),
  person('per-cn-104', '汪滔', '大疆创始人', '经济', ['china'], SZ[0], SZ[1], '大疆创新创始人，全球消费级无人机霸主。', { since: 2006, birthYear: 1980, nationality: '中国', wikipedia: 'https://zh.wikipedia.org/wiki/汪滔' }),
  person('per-cn-105', '王兴', '美团创始人', '经济', ['china'], BJ[0], BJ[1], '美团创始人，本地生活与即时零售。', { since: 2010, birthYear: 1979, nationality: '中国', wikipedia: 'https://zh.wikipedia.org/wiki/王兴' }),
  person('per-cn-106', '程维', '滴滴出行创始人', '经济', ['china'], BJ[0], BJ[1], '滴滴出行创始人，网约车平台。', { since: 2012, birthYear: 1983, nationality: '中国', wikipedia: 'https://zh.wikipedia.org/wiki/程维' }),
  person('per-cn-107', '李国庆', '当当网创始人', '经济', ['china'], BJ[0], BJ[1], '当当网联合创始人。', { since: 1999, birthYear: 1964, nationality: '中国' }),
  person('per-cn-108', '周鸿祎', '360 公司创始人', '经济', ['china'], BJ[0], BJ[1], '360 安全科技创始人，网络安全与红衣教主。', { since: 2005, birthYear: 1970, nationality: '中国', wikipedia: 'https://zh.wikipedia.org/wiki/周鸿祎' }),
  person('per-cn-109', '张邦鑫', '好未来创始人', '经济', ['china'], BJ[0], BJ[1], '好未来（学而思）创始人，K12 教培巨头。', { since: 2003, birthYear: 1980, nationality: '中国' }),
  person('per-cn-110', '梁汝波', '字节跳动 CEO', '经济', ['china'], BJ[0], BJ[1], '字节跳动 CEO，张一鸣联合创始人。', { since: 2021, birthYear: 1981, nationality: '中国' }),
  person('per-cn-111', '陈睿', '哔哩哔哩董事长', '经济', ['china'], SH[0], SH[1], 'B 站董事长兼 CEO，Z 世代社区。', { since: 2010, birthYear: 1978, nationality: '中国', wikipedia: 'https://zh.wikipedia.org/wiki/陈睿_(企业家)' }),
  person('per-cn-112', '王小川', '百川智能创始人', '经济', ['china'], BJ[0], BJ[1], '前搜狗 CEO，现创立百川智能做中国大模型。', { since: 2023, birthYear: 1978, nationality: '中国', wikipedia: 'https://zh.wikipedia.org/wiki/王小川' }),

  // ── 中国科学与工程院院士 ──
  person('per-cn-113', '潘建伟', '量子物理学家', '文化', ['china'], 117.27, 31.86, '中国量子通信与量子计算领军人物，中科大常务副校长。', { since: 2001, birthYear: 1970, nationality: '中国', wikipedia: 'https://zh.wikipedia.org/wiki/潘建伟' }),
  person('per-cn-114', '施一公', '结构生物学家', '文化', ['china'], 120.16, 30.27, '西湖大学校长，前清华副校长，结构生物学权威。', { since: 2008, birthYear: 1967, nationality: '中国', wikipedia: 'https://zh.wikipedia.org/wiki/施一公' }),
  person('per-cn-115', '薛其坤', '凝聚态物理学家', '文化', ['china'], SZ[0], SZ[1], '南方科技大学校长，量子反常霍尔效应发现者。', { since: 2024, birthYear: 1962, nationality: '中国', wikipedia: 'https://zh.wikipedia.org/wiki/薛其坤' }),
  person('per-cn-116', '高福', '病毒学家', '社会', ['china'], BJ[0], BJ[1], '前中国疾控中心主任，新冠疫情初期核心专家。', { since: 2017, birthYear: 1961, nationality: '中国', wikipedia: 'https://zh.wikipedia.org/wiki/高福' }),
  person('per-cn-117', '颜宁', '结构生物学家', '文化', ['china'], SZ[0], SZ[1], '深圳医学科学院院长，普林斯顿终身教授。', { since: 2022, birthYear: 1977, nationality: '中国', wikipedia: 'https://zh.wikipedia.org/wiki/颜宁' }),
  person('per-cn-118', '陈薇', '生物医学专家', '社会', ['china'], BJ[0], BJ[1], '军事医学专家，新冠疫苗（腺病毒载体）研发领军者。', { since: 2020, birthYear: 1966, nationality: '中国', wikipedia: 'https://zh.wikipedia.org/wiki/陈薇_(医学家)' }),
  person('per-cn-119', '南仁东', '天文学家', '社会', ['china'], 107.97, 25.65, 'FAST「中国天眼」首席科学家、总工程师，2017 年逝世。', { since: 1994, birthYear: 1945, deathYear: 2017, status: 'deceased', nationality: '中国', wikipedia: 'https://zh.wikipedia.org/wiki/南仁东' }),
  person('per-cn-120', '常进', '天体物理学家', '文化', ['china'], 120.16, 30.27, '中国科学技术大学校长，「悟空号」暗物质卫星首席。', { since: 2024, birthYear: 1966, nationality: '中国' }),
  person('per-cn-121', '白春礼', '化学家、纳米科技', '文化', ['china'], BJ[0], BJ[1], '前中国科学院院长，纳米科技领域权威。', { since: 2011, birthYear: 1953, nationality: '中国', wikipedia: 'https://zh.wikipedia.org/wiki/白春礼' }),
  person('per-cn-122', '丘成桐', '数学家', '文化', ['china'], BJ[0], BJ[1], '菲尔兹奖得主，清华大学求真书院院长。（合并条目）', { since: 1980, birthYear: 1949, nationality: '中国/美国', wikipedia: 'https://zh.wikipedia.org/wiki/丘成桐' }),
  person('per-cn-123', '姚期智', '计算机科学家', '文化', ['china'], BJ[0], BJ[1], '图灵奖得主，清华大学「姚班」创立者。', { since: 2004, birthYear: 1946, nationality: '中国/美国', wikipedia: 'https://zh.wikipedia.org/wiki/姚期智' }),
  person('per-cn-124', '杨振宁', '物理学家', '文化', ['china'], BJ[0], BJ[1], '诺贝尔物理学奖得主，杨-米尔斯理论奠基人。（合并条目）', { since: 1957, birthYear: 1922, nationality: '中国/美国', wikipedia: 'https://zh.wikipedia.org/wiki/杨振宁' }),
  person('per-cn-125', '张益唐', '数学家', '文化', ['china'], BJ[0], BJ[1], '孪生素数猜想突破者，北大客座教授。', { since: 2013, birthYear: 1955, nationality: '中国/美国', wikipedia: 'https://zh.wikipedia.org/wiki/张益唐' }),

  // ── 中国航天 ──
  person('per-cn-126', '叶光富', '航天员', '文化', ['china'], BJ[0], BJ[1], '神舟十五号航天员乘组，执行中国空间站任务。', { since: 2022, birthYear: 1980, nationality: '中国', wikipedia: 'https://zh.wikipedia.org/wiki/叶光富' }),
  person('per-cn-127', '王亚平', '航天员', '文化', ['china'], BJ[0], BJ[1], '中国首位实施出舱活动的女航天员。', { since: 2013, birthYear: 1980, nationality: '中国', wikipedia: 'https://zh.wikipedia.org/wiki/王亚平' }),
  person('per-cn-128', '陈冬', '航天员', '文化', ['china'], BJ[0], BJ[1], '神舟十四号指令长。', { since: 2016, birthYear: 1978, nationality: '中国' }),
  person('per-cn-129', '吴伟仁', '航天测控通信专家', '文化', ['china'], BJ[0], BJ[1], '中国探月工程总设计师。', { since: 2007, birthYear: 1953, nationality: '中国', wikipedia: 'https://zh.wikipedia.org/wiki/吴伟仁' }),
  person('per-cn-130', '张荣桥', '深空探测专家', '文化', ['china'], BJ[0], BJ[1], '中国首次火星探测任务「天问一号」总设计师。', { since: 2020, birthYear: 1966, nationality: '中国', wikipedia: 'https://zh.wikipedia.org/wiki/张荣桥' }),

  // ── 中国社会与学者 ──
  person('per-cn-22', '钟南山', '呼吸病学专家', '社会', ['china'], 113.26, 23.13, '公共卫生权威，在新冠疫情防治中发挥关键作用。', { since: 2003, birthYear: 1936, nationality: '中国', wikipedia: 'https://zh.wikipedia.org/wiki/钟南山' }),
  person('per-cn-60', '袁隆平', '杂交水稻之父', '社会', ['china'], 113.13, 28.20, '中国杂交水稻奠基人，2021年逝世。', { since: 1974, birthYear: 1930, deathYear: 2021, status: 'deceased', nationality: '中国', wikipedia: 'https://zh.wikipedia.org/wiki/袁隆平' }),
  person('per-cn-61', '屠呦呦', '药学家', '社会', ['china'], BJ[0], BJ[1], '青蒿素发现者，诺贝尔生理学或医学奖得主。', { since: 1972, birthYear: 1930, nationality: '中国', wikipedia: 'https://zh.wikipedia.org/wiki/屠呦呦' }),

  // ── 中国文化与媒体 ──
  person('per-cn-20', '莫言', '诺贝尔文学奖得主', '文化', ['china'], 119.16, 36.71, '中国当代文学代表人物。', { since: 2012, birthYear: 1955, nationality: '中国', wikipedia: 'https://zh.wikipedia.org/wiki/莫言' }),
  person('per-cn-21', '张艺谋', '电影导演', '文化', ['china'], BJ[0], BJ[1], '国际知名导演，奥运开闭幕式总导演。', { since: 1980, birthYear: 1950, nationality: '中国', wikipedia: 'https://zh.wikipedia.org/wiki/张艺谋' }),
  person('per-cn-62', '刘慈欣', '科幻作家', '文化', ['china'], 113.56, 36.07, '《三体》作者，雨果奖得主。', { since: 2006, birthYear: 1963, nationality: '中国', wikipedia: 'https://zh.wikipedia.org/wiki/刘慈欣' }),
  person('per-cn-31', '刘德华', '演员、歌手', '文化', ['china'], HK[0], HK[1], '华语娱乐圈跨时代偶像。', { since: 1981, birthYear: 1961, nationality: '中国', wikipedia: 'https://zh.wikipedia.org/wiki/刘德华' }),
  person('per-cn-63', '成龙', '演员', '文化', ['china'], HK[0], HK[1], '国际功夫巨星。', { since: 1970, birthYear: 1954, nationality: '中国' }),
  person('per-cn-64', '姚明', '前篮球运动员', '文化', ['china'], BJ[0], BJ[1], '中国篮球协会主席。', { since: 2002, birthYear: 1980, nationality: '中国', wikipedia: 'https://zh.wikipedia.org/wiki/姚明' }),
  person('per-cn-65', '谷爱凌', '自由式滑雪运动员', '文化', ['china'], BJ[0], BJ[1], '奥运金牌得主。', { since: 2019, birthYear: 2003, nationality: '中国', wikipedia: 'https://zh.wikipedia.org/wiki/谷爱凌' }),

  // ── 中国台湾 ──
  person('per-cn-8', '赖清德', '台湾地区领导人', '政治', ['china'], TW[0], TW[1], '民进党籍领导人，强调台湾主体性与防务强化。', { since: 2024, birthYear: 1959, nationality: '中国台湾', wikipedia: 'https://zh.wikipedia.org/wiki/赖清德' }),
  person('per-cn-9', '萧美琴', '台湾地区副领导人', '政治', ['china'], TW[0], TW[1], '曾任驻美代表，负责对美沟通与两岸议题。', { since: 2024, birthYear: 1971, nationality: '中国台湾' }),
  person('per-cn-66', '蔡英文', '台湾地区前领导人', '政治', ['china'], TW[0], TW[1], '台湾地区首位女性领导人。', { since: 2016, birthYear: 1956, nationality: '中国台湾', wikipedia: 'https://zh.wikipedia.org/wiki/蔡英文' }),

  // ── 香港 ──
  person('per-cn-17', '李家超', '香港特别行政区行政长官', '政治', ['china'], HK[0], HK[1], '香港特区首长，负责国安法下治理与经济发展。', { since: 2022, birthYear: 1957, nationality: '中国', wikipedia: 'https://zh.wikipedia.org/wiki/李家超' }),
  person('per-cn-67', '李嘉诚', '长和系创始人', '经济', ['china'], HK[0], HK[1], '香港首富，全球投资大亨。', { since: 1950, birthYear: 1928, nationality: '中国香港', netWorthUsd: 35_000_000_000, wikipedia: 'https://zh.wikipedia.org/wiki/李嘉诚' }),

  // ── 周边国家相关 ──
  person('per-cn-13', '金正恩', '朝鲜劳动党总书记', '政治', ['china'], 125.75, 39.02, '朝鲜最高领导人，推进核导能力与俄朝关系。', { since: 2011, birthYear: 1984, nationality: '朝鲜', wikipedia: 'https://zh.wikipedia.org/wiki/金正恩' }),
  person('per-cn-131', '李雪主', '朝鲜第一夫人', '政治', ['china'], 125.75, 39.02, '金正恩夫人，朝鲜公开活动中的形象代言人。', { nationality: '朝鲜' }),
  person('per-cn-132', '崔龙海', '朝鲜最高人民会议常任委员会委员长', '政治', ['china'], 125.75, 39.02, '朝鲜名义国家元首。', { since: 2019, nationality: '朝鲜' }),

  // ── 中国前领导人（历史人物）──
  person('per-cn-133', '胡锦涛', '前中共中央总书记', '政治', ['china'], BJ[0], BJ[1], '中国第四代领导核心（2002-2012），「科学发展观」提出者。', { since: 2002, birthYear: 1942, status: 'restricted', nationality: '中国', wikipedia: 'https://zh.wikipedia.org/wiki/胡锦涛' }),
  person('per-cn-134', '温家宝', '前国务院总理', '政治', ['china'], BJ[0], BJ[1], '前总理（2003-2013），推动民生与卫生改革。', { since: 2003, birthYear: 1942, status: 'restricted', nationality: '中国', wikipedia: 'https://zh.wikipedia.org/wiki/温家宝' }),
  person('per-cn-135', '江泽民', '前中共中央总书记', '政治', ['china'], BJ[0], BJ[1], '第三代领导核心，任内加入 WTO，2022 年逝世。', { since: 1989, birthYear: 1926, deathYear: 2022, status: 'deceased', nationality: '中国', wikipedia: 'https://zh.wikipedia.org/wiki/江泽民' }),
  person('per-cn-136', '朱镕基', '前国务院总理', '政治', ['china'], BJ[0], BJ[1], '前总理（1998-2003），主导国企改革与入世谈判。', { since: 1998, birthYear: 1928, status: 'restricted', nationality: '中国', wikipedia: 'https://zh.wikipedia.org/wiki/朱镕基' }),
  person('per-cn-137', '邓小平', '改革开放总设计师', '政治', ['china'], BJ[0], BJ[1], '改革开放总设计师（1978-1992），1997 年逝世。', { since: 1978, birthYear: 1904, deathYear: 1997, status: 'deceased', nationality: '中国', wikipedia: 'https://zh.wikipedia.org/wiki/邓小平' }),
  person('per-cn-138', '毛泽东', '中华人民共和国缔造者', '政治', ['china'], BJ[0], BJ[1], '中共与新中国主要缔造者，1976 年逝世。', { since: 1949, birthYear: 1893, deathYear: 1976, status: 'deceased', nationality: '中国', wikipedia: 'https://zh.wikipedia.org/wiki/毛泽东' }),
  person('per-cn-139', '周恩来', '前国务院总理', '政治', ['china'], BJ[0], BJ[1], '首任总理（1949-1976），外交奠基人，1976 年逝世。', { since: 1949, birthYear: 1898, deathYear: 1976, status: 'deceased', nationality: '中国', wikipedia: 'https://zh.wikipedia.org/wiki/周恩来' }),

  // ── 中国文化与体育（扩展）──
  person('per-cn-140', '郎平', '前女排运动员、教练', '文化', ['china'], BJ[0], BJ[1], '「铁榔头」，中国女排精神代表，率队夺奥运金牌。', { since: 1981, birthYear: 1960, nationality: '中国', wikipedia: 'https://zh.wikipedia.org/wiki/郎平' }),
  person('per-cn-141', '刘翔', '前跨栏运动员', '文化', ['china'], SH[0], SH[1], '110 米栏奥运冠军，亚洲田径标志性人物。', { since: 2004, birthYear: 1983, nationality: '中国', wikipedia: 'https://zh.wikipedia.org/wiki/刘翔' }),
  person('per-cn-142', '苏炳添', '短跑运动员', '文化', ['china'], 113.26, 23.13, '亚洲百米飞人，首位闯入奥运百米决赛的中国人。', { since: 2015, birthYear: 1989, nationality: '中国', wikipedia: 'https://zh.wikipedia.org/wiki/苏炳添' }),
  person('per-cn-143', '马龙', '乒乓球运动员', '文化', ['china'], BJ[0], BJ[1], '乒坛 GOAT，双圈大满贯得主。', { since: 2010, birthYear: 1988, nationality: '中国', wikipedia: 'https://zh.wikipedia.org/wiki/马龙' }),
  person('per-cn-144', '全红婵', '跳水运动员', '文化', ['china'], 113.71, 22.58, '东京/巴黎奥运跳水金牌得主，满分传奇。', { since: 2021, birthYear: 2007, nationality: '中国', wikipedia: 'https://zh.wikipedia.org/wiki/全红婵' }),
  person('per-cn-145', '潘展乐', '游泳运动员', '文化', ['china'], 120.16, 30.27, '巴黎奥运男子 100 米自由泳金牌，破世界纪录。', { since: 2024, birthYear: 2004, nationality: '中国', wikipedia: 'https://zh.wikipedia.org/wiki/潘展乐' }),
  person('per-cn-146', '郑钦文', '网球运动员', '文化', ['china'], 114.30, 30.59, '巴黎奥运网球女单金牌，首位亚洲奥运女单冠军。', { since: 2022, birthYear: 2002, nationality: '中国', wikipedia: 'https://zh.wikipedia.org/wiki/郑钦文' }),
  person('per-cn-147', '樊振东', '乒乓球运动员', '文化', ['china'], BJ[0], BJ[1], '巴黎奥运男单金牌，大满贯得主。', { since: 2015, birthYear: 1997, nationality: '中国', wikipedia: 'https://zh.wikipedia.org/wiki/樊振东' }),
  person('per-cn-148', '李娜', '前网球运动员', '文化', ['china'], 114.30, 30.59, '两座大满贯得主，亚洲网球先驱。', { since: 2011, birthYear: 1982, nationality: '中国', wikipedia: 'https://zh.wikipedia.org/wiki/李娜_(网球运动员)' }),
  person('per-cn-149', '樊锦诗', '敦煌研究院名誉院长', '文化', ['china'], 94.66, 40.14, '「敦煌女儿」，毕生守护莫高窟文化遗产。', { since: 1963, birthYear: 1938, nationality: '中国', wikipedia: 'https://zh.wikipedia.org/wiki/樊锦诗' }),
  person('per-cn-150', '王澍', '建筑师', '文化', ['china'], 120.16, 30.27, '普利兹克建筑奖得主，中国本土建筑代表。', { since: 2012, birthYear: 1963, nationality: '中国', wikipedia: 'https://zh.wikipedia.org/wiki/王澍_(建筑师)' }),
  person('per-cn-151', '郎朗', '钢琴家', '文化', ['china'], SH[0], SH[1], '国际顶级钢琴演奏家。', { since: 1999, birthYear: 1982, nationality: '中国', wikipedia: 'https://zh.wikipedia.org/wiki/郎朗' }),
  person('per-cn-152', '韩红', '歌手、慈善家', '文化', ['china'], BJ[0], BJ[1], '藏族歌手，韩红爱心慈善基金会发起人。', { since: 1995, birthYear: 1971, nationality: '中国' }),
  person('per-cn-153', '周杰伦', '歌手、导演', '文化', ['china'], TW[0], TW[1], '华语流行音乐天王，跨世代文化符号。', { since: 2000, birthYear: 1979, nationality: '中国台湾', wikipedia: 'https://zh.wikipedia.org/wiki/周杰伦' }),
  person('per-cn-154', '宫崎骏（在华影响）', '动画导演（跨区）', '文化', ['china'], SH[0], SH[1], '吉卜力作品在中国影迷众多。（合并条目）', { since: 1985, birthYear: 1941, nationality: '日本' }),

  // ── 中国经济学家与公共知识分子 ──
  person('per-cn-155', '张维迎', '经济学家', '经济', ['china'], BJ[0], BJ[1], '北大教授，市场派经济学家代表。', { since: 1990, birthYear: 1959, nationality: '中国', wikipedia: 'https://zh.wikipedia.org/wiki/张维迎' }),
  person('per-cn-156', '许小年', '经济学家', '经济', ['china'], SH[0], SH[1], '中欧国际工商学院教授，市场派观点鲜明。', { since: 2000, birthYear: 1953, nationality: '中国' }),
  person('per-cn-157', '樊纲', '经济学家', '经济', ['china'], BJ[0], BJ[1], '国民经济研究所所长，体制改革研究。', { since: 1990, birthYear: 1953, nationality: '中国' }),
  person('per-cn-158', '李稻葵', '经济学家', '经济', ['china'], BJ[0], BJ[1], '清华苏世民书院院长，宏观经济研究。', { since: 2010, birthYear: 1963, nationality: '中国' }),
  person('per-cn-159', '温铁军', '三农问题专家', '社会', ['china'], BJ[0], BJ[1], '三农问题研究学者，关注农村发展。', { since: 1990, birthYear: 1951, nationality: '中国', wikipedia: 'https://zh.wikipedia.org/wiki/温铁军' }),
  person('per-cn-160', '郑永年', '政治学家', '文化', ['china'], SZ[0], SZ[1], '香港中文大学（深圳）教授，中国政治研究。', { since: 2010, birthYear: 1962, nationality: '中国', wikipedia: 'https://zh.wikipedia.org/wiki/郑永年' }),
  person('per-cn-161', '金灿荣', '国际关系学者', '文化', ['china'], BJ[0], BJ[1], '人民大学教授，中美关系与公共外交。', { since: 1990, birthYear: 1962, nationality: '中国' }),
  person('per-cn-162', '张维为', '政治学家', '文化', ['china'], SH[0], SH[1], '复旦中国研究院院长，「中国模式」论述代表。', { since: 2010, birthYear: 1957, nationality: '中国', wikipedia: 'https://zh.wikipedia.org/wiki/张维为' }),
  person('per-cn-163', '阎学通', '国际关系学者', '文化', ['china'], BJ[0], BJ[1], '清华国际关系研究院院长，道义现实主义理论。', { since: 1990, birthYear: 1952, nationality: '中国' }),

  // ── 中国异议人士与社会 ──
  person('per-cn-164', '艾未未', '艺术家、活动家', '社会', ['china'], BJ[0], BJ[1], '当代艺术家与人权活动家，现流亡海外。', { since: 2008, birthYear: 1957, status: 'restricted', nationality: '中国', wikipedia: 'https://zh.wikipedia.org/wiki/艾未未' }),
];
