import { person } from './helpers';

const TOKYO = [139.69, 35.69] as const;
const SEOUL = [126.98, 37.57] as const;
const CANBERRA = [149.13, -35.28] as const;
const WELLINGTON = [174.78, -41.29] as const;
const DELHI = [77.21, 28.61] as const;
const MUMBAI = [72.88, 19.08] as const;

/** 亚太区域人物（日韩印澳新及南亚） */
export const ASIA_PACIFIC_PERSONS = [
  // ── 日本 ──
  person('per-ap-1', '石破茂', '日本首相', '政治', ['asia_pacific'], TOKYO[0], TOKYO[1], '日本内阁首脑，强化日美同盟与对华经贸。', { since: 2024, birthYear: 1957, nationality: '日本', wikipedia: 'https://zh.wikipedia.org/wiki/石破茂' }),
  person('per-ap-8', '岸田文雄', '日本前首相', '政治', ['asia_pacific'], TOKYO[0], TOKYO[1], '任内将防卫预算提升至 GDP 2% 目标。', { status: 'restricted', birthYear: 1957, nationality: '日本', wikipedia: 'https://zh.wikipedia.org/wiki/岸田文雄' }),
  person('per-ap-6', '安倍晋三', '日本前首相', '政治', ['asia_pacific'], TOKYO[0], TOKYO[1], '2022 年遇刺，任内推动印太经济框架与安保法制。', { birthYear: 1954, deathYear: 2022, status: 'deceased', nationality: '日本', wikipedia: 'https://zh.wikipedia.org/wiki/安倍晋三' }),
  person('per-ap-31', '菅义伟', '日本前首相', '政治', ['asia_pacific'], TOKYO[0], TOKYO[1], '前首相，推动数字化改革与奥运举办。', { since: 2020, birthYear: 1948, nationality: '日本' }),
  person('per-ap-7', '小泉进次郎', '日本自民党政调会长', '政治', ['asia_pacific'], TOKYO[0], TOKYO[1], '年轻政治明星，关注气候与能源政策。', { since: 2024, birthYear: 1981, nationality: '日本' }),
  person('per-ap-32', '林芳正', '日本内阁官房长官', '政治', ['asia_pacific'], TOKYO[0], TOKYO[1], '政府最高发言人。', { since: 2023, nationality: '日本' }),
  person('per-ap-33', '上川阳子', '日本外相', '政治', ['asia_pacific'], TOKYO[0], TOKYO[1], '外务大臣。', { since: 2023, birthYear: 1953, nationality: '日本' }),
  person('per-ap-34', '植田和男', '日本银行行长', '经济', ['asia_pacific'], TOKYO[0], TOKYO[1], '央行行长，推动货币政策正常化。', { since: 2023, birthYear: 1951, nationality: '日本', wikipedia: 'https://zh.wikipedia.org/wiki/植田和男' }),
  person('per-ap-35', '孙正义', '软银集团创始人', '经济', ['asia_pacific'], TOKYO[0], TOKYO[1], '科技投资巨头，Vision Fund 影响全球创投。', { since: 1981, birthYear: 1957, nationality: '日本', netWorthUsd: 25_000_000_000, wikipedia: 'https://zh.wikipedia.org/wiki/孙正义' }),
  person('per-ap-36', '柳井正', '优衣库创始人', '经济', ['asia_pacific'], TOKYO[0], TOKYO[1], '迅销集团创始人，日本首富级企业家。', { since: 1984, birthYear: 1949, nationality: '日本' }),
  person('per-ap-37', '丰田章男', '丰田汽车会长', '经济', ['asia_pacific'], 136.91, 35.17, '丰田汽车前 CEO。', { since: 2023, birthYear: 1956, nationality: '日本' }),
  person('per-ap-17', '宫崎骏', '动画导演', '文化', ['asia_pacific'], TOKYO[0], TOKYO[1], '吉卜力工作室创始人，《千与千寻》等作品享誉世界。', { birthYear: 1941, nationality: '日本', wikipedia: 'https://zh.wikipedia.org/wiki/宫崎骏' }),
  person('per-ap-38', '村上春树', '作家', '文化', ['asia_pacific'], TOKYO[0], TOKYO[1], '国际知名作家，屡获诺贝尔奖提名。', { birthYear: 1949, nationality: '日本', wikipedia: 'https://zh.wikipedia.org/wiki/村上春树' }),

  // ── 韩国的 ──
  person('per-ap-2', '李在明', '韩国总统', '政治', ['asia_pacific'], SEOUL[0], SEOUL[1], '韩国领导人，主张对朝对话与区域经济合作。', { since: 2025, birthYear: 1964, nationality: '韩国', wikipedia: 'https://zh.wikipedia.org/wiki/李在明' }),
  person('per-ap-9', '尹锡悦', '韩国前总统', '政治', ['asia_pacific'], SEOUL[0], SEOUL[1], '任内强化美韩同盟与日韩和解。', { status: 'restricted', birthYear: 1960, nationality: '韩国', wikipedia: 'https://zh.wikipedia.org/wiki/尹锡悦' }),
  person('per-ap-30', '朴槿惠', '韩国前总统', '政治', ['asia_pacific'], SEOUL[0], SEOUL[1], '韩国首位女总统，2017 年遭弹劾。', { status: 'restricted', birthYear: 1952, nationality: '韩国', wikipedia: 'https://zh.wikipedia.org/wiki/朴槿惠' }),
  person('per-ap-39', '文在寅', '韩国前总统', '政治', ['asia_pacific'], SEOUL[0], SEOUL[1], '前总统，推动韩朝对话。', { since: 2017, birthYear: 1953, nationality: '韩国' }),
  person('per-ap-40', '韩悳洙', '韩国国务总理', '政治', ['asia_pacific'], SEOUL[0], SEOUL[1], '韩国总理。', { since: 2022, nationality: '韩国' }),
  person('per-ap-41', '赵兑烈', '韩国外长', '政治', ['asia_pacific'], SEOUL[0], SEOUL[1], '外交部长。', { since: 2024, nationality: '韩国' }),
  person('per-ap-42', '李昌镛', '韩国央行行长', '经济', ['asia_pacific'], SEOUL[0], SEOUL[1], '韩国银行行长。', { since: 2022, nationality: '韩国' }),
  person('per-ap-43', '李在镕', '三星电子会长', '经济', ['asia_pacific'], SEOUL[0], SEOUL[1], '三星集团实控人，全球半导体核心人物。', { since: 2022, birthYear: 1968, nationality: '韩国', wikipedia: 'https://zh.wikipedia.org/wiki/李在镕' }),
  person('per-ap-44', '具光谟', 'LG 集团会长', '经济', ['asia_pacific'], SEOUL[0], SEOUL[1], 'LG 集团会长。', { since: 2018, nationality: '韩国' }),
  person('per-ap-16', 'BTS', '韩国流行乐团', '文化', ['asia_pacific'], SEOUL[0], SEOUL[1], '全球 K-pop 现象，韩国软实力象征。', { since: 2013, nationality: '韩国' }),
  person('per-ap-45', '奉俊昊', '电影导演', '文化', ['asia_pacific'], SEOUL[0], SEOUL[1], '《寄生虫》奥斯卡最佳导演得主。', { since: 2000, birthYear: 1969, nationality: '韩国' }),
  person('per-ap-46', '李政宰', '演员', '文化', ['asia_pacific'], SEOUL[0], SEOUL[1], '《鱿鱼游戏》男主角。', { birthYear: 1972, nationality: '韩国' }),

  // ── 印度 ──
  person('per-ap-3', '纳伦德拉·莫迪', '印度总理', '政治', ['asia_pacific'], DELHI[0], DELHI[1], '印度人民党领袖，推动「印度制造」与印太战略。', { since: 2014, birthYear: 1950, nationality: '印度', wikipedia: 'https://zh.wikipedia.org/wiki/纳伦德拉·莫迪' }),
  person('per-ap-47', '拉杰纳特·辛格', '印度国防部长', '军事', ['asia_pacific'], DELHI[0], DELHI[1], '印军现代化与边境对峙议题发言人。', { since: 2019, birthYear: 1951, nationality: '印度' }),
  person('per-ap-10', '苏杰生', '印度外长', '政治', ['asia_pacific'], DELHI[0], DELHI[1], '印度多边外交核心，主持 G20 与金砖扩容。', { since: 2019, birthYear: 1955, nationality: '印度', wikipedia: 'https://zh.wikipedia.org/wiki/苏杰生' }),
  person('per-ap-27', '阿米特·沙赫', '印度内政部长', '政治', ['asia_pacific'], DELHI[0], DELHI[1], '莫迪核心幕僚，主管国家安全。', { since: 2019, birthYear: 1964, nationality: '印度', wikipedia: 'https://zh.wikipedia.org/wiki/阿米特·沙赫' }),
  person('per-ap-48', '拉胡尔·甘地', '印度国大党领袖', '政治', ['asia_pacific'], DELHI[0], DELHI[1], '尼赫鲁-甘地家族成员，印度主要反对党领导人。', { birthYear: 1970, nationality: '印度', wikipedia: 'https://zh.wikipedia.org/wiki/拉胡尔·甘地' }),
  person('per-ap-49', '沙克蒂坎塔·达斯', '印度央行行长', '经济', ['asia_pacific'], MUMBAI[0], MUMBAI[1], '印度储备银行行长。', { since: 2018, nationality: '印度' }),
  person('per-ap-50', '穆克什·安巴尼', '信实工业董事长', '经济', ['asia_pacific'], MUMBAI[0], MUMBAI[1], '印度首富，掌控能源与电信巨头。', { since: 2005, birthYear: 1957, nationality: '印度', netWorthUsd: 100_000_000_000, wikipedia: 'https://zh.wikipedia.org/wiki/穆克什·安巴尼' }),
  person('per-ap-51', '高塔姆·阿达尼', '阿达尼集团创始人', '经济', ['asia_pacific'], 72.57, 23.02, '印度港口、能源与基建巨头。', { since: 1988, birthYear: 1962, nationality: '印度', netWorthUsd: 80_000_000_000, wikipedia: 'https://zh.wikipedia.org/wiki/高塔姆·阿达尼' }),
  person('per-ap-52', '阿琼·马赫塔', '印度首富', '经济', ['asia_pacific'], MUMBAI[0], MUMBAI[1], '印度最大医药公司创始人。', { since: 1986, nationality: '印度' }),
  person('per-ap-53', '苏达·穆尔蒂', '印孚瑟斯基金会主席', '经济', ['asia_pacific'], 77.59, 12.97, '印度科技慈善家。', { nationality: '印度' }),
  person('per-ap-54', '纳拉亚纳·穆尔蒂', '印孚瑟斯创始人', '经济', ['asia_pacific'], 77.59, 12.97, 'IT 外包巨头奠基人。', { since: 1981, nationality: '印度' }),

  // ── 澳大利亚 ──
  person('per-ap-4', '安东尼·阿尔巴尼斯', '澳大利亚总理', '政治', ['asia_pacific'], CANBERRA[0], CANBERRA[1], '澳领导人，深化 AUKUS 与对华贸易平衡。', { since: 2022, birthYear: 1963, nationality: '澳大利亚', wikipedia: 'https://zh.wikipedia.org/wiki/安东尼·阿尔巴尼斯' }),
  person('per-ap-23', '黄英贤', '澳大利亚外长', '政治', ['asia_pacific'], CANBERRA[0], CANBERRA[1], '工党资深政治家，主导对华与太平洋岛国外交。', { since: 2022, birthYear: 1961, nationality: '澳大利亚/马来西亚' }),
  person('per-ap-55', '理查德·马尔斯', '澳大利亚国防部长', '军事', ['asia_pacific'], CANBERRA[0], CANBERRA[1], '负责 AUKUS 核潜艇与印太部署。', { since: 2022, nationality: '澳大利亚' }),
  person('per-ap-56', '吉姆·查默斯', '澳大利亚财政部长', '经济', ['asia_pacific'], CANBERRA[0], CANBERRA[1], '财政政策制定者。', { since: 2022, nationality: '澳大利亚' }),
  person('per-ap-57', '米歇尔·布洛克', '澳大利亚央行行长', '经济', ['asia_pacific'], CANBERRA[0], CANBERRA[1], '澳联储首位女性行长。', { since: 2023, nationality: '澳大利亚' }),
  person('per-ap-19', '彼得·达顿', '澳大利亚反对党领袖', '政治', ['asia_pacific'], CANBERRA[0], CANBERRA[1], '自由党领袖，主张更强硬对华安全政策。', { birthYear: 1970, nationality: '澳大利亚' }),
  person('per-ap-58', '凯瑟琳·康明斯', '西太平洋银行 CEO', '经济', ['asia_pacific'], -33.87, 151.21, '澳洲四大银行 CEO。', { since: 2024, nationality: '澳大利亚' }),

  // ── 新西兰 ──
  person('per-ap-5', '克里斯托弗·卢克森', '新西兰总理', '政治', ['asia_pacific'], WELLINGTON[0], WELLINGTON[1], '新西兰国家党领袖，关注太平洋岛国气候与安全。', { since: 2023, nationality: '新西兰', wikipedia: 'https://en.wikipedia.org/wiki/Christopher_Luxon' }),
  person('per-ap-59', '温斯顿·彼得斯', '新西兰副总理', '政治', ['asia_pacific'], WELLINGTON[0], WELLINGTON[1], '新西兰优先党党魁。', { since: 2023, nationality: '新西兰' }),
  person('per-ap-60', '杰辛达·阿德恩', '新西兰前总理', '政治', ['asia_pacific'], WELLINGTON[0], WELLINGTON[1], '前总理，以疫情应对与气候领导力著称。', { since: 2017, birthYear: 1980, nationality: '新西兰', wikipedia: 'https://zh.wikipedia.org/wiki/杰辛达·阿德恩' }),

  // ── 南亚其他国家 ──
  person('per-ap-61', '谢赫·哈西娜', '孟加拉国总理', '政治', ['asia_pacific'], 90.41, 23.81, '孟加拉最长任期总理。', { since: 2009, birthYear: 1947, nationality: '孟加拉国' }),
  person('per-ap-62', '穆罕默德·尤努斯', '孟加拉临时政府首席顾问', '政治', ['asia_pacific'], 90.41, 23.81, '微型金融先驱，诺贝尔和平奖得主。', { since: 2024, birthYear: 1940, nationality: '孟加拉国', wikipedia: 'https://zh.wikipedia.org/wiki/穆罕默德·尤努斯' }),
  person('per-ap-63', '纳齐尔·阿什拉夫', '巴基斯坦总理', '政治', ['asia_pacific'], 72.99, 33.70, '巴基斯坦总理。', { since: 2024, nationality: '巴基斯坦' }),
  person('per-ap-64', '沙赫巴兹·谢里夫', '巴基斯坦前总理', '政治', ['asia_pacific'], 74.34, 31.52, '谢里夫家族，前总理。', { since: 2022, nationality: '巴基斯坦' }),
  person('per-ap-65', '伊姆兰·汗', '巴基斯坦前总理', '政治', ['asia_pacific'], 74.34, 31.52, '板球明星转政坛，2022 年遭不信任案下台。', { since: 2018, birthYear: 1952, nationality: '巴基斯坦', wikipedia: 'https://zh.wikipedia.org/wiki/伊姆兰·汗' }),
  person('per-ap-66', '阿西夫·扎尔达里', '巴基斯坦总统', '政治', ['asia_pacific'], 67.00, 24.86, '巴基斯坦总统。', { since: 2024, nationality: '巴基斯坦' }),
  person('per-ap-67', '拉尼尔·维克拉马辛哈', '斯里兰卡总统', '政治', ['asia_pacific'], 79.86, 6.92, '斯里兰卡总统，应对债务危机。', { since: 2022, nationality: '斯里兰卡' }),
  person('per-ap-68', '马欣达·拉贾帕克萨', '斯里兰卡前总统', '政治', ['asia_pacific'], 79.86, 6.92, '前总统，家族政治代表。', { since: 2019, nationality: '斯里兰卡' }),
  person('per-ap-69', '普什帕·卡迈勒·达哈尔', '尼泊尔总理', '政治', ['asia_pacific'], 85.27, 27.70, '尼泊尔总理（毛派）。', { since: 2022, nationality: '尼泊尔' }),
  person('per-ap-70', 'K·P·沙尔玛·奥利', '尼泊尔前总理', '政治', ['asia_pacific'], 85.27, 27.70, '尼泊尔共产党领袖。', { since: 2018, nationality: '尼泊尔' }),
  person('per-ap-71', '谢赫·穆罕默德', '马尔代夫总统', '政治', ['asia_pacific'], 73.50, 4.17, '马尔代夫总统。', { since: 2023, nationality: '马尔代夫' }),
  person('per-ap-72', '吉格梅·凯萨尔·旺楚克', '不丹国王', '政治', ['asia_pacific'], 89.63, 27.47, '不丹第五代国王。', { since: 2006, nationality: '不丹' }),

  // ── 太平洋岛国 ──
  person('per-ap-73', '马克·布朗', '斐济总理', '政治', ['asia_pacific'], 178.41, -18.13, '斐济总理。', { since: 2022, nationality: '斐济' }),
  person('per-ap-74', '詹姆斯·马拉佩', '巴新总理', '政治', ['asia_pacific'], 147.18, -9.45, '巴布亚新几内亚总理。', { since: 2019, nationality: '巴布亚新几内亚' }),
  person('per-ap-75', '菲亚梅·内奥米', '萨摩亚总理', '政治', ['asia_pacific'], -171.76, -13.83, '萨摩亚首位女性总理。', { since: 2021, nationality: '萨摩亚' }),
];
