import { person } from './helpers';

const TOKYO = [139.69, 35.69] as const;
const SEOUL = [126.98, 37.57] as const;
const CANBERRA = [-35.28, 149.13] as const;
const WELLINGTON = [174.78, -41.29] as const;
const DELHI = [77.21, 28.61] as const;

/** 亚太区域人物 */
export const ASIA_PACIFIC_PERSONS = [
  person('per-ap-1', '石破茂', '日本首相', '政治', ['asia_pacific'], TOKYO[0], TOKYO[1], '日本内阁首脑，强化日美同盟与对华经贸。', { since: 2024 }),
  person('per-ap-2', '李在明', '韩国总统', '政治', ['asia_pacific'], SEOUL[0], SEOUL[1], '韩国领导人，主张对朝对话与区域经济合作。', { since: 2025 }),
  person('per-ap-3', '纳伦德拉·莫迪', '印度总理', '政治', ['asia_pacific'], DELHI[0], DELHI[1], '印度人民党领袖，推动「印度制造」与印太战略。', { since: 2014 }),
  person('per-ap-4', '安东尼·阿尔巴尼斯', '澳大利亚总理', '政治', ['asia_pacific'], CANBERRA[0], CANBERRA[1], '澳领导人，深化 AUKUS 与对华贸易平衡。', { since: 2022 }),
  person('per-ap-5', '克里斯托弗·卢克森', '新西兰总理', '政治', ['asia_pacific'], WELLINGTON[0], WELLINGTON[1], '新西兰国家党领袖，关注太平洋岛国气候与安全。', { since: 2023 }),
  person('per-ap-6', '岸信介', '日本前首相', '政治', ['asia_pacific'], TOKYO[0], TOKYO[1], '2022 年遇刺，任内推动印太经济框架与安保法制。', { status: 'deceased' }),
  person('per-ap-7', '小泉进次郎', '日本自民党政务调查会长', '政治', ['asia_pacific'], TOKYO[0], TOKYO[1], '年轻政治明星，关注气候与能源政策。', { since: 2024 }),
  person('per-ap-8', '岸田文雄', '日本前首相', '政治', ['asia_pacific'], TOKYO[0], TOKYO[1], '任内将防卫预算提升至 GDP 2% 目标。', { status: 'restricted' }),
  person('per-ap-9', '尹锡悦', '韩国前总统', '政治', ['asia_pacific'], SEOUL[0], SEOUL[1], '任内强化美韩同盟与日韩和解。', { status: 'restricted' }),
  person('per-ap-10', '苏杰生', '印度外长', '政治', ['asia_pacific'], DELHI[0], DELHI[1], '印度多边外交核心，主持 G20 与金砖扩容。', { since: 2019 }),
  person('per-ap-11', '拉杰纳特·辛格', '印度国防部长', '军事', ['asia_pacific'], DELHI[0], DELHI[1], '印军现代化与边境对峙议题发言人。', { since: 2019 }),
  person('per-ap-12', '理查德·马尔斯', '澳大利亚副总理兼国防部长', '军事', ['asia_pacific'], CANBERRA[0], CANBERRA[1], '负责 AUKUS 核潜艇与印太部署。', { since: 2022 }),
  person('per-ap-13', '拉米什·巴林', '澳大利亚财政部长', '经济', ['asia_pacific'], CANBERRA[0], CANBERRA[1], '管理澳中贸易与关键矿产出口。', { since: 2022 }),
  person('per-ap-14', '孙正义', '软银集团创始人', '经济', ['asia_pacific'], TOKYO[0], TOKYO[1], '科技投资巨头，Vision Fund 影响全球创投。', { since: 1981 }),
  person('per-ap-15', '穆克什·安巴尼', '信实工业董事长', '经济', ['asia_pacific'], 72.83, 19.08, '印度首富，掌控能源与电信巨头。', { since: 2005 }),
  person('per-ap-16', 'BTS', '韩国流行乐团', '文化', ['asia_pacific'], SEOUL[0], SEOUL[1], '全球 K-pop 现象，韩国软实力象征。', { since: 2013 }),
  person('per-ap-17', '宫崎骏', '动画导演', '文化', ['asia_pacific'], TOKYO[0], TOKYO[1], '吉卜力工作室创始人，《千与千寻》等作品享誉世界。'),
  person('per-ap-18', '马拉拉·优素福扎伊', '教育活动家', '社会', ['asia_pacific'], 73.05, 33.69, '诺贝尔和平奖得主，倡导女童教育。', { since: 2012 }),
  person('per-ap-19', '彼得·达顿', '澳大利亚反对党领袖', '政治', ['asia_pacific'], CANBERRA[0], CANBERRA[1], '自由党领袖，主张更强硬对华安全政策。'),
  person('per-ap-20', '普拉博沃·苏比安托', '印尼总统', '政治', ['asia_pacific', 'southeast_asia'], 106.85, -6.21, '印尼新任总统，东盟最大经济体领导人。', { since: 2024 }),
  person('per-ap-21', '拉胡尔·甘地', '印度国大党领袖', '政治', ['asia_pacific'], DELHI[0], DELHI[1], '尼赫鲁-甘地家族成员，印度主要反对党领导人。'),
  person('per-ap-22', '萨钦·坦杜尔卡', '印度板球传奇', '文化', ['asia_pacific'], 72.83, 19.08, '「板球之神」，印度国民级体育文化偶像。'),
  person('per-ap-23', '黄英贤', '澳大利亚外长', '政治', ['asia_pacific'], CANBERRA[0], CANBERRA[1], '工党资深政治家，主导对华与太平洋岛国外交。', { since: 2022 }),
  person('per-ap-24', '克里斯·希普金斯', '新西兰工党领袖', '政治', ['asia_pacific'], WELLINGTON[0], WELLINGTON[1], '前总理，现任主要反对党领袖。'),
];
