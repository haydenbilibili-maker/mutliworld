/**
 * 第九轮增密 · 全球地表态势事件/冲突（2026-06-18 ~ 06-24）
 *
 * 补全 conflicts / hotspots / economic / infrastructure 图层时效节点。
 * 公开态势整理，示意坐标。整理日：2026-06-24。
 */

import type { EventDetail } from '@/types/geo';
import type { Incident } from '@/types/middleeast';

const T24 = '2026-06-24T09:00:00Z';
const T23 = '2026-06-23T14:00:00Z';
const T22 = '2026-06-22T11:00:00Z';
const T21 = '2026-06-21T16:00:00Z';
const T20 = '2026-06-20T08:00:00Z';
const T19 = '2026-06-19T12:00:00Z';
const T18 = '2026-06-18T10:00:00Z';

export const GLOBAL_DENSIFY_EVENTS_R9: EventDetail[] = [
  // ── conflicts（8）──
  { id: 'r9g-ukraine-donetsk', title: '顿涅茨克 · 巷战加剧', source: '公开态势整理', timestamp: T24, location: [37.8, 48.0], impact_level: 'critical', category: 'conflicts', description: '俄军推进波克罗夫斯克方向，乌军防线承压' },
  { id: 'r9g-sudan-khartoum', title: '喀土穆 · 城内战事', source: '公开态势整理', timestamp: T23, location: [32.5, 15.6], impact_level: 'critical', category: 'conflicts', description: '快速支援部队与政府军争夺首都控制权' },
  { id: 'r9g-myanmar-kachin', title: '克钦邦 · 武装冲突', source: '公开态势整理', timestamp: T22, location: [97.4, 25.5], impact_level: 'high', category: 'conflicts', description: '克钦独立军与军政府争夺边境通道' },
  { id: 'r9g-sahel-burkina', title: '布基纳法索 · 恐怖袭击', source: '公开态势整理', timestamp: T21, location: [-1.5, 12.4], impact_level: 'critical', category: 'conflicts', description: 'JNIM 武装扩大控制区，政府军撤退' },
  { id: 'r9g-ethiopia-amhara', title: '阿姆哈拉 · 法ano冲突', source: '公开态势整理', timestamp: T24, location: [38.0, 11.5], impact_level: 'high', category: 'conflicts', description: '联邦政府与地方武装对峙升级' },
  { id: 'r9g-mozambique-cabo', title: '莫桑比克 · 德尔加杜角', source: '公开态势整理', timestamp: T20, location: [39.5, -12.5], impact_level: 'high', category: 'conflicts', description: '伊斯兰国莫桑分支袭击天然气项目区' },
  { id: 'r9g-colombia-eln', title: '哥伦比亚 · ELN 停火破裂', source: '公开态势整理', timestamp: T19, location: [-74.0, 4.6], impact_level: 'medium', category: 'conflicts', description: '民族解放军恢复袭击油气管道' },
  { id: 'r9g-thailand-south', title: '泰南 · 分离主义袭击', source: '公开态势整理', timestamp: T18, location: [101.0, 6.5], impact_level: 'medium', category: 'conflicts', description: '也拉府发生连环爆炸' },
  // ── hotspots（9）──
  { id: 'r9g-lebanon-border', title: '黎巴嫩边境 · 以军空袭', source: '公开态势整理', timestamp: T24, location: [35.5, 33.3], impact_level: 'critical', category: 'hotspots', description: '真主党与以军跨境交火，联合国维和部队撤离部分哨所' },
  { id: 'r9g-west-bank', title: '约旦河西岸 · 定居点冲突', source: '公开态势整理', timestamp: T23, location: [35.2, 31.9], impact_level: 'high', category: 'hotspots', description: '定居者与巴勒斯坦社区冲突，以军突袭难民营' },
  { id: 'r9g-korean-dmz', title: '板门店 · 气球对峙', source: '公开态势整理', timestamp: T22, location: [126.68, 37.95], impact_level: 'high', category: 'hotspots', description: '朝韩互投宣传气球，非军事区紧张' },
  { id: 'r9g-arctic-nato', title: '北极 · 北约巡逻', source: '公开态势整理', timestamp: T24, location: [15.0, 78.0], impact_level: 'medium', category: 'hotspots', description: '挪威海北约反潜演习，俄北方舰队监视' },
  { id: 'r9g-venezuela-guyana', title: '埃塞奎博 · 领土争议', source: '公开态势整理', timestamp: T21, location: [-59.0, 5.0], impact_level: 'high', category: 'hotspots', description: '委内瑞拉公投后军事调动，圭亚那寻求国际支持' },
  { id: 'r9g-nagorno', title: '纳卡 · 难民安置', source: '公开态势整理', timestamp: T20, location: [46.7, 39.8], impact_level: 'medium', category: 'hotspots', description: '亚美尼亚接收纳卡流离民众，人道压力' },
  { id: 'r9g-cyprus-gas', title: '东地中海 · 气田争议', source: '公开态势整理', timestamp: T19, location: [33.0, 34.5], impact_level: 'high', category: 'hotspots', description: '土耳其与希腊/塞浦路斯油气勘探对峙' },
  { id: 'r9g-somalia-piracy', title: '亚丁湾 · 海盗回升', source: '公开态势整理', timestamp: T18, location: [49.0, 12.0], impact_level: 'medium', category: 'hotspots', description: '索马里海盗活动回升，商船改道' },
  { id: 'r9g-belarus-border', title: '波兰边境 · 混合威胁', source: '公开态势整理', timestamp: T24, location: [23.5, 52.5], impact_level: 'high', category: 'hotspots', description: '白俄罗斯边境移民压力与北约增援' },
  // ── economic（8）──
  { id: 'r9g-brics-summit', title: '金砖 · 扩员后首次峰会', source: '公开态势整理', timestamp: T23, location: [37.62, 55.75], impact_level: 'high', category: 'economic', description: '去美元化与本币结算机制讨论' },
  { id: 'r9g-g7-summit', title: 'G7 · 对华贸易限制', source: '公开态势整理', timestamp: T22, location: [13.4, 42.5], impact_level: 'high', category: 'economic', description: '电动车与半导体出口管制协调' },
  { id: 'r9g-ecb-rate', title: '欧央行 · 6 月降息', source: '公开态势整理', timestamp: T21, location: [8.68, 50.11], impact_level: 'high', category: 'economic', description: '欧元区通胀回落，首次降息 25bp' },
  { id: 'r9g-china-property', title: '中国 · 房地产政策', source: '公开态势整理', timestamp: T24, location: [116.4, 39.9], impact_level: 'high', category: 'economic', description: '一线城市限购松绑，开发商债务重组' },
  { id: 'r9g-india-gdp', title: '印度 · GDP 超越英国', source: '公开态势整理', timestamp: T20, location: [77.2, 28.6], impact_level: 'medium', category: 'economic', description: '全球第五大经济体，制造业 PMI 扩张' },
  { id: 'r9g-lithium-price', title: '锂价 · 触底反弹', source: '公开态势整理', timestamp: T19, location: [-68.2, -23.5], impact_level: 'medium', category: 'economic', description: '智利盐湖减产，电池级碳酸锂价格回升' },
  { id: 'r9g-shipping-redsea', title: '红海航运 · 保费飙升', source: '公开态势整理', timestamp: T18, location: [43.0, 14.0], impact_level: 'high', category: 'economic', description: '商船绕好望角，集装箱运价上涨' },
  { id: 'r9g-ai-investment', title: '全球 AI · 资本开支', source: '公开态势整理', timestamp: T24, location: [-122.4, 37.77], impact_level: 'high', category: 'economic', description: '科技巨头上调 AI 基础设施投资指引' },
];

export const GLOBAL_DENSIFY_INCIDENTS_R9: Incident[] = [
  { id: 'r9g-inc-ukraine-2', title: '波克罗夫斯克 · 俄军推进', date: T24, type: 'military', faction: 'ru', location: { lng: 37.2, lat: 48.28 }, description: '乌军防线后撤，平民疏散', source: '公开态势整理' },
  { id: 'r9g-inc-sudan-2', title: '喀土穆 · 炮击', date: T23, type: 'military', faction: 'rsf', location: { lng: 32.5, lat: 15.6 }, description: '快速支援部队炮击政府军阵地', source: '公开态势整理' },
  { id: 'r9g-inc-lebanon-1', title: '黎巴嫩 · 以军空袭', date: T24, type: 'military', faction: 'il', location: { lng: 35.5, lat: 33.3 }, description: '以军空袭真主党目标', source: '公开态势整理' },
  { id: 'r9g-inc-redsea-2', title: '红海 · 导弹袭击', date: T24, type: 'military', faction: 'houthis', location: { lng: 43.0, lat: 14.5 }, description: '胡塞反舰导弹袭击商船', source: '公开态势整理' },
  { id: 'r9g-inc-taiwan-2', title: '台海 · 军舰过航', date: T23, type: 'military', faction: 'us', location: { lng: 120.5, lat: 23.5 }, description: '美舰过航台湾海峡', source: '公开态势整理' },
  { id: 'r9g-inc-scs-2', title: '黄岩岛 · 对峙', date: T22, type: 'military', faction: 'cn', location: { lng: 117.8, lat: 15.1 }, description: '海警与菲方船只近距离对峙', source: '公开态势整理' },
  { id: 'r9g-inc-korea-1', title: '朝鲜 · 垃圾气球', date: T22, type: 'political', faction: 'kp', location: { lng: 126.8, lat: 37.9 }, description: '朝鲜向韩国投放垃圾气球', source: '公开态势整理' },
  { id: 'r9g-inc-iran-2', title: '伊朗 · 浓缩铀报告', date: T21, type: 'political', faction: 'ir', location: { lng: 51.73, lat: 33.72 }, description: 'IAEA 报告纳坦兹丰度上升', source: '公开态势整理' },
  { id: 'r9g-inc-congo-2', title: '戈马 · 叛军炮击', date: T21, type: 'military', faction: 'm23', location: { lng: 29.2, lat: -1.68 }, description: 'M23 炮击戈马郊区', source: '公开态势整理' },
  { id: 'r9g-inc-sahel-1', title: '布基纳法索 · 恐袭', date: T20, type: 'military', faction: 'jnim', location: { lng: -1.5, lat: 12.4 }, description: 'JNIM 袭击军事哨所', source: '公开态势整理' },
  { id: 'r9g-inc-mozambique-1', title: '德尔加杜角 · 袭击', date: T20, type: 'military', faction: 'is', location: { lng: 39.5, lat: -12.5 }, description: '武装分子袭击村庄', source: '公开态势整理' },
  { id: 'r9g-inc-venezuela-1', title: '埃塞奎博 · 军事调动', date: T19, type: 'military', faction: 've', location: { lng: -59.0, lat: 5.0 }, description: '委内瑞拉边境部队集结', source: '公开态势整理' },
  { id: 'r9g-inc-baltic-1', title: '波罗的海 · 电缆告警', date: T19, type: 'diplomatic', faction: 'nato', location: { lng: 19.0, lat: 57.5 }, description: '北约启动海底基础设施保护', source: '公开态势整理' },
  { id: 'r9g-inc-opec-2', title: '维也纳 · 补偿减产', date: T18, type: 'diplomatic', faction: 'opec', location: { lng: 16.37, lat: 48.21 }, description: '欧佩克+讨论补偿性减产', source: '公开态势整理' },
  { id: 'r9g-inc-fed-2', title: '华盛顿 · 通胀数据', date: T18, type: 'political', faction: 'us', location: { lng: -77.04, lat: 38.9 }, description: 'CPI 略低于预期，降息预期升温', source: '公开态势整理' },
  { id: 'r9g-inc-gaza-2', title: '加沙 · 停火谈判', date: T24, type: 'political', faction: 'il', location: { lng: 34.47, lat: 31.5 }, description: '人质交换方案再谈判', source: '公开态势整理' },
  { id: 'r9g-inc-ukraine-3', title: '哈尔科夫 · 空袭', date: T23, type: 'military', faction: 'ru', location: { lng: 36.25, lat: 49.99 }, description: '俄军滑翔炸弹袭击基础设施', source: '公开态势整理' },
  { id: 'r9g-inc-india-1', title: '中印 · 边境会谈', date: T22, type: 'diplomatic', faction: 'in', location: { lng: 78.5, lat: 33.5 }, description: '军长级会谈讨论脱离接触', source: '公开态势整理' },
  { id: 'r9g-inc-arctic-1', title: '巴伦支海 · 潜艇追踪', date: T21, type: 'military', faction: 'nato', location: { lng: 20.0, lat: 72.0 }, description: '北约反潜机追踪俄核潜艇', source: '公开态势整理' },
  { id: 'r9g-inc-cyprus-1', title: '东地中海 · 勘探对峙', date: T20, type: 'diplomatic', faction: 'tr', location: { lng: 33.0, lat: 34.5 }, description: '土耳其派遣勘探船', source: '公开态势整理' },
];
