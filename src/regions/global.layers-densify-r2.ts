/**
 * 第二轮增密 · 全球主题/战略图层扩展（2026-06-10 至 06-16）
 */
import type { ImpactLevel, LayerId } from '@/types/geo';
import type { ThematicPoint, PipelineRoute } from './global.thematic';
import type { GarrisonBase } from './global.garrisons';
import type { InfraPoint } from './global.infrastructure';
import type { LaunchSitePoint } from './global.launchSites';
import type { SemiconductorFab } from './global.semiconductors';
import type { SeabedMiningArea } from './global.deepSeaMining';
import type { TectonicFeature } from './global.tectonics';
import type { CableIncident } from './global.cableIncidents';

const T = '2026-06-16T10:00:00Z';
const T2 = '2026-06-15T08:00:00Z';
const T3 = '2026-06-14T12:00:00Z';

export const DENSIFY_ECON_HUBS: ThematicPoint[] = [
  { id: 'r2-hub-boston', name: '波士顿', layerId: 'econ_hubs', lng: -71.06, lat: 42.36, note: '生物科技与风投中心', impact: 'high' },
  { id: 'r2-hub-chicago', name: '芝加哥', layerId: 'econ_hubs', lng: -87.63, lat: 41.88, note: '期货与衍生品交易中心', impact: 'high' },
  { id: 'r2-hub-houston', name: '休斯顿', layerId: 'econ_hubs', lng: -95.37, lat: 29.76, note: '全球能源交易与炼化中心', impact: 'high' },
  { id: 'r2-hub-milan', name: '米兰', layerId: 'econ_hubs', lng: 9.19, lat: 45.46, note: '意大利金融与时尚产业枢纽', impact: 'medium' },
  { id: 'r2-hub-madrid', name: '马德里', layerId: 'econ_hubs', lng: -3.7, lat: 40.42, note: '伊比利亚半岛金融核心', impact: 'medium' },
  { id: 'r2-hub-stockholm', name: '斯德哥尔摩', layerId: 'econ_hubs', lng: 18.07, lat: 59.33, note: '北欧创新与独角兽中心', impact: 'medium' },
  { id: 'r2-hub-oslo', name: '奥斯陆', layerId: 'econ_hubs', lng: 10.75, lat: 59.91, note: '主权财富基金管理中心', impact: 'medium' },
  { id: 'r2-hub-cairo', name: '开罗', layerId: 'econ_hubs', lng: 31.24, lat: 30.04, note: '北非最大经济体金融核心', impact: 'medium' },
  { id: 'r2-hub-lagos', name: '拉各斯', layerId: 'econ_hubs', lng: 3.38, lat: 6.52, note: '西非金融科技与创投中心', impact: 'medium' },
  { id: 'r2-hub-bangkok', name: '曼谷', layerId: 'econ_hubs', lng: 100.5, lat: 13.75, note: '东盟金融与旅游枢纽', impact: 'medium' },
  { id: 'r2-hub-kuala', name: '吉隆坡', layerId: 'econ_hubs', lng: 101.69, lat: 3.14, note: '伊斯兰金融与东盟贸易中心', impact: 'medium' },
  { id: 'r2-hub-jakarta', name: '雅加达', layerId: 'econ_hubs', lng: 106.85, lat: -6.21, note: '东南亚最大经济体首都', impact: 'medium' },
];

export const DENSIFY_MINERALS: ThematicPoint[] = [
  { id: 'r2-min-zambia-copper', name: '赞比亚铜矿带', layerId: 'minerals', lng: 28.3, lat: -12.8, note: '非洲重要铜产区', impact: 'high', subKind: 'copper' },
  { id: 'r2-min-drc-cobalt2', name: '科卢韦齐 · 钴铜', layerId: 'minerals', lng: 25.47, lat: -10.72, note: '全球最大钴矿之一', impact: 'critical', subKind: 'cobalt' },
  { id: 'r2-min-australia-lithium', name: '西澳格林布什 · 锂', layerId: 'minerals', lng: 116.05, lat: -33.85, note: '全球最大硬岩锂矿', impact: 'critical', subKind: 'lithium' },
  { id: 'r2-min-china-graphite', name: '黑龙江石墨矿', layerId: 'minerals', lng: 130.3, lat: 47.3, note: '电池负极材料供应', impact: 'high', subKind: 'graphite' },
  { id: 'r2-min-turkey-chrome', name: '土耳其铬矿', layerId: 'minerals', lng: 32.8, lat: 40.5, note: '不锈钢关键原料', impact: 'medium', subKind: 'chrome' },
  { id: 'r2-min-philippines-nickel', name: '菲律宾镍矿', layerId: 'minerals', lng: 125.5, lat: 9.5, note: '亚洲镍矿出口主力', impact: 'high', subKind: 'nickel' },
  { id: 'r2-min-south-africa-platinum', name: '南非铂族金属', layerId: 'minerals', lng: 27.5, lat: -25.5, note: '全球铂钯供应核心', impact: 'high', subKind: 'platinum' },
  { id: 'r2-min-morocco-phosphate', name: '摩洛哥磷酸盐', layerId: 'minerals', lng: -6.8, lat: 32.5, note: '全球肥料原料垄断', impact: 'high', subKind: 'phosphate' },
  { id: 'r2-min-russia-palladium', name: '俄罗斯诺里尔斯克 · 钯', layerId: 'minerals', lng: 88.2, lat: 69.35, note: '全球钯供应关键', impact: 'critical', subKind: 'palladium' },
  { id: 'r2-min-canada-uranium', name: '加拿大萨斯喀彻温 · 铀', layerId: 'minerals', lng: -105.0, lat: 58.0, note: '全球铀矿主产区', impact: 'high', subKind: 'uranium' },
];

export const DENSIFY_DATACENTERS: ThematicPoint[] = [
  { id: 'r2-dc-portland', name: '俄勒冈州', layerId: 'datacenters', lng: -122.68, lat: 45.52, note: '绿色能源算力集群', impact: 'high' },
  { id: 'r2-dc-atlanta', name: '亚特兰大', layerId: 'datacenters', lng: -84.39, lat: 33.75, note: '东南部互联枢纽', impact: 'medium' },
  { id: 'r2-dc-amsterdam', name: '阿姆斯特丹', layerId: 'datacenters', lng: 4.9, lat: 52.37, note: '欧洲互联网交换中心', impact: 'high' },
  { id: 'r2-dc-paris', name: '巴黎', layerId: 'datacenters', lng: 2.35, lat: 48.86, note: '欧洲主权云节点', impact: 'medium' },
  { id: 'r2-dc-mumbai2', name: '孟买 Navi', layerId: 'datacenters', lng: 73.02, lat: 19.03, note: '南亚算力扩张', impact: 'medium' },
  { id: 'r2-dc-beijing', name: '北京', layerId: 'datacenters', lng: 116.4, lat: 39.9, note: '中国AI算力政策试点', impact: 'high' },
  { id: 'r2-dc-shenzhen', name: '深圳', layerId: 'datacenters', lng: 114.06, lat: 22.55, note: '大湾区算力枢纽', impact: 'high' },
  { id: 'r2-dc-melbourne', name: '墨尔本', layerId: 'datacenters', lng: 144.96, lat: -37.81, note: '澳新南部算力中心', impact: 'medium' },
];

export const DENSIFY_PROTESTS: ThematicPoint[] = [
  { id: 'r2-pro-athens', name: '雅典 · 劳工抗议', layerId: 'protests', lng: 23.73, lat: 37.98, note: '养老金改革示威', impact: 'medium', updatedAt: T },
  { id: 'r2-pro-warsaw', name: '华沙 · 农民抗议', layerId: 'protests', lng: 21.01, lat: 52.23, note: '欧盟农业政策不满', impact: 'medium', updatedAt: T2 },
  { id: 'r2-pro-bangkok', name: '曼谷 · 政治集会', layerId: 'protests', lng: 100.5, lat: 13.75, note: '宪法改革诉求', impact: 'medium', updatedAt: T3 },
  { id: 'r2-pro-nairobi', name: '内罗毕 · 财政抗议', layerId: 'protests', lng: 36.82, lat: -1.29, note: '税收上涨示威', impact: 'medium', updatedAt: T2 },
  { id: 'r2-pro-tehran', name: '德黑兰 · 社会诉求', layerId: 'protests', lng: 51.42, lat: 35.69, note: '公民权利集会', impact: 'high', updatedAt: T },
  { id: 'r2-pro-seoul2', name: '首尔 · 医疗改革', layerId: 'protests', lng: 126.98, lat: 37.57, note: '医生罢工持续', impact: 'medium', updatedAt: T3 },
];

export const DENSIFY_CLIMATE: ThematicPoint[] = [
  { id: 'r2-cli-pakistan-flood', name: '巴基斯坦 · 洪涝', layerId: 'climate', lng: 68.37, lat: 25.4, note: '季风强降雨致灾', impact: 'critical', updatedAt: T, subKind: 'flood' },
  { id: 'r2-cli-thailand-drought', name: '泰国 · 干旱', layerId: 'climate', lng: 100.5, lat: 14.0, note: '湄南河水位偏低', impact: 'high', updatedAt: T2, subKind: 'drought' },
  { id: 'r2-cli-norway-heat', name: '挪威 · 异常高温', layerId: 'climate', lng: 10.75, lat: 60.0, note: '北极圈暖化加速', impact: 'medium', updatedAt: T3, subKind: 'heatwave' },
  { id: 'r2-cli-africa-sahel', name: '萨赫勒 · 沙漠化', layerId: 'climate', lng: 2.0, lat: 14.0, note: '土地退化与粮食危机', impact: 'high', updatedAt: T, subKind: 'drought' },
  { id: 'r2-cli-pacific-cyclone', name: '太平洋 · 气旋预警', layerId: 'climate', lng: 170.0, lat: -15.0, note: '热带气旋逼近岛国', impact: 'high', updatedAt: T2, subKind: 'storm' },
  { id: 'r2-cli-europe-flood', name: '中欧 · 洪涝', layerId: 'climate', lng: 15.0, lat: 50.0, note: '极端降雨致河流水位上涨', impact: 'high', updatedAt: T3, subKind: 'flood' },
];

export const DENSIFY_PIPELINES: PipelineRoute[] = [
  { id: 'r2-pipe-yamal', name: '亚马尔—欧洲管道', coordinates: [[70.0, 68.0], [50.0, 60.0], [30.0, 55.0], [15.0, 52.0]], note: '俄气经白俄罗斯至欧洲', impact: 'high' },
  { id: 'r2-pipe-caspian', name: '里海原油管道', coordinates: [[51.0, 40.0], [48.0, 42.0], [44.0, 43.0], [40.0, 42.5]], note: '哈萨克斯坦至黑海出口', impact: 'medium' },
  { id: 'r2-pipe-transmed', name: '跨地中海管道', coordinates: [[9.0, 36.8], [12.0, 38.0], [15.0, 40.0], [18.0, 41.5]], note: '阿尔及利亚至意大利', impact: 'medium' },
  { id: 'r2-pipe-atlantic', name: '大西洋液化天然气', coordinates: [[-52.0, -23.0], [-45.0, -20.0], [-38.0, -15.0], [-35.0, -8.0]], note: '巴西至加勒比LNG航线', impact: 'low' },
];

export const DENSIFY_GARRISONS: GarrisonBase[] = [
  { id: 'r2-gar-thule', name: '图勒空军基地', country: 'us', lng: -68.7, lat: 76.5, role: '北极战略预警（格陵兰）', impact: 'medium' },
  { id: 'r2-gar-sigonella', name: '西西里锡戈内拉', country: 'us', lng: 14.92, lat: 37.4, role: '地中海海军航空枢纽（意大利）', impact: 'medium' },
  { id: 'r2-gar-stuttgart', name: '斯图加特军营', country: 'us', lng: 9.18, lat: 48.78, role: '美军欧洲司令部（德国）', impact: 'high' },
  { id: 'r2-gar-spangdahlem', name: '斯潘达勒姆基地', country: 'us', lng: 6.69, lat: 49.97, role: '欧洲战斗机前沿（德国）', impact: 'medium' },
  { id: 'r2-gar-misawa', name: '三泽空军基地', country: 'us', lng: 141.37, lat: 40.7, role: '日本北部防空（日本）', impact: 'medium' },
  { id: 'r2-gar-iwakuni', name: '岩国海军航空站', country: 'us', lng: 132.24, lat: 34.14, role: '海军陆战队航空（日本）', impact: 'medium' },
  { id: 'r2-gar-pohang', name: '浦项海军基地', country: 'us', lng: 129.38, lat: 36.03, role: '韩美联合海上训练节点', impact: 'low' },
  { id: 'r2-gar-djibouti-jp', name: '吉布提自卫队基地', country: 'us', lng: 43.1, lat: 11.55, role: '日本首个海外基地（驻吉布提）', impact: 'medium' },
  { id: 'r2-gar-uae-dhafra', name: '达夫拉空军基地', country: 'us', lng: 54.55, lat: 24.25, role: '中东空中加油枢纽（阿联酋）', impact: 'high' },
  { id: 'r2-gar-oman-thumrait', name: '图姆赖特空军基地', country: 'us', lng: 56.64, lat: 17.67, role: '阿曼美军合作基地', impact: 'medium' },
  { id: 'r2-gar-kenya-manda', name: '曼达湾基地', country: 'us', lng: 40.9, lat: -2.28, role: '东非反恐前沿（肯尼亚）', impact: 'low' },
  { id: 'r2-gar-niger-air', name: '尼亚美空军基地', country: 'us', lng: 2.18, lat: 13.48, role: '萨赫勒无人机行动（尼日尔）', impact: 'medium' },
];

export const DENSIFY_INFRA: InfraPoint[] = [
  { id: 'r2-infra-panama', name: '巴拿马运河船闸', layerId: 'maritime', lng: -79.92, lat: 9.08, note: '全球贸易咽喉', impact: 'critical' },
  { id: 'r2-infra-suez', name: '苏伊士运河', layerId: 'maritime', lng: 32.35, lat: 30.45, note: '欧亚航运捷径', impact: 'critical' },
  { id: 'r2-infra-malacca', name: '马六甲海峡', layerId: 'maritime', lng: 102.25, lat: 2.3, note: '全球最繁忙航道', impact: 'critical' },
  { id: 'r2-infra-hormuz', name: '霍尔木兹海峡', layerId: 'maritime', lng: 56.5, lat: 26.5, note: '石油运输咽喉', impact: 'critical' },
  { id: 'r2-infra-bab', name: '曼德海峡', layerId: 'maritime', lng: 43.3, lat: 12.6, note: '红海出入口', impact: 'high' },
  { id: 'r2-infra-bosporus', name: '博斯普鲁斯海峡', layerId: 'maritime', lng: 29.05, lat: 41.12, note: '黑海通往地中海', impact: 'high' },
  { id: 'r2-infra-gibraltar', name: '直布罗陀海峡', layerId: 'maritime', lng: -5.35, lat: 36.0, note: '地中海与大西洋连接', impact: 'high' },
  { id: 'r2-infra-dover', name: '英吉利海峡', layerId: 'maritime', lng: 1.5, lat: 50.9, note: '英法海底隧道', impact: 'medium' },
  { id: 'r2-infra-taiwan', name: '台湾海峡', layerId: 'maritime', lng: 119.5, lat: 24.5, note: '东亚航运要道', impact: 'critical' },
  { id: 'r2-infra-lombok', name: '龙目海峡', layerId: 'maritime', lng: 116.0, lat: -8.5, note: '马六甲替代航道', impact: 'medium' },
];

export const DENSIFY_LAUNCH_SITES: LaunchSitePoint[] = [
  { id: 'r2-launch-vandenberg', name: '范登堡太空军基地', lng: -120.62, lat: 34.74, operator: 'USSF', status: 'active', note: '极地轨道发射', impact: 'high' },
  { id: 'r2-launch-wallops', name: '瓦勒普斯飞行设施', lng: -75.47, lat: 37.94, operator: 'NASA', status: 'active', note: '小型卫星发射', impact: 'medium' },
  { id: 'r2-launch-baikonur', name: '拜科努尔', lng: 63.34, lat: 45.96, operator: 'Roscosmos', status: 'active', note: '联盟号载人发射', impact: 'high' },
  { id: 'r2-launch-plesetsk', name: '普列谢茨克', lng: 40.58, lat: 62.93, operator: 'Roscosmos', status: 'active', note: '俄军事卫星发射', impact: 'high' },
  { id: 'r2-launch-tanegashima', name: '种子岛', lng: 131.0, lat: 30.4, operator: 'JAXA', status: 'active', note: 'H-IIA火箭发射场', impact: 'medium' },
  { id: 'r2-launch-sriharikota', name: '萨迪什·达万', lng: 80.23, lat: 13.72, operator: 'ISRO', status: 'active', note: '印度主力发射场', impact: 'high' },
  { id: 'r2-launch-kourou', name: '圭亚那航天中心', lng: -52.77, lat: 5.24, operator: 'ESA', status: 'active', note: '阿丽亚娜火箭', impact: 'high' },
  { id: 'r2-launch-xichang', name: '西昌卫星发射中心', lng: 102.03, lat: 28.25, operator: 'CNSA', status: 'active', note: '北斗与探月发射', impact: 'high' },
  { id: 'r2-launch-jiuquan', name: '酒泉卫星发射中心', lng: 100.29, lat: 40.96, operator: 'CNSA', status: 'active', note: '载人航天发射', impact: 'critical' },
  { id: 'r2-launch-starbase', name: '星舰基地', lng: -97.16, lat: 25.99, operator: 'SpaceX', status: 'active', note: '超重火箭测试', impact: 'high' },
];

export const DENSIFY_SEMICONDUCTORS: SemiconductorFab[] = [
  { id: 'r2-fab-tsmc-arizona2', name: '亚利桑那 Fab 21', operator: '台积电', lng: -111.9, lat: 33.4, kind: 'foundry', status: 'planned', note: '3nm美国在地化', impact: 'critical' },
  { id: 'r2-fab-samsung-giheung', name: '器兴 · 三星', operator: '三星电子', lng: 127.08, lat: 37.2, kind: 'memory', status: 'active', note: 'DRAM与NAND', impact: 'high' },
  { id: 'r2-fab-micron-hiroshima', name: '广岛 · 美光', operator: '美光', lng: 132.46, lat: 34.4, kind: 'memory', status: 'active', note: '日本DRAM基地', impact: 'high' },
  { id: 'r2-fab-tower-israel', name: '米格达罗 · Tower', operator: 'Tower Semiconductor', lng: 34.95, lat: 32.84, kind: 'foundry', status: 'active', note: '模拟与功率半导体', impact: 'medium' },
  { id: 'r2-fab-infineon-dresden', name: '德累斯顿 · 英飞凌', operator: 'Infineon', lng: 13.73, lat: 51.05, kind: 'idm', status: 'active', note: '车用功率芯片', impact: 'high' },
  { id: 'r2-fab-renesas-naka', name: '那珂 · 瑞萨', operator: 'Renesas', lng: 140.55, lat: 36.45, kind: 'idm', status: 'active', note: '汽车MCU核心', impact: 'high' },
  { id: 'r2-fab-wafer-wuxi', name: '无锡 · 华虹', operator: '华虹半导体', lng: 120.35, lat: 31.55, kind: 'foundry', status: 'active', note: '成熟制程扩产', impact: 'high' },
  { id: 'r2-fab-cansemi-guangzhou', name: '广州 · 粤芯', operator: '粤芯半导体', lng: 113.5, lat: 23.2, kind: 'foundry', status: 'active', note: '模拟与功率器件', impact: 'medium' },
];

export const DENSIFY_DEEP_SEA: SeabedMiningArea[] = [
  { id: 'r2-sea-clarion', name: '克利珀顿断裂带', resource: 'nodules', lng: -115.0, lat: 10.0, note: '太平洋深海采矿试点', impact: 'medium' },
  { id: 'r2-sea-indian-ridge', name: '印度洋中脊硫化物', resource: 'sulphides', lng: 65.0, lat: -25.0, note: '深海矿产勘探', impact: 'low' },
  { id: 'r2-sea-atlantic', name: '大西洋中脊勘探', resource: 'sulphides', lng: -30.0, lat: 35.0, note: '欧方深海采矿许可', impact: 'medium' },
];

export const DENSIFY_TECTONICS: TectonicFeature[] = [
  { id: 'r2-tec-nankai', name: '南海海槽俯冲带', kind: 'convergent', lng: 135.0, lat: 33.0, note: '日本大地震风险区', impact: 'critical' },
  { id: 'r2-tec-new-zealand', name: '阿尔卑斯断层（新西兰）', kind: 'transform', lng: 172.0, lat: -43.5, note: '新西兰南岛地震带', impact: 'high' },
  { id: 'r2-tec-philippine', name: '菲律宾海沟', kind: 'convergent', lng: 126.0, lat: 12.0, note: '西太平洋俯冲带', impact: 'high' },
  { id: 'r2-tec-caribbean', name: '加勒比板块边界', kind: 'transform', lng: -70.0, lat: 18.0, note: '海地地震多发区', impact: 'medium' },
  { id: 'r2-tec-mid-atlantic-ridge', name: '中大西洋海岭北段', kind: 'divergent', lng: -35.0, lat: 55.0, note: '冰岛以南板块离散', impact: 'low' },
];

export const DENSIFY_CABLE_INCIDENTS: CableIncident[] = [
  // ── 历史整理（06 月上旬）──
  { id: 'r2-cab-redsea-2', name: '红海 SEA-ME-WE 受损', date: '2026-06-16', lng: 42.5, lat: 15.0, note: '胡塞袭击余波致多条光缆中断', source: '公开态势整理', impact: 'critical' },
  { id: 'r2-cab-taiwan-2', name: '台湾海峡电缆维护', date: '2026-06-15', lng: 119.5, lat: 24.5, note: '地震后例行检修', source: '公开态势整理', impact: 'medium' },
  { id: 'r2-cab-atlantic-2', name: '大西洋 FLAG 中断', date: '2026-06-14', lng: -40.0, lat: 45.0, note: '渔船锚泊致损', source: '公开态势整理', impact: 'high' },
  { id: 'r2-cab-south-china', name: '南海 AAG 电缆', date: '2026-06-13', lng: 112.0, lat: 12.0, note: '例行维护延期', source: '公开态势整理', impact: 'low' },
  // ── 06-17~23 近期事件（时效增密）──
  { id: 'r2-cab-baltic-kit', name: '波罗的海 Kittilä 海缆中断', date: '2026-06-19', lng: 22.5, lat: 60.5, note: '芬兰西部海底通信电缆断裂，疑遭人为破坏', source: '芬兰交通通信局 / 公开报道（2026-06）', impact: 'high' },
  { id: 'r2-cab-norway-svalbard', name: '挪威-斯瓦尔巴 光缆受损', date: '2026-06-20', lng: 15.0, lat: 70.0, note: '北极科考数据链路中断，卫星地面站受影响', source: 'Space Norway 公告（2026-06）', impact: 'high' },
  { id: 'r2-cab-redsea-3', name: '红海 TGN-EA 修复后再中断', date: '2026-06-21', lng: 43.0, lat: 14.2, note: '修复段二次受损，东非互联网降速持续', source: 'Telecom Italia Sparkle 公告（2026-06）', impact: 'critical' },
  { id: 'r2-cab-singapore-jakarta', name: '新加坡-雅加达 IBC 电缆', date: '2026-06-22', lng: 105.5, lat: -3.0, note: '马六甲海域锚损，东南亚拥塞绕行', source: '区域运营商联合公告（2026-06）', impact: 'medium' },
  { id: 'r2-cab-uk-norway', name: '北海 SHEFA-2 电缆', date: '2026-06-23', lng: -2.0, lat: 58.5, note: '苏格兰-设得兰通信降级，备用链路激活', source: 'Faroese Telecom 公告（2026-06）', impact: 'medium' },
];
