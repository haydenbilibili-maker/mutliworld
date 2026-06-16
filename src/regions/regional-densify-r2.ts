/**
 * 第二轮增密 · 各区域数据集扩展（2026-06-10 至 06-16）
 */
import type { EventDetail } from '@/types/geo';
import type { Incident, Facility, EnergyDataPoint, OilProducerMapPoint } from '@/types/middleeast';

const T16 = '2026-06-16T10:00:00Z';
const T15 = '2026-06-15T14:00:00Z';
const T14 = '2026-06-14T08:00:00Z';
const T13 = '2026-06-13T16:00:00Z';
const T12 = '2026-06-12T06:00:00Z';
const T11 = '2026-06-11T12:00:00Z';
const T10 = '2026-06-10T18:00:00Z';

// ── 中东 ──────────────────────────────────────────
export const ME_DENSIFY_EVENTS: EventDetail[] = [
  { id: 'r2me-hormuz', title: '霍尔木兹 · 油轮通行监测', source: 'seed/示例', timestamp: T16, location: [56.5, 26.5], impact_level: 'critical', category: 'waterways', description: '全球石油运输咽喉（种子/示例）' },
  { id: 'r2me-redsea', title: '红海 · 商船护航', source: 'seed/示例', timestamp: T15, location: [43.0, 14.5], impact_level: 'critical', category: 'maritime', description: '胡塞袭击后航运改道（种子/示例）' },
  { id: 'r2me-gaza', title: '加沙 · 人道走廊', source: 'seed/示例', timestamp: T16, location: [34.47, 31.5], impact_level: 'critical', category: 'hotspots', description: '停火谈判与人道援助（种子/示例）' },
  { id: 'r2me-lebanon', title: '黎巴嫩边境 · 交火', source: 'seed/示例', timestamp: T14, location: [35.5, 33.2], impact_level: 'high', category: 'conflicts', description: '真主党与以军边境摩擦（种子/示例）' },
  { id: 'r2me-syria', title: '叙利亚 · 空袭', source: 'seed/示例', timestamp: T13, location: [36.3, 33.5], impact_level: 'high', category: 'military', description: '以军空袭境内目标（种子/示例）' },
  { id: 'r2me-yemen', title: '也门 · 胡塞袭击', source: 'seed/示例', timestamp: T16, location: [44.2, 15.35], impact_level: 'high', category: 'military', description: '红海商船遭无人机袭击（种子/示例）' },
  { id: 'r2me-iran-nuke', title: '伊朗 · 核计划', source: 'seed/示例', timestamp: T15, location: [51.42, 35.69], impact_level: 'critical', category: 'nuclear', description: '浓缩铀丰度接近武器级（种子/示例）' },
  { id: 'r2me-iraq', title: '伊拉克 · 民兵袭击', source: 'seed/示例', timestamp: T12, location: [44.37, 33.31], impact_level: 'high', category: 'conflicts', description: '亲伊朗民兵袭击美军基地（种子/示例）' },
  { id: 'r2me-uae', title: '阿联酋 · 能源枢纽', source: 'seed/示例', timestamp: T11, location: [54.37, 24.45], impact_level: 'high', category: 'economic', description: '富查伊拉石油储备与出口（种子/示例）' },
  { id: 'r2me-saudi', title: '沙特 · 石油产量', source: 'seed/示例', timestamp: T14, location: [46.72, 24.71], impact_level: 'high', category: 'economic', description: '欧佩克减产执行监测（种子/示例）' },
  { id: 'r2me-turkey', title: '土耳其 · 叙利亚边境', source: 'seed/示例', timestamp: T13, location: [36.8, 36.9], impact_level: 'medium', category: 'military', description: '土军跨境军事行动（种子/示例）' },
  { id: 'r2me-qatar', title: '卡塔尔 · LNG出口', source: 'seed/示例', timestamp: T10, location: [51.53, 25.29], impact_level: 'high', category: 'economic', description: '全球最大LNG出口国（种子/示例）' },
];
export const ME_DENSIFY_INCIDENTS: Incident[] = [
  { id: 'r2me-inc-1', title: '红海 · 货轮遭袭', date: T16, type: 'military', faction: 'houthis', location: { lng: 42.5, lat: 14.8 }, description: '胡塞无人机袭击（种子/示例）', source: 'seed/示例' },
  { id: 'r2me-inc-2', title: '加沙 · 援助车队', date: T15, type: 'political', faction: 'il', location: { lng: 34.47, lat: 31.5 }, description: '人道援助进入（种子/示例）', source: 'seed/示例' },
  { id: 'r2me-inc-3', title: '黎巴嫩 · 火箭弹', date: T14, type: 'military', faction: 'hezbollah', location: { lng: 35.5, lat: 33.2 }, description: '边境火箭弹交火（种子/示例）', source: 'seed/示例' },
  { id: 'r2me-inc-4', title: '伊拉克 · 基地遇袭', date: T13, type: 'military', faction: 'pmf', location: { lng: 44.0, lat: 33.0 }, description: '民兵无人机袭击（种子/示例）', source: 'seed/示例' },
  { id: 'r2me-inc-5', title: '伊朗 · IAEA报告', date: T16, type: 'political', faction: 'ir', location: { lng: 51.42, lat: 35.69 }, description: '铀浓缩进展报告（种子/示例）', source: 'seed/示例' },
  { id: 'r2me-inc-6', title: '叙利亚 · 以军空袭', date: T12, type: 'military', faction: 'il', location: { lng: 36.3, lat: 33.5 }, description: '大马士革郊区空袭（种子/示例）', source: 'seed/示例' },
  { id: 'r2me-inc-7', title: '也门 · 沙特拦截', date: T11, type: 'military', faction: 'sa', location: { lng: 46.0, lat: 24.0 }, description: '爱国者拦截胡塞导弹（种子/示例）', source: 'seed/示例' },
  { id: 'r2me-inc-8', title: '土耳其 · 库尔德打击', date: T10, type: 'military', faction: 'tr', location: { lng: 41.0, lat: 37.0 }, description: '跨境打击PKK（种子/示例）', source: 'seed/示例' },
];
export const ME_DENSIFY_FACILITIES: Facility[] = [
  { id: 'r2me-fac-aludeid', name: '乌代德空军基地', position: { lat: 25.12, lng: 51.32 }, faction: 'us', type: 'airfield', notes: '中东最大美军基地（种子/示例）' },
  { id: 'r2me-fac-bahrain', name: '第五舰队总部', position: { lat: 26.23, lng: 50.58 }, faction: 'us', type: 'naval', notes: '美国海军中央司令部（种子/示例）' },
  { id: 'r2me-fac-natanz', name: '纳坦兹核设施', position: { lat: 33.72, lng: 51.73 }, faction: 'ir', type: 'nuclear', nuclearKind: 'enrichment', notes: '伊朗铀浓缩（种子/示例）' },
  { id: 'r2me-fac-dimona', name: '迪莫纳核设施', position: { lat: 31.0, lng: 35.15 }, faction: 'il', type: 'nuclear', nuclearKind: 'power_plant', notes: '以色列核设施（种子/示例）' },
  { id: 'r2me-fac-tartus', name: '塔尔图斯基地', position: { lat: 34.9, lng: 35.87 }, faction: 'ru', type: 'naval', notes: '俄地中海补给点（种子/示例）' },
  { id: 'r2me-fac-hmeimim', name: '赫梅明基地', position: { lat: 35.41, lng: 35.95 }, faction: 'ru', type: 'airfield', notes: '俄叙利亚空中枢纽（种子/示例）' },
  { id: 'r2me-fac-incirlik', name: '因吉尔利克基地', position: { lat: 37.0, lng: 35.43 }, faction: 'us', type: 'airfield', notes: '土耳其境内美军基地（种子/示例）' },
  { id: 'r2me-fac-kuwait', name: '阿里萨卡姆军营', position: { lat: 29.35, lng: 47.92 }, faction: 'us', type: 'base', notes: '海湾陆军前沿（种子/示例）' },
  { id: 'r2me-fac-djibouti', name: '勒莫尼耶军营', position: { lat: 11.55, lng: 43.15 }, faction: 'us', type: 'base', notes: '非洲司令部前沿（种子/示例）' },
  { id: 'r2me-fac-ras-tanura', name: '拉斯坦努拉港', position: { lat: 26.64, lng: 50.16 }, faction: 'sa', type: 'naval', notes: '沙特最大石油出口港（种子/示例）' },
];
export const ME_DENSIFY_OIL: OilProducerMapPoint[] = [
  { id: 'r2me-oil-ghawar', name: '加瓦尔油田', lng: 49.0, lat: 25.0, production: '约500万桶/日', note: '全球最大油田（种子/示例）', updatedAt: T16 },
  { id: 'r2me-oil-basra', name: '巴士拉油田', lng: 47.78, lat: 30.5, production: '约300万桶/日', note: '伊拉克主力产区（种子/示例）', updatedAt: T15 },
  { id: 'r2me-oil-kharg', name: '哈尔克岛', lng: 50.32, lat: 29.25, production: '伊朗出口枢纽', note: '波斯湾原油外运（种子/示例）', updatedAt: T14 },
];

// ── 亚太 ──────────────────────────────────────────
export const AP_DENSIFY_EVENTS: EventDetail[] = [
  { id: 'r2ap-taiwan', title: '台湾海峡 · 演训', source: 'seed/示例', timestamp: T16, location: [120.0, 24.0], impact_level: 'critical', category: 'military', description: '环台岛战备警巡（种子/示例）' },
  { id: 'r2ap-scs', title: '南海 · 岛礁对峙', source: 'seed/示例', timestamp: T15, location: [114.0, 10.0], impact_level: 'high', category: 'hotspots', description: '多国岛礁占领（种子/示例）' },
  { id: 'r2ap-korea', title: '朝鲜半岛 · 导弹', source: 'seed/示例', timestamp: T16, location: [125.5, 40.0], impact_level: 'critical', category: 'military', description: '朝鲜弹道导弹试射（种子/示例）' },
  { id: 'r2ap-japan', title: '冲绳 · 美军集结', source: 'seed/示例', timestamp: T14, location: [127.68, 26.21], impact_level: 'high', category: 'bases', description: '嘉手纳战机出动（种子/示例）' },
  { id: 'r2ap-aus', title: '达尔文 · 美军轮换', source: 'seed/示例', timestamp: T13, location: [-12.46, 130.84], impact_level: 'medium', category: 'bases', description: '海军陆战队轮换部署（种子/示例）' },
  { id: 'r2ap-india', title: '中印边境 · 对峙', source: 'seed/示例', timestamp: T16, location: [78.5, 33.5], impact_level: 'high', category: 'conflicts', description: '实控线巡逻对峙（种子/示例）' },
  { id: 'r2ap-myanmar', title: '缅甸 · 内战', source: 'seed/示例', timestamp: T15, location: [96.0, 19.0], impact_level: 'critical', category: 'conflicts', description: '民族武装战事蔓延（种子/示例）' },
  { id: 'r2ap-philippines', title: '南海 · 菲方巡逻', source: 'seed/示例', timestamp: T14, location: [117.8, 15.1], impact_level: 'high', category: 'maritime', description: '黄岩岛外围巡逻（种子/示例）' },
  { id: 'r2ap-senkaku', title: '钓鱼岛 · 巡航', source: 'seed/示例', timestamp: T16, location: [123.47, 25.75], impact_level: 'critical', category: 'hotspots', description: '海警维权巡航（种子/示例）' },
  { id: 'r2ap-bashi', title: '巴士海峡 · 潜艇', source: 'seed/示例', timestamp: T13, location: [121.0, 21.0], impact_level: 'high', category: 'military', description: '外军潜艇过境（种子/示例）' },
  { id: 'r2ap-guam', title: '关岛 · 轰炸机', source: 'seed/示例', timestamp: T12, location: [144.8, 13.45], impact_level: 'high', category: 'aviation', description: 'B-52轮换部署（种子/示例）' },
  { id: 'r2ap-nz', title: '新西兰 · 军演', source: 'seed/示例', timestamp: T11, location: [174.76, -41.29], impact_level: 'low', category: 'military', description: '南太平洋联合演习（种子/示例）' },
];
export const AP_DENSIFY_INCIDENTS: Incident[] = [
  { id: 'r2ap-inc-1', title: '台海 · 军机过线', date: T16, type: 'military', faction: 'cn', location: { lng: 119.8, lat: 24.2 }, description: '解放军军机过海峡中线（种子/示例）', source: 'seed/示例' },
  { id: 'r2ap-inc-2', title: '南沙 · 水炮对峙', date: T15, type: 'military', faction: 'cn', location: { lng: 114.8, lat: 9.2 }, description: '海警水炮驱离（种子/示例）', source: 'seed/示例' },
  { id: 'r2ap-inc-3', title: '朝鲜 · 导弹发射', date: T16, type: 'military', faction: 'kp', location: { lng: 125.8, lat: 39.5 }, description: '弹道导弹试射（种子/示例）', source: 'seed/示例' },
  { id: 'r2ap-inc-4', title: '钓鱼岛 · 日舰接近', date: T14, type: 'military', faction: 'jp', location: { lng: 123.5, lat: 25.74 }, description: '海保厅舰艇接近（种子/示例）', source: 'seed/示例' },
  { id: 'r2ap-inc-5', title: '缅甸 · 武装冲突', date: T13, type: 'military', faction: 'kia', location: { lng: 98.0, lat: 23.0 }, description: '克钦独立军交火（种子/示例）', source: 'seed/示例' },
  { id: 'r2ap-inc-6', title: '中印 · 边境对峙', date: T16, type: 'military', faction: 'in', location: { lng: 78.5, lat: 33.5 }, description: '巡逻队近距离对峙（种子/示例）', source: 'seed/示例' },
];
export const AP_DENSIFY_FACILITIES: Facility[] = [
  { id: 'r2ap-fac-yokosuka', name: '横须贺海军基地', position: { lat: 35.29, lng: 139.67 }, faction: 'us', type: 'naval', forces: ['第七舰队'], notes: '西太平洋母港（种子/示例）' },
  { id: 'r2ap-fac-kadena', name: '嘉手纳空军基地', position: { lat: 26.35, lng: 127.77 }, faction: 'us', type: 'airfield', notes: '冲绳最大空军基地（种子/示例）' },
  { id: 'r2ap-fac-guam', name: '安德森空军基地', position: { lat: 13.58, lng: 144.93 }, faction: 'us', type: 'airfield', forces: ['B-52'], notes: '战略轰炸机基地（种子/示例）' },
  { id: 'r2ap-fac-darwin', name: '达尔文港', position: { lat: -12.46, lng: 130.84 }, faction: 'au', type: 'naval', notes: '美军轮换港（种子/示例）' },
  { id: 'r2ap-fac-subic', name: '苏比克湾', position: { lat: 14.8, lng: 120.28 }, faction: 'ph', type: 'naval', notes: '菲律宾军港（种子/示例）' },
  { id: 'r2ap-fac-pyongtaek', name: '平泽军营', position: { lat: 36.97, lng: 127.02 }, faction: 'us', type: 'base', notes: '驻韩美军最大基地（种子/示例）' },
  { id: 'r2ap-fac-yongbyon', name: '宁边核设施', position: { lat: 39.8, lng: 125.75 }, faction: 'kp', type: 'nuclear', nuclearKind: 'enrichment', notes: '朝鲜核设施（种子/示例）' },
  { id: 'r2ap-fac-ishigaki', name: '石垣岛基地', position: { lat: 24.34, lng: 124.16 }, faction: 'jp', type: 'base', notes: '日本西南诸岛防卫（种子/示例）' },
];

// ── 北美 ──────────────────────────────────────────
export const NA_DENSIFY_EVENTS: EventDetail[] = [
  { id: 'r2na-pentagon', title: '华盛顿 · 国防预算', source: 'seed/示例', timestamp: T16, location: [-77.04, 38.9], impact_level: 'high', category: 'military', description: '国会审议国防授权法案（种子/示例）' },
  { id: 'r2na-norad', title: '北美防空 · 演习', source: 'seed/示例', timestamp: T15, location: [-104.87, 39.0], impact_level: 'medium', category: 'military', description: 'NORAD年度防空演习（种子/示例）' },
  { id: 'r2na-border', title: '美墨边境 · 移民', source: 'seed/示例', timestamp: T14, location: [-106.5, 31.8], impact_level: 'high', category: 'hotspots', description: '边境移民压力持续（种子/示例）' },
  { id: 'r2na-arctic', title: '阿拉斯加 · 北极军演', source: 'seed/示例', timestamp: T13, location: [-147.0, 64.8], impact_level: 'medium', category: 'military', description: '北极战备演习（种子/示例）' },
  { id: 'r2na-hurricane', title: '墨西哥湾 · 飓风预警', source: 'seed/示例', timestamp: T16, location: [-90.0, 28.0], impact_level: 'high', category: 'weather', description: '热带气旋逼近海岸（种子/示例）' },
  { id: 'r2na-fed', title: '美联储 · 利率决议', source: 'seed/示例', timestamp: T12, location: [-77.04, 38.9], impact_level: 'high', category: 'economic', description: '全球金融市场关注（种子/示例）' },
  { id: 'r2na-silicon', title: '加州 · 科技监管', source: 'seed/示例', timestamp: T11, location: [-122.4, 37.77], impact_level: 'medium', category: 'economic', description: 'AI监管立法推进（种子/示例）' },
  { id: 'r2na-canada-fire', title: '加拿大 · 野火', source: 'seed/示例', timestamp: T10, location: [-120.0, 54.0], impact_level: 'high', category: 'climate', description: '西部林火蔓延（种子/示例）' },
  { id: 'r2na-launch', title: '佛罗里达 · 商业发射', source: 'seed/示例', timestamp: T15, location: [-80.6, 28.5], impact_level: 'low', category: 'launch_sites', description: '星链卫星发射（种子/示例）' },
  { id: 'r2na-grid', title: '德州 · 电网压力', source: 'seed/示例', timestamp: T14, location: [-97.74, 30.27], impact_level: 'medium', category: 'outages', description: '夏季用电高峰（种子/示例）' },
];
export const NA_DENSIFY_INCIDENTS: Incident[] = [
  { id: 'r2na-inc-1', title: '华盛顿 · 制裁名单', date: T16, type: 'political', faction: 'us', location: { lng: -77.04, lat: 38.9 }, description: '财政部新制裁（种子/示例）', source: 'seed/示例' },
  { id: 'r2na-inc-2', title: '美墨边境 · 冲突', date: T14, type: 'political', faction: 'us', location: { lng: -106.5, lat: 31.8 }, description: '边境执法冲突（种子/示例）', source: 'seed/示例' },
  { id: 'r2na-inc-3', title: '加州 · 网络攻击', date: T13, type: 'political', faction: 'contested', location: { lng: -122.4, lat: 37.77 }, description: '市政系统遭勒索（种子/示例）', source: 'seed/示例' },
  { id: 'r2na-inc-4', title: '阿拉斯加 · 俄机接近', date: T12, type: 'military', faction: 'ru', location: { lng: -147.0, lat: 64.8 }, description: '俄军机进入防空识别区（种子/示例）', source: 'seed/示例' },
];
export const NA_DENSIFY_FACILITIES: Facility[] = [
  { id: 'r2na-fac-norfolk', name: '诺福克海军基地', position: { lat: 36.95, lng: -76.33 }, faction: 'us', type: 'naval', forces: ['大西洋舰队'], notes: '全球最大海军基地（种子/示例）' },
  { id: 'r2na-fac-pearl', name: '珍珠港', position: { lat: 21.35, lng: -157.97 }, faction: 'us', type: 'naval', notes: '太平洋舰队司令部（种子/示例）' },
  { id: 'r2na-fac-san-diego', name: '圣迭戈海军基地', position: { lat: 32.68, lng: -117.12 }, faction: 'us', type: 'naval', notes: '太平洋舰队母港（种子/示例）' },
  { id: 'r2na-fac-cheyenne', name: '夏延山指挥中心', position: { lat: 38.74, lng: -104.85 }, faction: 'us', type: 'base', notes: 'NORAD地下指挥中心（种子/示例）' },
  { id: 'r2na-fac-kings-bay', name: '金斯湾潜艇基地', position: { lat: 30.8, lng: -81.52 }, faction: 'us', type: 'naval', forces: ['俄亥俄级核潜艇'], notes: '战略核潜艇基地（种子/示例）' },
  { id: 'r2na-fac-cfb-north', name: '冷湖空军基地', position: { lat: 54.4, lng: -110.28 }, faction: 'ca', type: 'airfield', notes: '加拿大北方防空（种子/示例）' },
];

// ── 拉美 ──────────────────────────────────────────
export const LA_DENSIFY_EVENTS: EventDetail[] = [
  { id: 'r2la-venezuela', title: '委内瑞拉 · 边境争端', source: 'seed/示例', timestamp: T16, location: [-61.0, 7.0], impact_level: 'high', category: 'conflicts', description: '埃塞奎博主权争议（种子/示例）' },
  { id: 'r2la-haiti', title: '海地 · 帮派暴力', source: 'seed/示例', timestamp: T15, location: [-72.33, 18.54], impact_level: 'critical', category: 'hotspots', description: '太子港治安崩溃（种子/示例）' },
  { id: 'r2la-colombia', title: '哥伦比亚 · 游击队', source: 'seed/示例', timestamp: T14, location: [-74.0, 4.6], impact_level: 'high', category: 'conflicts', description: '民族解放军活动（种子/示例）' },
  { id: 'r2la-brazil-flood', title: '巴西南部 · 洪涝', source: 'seed/示例', timestamp: T16, location: [-51.23, -30.03], impact_level: 'critical', category: 'natural', description: '大规模洪灾（种子/示例）' },
  { id: 'r2la-argentina', title: '阿根廷 · 经济抗议', source: 'seed/示例', timestamp: T13, location: [-58.38, -34.6], impact_level: 'medium', category: 'protests', description: '紧缩政策引发示威（种子/示例）' },
  { id: 'r2la-lithium', title: '智利 · 锂矿开发', source: 'seed/示例', timestamp: T12, location: [-68.2, -23.5], impact_level: 'high', category: 'minerals', description: '盐湖提锂 nacionalización 争议（种子/示例）' },
  { id: 'r2la-panama', title: '巴拿马运河 · 限航', source: 'seed/示例', timestamp: T11, location: [-79.92, 9.08], impact_level: 'high', category: 'waterways', description: '干旱限制过闸量（种子/示例）' },
  { id: 'r2la-mexico', title: '墨西哥城 · 干旱', source: 'seed/示例', timestamp: T10, location: [-99.13, 19.43], impact_level: 'high', category: 'climate', description: '水库蓄水量低（种子/示例）' },
];
export const LA_DENSIFY_INCIDENTS: Incident[] = [
  { id: 'r2la-inc-1', title: '委内瑞拉 · 军事集结', date: T16, type: 'military', faction: 've', location: { lng: -61.0, lat: 7.0 }, description: '边境军事部署（种子/示例）', source: 'seed/示例' },
  { id: 'r2la-inc-2', title: '海地 · 帮派冲突', date: T15, type: 'military', faction: 'gangs', location: { lng: -72.33, lat: 18.54 }, description: '港口控制权争夺（种子/示例）', source: 'seed/示例' },
  { id: 'r2la-inc-3', title: '哥伦比亚 · 袭击', date: T14, type: 'military', faction: 'eln', location: { lng: -74.0, lat: 4.6 }, description: '游击队袭击（种子/示例）', source: 'seed/示例' },
  { id: 'r2la-inc-4', title: '布宜诺斯艾利斯 · 示威', date: T13, type: 'political', faction: 'ar', location: { lng: -58.38, lat: -34.6 }, description: '经济紧缩抗议（种子/示例）', source: 'seed/示例' },
];
export const LA_DENSIFY_FACILITIES: Facility[] = [
  { id: 'r2la-fac-guantanamo', name: '关塔那摩湾', position: { lat: 19.9, lng: -75.16 }, faction: 'us', type: 'naval', notes: '加勒比海军基地（种子/示例）' },
  { id: 'r2la-fac-soto', name: '罗斯福路基地', position: { lat: 18.0, lng: -65.6 }, faction: 'us', type: 'naval', notes: '波多黎各海军设施（种子/示例）' },
  { id: 'r2la-fac-manta', name: '曼塔空军基地', position: { lat: -0.95, lng: -80.68 }, faction: 'ec', type: 'airfield', notes: '厄瓜多尔美军合作基地（种子/示例）' },
  { id: 'r2la-fac-itaguai', name: '伊塔瓜伊造船厂', position: { lat: -22.95, lng: -43.82 }, faction: 'br', type: 'naval', notes: '巴西核潜艇项目（种子/示例）' },
];

// ── 东南亚 ──────────────────────────────────────────
export const SEA_DENSIFY_EVENTS: EventDetail[] = [
  { id: 'r2sea-scs', title: '南海 · 渔业执法', source: 'seed/示例', timestamp: T16, location: [112.0, 12.0], impact_level: 'high', category: 'maritime', description: '休渔期执法强化（种子/示例）' },
  { id: 'r2sea-malacca', title: '马六甲海峡 · 航道', source: 'seed/示例', timestamp: T15, location: [102.25, 2.3], impact_level: 'high', category: 'waterways', description: '全球最繁忙航道之一（种子/示例）' },
  { id: 'r2sea-myanmar', title: '缅甸 · 内战外溢', source: 'seed/示例', timestamp: T14, location: [98.5, 24.0], impact_level: 'high', category: 'conflicts', description: '边境难民与人道压力（种子/示例）' },
  { id: 'r2sea-haze', title: '跨境烟霾', source: 'seed/示例', timestamp: T13, location: [104.0, 0.5], impact_level: 'high', category: 'climate', description: '印尼烧芭影响新马空气质量（种子/示例）' },
  { id: 'r2sea-philippines', title: '菲律宾 · 南海巡逻', source: 'seed/示例', timestamp: T16, location: [117.8, 15.1], impact_level: 'high', category: 'military', description: '海警黄岩岛巡逻（种子/示例）' },
  { id: 'r2sea-indonesia', title: '印尼 · 镍矿出口', source: 'seed/示例', timestamp: T12, location: [121.0, -2.5], impact_level: 'high', category: 'economic', description: '电动车电池原料管制（种子/示例）' },
  { id: 'r2sea-vietnam', title: '越南 · 岛礁扩建', source: 'seed/示例', timestamp: T11, location: [111.92, 8.65], impact_level: 'medium', category: 'conflicts', description: '南沙占据岛礁填海（种子/示例）' },
  { id: 'r2sea-singapore', title: '新加坡 · 航运枢纽', source: 'seed/示例', timestamp: T10, location: [103.82, 1.35], impact_level: 'high', category: 'economic', description: '全球第二大港口（种子/示例）' },
];
export const SEA_DENSIFY_INCIDENTS: Incident[] = [
  { id: 'r2sea-inc-1', title: '南海 · 渔船查处', date: T16, type: 'military', faction: 'cn', location: { lng: 112.0, lat: 12.0 }, description: '非法捕捞查处（种子/示例）', source: 'seed/示例' },
  { id: 'r2sea-inc-2', title: '马尼拉 · 反华示威', date: T14, type: 'political', faction: 'ph', location: { lng: 120.98, lat: 14.6 }, description: '南海争议抗议（种子/示例）', source: 'seed/示例' },
  { id: 'r2sea-inc-3', title: '雅加达 · 选举示威', date: T13, type: 'political', faction: 'id', location: { lng: 106.85, lat: -6.21 }, description: '地方选举争议（种子/示例）', source: 'seed/示例' },
  { id: 'r2sea-inc-4', title: '缅北 · 武装冲突', date: T15, type: 'military', faction: 'kia', location: { lng: 98.0, lat: 24.0 }, description: '民族武装交火（种子/示例）', source: 'seed/示例' },
];
export const SEA_DENSIFY_FACILITIES: Facility[] = [
  { id: 'r2sea-fac-changi', name: '樟宜海军基地', position: { lat: 1.33, lng: 104.0 }, faction: 'sg', type: 'naval', notes: '东南亚战略港口（种子/示例）' },
  { id: 'r2sea-fac-subic', name: '苏比克湾', position: { lat: 14.8, lng: 120.28 }, faction: 'ph', type: 'naval', notes: '菲律宾军港（种子/示例）' },
  { id: 'r2sea-fac-ream', name: '柬埔寨云壤', position: { lat: 10.62, lng: 103.52 }, faction: 'cn', type: 'naval', notes: '中柬海军合作（种子/示例）' },
  { id: 'r2sea-fac-cam-ranh', name: '金兰湾', position: { lat: 11.9, lng: 109.2 }, faction: 'vn', type: 'naval', notes: '越南战略军港（种子/示例）' },
];

// ── 西欧 ──────────────────────────────────────────
export const WE_DENSIFY_EVENTS: EventDetail[] = [
  { id: 'r2we-ukraine', title: '乌克兰 · 前线态势', source: 'seed/示例', timestamp: T16, location: [37.5, 48.5], impact_level: 'critical', category: 'conflicts', description: '顿巴斯交火持续（种子/示例）' },
  { id: 'r2we-nato', title: '北约 · 东翼演习', source: 'seed/示例', timestamp: T15, location: [24.0, 57.0], impact_level: 'high', category: 'military', description: '波罗的海防卫演习（种子/示例）' },
  { id: 'r2we-france', title: '法国 · 全国罢工', source: 'seed/示例', timestamp: T16, location: [2.35, 48.86], impact_level: 'medium', category: 'protests', description: '养老金改革抗议（种子/示例）' },
  { id: 'r2we-germany', title: '德国 · 能源转型', source: 'seed/示例', timestamp: T14, location: [13.4, 52.5], impact_level: 'medium', category: 'economic', description: '可再生能源占比提升（种子/示例）' },
  { id: 'r2we-uk', title: '英国 · 脱欧后贸易', source: 'seed/示例', timestamp: T13, location: [-0.12, 51.5], impact_level: 'medium', category: 'economic', description: '北爱尔兰议定书争议（种子/示例）' },
  { id: 'r2we-spain', title: '西班牙 · 极端高温', source: 'seed/示例', timestamp: T12, location: [-3.7, 40.42], impact_level: 'high', category: 'climate', description: '伊比利亚半岛热浪（种子/示例）' },
  { id: 'r2we-italy', title: '意大利 · 移民压力', source: 'seed/示例', timestamp: T11, location: [12.5, 41.9], impact_level: 'high', category: 'hotspots', description: '地中海移民航线（种子/示例）' },
  { id: 'r2we-nordstream', title: '北欧 · 能源管道', source: 'seed/示例', timestamp: T10, location: [12.0, 55.0], impact_level: 'high', category: 'pipelines', description: '波罗的海管道监测（种子/示例）' },
];
export const WE_DENSIFY_INCIDENTS: Incident[] = [
  { id: 'r2we-inc-1', title: '哈尔科夫 · 俄军推进', date: T16, type: 'military', faction: 'ru', location: { lng: 36.25, lat: 49.99 }, description: '边境推进（种子/示例）', source: 'seed/示例' },
  { id: 'r2we-inc-2', title: '巴黎 · 示威', date: T15, type: 'political', faction: 'fr', location: { lng: 2.35, lat: 48.86 }, description: '全国性罢工（种子/示例）', source: 'seed/示例' },
  { id: 'r2we-inc-3', title: '柏林 · 住房抗议', date: T14, type: 'political', faction: 'de', location: { lng: 13.4, lat: 52.52 }, description: '租金上限诉求（种子/示例）', source: 'seed/示例' },
  { id: 'r2we-inc-4', title: '波罗的海 · 俄舰', date: T13, type: 'military', faction: 'ru', location: { lng: 20.0, lat: 58.0 }, description: '军舰进入演习区（种子/示例）', source: 'seed/示例' },
];
export const WE_DENSIFY_FACILITIES: Facility[] = [
  { id: 'r2we-fac-ramstein', name: '拉姆施泰因基地', position: { lat: 49.44, lng: 7.6 }, faction: 'us', type: 'airfield', notes: '美军欧洲枢纽（种子/示例）' },
  { id: 'r2we-fac-lakenheath', name: '莱肯希思基地', position: { lat: 52.41, lng: 0.56 }, faction: 'us', type: 'airfield', forces: ['F-35'], notes: '欧洲战斗机基地（种子/示例）' },
  { id: 'r2we-fac-rota', name: '罗塔海军基地', position: { lat: 36.62, lng: -6.35 }, faction: 'us', type: 'naval', notes: '地中海驱逐舰港（种子/示例）' },
  { id: 'r2we-fac-akrotiri', name: '阿克罗蒂里基地', position: { lat: 34.59, lng: 32.96 }, faction: 'uk', type: 'airfield', notes: '东地中海英军基地（种子/示例）' },
  { id: 'r2we-fac-zaporizhzhia', name: '扎波罗热核电站', position: { lat: 47.51, lng: 34.58 }, faction: 'ru', type: 'nuclear', nuclearKind: 'power_plant', status: '争议控制', notes: '欧洲最大核电站（种子/示例）' },
];

// ── 东欧 ──────────────────────────────────────────
export const EE_DENSIFY_EVENTS: EventDetail[] = [
  { id: 'r2ee-ukraine', title: '乌克兰 · 顿巴斯前线', source: 'seed/示例', timestamp: T16, location: [37.5, 48.5], impact_level: 'critical', category: 'conflicts', description: '俄军推进尝试（种子/示例）' },
  { id: 'r2ee-belarus', title: '白俄罗斯 · 军事演习', source: 'seed/示例', timestamp: T15, location: [27.5, 53.9], impact_level: 'high', category: 'military', description: '俄白联合演习（种子/示例）' },
  { id: 'r2ee-moldova', title: '摩尔多瓦 · 德左局势', source: 'seed/示例', timestamp: T14, location: [29.5, 47.0], impact_level: 'medium', category: 'conflicts', description: '德涅斯特河左岸分离主义（种子/示例）' },
  { id: 'r2ee-baltic', title: '波罗的海 · 北约演习', source: 'seed/示例', timestamp: T13, location: [24.0, 57.0], impact_level: 'high', category: 'military', description: '波罗的海防卫演习（种子/示例）' },
  { id: 'r2ee-kaliningrad', title: '加里宁格勒 · 军事集结', source: 'seed/示例', timestamp: T16, location: [20.5, 54.7], impact_level: 'high', category: 'bases', description: '波罗的海飞地军事集群（种子/示例）' },
  { id: 'r2ee-georgia', title: '格鲁吉亚 · 俄占领土', source: 'seed/示例', timestamp: T12, location: [43.0, 42.5], impact_level: 'medium', category: 'conflicts', description: '南奥塞梯与阿布哈兹（种子/示例）' },
  { id: 'r2ee-armenia', title: '亚美尼亚 · 纳卡余波', source: 'seed/示例', timestamp: T11, location: [44.5, 40.2], impact_level: 'medium', category: 'conflicts', description: '难民安置与边境摩擦（种子/示例）' },
  { id: 'r2ee-poland', title: '波兰 · 边境防务', source: 'seed/示例', timestamp: T10, location: [23.0, 52.0], impact_level: 'high', category: 'military', description: '北约东翼前沿部署（种子/示例）' },
];
export const EE_DENSIFY_INCIDENTS: Incident[] = [
  { id: 'r2ee-inc-1', title: '哈尔科夫 · 交火', date: T16, type: 'military', faction: 'ru', location: { lng: 36.25, lat: 49.99 }, description: '边境推进（种子/示例）', source: 'seed/示例' },
  { id: 'r2ee-inc-2', title: '扎波罗热 · 核电站', date: T15, type: 'political', faction: 'ru', location: { lng: 34.58, lat: 47.51 }, description: 'IAEA视察（种子/示例）', source: 'seed/示例' },
  { id: 'r2ee-inc-3', title: '加里宁格勒 · 演习', date: T14, type: 'military', faction: 'ru', location: { lng: 20.5, lat: 54.7 }, description: '导弹试射（种子/示例）', source: 'seed/示例' },
  { id: 'r2ee-inc-4', title: '第比利斯 · 抗议', date: T13, type: 'political', faction: 'ge', location: { lng: 44.8, lat: 41.72 }, description: '外国代理人法抗议（种子/示例）', source: 'seed/示例' },
];
export const EE_DENSIFY_FACILITIES: Facility[] = [
  { id: 'r2ee-fac-kaliningrad', name: '加里宁格勒驻军', position: { lat: 54.7, lng: 20.5 }, faction: 'ru', type: 'base', notes: '波罗的海飞地（种子/示例）' },
  { id: 'r2ee-fac-sevastopol', name: '塞瓦斯托波尔', position: { lat: 44.62, lng: 33.53 }, faction: 'ru', type: 'naval', forces: ['黑海舰队'], notes: '黑海舰队母港（种子/示例）' },
  { id: 'r2ee-fac-zaporizhzhia', name: '扎波罗热核电站', position: { lat: 47.51, lng: 34.58 }, faction: 'ru', type: 'nuclear', nuclearKind: 'power_plant', notes: '争议控制（种子/示例）' },
  { id: 'r2ee-fac-chernobyl', name: '切尔诺贝利', position: { lat: 51.39, lng: 30.1 }, faction: 'ua', type: 'nuclear', nuclearKind: 'contamination', notes: '1986事故遗址（种子/示例）' },
  { id: 'r2ee-fac-redzikowo', name: '雷济科沃基地', position: { lat: 54.47, lng: 17.1 }, faction: 'us', type: 'missile', notes: '北约反导系统（种子/示例）' },
];
export const EE_DENSIFY_ENERGY: EnergyDataPoint[] = [
  { id: 'r2ee-en-gas', name: '欧洲天然气库存', unit: '%', value: 72, change: -3, description: '储气库填充率', updatedAt: T16, source: 'seed/示例' },
  { id: 'r2ee-en-oil', name: '乌拉尔原油价格', unit: '美元/桶', value: 68, change: 2, description: '俄油折扣收窄', updatedAt: T15, source: 'seed/示例' },
];
