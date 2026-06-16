// 中东高价值目标人物 — LIFEOS-005 阶段3 第三批
// 迁自 Iran conflictData.ts(targetPersons)，含 WIKI 头像源；数据含估算与公开信息。
import type { TargetPerson } from '@/types/middleeast';

const WIKI = 'https://upload.wikimedia.org/wikipedia/commons'

export const MIDEAST_TARGETS: TargetPerson[] = [
  // ————— 伊朗（哈梅内伊已阵亡，当前为领袖空缺与过渡期）—————
  {
    id: 'per-ir-1',
    name: '阿里·哈梅内伊',
    faction: 'iran',
    role: '伊朗最高领袖（已故）',
    roleCategory: 'political',
    status: 'deceased',
    brief: '原最高领袖，美以联合行动中遇袭身亡；伊朗现处于领袖空缺，由专家会议与国安会协调过渡。',
    avatar: `${WIKI}/a/a4/Ali_khamenei_in_January_2021.jpg`,
    actions: [
      { codeName: '阵亡', date: '2026-03-01', description: '美以联合空袭中于宅邸遇袭身亡，伊方宣布为「殉道」并誓言报复', eventId: 'evt-cnn-12' },
    ],
  },
  {
    id: 'per-ir-2',
    name: '阿里·拉里贾尼',
    faction: 'iran',
    role: '伊朗最高国家安全委员会秘书',
    roleCategory: 'political',
    status: 'active',
    brief: '领袖空缺期间主导国安会与战略协调，协调军方与外交口径，参与过渡期决策。',
    avatar: `${WIKI}/6/6f/Ali_Larijani_13991023_1147094.jpg`,
    actions: [
      { codeName: '表态', date: '2026-03-02', description: '称「不会在压力下与美国谈判」，强调在领袖空缺下保持团结', eventId: 'evt-cnn-14' },
    ],
  },
  {
    id: 'per-ir-3',
    name: '侯赛因·阿米尔-阿卜杜拉希扬',
    faction: 'iran',
    role: '伊朗外交部长',
    roleCategory: 'diplomatic',
    status: 'active',
    brief: '主导伊方对外表态与多边接触；哈梅内伊身亡后对外说明伊方立场与报复决心。',
    avatar: `${WIKI}/e/ee/H-Amirabdollahian.jpg`,
    actions: [
      { codeName: '喊话', date: '2026-03-02', description: '称美国民众「应夺回自己的国家」，谴责美以「斩首」行动并誓言回应', eventId: 'evt-cnn-14' },
    ],
  },
  {
    id: 'per-ir-4',
    name: '侯赛因·萨拉米',
    faction: 'iran',
    role: '伊斯兰革命卫队司令',
    roleCategory: 'military',
    status: 'active',
    brief: '革命卫队最高军事负责人，领袖身亡后统辖陆海空及圣城旅，主导军事应对与代理人协调。',
    actions: [
      { codeName: '动员', date: '2026-03-02', description: '要求部队做好「全面应对」准备，强调为领袖复仇、保卫国家主权', eventId: 'evt-cnn-14' },
    ],
  },
  {
    id: 'per-ir-5',
    name: '伊斯梅尔·卡尼',
    faction: 'iran',
    role: '伊斯兰革命卫队圣城旅指挥官',
    roleCategory: 'military',
    status: 'active',
    brief: '负责境外行动与代理人协调，对真主党、胡塞等地区力量影响大；过渡期军事外线关键人物。',
    actions: [
      { codeName: '代理人行动', date: '2026-03-01', description: '真主党、胡塞、伊拉克民兵同步发动报复，圣城旅协调境外打击', eventId: 'evt-bbc-8' },
    ],
  },
  {
    id: 'per-ir-6',
    name: '艾哈迈德·哈塔米',
    faction: 'iran',
    role: '革命卫队航空航天部队司令',
    roleCategory: 'military',
    status: 'active',
    brief: '负责弹道导弹与航天能力建设与运用，对伊远程打击能力至关重要。',
    actions: [
      { codeName: '导弹反击', date: '2026-03-03', description: '航空航天部队执行对以、对海湾目标打击；纳坦兹等设施遭袭后强调报复能力', eventId: 'evt-bbc-9' },
    ],
  },
  {
    id: 'per-ir-7',
    name: '穆罕默德·礼萨·纳克迪',
    faction: 'iran',
    role: '伊朗陆军地面部队司令',
    roleCategory: 'military',
    status: 'active',
    brief: '常规陆军地面部队负责人，与革命卫队协同防御与本土作战。',
    actions: [],
  },
  {
    id: 'per-ir-8',
    name: '阿里·沙姆哈尼',
    faction: 'iran',
    role: '伊朗最高国家安全委员会前秘书、国防事务顾问',
    roleCategory: 'political',
    status: 'active',
    brief: '资深国安与国防顾问，过渡期参与战略与防务决策。',
    actions: [],
  },
  // ————— 美国 —————
  {
    id: 'per-us-1',
    name: '唐纳德·特朗普',
    faction: 'us',
    role: '美国总统',
    roleCategory: 'political',
    status: 'active',
    brief: '战时最高统帅，主导对伊军事与制裁决策。',
    avatar: `${WIKI}/f/fe/Donald_Trump_portrait_official_2025.jpg`,
    actions: [
      { codeName: '战争目标', date: '2026-03-02', description: '称将摧毁伊导弹能力、歼灭海军、终结核计划', eventId: 'evt-cnn-8' },
      { codeName: '时长预估', date: '2026-03-02', description: '称战争可能持续四至五周，「大浪」尚未到来', eventId: 'evt-cnn-8' },
    ],
  },
  {
    id: 'per-us-2',
    name: '劳埃德·奥斯汀',
    faction: 'us',
    role: '美国国防部长',
    roleCategory: 'military',
    status: 'active',
    brief: '负责国防政策与作战执行，协调中央司令部与盟国。',
    actions: [
      { codeName: '表态', date: '2026-03-02', description: '称对伊战争「不是无休止的」，目标明确后收束', eventId: 'evt-bbc-10' },
    ],
  },
  {
    id: 'per-us-3',
    name: '迈克尔·库里拉',
    faction: 'us',
    role: '美国中央司令部司令',
    roleCategory: 'military',
    status: 'active',
    brief: '负责中东战区作战，指挥对伊及地区军事行动。',
    actions: [],
  },
  {
    id: 'per-us-4',
    name: '安东尼·布林肯',
    faction: 'us',
    role: '美国国务卿',
    roleCategory: 'diplomatic',
    status: 'active',
    brief: '主导对盟国与多边外交，争取对伊行动支持。',
    actions: [
      { codeName: '外交', date: '2026-03-02', description: '与欧洲及中东盟友协调立场，寻求孤立伊朗', eventId: 'evt-bbc-10' },
    ],
  },
  {
    id: 'per-us-5',
    name: '马克·鲁比奥',
    faction: 'us',
    role: '美国参议员、情报委员会成员',
    roleCategory: 'political',
    status: 'active',
    actions: [
      { codeName: '表态', date: '2026-03-03', description: '称美方动武因伊朗「迫在眉睫的威胁」', eventId: 'evt-bbc-4' },
    ],
  },
  // ————— 以色列 —————
  {
    id: 'per-il-1',
    name: '本雅明·内塔尼亚胡',
    faction: 'israel',
    role: '以色列总理',
    roleCategory: 'political',
    status: 'active',
    brief: '以方战时决策核心，协调国防与外交。',
    avatar: `${WIKI}/7/7a/Benjamin_Netanyahu_Portrait_February_2023_(3x4_cropped).jpg`,
    actions: [
      { codeName: 'Fox 专访', date: '2026-03-03', description: '称「不是无休止的战争」，战役将按需持续', eventId: 'evt-bbc-6' },
    ],
  },
  {
    id: 'per-il-2',
    name: '约阿夫·加兰特',
    faction: 'israel',
    role: '以色列国防部长',
    roleCategory: 'military',
    status: 'active',
    brief: '负责国防与以军对黎巴嫩、真主党等战线。',
    avatar: `${WIKI}/4/40/Yoav_Galant_1.jpg`,
    actions: [
      { codeName: '黎巴嫩', date: '2026-03-03', description: '称地面部队将「推进并占领黎巴嫩更多战略要地」以阻止袭击', eventId: 'evt-bbc-1' },
    ],
  },
  {
    id: 'per-il-3',
    name: '赫齐·哈勒维',
    faction: 'israel',
    role: '以色列国防军参谋长',
    roleCategory: 'military',
    status: 'active',
    brief: '以军最高军职，负责作战计划与执行。',
    actions: [],
  },
  {
    id: 'per-il-4',
    name: '本·格维尔',
    faction: 'israel',
    role: '以色列国家安全部长',
    roleCategory: 'political',
    status: 'active',
    actions: [],
  },
  {
    id: 'per-il-5',
    name: '阿维哈伊·阿德拉伊',
    faction: 'israel',
    role: '以军阿拉伯媒体发言人',
    roleCategory: 'military',
    status: 'active',
    actions: [
      { codeName: '撤离令', date: '2026-03-03', description: '对黎巴嫩 80 余城镇发布撤离警告', eventId: 'evt-bbc-8' },
    ],
  },
  // ————— 真主党/代理人 —————
  {
    id: 'per-hz-1',
    name: '哈桑·纳斯鲁拉',
    faction: 'iran',
    role: '黎巴嫩真主党总书记',
    roleCategory: 'political',
    status: 'active',
    brief: '真主党最高领导人，与伊朗协调对以行动。',
    avatar: `${WIKI}/2/2c/Sayyid_Nasrallah.jpg`,
    actions: [
      { codeName: '参战', date: '2026-03-01', description: '真主党对以军基地发动导弹与无人机报复', eventId: 'evt-cnn-11' },
    ],
  },
]

/**
 * 外交模组：国际社会、中东各国、宗教势力、国际组织对美以伊冲突的反应
 */
