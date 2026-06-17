/**
 * 实时信息流跑马灯 — 精选时政/政经/国际局势种子数据
 *
 * 与 NewsPanel（RSS 全文列表）区分：本 feed 侧重「快讯流」，
 * 提供简体中文标题、摘要、分类标签；可与 /api/news 实时条目混排。
 */

import type { EventDetail, GeoPoint, ImpactLevel } from '@/types/geo';
import type { RegionId } from '@/types/region';

/** 跑马灯新闻分类 */
export type NewsFeedCategory =
  | '时政'
  | '政经'
  | '国际局势'
  | '军事安全'
  | '能源市场';

export interface NewsFeedItem {
  id: string;
  title: string;
  summary: string;
  category: NewsFeedCategory;
  source: string;
  publishedAt: string;
  url?: string;
  /** 可选地图定位；无坐标则点击仅开侧栏 */
  location?: GeoPoint;
  impact_level?: ImpactLevel;
  /** 区域相关性标签；缺省或含 global 表示全球通用 */
  regionIds?: RegionId[];
}

export const NEWS_CATEGORY_COLORS: Record<NewsFeedCategory, string> = {
  时政: '#a78bfa',
  政经: '#34d399',
  国际局势: '#60a5fa',
  军事安全: '#f87171',
  能源市场: '#fbbf24',
};

export const NEWS_CATEGORY_BG: Record<NewsFeedCategory, string> = {
  时政: 'rgba(167,139,250,0.15)',
  政经: 'rgba(52,211,153,0.15)',
  国际局势: 'rgba(96,165,250,0.15)',
  军事安全: 'rgba(248,113,113,0.15)',
  能源市场: 'rgba(251,191,36,0.15)',
};

/** 精选种子：2024–2026 时段，简体中文快讯 */
export const NEWS_FEED_SEED: NewsFeedItem[] = [
  {
    id: 'seed-001',
    title: '全国人大常委会审议2026年经济工作优先事项与财政安排',
    summary:
      '会议聚焦扩大内需、稳就业与地方债务化解，强调以科技创新引领新质生产力，为全年宏观政策定调。',
    category: '时政',
    source: '新华社',
    publishedAt: '2026-06-14T09:30:00+08:00',
    location: [116.4074, 39.9042],
    impact_level: 'medium',
  },
  {
    id: 'seed-002',
    title: '国务院部署新一轮消费品以旧换新，覆盖汽车家电与数码产品',
    summary:
      '政策旨在释放存量消费潜力，配套财政贴息与以旧换新补贴，预计拉动二季度社零增速0.3–0.5个百分点。',
    category: '政经',
    source: '人民日报',
    publishedAt: '2026-06-13T14:00:00+08:00',
    location: [116.4074, 39.9042],
    impact_level: 'medium',
  },
  {
    id: 'seed-003',
    title: '美联储维持利率区间不变，点阵图暗示年内或有一次降息',
    summary:
      '鲍威尔称通胀仍高于2%目标但趋势放缓，劳动力市场降温；美元指数短线走弱，新兴市场资产获喘息。',
    category: '政经',
    source: '路透社',
    publishedAt: '2026-06-12T04:00:00+08:00',
    location: [-77.0369, 38.9072],
    impact_level: 'high',
  },
  {
    id: 'seed-004',
    title: '欧盟就第18轮对俄制裁方案达成原则共识，聚焦能源与金融通道',
    summary:
      '新措施拟扩大影子舰队追踪与第三国中转限制；匈牙利再次就能源豁免条款提出保留意见。',
    category: '国际局势',
    source: '法新社',
    publishedAt: '2026-06-11T18:45:00+08:00',
    location: [4.3517, 50.8503],
    impact_level: 'medium',
  },
  {
    id: 'seed-005',
    title: '红海航运保险费率再度上调，亚欧航线绕行好望角成本攀升',
    summary:
      '胡塞武装袭击余波未平，主要船东延长绕航安排；上海—鹿特丹航线运价较冲突前上涨约35%。',
    category: '能源市场',
    source: '彭博',
    publishedAt: '2026-06-11T11:20:00+08:00',
    location: [42.551, 15.552],
    impact_level: 'high',
  },
  {
    id: 'seed-006',
    title: '北约东翼举行「坚定捍卫者」联合演习，波罗的海空域临时管制',
    summary:
      '参演兵力含陆海空及网络战单元，演练快速增援与前沿部署；俄方称将「密切监视」并加强西部军区戒备。',
    category: '军事安全',
    source: 'BBC 中文',
    publishedAt: '2026-06-10T16:00:00+08:00',
    location: [24.1052, 56.9496],
    impact_level: 'high',
  },
  {
    id: 'seed-007',
    title: 'OPEC+ 部长级会议同意延长减产至2026年三季度末',
    summary:
      '沙特与俄罗斯协调维持每日约220万桶自愿减产；分析师预计布伦特原油短期在80–85美元区间波动。',
    category: '能源市场',
    source: '路透能源',
    publishedAt: '2026-06-09T22:30:00+08:00',
    location: [47.9774, 29.3759],
    impact_level: 'high',
  },
  {
    id: 'seed-008',
    title: '东盟外长非正式会议聚焦南海行为准则磋商与区域供应链',
    summary:
      '各方强调维护《南海各方行为宣言》精神，推进COC单一磋商文本；RCEP原产地规则简化获积极评价。',
    category: '国际局势',
    source: '新华社',
    publishedAt: '2026-06-09T10:15:00+08:00',
    location: [100.5018, 13.7563],
    impact_level: 'medium',
  },
  {
    id: 'seed-009',
    title: '日本央行结束负利率时代后首次加息至0.5%，日元短线走强',
    summary:
      '植田和男称通胀目标实现概率上升，将逐步正常化货币政策；日经225指数盘中震荡，出口股承压。',
    category: '政经',
    source: '日经亚洲',
    publishedAt: '2026-06-08T14:30:00+08:00',
    location: [139.6917, 35.6895],
    impact_level: 'high',
  },
  {
    id: 'seed-010',
    title: '台海周边海空域活动频密，解放军东部战区发布联合演训通告',
    summary:
      '演训科目含联合封控与精确打击，强调捍卫主权与领土完整；台防务部门称已提升警戒并密切监控。',
    category: '军事安全',
    source: '央视军事',
    publishedAt: '2026-06-07T08:00:00+08:00',
    location: [121.0, 24.0],
    impact_level: 'critical',
  },
  {
    id: 'seed-011',
    title: '印度大选后莫迪第三任期内阁宣誓就职，经济改革议程受关注',
    summary:
      '新政府承诺加速制造业与基建投资，外资准入负面清单进一步缩减；反对党联盟席位增加或影响立法进程。',
    category: '时政',
    source: '印度时报',
    publishedAt: '2026-06-06T12:00:00+08:00',
    location: [77.209, 28.6139],
    impact_level: 'medium',
  },
  {
    id: 'seed-012',
    title: '乌克兰能源设施遭大规模空袭，基辅多地实施轮流限电',
    summary:
      '乌方称袭击针对发电与输电节点，西方承诺追加防空系统援助；俄方未就具体目标发表评论。',
    category: '军事安全',
    source: '半岛电视台',
    publishedAt: '2026-06-05T20:45:00+08:00',
    location: [30.5234, 50.4501],
    impact_level: 'critical',
  },
  {
    id: 'seed-013',
    title: '全球芯片供应链：台积电亚利桑那厂试产3nm，美国补贴细则落地',
    summary:
      '《芯片法案》首批拨款拨付加速，欧洲亦推进本土晶圆厂建设；成熟制程产能仍集中东亚，地缘风险溢价上升。',
    category: '政经',
    source: '华尔街日报',
    publishedAt: '2026-06-04T09:00:00+08:00',
    location: [-111.898, 33.306],
    impact_level: 'high',
  },
  {
    id: 'seed-014',
    title: '联合国气候大会预备会：发达国家1000亿美元气候融资仍未足额',
    summary:
      '77国集团呼吁扩大损失与损害基金规模；主要经济体就2030减排目标差距展开艰难谈判。',
    category: '国际局势',
    source: 'UN News',
    publishedAt: '2026-06-03T15:30:00+08:00',
    location: [7.4474, 46.948],
    impact_level: 'medium',
  },
  {
    id: 'seed-015',
    title: '中国—中亚峰会成果清单发布，跨境铁路与能源管道项目提速',
    summary:
      '中吉乌铁路可研进入实质阶段，里海沿岸天然气管道互联互通获新进展；人民币跨境结算占比继续提升。',
    category: '时政',
    source: '新华社',
    publishedAt: '2026-06-02T11:00:00+08:00',
    location: [76.9286, 43.2565],
    impact_level: 'medium',
  },
  {
    id: 'seed-016',
    title: '美国页岩油产量创纪录，WTI 原油跌破70美元关口',
    summary:
      'Permian盆地钻井活动反弹，OPEC+减产效果被非欧佩克增产部分抵消；炼厂毛利收窄，汽油零售价回落。',
    category: '能源市场',
    source: 'EIA / 路透',
    publishedAt: '2026-06-01T06:00:00+08:00',
    location: [-102.0779, 31.9973],
    impact_level: 'medium',
  },
  {
    id: 'seed-017',
    title: '朝鲜半岛局势：朝方试射新型战术弹道导弹，韩美延长联合军演',
    summary:
      '导弹飞行约600公里后落入东海；安理会紧急磋商未通过新决议，各方呼吁恢复对话渠道。',
    category: '军事安全',
    source: '韩联社',
    publishedAt: '2025-12-18T07:30:00+08:00',
    location: [125.7625, 39.0392],
    impact_level: 'high',
  },
  {
    id: 'seed-018',
    title: '金砖扩员后首次峰会：本币结算与应急储备安排获进展',
    summary:
      '新成员埃及、埃塞俄比亚等参与讨论跨境支付基础设施；西方媒体关注去美元化节奏与实质影响。',
    category: '国际局势',
    source: '路透社',
    publishedAt: '2025-10-23T14:00:00+08:00',
    location: [-47.8825, -15.7942],
    impact_level: 'medium',
  },
  {
    id: 'seed-019',
    title: '中国制造业PMI重返扩张区间，新订单与出口分项改善',
    summary:
      '5月官方PMI为50.4，生产指数连续三月回升；高技术制造业与装备制造业贡献主要增量。',
    category: '政经',
    source: '国家统计局',
    publishedAt: '2025-05-31T09:30:00+08:00',
    location: [116.4074, 39.9042],
    impact_level: 'medium',
  },
  {
    id: 'seed-020',
    title: '中东停火谈判陷入僵局，加沙人道援助通道再度受阻',
    summary:
      '斡旋方称关键分歧仍在人质交换与撤军时间表；联合国警告北部饥荒风险上升，呼吁开放更多口岸。',
    category: '国际局势',
    source: 'BBC 中文',
    publishedAt: '2025-03-15T19:00:00+08:00',
    location: [34.4668, 31.5017],
    impact_level: 'critical',
  },
  {
    id: 'seed-021',
    title: '欧洲议会通过《人工智能法案》最终版本，高风险系统监管落地',
    summary:
      '生成式AI须满足透明度与版权合规要求；违规企业最高面临全球营业额7%罚款，2026年起分阶段生效。',
    category: '政经',
    source: '欧洲议会新闻',
    publishedAt: '2024-12-13T12:00:00+08:00',
    location: [4.3517, 50.8503],
    impact_level: 'medium',
  },
  {
    id: 'seed-022',
    title: '全国两会释放2024年GDP增长目标约5%，赤字率拟按3%安排',
    summary:
      '政府工作报告强调稳预期、防风险，专项债额度扩大用于基建与保障性住房；民营经济促进法立法进程提速。',
    category: '时政',
    source: '新华社',
    publishedAt: '2024-03-05T10:00:00+08:00',
    location: [116.4074, 39.9042],
    impact_level: 'high',
  },
  {
    id: 'seed-023',
    title: '霍尔木兹海峡通行量监测：伊朗革命卫队海上演习规模扩大',
    summary:
      '全球约20%海运石油经此海峡；保险市场上调战争险费率，沙特与阿联酋备用管道运力评估启动。',
    category: '能源市场',
    source: '路透社',
    publishedAt: '2026-06-15T06:00:00+08:00',
    location: [56.27, 26.56],
    impact_level: 'high',
  },
  {
    id: 'seed-024',
    title: 'APEC 贸易部长会议：数字经贸规则与供应链韧性成焦点',
    summary:
      '成员经济体讨论跨境数据流动框架与绿色关税协调；中美双边渠道就关税审查保持沟通。',
    category: '政经',
    source: 'APEC 秘书处',
    publishedAt: '2026-06-14T16:30:00+08:00',
    location: [-79.5187, 8.9824],
    impact_level: 'medium',
  },
];

/** 种子快讯区域标签（未列出的默认为 global 通用） */
export const NEWS_SEED_REGION_MAP: Record<string, RegionId[]> = {
  'seed-001': ['china'],
  'seed-002': ['china'],
  'seed-003': ['north_america'],
  'seed-004': ['western_europe', 'eastern_europe'],
  'seed-005': ['middleeast', 'global'],
  'seed-006': ['eastern_europe', 'western_europe'],
  'seed-007': ['middleeast', 'global'],
  'seed-008': ['southeast_asia', 'china'],
  'seed-009': ['asia_pacific'],
  'seed-010': ['china'],
  'seed-011': ['asia_pacific'],
  'seed-012': ['eastern_europe'],
  'seed-013': ['north_america'],
  'seed-014': ['global'],
  'seed-015': ['china'],
  'seed-016': ['north_america', 'middleeast'],
  'seed-017': ['asia_pacific', 'china'],
  'seed-018': ['latin_america', 'global'],
  'seed-019': ['china'],
  'seed-020': ['middleeast'],
  'seed-021': ['western_europe'],
  'seed-022': ['china'],
  'seed-023': ['middleeast'],
  'seed-024': ['latin_america', 'asia_pacific'],
};

/** 为快讯条目补全 regionIds */
export function tagNewsFeedRegions(items: NewsFeedItem[]): NewsFeedItem[] {
  return items.map((item) => ({
    ...item,
    regionIds: item.regionIds ?? NEWS_SEED_REGION_MAP[item.id] ?? ['global'],
  }));
}

const DEFAULT_LOCATION: GeoPoint = [0, 0];

/** 将 NewsFeedItem 转为 EventDetail，供侧栏与地图联动 */
export function newsFeedItemToEventDetail(item: NewsFeedItem): EventDetail {
  return {
    id: item.id,
    title: item.title,
    source: item.source,
    timestamp: item.publishedAt,
    location: item.location ?? DEFAULT_LOCATION,
    impact_level: item.impact_level ?? 'medium',
    category: `news:${item.category}`,
    description: item.summary,
    url: item.url,
  };
}

/** 按发布时间降序排列 */
export function sortNewsFeedItems(items: NewsFeedItem[]): NewsFeedItem[] {
  return [...items].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}
