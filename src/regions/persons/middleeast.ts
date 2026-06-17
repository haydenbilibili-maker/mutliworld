import { person } from './helpers';

const TEHRAN = [51.39, 35.69] as const;
const WDC = [-77.04, 38.90] as const;
const JERUSALEM = [35.21, 31.77] as const;
const BEIRUT = [35.50, 33.89] as const;
const RIYADH = [46.72, 24.69] as const;
const DOHA = [51.53, 25.29] as const;
const ABU_DHABI = [54.37, 24.45] as const;
const CAIRO = [31.24, 30.04] as const;

const WIKI = 'https://upload.wikimedia.org/wikipedia/commons';

/** 中东区域人物（含原目标人物数据迁移） */
export const MIDDLEEAST_PERSONS = [
  person('per-ir-1', '阿里·哈梅内伊', '伊朗最高领袖（已故）', '政治', ['middleeast'], TEHRAN[0], TEHRAN[1], '原最高领袖，美以联合行动中遇袭身亡；伊朗现处于领袖空缺过渡期。', { faction: 'iran', status: 'deceased', avatar: `${WIKI}/a/a4/Ali_khamenei_in_January_2021.jpg`, actions: [{ codeName: '阵亡', date: '2026-03-01', description: '美以联合空袭中于宅邸遇袭身亡' }] }),
  person('per-ir-2', '阿里·拉里贾尼', '伊朗最高国家安全委员会秘书', '政治', ['middleeast'], TEHRAN[0], TEHRAN[1], '领袖空缺期间主导国安会与战略协调，参与过渡期决策。', { faction: 'iran', avatar: `${WIKI}/6/6f/Ali_Larijani_13991023_1147094.jpg` }),
  person('per-ir-3', '侯赛因·阿米尔-阿卜杜拉希扬', '伊朗外交部长', '政治', ['middleeast'], TEHRAN[0], TEHRAN[1], '主导伊方对外表态与多边接触，说明伊方立场与报复决心。', { faction: 'iran', avatar: `${WIKI}/e/ee/H-Amirabdollahian.jpg` }),
  person('per-ir-4', '侯赛因·萨拉米', '伊斯兰革命卫队司令', '军事', ['middleeast'], TEHRAN[0], TEHRAN[1], '革命卫队最高军事负责人，统辖陆海空及圣城旅。', { faction: 'iran' }),
  person('per-ir-5', '伊斯梅尔·卡尼', '圣城旅指挥官', '军事', ['middleeast'], TEHRAN[0], TEHRAN[1], '负责境外行动与代理人协调，对真主党、胡塞等影响大。', { faction: 'iran' }),
  person('per-ir-6', '艾哈迈德·哈塔米', '革命卫队航空航天部队司令', '军事', ['middleeast'], TEHRAN[0], TEHRAN[1], '负责弹道导弹与航天能力建设与运用。', { faction: 'iran' }),
  person('per-ir-7', '穆罕默德·礼萨·纳克迪', '伊朗陆军地面部队司令', '军事', ['middleeast'], TEHRAN[0], TEHRAN[1], '常规陆军地面部队负责人，与革命卫队协同防御。', { faction: 'iran' }),
  person('per-ir-8', '阿里·沙姆哈尼', '国防事务顾问', '政治', ['middleeast'], TEHRAN[0], TEHRAN[1], '资深国安与国防顾问，参与战略与防务决策。', { faction: 'iran' }),
  person('per-us-1', '唐纳德·特朗普', '美国总统', '政治', ['middleeast', 'north_america'], WDC[0], WDC[1], '战时最高统帅，主导对伊军事与制裁决策。', { faction: 'us', avatar: `${WIKI}/f/fe/Donald_Trump_portrait_official_2025.jpg` }),
  person('per-us-2', '劳埃德·奥斯汀', '美国国防部长', '军事', ['middleeast', 'north_america'], WDC[0], WDC[1], '负责国防政策与作战执行，协调中央司令部与盟国。', { faction: 'us' }),
  person('per-us-3', '迈克尔·库里拉', '美国中央司令部司令', '军事', ['middleeast', 'north_america'], 50.59, 26.23, '负责中东战区作战，指挥对伊及地区军事行动。', { faction: 'us' }),
  person('per-us-4', '安东尼·布林肯', '美国国务卿', '政治', ['middleeast', 'north_america'], WDC[0], WDC[1], '主导对盟国与多边外交，争取对伊行动支持。', { faction: 'us' }),
  person('per-il-1', '本雅明·内塔尼亚胡', '以色列总理', '政治', ['middleeast'], JERUSALEM[0], JERUSALEM[1], '以方战时决策核心，协调国防与外交。', { faction: 'israel', avatar: `${WIKI}/7/7a/Benjamin_Netanyahu_Portrait_February_2023_(3x4_cropped).jpg` }),
  person('per-il-2', '约阿夫·加兰特', '以色列国防部长', '军事', ['middleeast'], JERUSALEM[0], JERUSALEM[1], '负责国防与以军对黎巴嫩、真主党等战线。', { faction: 'israel', avatar: `${WIKI}/4/40/Yoav_Galant_1.jpg` }),
  person('per-il-3', '赫齐·哈勒维', '以色列国防军参谋长', '军事', ['middleeast'], JERUSALEM[0], JERUSALEM[1], '以军最高军职，负责作战计划与执行。', { faction: 'israel' }),
  person('per-hz-1', '哈桑·纳斯鲁拉', '黎巴嫩真主党总书记', '政治', ['middleeast'], BEIRUT[0], BEIRUT[1], '真主党最高领导人，与伊朗协调对以行动。', { faction: 'iran', avatar: `${WIKI}/2/2c/Sayyid_Nasrallah.jpg` }),
  person('per-me-1', '穆罕默德·本·萨勒曼', '沙特王储兼首相', '政治', ['middleeast'], RIYADH[0], RIYADH[1], '沙特实际统治者，主导 Vision 2030 与欧佩克+政策。', { since: 2017 }),
  person('per-me-2', '谢赫·塔米姆', '卡塔尔埃米尔', '政治', ['middleeast'], DOHA[0], DOHA[1], '卡塔尔元首，在斡旋冲突与液化天然气出口中发挥影响力。', { since: 2013 }),
  person('per-me-3', '穆罕默德·本·扎耶德', '阿联酋总统', '政治', ['middleeast'], ABU_DHABI[0], ABU_DHABI[1], '阿联酋领导人，推动经济多元化与地区安全合作。', { since: 2022 }),
  person('per-me-4', '阿卜杜勒-法塔赫·塞西', '埃及总统', '政治', ['middleeast'], CAIRO[0], CAIRO[1], '埃及领导人，在加沙人道走廊与地区稳定中居关键位置。', { since: 2014 }),
  person('per-me-5', '阿卜杜勒·马利克·胡塞', '胡塞武装领导人', '军事', ['middleeast'], 44.21, 15.35, '也门胡塞武装最高领导人，控制红海航运威胁。', { since: 2004 }),
  person('per-me-6', '雷杰普·塔伊普·埃尔多安', '土耳其总统', '政治', ['middleeast', 'eastern_europe'], 32.86, 39.93, '土耳其领导人，在北约与中东事务中寻求平衡角色。', { since: 2014 }),
  person('per-me-7', '穆罕默德·穆斯塔法', '巴勒斯坦总理', '政治', ['middleeast'], 35.20, 31.90, '巴勒斯坦权力机构行政首脑，负责人道援助与战后重建协调。', { since: 2024 }),
  person('per-me-9', '法蒂玛·马苏德', '伊朗女性权利活动家', '社会', ['middleeast'], TEHRAN[0], TEHRAN[1], '伊朗民间社会代表，关注头巾法与公民权利议题。'),
  person('per-me-10', '福阿德·马苏姆', '伊拉克总统', '政治', ['middleeast'], 44.37, 33.31, '伊拉克国家元首，在宗派平衡与地区关系中发挥协调作用。', { since: 2022 }),
];
