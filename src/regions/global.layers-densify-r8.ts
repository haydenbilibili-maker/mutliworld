/**
 * 第八轮增密 · 地表/洋底战略图层 + 时效事件（2026-06-24）
 *
 *  - semiconductors：补成熟制程/功率半导体/封装测试节点
 *  - deep_sea_mining：补 ISA 勘探合同区与 2026 政策争议点
 *  - hydrocarbon_reserves：补页岩油/LNG/战略气田
 *  - cable_incidents：06-20~24 近期海缆事件
 *  - protests / climate：当下社会与极端天气监测点
 *
 * 坐标为公开资料示意位置，非精确/实时数据。整理日：2026-06-24。
 */

import type { ThematicPoint } from './global.thematic';
import type { SemiconductorFab } from './global.semiconductors';
import type { SeabedMiningArea } from './global.deepSeaMining';
import type { HydrocarbonReserveSite } from './global.hydrocarbon';
import type { CableIncident } from './global.cableIncidents';

const T = '2026-06-24T10:00:00Z';
const T2 = '2026-06-23T08:00:00Z';
const T3 = '2026-06-22T16:00:00Z';

// ───────────────────────────────────────────────────────────────
// semiconductors 第三轮
// ───────────────────────────────────────────────────────────────
export const DENSIFY_SEMICONDUCTORS_R8: SemiconductorFab[] = [
  { id: 'r8-fab-onsemi', name: '新罕布什尔 · onsemi', operator: 'onsemi', lng: -71.54, lat: 42.99, kind: 'idm', status: 'active', note: '功率/SiC 器件北美主基地', impact: 'high' },
  { id: 'r8-fab-wolfspeed-moh', name: '莫霍克谷 · Wolfspeed', operator: 'Wolfspeed', lng: -75.42, lat: 43.0, kind: 'idm', status: 'active', note: '全球最大 200mm SiC 晶圆厂', impact: 'critical' },
  { id: 'r8-fab-psmc', name: '新竹 · 力积电 P5', operator: '力积电', lng: 121.0, lat: 24.78, kind: 'memory', status: 'active', note: 'DRAM 与代工扩产', impact: 'medium' },
  { id: 'r8-fab-vanguard', name: '新竹 · 世界先进', operator: '世界先进', lng: 121.01, lat: 24.79, kind: 'foundry', status: 'active', note: '8 英寸成熟制程代工龙头', impact: 'high' },
  { id: 'r8-fab-ase-kaohsiung', name: '高雄 · ASE', operator: '日月光', lng: 120.31, lat: 22.62, kind: 'foundry', status: 'active', note: '全球最大封测基地之一', impact: 'high' },
  { id: 'r8-fab-amkor-penang', name: '槟城 · Amkor', operator: 'Amkor', lng: 100.33, lat: 5.42, kind: 'foundry', status: 'active', note: '先进封装（2.5D/3D）东南亚枢纽', impact: 'high' },
  { id: 'r8-fab-xtal-xian', name: '西安 · 三星存储', operator: '三星电子', lng: 108.94, lat: 34.26, kind: 'memory', status: 'active', note: '中国最大外资半导体工厂（NAND）', impact: 'critical' },
  { id: 'r8-fab-silterra', name: '吉隆坡 · Silterra', operator: 'Silterra', lng: 101.52, lat: 3.07, kind: 'foundry', status: 'active', note: '东南亚 8 英寸代工', impact: 'medium' },
  { id: 'r8-fab-tower-san-antonio', name: '圣安东尼奥 · Tower', operator: 'Tower Semiconductor', lng: -98.49, lat: 29.42, kind: 'foundry', status: 'active', note: '模拟/射频/功率器件（英特尔子公司）', impact: 'medium' },
  { id: 'r8-fab-bosch-dresden', name: '德累斯顿 · Bosch 晶圆厂', operator: '博世', lng: 13.74, lat: 51.04, kind: 'idm', status: 'active', note: '车用 MEMS/功率芯片欧洲基地', impact: 'high' },
  { id: 'r8-fab-qualcomm-snapdragon', name: '圣地亚哥 · 高通设计中心', operator: '高通', lng: -117.16, lat: 32.88, kind: 'idm', status: 'active', note: '骁龙 SoC 设计（Fabless 龙头）', impact: 'high' },
  { id: 'r8-fab-gsmc-wuxi', name: '无锡 · 华虹无锡', operator: '华虹半导体', lng: 120.42, lat: 31.49, kind: 'foundry', status: 'active', note: '12 英寸特色工艺扩产（功率/射频）', impact: 'high' },
];

// ───────────────────────────────────────────────────────────────
// deep_sea_mining 第三轮
// ───────────────────────────────────────────────────────────────
export const DENSIFY_DEEP_SEA_R8: SeabedMiningArea[] = [
  { id: 'r8-dsm-hawaii', name: '夏威夷海山富钴结壳区', resource: 'crusts', lng: -158.0, lat: 22.0, note: 'ISA 合同区，富钴结壳勘探（示意中心）', impact: 'medium' },
  { id: 'r8-dsm-clipperton', name: '克利珀顿断裂带结核区', resource: 'nodules', lng: -108.0, lat: 8.0, note: '法国/ISA 联合勘探，太平洋结核热点', impact: 'medium' },
  { id: 'r8-dsm-bismarck', name: '俾斯麦海 SMS 区', resource: 'sulphides', lng: 152.5, lat: -4.5, note: '巴新/澳大利亚邻区热液硫化物争议', impact: 'high' },
  { id: 'r8-dsm-red-sea', name: '红海深热液区', resource: 'sulphides', lng: 38.5, lat: 22.0, note: '沙特/德国联合深海硫化物勘探', impact: 'low' },
  { id: 'r8-dsm-isa-moratorium', name: 'CCZ 商业开采暂停争议', resource: 'nodules', lng: -135.0, lat: 8.0, note: '2026 ISA 理事会就商业开采规则再辩论（示意点）', impact: 'critical' },
  { id: 'r8-dsm-norway-arctic', name: '挪威北极海采矿试点', resource: 'sulphides', lng: 8.0, lat: 71.0, note: '2024 立法后首批许可区审议中', impact: 'medium' },
  { id: 'r8-dsm-cook-contract', name: '库克群岛合同区', resource: 'nodules', lng: -162.0, lat: -14.0, note: '南太平洋自主采矿立法与 ISA 规则冲突焦点', impact: 'high' },
];

// ───────────────────────────────────────────────────────────────
// hydrocarbon_reserves 第四轮
// ───────────────────────────────────────────────────────────────
function hydroSite(
  id: string,
  nameZh: string,
  name: string,
  type: '石油' | '天然气' | '油气',
  estimatedReserves: string,
  country: string,
  status: '生产中' | '开发中' | '战略储备',
  reserveTier: 'mega' | 'large' | 'medium',
  lng: number,
  lat: number,
  note: string,
): HydrocarbonReserveSite {
  let impact: 'low' | 'medium' | 'high' | 'critical' = 'medium';
  if (reserveTier === 'mega') impact = 'critical';
  else if (reserveTier === 'large') impact = 'high';
  return { id, name, nameZh, type, estimatedReserves, country, status, reserveTier, lng, lat, note, impact };
}

export const DENSIFY_HYDROCARBON_R8: HydrocarbonReserveSite[] = [
  hydroSite('r8-hc-ghawar-south', '加瓦尔南扩产区', 'Ghawar South Extension', '石油', '约 50 亿桶增量', '沙特阿拉伯', '开发中', 'mega', 48.5, 22.0, '沙特产能维持计划核心区块'),
  hydroSite('r8-hc-zubair', '祖拜尔油田', 'Zubair Field', '石油', '约 45 亿桶', '伊拉克', '生产中', 'large', 47.8, 30.4, '伊拉克南部主力油田群'),
  hydroSite('r8-hc-lng-qatar-nfs', '卡塔尔 North Field South', 'North Field South', '天然气', '约 400 Tcf 原地', '卡塔尔', '开发中', 'mega', 51.8, 26.2, '全球最大 LNG 扩产项目二期'),
  hydroSite('r8-hc-us-shale-eagle', '鹰滩页岩', 'Eagle Ford Shale', '油气', '约 80 亿桶油当量', '美国', '生产中', 'mega', -98.5, 28.5, '得州南部页岩油气，凝析油出口枢纽'),
  hydroSite('r8-hc-angola-lng', '安哥拉 LNG', 'Angola LNG', '天然气', '约 1.1 Tcf', '安哥拉', '生产中', 'large', -12.0, -6.0, '大西洋深水天然气液化出口'),
  hydroSite('r8-hc-trinidad-lng', '特立尼达 LNG', 'Atlantic LNG', '天然气', '约 800 Bcf 年产', '特立尼达和多巴哥', '生产中', 'medium', -61.5, 10.5, '加勒比 LNG 枢纽，美国气源补充'),
  hydroSite('r8-hc-uzbek-gas', '乌兹别克斯坦气田群', 'Uzbek Gas Fields', '天然气', '约 1.8 Tcf 可采', '乌兹别克斯坦', '生产中', 'large', 64.0, 41.0, '中亚对华管道气重要来源'),
  hydroSite('r8-hc-egypt-zohr', '祖尔气田', 'Zohr Field', '天然气', '约 30 Tcf 原地', '埃及', '生产中', 'mega', 32.5, 31.5, '地中海最大气田，埃及 LNG 复兴'),
];

// ───────────────────────────────────────────────────────────────
// cable_incidents 第三轮（06-20~24）
// ───────────────────────────────────────────────────────────────
export const DENSIFY_CABLE_INCIDENTS_R8: CableIncident[] = [
  { id: 'r8-cab-med-east', name: '地中海东段 SEA-ME-WE-5 维护延期', date: '2026-06-20', lng: 34.5, lat: 33.5, note: '黎巴嫩近海例行维护因安全局势延期，亚欧拥塞', source: '区域运营商联合公告（2026-06）', impact: 'medium' },
  { id: 'r8-cab-africa-2', name: '西非 WACS 二次故障', date: '2026-06-21', lng: -8.0, lat: 4.5, note: '加纳近海段落再发故障，尼日利亚互联网降速', source: 'MainOne 公告（2026-06）', impact: 'high' },
  { id: 'r8-cab-apg-malaysia', name: '马六甲 APG 电缆锚损', date: '2026-06-22', lng: 101.5, lat: 2.8, note: '商船锚泊致亚太直达海缆受损，东南亚绕行', source: 'Telekom Malaysia 公告（2026-06）', impact: 'high' },
  { id: 'r8-cab-uk-ireland', name: '爱尔兰-英国 CeltixConnect', date: '2026-06-23', lng: -5.5, lat: 53.0, note: '爱尔兰海海底电缆中断，英爱互联降级', source: 'Virgin Media 公告（2026-06）', impact: 'medium' },
  { id: 'r8-cab-japan-pacific', name: '日本近海 FASTER 电缆检修', date: '2026-06-24', lng: 142.0, lat: 35.5, note: '太平洋跨洋海缆计划外检修，美日链路拥塞', source: 'NEC / Google 联合运维公告（2026-06）', impact: 'medium' },
];

// ───────────────────────────────────────────────────────────────
// protests / climate 第八轮时效增密
// ───────────────────────────────────────────────────────────────
export const DENSIFY_PROTESTS_R8: ThematicPoint[] = [
  { id: 'r8-pro-iran-2026', name: '德黑兰 · 货币贬值抗议', layerId: 'protests', lng: 51.42, lat: 35.69, note: '里亚尔跌破历史低点，集市商贩罢工', impact: 'high', updatedAt: T },
  { id: 'r8-pro-france-2026', name: '巴黎 · 奥运遗产抗议', layerId: 'protests', lng: 2.35, lat: 48.86, note: '运动员村改建争议与住房诉求', impact: 'medium', updatedAt: T2 },
  { id: 'r8-pro-kenya-finance', name: '内罗毕 · 财政法案抗议', layerId: 'protests', lng: 36.82, lat: -1.29, note: '增税法案引发 Gen-Z 二次占领运动', impact: 'critical', updatedAt: T3 },
  { id: 'r8-pro-serbia-lithium', name: '贝尔格莱德 · 锂矿重启示威', layerId: 'protests', lng: 20.46, lat: 44.79, note: 'Jadar 项目环评争议，环保组织封锁道路', impact: 'high', updatedAt: T2 },
  { id: 'r8-pro-peru-mining', name: '利马 · 矿业罢工', layerId: 'protests', lng: -77.04, lat: -12.05, note: '铜矿工人要求利润分成与环保审查', impact: 'medium', updatedAt: T3 },
];

export const DENSIFY_CLIMATE_R8: ThematicPoint[] = [
  { id: 'r8-cli-india-monsoon', name: '印度 · 季风提前强降雨', layerId: 'climate', lng: 75.0, lat: 22.0, note: '孟买/古吉拉特洪涝，铁路停运', impact: 'critical', updatedAt: T, subKind: 'flood' },
  { id: 'r8-cli-eu-drought', name: '南欧 · 干旱预警', layerId: 'climate', lng: 12.5, lat: 41.9, note: '意大利/西班牙水库蓄水量低于常年', impact: 'high', updatedAt: T2, subKind: 'drought' },
  { id: 'r8-cli-us-heat-dome', name: '美国中南部 · 热浪穹顶', layerId: 'climate', lng: -97.0, lat: 32.0, note: '得州/路易斯安那体感超 45°C，电网负荷告警', impact: 'high', updatedAt: T3, subKind: 'heatwave' },
  { id: 'r8-cli-china-rain-2', name: '长江流域 · 梅雨季洪峰', layerId: 'climate', lng: 112.0, lat: 30.5, note: '洞庭湖/鄱阳湖水位超警，堤防巡查加强', impact: 'critical', updatedAt: T, subKind: 'flood' },
  { id: 'r8-cli-africa-flood', name: '东非 · 极端洪涝', layerId: 'climate', lng: 33.0, lat: -1.0, note: '肯尼亚/坦桑尼亚暴雨致万人流离', impact: 'high', updatedAt: T2, subKind: 'flood' },
  { id: 'r8-cli-arctic-melt', name: '格陵兰 · 融冰加速', layerId: 'climate', lng: -40.0, lat: 72.0, note: '2026 初夏融冰量高于常年均值 15%', impact: 'medium', updatedAt: T3, subKind: 'ice' },
];
