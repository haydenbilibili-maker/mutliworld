/**
 * 第九轮增密 · 地表/洋底战略图层 + 时效事件（2026-06-24）
 *
 *  - semiconductors：EU Chips Act / Rapidus / 印度 Tata-PSMC / 马来封测
 *  - deep_sea_mining：ISA 合同区与环境争议
 *  - hydrocarbon_reserves：LNG 终端 / 页岩 / OPEC+ 节点
 *  - cable_incidents / submarine_cables：06-18~24 近期事件与路由
 *  - protests / climate / econ_hubs / minerals / datacenters
 *  - garrisons / nuclear_reactors / space_events / launch_log
 *
 * 坐标为公开资料示意位置，非精确/实时数据。整理日：2026-06-24。
 */

import type { ThematicPoint } from './global.thematic';
import type { SemiconductorFab } from './global.semiconductors';
import type { SeabedMiningArea } from './global.deepSeaMining';
import type { HydrocarbonReserveSite } from './global.hydrocarbon';
import type { CableIncident } from './global.cableIncidents';
import type { GarrisonBase } from './global.garrisons';
import type { SubmarineCableRoute } from './global.submarineCables';
import type { SpaceEvent } from './global.spaceEvents';
import type { LaunchLogEntry } from './global.launchLog';

const T = '2026-06-24T10:00:00Z';
const T2 = '2026-06-23T08:00:00Z';
const T3 = '2026-06-22T16:00:00Z';

// ───────────────────────────────────────────────────────────────
// semiconductors 第四轮（+15）
// ───────────────────────────────────────────────────────────────
export const DENSIFY_SEMICONDUCTORS_R9: SemiconductorFab[] = [
  { id: 'r9-fab-intel-leixlip', name: '莱克斯利普 · Intel 4', operator: 'Intel', lng: -6.55, lat: 53.38, kind: 'idm', status: 'active', note: 'Intel 4 欧洲量产节点（爱尔兰）', impact: 'high' },
  { id: 'r9-fab-stm-catania', name: '卡塔尼亚 · STMicro', operator: '意法半导体', lng: 15.09, lat: 37.5, kind: 'idm', status: 'active', note: 'SiC 功率器件欧洲基地', impact: 'high' },
  { id: 'r9-fab-infineon-dresden', name: '德累斯顿 · Infineon', operator: '英飞凌', lng: 13.74, lat: 51.05, kind: 'idm', status: 'active', note: '车用功率半导体扩产（EU Chips Act）', impact: 'high' },
  { id: 'r9-fab-rapidus-chitose', name: '千岁 · Rapidus IIM-1', operator: 'Rapidus', lng: 141.65, lat: 42.82, kind: 'foundry', status: 'planned', note: '日本 2nm GAA 试产线（2027 目标）', impact: 'critical' },
  { id: 'r9-fab-rapidus-kitakyushu', name: '北九州 · Rapidus 后段', operator: 'Rapidus', lng: 130.88, lat: 33.88, kind: 'foundry', status: 'planned', note: '先进封装与测试配套园区', impact: 'medium' },
  { id: 'r9-fab-tata-psmc-dholera', name: '多拉瑞拉 · Tata-PSMC', operator: 'Tata/PSMC', lng: 72.18, lat: 22.25, kind: 'foundry', status: 'planned', note: '印度首座 300mm 晶圆厂（28nm 起）', impact: 'high' },
  { id: 'r9-fab-micron-gujarat', name: '古吉拉特 · 美光 ATMP', operator: '美光', lng: 72.63, lat: 23.22, kind: 'memory', status: 'planned', note: '印度存储器组装测试封装枢纽', impact: 'high' },
  { id: 'r9-fab-umc-singapore', name: '新加坡 · UMC 22nm', operator: '联电', lng: 103.78, lat: 1.35, kind: 'foundry', status: 'active', note: '东南亚成熟制程扩产', impact: 'medium' },
  { id: 'r9-fab-stats-chip-penang', name: '槟城 · Stats ChipPAC', operator: 'Stats ChipPAC', lng: 100.39, lat: 5.35, kind: 'foundry', status: 'active', note: '马来先进封测后端枢纽', impact: 'high' },
  { id: 'r9-fab-inari-kulim', name: '居林 · Inari', operator: 'Inari Amertron', lng: 100.52, lat: 5.42, kind: 'foundry', status: 'active', note: '射频/光通信封测（马来北部）', impact: 'medium' },
  { id: 'r9-fab-esmc-dresden', name: '德累斯顿 · ESMC', operator: '台积电/博世/英飞凌', lng: 13.72, lat: 51.04, kind: 'foundry', status: 'planned', note: 'EU Chips Act 28/22nm 合资厂', impact: 'critical' },
  { id: 'r9-fab-globalfoundries-dresden', name: '德累斯顿 · GF Fab 1', operator: 'GlobalFoundries', lng: 13.75, lat: 51.06, kind: 'foundry', status: 'active', note: '欧洲最大代工基地，车用芯片', impact: 'high' },
  { id: 'r9-fab-renesas-naka', name: '那珂 · 瑞萨', operator: '瑞萨电子', lng: 140.48, lat: 36.45, kind: 'idm', status: 'active', note: 'MCU/车用芯片日本主基地', impact: 'high' },
  { id: 'r9-fab-tower-san-antonio2', name: '圣安东尼奥 · Tower RF', operator: 'Tower Semiconductor', lng: -98.49, lat: 29.42, kind: 'foundry', status: 'active', note: '射频/模拟特色工艺（英特尔子公司）', impact: 'medium' },
  { id: 'r9-fab-smic-beijing', name: '北京 · 中芯北方', operator: '中芯国际', lng: 116.5, lat: 40.0, kind: 'foundry', status: 'active', note: '28nm 及以上成熟制程扩产', impact: 'high' },
];

// ───────────────────────────────────────────────────────────────
// deep_sea_mining 第四轮（+10）
// ───────────────────────────────────────────────────────────────
export const DENSIFY_DEEP_SEA_R9: SeabedMiningArea[] = [
  { id: 'r9-dsm-isa-uk1', name: 'UK Seabed Resources · CCZ', resource: 'nodules', lng: -140.0, lat: 10.0, note: '英国子公司 ISA 合同区，多金属结核勘探', impact: 'medium' },
  { id: 'r9-dsm-isa-kiribati', name: '基里巴斯合同区', resource: 'nodules', lng: -170.0, lat: 2.0, note: '太平洋岛国与 ISA 联合勘探区', impact: 'medium' },
  { id: 'r9-dsm-isa-tonga', name: '汤加合同区', resource: 'nodules', lng: -175.0, lat: -20.0, note: '南太平洋结核富集带', impact: 'low' },
  { id: 'r9-dsm-isa-india', name: '印度 CCZ 合同区', resource: 'nodules', lng: -138.0, lat: 12.0, note: '印度政府 Deep Ocean Mission 配套', impact: 'medium' },
  { id: 'r9-dsm-isa-brazil', name: '巴西 Rio Grande Rise', resource: 'crusts', lng: -28.0, lat: -30.0, note: '南大西洋富钴结壳勘探申请', impact: 'medium' },
  { id: 'r9-dsm-env-ngos', name: 'CCZ 环保诉讼焦点', resource: 'nodules', lng: -132.0, lat: 6.0, note: '2026 ISA 理事会就环境影响评估标准争议', impact: 'critical' },
  { id: 'r9-dsm-metals-co', name: 'The Metals Company · NORI-D', resource: 'nodules', lng: -136.0, lat: 9.0, note: '商业开采试点区，环保组织强烈反对', impact: 'high' },
  { id: 'r9-dsm-odyssey', name: 'Odyssey Marine · 硫化物', resource: 'sulphides', lng: -86.0, lat: 9.0, note: '东太平洋脊热液硫化物勘探', impact: 'medium' },
  { id: 'r9-dsm-japan-jamstec', name: '日本 JAMSTEC · 冲绳海槽', resource: 'sulphides', lng: 127.5, lat: 27.0, note: '国内立法允许专属经济区深海采矿', impact: 'high' },
  { id: 'r9-dsm-greenpeace', name: '太平洋抗议集结点', resource: 'nodules', lng: -145.0, lat: 5.0, note: '环保组织反对 CCZ 商业开采（示意）', impact: 'medium' },
];

// ───────────────────────────────────────────────────────────────
// hydrocarbon_reserves 第五轮（+12）
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

export const DENSIFY_HYDROCARBON_R9: HydrocarbonReserveSite[] = [
  hydroSite('r9-hc-lng-cameron', '卡梅伦 LNG', 'Cameron LNG', '天然气', '约 1.7 Bcf/d 液化', '美国', '生产中', 'large', -93.3, 29.7, '墨西哥湾 LNG 出口枢纽'),
  hydroSite('r9-hc-lng-corpus', '科珀斯克里斯蒂 LNG', 'Corpus Christi LNG', '天然气', '约 2.1 Bcf/d 液化', '美国', '生产中', 'mega', -97.4, 27.8, '美国最大 LNG 出口港之一'),
  hydroSite('r9-hc-lng-freeport', '自由港 LNG', 'Freeport LNG', '天然气', '约 2.0 Bcf/d 液化', '美国', '生产中', 'large', -95.3, 28.9, '2022 爆炸后复产，对美欧供气关键'),
  hydroSite('r9-hc-lng-plaquemines', 'Plaquemines LNG', 'Plaquemines LNG', '天然气', '约 1.4 Bcf/d（一期）', '美国', '开发中', 'large', -89.7, 29.4, 'Venture Global 新出口终端'),
  hydroSite('r9-hc-shale-bakken', '巴肯页岩', 'Bakken Shale', '油气', '约 120 亿桶油当量', '美国', '生产中', 'mega', -103.0, 47.5, '北达科他页岩油气主产区'),
  hydroSite('r9-hc-shale-permian', '二叠纪盆地', 'Permian Basin', '油气', '约 750 亿桶油当量', '美国', '生产中', 'mega', -102.5, 31.8, '全球增长最快页岩产区'),
  hydroSite('r9-hc-opec-uae', '阿联酋 Upper Zakum', 'Upper Zakum', '石油', '约 500 亿桶原地', '阿联酋', '生产中', 'mega', 53.5, 24.5, 'OPEC+ 产能调节核心油田'),
  hydroSite('r9-hc-opec-kuwait', '科威特 Burgan', 'Burgan Field', '石油', '约 660 亿桶', '科威特', '生产中', 'mega', 47.8, 29.0, '全球第二大油田'),
  hydroSite('r9-hc-opec-nigeria', '尼日利亚 Forcados', 'Forcados Terminal', '石油', '约 200 万桶/日出口', '尼日利亚', '生产中', 'large', 5.4, 5.3, '尼日尔三角洲出口枢纽'),
  hydroSite('r9-hc-lng-mozambique', '莫桑比克 Coral FLNG', 'Coral FLNG', '天然气', '约 3.4 Tcf 可采', '莫桑比克', '生产中', 'large', 41.5, -11.0, '非洲首个深水 FLNG 项目'),
  hydroSite('r9-hc-lng-papua', '巴布亚新几内亚 PNG LNG', 'PNG LNG', '天然气', '约 9 Tcf 可采', '巴布亚新几内亚', '生产中', 'large', 147.0, -6.0, '亚太 LNG 供应增长极'),
  hydroSite('r9-hc-lng-arctic', '北极 Yamal LNG', 'Yamal LNG', '天然气', '约 16.5 Tcf 可采', '俄罗斯', '生产中', 'mega', 70.0, 71.0, '北极圈 LNG 出口，冰级船队'),
];

// ───────────────────────────────────────────────────────────────
// cable_incidents 第四轮（06-18~24，+8）
// ───────────────────────────────────────────────────────────────
export const DENSIFY_CABLE_INCIDENTS_R9: CableIncident[] = [
  { id: 'r9-cab-redsea-3', name: '红海 AAE-1 二次故障', date: '2026-06-18', lng: 42.8, lat: 14.2, note: '胡塞威胁背景下维护船队延迟，亚欧链路拥塞', source: 'Telecom Egypt 公告（2026-06）', impact: 'critical' },
  { id: 'r9-cab-suez-land', name: '苏伊士陆缆段检修', date: '2026-06-19', lng: 32.3, lat: 30.0, note: 'SMW4/SMW5 埃及陆桥段计划检修，中东绕行', source: 'TE Data 公告（2026-06）', impact: 'high' },
  { id: 'r9-cab-baltic-2', name: '波罗的海 BCS 再发告警', date: '2026-06-20', lng: 19.0, lat: 57.5, note: '瑞典—立陶宛海底段信号衰减，北约加强巡护', source: 'Telia 公告（2026-06）', impact: 'high' },
  { id: 'r9-cab-indonesia', name: '印尼巽他海峡海缆锚损', date: '2026-06-21', lng: 105.5, lat: -5.8, note: '商船锚泊致 SEA-ME-WE 支线受损，雅加达降速', source: 'Telkom Indonesia（2026-06）', impact: 'medium' },
  { id: 'r9-cab-philippines', name: '菲律宾 APG 段落拥塞', date: '2026-06-22', lng: 120.5, lat: 14.5, note: '马尼拉—香港链路拥塞，运营商启用卫星备份', source: 'PLDT 公告（2026-06）', impact: 'medium' },
  { id: 'r9-cab-south-africa', name: '南非 WACS 维护延期', date: '2026-06-23', lng: 18.5, lat: -34.0, note: '开普敦登陆站维护窗口延长，非洲南部降速', source: 'MTN 公告（2026-06）', impact: 'high' },
  { id: 'r9-cab-nz-australia', name: '塔斯曼海 Hawaiki 检修', date: '2026-06-23', lng: 165.0, lat: -42.0, note: '澳新跨洋海缆计划外检修，奥克兰—悉尼降速', source: 'Spark NZ（2026-06）', impact: 'medium' },
  { id: 'r9-cab-atlantic', name: '跨大西洋 MAREA 段落告警', date: '2026-06-24', lng: -40.0, lat: 45.0, note: '美欧金融链路延迟上升，微软 Azure 启用备用', source: 'Microsoft / Telxius（2026-06）', impact: 'high' },
];

// ───────────────────────────────────────────────────────────────
// submarine_cables 增密（+10 路由）
// ───────────────────────────────────────────────────────────────
export const DENSIFY_SUBMARINE_CABLES_R9: SubmarineCableRoute[] = [
  { id: 'r9-cable-2africa', name: '2Africa', coordinates: [[-9.0, 38.7], [-17.0, 28.0], [18.4, -34.0], [39.67, -4.05], [43.15, 11.6], [56.33, 25.12], [29.92, 31.2], [5.35, 43.3]], note: 'Meta 主导环非洲—中东—欧洲海缆（部分投产）', impact: 'critical', capacity: '约 180 Tbps', year: 2024 },
  { id: 'r9-cable-echo', name: 'Echo', coordinates: [[103.7, 1.27], [120.0, 15.0], [144.79, 13.46], [-157.0, 21.0], [-118.4, 33.9]], note: 'Google/Meta 跨太平洋海缆', impact: 'critical', capacity: '约 340 Tbps', year: 2022 },
  { id: 'r9-cable-bifrost', name: 'Bifrost', coordinates: [[103.7, 1.27], [125.0, 10.0], [144.79, 13.46], [-157.0, 21.0], [-122.4, 37.8]], note: 'Meta 新加坡—美国西海岸新走廊', impact: 'high', capacity: '约 400 Tbps（设计）', year: 2026, planned: true },
  { id: 'r9-cable-faster2', name: 'FASTER 延伸段', coordinates: [[140.0, 35.6], [144.79, 13.46], [-157.0, 21.0], [-122.4, 37.8]], note: '日美跨太平洋低时延链路', impact: 'high', capacity: '约 60 Tbps', year: 2016 },
  { id: 'r9-cable-indigo', name: 'INDIGO Central', coordinates: [[103.7, 1.27], [106.85, -6.12], [115.8, -32.0], [151.2, -33.9]], note: '东南亚—澳大利亚互联', impact: 'high', capacity: '约 36 Tbps', year: 2019 },
  { id: 'r9-cable-peace', name: 'PEACE', coordinates: [[67.0, 24.8], [56.33, 25.12], [43.15, 11.6], [39.67, -4.05], [18.4, -34.0]], note: '巴基斯坦—东非海缆走廊', impact: 'high', capacity: '约 96 Tbps', year: 2022 },
  { id: 'r9-cable-havhingst', name: 'Havhingsten', coordinates: [[-8.87, 37.95], [-4.48, 48.38], [-0.55, 51.45], [5.35, 43.3]], note: '北欧—西欧低时延互联', impact: 'medium', capacity: '约 320 Tbps', year: 2022 },
  { id: 'r9-cable-fly-lion3', name: 'FLAG Atlantic-1', coordinates: [[-73.95, 40.58], [-40.0, 45.0], [-8.87, 37.95], [5.35, 43.3]], note: '跨大西洋金融与云互联主干', impact: 'critical', capacity: '约 10 Tbps', year: 2001 },
  { id: 'r9-cable-apg2', name: 'APG 南段延伸', coordinates: [[121.5, 25.0], [120.98, 14.55], [103.7, 1.27], [72.83, 19.08]], note: '亚太直达海缆台—菲—新—印走廊', impact: 'high', capacity: '约 54 Tbps', year: 2016 },
  { id: 'r9-cable-south-cross', name: 'Southern Cross Next', coordinates: [[151.2, -33.9], [-170.0, -20.0], [-157.0, 21.0], [-118.4, 33.9]], note: '澳新—美西跨太平洋（规划/在建）', impact: 'high', capacity: '约 72 Tbps（设计）', year: 2026, planned: true },
];

// ───────────────────────────────────────────────────────────────
// protests 第九轮（+12）
// ───────────────────────────────────────────────────────────────
export const DENSIFY_PROTESTS_R9: ThematicPoint[] = [
  { id: 'r9-pro-argentina-milei', name: '布宜诺斯艾利斯 · 紧缩抗议', layerId: 'protests', lng: -58.38, lat: -34.6, note: '米莱政府削减补贴引发工会大罢工', impact: 'high', updatedAt: T },
  { id: 'r9-pro-bangladesh-quota', name: '达卡 · 配额制改革抗议', layerId: 'protests', lng: 90.41, lat: 23.81, note: '公务员配额争议，青年占领街头', impact: 'critical', updatedAt: T2 },
  { id: 'r9-pro-georgia-foreign', name: '第比利斯 · 外国代理人法', layerId: 'protests', lng: 44.79, lat: 41.72, note: '亲欧示威与警方冲突持续', impact: 'high', updatedAt: T3 },
  { id: 'r9-pro-nigeria-fuel', name: '拉各斯 · 燃油补贴取消', layerId: 'protests', lng: 3.38, lat: 6.52, note: '油价上涨引发全国示威', impact: 'high', updatedAt: T },
  { id: 'r9-pro-spain-housing', name: '巴塞罗那 · 住房危机', layerId: 'protests', lng: 2.17, lat: 41.39, note: '短租平台挤压本地居民，租户联盟示威', impact: 'medium', updatedAt: T2 },
  { id: 'r9-pro-uk-nhs', name: '伦敦 · 医护薪酬罢工', layerId: 'protests', lng: -0.12, lat: 51.5, note: 'NHS Junior Doctors 新一轮罢工', impact: 'medium', updatedAt: T3 },
  { id: 'r9-pro-indonesia-mining', name: '雅加达 · 镍矿环保抗议', layerId: 'protests', lng: 106.85, lat: -6.21, note: '苏拉威西镍冶炼污染引发社区封锁', impact: 'high', updatedAt: T },
  { id: 'r9-pro-south-korea-doctors', name: '首尔 · 医政对峙续', layerId: 'protests', lng: 126.98, lat: 37.57, note: '扩招法案后实习医生大规模离职', impact: 'high', updatedAt: T2 },
  { id: 'r9-pro-mali-junta', name: '巴马科 · 军政府抗议', layerId: 'protests', lng: -8.0, lat: 12.65, note: '西非国家经济共同体制裁引发物价上涨', impact: 'medium', updatedAt: T3 },
  { id: 'r9-pro-ecuador-crime', name: '基多 · 治安危机示威', layerId: 'protests', lng: -78.47, lat: -0.18, note: '有组织犯罪升级，要求政府紧急状态', impact: 'high', updatedAt: T },
  { id: 'r9-pro-israel-judicial', name: '特拉维夫 · 司法改革余波', layerId: 'protests', lng: 34.78, lat: 32.08, note: '最高法院改选法案引发每周集会', impact: 'medium', updatedAt: T2 },
  { id: 'r9-pro-vietnam-land', name: '胡志明市 · 征地争议', layerId: 'protests', lng: 106.63, lat: 10.82, note: '高科技园区征地补偿引发村民抗议', impact: 'medium', updatedAt: T3 },
];

// ───────────────────────────────────────────────────────────────
// climate 第九轮（+12）
// ───────────────────────────────────────────────────────────────
export const DENSIFY_CLIMATE_R9: ThematicPoint[] = [
  { id: 'r9-cli-nepal-flood', name: '尼泊尔 · 季风雨洪涝', layerId: 'climate', lng: 85.3, lat: 27.7, note: '加德满都谷地内涝，山体滑坡致道路中断', impact: 'critical', updatedAt: T, subKind: 'flood' },
  { id: 'r9-cli-thailand-heat', name: '泰国 · 破纪录高温', layerId: 'climate', lng: 100.5, lat: 13.75, note: '曼谷体感超 42°C，电力负荷创新高', impact: 'high', updatedAt: T2, subKind: 'heatwave' },
  { id: 'r9-cli-iran-drought', name: '伊朗 · 全国干旱', layerId: 'climate', lng: 51.4, lat: 32.0, note: '乌尔米耶湖续缩，农业用水配给', impact: 'high', updatedAt: T3, subKind: 'drought' },
  { id: 'r9-cli-colombia-flood', name: '哥伦比亚 · 安第斯洪涝', layerId: 'climate', lng: -74.0, lat: 4.6, note: '波哥大周边暴雨致万人撤离', impact: 'high', updatedAt: T, subKind: 'flood' },
  { id: 'r9-cli-spain-drought', name: '西班牙 · 水库枯竭', layerId: 'climate', lng: -3.7, lat: 40.4, note: '马德里周边水库蓄水量不足 40%', impact: 'high', updatedAt: T2, subKind: 'drought' },
  { id: 'r9-cli-canada-smoke', name: '加拿大 · 野火烟霾', layerId: 'climate', lng: -106.0, lat: 54.0, note: '阿尔伯塔林火烟羽南下影响美国中西部', impact: 'medium', updatedAt: T3, subKind: 'wildfire' },
  { id: 'r9-cli-ethiopia-drought', name: '埃塞俄比亚 · 旱灾', layerId: 'climate', lng: 38.0, lat: 9.0, note: '奥罗米亚地区连续两季降水不足', impact: 'critical', updatedAt: T, subKind: 'drought' },
  { id: 'r9-cli-japan-typhoon', name: '日本 · 早期台风', layerId: 'climate', lng: 135.0, lat: 30.0, note: '6 月罕见强台风逼近九州', impact: 'high', updatedAt: T2, subKind: 'storm' },
  { id: 'r9-cli-uk-flood', name: '英国 · 暴雨内涝', layerId: 'climate', lng: -1.5, lat: 53.8, note: '约克郡慢移动风暴致铁路中断', impact: 'medium', updatedAt: T3, subKind: 'flood' },
  { id: 'r9-cli-morocco-heat', name: '摩洛哥 · 极端高温', layerId: 'climate', lng: -7.6, lat: 33.6, note: '马拉喀什周边突破 48°C', impact: 'high', updatedAt: T, subKind: 'heatwave' },
  { id: 'r9-cli-antarctica-warm', name: '南极半岛 · 异常升温', layerId: 'climate', lng: -60.0, lat: -65.0, note: '2026 南半球冬初气温高于常年 8°C', impact: 'medium', updatedAt: T2, subKind: 'ice' },
  { id: 'r9-cli-indonesia-haze', name: '加里曼丹 · 烧芭烟霾', layerId: 'climate', lng: 114.0, lat: -0.5, note: '棕榈油 plantation 烧芭引发跨境烟霾', impact: 'high', updatedAt: T3, subKind: 'haze' },
];

// ───────────────────────────────────────────────────────────────
// econ_hubs / minerals / datacenters（+15）
// ───────────────────────────────────────────────────────────────
export const DENSIFY_ECON_HUBS_R9: ThematicPoint[] = [
  { id: 'r9-hub-abu-dhabi', name: '阿布扎比 ADGM', layerId: 'econ_hubs', lng: 54.37, lat: 24.45, note: '中东主权财富与绿色金融枢纽', impact: 'high' },
  { id: 'r9-hub-casablanca', name: '卡萨布兰卡', layerId: 'econ_hubs', lng: -7.62, lat: 33.59, note: '北非金融与离岸服务中心', impact: 'medium' },
  { id: 'r9-hub-ho-chi-minh', name: '胡志明市', layerId: 'econ_hubs', lng: 106.63, lat: 10.82, note: '越南制造业与创投中心', impact: 'high' },
  { id: 'r9-hub-doha', name: '多哈 QFC', layerId: 'econ_hubs', lng: 51.53, lat: 25.29, note: '卡塔尔 LNG 财富管理中心', impact: 'high' },
  { id: 'r9-hub-nairobi', name: '内罗毕', layerId: 'econ_hubs', lng: 36.82, lat: -1.29, note: '东非金融科技与创投枢纽', impact: 'medium' },
];

export const DENSIFY_MINERALS_R9: ThematicPoint[] = [
  { id: 'r9-min-zimbabwe-lithium', name: '津巴布韦 · 锂矿', layerId: 'minerals', lng: 29.8, lat: -18.0, note: '非洲锂资源开发加速，中资主导', impact: 'high', subKind: 'lithium' },
  { id: 'r9-min-canada-lithium', name: '魁北克 · 锂矿', layerId: 'minerals', lng: -71.0, lat: 52.0, note: '北美本土锂供应链建设', impact: 'medium', subKind: 'lithium' },
  { id: 'r9-min-indonesia-tin', name: '邦加 · 锡矿', layerId: 'minerals', lng: 106.0, lat: -2.0, note: '全球锡供应核心产区', impact: 'medium', subKind: 'tin' },
  { id: 'r9-min-namibia-uranium', name: '纳米比亚 · 铀矿', layerId: 'minerals', lng: 16.0, lat: -22.0, note: 'Rössing 等矿山，西方铀源多元化', impact: 'high', subKind: 'uranium' },
  { id: 'r9-min-myanmar-rare', name: '缅甸 · 重稀土', layerId: 'minerals', lng: 98.0, lat: 23.0, note: '离子型稀土走私与冲突矿产监管', impact: 'critical', subKind: 'rare_earth' },
];

export const DENSIFY_DATACENTERS_R9: ThematicPoint[] = [
  { id: 'r9-dc-johor', name: '柔佛 · AI 算力园区', layerId: 'datacenters', lng: 103.76, lat: 1.49, note: '新加坡溢出算力，NVIDIA 生态聚集', impact: 'high' },
  { id: 'r9-dc-osaka', name: '大阪', layerId: 'datacenters', lng: 135.5, lat: 34.7, note: '日本关西 AI 推理与灾备节点', impact: 'medium' },
  { id: 'r9-dc-warsaw', name: '华沙', layerId: 'datacenters', lng: 21.0, lat: 52.23, note: '中东欧主权云与 GDPR 合规算力', impact: 'medium' },
  { id: 'r9-dc-chennai', name: '金奈', layerId: 'datacenters', lng: 80.27, lat: 13.08, note: '印度南部 AI 训练与 BPO 算力', impact: 'high' },
  { id: 'r9-dc-phoenix', name: '凤凰城', layerId: 'datacenters', lng: -112.07, lat: 33.45, note: '美西南 AI 训练集群，缺水争议', impact: 'high' },
];

// ───────────────────────────────────────────────────────────────
// garrisons 第四轮（+6）
// ───────────────────────────────────────────────────────────────
export const DENSIFY_GARRISONS_R9: GarrisonBase[] = [
  { id: 'r9-gar-us-poznan', name: '波兹南 · 美军前沿', country: 'us', lng: 16.92, lat: 52.42, role: '北约东翼陆军前沿部署（波兰）', impact: 'high' },
  { id: 'r9-gar-us-romania', name: '米哈伊尔·科格尔尼恰努', country: 'us', lng: 28.6, lat: 44.35, role: '黑海方向北约空军前沿（罗马尼亚）', impact: 'high' },
  { id: 'r9-gar-us-australia', name: '达尔文 · 海军陆战队轮换', country: 'us', lng: 130.84, lat: -12.46, role: '印太陆战队轮换部署（澳大利亚）', impact: 'high' },
  { id: 'r9-gar-fr-senegal', name: '达喀尔法军基地', country: 'france', lng: -17.44, lat: 14.72, role: '萨赫勒反恐后勤枢纽', impact: 'medium' },
  { id: 'r9-gar-ru-syria-khmeimim', name: '塔尔图斯/赫梅明', country: 'russia', lng: 35.9, lat: 34.9, role: '俄地中海军事存在双基地', impact: 'high' },
  { id: 'r9-gar-cn-djibouti-2', name: '吉布提保障基地扩建', country: 'china', lng: 43.08, lat: 11.58, role: '亚丁湾护航与海外保障（公开报道）', impact: 'high' },
];

// ───────────────────────────────────────────────────────────────
// nuclear_reactors 增密（+4）
// ───────────────────────────────────────────────────────────────
export const DENSIFY_NUCLEAR_R9: ThematicPoint[] = [
  { id: 'r9-npp-el-dabaa', name: '埃及 El Dabaa', layerId: 'nuclear_reactors', lng: 28.5, lat: 31.0, note: '俄制 VVER-1200 四堆在建，非洲首座', impact: 'high', subKind: 'large' },
  { id: 'r9-npp-kursk2', name: '库尔斯克-II', layerId: 'nuclear_reactors', lng: 35.6, lat: 51.7, note: '俄 VVER-TOI 新机组替换 RBMK', impact: 'medium', subKind: 'large' },
  { id: 'r9-npp-xudapu', name: '徐大堡核电站', layerId: 'nuclear_reactors', lng: 121.0, lat: 40.0, note: '中俄 VVER-1200 合作机组', impact: 'high', subKind: 'large' },
  { id: 'r9-npp-smo', name: '波兰首座核电站', layerId: 'nuclear_reactors', lng: 18.5, lat: 54.5, note: 'PGE 与 Westinghouse AP1000 规划（示意）', impact: 'medium', subKind: 'large' },
];

// ───────────────────────────────────────────────────────────────
// space_events 增密（+4）
// ───────────────────────────────────────────────────────────────
export const DENSIFY_SPACE_EVENTS_R9: SpaceEvent[] = [
  { id: 'r9-spe-debris-iss-2', name: 'ISS 碎片规避（6 月二次）', date: '2026-06-20', kind: 'closeapproach', lng: 20.0, lat: 10.0, note: '俄系碎片二次逼近，乘员进入飞船待命', source: 'NASA（2026-06）', impact: 'medium' },
  { id: 'r9-spe-starlink-collision', name: 'Starlink 自主避碰告警', date: '2026-06-21', kind: 'closeapproach', lng: -80.0, lat: 30.0, note: '低轨星座与退役卫星近距离交会', source: 'SpaceX / USSPACECOM（2026-06）', impact: 'low' },
  { id: 'r9-spe-cz5b-reentry', name: '长征五号乙级再入', date: '2026-06-22', kind: 'reentry', lng: 120.0, lat: -15.0, note: '上面级无控再入南太平洋（示意星下点）', source: '公开追踪 / Aerospace Corp（2026-06）', impact: 'medium' },
  { id: 'r9-spe-intelsat-breakup', name: 'Intelsat 33e 在轨解体', date: '2026-06-23', kind: 'breakup', lng: 50.0, lat: 0.0, note: 'GEO 通信卫星异常解体，产生可跟踪碎片', source: 'ExoAnalytic / LeoLabs（2026-06）', impact: 'high' },
];

// ───────────────────────────────────────────────────────────────
// launch_log 增密（+4）
// ───────────────────────────────────────────────────────────────
export const DENSIFY_LAUNCH_LOG_R9: LaunchLogEntry[] = [
  { id: 'r9-ll-spacex-polar-0624', title: 'SpaceX Falcon 9 · Starlink 极轨', provider: 'SpaceX', siteId: 'launch-us-vandenberg', location: { lng: -120.63, lat: 34.74 }, launchTime: '2026-06-24T14:30:00Z', status: 'success', orbit: 'LEO/SSO', payload: '22 颗 Starlink V2 Mini', note: '海上回收成功', layerId: 'launch_log' },
  { id: 'r9-ll-casc-0623', title: 'CASC 长征三号乙 · 通信卫星', provider: 'CASC', siteId: 'launch-cn-xichang', location: { lng: 102.03, lat: 28.25 }, launchTime: '2026-06-23T08:15:00Z', status: 'success', orbit: 'GTO', payload: '中星系列通信卫星', layerId: 'launch_log' },
  { id: 'r9-ll-isro-0622', title: 'ISRO PSLV · 遥感卫星', provider: 'ISRO', siteId: 'launch-in-sriharikota', location: { lng: 80.23, lat: 13.72 }, launchTime: '2026-06-22T04:50:00Z', status: 'success', orbit: 'SSO', payload: 'EOS-08 地球观测', layerId: 'launch_log' },
  { id: 'r9-ll-ariane-0621', title: 'Arianespace Ariane 6 · 商业载荷', provider: 'Arianespace', siteId: 'launch-fr-kourou', location: { lng: -52.77, lat: 5.24 }, launchTime: '2026-06-21T21:00:00Z', status: 'success', orbit: 'GTO', payload: '两颗商业通信卫星', note: 'Ariane 6 第二次商业飞行', layerId: 'launch_log' },
];
