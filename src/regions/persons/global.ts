import { person } from './helpers';

/** 全球跨区域公众人物 */
export const GLOBAL_PERSONS = [
  person('per-g-1', '安东尼奥·古特雷斯', '联合国秘书长', '政治', ['global'], -73.97, 40.75, '葡萄牙前总理，2017 年起任联合国秘书长，主导全球气候与和平议程。', { since: 2017, wikipedia: 'https://zh.wikipedia.org/wiki/安东尼奥·古特雷斯' }),
  person('per-g-2', '乌尔苏拉·冯德莱恩', '欧盟委员会主席', '政治', ['global', 'western_europe'], 4.35, 50.85, '欧盟行政首脑，推动绿色协议与对华经贸政策协调。', { since: 2019, wikipedia: 'https://zh.wikipedia.org/wiki/乌尔苏拉·冯德莱恩' }),
  person('per-g-3', '克里斯蒂娜·拉加德', '欧洲央行行长', '经济', ['global', 'western_europe'], 2.35, 48.86, '前 IMF 总裁，主导欧元区货币政策与通胀应对。', { since: 2019, wikipedia: 'https://zh.wikipedia.org/wiki/克里斯蒂娜·拉加德' }),
  person('per-g-4', '杰罗姆·鲍威尔', '美联储主席', '经济', ['global', 'north_america'], -77.04, 38.90, '美国联邦储备委员会主席，设定美元利率与全球流动性基调。', { since: 2018, wikipedia: 'https://zh.wikipedia.org/wiki/杰罗姆·鲍威尔' }),
  person('per-g-5', '拉加德拉·达斯·古普塔', '世界银行行长', '经济', ['global'], -77.04, 38.90, '印度裔经济学家，领导全球减贫与发展融资。', { since: 2023 }),
  person('per-g-6', '阿吉特·德瓦尔', '国际货币基金组织总裁', '经济', ['global'], -77.04, 38.90, '保加利亚经济学家，协调全球金融稳定与债务重组。', { since: 2024 }),
  person('per-g-7', '延斯·斯托尔滕贝格', '北约秘书长', '军事', ['global', 'western_europe'], 4.35, 50.85, '前挪威首相，协调北约东扩与乌克兰援助。', { since: 2014, wikipedia: 'https://zh.wikipedia.org/wiki/延斯·斯托尔滕贝格' }),
  person('per-g-8', '谭德塞', '世卫组织总干事', '社会', ['global'], 6.14, 46.20, '埃塞俄比亚公共卫生专家，主导全球卫生应急与疫苗公平。', { since: 2017, wikipedia: 'https://zh.wikipedia.org/wiki/谭德塞' }),
  person('per-g-9', '古斯塔沃·佩特罗', '哥伦比亚总统', '政治', ['global', 'latin_america'], -74.07, 4.71, '拉美左翼领导人，推动亚马逊保护与和平进程。', { since: 2022, wikipedia: 'https://zh.wikipedia.org/wiki/古斯塔沃·佩特罗' }),
  person('per-g-10', '穆罕默德·本·萨勒曼', '沙特王储兼首相', '政治', ['global', 'middleeast'], 46.72, 24.69, '沙特实际统治者，主导 Vision 2030 与欧佩克+产量政策。', { since: 2017, wikipedia: 'https://zh.wikipedia.org/wiki/穆罕默德·本·萨勒曼' }),
  person('per-g-11', '纳伦德拉·莫迪', '印度总理', '政治', ['global', 'asia_pacific'], 77.21, 28.61, '印度人民党领袖，推动「印度制造」与印太战略参与。', { since: 2014, wikipedia: 'https://zh.wikipedia.org/wiki/纳伦德拉·莫迪' }),
  person('per-g-12', '李在明', '韩国总统', '政治', ['global', 'asia_pacific', 'china'], 126.98, 37.57, '共同民主党候选人当选，主张对朝对话与对华务实关系。', { since: 2025, wikipedia: 'https://zh.wikipedia.org/wiki/李在明' }),
  person('per-g-13', '石破茂', '日本首相', '政治', ['global', 'asia_pacific', 'china'], 139.69, 35.69, '自民党总裁，延续安保法制强化与对华「战略互惠」框架。', { since: 2024, wikipedia: 'https://zh.wikipedia.org/wiki/石破茂' }),
  person('per-g-14', '弗拉基米尔·普京', '俄罗斯总统', '政治', ['global', 'eastern_europe'], 37.62, 55.75, '俄罗斯最高领导人，主导对乌特别军事行动与能源外交。', { since: 2012, wikipedia: 'https://zh.wikipedia.org/wiki/弗拉基米尔·普京' }),
  person('per-g-15', '习近平', '中国国家主席', '政治', ['global', 'china'], 116.40, 39.90, '中共中央总书记，提出中国式现代化与「一带一路」倡议。', { since: 2013, wikipedia: 'https://zh.wikipedia.org/wiki/习近平' }),
  person('per-g-16', '唐纳德·特朗普', '美国总统', '政治', ['global', 'north_america', 'middleeast'], -77.04, 38.90, '共和党籍总统，主导美国贸易、移民与中东军事政策。', { since: 2025, wikipedia: 'https://zh.wikipedia.org/wiki/唐納·川普' }),
  person('per-g-17', '埃隆·马斯克', '特斯拉/SpaceX CEO', '经济', ['global', 'north_america'], -118.24, 34.05, '科技企业家，影响电动车、航天与社交媒体舆论生态。', { since: 2008, wikipedia: 'https://zh.wikipedia.org/wiki/埃隆·马斯克' }),
  person('per-g-18', '泰勒·斯威夫特', '歌手、词曲作者', '文化', ['global', 'north_america'], -86.78, 36.16, '全球流行文化符号，巡演经济与文化影响力巨大。', { since: 2006, wikipedia: 'https://zh.wikipedia.org/wiki/泰勒·斯威夫特' }),
  person('per-g-19', '格蕾塔·通贝里', '气候活动家', '社会', ['global', 'western_europe'], 18.07, 59.33, '瑞典青年气候运动领袖，推动全球减碳舆论。', { since: 2018, wikipedia: 'https://zh.wikipedia.org/wiki/格蕾塔·通贝里' }),
  person('per-g-20', '马拉拉·优素福扎伊', '教育活动家', '社会', ['global', 'middleeast'], 73.05, 33.69, '诺贝尔和平奖得主，倡导女童教育权利。', { since: 2012, wikipedia: 'https://zh.wikipedia.org/wiki/马拉拉·优素福扎伊' }),
  person('per-g-21', '本雅明·内塔尼亚胡', '以色列总理', '政治', ['global', 'middleeast'], 35.21, 31.77, '以色列政坛资深人物，主导对伊朗与黎巴嫩安全政策。', { since: 2022, wikipedia: 'https://zh.wikipedia.org/wiki/本雅明·内塔尼亚胡' }),
  person('per-g-22', '费利佩六世', '西班牙国王', '文化', ['global', 'western_europe'], -3.70, 40.42, '西班牙国家象征，在外交礼仪与拉美纽带中发挥软实力。', { since: 2014 }),

  person('per-g-23', '特奥多罗·欧班尼', '国际法院院长', '政治', ['global'], 4.35, 50.85, '国际司法权威，审理国际争端与战争罪案件。', { since: 2024 }),
  person('per-g-24', '达沃·斯蒂芬', '国际刑警组织秘书长', '社会', ['global'], 4.85, 45.76, '协调跨国警务与通缉合作。', { since: 2021 }),
  person('per-g-25', '中满泉', '联合国裁军事务副秘书长', '政治', ['global'], -73.97, 40.75, '日本外交官，推动核不扩散与裁军议程。', { since: 2023, wikipedia: 'https://en.wikipedia.org/wiki/Izumi_Nakamitsu' }),
  person('per-g-26', '斯泰恩·埃布森', '国际原子能机构总干事', '政治', ['global'], 16.36, 48.21, '监督全球核能安全与伊朗核查。', { since: 2024, wikipedia: 'https://en.wikipedia.org/wiki/Rafael_Grossi' }),
  person('per-g-27', '弗雷斯特·惠特克', '联合国难民事务高级专员', '社会', ['global'], 6.14, 46.20, '领导全球难民保护与人道响应。', { since: 2023 }),
];
