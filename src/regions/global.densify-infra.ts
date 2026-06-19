/**
 * 全球基础设施/战略图层增密 — 为稀疏的全球图层补充真实节点，使其在全球视图下可见。
 * 海运要道 / 航空枢纽 / 军事基地 / 制裁主体 / 电网脆弱节点。坐标为代表性「示意」位置，中立陈述。
 */

import type { ThematicPoint } from '@/regions/global.thematic';

/** 海运要道与关键水道（chokepoints） */
export const DENSIFY_MARITIME: ThematicPoint[] = [
  { id: 'mar-malacca', name: '马六甲海峡', layerId: 'maritime', lng: 100.4, lat: 2.5, note: '亚欧贸易主航道，全球约 1/4 海运贸易经此', impact: 'critical' },
  { id: 'mar-hormuz', name: '霍尔木兹海峡', layerId: 'maritime', lng: 56.3, lat: 26.6, note: '全球约 1/5 石油经此出波斯湾', impact: 'critical' },
  { id: 'mar-bab', name: '曼德海峡', layerId: 'maritime', lng: 43.3, lat: 12.6, note: '红海南口，连通苏伊士航线', impact: 'critical' },
  { id: 'mar-suez', name: '苏伊士运河', layerId: 'maritime', lng: 32.35, lat: 30.5, note: '亚欧最短海运通道', impact: 'critical' },
  { id: 'mar-panama', name: '巴拿马运河', layerId: 'maritime', lng: -79.7, lat: 9.1, note: '太平洋-大西洋枢纽，近年受干旱限航', impact: 'high' },
  { id: 'mar-gibraltar', name: '直布罗陀海峡', layerId: 'maritime', lng: -5.6, lat: 35.95, note: '地中海-大西洋门户', impact: 'high' },
  { id: 'mar-bosphorus', name: '博斯普鲁斯海峡', layerId: 'maritime', lng: 29.05, lat: 41.1, note: '黑海唯一出海口', impact: 'high' },
  { id: 'mar-dover', name: '多佛尔海峡', layerId: 'maritime', lng: 1.4, lat: 51.0, note: '世界最繁忙海峡之一', impact: 'high' },
  { id: 'mar-taiwan', name: '台湾海峡', layerId: 'maritime', lng: 119.5, lat: 24.5, note: '东亚南北海运要道', impact: 'high' },
  { id: 'mar-cape', name: '好望角航线', layerId: 'maritime', lng: 18.5, lat: -34.8, note: '苏伊士受阻时的绕行替代航线', impact: 'medium' },
  { id: 'mar-sunda', name: '巽他海峡', layerId: 'maritime', lng: 105.9, lat: -6.0, note: '马六甲替代通道之一', impact: 'medium' },
  { id: 'mar-denmark', name: '丹麦海峡（厄勒/大贝尔特）', layerId: 'maritime', lng: 11.0, lat: 55.5, note: '波罗的海出海口', impact: 'medium' },
];

/** 航空枢纽（年旅客吞吐前列） */
export const DENSIFY_AVIATION: ThematicPoint[] = [
  { id: 'avi-atl', name: '亚特兰大 ATL', layerId: 'aviation', lng: -84.43, lat: 33.64, note: '长期全球客流第一的枢纽', impact: 'high' },
  { id: 'avi-dxb', name: '迪拜 DXB', layerId: 'aviation', lng: 55.36, lat: 25.25, note: '全球国际客流枢纽', impact: 'critical' },
  { id: 'avi-pek', name: '北京 PEK/PKX', layerId: 'aviation', lng: 116.4, lat: 40.0, note: '东亚超级枢纽', impact: 'high' },
  { id: 'avi-hnd', name: '东京 HND', layerId: 'aviation', lng: 139.78, lat: 35.55, note: '日本主枢纽', impact: 'high' },
  { id: 'avi-lhr', name: '伦敦 LHR', layerId: 'aviation', lng: -0.45, lat: 51.47, note: '欧洲门户枢纽', impact: 'high' },
  { id: 'avi-cdg', name: '巴黎 CDG', layerId: 'aviation', lng: 2.55, lat: 49.0, note: '西欧航空枢纽', impact: 'high' },
  { id: 'avi-ist', name: '伊斯坦布尔 IST', layerId: 'aviation', lng: 28.74, lat: 41.26, note: '欧亚之间的中转枢纽', impact: 'high' },
  { id: 'avi-sin', name: '新加坡 SIN', layerId: 'aviation', lng: 103.99, lat: 1.36, note: '东南亚航空枢纽', impact: 'high' },
  { id: 'avi-hkg', name: '香港 HKG', layerId: 'aviation', lng: 113.91, lat: 22.31, note: '亚太货运与客运枢纽', impact: 'high' },
  { id: 'avi-lax', name: '洛杉矶 LAX', layerId: 'aviation', lng: -118.41, lat: 33.94, note: '北美西岸枢纽', impact: 'medium' },
  { id: 'avi-fra', name: '法兰克福 FRA', layerId: 'aviation', lng: 8.57, lat: 50.04, note: '欧洲货运重镇', impact: 'medium' },
  { id: 'avi-del', name: '德里 DEL', layerId: 'aviation', lng: 77.1, lat: 28.56, note: '南亚增长最快枢纽之一', impact: 'medium' },
];

/** 重要军事基地/部署（示意 · 自用；商用可一键下架） */
export const DENSIFY_MILITARY: ThematicPoint[] = [
  { id: 'mil-norfolk', name: '诺福克海军基地', layerId: 'military', lng: -76.33, lat: 36.95, note: '美海军大西洋舰队母港（示意）', impact: 'high' },
  { id: 'mil-pearl', name: '珍珠港-希卡姆', layerId: 'military', lng: -157.95, lat: 21.35, note: '美太平洋舰队基地（示意）', impact: 'high' },
  { id: 'mil-yokosuka', name: '横须贺', layerId: 'military', lng: 139.67, lat: 35.29, note: '美第七舰队前沿母港（示意）', impact: 'high' },
  { id: 'mil-guam', name: '关岛安德森', layerId: 'military', lng: 144.93, lat: 13.58, note: '西太前沿战略基地（示意）', impact: 'high' },
  { id: 'mil-diego', name: '迪戈加西亚', layerId: 'military', lng: 72.41, lat: -7.31, note: '印度洋战略基地（示意）', impact: 'high' },
  { id: 'mil-ramstein', name: '拉姆施泰因', layerId: 'military', lng: 7.6, lat: 49.44, note: '美驻欧空军枢纽（示意）', impact: 'high' },
  { id: 'mil-djibouti', name: '吉布提基地群', layerId: 'military', lng: 43.15, lat: 11.55, note: '多国在此设保障基地（示意）', impact: 'high' },
  { id: 'mil-incirlik', name: '因吉尔利克', layerId: 'military', lng: 35.42, lat: 37.0, note: '北约南翼空军基地（示意）', impact: 'medium' },
  { id: 'mil-sevastopol', name: '塞瓦斯托波尔', layerId: 'military', lng: 33.53, lat: 44.62, note: '黑海舰队基地（示意）', impact: 'high' },
  { id: 'mil-kadena', name: '嘉手纳', layerId: 'military', lng: 127.77, lat: 26.36, note: '西太美空军主基地（示意）', impact: 'high' },
];

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
  ...DENSIFY_MARITIME,
  ...DENSIFY_AVIATION,
  ...DENSIFY_MILITARY,
  ...DENSIFY_SANCTIONS,
  ...DENSIFY_OUTAGES,
];
