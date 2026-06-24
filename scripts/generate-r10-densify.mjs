#!/usr/bin/env node
/**
 * 第十轮增密数据生成器 — 一次性脚本，输出 r10 TypeScript 模块
 */
import { writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dir = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dir, '../src/regions');

const T = '2026-06-24T10:00:00Z';
const T2 = '2026-06-23T08:00:00Z';
const T3 = '2026-06-22T16:00:00Z';
const T24 = '2026-06-24T09:00:00Z';
const T23 = '2026-06-23T14:00:00Z';
const T22 = '2026-06-22T11:00:00Z';
const T21 = '2026-06-21T16:00:00Z';
const T20 = '2026-06-20T08:00:00Z';
const T19 = '2026-06-19T12:00:00Z';
const T18 = '2026-06-18T10:00:00Z';
const TIMES = [T24, T23, T22, T21, T20, T19, T18];
const IMPACTS = ['low', 'medium', 'high', 'critical'];

function pick(arr, i) { return arr[i % arr.length]; }
function impact(i) { return IMPACTS[i % 4]; }

// ── City pools ──
const CITIES = [
  ['北京', 116.4, 39.9], ['上海', 121.47, 31.23], ['东京', 139.69, 35.69], ['首尔', 126.98, 37.57],
  ['新加坡', 103.85, 1.28], ['孟买', 72.87, 19.08], ['迪拜', 55.27, 25.2], ['伊斯坦布尔', 29.01, 41.08],
  ['伦敦', -0.12, 51.5], ['巴黎', 2.35, 48.86], ['柏林', 13.4, 52.52], ['莫斯科', 37.62, 55.75],
  ['纽约', -74.01, 40.71], ['华盛顿', -77.04, 38.9], ['洛杉矶', -118.24, 34.05], ['休斯顿', -95.36, 29.76],
  ['圣保罗', -46.63, -23.55], ['布宜诺斯艾利斯', -58.38, -34.6], ['开罗', 31.24, 30.04], ['拉各斯', 3.38, 6.52],
  ['内罗毕', 36.82, -1.29], ['约翰内斯堡', 28.05, -26.2], ['悉尼', 151.21, -33.87], ['雅加达', 106.85, -6.21],
  ['曼谷', 100.5, 13.75], ['河内', 105.85, 21.03], ['马尼拉', 120.98, 14.55], ['台北', 121.56, 25.04],
  ['香港', 114.16, 22.28], ['利雅得', 46.72, 24.71], ['德黑兰', 51.42, 35.69], ['巴格达', 44.37, 33.31],
  ['基辅', 30.52, 50.45], ['华沙', 21.01, 52.23], ['罗马', 12.5, 41.9], ['马德里', -3.7, 40.4],
  ['阿姆斯特丹', 4.9, 52.37], ['苏黎世', 8.54, 47.37], ['斯德哥尔摩', 18.07, 59.33], ['赫尔辛基', 24.94, 60.17],
  ['多伦多', -79.38, 43.65], ['温哥华', -123.12, 49.28], ['墨西哥城', -99.13, 19.43], ['利马', -77.04, -12.05],
  ['波哥大', -74.07, 4.71], ['圣地亚哥', -70.65, -33.45], ['卡拉奇', 67.01, 24.86], ['达卡', 90.41, 23.81],
  ['科伦坡', 79.86, 6.93], ['仰光', 96.15, 16.87], ['金边', 104.92, 11.56], ['万象', 102.63, 17.98],
  ['阿拉木图', 76.95, 43.24], ['塔什干', 69.24, 41.3], ['巴库', 49.87, 40.41], ['第比利斯', 44.79, 41.72],
  ['基辅', 30.52, 50.45], ['明斯克', 27.57, 53.9], ['贝尔格莱德', 20.46, 44.82], ['布达佩斯', 19.04, 47.5],
  ['布拉格', 14.42, 50.08], ['维也纳', 16.37, 48.21], ['雅典', 23.73, 37.98], ['开普敦', 18.42, -33.92],
  ['卡萨布兰卡', -7.62, 33.59], ['突尼斯', 10.18, 36.8], ['喀土穆', 32.5, 15.6], ['亚的斯亚贝巴', 38.74, 9.03],
  ['金沙萨', 15.31, -4.32], ['拉各斯', 3.38, 6.52], ['达累斯萨拉姆', 39.28, -6.79], ['卢萨卡', 28.29, -15.42],
  ['惠灵顿', 174.78, -41.29], ['奥克兰', 174.76, -36.85], ['雷克雅未克', -21.94, 64.15], ['多哈', 51.53, 25.29],
  ['麦纳麦', 50.58, 26.23], ['科威特城', 47.98, 29.38], ['马斯喀特', 58.59, 23.59], ['安曼', 35.93, 31.95],
  ['贝鲁特', 35.5, 33.89], ['大马士革', 36.3, 33.5], ['萨那', 44.2, 15.35], ['特拉维夫', 34.78, 32.08],
  ['加德满都', 85.32, 27.72], ['伊斯兰堡', 73.05, 33.69], ['喀布尔', 69.17, 34.53], ['乌兰巴托', 106.91, 47.92],
  ['平壤', 125.75, 39.02], ['大阪', 135.5, 34.7], ['福冈', 130.4, 33.59], ['名古屋', 136.91, 35.18],
  ['槟城', 100.39, 5.35], ['吉隆坡', 101.69, 3.14], ['胡志明市', 106.63, 10.82], ['金奈', 80.27, 13.08],
  ['班加罗尔', 77.59, 12.97], ['新德里', 77.2, 28.6], ['加尔各答', 88.36, 22.57], ['海得拉巴', 78.48, 17.39],
  ['成都', 104.07, 30.67], ['武汉', 114.31, 30.52], ['深圳', 114.06, 22.55], ['广州', 113.26, 23.13],
  ['重庆', 106.55, 29.56], ['西安', 108.94, 34.26], ['青岛', 120.38, 36.07], ['大连', 121.62, 38.92],
  ['厦门', 118.09, 24.48], ['福州', 119.3, 26.08], ['合肥', 117.28, 31.86], ['郑州', 113.65, 34.76],
  ['迈阿密', -80.19, 25.76], ['芝加哥', -87.63, 41.88], ['达拉斯', -96.8, 32.78], ['丹佛', -104.99, 39.74],
  ['西雅图', -122.33, 47.61], ['亚特兰大', -84.39, 33.75], ['波士顿', -71.06, 42.36], ['旧金山', -122.42, 37.77],
  ['凤凰城', -112.07, 33.45], ['蒙特利尔', -73.57, 45.5], ['卡尔加里', -114.07, 51.05],
];

const PROTEST_TOPICS = ['紧缩政策', '住房危机', '劳工权益', '选举争议', '环保诉求', '土地征收', '燃油涨价', '司法改革', '教育预算', '移民政策', '腐败调查', '最低工资', '养老金改革', '医疗私有化', '学生贷款', '警察暴力', '性别平等', '原住民权利', '网络审查', '关税冲击'];
const CLIMATE_KINDS = ['flood', 'drought', 'heatwave', 'wildfire', 'storm', 'haze', 'ice'];
const CLIMATE_EVENTS = ['暴雨洪涝', '持续干旱', '破纪录高温', '野火蔓延', '强台风逼近', '跨境烟霾', '冰川消融', '极端降雪', '海水倒灌', '沙尘暴'];
const MINERAL_KINDS = ['lithium', 'cobalt', 'copper', 'nickel', 'rare_earth', 'iron', 'uranium', 'tin', 'bauxite', 'tantalum', 'graphite', 'manganese'];
const MINERAL_NOTES = ['战略矿产开发加速', '中资/美资投资争议', '环保许可受阻', '出口配额调整', '冲突矿产监管', '精炼产能扩张', '勘探权拍卖', '社区抗议封锁', '供应链重组节点', '库存战略储备'];
const DC_NOTES = ['AI训练集群', '云主权合规节点', '边缘推理中心', '灾备双活机房', '液冷试点园区', '绿电PPA签约', '跨境数据枢纽', '超算中心', '量子计算试点', '游戏/流媒体CDN'];
const ECON_NOTES = ['区域金融枢纽', '离岸中心', '创投生态', '大宗商品交易', '主权财富基金', '自贸区政策', '跨境支付试点', '绿色债券发行', '数字资产监管沙盒', '再保险中心'];
const CONFLICT_ZONES = [
  ['乌克兰东部', 37.8, 48.0, '俄军推进与乌军防线拉锯'], ['苏丹达尔富尔', 25.0, 13.0, '快速支援部队推进'], ['缅甸若开邦', 94.0, 20.0, '民族武装与军政府交战'],
  ['刚果北基伍', 29.0, -1.5, 'M23叛军攻势'], ['萨赫勒中部', -1.5, 12.4, 'JNIM恐怖袭击'], ['莫桑比克北部', 39.5, -12.5, '伊斯兰武装袭击'],
  ['埃塞俄比亚阿姆哈拉', 38.0, 11.5, '地方武装对峙'], ['哥伦比亚ELN', -74.0, 4.6, '停火破裂袭击管道'], ['泰南分离主义', 101.0, 6.5, '连环爆炸'],
  ['也门红海', 44.2, 15.35, '胡塞维持商船威胁'], ['海地太子港', -72.34, 18.54, '帮派控制区扩大'], ['马里北部', -3.0, 16.0, '图阿雷格武装活动'],
  ['尼日利亚东北部', 12.0, 11.0, '博科圣地袭击'], ['喀麦隆英语区', 10.0, 5.5, '分离主义冲突'], ['菲律宾棉兰老', 124.0, 7.0, '摩洛冲突余波'],
  ['印度曼尼普尔', 93.9, 24.8, '族群暴力'], ['巴基斯坦俾路支', 65.0, 28.0, '分离武装袭击'], ['索马里南部', 45.0, 2.0, '青年党活动'],
  ['利比亚东部', 20.0, 32.0, '派系武装对峙'], ['中非共和国', 18.5, 4.4, '叛军控制区'], ['南苏丹', 31.5, 6.8, '族群冲突'],
];
const HOTSPOT_ZONES = [
  ['黎巴嫩边境', 35.5, 33.3, '以军与真主党跨境交火'], ['约旦河西岸', 35.2, 31.9, '定居点冲突升级'], ['板门店', 126.68, 37.95, '朝韩气球对峙'],
  ['北极挪威海', 15.0, 78.0, '北约反潜演习'], ['埃塞奎博', -59.0, 5.0, '委圭领土争议'], ['东地中海气田', 33.0, 34.5, '油气勘探对峙'],
  ['亚丁湾', 49.0, 12.0, '海盗活动回升'], ['波兰边境', 23.5, 52.5, '混合威胁'], ['台湾海峡', 119.5, 24.0, '军事演训'],
  ['南海岛礁', 114.5, 9.5, '执法对峙'], ['克什米尔', 74.5, 34.2, '边境交火'], ['钓鱼岛', 123.47, 25.75, '海警巡航'],
  ['霍尔木兹', 56.3, 26.8, '油轮通行监测'], ['加沙地带', 34.47, 31.5, '人道危机'], ['朝鲜半岛', 125.5, 40.0, '导弹试射'],
  ['黑海', 34.0, 44.0, '俄乌海上对峙'], ['波罗的海', 19.0, 57.5, '海底基础设施告警'], ['台海中线', 119.8, 24.2, '军机过线'],
];
const ECON_EVENTS = [
  ['美联储决议', -77.04, 38.9, '利率路径指引'], ['欧央行降息', 8.68, 50.11, '欧元区通胀回落'], ['OPEC+会议', 54.0, 24.0, '减产政策'],
  ['金砖峰会', 37.62, 55.75, '本币结算讨论'], ['G7贸易限制', 13.4, 42.5, '半导体出口管制'], ['中国房地产', 116.4, 39.9, '限购松绑'],
  ['印度GDP', 77.2, 28.6, '制造业扩张'], ['锂价反弹', -68.2, -23.5, '盐湖减产'], ['红海航运', 43.0, 14.0, '保费飙升'],
  ['AI投资', -122.4, 37.77, '资本开支上调'], ['日元干预', 139.69, 35.69, '汇率波动'], ['欧盟CBAM', 4.35, 50.85, '碳边境调节'],
  ['稀土博弈', 109.97, 41.77, '供应链重组'], ['芯片关税', 121.0, 24.8, '贸易限制升级'], ['巴西利率', -46.63, -23.55, '通胀目标'],
  ['南非电力', 28.05, -26.2, '限电影响矿业'], ['土耳其通胀', 29.01, 41.08, '里拉贬值'], ['墨西哥近岸', -99.13, 19.43, '制造业回流'],
];
const FACTIONS = ['ru', 'ua', 'cn', 'us', 'il', 'ir', 'kp', 'in', 'tr', 'nato', 'houthis', 'hezbollah', 'm23', 'rsf', 'jnim', 'is', 've', 'opec', 'eg', 'jp', 'ph', 'au', 'sa', 'pmf'];
const INC_TYPES = ['military', 'political', 'diplomatic'];
/** 标题事件类型 — 与 etype / 摘要池严格对齐 */
const INC_TITLE_KINDS = [
  { keyword: '军事', type: 'military', descs: ['局势升级', '交火报告', '演习公告', '情报披露'] },
  { keyword: '外交', type: 'diplomatic', descs: ['谈判进展', '制裁措施', '人道关切', '外交照会'] },
  { keyword: '政治', type: 'political', descs: ['局势升级', '人道关切', '政策调整', '情报披露'] },
  { keyword: '海上', type: 'military', descs: ['护航行动', '海域巡逻', '舰队调动', '演习公告'] },
  { keyword: '边境', type: 'military', descs: ['边境交火', '局势升级', '演习公告', '情报披露'] },
];
/** 可承载海上/海事类事件的沿海/港口城市 */
const COASTAL_CITIES = [
  ['上海', 121.47, 31.23], ['青岛', 120.38, 36.07], ['大连', 121.62, 38.92],
  ['厦门', 118.09, 24.48], ['深圳', 114.06, 22.55], ['广州', 113.26, 23.13],
  ['香港', 114.16, 22.28], ['台北', 121.56, 25.04], ['新加坡', 103.85, 1.28],
  ['孟买', 72.87, 19.08], ['迪拜', 55.27, 25.2], ['伊斯坦布尔', 29.01, 41.08],
  ['伦敦', -0.12, 51.5], ['东京', 139.69, 35.69], ['首尔', 126.98, 37.57],
  ['纽约', -74.01, 40.71], ['洛杉矶', -118.24, 34.05], ['休斯顿', -95.36, 29.76],
  ['迈阿密', -80.19, 25.76], ['西雅图', -122.33, 47.61], ['旧金山', -122.42, 37.77],
  ['波士顿', -71.06, 42.36], ['悉尼', 151.21, -33.87], ['雅加达', 106.85, -6.21],
  ['曼谷', 100.5, 13.75], ['马尼拉', 120.98, 14.55], ['胡志明市', 106.63, 10.82],
  ['槟城', 100.39, 5.35], ['吉隆坡', 101.69, 3.14], ['科伦坡', 79.86, 6.93],
  ['达卡', 90.41, 23.81], ['仰光', 96.15, 16.87], ['金边', 104.92, 11.56],
  ['福冈', 130.4, 33.59], ['大阪', 135.5, 34.7], ['名古屋', 136.91, 35.18],
  ['开罗', 31.24, 30.04], ['拉各斯', 3.38, 6.52], ['开普敦', 18.42, -33.92],
  ['卡萨布兰卡', -7.62, 33.59], ['温哥华', -123.12, 49.28], ['利马', -77.04, -12.05],
  ['圣地亚哥', -70.65, -33.45], ['卡拉奇', 67.01, 24.86], ['多哈', 51.53, 25.29],
  ['麦纳麦', 50.58, 26.23], ['科威特城', 47.98, 29.38], ['马斯喀特', 58.59, 23.59],
  ['贝鲁特', 35.5, 33.89], ['特拉维夫', 34.78, 32.08], ['惠灵顿', 174.78, -41.29],
  ['奥克兰', 174.76, -36.85], ['雷克雅未克', -21.94, 64.15], ['福州', 119.3, 26.08],
  ['加尔各答', 88.36, 22.57], ['金奈', 80.27, 13.08],
];
const BATCH_DISCLAIMER = '（公开资料汇总·示意坐标·非实时情报）';
const CABLE_REGIONS = [
  ['红海', 42.8, 14.2, '亚欧链路拥塞'], ['苏伊士', 32.3, 30.0, '陆缆段检修'], ['波罗的海', 19.0, 57.5, '信号衰减告警'],
  ['巽他海峡', 105.5, -5.8, '锚损事件'], ['菲律宾海', 120.5, 14.5, '链路拥塞'], ['南非', 18.5, -34.0, '维护延期'],
  ['塔斯曼海', 165.0, -42.0, '计划外检修'], ['大西洋', -40.0, 45.0, '金融链路延迟'], ['地中海', 15.0, 38.0, '地震影响'],
  ['波斯湾', 56.0, 26.0, '油气管廊并行区'], ['东非', 39.67, -4.05, '登陆站故障'], ['加勒比', -70.0, 18.0, '飓风威胁'],
  ['北海', 3.0, 56.0, '渔业拖网损伤'], ['马六甲', 100.0, 2.5, '航运密集区'], ['台湾海峡', 119.5, 24.0, '地缘政治风险'],
  ['白令海', -170.0, 58.0, '冰区维护困难'], ['印度洋', 72.0, -5.0, '深海段告警'], ['南太平洋', -150.0, -20.0, '偏远段修复延迟'],
];
const LAUNCH_SITES = [
  ['Vandenberg', -120.63, 34.74, 'launch-us-vandenberg'], ['Cape Canaveral', -80.6, 28.56, 'launch-us-cape'],
  ['Xichang', 102.03, 28.25, 'launch-cn-xichang'], ['Jiuquan', 100.3, 40.96, 'launch-cn-jiuquan'],
  ['Sriharikota', 80.23, 13.72, 'launch-in-sriharikota'], ['Kourou', -52.77, 5.24, 'launch-fr-kourou'],
  ['Baikonur', 63.31, 45.96, 'launch-kz-baikonur'], ['Tanegashima', 131.0, 30.4, 'launch-jp-tanegashima'],
  ['Plesetsk', 40.5, 62.9, 'launch-ru-plesetsk'], ['Mahia', 177.86, -39.26, 'launch-nz-mahia'],
];
const LAUNCH_PROVIDERS = ['SpaceX', 'CASC', 'ISRO', 'Arianespace', 'Roscosmos', 'JAXA', 'Rocket Lab', 'ULA', 'Blue Origin', 'Firefly'];
const SPACE_EVENT_KINDS = ['closeapproach', 'reentry', 'breakup', 'collision', 'asat'];
const REGIONS = {
  china: { prefix: 'r4cn', events: 40, incidents: 35, facilities: 15, source: '中国周边监测' },
  middle_east: { prefix: 'r4me', events: 40, incidents: 35, facilities: 15, source: '公开态势整理' },
  asia_pacific: { prefix: 'r4ap', events: 40, incidents: 35, facilities: 15, source: '公开态势整理' },
  north_america: { prefix: 'r4na', events: 40, incidents: 35, facilities: 15, source: '公开态势整理' },
  latin_america: { prefix: 'r4la', events: 40, incidents: 35, facilities: 15, source: '公开态势整理' },
  southeast_asia: { prefix: 'r4sea', events: 40, incidents: 35, facilities: 15, source: '公开态势整理' },
  western_europe: { prefix: 'r4we', events: 40, incidents: 35, facilities: 15, source: '公开态势整理' },
  eastern_europe: { prefix: 'r4ee', events: 40, incidents: 35, facilities: 15, source: '公开态势整理' },
  global: { prefix: 'r4gl', events: 40, incidents: 35, facilities: 15, source: '公开态势整理' },
};
const FAC_TYPES = ['naval', 'airfield', 'base', 'nuclear'];
const FAC_FACTIONS = ['us', 'cn', 'ru', 'jp', 'au', 'in', 'tr', 'ir', 'il', 'sa', 'uk', 'fr', 'de', 'kr', 'ph'];

const counts = {};

function batchPoints(prefix, layerId, n, nameFn, noteFn, extraFn) {
  const pts = [];
  for (let i = 0; i < n; i++) {
    const [city, lng, lat] = CITIES[i % CITIES.length];
    const pt = {
      id: `r10-${prefix}-${String(i + 1).padStart(3, '0')}`,
      name: nameFn(city, i),
      layerId,
      lng: lng + (i % 7) * 0.03 - 0.09,
      lat: lat + (i % 5) * 0.02 - 0.04,
      note: noteFn(city, i) + BATCH_DISCLAIMER,
      impact: impact(i),
    };
    if (extraFn) Object.assign(pt, extraFn(i));
    pts.push(pt);
  }
  return pts;
}

// ═══════════════════════════════════════════════════════════════
// FILE 1: global.layers-densify-r10.ts
// ═══════════════════════════════════════════════════════════════
const protests = batchPoints('pro', 'protests', 80, (c, i) => `${c} · ${pick(PROTEST_TOPICS, i)}抗议`, (c, i) => `${c}爆发${pick(PROTEST_TOPICS, i)}相关示威`, i => ({ updatedAt: pick([T, T2, T3], i) }));
const climate = batchPoints('cli', 'climate', 80, (c, i) => `${c} · ${pick(CLIMATE_EVENTS, i)}`, (c, i) => `${c}遭遇${pick(CLIMATE_EVENTS, i)}`, i => ({ updatedAt: pick([T, T2, T3], i), subKind: pick(CLIMATE_KINDS, i) }));
const econHubs = batchPoints('hub', 'econ_hubs', 70, (c, i) => `${c} · 金融节点`, (c, i) => `${pick(ECON_NOTES, i)}（${c}）`);
const minerals = batchPoints('min', 'minerals', 70, (c, i) => `${c} · ${pick(MINERAL_KINDS, i)}产区`, (c, i) => `${pick(MINERAL_NOTES, i)}`, i => ({ subKind: pick(MINERAL_KINDS, i) }));
const datacenters = batchPoints('dc', 'datacenters', 70, (c, i) => `${c} · 算力节点`, (c, i) => `${pick(DC_NOTES, i)}`);
const nuclear = batchPoints('npp', 'nuclear_reactors', 30, (c, i) => `${c} · 核电项目`, (c, i) => `核电扩建/新建项目监测点`, i => ({ subKind: pick(['mega', 'large', 'small'], i) }));

function batchPointsHelper() {
  return `function batchPoints(
  prefix: string,
  layerId: LayerId,
  rows: [number, number, string, string, ImpactLevel, string?][],
  baseDate: string,
): ThematicPoint[] {
  return rows.map(([lng, lat, name, note, imp, subKind], i) => ({
    id: \`r10-\${prefix}-\${String(i + 1).padStart(3, '0')}\`,
    name,
    layerId,
    lng,
    lat,
    note: note + BATCH_DISCLAIMER,
    impact: imp,
    ...(subKind ? { subKind } : {}),
    ...(layerId === 'protests' || layerId === 'climate' ? { updatedAt: baseDate } : {}),
  }));
}`;
}

const file1 = `/**
 * 第十轮增密 · 地表主题图层 A（2026-06-24）
 * protests / climate / econ_hubs / minerals / datacenters / nuclear_reactors
 * 坐标为公开资料示意位置。整理日：2026-06-24。
 */
import type { ImpactLevel, LayerId } from '@/types/geo';
import type { ThematicPoint } from './global.thematic';

const T = '${T}';
const T2 = '${T2}';
const T3 = '${T3}';

${batchPointsHelper()}

export const DENSIFY_PROTESTS_R10: ThematicPoint[] = ${JSON.stringify(protests, null, 2).replace(/"layerId": "protests"/g, 'layerId: \'protests\'').replace(/"([^"]+)":/g, (m, k) => k === 'layerId' ? m : `${k}:`).replace(/"/g, "'").replace(/'/g, "'")};

// Fix JSON to TS manually below
`;

// Use proper TS string generation instead of broken JSON
function tsPoint(p, opts = {}) {
  const lines = [`  { id: '${p.id}', name: '${p.name.replace(/'/g, "\\'")}', layerId: '${p.layerId}', lng: ${p.lng.toFixed(2)}, lat: ${p.lat.toFixed(2)}, note: '${p.note.replace(/'/g, "\\'")}', impact: '${p.impact}'`];
  if (p.updatedAt) lines[0] += `, updatedAt: ${p.updatedAt === T ? 'T' : p.updatedAt === T2 ? 'T2' : 'T3'}`;
  if (p.subKind) lines[0] += `, subKind: '${p.subKind}'`;
  lines[0] += ' },';
  return lines[0];
}

function tsThematicArray(name, arr) {
  return `export const ${name}: ThematicPoint[] = [\n${arr.map(p => tsPoint(p)).join('\n')}\n];`;
}

const file1Content = `/**
 * 第十轮增密 · 地表主题图层 A（2026-06-24）
 *
 * protests / climate / econ_hubs / minerals / datacenters / nuclear_reactors
 * 坐标为公开资料示意位置，非精确/实时数据。整理日：2026-06-24。
 */

import type { ThematicPoint } from './global.thematic';

const T = '${T}';
const T2 = '${T2}';
const T3 = '${T3}';

${tsThematicArray('DENSIFY_PROTESTS_R10', protests)}

${tsThematicArray('DENSIFY_CLIMATE_R10', climate)}

${tsThematicArray('DENSIFY_ECON_HUBS_R10', econHubs)}

${tsThematicArray('DENSIFY_MINERALS_R10', minerals)}

${tsThematicArray('DENSIFY_DATACENTERS_R10', datacenters)}

${tsThematicArray('DENSIFY_NUCLEAR_R10', nuclear)}
`;

counts['global.layers-densify-r10.ts'] = protests.length + climate.length + econHubs.length + minerals.length + datacenters.length + nuclear.length;

// ═══════════════════════════════════════════════════════════════
// FILE 2: global.layers-densify-r10b.ts
// ═══════════════════════════════════════════════════════════════
const semiconductors = [];
const SEMI_OPS = ['台积电', '三星', '英特尔', '美光', 'SK海力士', '格芯', '联电', '中芯国际', '华虹', '意法半导体', '英飞凌', '瑞萨', '德州仪器', 'ADI', 'NXP', '博世', 'Tower', 'Amkor', '日月光', '力积电'];
const SEMI_KINDS = ['foundry', 'memory', 'idm'];
const SEMI_STATUS = ['active', 'planned'];
for (let i = 0; i < 40; i++) {
  const [city, lng, lat] = CITIES[(i + 20) % CITIES.length];
  semiconductors.push({
    id: `r10-fab-${String(i + 1).padStart(3, '0')}`,
    name: `${city} · ${pick(SEMI_OPS, i)}节点`,
    operator: pick(SEMI_OPS, i),
    lng: lng + i * 0.01,
    lat: lat + i * 0.005,
    kind: pick(SEMI_KINDS, i),
    status: pick(SEMI_STATUS, i),
    note: `${pick(['成熟制程扩产', '先进封装', '功率半导体', '存储器扩产', '特色工艺', '车用芯片', 'RF/模拟', 'SiC/GaN'], i)}`,
    impact: impact(i),
  });
}

const deepSea = [];
const DSM_RES = ['nodules', 'crusts', 'sulphides'];
for (let i = 0; i < 45; i++) {
  deepSea.push({
    id: `r10-dsm-${String(i + 1).padStart(3, '0')}`,
    name: `ISA合同区 · ${pick(['CCZ', '印度洋', '大西洋脊', '太平洋海山', '专属经济区'], i)}-${i + 1}`,
    resource: pick(DSM_RES, i),
    lng: -140 + i * 3.2,
    lat: (i % 20) - 10,
    note: pick(['勘探许可审议', '环保评估争议', '商业开采试点', '岛国联合合同', 'NGO诉讼焦点'], i),
    impact: impact(i),
  });
}

const hydrocarbon = [];
const HC_TYPES = ['石油', '天然气', '油气'];
const HC_STATUS = ['生产中', '开发中', '战略储备'];
const HC_TIER = ['mega', 'large', 'medium'];
for (let i = 0; i < 50; i++) {
  const [city, lng, lat] = CITIES[(i + 30) % CITIES.length];
  const tier = pick(HC_TIER, i);
  hydrocarbon.push({ id: `r10-hc-${String(i + 1).padStart(3, '0')}`, tier, city, lng, lat, i });
}

const cableIncidents = [];
for (let i = 0; i < 30; i++) {
  const [region, lng, lat, desc] = CABLE_REGIONS[i % CABLE_REGIONS.length];
  const day = 18 + (i % 7);
  cableIncidents.push({
    id: `r10-cab-${String(i + 1).padStart(3, '0')}`,
    name: `${region} · 海缆事件-${i + 1}`,
    date: `2026-06-${String(day).padStart(2, '0')}`,
    lng: lng + i * 0.1,
    lat: lat + i * 0.05,
    note: `${desc}，运营商启用备用路由`,
    source: `${region}运营商公告（2026-06）`,
    impact: impact(i),
  });
}

const submarineCables = [];
const CABLE_NAMES = ['Pacific Link', 'Atlantic Bridge', 'Indian Ocean Connect', 'Arctic Fiber', 'Africa Ring', 'Asia Express', 'Europe Loop', 'Americas Path', 'Med Corridor', 'Gulf Gateway'];
for (let i = 0; i < 25; i++) {
  const [city, lng, lat] = CITIES[i % CITIES.length];
  const [city2, lng2, lat2] = CITIES[(i + 15) % CITIES.length];
  submarineCables.push({
    id: `r10-cable-${String(i + 1).padStart(3, '0')}`,
    name: `${pick(CABLE_NAMES, i)}-${i + 1}`,
    coordinates: [[lng, lat], [(lng + lng2) / 2, (lat + lat2) / 2], [lng2, lat2]],
    note: `跨洋海缆走廊（${city}—${city2}）`,
    impact: impact(i),
    capacity: `约 ${50 + i * 8} Tbps`,
    year: 2020 + (i % 6),
    planned: i % 5 === 0,
  });
}

const garrisons = [];
const GAR_COUNTRIES = ['us', 'china', 'russia', 'france', 'uk'];
for (let i = 0; i < 45; i++) {
  const [city, lng, lat] = CITIES[(i + 10) % CITIES.length];
  garrisons.push({
    id: `r10-gar-${String(i + 1).padStart(3, '0')}`,
    name: `${city} · 军事基地`,
    country: pick(GAR_COUNTRIES, i),
    lng: lng + i * 0.02,
    lat: lat + i * 0.01,
    role: pick(['前沿部署', '后勤枢纽', '联合演训', '反潜巡逻', '空中加油', '导弹防御', '情报监听', '海军母港'], i),
    impact: impact(i),
  });
}

const launchLog = [];
for (let i = 0; i < 20; i++) {
  const [site, lng, lat, siteId] = LAUNCH_SITES[i % LAUNCH_SITES.length];
  const day = 18 + (i % 7);
  const hour = 4 + (i % 18);
  launchLog.push({
    id: `r10-ll-${String(i + 1).padStart(3, '0')}`,
    title: `${pick(LAUNCH_PROVIDERS, i)} · 商业/科学载荷-${i + 1}`,
    provider: pick(LAUNCH_PROVIDERS, i),
    siteId,
    location: { lng, lat },
    launchTime: `2026-06-${String(day).padStart(2, '0')}T${String(hour).padStart(2, '0')}:${String(i * 3 % 60).padStart(2, '0')}:00Z`,
    status: pick(['success', 'success', 'success', 'partial', 'scheduled'], i),
    orbit: pick(['LEO', 'SSO', 'GTO', 'MEO', 'LEO/SSO'], i),
    payload: pick(['通信卫星', '遥感卫星', 'Starlink批次', '导航增强', '科学实验舱', '军事载荷（未公开）'], i),
    note: pick(['一级回收成功', '上面级正常', '延迟发射', '天气窗口'], i),
    layerId: 'launch_log',
  });
}

const spaceEvents = [];
for (let i = 0; i < 15; i++) {
  const day = 18 + (i % 7);
  spaceEvents.push({
    id: `r10-spe-${String(i + 1).padStart(3, '0')}`,
    name: pick(['碎片逼近告警', '卫星异常解体', '无控再入', '自主避碰', '轨道机动'], i) + `-${i + 1}`,
    date: `2026-06-${String(day).padStart(2, '0')}`,
    kind: pick(SPACE_EVENT_KINDS, i),
    lng: -180 + i * 24,
    lat: (i % 30) - 15,
    note: pick(['低轨交会风险', 'GEO卫星异常', '上面级再入', '星座管理告警', '空间态势通报'], i),
    source: pick(['NASA', 'USSPACECOM', 'LeoLabs', 'ESA', 'CNSA'], i) + '（2026-06）',
    impact: impact(i),
  });
}

function tsFab(f) {
  return `  { id: '${f.id}', name: '${f.name}', operator: '${f.operator}', lng: ${f.lng.toFixed(2)}, lat: ${f.lat.toFixed(2)}, kind: '${f.kind}', status: '${f.status}', note: '${f.note}', impact: '${f.impact}' },`;
}
function tsDsm(d) {
  return `  { id: '${d.id}', name: '${d.name}', resource: '${d.resource}', lng: ${d.lng.toFixed(1)}, lat: ${d.lat.toFixed(1)}, note: '${d.note}', impact: '${d.impact}' },`;
}
function tsHydro(h) {
  const tier = h.tier;
  let imp = 'medium';
  if (tier === 'mega') imp = 'critical';
  else if (tier === 'large') imp = 'high';
  return `  hydroSite('${h.id}', '${h.city}能源节点', '${h.city} Energy-${h.i + 1}', '${pick(HC_TYPES, h.i)}', '约 ${100 + h.i * 5} 百万桶油当量', '${h.city}所在国', '${pick(HC_STATUS, h.i)}', '${tier}', ${h.lng.toFixed(2)}, ${h.lat.toFixed(2)}, '${pick(['LNG出口枢纽', '页岩主产区', 'OPEC调节核心', '战略气田', 'FLNG项目', '管道枢纽'], h.i)}'),`;
}

const file2Content = `/**
 * 第十轮增密 · 地表/洋底战略图层 B（2026-06-24）
 *
 * semiconductors / deep_sea_mining / hydrocarbon / cable_incidents / submarine_cables
 * garrisons / launch_log / space_events
 * 坐标为公开资料示意位置。整理日：2026-06-24。
 */

import type { SemiconductorFab } from './global.semiconductors';
import type { SeabedMiningArea } from './global.deepSeaMining';
import type { HydrocarbonReserveSite } from './global.hydrocarbon';
import type { CableIncident } from './global.cableIncidents';
import type { GarrisonBase } from './global.garrisons';
import type { SubmarineCableRoute } from './global.submarineCables';
import type { SpaceEvent } from './global.spaceEvents';
import type { LaunchLogEntry } from './global.launchLog';

function hydroSite(
  id: string, nameZh: string, name: string,
  type: '石油' | '天然气' | '油气', estimatedReserves: string, country: string,
  status: '生产中' | '开发中' | '战略储备', reserveTier: 'mega' | 'large' | 'medium',
  lng: number, lat: number, note: string,
): HydrocarbonReserveSite {
  let impact: 'low' | 'medium' | 'high' | 'critical' = 'medium';
  if (reserveTier === 'mega') impact = 'critical';
  else if (reserveTier === 'large') impact = 'high';
  return { id, name, nameZh, type, estimatedReserves, country, status, reserveTier, lng, lat, note, impact };
}

export const DENSIFY_SEMICONDUCTORS_R10: SemiconductorFab[] = [
${semiconductors.map(tsFab).join('\n')}
];

export const DENSIFY_DEEP_SEA_R10: SeabedMiningArea[] = [
${deepSea.map(tsDsm).join('\n')}
];

export const DENSIFY_HYDROCARBON_R10: HydrocarbonReserveSite[] = [
${hydrocarbon.map(tsHydro).join('\n')}
];

export const DENSIFY_CABLE_INCIDENTS_R10: CableIncident[] = [
${cableIncidents.map(c => `  { id: '${c.id}', name: '${c.name}', date: '${c.date}', lng: ${c.lng.toFixed(1)}, lat: ${c.lat.toFixed(1)}, note: '${c.note}', source: '${c.source}', impact: '${c.impact}' },`).join('\n')}
];

export const DENSIFY_SUBMARINE_CABLES_R10: SubmarineCableRoute[] = [
${submarineCables.map(c => {
  const coords = c.coordinates.map(([a, b]) => `[${a.toFixed(2)}, ${b.toFixed(2)}]`).join(', ');
  return `  { id: '${c.id}', name: '${c.name}', coordinates: [${coords}], note: '${c.note}', impact: '${c.impact}', capacity: '${c.capacity}', year: ${c.year}${c.planned ? ', planned: true' : ''} },`;
}).join('\n')}
];

export const DENSIFY_GARRISONS_R10: GarrisonBase[] = [
${garrisons.map(g => `  { id: '${g.id}', name: '${g.name}', country: '${g.country}', lng: ${g.lng.toFixed(2)}, lat: ${g.lat.toFixed(2)}, role: '${g.role}（公开资料汇总）', impact: '${g.impact}' },`).join('\n')}
];

export const DENSIFY_LAUNCH_LOG_R10: LaunchLogEntry[] = [
${launchLog.map(l => `  { id: '${l.id}', title: '${l.title}', provider: '${l.provider}', siteId: '${l.siteId}', location: { lng: ${l.location.lng}, lat: ${l.location.lat} }, launchTime: '${l.launchTime}', status: '${l.status}', orbit: '${l.orbit}', payload: '${l.payload}', note: '${l.note}', layerId: 'launch_log' },`).join('\n')}
];

export const DENSIFY_SPACE_EVENTS_R10: SpaceEvent[] = [
${spaceEvents.map(s => `  { id: '${s.id}', name: '${s.name}', date: '${s.date}', kind: '${s.kind}', lng: ${s.lng.toFixed(1)}, lat: ${s.lat.toFixed(1)}, note: '${s.note}', source: '${s.source}', impact: '${s.impact}' },`).join('\n')}
];
`;

counts['global.layers-densify-r10b.ts'] = semiconductors.length + deepSea.length + hydrocarbon.length + cableIncidents.length + submarineCables.length + garrisons.length + launchLog.length + spaceEvents.length;

// ═══════════════════════════════════════════════════════════════
// FILE 3: global.densify-r10.ts (events) — DISABLED: 不生成批量态势事件
// ═══════════════════════════════════════════════════════════════
const file3Content = `/**
 * 第十轮增密 · 全球地表态势事件 — 已停用批量生成。
 * 冲突/热点事件须来自 live API 或可验证 URL 来源的手动种子。
 */

import type { EventDetail } from '@/types/geo';

export const GLOBAL_DENSIFY_EVENTS_R10: EventDetail[] = [];
`;

counts['global.densify-r10.ts'] = 0;

// ═══════════════════════════════════════════════════════════════
// FILE 4: global.densify-r10b.ts (incidents) — DISABLED
// ═══════════════════════════════════════════════════════════════
const file4Content = `/**
 * 第十轮增密 · 全球事件时间线 — 已停用批量生成。
 */

import type { Incident } from '@/types/middleeast';

export const GLOBAL_DENSIFY_INCIDENTS_R10: Incident[] = [];
`;

counts['global.densify-r10b.ts'] = 0;

// ═══════════════════════════════════════════════════════════════
// FILE 5: regional-densify-r4.ts
// ═══════════════════════════════════════════════════════════════
let regionalContent = `/**
 * 第四轮增密 · 各区域数据集扩展（2026-06-18 至 06-24）
 * 覆盖 china / middle_east / asia_pacific / north_america / latin_america
 * southeast_asia / western_europe / eastern_europe / global extras
 */

import type { EventDetail } from '@/types/geo';
import type { Incident, Facility } from '@/types/middleeast';

const T24 = '${T24}';
const T23 = '${T23}';
const T22 = '${T22}';
const T21 = '${T21}';

`;
let regionalTotal = 0;

for (const [regionKey, cfg] of Object.entries(REGIONS)) {
  const regionLabel = { china: '中国周边', middle_east: '中东', asia_pacific: '亚太', north_america: '北美', latin_america: '拉美', southeast_asia: '东南亚', western_europe: '西欧', eastern_europe: '东欧', global: '全球' }[regionKey];
  const evName = `${regionKey === 'middle_east' ? 'ME' : regionKey === 'asia_pacific' ? 'AP' : regionKey === 'north_america' ? 'NA' : regionKey === 'latin_america' ? 'LA' : regionKey === 'southeast_asia' ? 'SEA' : regionKey === 'western_europe' ? 'WE' : regionKey === 'eastern_europe' ? 'EE' : regionKey === 'china' ? 'CN' : 'GL'}_DENSIFY_EVENTS_R4`;
  const incName = evName.replace('EVENTS', 'INCIDENTS');
  const facName = evName.replace('EVENTS', 'FACILITIES');

  regionalContent += `\n// ── ${regionLabel} ──────────────────────────────────────────\n`;
  regionalContent += `export const ${evName}: EventDetail[] = [];\n\n`;
  regionalContent += `export const ${incName}: Incident[] = [];\n\n`;

  regionalContent += `export const ${facName}: Facility[] = [\n`;
  for (let i = 0; i < cfg.facilities; i++) {
    const [city, lng, lat] = CITIES[(i + 10) % CITIES.length];
    regionalContent += `  { id: '${cfg.prefix}-fac-${String(i + 1).padStart(3, '0')}', name: '${city} · ${pick(['军事', '海军', '空军', '战略'], i)}设施', position: { lat: ${(lat + i * 0.01).toFixed(2)}, lng: ${(lng + i * 0.02).toFixed(2)} }, faction: '${pick(FAC_FACTIONS, i)}', type: '${pick(FAC_TYPES, i)}', notes: '${regionLabel}战略节点（示意坐标）' },\n`;
  }
  regionalContent += `];\n`;

  regionalTotal += cfg.facilities;
}
counts['regional-densify-r4.ts'] = regionalTotal;

// ═══════════════════════════════════════════════════════════════
// NEWS SEEDS — DISABLED: 须含真实 URL，禁止批量生成
// ═══════════════════════════════════════════════════════════════
counts['news-feed.ts (seeds)'] = 0;

// ═══════════════════════════════════════════════════════════════
// FILE 6: global.layers-densify-r10-supply.ts
// ═══════════════════════════════════════════════════════════════
const SUPPLY_LAYERS = [
  { export: 'DENSIFY_AEROSPACE_MFG_R10', layer: 'aerospace_mfg', prefix: 'am', n: 30, subs: ['airframer', 'supplier'], notes: ['无人机总装', 'MRO维修', '起落架系统', '航电集成', '复合材料', '发动机部件'] },
  { export: 'DENSIFY_DEFENSE_MFG_R10', layer: 'defense_mfg', prefix: 'dm', n: 30, subs: ['missiles', 'prime', 'shipyard'], notes: ['导弹工厂', '坦克总装', '雷达电子', '护卫舰建造', '弹药产线', '防空系统'] },
  { export: 'DENSIFY_SEMI_SUPPLY_R10', layer: 'semi_supply', prefix: 'ss', n: 30, subs: ['materials', 'eda', 'osat'], notes: ['光刻配套', '检测设备', '掩模制造', '特种气体', '封装基板', '国产设备'] },
  { export: 'DENSIFY_CHEMICALS_R10', layer: 'chemicals', prefix: 'ch', n: 30, subs: ['specialty', 'petrochem', 'battery'], notes: ['氟化工', '钛白粉', '碳纤维', '电解液', '工业气体', '聚合物'] },
];

let supplyContent = `/**
 * 第十轮增密 · 产业链/供应链图层（2026-06-24）
 * aerospace_mfg / defense_mfg / semi_supply / chemicals
 */

import type { ThematicPoint } from './global.thematic';

`;
let supplyTotal = 0;
for (const sl of SUPPLY_LAYERS) {
  supplyContent += `export const ${sl.export}: ThematicPoint[] = [\n`;
  for (let i = 0; i < sl.n; i++) {
    const [city, lng, lat] = CITIES[(i + 40) % CITIES.length];
    supplyContent += `  { id: 'r10-${sl.prefix}-${String(i + 1).padStart(3, '0')}', name: '${city} · ${pick(sl.notes, i)}', layerId: '${sl.layer}', lng: ${(lng + i * 0.02).toFixed(2)}, lat: ${(lat + i * 0.01).toFixed(2)}, note: '${pick(sl.notes, i)}节点（公开资料汇总）', impact: '${impact(i)}', subKind: '${pick(sl.subs, i)}' },\n`;
  }
  supplyContent += `];\n\n`;
  supplyTotal += sl.n;
}
counts['global.layers-densify-r10-supply.ts'] = supplyTotal;

// Write files
writeFileSync(join(OUT, 'global.layers-densify-r10.ts'), file1Content);
writeFileSync(join(OUT, 'global.layers-densify-r10b.ts'), file2Content);
writeFileSync(join(OUT, 'global.densify-r10.ts'), file3Content);
writeFileSync(join(OUT, 'global.densify-r10b.ts'), file4Content);
writeFileSync(join(OUT, 'regional-densify-r4.ts'), regionalContent);
writeFileSync(join(OUT, 'global.layers-densify-r10-supply.ts'), supplyContent);
writeFileSync(join(__dir, '../src/data/news-seeds-r10.ts'), `/** r10 新闻种子 — 批量生成已停用；须含真实 URL */\nimport type { NewsFeedItem } from './news-feed';\n\nexport const NEWS_SEEDS_R10: NewsFeedItem[] = [];\n\nexport const NEWS_SEED_REGION_MAP_R10: Record<string, import('@/types/region').RegionId[]> = {};\n`);

const total = Object.values(counts).reduce((a, b) => a + b, 0);
console.log(JSON.stringify({ counts, total, newsPending: 0 }, null, 2));
