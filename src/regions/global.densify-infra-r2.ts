/**
 * 全球图层增密 R2 — 仅补充与现有专属目录【不重叠】的真实新节点/事件。
 *   测控站：补 GLOBAL_GROUND_STATIONS 之外的真实台站
 *   断缆事件：补 GLOBAL_CABLE_INCIDENTS 之外的公开报道事件（含日期）
 *   深海采矿：补 GLOBAL_DEEP_SEA_MINING 之外的勘探/许可区
 * 坐标为代表性「示意」位置，中立陈述。已逐项核对去重，ID 用 x 前缀避免与现有目录冲突。
 */

import type { ThematicPoint } from '@/regions/global.thematic';

/** 测控/地面站（已排除 DSN 三站、ESA 三站、中国佳木斯/喀什/内乌肯、KSAT 斯瓦尔巴/特罗尔、西安、TsUP、沃洛普斯） */
export const DENSIFY_GROUND_STATIONS: ThematicPoint[] = [
  { id: 'gsx-kourou', name: '库鲁地面站', layerId: 'ground_stations', lng: -52.65, lat: 5.16, note: 'ESA 法属圭亚那测控与信关站', impact: 'high' },
  { id: 'gsx-usuda', name: '臼田深空站', layerId: 'ground_stations', lng: 138.36, lat: 36.13, note: 'JAXA 64m 深空天线', impact: 'medium' },
  { id: 'gsx-hartebeesthoek', name: '哈特比斯霍克站', layerId: 'ground_stations', lng: 27.69, lat: -25.89, note: '南非测控/射电天文站', impact: 'medium' },
  { id: 'gsx-weilheim', name: '魏尔海姆站', layerId: 'ground_stations', lng: 11.14, lat: 47.88, note: '德国 DLR 卫星测控站', impact: 'medium' },
  { id: 'gsx-kiruna', name: '基律纳 Esrange', layerId: 'ground_stations', lng: 21.06, lat: 67.88, note: '瑞典 SSC 极地信关与探空场', impact: 'medium' },
  { id: 'gsx-istrac', name: '班加罗尔 ISTRAC', layerId: 'ground_stations', lng: 77.51, lat: 13.03, note: '印度 ISRO 测控网中枢', impact: 'high' },
  { id: 'gsx-hassan', name: '哈桑 MCF 深空站', layerId: 'ground_stations', lng: 76.1, lat: 13.0, note: '印度主测控设施（含深空天线）', impact: 'medium' },
  { id: 'gsx-goddard', name: '戈达德 GSFC', layerId: 'ground_stations', lng: -76.84, lat: 38.99, note: 'NASA 近地网与科学卫星运控', impact: 'medium' },
];

/** 海缆中断事件（已排除红海/波罗的海 C-Lion1/Estlink/马祖/台北部/越南/西非等现有条目） */
export const DENSIFY_CABLE_INCIDENTS: ThematicPoint[] = [
  { id: 'cix-tonga-2022', name: '汤加海缆中断', layerId: 'cable_incidents', lng: -175.2, lat: -21.2, note: '2022-01 火山喷发切断唯一国际海缆，全国断网数周', impact: 'high', updatedAt: '2022-01-15' },
  { id: 'cix-svalbard-2022', name: '斯瓦尔巴海缆受损', layerId: 'cable_incidents', lng: 16.0, lat: 76.5, note: '2022-01 连接挪威本土的双缆之一受损', impact: 'medium', updatedAt: '2022-01-07' },
  { id: 'cix-egypt-2008', name: '亚历山大近海多缆中断', layerId: 'cable_incidents', lng: 29.9, lat: 31.3, note: '2008-01 SEA-ME-WE-4/FLAG 等受损，中东南亚大面积降速', impact: 'high', updatedAt: '2008-01-30' },
];

/** 深海采矿/勘探区（已排除 CCZ/中印度洋海盆/彭林/秘鲁/大西洋中脊/西南印度洋脊/中印度洋脊/西太海山） */
export const DENSIFY_DEEP_SEA_MINING: ThematicPoint[] = [
  { id: 'dsmx-norway', name: '挪威海采矿许可区', layerId: 'deep_sea_mining', lng: 5.0, lat: 72.0, note: '2024 挪威划定海底矿产勘探区（争议中）', impact: 'medium' },
  { id: 'dsmx-okinawa', name: '冲绳海槽 SMS 试采', layerId: 'deep_sea_mining', lng: 127.0, lat: 27.0, note: '日本热液多金属硫化物先导开采试验', impact: 'medium' },
  { id: 'dsmx-solwara', name: 'Solwara-1（已搁置）', layerId: 'deep_sea_mining', lng: 152.1, lat: -3.8, note: '巴新俾斯麦海热液矿，项目搁置', impact: 'low' },
];

export const DENSIFY_INFRA_R2: ThematicPoint[] = [
  ...DENSIFY_GROUND_STATIONS,
  ...DENSIFY_CABLE_INCIDENTS,
  ...DENSIFY_DEEP_SEA_MINING,
];
