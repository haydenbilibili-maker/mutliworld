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

  // ── 中国军队 ──
  person('per-cn-6', '张又侠', '中央军委副主席', '军事', ['china'], BJ[0], BJ[1], '军队高级将领，参与国防与军队现代化决策。', { since: 2017, birthYear: 1950, nationality: '中国' }),
  person('per-cn-7', '董军', '国防部长', '军事', ['china'], BJ[0], BJ[1], '负责国防事务对外沟通与军事外交。', { since: 2023, birthYear: 1961, nationality: '中国' }),
  person('per-cn-45', '刘振立', '联合参谋部参谋长', '军事', ['china'], BJ[0], BJ[1], '军队联合作战指挥负责人。', { since: 2022, nationality: '中国' }),
  person('per-cn-24', '吴谦', '国防部新闻发言人', '军事', ['china'], BJ[0], BJ[1], '军方对外发声渠道，就台海与南海议题发布信息。', { since: 2016, nationality: '中国' }),

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
];
