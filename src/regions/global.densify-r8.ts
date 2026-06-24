/**
 * 第八轮增密 · 全球地表态势事件/冲突（2026-06-20 ~ 06-24）
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

export const GLOBAL_DENSIFY_EVENTS_R8: EventDetail[] = [
  // ── conflicts ──
  { id: 'r8g-ukraine-kursk', title: '库尔斯克 · 跨境攻势持续', source: '公开态势整理', timestamp: T24, location: [51.7, 51.7], impact_level: 'critical', category: 'conflicts', description: '乌军跨境行动与俄反击，边境城镇遭炮击' },
  { id: 'r8g-sudan-darfur', title: '达尔富尔 · 人道危机升级', source: '公开态势整理', timestamp: T23, location: [25.0, 13.0], impact_level: 'critical', category: 'conflicts', description: '快速支援部队推进，联合国援助通道受阻' },
  { id: 'r8g-myanmar-rakhine', title: '若开邦 · 战事扩大', source: '公开态势整理', timestamp: T22, location: [94.0, 20.0], impact_level: 'high', category: 'conflicts', description: '民族武装与军政府争夺港口与边境通道' },
  { id: 'r8g-congo-m23', title: '刚果（金）· M23 攻势', source: '公开态势整理', timestamp: T21, location: [29.0, -1.5], impact_level: 'critical', category: 'conflicts', description: '北基伍省战事，卢旺达被指支持叛军' },
  { id: 'r8g-yemen-redsea', title: '也门 · 红海袭击余波', source: '公开态势整理', timestamp: T24, location: [44.2, 15.35], impact_level: 'high', category: 'conflicts', description: '胡塞武装维持红海商船威胁态势' },
  // ── hotspots ──
  { id: 'r8g-gaza-aid', title: '加沙 · 人道援助通道', source: '公开态势整理', timestamp: T23, location: [34.47, 31.5], impact_level: 'critical', category: 'hotspots', description: '停火谈判与援助分发争议持续' },
  { id: 'r8g-taiwan-strait', title: '台湾海峡 · 军事演训', source: '公开态势整理', timestamp: T24, location: [119.5, 24.0], impact_level: 'critical', category: 'hotspots', description: '海空联合战备警巡，外海军演区公告' },
  { id: 'r8g-scs-reef', title: '南海 · 岛礁对峙', source: '公开态势整理', timestamp: T22, location: [114.5, 9.5], impact_level: 'high', category: 'hotspots', description: '多国主张重叠海域执法对峙' },
  { id: 'r8g-kashmir', title: '克什米尔 · 边境交火', source: '公开态势整理', timestamp: T21, location: [74.5, 34.2], impact_level: 'high', category: 'hotspots', description: '实控线附近零星炮击与外交交涉' },
  { id: 'r8g-haiti-gangs', title: '海地 · 帮派控制区', source: '公开态势整理', timestamp: T20, location: [-72.34, 18.54], impact_level: 'critical', category: 'hotspots', description: '太子港大部城区由武装帮派控制' },
  // ── economic ──
  { id: 'r8g-opec-june', title: '欧佩克+ · 产量政策会议', source: '公开态势整理', timestamp: T23, location: [54.0, 24.0], impact_level: 'high', category: 'economic', description: '自愿减产延期与补偿减产讨论' },
  { id: 'r8g-fed-june', title: '美联储 · 6 月利率决议', source: '公开态势整理', timestamp: T22, location: [-77.04, 38.9], impact_level: 'high', category: 'economic', description: '维持利率，点阵图指引年内降息路径' },
  { id: 'r8g-chip-tariff', title: '全球芯片 · 关税与出口管制', source: '公开态势整理', timestamp: T24, location: [121.0, 24.8], impact_level: 'critical', category: 'economic', description: '先进制程设备与 AI 芯片贸易限制升级' },
  { id: 'r8g-eu-carbon', title: '欧盟 · 碳边境调节机制', source: '公开态势整理', timestamp: T21, location: [4.35, 50.85], impact_level: 'medium', category: 'economic', description: 'CBAM 过渡期报告要求，钢铁铝业承压' },
  { id: 'r8g-rare-earth', title: '稀土 · 供应链重组', source: '公开态势整理', timestamp: T20, location: [109.97, 41.77], impact_level: 'high', category: 'economic', description: '中美稀土贸易与加工产能博弈' },
];

export const GLOBAL_DENSIFY_INCIDENTS_R8: Incident[] = [
  { id: 'r8g-inc-ukraine-1', title: '库尔斯克 · 跨境炮击', date: T24, type: 'military', faction: 'ua', location: { lng: 51.7, lat: 51.7 }, description: '乌军炮击俄边境城镇，俄宣布局部动员', source: '公开态势整理' },
  { id: 'r8g-inc-sudan-1', title: '达尔富尔 · 空袭', date: T23, type: 'military', faction: 'rsf', location: { lng: 25.0, lat: 13.0 }, description: '快速支援部队空袭政府军阵地', source: '公开态势整理' },
  { id: 'r8g-inc-congo-1', title: '戈马 · M23 推进', date: T22, type: 'military', faction: 'm23', location: { lng: 29.2, lat: -1.68 }, description: '叛军逼近北基伍省首府', source: '公开态势整理' },
  { id: 'r8g-inc-taiwan-1', title: '台海 · 军机过线', date: T24, type: 'military', faction: 'cn', location: { lng: 119.8, lat: 24.2 }, description: '解放军军机越过海峡中线', source: '公开态势整理' },
  { id: 'r8g-inc-scs-1', title: '南沙 · 执法对峙', date: T22, type: 'military', faction: 'cn', location: { lng: 114.8, lat: 9.2 }, description: '海警与菲方船只近距离对峙', source: '公开态势整理' },
  { id: 'r8g-inc-redsea-1', title: '红海 · 商船遇袭', date: T24, type: 'military', faction: 'houthis', location: { lng: 42.5, lat: 14.8 }, description: '胡塞无人机袭击货轮', source: '公开态势整理' },
  { id: 'r8g-inc-gaza-1', title: '加沙 · 援助分发', date: T23, type: 'political', faction: 'il', location: { lng: 34.47, lat: 31.5 }, description: '人道援助通道谈判', source: '公开态势整理' },
  { id: 'r8g-inc-opec-1', title: '维也纳 · 减产延期', date: T23, type: 'diplomatic', faction: 'opec', location: { lng: 16.37, lat: 48.21 }, description: '欧佩克+同意延长自愿减产', source: '公开态势整理' },
  { id: 'r8g-inc-iran-1', title: '伊朗 · 核计划通报', date: T21, type: 'political', faction: 'ir', location: { lng: 51.42, lat: 35.69 }, description: 'IAEA 报告浓缩铀库存上升', source: '公开态势整理' },
  { id: 'r8g-inc-haiti-1', title: '太子港 · 帮派火并', date: T20, type: 'military', faction: 'gangs', location: { lng: -72.33, lat: 18.54 }, description: '帮派争夺港口控制权', source: '公开态势整理' },
];
