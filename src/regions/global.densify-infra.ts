/**
 * 全球稀疏图层增密 — 仅针对【真实基线确认稀疏】的图层补充真实节点。
 *
 * 核对结论（基线全量构建计数）：maritime(35)/aviation(25)/military(25) 经
 * global.infrastructure.ts 与区域数据集已充分覆盖，不再叠加以免重复标记；
 * 仅 sanctions(4) 与 outages(4) 确为稀疏，在此补充。中立陈述，坐标为示意位置。
 */

import type { ThematicPoint } from '@/regions/global.thematic';

/** 受制裁经济体/主体（中立标注，仅示意所在地） */
export const DENSIFY_SANCTIONS: ThematicPoint[] = [
  { id: 'san-dprk', name: '朝鲜', layerId: 'sanctions', lng: 125.75, lat: 39.03, note: '受联合国多轮制裁（核与导弹相关）', impact: 'high' },
  { id: 'san-iran', name: '伊朗', layerId: 'sanctions', lng: 51.39, lat: 35.69, note: '受美欧多项制裁（核与能源相关）', impact: 'high' },
  { id: 'san-russia', name: '俄罗斯', layerId: 'sanctions', lng: 37.62, lat: 55.75, note: '2022 年起受大规模西方制裁', impact: 'critical' },
  { id: 'san-venezuela', name: '委内瑞拉', layerId: 'sanctions', lng: -66.9, lat: 10.49, note: '受美制裁（石油与金融相关）', impact: 'medium' },
  { id: 'san-cuba', name: '古巴', layerId: 'sanctions', lng: -82.38, lat: 23.13, note: '长期受美禁运', impact: 'medium' },
  { id: 'san-syria', name: '叙利亚', layerId: 'sanctions', lng: 36.29, lat: 33.51, note: '受美欧制裁', impact: 'medium' },
  { id: 'san-belarus', name: '白俄罗斯', layerId: 'sanctions', lng: 27.57, lat: 53.9, note: '受西方制裁', impact: 'medium' },
];

/** 电网脆弱/停电高发节点 */
export const DENSIFY_OUTAGES: ThematicPoint[] = [
  { id: 'out-texas', name: '德州 ERCOT 电网', layerId: 'outages', lng: -97.74, lat: 30.27, note: '2021 寒潮大停电；孤立电网脆弱', impact: 'high' },
  { id: 'out-southafrica', name: '南非 Eskom', layerId: 'outages', lng: 28.05, lat: -26.2, note: '长期「负荷削减」轮流停电', impact: 'high' },
  { id: 'out-ukraine', name: '乌克兰电网', layerId: 'outages', lng: 30.52, lat: 50.45, note: '冲突中能源设施屡遭打击', impact: 'high' },
  { id: 'out-pakistan', name: '巴基斯坦电网', layerId: 'outages', lng: 67.0, lat: 24.86, note: '2023 全国级大停电', impact: 'medium' },
  { id: 'out-lebanon', name: '黎巴嫩电网', layerId: 'outages', lng: 35.5, lat: 33.89, note: '经济危机致长期缺电', impact: 'medium' },
  { id: 'out-cuba', name: '古巴电网', layerId: 'outages', lng: -82.38, lat: 23.13, note: '老化机组频繁全国停电', impact: 'medium' },
  { id: 'out-california', name: '加州电网', layerId: 'outages', lng: -121.5, lat: 38.58, note: '野火季公共安全停电（PSPS）', impact: 'medium' },
];

export const DENSIFY_INFRA: ThematicPoint[] = [
  ...DENSIFY_SANCTIONS,
  ...DENSIFY_OUTAGES,
];
