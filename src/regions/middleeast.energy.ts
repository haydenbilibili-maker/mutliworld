/**
 * 能源与经济模组 Mock 数据
 * 集中展示能源进出口影响、产能变化、经济影响及全球股市/能源价格
 * 数据可后续对接实时 API 或网络采集
 */

import type {
  EnergyImpactRegion,
  GlobalStockIndex,
  EnergyDataPoint,
  OilProducerMapPoint,
} from '@/types/middleeast';

/** 严重依赖中东能源的国家/地区：进出口与产能、经济影响（可替换为网络最新信息） */
export const energyImpactRegions: EnergyImpactRegion[] = [
  {
    id: 'region-eu',
    name: '欧洲',
    flag: '🇪🇺',
    dependency: '约 40% 石油、60% 以上天然气依赖进口，中东与北非为重要来源；霍尔木兹封锁将推高 LNG 与替代路线成本。',
    impact: '冲突升级后天然气期货大涨，多国启动应急储备与节能方案；欧盟称将加速非洲与挪威气源多元化。',
    source: 'Reuters / 欧盟能源署',
    updatedAt: '2026-06-14',
  },
  {
    id: 'region-us',
    name: '美国',
    flag: '🇺🇸',
    dependency: '本土页岩油增产后对中东原油依赖下降，但中东局势仍驱动全球油价与通胀预期。',
    impact: 'WTI 与 Brent 齐涨推高汽油价格；美联储关注能源通胀对利率路径影响；战略储备可短期缓冲。',
    source: 'EIA / 美联储',
    updatedAt: '2026-06-14',
  },
  {
    id: 'region-ru',
    name: '俄罗斯',
    flag: '🇷🇺',
    dependency: '自身为油气出口国，但中东动荡影响全球油价与俄油折扣幅度及出口路线。',
    impact: '国际油价上涨有利于俄财政；若霍尔木兹长期受阻，亚洲买家对俄油依赖或上升。',
    source: 'TASS / 路透',
    updatedAt: '2026-06-13',
  },
  {
    id: 'region-cn',
    name: '中国',
    flag: '🇨🇳',
    dependency: '约半数原油进口来自中东；霍尔木兹与波斯湾为关键航道，马六甲前段供应线敏感。',
    impact: '布伦特突破 84 美元后炼厂利润承压；发改委称将加强储备与多元进口；部分航线改道增加成本。',
    source: '新华社 / 国家发改委',
    updatedAt: '2026-06-14',
  },
  {
    id: 'region-in',
    name: '印度',
    flag: '🇮🇳',
    dependency: '约 80% 石油依赖进口，中东为主要来源；对伊朗、沙特、伊拉克供应高度敏感。',
    impact: '油价飙升加剧卢比与经常账户压力；政府考虑释放储备并寻求俄油等替代；通胀风险上升。',
    source: 'PTI / 印度石油部',
    updatedAt: '2026-06-14',
  },
  {
    id: 'region-jp',
    name: '日本',
    flag: '🇯🇵',
    dependency: '几乎全部石油与大量 LNG 依赖进口，中东占石油进口约 90%。',
    impact: '日经指数因避险情绪大跌；政府称将动用石油储备并协调 G7；企业成本与电价面临上行。',
    source: '共同社 / 经产省',
    updatedAt: '2026-06-14',
  },
  {
    id: 'region-kr',
    name: '韩国',
    flag: '🇰🇷',
    dependency: '石油与天然气几乎全部进口，中东为原油主要来源；炼化与石化业对油价敏感。',
    impact: '韩股与韩元双杀；炼厂毛利受压，政府拟释放储备并考虑临时减税稳油价。',
    source: 'Yonhap / 产业通商资源部',
    updatedAt: '2026-06-14',
  },
  {
    id: 'region-tr',
    name: '土耳其',
    flag: '🇹🇷',
    dependency: '约 90% 石油与大量天然气依赖进口，伊拉克、伊朗、俄罗斯为重要来源；博斯普鲁斯海峡为油运要道。',
    impact: '油价与气价上涨推高通胀；因吉尔利克基地对北约开放引发国内争议；里拉承压。',
    source: '安纳多卢 / 土耳其能源部',
    updatedAt: '2026-06-14',
  },
  {
    id: 'region-asean',
    name: '东盟（印尼/泰/马/菲等）',
    flag: '🇮🇩',
    dependency: '印尼、泰国等为原油净进口国，中东与西非为主要来源；新加坡为区域炼化与船燃枢纽。',
    impact: '区域股市与货币波动；炼厂成本上升；新加坡 VLCC 与成品油贸易受海峡风险影响。',
    source: '路透 / 东盟能源中心',
    updatedAt: '2026-06-13',
  },
  {
    id: 'region-au',
    name: '澳大利亚',
    flag: '🇦🇺',
    dependency: '自身为 LNG 与煤炭出口国，但成品油部分依赖进口；中东动荡影响亚洲 LNG 价与船运。',
    impact: 'LNG 出口亚洲价格抬升；若霍尔木兹长期受阻，澳气对日韩出口替代性增强。',
    source: '路透 / 澳能源部',
    updatedAt: '2026-06-13',
  },
  {
    id: 'region-ca',
    name: '加拿大',
    flag: '🇨🇦',
    dependency: '油气自给并出口美国；中东局势通过全球油价与 WTI 价差间接影响。',
    impact: 'WTI 与 Brent 价差扩大时加油出口美国竞争力变化；管道与港口出口受全球需求影响。',
    source: 'EIA / 加拿大自然资源部',
    updatedAt: '2026-06-13',
  },
]

/** 全球股市指数（可替换为实时行情接口）；含 lng/lat 用于能源视图地图展示 */
export const globalStockIndices: GlobalStockIndex[] = [
  { id: 'sp500', name: '标普 500', symbol: 'S&P 500', region: '美国', value: 6881.62, change: -42.5, changePercent: -0.61, updatedAt: '2026-06-14T21:00:00Z', lng: -74.0, lat: 40.71 },
  { id: 'dji', name: '道琼斯', symbol: 'DJI', region: '美国', value: 39102.4, change: -312.2, changePercent: -0.79, updatedAt: '2026-06-14T21:00:00Z', lng: -73.98, lat: 40.72 },
  { id: 'nasdaq', name: '纳斯达克', symbol: 'NASDAQ', region: '美国', value: 18234.1, change: -28.5, changePercent: -0.16, updatedAt: '2026-06-14T21:00:00Z', lng: -74.01, lat: 40.70 },
  { id: 'nikkei', name: '日经 225', symbol: 'Nikkei 225', region: '日本', value: 56629, change: -1427, changePercent: -2.46, updatedAt: '2026-06-14T06:00:00Z', lng: 139.75, lat: 35.68 },
  { id: 'kospi', name: '韩国综指', symbol: 'KOSPI', region: '韩国', value: 2654.2, change: -110.5, changePercent: -4.0, updatedAt: '2026-06-14T06:00:00Z', lng: 126.98, lat: 37.57 },
  { id: 'hsi', name: '恒生指数', symbol: 'HSI', region: '中国香港', value: 16280.5, change: -332.0, changePercent: -2.0, updatedAt: '2026-06-14T08:00:00Z', lng: 114.16, lat: 22.28 },
  { id: 'sse', name: '上证指数', symbol: 'SSE', region: '中国', value: 3024.8, change: -18.2, changePercent: -0.6, updatedAt: '2026-06-14T07:00:00Z', lng: 121.47, lat: 31.23 },
  { id: 'eurostoxx', name: '欧洲斯托克 50', symbol: 'EURO STOXX 50', region: '欧洲', value: 4952.3, change: -65.2, changePercent: -1.3, updatedAt: '2026-06-14T17:00:00Z', lng: 2.35, lat: 48.86 },
  { id: 'dax', name: '德国 DAX', symbol: 'DAX', region: '德国', value: 18234.0, change: -198.5, changePercent: -1.08, updatedAt: '2026-06-14T17:00:00Z', lng: 8.68, lat: 50.11 },
  { id: 'ftse', name: '富时 100', symbol: 'FTSE 100', region: '英国', value: 7642.1, change: -52.3, changePercent: -0.68, updatedAt: '2026-06-14T16:00:00Z', lng: -0.09, lat: 51.51 },
]

/** 能源地图：主要产油国/产区点位（首都或主要油气枢纽经纬度） */
export const oilProducerMapPoints: OilProducerMapPoint[] = [
  { id: 'oil-sa', name: '沙特阿拉伯', lng: 46.7, lat: 24.7, production: '约 950 万桶/日', exportShare: '全球主要出口国，霍尔木兹依赖高', note: '冲突后承诺稳供，部分设施曾遇袭', updatedAt: '2026-06-14T18:00:00Z' },
  { id: 'oil-ir', name: '伊朗', lng: 51.4, lat: 35.7, production: '约 320 万桶/日', exportShare: '受制裁出口受限，亚洲为主', note: '境内设施遭打击，出口能力波动', updatedAt: '2026-06-14T16:30:00Z' },
  { id: 'oil-iq', name: '伊拉克', lng: 44.4, lat: 33.3, production: '约 420 万桶/日', exportShare: '巴士拉港为出口枢纽', note: '海湾紧张影响南部出口与过境', updatedAt: '2026-06-14T14:00:00Z' },
  { id: 'oil-ae', name: '阿联酋', lng: 54.4, lat: 24.5, production: '约 320 万桶/日', exportShare: '富查伊拉等港口可绕行霍尔木兹', note: '部分改道好望角，成本上升', updatedAt: '2026-06-14T12:00:00Z' },
  { id: 'oil-kw', name: '科威特', lng: 47.97, lat: 29.37, production: '约 270 万桶/日', exportShare: '高度依赖海湾出口', note: '与沙特共管中立区产量受影响', updatedAt: '2026-06-13T20:00:00Z' },
  { id: 'oil-qa', name: '卡塔尔', lng: 51.5, lat: 25.3, production: '约 60 万桶/日油 + 全球最大 LNG', exportShare: 'LNG 出口欧洲/亚洲', note: '天然气船运紧张推高 TTF 等', updatedAt: '2026-06-14T10:00:00Z' },
  { id: 'oil-om', name: '阿曼', lng: 58.4, lat: 23.6, production: '约 100 万桶/日', exportShare: '部分经霍尔木兹', note: '可经阿曼湾出口', updatedAt: '2026-06-13T18:00:00Z' },
  { id: 'oil-bh', name: '巴林', lng: 50.58, lat: 26.23, production: '约 20 万桶/日', exportShare: '与沙特管线相连', note: '地区金融与炼化枢纽；美第五舰队总部所在', updatedAt: '2026-06-14T08:00:00Z' },
  { id: 'oil-ru', name: '俄罗斯', lng: 37.6, lat: 55.75, production: '约 950 万桶/日', exportShare: '欧洲转向亚洲，折扣与航线敏感', note: '油价上涨利好财政；乌拉尔与远东出口增加', updatedAt: '2026-06-13T16:00:00Z' },
  { id: 'oil-ye', name: '也门', lng: 44.2, lat: 15.4, production: '战前约 7 万桶/日，当前几乎停产', exportShare: '红海出口曾经曼德海峡', note: '胡塞控制区；油轮与港口屡遭袭', updatedAt: '2026-06-12T12:00:00Z' },
  { id: 'oil-ly-jun', name: '利比亚', lng: 13.18, lat: 32.89, production: '约 120 万桶/日', exportShare: '地中海出口', note: '内战分裂影响产量', updatedAt: '2026-06-14T10:00:00Z' },
  { id: 'oil-tr-jun', name: '土耳其', lng: 32.86, lat: 39.93, production: '约 6 万桶/日', exportShare: '过境枢纽', note: '黑海—地中海能源通道', updatedAt: '2026-06-13T08:00:00Z' },
]

/** 能源价格与产能（可替换为实时数据源） */
export const energyDataPoints: EnergyDataPoint[] = [
  { id: 'brent', name: '布伦特原油', unit: '美元/桶', value: 84.2, change: 8.5, changePercent: 11.2, description: '伊朗袭击海湾出口设施后跳涨', updatedAt: '2026-06-14T18:00:00Z', source: 'ICE' },
  { id: 'wti', name: 'WTI 原油', unit: '美元/桶', value: 69.6, change: 4.2, changePercent: 6.4, description: '美油跟涨，关注战略储备', updatedAt: '2026-06-14T18:00:00Z', source: 'NYMEX' },
  { id: 'henry-hub', name: '亨利港天然气', unit: '美元/百万英热', value: 2.82, change: 0.18, changePercent: 6.8, description: '中东风险溢价推高气价', updatedAt: '2026-06-14T17:00:00Z', source: 'NYMEX' },
  { id: 'ttf', name: '欧洲 TTF 天然气', unit: '欧元/MWh', value: 38.5, change: 4.2, changePercent: 12.2, description: '霍尔木兹紧张推升欧洲气价', updatedAt: '2026-06-14T17:00:00Z', source: 'ICE' },
  { id: 'opec-production', name: 'OPEC 产量', unit: '万桶/日', value: 2680, change: -120, description: '部分海湾设施遇袭影响短期产量', updatedAt: '2026-06-13T12:00:00Z', source: 'OPEC 月报' },
  { id: 'hormuz-traffic', name: '霍尔木兹过境', unit: '艘/日', value: 12, description: '冲突后过境船只显著减少', updatedAt: '2026-06-14T10:00:00Z', source: '船运追踪' },
  { id: 'asian-lng', name: '亚洲 LNG 现货', unit: '美元/百万英热', value: 14.2, change: 1.8, changePercent: 14.5, description: '中东风险与欧洲抢气推高亚洲到岸价', updatedAt: '2026-06-14T12:00:00Z', source: 'S&P' },
  { id: 'refinery-margin', name: '新加坡炼厂毛利', unit: '美元/桶', value: 4.8, change: -0.6, description: '原油涨速快于成品油，炼厂利润收窄', updatedAt: '2026-06-14T08:00:00Z', source: '普氏' },
  { id: 'us-spr', name: '美国战略石油储备', unit: '百万桶', value: 358, change: -2, description: '冲突后小幅释放以稳市场', updatedAt: '2026-06-13T18:00:00Z', source: 'EIA' },
  { id: 'dubai-crude', name: '迪拜原油', unit: '美元/桶', value: 82.8, change: 7.2, changePercent: 9.5, description: '中东基准价，亚洲炼厂参考', updatedAt: '2026-06-14T14:00:00Z', source: '普氏' },
  { id: 'eu-gas-storage', name: '欧盟天然气库存', unit: '% 满', value: 58, change: -3, description: '冬季末库存高于五年均值，但 TTF 波动大', updatedAt: '2026-06-13T12:00:00Z', source: 'GIE' },
  { id: 'japan-lng', name: '日本 LNG 到岸价', unit: '美元/百万英热', value: 15.1, change: 2.1, changePercent: 16.2, description: '中东与澳洲货源紧张推高到岸价', updatedAt: '2026-06-14T06:00:00Z', source: '日本经产省' },
  { id: 'bunker-fuel', name: '船用燃料油（新加坡）', unit: '美元/吨', value: 548, change: 42, changePercent: 8.3, description: '绕行好望角增加航程与燃油需求', updatedAt: '2026-06-14T08:00:00Z', source: '普氏' },
]
