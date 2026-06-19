/**
 * 全球图层增密 R2 — 测控/深空地面站 · 海缆中断事件 · 深海采矿区。
 * 均为公开可查的真实节点/事件，坐标为代表性「示意」位置，中立陈述。
 */

import type { ThematicPoint } from '@/regions/global.thematic';

/** 深空/卫星测控地面站（DSN/ESA/JAXA/中国深空网等） */
export const DENSIFY_GROUND_STATIONS: ThematicPoint[] = [
  { id: 'gs-goldstone', name: '戈尔德斯通 DSN', layerId: 'ground_stations', lng: -116.89, lat: 35.43, note: 'NASA 深空网西半球站（莫哈韦）', impact: 'high' },
  { id: 'gs-madrid', name: '马德里 DSN', layerId: 'ground_stations', lng: -4.25, lat: 40.43, note: 'NASA 深空网欧洲站（罗夫莱多）', impact: 'high' },
  { id: 'gs-canberra', name: '堪培拉 DSN', layerId: 'ground_stations', lng: 148.98, lat: -35.4, note: 'NASA 深空网南半球站（蒂宾比拉）', impact: 'high' },
  { id: 'gs-jiamusi', name: '佳木斯深空站', layerId: 'ground_stations', lng: 130.0, lat: 46.5, note: '中国深空测控网 66m 天线', impact: 'high' },
  { id: 'gs-kashgar', name: '喀什深空站', layerId: 'ground_stations', lng: 76.0, lat: 39.5, note: '中国深空测控网西部站', impact: 'high' },
  { id: 'gs-neuquen', name: '内乌肯深空站', layerId: 'ground_stations', lng: -70.15, lat: -38.19, note: '中国在阿根廷的深空测控站', impact: 'medium' },
  { id: 'gs-svalbard', name: 'SvalSat 斯瓦尔巴', layerId: 'ground_stations', lng: 15.4, lat: 78.23, note: '高纬极轨卫星接收站', impact: 'medium' },
  { id: 'gs-kourou', name: '库鲁地面站', layerId: 'ground_stations', lng: -52.8, lat: 5.25, note: 'ESA 测控与发射场（法属圭亚那）', impact: 'high' },
  { id: 'gs-usuda', name: '臼田深空站', layerId: 'ground_stations', lng: 138.36, lat: 36.13, note: 'JAXA 64m 深空天线', impact: 'medium' },
  { id: 'gs-hartebeesthoek', name: '哈特比斯霍克', layerId: 'ground_stations', lng: 27.69, lat: -25.89, note: '南非测控/射电站', impact: 'medium' },
  { id: 'gs-weilheim', name: '魏尔海姆站', layerId: 'ground_stations', lng: 11.14, lat: 47.88, note: '德国 DLR 卫星测控站', impact: 'medium' },
];

/** 海底光缆中断事件（公开报道，含时间） */
export const DENSIFY_CABLE_INCIDENTS: ThematicPoint[] = [
  { id: 'ci-baltic-2024', name: '波罗的海 C-Lion1 断缆', layerId: 'cable_incidents', lng: 18.0, lat: 56.0, note: '2024-11 德立陶宛海缆被切，疑遭拖锚', impact: 'high', updatedAt: '2024-11-18' },
  { id: 'ci-gulf-finland-2024', name: '芬兰湾 Estlink 受损', layerId: 'cable_incidents', lng: 25.5, lat: 60.0, note: '2024-12 电力与数据缆同时受损', impact: 'high', updatedAt: '2024-12-25' },
  { id: 'ci-redsea-2024', name: '红海三缆中断', layerId: 'cable_incidents', lng: 43.0, lat: 13.5, note: '2024-02 AAE-1/Seacom/EIG 受损，影响欧亚带宽', impact: 'critical', updatedAt: '2024-02-24' },
  { id: 'ci-matsu-2023', name: '马祖海缆被切', layerId: 'cable_incidents', lng: 119.95, lat: 26.16, note: '2023-02 两条海缆先后中断，离岛断网数周', impact: 'high', updatedAt: '2023-02-08' },
  { id: 'ci-tonga-2022', name: '汤加海缆中断', layerId: 'cable_incidents', lng: -175.2, lat: -21.2, note: '2022-01 火山喷发切断唯一国际海缆', impact: 'high', updatedAt: '2022-01-15' },
  { id: 'ci-westafrica-2024', name: '西非四缆中断', layerId: 'cable_incidents', lng: -4.0, lat: 4.5, note: '2024-03 WACS/ACE/SAT-3/MainOne 多缆受损', impact: 'high', updatedAt: '2024-03-14' },
  { id: 'ci-vietnam-2023', name: '越南海缆群退化', layerId: 'cable_incidents', lng: 110.0, lat: 14.0, note: '2023 多条国际海缆同时故障，带宽骤降', impact: 'medium', updatedAt: '2023-02-01' },
  { id: 'ci-svalbard-2022', name: '斯瓦尔巴海缆中断', layerId: 'cable_incidents', lng: 16.0, lat: 76.0, note: '2022-01 连接挪威本土的海缆受损', impact: 'medium', updatedAt: '2022-01-07' },
];

/** 深海采矿勘探/许可区（ISA 合同区与各国先导区） */
export const DENSIFY_DEEP_SEA_MINING: ThematicPoint[] = [
  { id: 'dsm-ccz-east', name: 'CCZ 东区合同块', layerId: 'deep_sea_mining', lng: -120.0, lat: 13.5, note: '克拉里昂-克利珀顿区多金属结核勘探块', impact: 'high' },
  { id: 'dsm-cook', name: '库克群岛 EEZ', layerId: 'deep_sea_mining', lng: -159.0, lat: -20.0, note: '专属经济区多金属结核先导勘探', impact: 'medium' },
  { id: 'dsm-cib', name: '中印度洋海盆', layerId: 'deep_sea_mining', lng: 75.0, lat: -12.0, note: '印度 ISA 结核勘探合同区', impact: 'medium' },
  { id: 'dsm-norway', name: '挪威北极采矿区', layerId: 'deep_sea_mining', lng: 5.0, lat: 72.0, note: '挪威划定的海底矿产勘探区（争议中）', impact: 'medium' },
  { id: 'dsm-okinawa', name: '冲绳海槽 SMS', layerId: 'deep_sea_mining', lng: 127.0, lat: 27.0, note: '日本热液硫化物（SMS）先导开采试验', impact: 'medium' },
  { id: 'dsm-solwara', name: 'Solwara-1（已搁置）', layerId: 'deep_sea_mining', lng: 152.1, lat: -3.8, note: '巴新俾斯麦海热液矿，项目搁置', impact: 'low' },
];

export const DENSIFY_INFRA_R2: ThematicPoint[] = [
  ...DENSIFY_GROUND_STATIONS,
  ...DENSIFY_CABLE_INCIDENTS,
  ...DENSIFY_DEEP_SEA_MINING,
];
