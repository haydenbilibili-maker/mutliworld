import { person } from './helpers';

const BJ = [116.40, 39.90] as const;
const SH = [121.47, 31.23] as const;
const TW = [121.56, 25.03] as const;
const HK = [114.17, 22.32] as const;
const SEOUL = [126.98, 37.57] as const;
const TOKYO = [139.69, 35.69] as const;
const SCS = [112.50, 16.50] as const;

/** 中国及周边区域人物 */
export const CHINA_PERSONS = [
  person('per-cn-1', '习近平', '中共中央总书记、国家主席', '政治', ['china'], BJ[0], BJ[1], '中国最高领导人，统筹发展与安全、推进中国式现代化。', { since: 2012, wikipedia: 'https://zh.wikipedia.org/wiki/习近平' }),
  person('per-cn-2', '李强', '国务院总理', '政治', ['china'], BJ[0], BJ[1], '国务院首脑，负责宏观经济调控与民生政策执行。', { since: 2023, wikipedia: 'https://zh.wikipedia.org/wiki/李强' }),
  person('per-cn-3', '王毅', '外交部长', '政治', ['china'], BJ[0], BJ[1], '中国首席外交官，主持中美、中欧及多边外交。', { since: 2023, wikipedia: 'https://zh.wikipedia.org/wiki/王毅' }),
  person('per-cn-4', '何立峰', '国务院副总理', '经济', ['china'], BJ[0], BJ[1], '分管金融与经贸，协调房地产与地方债务风险化解。', { since: 2023, wikipedia: 'https://zh.wikipedia.org/wiki/何立峰' }),
  person('per-cn-5', '潘功胜', '中国人民银行行长', '经济', ['china'], BJ[0], BJ[1], '货币政策制定者，管理人民币汇率与金融稳定。', { since: 2023, wikipedia: 'https://zh.wikipedia.org/wiki/潘功胜' }),
  person('per-cn-6', '张又侠', '中央军委副主席', '军事', ['china'], BJ[0], BJ[1], '军队高级将领，参与国防与军队现代化决策。', { since: 2017 }),
  person('per-cn-7', '董军', '国防部长', '军事', ['china'], BJ[0], BJ[1], '负责国防事务对外沟通与军事外交。', { since: 2023 }),
  person('per-cn-8', '赖清德', '台湾地区领导人', '政治', ['china'], TW[0], TW[1], '民进党籍领导人，强调台湾主体性与防务强化。', { since: 2024, wikipedia: 'https://zh.wikipedia.org/wiki/赖清德' }),
  person('per-cn-9', '萧美琴', '台湾地区副领导人', '政治', ['china'], TW[0], TW[1], '曾任驻美代表，负责对美沟通与两岸议题。', { since: 2024 }),
  person('per-cn-10', '石破茂', '日本首相', '政治', ['china', 'asia_pacific'], TOKYO[0], TOKYO[1], '日本内阁首脑，推进日美同盟与对华经贸关系。', { since: 2024 }),
  person('per-cn-11', '岸田文雄', '日本前首相', '政治', ['china'], TOKYO[0], TOKYO[1], '任内强化防卫预算与对华「战略互惠」框架。', { since: 2021, status: 'restricted', wikipedia: 'https://zh.wikipedia.org/wiki/岸田文雄' }),
  person('per-cn-12', '李在明', '韩国总统', '政治', ['china', 'asia_pacific'], SEOUL[0], SEOUL[1], '韩国最高行政长官，主张对朝对话与对华合作。', { since: 2025 }),
  person('per-cn-13', '金正恩', '朝鲜劳动党总书记', '政治', ['china'], 125.75, 39.02, '朝鲜最高领导人，推进核导能力与俄朝关系。', { since: 2011, wikipedia: 'https://zh.wikipedia.org/wiki/金正恩' }),
  person('per-cn-14', '小马科斯', '菲律宾总统', '政治', ['china', 'southeast_asia'], 120.98, 14.60, '菲律宾领导人，在南海议题上寻求美菲同盟支持。', { since: 2022 }),
  person('per-cn-15', '普拉博沃·苏比安托', '印尼总统', '政治', ['china', 'southeast_asia'], 106.85, -6.21, '印尼新任总统，延续不结盟与东盟中心立场。', { since: 2024 }),
  person('per-cn-16', '洪玛奈', '柬埔寨首相', '政治', ['china', 'southeast_asia'], 104.92, 11.56, '柬埔寨领导人，与中国在基建与军事合作密切。', { since: 2023 }),
  person('per-cn-17', '李家超', '香港特别行政区行政长官', '政治', ['china'], HK[0], HK[1], '香港特区首长，负责国安法下治理与经济发展。', { since: 2022, wikipedia: 'https://zh.wikipedia.org/wiki/李家超' }),
  person('per-cn-18', '贺一诚', '澳门特别行政区行政长官', '政治', ['china'], 113.54, 22.20, '澳门特区首长，推动博彩业转型与横琴合作。', { since: 2019 }),
  person('per-cn-19', '任正非', '华为创始人', '经济', ['china'], SH[0], SH[1], '中国科技企业家，领导华为在通信与芯片领域攻关。', { since: 1987, wikipedia: 'https://zh.wikipedia.org/wiki/任正非' }),
  person('per-cn-20', '莫言', '诺贝尔文学奖得主', '文化', ['china'], 119.16, 36.71, '中国当代文学代表人物，作品具有世界影响力。', { since: 2012, wikipedia: 'https://zh.wikipedia.org/wiki/莫言' }),
  person('per-cn-21', '张艺谋', '电影导演', '文化', ['china'], BJ[0], BJ[1], '国际知名导演，主导重大文化活动与影视创作。', { since: 1980, wikipedia: 'https://zh.wikipedia.org/wiki/张艺谋' }),
  person('per-cn-22', '钟南山', '呼吸病学专家', '社会', ['china'], 113.26, 23.13, '公共卫生权威，在新冠疫情防治中发挥关键作用。', { since: 2003, wikipedia: 'https://zh.wikipedia.org/wiki/钟南山' }),
  person('per-cn-23', '王沪宁', '全国政协主席', '政治', ['china'], BJ[0], BJ[1], '分管统战与政协工作，参与意识形态与对台政策。', { since: 2023 }),
  person('per-cn-24', '吴谦', '国防部新闻发言人', '军事', ['china'], BJ[0], BJ[1], '军方对外发声渠道，就台海与南海议题发布信息。', { since: 2016 }),
  person('per-cn-25', '南部战区发言人', '南部战区', '军事', ['china'], SCS[0], SCS[1], '负责南海方向军事信息发布与维权行动说明。', { since: 2016 }),

  person('per-cn-26', '刘建超', '中央外办主任', '政治', ['china'], BJ[0], BJ[1], '负责对外联络与政党外交，协调中美联委会。', { since: 2023, wikipedia: 'https://zh.wikipedia.org/wiki/刘建超' }),
  person('per-cn-27', '丁薛祥', '国务院副总理', '政治', ['china'], BJ[0], BJ[1], '分管科技、环保与教育，推动新质生产力。', { since: 2023, wikipedia: 'https://zh.wikipedia.org/wiki/丁薛祥' }),
  person('per-cn-28', '马兴瑞', '新疆自治区党委书记', '政治', ['china'], 87.58, 43.83, '主管新疆工作，推进向西开放与反恐维稳。', { since: 2021 }),
  person('per-cn-29', '李书福', '吉利集团创始人', '经济', ['china'], 120.21, 30.30, '中国汽车出海领军者，收购沃尔沃、入股奔驰。', { since: 1986, wikipedia: 'https://zh.wikipedia.org/wiki/李书福' }),
  person('per-cn-30', '雷军', '小米集团创始人', '经济', ['china'], 116.40, 39.90, '科技企业家，跨界手机、智能家居与电动车。', { since: 2010, wikipedia: 'https://zh.wikipedia.org/wiki/雷军' }),
  person('per-cn-31', '刘德华', '演员、歌手', '文化', ['china'], HK[0], HK[1], '华语娱乐圈跨时代偶像，涉猎影视、音乐与公益。', { since: 1981, wikipedia: 'https://zh.wikipedia.org/wiki/刘德华' }),
  person('per-cn-32', '陈薇', '生物工程院士', '社会', ['china'], 116.40, 39.90, '中国疫苗研发领军科学家，康希诺新冠疫苗发明者。', { since: 2003, wikipedia: 'https://zh.wikipedia.org/wiki/陈薇' }),
];
