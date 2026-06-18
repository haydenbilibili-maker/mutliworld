/**
 * 实时信息流跑马灯 — 精选时政/政经/国际局势种子数据
 *
 * 与 NewsPanel（RSS 全文列表）区分：本 feed 侧重「快讯流」，
 * 提供简体中文标题、摘要、分类标签；可与 /api/news 实时条目混排。
 *
 * 时效性：全部种子为近 7 天内事件（由 useNewsFeed 中的时间过滤器统一控制）。
 * 当前日期基准：2026-06-18。覆盖全球主要区域与地缘热点。
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

/** 精选种子：2026 年 6 月，全部在 7 天时效窗口内，简体中文快讯 */
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
    title: '非洲联盟峰会：刚果（金）东部冲突升级，人道需求创近年新高',
    summary:
      '联刚稳定团报告称M23运动控制区域扩大，境内流离失所者超700万；非盟呼吁区域联合调解。',
    category: '国际局势',
    source: 'France24',
    publishedAt: '2026-06-16T13:00:00+08:00',
    location: [15.3275, -4.3224],
    impact_level: 'high',
  },
  {
    id: 'seed-018',
    title: '委内瑞拉反对派初选：国际观察团部署在即，选举路线图仍存分歧',
    summary:
      '巴巴多斯协议后选举谈判取得进展但仍未全面落实；美方维持部分制裁施压，巴西墨西哥参与调停。',
    category: '时政',
    source: '法新社',
    publishedAt: '2026-06-15T21:00:00+08:00',
    location: [-66.9036, 10.4806],
    impact_level: 'medium',
  },
  {
    id: 'seed-019',
    title: '缅甸军方宣布停火延期，反政府武装退出部分核心据点',
    summary:
      '中缅协调下，果敢同盟军与佤联军移交部分控制区至联邦政府；外媒分析停火仍脆弱。东盟特使拟再赴内比都。',
    category: '军事安全',
    source: '路透社',
    publishedAt: '2026-06-16T08:30:00+08:00',
    location: [96.1567, 21.9139],
    impact_level: 'high',
  },
  {
    id: 'seed-020',
    title: '巴基斯坦—塔利班边境口岸重开，双边贸易与人员往来恢复',
    summary:
      '伊斯兰堡与喀布尔就边境管控与过境贸易达成临时协议；托尔哈姆口岸通行量恢复至冲突前水平的70%。',
    category: '国际局势',
    source: 'BBC',
    publishedAt: '2026-06-14T20:00:00+08:00',
    location: [71.3353, 33.9504],
    impact_level: 'medium',
  },
  {
    id: 'seed-021',
    title: '亚马逊雨林保护：巴西新监测预警系统投入使用，森林砍伐同比下降25%',
    summary:
      '卢拉政府强化环境执法与土著领地保护，INPE卫星预警覆盖率提升至95%；挪威基金恢复对亚马逊基金捐款。',
    category: '国际局势',
    source: 'DW',
    publishedAt: '2026-06-15T14:00:00+08:00',
    location: [-60.0, -3.0],
    impact_level: 'medium',
  },
  {
    id: 'seed-022',
    title: '阿联酋计划新建140万吨低碳氢能基地，瞄准欧亚出口市场',
    summary:
      '马斯达尔城绿色氢能项目获40亿美元融资，2028年投产；日韩欧洲签署首批承购意向协议。',
    category: '能源市场',
    source: '彭博',
    publishedAt: '2026-06-14T06:00:00+08:00',
    location: [54.3726, 24.4681],
    impact_level: 'medium',
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
  {
    id: 'seed-025',
    title: '中非合作论坛部长级会议：100亿美元融资承诺与数字基建合作计划',
    summary:
      '中方宣布对非基建、卫生与数字经济领域新一轮融资；非方期待债务处理框架细化。非洲大陆自贸区秘书处出席。',
    category: '时政',
    source: '新华社',
    publishedAt: '2026-06-16T10:00:00+08:00',
    location: [31.2357, 30.0444],
    impact_level: 'high',
  },
  {
    id: 'seed-026',
    title: '格陵兰岛自治议会选举：独立派席次增加，资源开发成核心议题',
    summary:
      '稀土与铀矿开采讨论升温，丹麦政府表示尊重自决意愿；美方对格陵兰战略安全关切表态微妙。',
    category: '时政',
    source: 'DW',
    publishedAt: '2026-06-15T18:00:00+08:00',
    location: [-51.685, 64.180],
    impact_level: 'medium',
  },
  {
    id: 'seed-027',
    title: '缅甸中部强震后国际救援持续，死亡人数已逾1200',
    summary:
      '6.8级地震造成曼德勒至内比都沿线严重破坏；UN协调搜救并启动紧急响应基金。中国与东盟派遣救援队。',
    category: '国际局势',
    source: 'UN News',
    publishedAt: '2026-06-12T05:00:00+08:00',
    location: [96.089, 21.958],
    impact_level: 'critical',
  },
  {
    id: 'seed-028',
    title: '美国最高法院裁决：联邦机构可跨州监管跨境水质污染',
    summary:
      '5–4裁决扩大《清洁水法》适用范围，对下游州受上游州污染的案件确立联邦管辖权。企业合规成本料上升。',
    category: '时政',
    source: '美联社',
    publishedAt: '2026-06-16T22:00:00+08:00',
    location: [-77.0369, 38.9072],
    impact_level: 'medium',
  },
  {
    id: 'seed-029',
    title: '亚美尼亚与阿塞拜疆边界划定委员会达成第五段边界协议',
    summary:
      '涉及赞格祖尔走廊南段；欧盟观察团评估进展积极，俄方呼吁不排除其在南高加索的维和角色。',
    category: '国际局势',
    source: '法新社',
    publishedAt: '2026-06-13T15:00:00+08:00',
    location: [44.5, 40.17],
    impact_level: 'medium',
  },
  {
    id: 'seed-030',
    title: 'WSJ：英伟达新一代AI芯片Blackwell Pro流片成功，算力提升三倍',
    summary:
      '采用台积电N3P制程，预计Q4 2026开始交付；HBM4内存供应商海力士同步增产，AI资本支出周期维持高景气。',
    category: '政经',
    source: '华尔街日报',
    publishedAt: '2026-06-16T17:30:00+08:00',
    location: [-121.948, 37.393],
    impact_level: 'high',
  },
  {
    id: 'seed-031',
    title: '六方会谈韩美日副外长磋商：重申对朝威慑与对话双轨并行',
    summary:
      '三方协调应对朝核问题最新态势，就强化延伸威慑与导弹预警共享达成共识；中方呼吁保持克制。',
    category: '军事安全',
    source: '韩联社',
    publishedAt: '2026-06-13T09:00:00+08:00',
    location: [126.978, 37.5665],
    impact_level: 'medium',
  },
  {
    id: 'seed-032',
    title: 'SpaceX星舰第七次轨道试射：成功部署模拟星链载荷后回收',
    summary:
      '一级完成海面定点着陆，二级在轨重复点火验证成功；NASA高度关注快速复用能力对Artemis任务进度的支持。',
    category: '政经',
    source: 'SpaceX / NASA',
    publishedAt: '2026-06-15T22:00:00+08:00',
    location: [-97.438, 25.998],
    impact_level: 'high',
  },
  {
    id: 'seed-033',
    title: '联合国粮农组织警告：东非持续干旱威胁约4000万人粮食安全',
    summary:
      '埃塞俄比亚南部与索马里降水低于常年均值，FAO呼吁紧急农业援助扩大覆盖；全球谷物价格指数环比上升2%。',
    category: '国际局势',
    source: 'FAO / UN News',
    publishedAt: '2026-06-12T12:00:00+08:00',
    location: [38.746, 9.025],
    impact_level: 'high',
  },
  {
    id: 'seed-034',
    title: '东南亚数字经济报告发布：越南和印尼电商增速领跑区域',
    summary:
      'Google—淡马锡—贝恩联合报告显示区域数字经济规模达3950亿美元，数字金融与外卖服务增长强劲。',
    category: '政经',
    source: '日经亚洲',
    publishedAt: '2026-06-11T06:00:00+08:00',
    location: [106.629, -6.2146],
    impact_level: 'medium',
  },
  {
    id: 'seed-035',
    title: '以色列与沙特关系正常化谈判：蓬佩奥穿梭外交后安全安排轮廓浮现',
    summary:
      '美方提出延伸安全保证与民用核合作框架；沙特坚持巴勒斯坦建国路线图为前提条件。谈判窗口期为2026年底。',
    category: '国际局势',
    source: '半岛电视台',
    publishedAt: '2026-06-13T20:00:00+08:00',
    location: [46.675, 24.713],
    impact_level: 'high',
  },
  {
    id: 'seed-036',
    title: '诺贝尔和平奖得主尤努斯领导的孟加拉临时政府宣布年底大选计划',
    summary:
      '过渡政府完成选举委员会改组与选民名册更新；主要反对党BNP确认参选，国际观察员部署协调启动。',
    category: '时政',
    source: 'BBC',
    publishedAt: '2026-06-14T11:30:00+08:00',
    location: [90.4125, 23.7104],
    impact_level: 'medium',
  },
  {
    id: 'seed-037',
    title: '苏丹内战停火观察：吉达谈判重启，沙特与美国联合调停',
    summary:
      '快速支援部队同意部分撤出喀土穆；苏丹武装部队要求统一指挥框架；境内流离失所者超1000万。',
    category: '军事安全',
    source: 'France24',
    publishedAt: '2026-06-17T08:00:00+08:00',
    location: [32.559, 15.500],
    impact_level: 'critical',
  },
  {
    id: 'seed-038',
    title: '国际能源署（IEA）报告：2026年全球可再生能源装机预计新增700GW',
    summary:
      '中国与印度主导光伏新增，欧洲海风项目审批提速；电网适应性与储能部署成为制约瓶颈。',
    category: '能源市场',
    source: 'IEA / 彭博新能源',
    publishedAt: '2026-06-13T11:00:00+08:00',
    location: [2.295, 48.858],
    impact_level: 'medium',
  },
  {
    id: 'seed-039',
    title: '澳大利亚与美国达成稀土供应链协议，Lynas获50亿美元贷款扩建',
    summary:
      '合同锁定五年供应，分离产能扩至年产4万吨；五角大楼评估中国以外稀土来源对国防供应链的弹性贡献。',
    category: '政经',
    source: '路透社',
    publishedAt: '2026-06-17T15:00:00+08:00',
    location: [115.860, -31.950],
    impact_level: 'medium',
  },
  {
    id: 'seed-040',
    title: '阿根廷米莱政府宣布取消外汇管制，比索自由浮动首日贬值8%',
    summary:
      'IMF支持阿根廷经济改革并释放新一轮贷款；外汇储备仍处低位，市场关注通胀反弹与资本外流风险。',
    category: '政经',
    source: '彭博',
    publishedAt: '2026-06-17T20:00:00+08:00',
    location: [-58.381, -34.603],
    impact_level: 'high',
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
  'seed-017': ['global'],
  'seed-018': ['latin_america'],
  'seed-019': ['southeast_asia', 'china'],
  'seed-020': ['asia_pacific'],
  'seed-021': ['latin_america'],
  'seed-022': ['middleeast'],
  'seed-023': ['middleeast'],
  'seed-024': ['latin_america', 'asia_pacific'],
  'seed-025': ['global'],
  'seed-026': ['western_europe', 'north_america'],
  'seed-027': ['southeast_asia', 'china'],
  'seed-028': ['north_america'],
  'seed-029': ['eastern_europe', 'middleeast'],
  'seed-030': ['north_america', 'asia_pacific'],
  'seed-031': ['asia_pacific', 'north_america'],
  'seed-032': ['north_america'],
  'seed-033': ['global'],
  'seed-034': ['southeast_asia'],
  'seed-035': ['middleeast', 'north_america'],
  'seed-036': ['asia_pacific'],
  'seed-037': ['global'],
  'seed-038': ['global'],
  'seed-039': ['asia_pacific', 'north_america'],
  'seed-040': ['latin_america'],
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
