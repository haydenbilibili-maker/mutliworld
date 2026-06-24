/**
 * 第三轮增密 · 各区域数据集扩展（2026-06-18 至 06-24）
 */
import type { EventDetail } from '@/types/geo';
import type { Incident, Facility } from '@/types/middleeast';

const T24 = '2026-06-24T09:00:00Z';
const T23 = '2026-06-23T14:00:00Z';
const T22 = '2026-06-22T11:00:00Z';
const T21 = '2026-06-21T16:00:00Z';

// ── 中东 ──────────────────────────────────────────
export const ME_DENSIFY_EVENTS_R3: EventDetail[] = [
  { id: 'r3me-hormuz-2', title: '霍尔木兹 · 伊朗扣押油轮', source: '公开态势整理', timestamp: T24, location: [56.3, 26.8], impact_level: 'critical', category: 'maritime', description: '伊朗革命卫队扣押涉嫌走私油轮' },
  { id: 'r3me-gaza-2', title: '加沙 · 拉法口岸', source: '公开态势整理', timestamp: T23, location: [34.25, 31.28], impact_level: 'critical', category: 'hotspots', description: '埃及口岸有限开放，援助卡车排队' },
  { id: 'r3me-yemen-2', title: '也门 · 荷台达港', source: '公开态势整理', timestamp: T22, location: [42.95, 14.8], impact_level: 'high', category: 'conflicts', description: '胡塞控制区港口遭空袭' },
  { id: 'r3me-iran-proxy', title: '伊拉克 · 民兵火箭弹', source: '公开态势整理', timestamp: T21, location: [44.0, 33.0], impact_level: 'high', category: 'military', description: '亲伊朗民兵袭击美军基地' },
];

export const ME_DENSIFY_INCIDENTS_R3: Incident[] = [
  { id: 'r3me-inc-hormuz', title: '霍尔木兹 · 扣押油轮', date: T24, type: 'military', faction: 'ir', location: { lng: 56.3, lat: 26.8 }, description: '伊朗扣押外籍油轮', source: '公开态势整理' },
  { id: 'r3me-inc-gaza-2', title: '拉法 · 口岸开放', date: T23, type: 'political', faction: 'eg', location: { lng: 34.25, lat: 31.28 }, description: '有限人道援助进入', source: '公开态势整理' },
  { id: 'r3me-inc-redsea-3', title: '红海 · 二次袭击', date: T24, type: 'military', faction: 'houthis', location: { lng: 42.8, lat: 14.2 }, description: '胡塞无人机二次袭击', source: '公开态势整理' },
];

export const ME_DENSIFY_FACILITIES_R3: Facility[] = [
  { id: 'r3me-fac-fujairah', name: '富查伊拉石油储备', position: { lat: 25.12, lng: 56.33 }, faction: 'ae', type: 'naval', notes: '阿联酋战略石油储备与出口' },
  { id: 'r3me-fac-ras-laffan', name: '拉斯拉凡 LNG', position: { lat: 25.9, lng: 51.55 }, faction: 'qa', type: 'naval', notes: '卡塔尔 LNG 出口枢纽' },
];

// ── 亚太 ──────────────────────────────────────────
export const AP_DENSIFY_EVENTS_R3: EventDetail[] = [
  { id: 'r3ap-taiwan-2', title: '台湾海峡 · 联合演训', source: '公开态势整理', timestamp: T24, location: [119.5, 24.0], impact_level: 'critical', category: 'military', description: '海空联合战备警巡' },
  { id: 'r3ap-scs-2', title: '南海 · 仁爱礁对峙', source: '公开态势整理', timestamp: T23, location: [115.85, 9.75], impact_level: 'critical', category: 'hotspots', description: '菲方补给船遭水炮驱离' },
  { id: 'r3ap-korea-2', title: '朝鲜半岛 · 垃圾气球', source: '公开态势整理', timestamp: T22, location: [126.8, 37.9], impact_level: 'high', category: 'conflicts', description: '朝韩互投宣传气球' },
  { id: 'r3ap-aus-2', title: '澳大利亚 · AUKUS 进展', source: '公开态势整理', timestamp: T21, location: [151.2, -33.9], impact_level: 'medium', category: 'military', description: '核潜艇采购立法通过' },
];

export const AP_DENSIFY_INCIDENTS_R3: Incident[] = [
  { id: 'r3ap-inc-taiwan-2', title: '台海 · 军舰过航', date: T24, type: 'military', faction: 'us', location: { lng: 120.5, lat: 23.5 }, description: '美舰过航台湾海峡', source: '公开态势整理' },
  { id: 'r3ap-inc-scs-2', title: '仁爱礁 · 水炮', date: T23, type: 'military', faction: 'cn', location: { lng: 115.85, lat: 9.75 }, description: '海警水炮驱离菲补给船', source: '公开态势整理' },
  { id: 'r3ap-inc-korea-2', title: '朝鲜 · 气球', date: T22, type: 'political', faction: 'kp', location: { lng: 126.8, lat: 37.9 }, description: '垃圾气球飘入韩国', source: '公开态势整理' },
];

export const AP_DENSIFY_FACILITIES_R3: Facility[] = [
  { id: 'r3ap-fac-subic-2', name: '苏比克湾前沿', position: { lat: 14.8, lng: 120.28 }, faction: 'ph', type: 'naval', notes: '美菲 EDCA 基地升级' },
  { id: 'r3ap-fac-tindal', name: '廷达尔空军基地', position: { lat: -14.52, lng: 132.38 }, faction: 'au', type: 'airfield', notes: '澳北部战略轰炸机部署点' },
];

// ── 中国周边 ──────────────────────────────────────────
export const CN_DENSIFY_EVENTS_R3: EventDetail[] = [
  { id: 'r3cn-scs-3', title: '西沙 · 海警巡航', source: '南海态势监测', timestamp: T24, location: [112.0, 16.5], impact_level: 'high', category: 'maritime', description: '海警编队西沙群岛维权巡航' },
  { id: 'r3cn-tw-2', title: '台海 · 军机过线', source: '台海态势监测', timestamp: T23, location: [119.8, 24.2], impact_level: 'critical', category: 'military', description: '解放军军机越过海峡中线' },
  { id: 'r3cn-border-2', title: '中印 · 军长级会谈', source: '中国周边监测', timestamp: T22, location: [78.5, 33.5], impact_level: 'high', category: 'diplomatic', description: '边境脱离接触谈判' },
  { id: 'r3cn-hk-2', title: '香港 · 国安条例', source: '中国周边监测', timestamp: T21, location: [114.17, 22.32], impact_level: 'medium', category: 'sanctions', description: '基本法第 23 条立法生效' },
];

export const CN_DENSIFY_INCIDENTS_R3: Incident[] = [
  { id: 'r3cn-inc-scs-3', title: '黄岩岛 · 对峙', date: T24, type: 'military', faction: 'cn', location: { lng: 117.8, lat: 15.1 }, description: '海警与菲方船只对峙', source: '南海态势监测' },
  { id: 'r3cn-inc-tw-2', title: '海峡 · 军机过线', date: T23, type: 'military', faction: 'cn', location: { lng: 119.8, lat: 24.2 }, description: '军机越过海峡中线', source: '台海态势监测' },
  { id: 'r3cn-inc-kinmen', title: '金门 · 无人机', date: T22, type: 'military', faction: 'cn', location: { lng: 118.42, lat: 24.43 }, description: '无人机飞越禁制水域', source: '台海态势监测' },
];

export const CN_DENSIFY_FACILITIES_R3: Facility[] = [
  { id: 'r3cn-fac-yongshu', name: '永暑礁', position: { lat: 9.55, lng: 112.97 }, faction: 'cn', type: 'naval', notes: '南沙核心岛礁基地' },
  { id: 'r3cn-fac-zhanjiang', name: '湛江海军基地', position: { lat: 21.2, lng: 110.4 }, faction: 'cn', type: 'naval', notes: '南海舰队母港' },
];
