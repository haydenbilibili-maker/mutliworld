/**
 * 第七轮增密 · 产业链模块第二轮（2026-06-23）
 *
 * 补全 r6 四个图层的覆盖盲区与时效事件：
 *  - aerospace_mfg：补无人机/航天发射器/起落架/航电维修 MRO
 *  - defense_mfg：补导弹工厂/弹药/雷达/坦克厂
 *  - semi_supply：补光刻机配套/检测设备/特种气体/掩模
 *  - chemicals：补氟化工/钛白粉/纤维/橡胶/锂电解液
 *
 * 所有条目为公开资料示意坐标，非精确/实时数据。整理日：2026-06-23。
 */

import type { ThematicPoint } from './global.thematic';

// ───────────────────────────────────────────────────────────────
// aerospace_mfg 第二轮
// ───────────────────────────────────────────────────────────────
export const DENSIFY_AEROSPACE_MFG_R7: ThematicPoint[] = [
  // ── 无人机 / 系留 ──
  { id: 'r7-am-aeroenvironment', name: 'AeroVironment', layerId: 'aerospace_mfg', lng: -118.0, lat: 34.18, note: '加州，Switchblade 巡飞弹/小型无人机', impact: 'high', subKind: 'supplier' },
  { id: 'r7-am-general-atomics', name: '通用原子航空', layerId: 'aerospace_mfg', lng: -117.1, lat: 32.92, note: '圣迭戈，MQ-9/Predator 无人机', impact: 'critical', subKind: 'airframer' },
  { id: 'r7-am-northrop-rq4', name: '诺格 RQ-4 总装', layerId: 'aerospace_mfg', lng: -117.36, lat: 33.13, note: '帕姆代尔 CA，全球鹰无人机', impact: 'high', subKind: 'airframer' },
  { id: 'r7-am-winglong', name: '航天彩虹', layerId: 'aerospace_mfg', lng: 116.4, lat: 39.9, note: '北京，彩虹/翼龙无人机出口', impact: 'high', subKind: 'airframer' },
  { id: 'r7-am-casic-uav', name: '航天科工无人机', layerId: 'aerospace_mfg', lng: 116.32, lat: 39.93, note: '北京，WJ-700/鹰击反辐射无人机', impact: 'medium', subKind: 'airframer' },
  // ── 航天发射器 / 运载 ──
  { id: 'r7-am-uac-samara', name: '联合航天萨马拉', layerId: 'aerospace_mfg', lng: 50.15, lat: 53.2, note: '萨马拉，联盟号运载火箭总装', impact: 'high', subKind: 'airframer' },
  { id: 'r7-am-khrunichev', name: '赫鲁尼切夫', layerId: 'aerospace_mfg', lng: 37.55, lat: 55.81, note: '莫斯科，质子号/安加拉火箭', impact: 'high', subKind: 'airframer' },
  // ── 起落架/航电/复合材料 ──
  { id: 'r7-am-safran-landing', name: '赛峰起落架', layerId: 'aerospace_mfg', lng: -0.34, lat: 51.49, note: '格洛斯特，起落架系统', impact: 'medium', subKind: 'supplier' },
  { id: 'r7-am-gtds', name: '吉凯恩航空', layerId: 'aerospace_mfg', lng: -2.24, lat: 51.86, note: '布里斯托，传动/复合材料', impact: 'medium', subKind: 'supplier' },
  { id: 'r7-am-meggitt', name: 'Meggitt（派克）', layerId: 'aerospace_mfg', lng: -2.0, lat: 51.4, note: '英国，刹车/热管理', impact: 'medium', subKind: 'supplier' },
  { id: 'r7-am-mubadala-aero', name: 'Strata 制造', layerId: 'aerospace_mfg', lng: 54.55, lat: 24.43, note: '阿布扎比 Al-Ain，空客/波音复材件', impact: 'low', subKind: 'supplier' },
  // ── MRO 维修 ──
  { id: 'r7-am-st-engineering', name: 'ST 工程 MRO', layerId: 'aerospace_mfg', lng: 103.99, lat: 1.36, note: '新加坡，亚太 MRO 中心', impact: 'high', subKind: 'supplier' },
  { id: 'r7-am-air-china-mro', name: 'Ameco 北京', layerId: 'aerospace_mfg', lng: 116.6, lat: 40.08, note: '首都机场，国航/汉莎合资 MRO', impact: 'medium', subKind: 'supplier' },
  { id: 'r7-am-aar-miami', name: 'AAR 迈阿密 MRO', layerId: 'aerospace_mfg', lng: -80.29, lat: 25.79, note: '迈阿密，拉美航线 MRO 枢纽', impact: 'medium', subKind: 'supplier' },
];

// ───────────────────────────────────────────────────────────────
// defense_mfg 第二轮
// ───────────────────────────────────────────────────────────────
export const DENSIFY_DEFENSE_MFG_R7: ThematicPoint[] = [
  // ── 导弹 / 弹药 ──
  { id: 'r7-dm-mbda', name: 'MBDA 导弹', layerId: 'defense_mfg', lng: 2.33, lat: 48.87, note: '巴黎，欧洲导弹集团（风暴之影）', impact: 'critical', subKind: 'missiles' },
  { id: 'r7-dm-rtx-tucson', name: '雷神图森导弹厂', layerId: 'defense_mfg', lng: -110.93, lat: 32.22, note: '亚利桑那，爱国者/标准导弹', impact: 'critical', subKind: 'missiles' },
  { id: 'r7-dm-lockheed-orlando', name: '洛马奥兰多导弹', layerId: 'defense_mfg', lng: -81.38, lat: 28.54, note: '佛州，Javelin/HIMARS 弹药', impact: 'critical', subKind: 'missiles' },
  { id: 'r7-dm-northrop-missiles', name: '诺格精确打击', layerId: 'defense_mfg', lng: -91.97, lat: 36.4, note: '阿肯色，GMLRS/制导火箭', impact: 'high', subKind: 'missiles' },
  { id: 'r7-dm-trd-military', name: '战术导弹集团', layerId: 'defense_mfg', lng: 38.19, lat: 55.59, note: '科罗廖夫，伊斯坎德尔/口径', impact: 'high', subKind: 'missiles' },
  { id: 'r7-dm-ndi', name: '弹药集团（Uralvagonzavod 子公司）', layerId: 'defense_mfg', lng: 60.61, lat: 56.84, note: '下塔吉尔，坦克/弹药', impact: 'high', subKind: 'missiles' },
  { id: 'r7-dm-rafael', name: '拉斐尔先进防御', layerId: 'defense_mfg', lng: 35.0, lat: 32.79, note: '海法，铁穹/斯派克导弹', impact: 'high', subKind: 'missiles' },
  { id: 'r7-dm-diehl', name: '代傲防务', layerId: 'defense_mfg', lng: 9.27, lat: 49.0, note: '罗伊特林根，IRIS-T 防空', impact: 'high', subKind: 'missiles' },
  // ── 坦克/装甲 ──
  { id: 'r7-dm-lima-tank', name: '利马陆军坦克厂', layerId: 'defense_mfg', lng: -84.1, lat: 40.74, note: '俄亥俄，M1 艾布拉姆斯', impact: 'high', subKind: 'prime' },
  { id: 'r7-dm-uralvagon', name: '乌拉尔车厢厂', layerId: 'defense_mfg', lng: 60.61, lat: 56.84, note: '下塔吉尔，T-90/T-14 坦克', impact: 'critical', subKind: 'prime' },
  { id: 'r7-dm-kurgan', name: '库尔干机器厂', layerId: 'defense_mfg', lng: 65.37, lat: 55.45, note: '库尔干，BMP-3 步战车', impact: 'medium', subKind: 'prime' },
  { id: 'r7-dm-knds', name: 'KNDS（奈克斯特）', layerId: 'defense_mfg', lng: 2.21, lat: 48.76, note: '法国，勒克莱尔坦克/凯撒炮', impact: 'high', subKind: 'prime' },
  { id: 'r7-dm-rheinmetall', name: '莱茵金属', layerId: 'defense_mfg', lng: 6.95, lat: 50.94, note: '杜塞尔多夫，豹 2/弹药', impact: 'critical', subKind: 'prime' },
  { id: 'r7-dm-bae-combat', name: 'BAE 陆系统', layerId: 'defense_mfg', lng: -2.79, lat: 53.36, note: '英国，挑战者坦克', impact: 'high', subKind: 'prime' },
  // ── 雷达 / 电子 ──
  { id: 'r7-dm-leonardo-radar', name: '莱昂纳多雷达', layerId: 'defense_mfg', lng: 11.36, lat: 43.32, note: '佛罗伦萨，Kronos/雷达', impact: 'high', subKind: 'prime' },
  { id: 'r7-dm-hensoldt', name: '亨索尔特', layerId: 'defense_mfg', lng: 7.74, lat: 49.44, note: '德国，Cobra 反炮兵雷达', impact: 'medium', subKind: 'prime' },
  // ── 造船厂补充 ──
  { id: 'r7-dm-fincantieri', name: '芬坎蒂尼', layerId: 'defense_mfg', lng: 12.33, lat: 45.44, note: '的里雅斯特，意大利 FREMM 护卫舰', impact: 'high', subKind: 'shipyard' },
  { id: 'r7-dm-tkms', name: '蒂森克虏伯海洋', layerId: 'defense_mfg', lng: 11.58, lat: 53.87, note: '基尔，212 型潜艇/F126 护卫舰', impact: 'high', subKind: 'shipyard' },
  { id: 'r7-dm-navantia', name: '纳凡提亚', layerId: 'defense_mfg', lng: -8.71, lat: 42.24, note: '费罗尔，西班牙 F110 护卫舰', impact: 'high', subKind: 'shipyard' },
  { id: 'r7-dm-daewoo-marine', name: '韩华海洋', layerId: 'defense_mfg', lng: 128.74, lat: 35.53, note: '巨济岛，韩国 KSS-III 潜艇', impact: 'high', subKind: 'shipyard' },
  { id: 'r7-dm-goa-shipyard', name: '果阿造船厂', layerId: 'defense_mfg', lng: 73.81, lat: 15.4, note: '果阿，印度隐身护卫舰', impact: 'medium', subKind: 'shipyard' },
];

// ───────────────────────────────────────────────────────────────
// semi_supply 第二轮（光刻机配套/检测/掩模/电解液）
// ───────────────────────────────────────────────────────────────
export const DENSIFY_SEMI_SUPPLY_R7: ThematicPoint[] = [
  // ── 光刻/光学配套 ──
  { id: 'r7-ss-zeiss', name: '蔡司半导体', layerId: 'semi_supply', lng: 12.2, lat: 49.36, note: '耶拿，EUV 光学系统（ASML 供应商）', impact: 'critical', subKind: 'materials' },
  { id: 'r7-ss-trumpf', name: '通快', layerId: 'semi_supply', lng: 9.17, lat: 48.74, note: '迪琴根，EUV 光源激光器', impact: 'critical', subKind: 'materials' },
  { id: 'r7-ss-cymer', name: 'Cymer', layerId: 'semi_supply', lng: -117.23, lat: 32.89, note: '圣迭戈，EUV/DUV 光源（ASML 子公司）', impact: 'high', subKind: 'materials' },
  // ── 检测/量测 ──
  { id: 'r7-ss-klacore', name: 'KLA 总部', layerId: 'semi_supply', lng: -121.96, lat: 37.4, note: '米尔皮塔斯，良率检测/量测龙头', impact: 'high', subKind: 'eda' },
  { id: 'r7-ss-apply', name: '应用材料检测', layerId: 'semi_supply', lng: -122.03, lat: 37.33, note: '圣克拉拉，eBeam 检测', impact: 'medium', subKind: 'materials' },
  { id: 'r7-ss-hitachi-high', name: '日立高科', layerId: 'semi_supply', lng: 139.6, lat: 35.65, note: '东京，CD-SEM 量测', impact: 'high', subKind: 'materials' },
  // ── 掩模（reticle）──
  { id: 'r7-ss-photronics', name: 'Photronics', layerId: 'semi_supply', lng: -73.05, lat: 41.32, note: '康涅狄格，光掩模制造', impact: 'medium', subKind: 'materials' },
  { id: 'r7-ss-dnp-mask', name: '大日本印刷（掩模）', layerId: 'semi_supply', lng: 139.69, lat: 35.69, note: '东京，高端光掩模', impact: 'high', subKind: 'materials' },
  { id: 'r7-ss-toppan-mask', name: 'Toppan 掩模', layerId: 'semi_supply', lng: 139.69, lat: 35.69, note: '东京，EUV 掩模基板', impact: 'high', subKind: 'materials' },
  // ── 引线框/基板 ──
  { id: 'r7-ss-ibiden', name: '揖斐电', layerId: 'semi_supply', lng: 136.71, lat: 35.36, note: '岐阜，IC 封装基板龙头', impact: 'high', subKind: 'osat' },
  { id: 'r7-ss-shinko', name: '新光电气', layerId: 'semi_supply', lng: 138.19, lat: 36.65, note: '长野，PKG 基板', impact: 'high', subKind: 'osat' },
  { id: 'r7-ss-simmtech', name: 'Simmtech', layerId: 'semi_supply', lng: 127.11, lat: 37.43, note: '清州，存储封装基板', impact: 'medium', subKind: 'osat' },
  // ── 国产配套 ──
  { id: 'r7-ss-smee', name: '上海微电子', layerId: 'semi_supply', lng: 121.6, lat: 31.2, note: '上海，国产光刻机 SSA600', impact: 'high', subKind: 'materials' },
  { id: 'r7-ss-naura', name: '北方华创', layerId: 'semi_supply', lng: 116.5, lat: 40.07, note: '北京，刻蚀/PVD/CMP 国产设备', impact: 'high', subKind: 'materials' },
  { id: 'r7-ss-amcc', name: '中微公司', layerId: 'semi_supply', lng: 121.6, lat: 31.2, note: '上海，刻蚀设备国产龙头', impact: 'high', subKind: 'materials' },
  { id: 'r7-ss-hwatsing', name: '华海清科', layerId: 'semi_supply', lng: 117.2, lat: 39.13, note: '天津，CMP 设备国产化', impact: 'medium', subKind: 'materials' },
];

// ───────────────────────────────────────────────────────────────
// chemicals 第二轮（氟化工/钛白粉/纤维/橡胶/锂电解液）
// ───────────────────────────────────────────────────────────────
export const DENSIFY_CHEMICALS_R7: ThematicPoint[] = [
  // ── 氟化工/制冷剂 ──
  { id: 'r7-ch-chemours', name: '科慕', layerId: 'chemicals', lng: -75.55, lat: 39.75, note: '威尔明顿，钛白粉/制冷剂', impact: 'high', subKind: 'specialty' },
  { id: 'r7-ch-solvay-f', name: '索尔维氟化物', layerId: 'chemicals', lng: 4.35, lat: 50.85, note: '布鲁塞尔，含氟聚合物（PVDF）', impact: 'medium', subKind: 'specialty' },
  { id: 'r7-ch-daqkin', name: '大金工业', layerId: 'chemicals', lng: 135.53, lat: 34.71, note: '大阪，氟化工/制冷剂全球龙头', impact: 'high', subKind: 'specialty' },
  { id: 'r7-ch-arkema', name: '阿科玛', layerId: 'chemicals', lng: 2.24, lat: 48.92, note: '巴黎，氟化工/高性能聚合物', impact: 'high', subKind: 'specialty' },
  { id: 'r7-ch-do-fluoro', name: '东岳集团', layerId: 'chemicals', lng: 118.1, lat: 36.8, note: '淄博，含氟材料/质子膜', impact: 'medium', subKind: 'specialty' },
  // ── 钛白粉 ──
  { id: 'r7-ch-venator', name: 'Venator', layerId: 'chemicals', lng: -1.62, lat: 54.96, note: '英国，钛白粉颜料', impact: 'medium', subKind: 'specialty' },
  { id: 'r7-ch-lomon', name: '龙佰集团', layerId: 'chemicals', lng: 113.23, lat: 35.23, note: '焦作，亚洲最大钛白粉', impact: 'high', subKind: 'specialty' },
  // ── 纤维/聚合物 ──
  { id: 'r7-ch-dupont', name: '杜邦', layerId: 'chemicals', lng: -75.55, lat: 39.75, note: '威尔明顿，Kevlar/特氟龙', impact: 'high', subKind: 'specialty' },
  { id: 'r7-ch-toray', name: '东丽', layerId: 'chemicals', lng: 135.5, lat: 34.7, note: '东京，碳纤维龙头', impact: 'critical', subKind: 'specialty' },
  { id: 'r7-ch-mitsubishi-chem', name: '三菱化学', layerId: 'chemicals', lng: 139.69, lat: 35.69, note: '东京，碳纤维/电子材料', impact: 'high', subKind: 'specialty' },
  { id: 'r7-ch-hengyi', name: '恒逸石化', layerId: 'chemicals', lng: 120.16, lat: 30.27, note: '杭州/文莱，PTA/聚酯', impact: 'high', subKind: 'petrochem' },
  { id: 'r7-ch-tongkun', name: '桐昆股份', layerId: 'chemicals', lng: 120.55, lat: 30.64, note: '桐乡，涤纶长丝龙头', impact: 'medium', subKind: 'petrochem' },
  // ── 橡胶/轮胎 ──
  { id: 'r7-ch-michelin', name: '米其林', layerId: 'chemicals', lng: 3.08, lat: 45.78, note: '克莱蒙费朗，轮胎/合成橡胶', impact: 'high', subKind: 'specialty' },
  { id: 'r7-ch-bridgestone', name: '普利司通', layerId: 'chemicals', lng: 139.7, lat: 35.69, note: '东京，全球最大轮胎厂', impact: 'high', subKind: 'specialty' },
  // ── 锂电解液/添加剂 ──
  { id: 'r7-ch-capchem', name: '新宙邦', layerId: 'chemicals', lng: 114.06, lat: 22.55, note: '深圳，锂电电解液龙头', impact: 'high', subKind: 'battery' },
  { id: 'r7-ch-cngr', name: '中伟股份', layerId: 'chemicals', lng: 111.0, lat: 27.95, note: '湖南，前驱体材料', impact: 'high', subKind: 'battery' },
  { id: 'r7-ch-tinci', name: '天赐材料', layerId: 'chemicals', lng: 113.27, lat: 23.13, note: '广州，电解液/六氟磷酸锂', impact: 'high', subKind: 'battery' },
  { id: 'r7-ch-pilbara', name: 'Pilbara 矿业', layerId: 'chemicals', lng: 120.75, lat: -21.0, note: '西澳，锂辉石精矿', impact: 'high', subKind: 'battery' },
  { id: 'r7-ch-allkem', name: 'Allkem', layerId: 'chemicals', lng: -66.5, lat: -23.5, note: '阿根廷，锂三角卤水提锂', impact: 'high', subKind: 'battery' },
  // ── 工业气体 ──
  { id: 'r7-ch-airproducts', name: '空气产品', layerId: 'chemicals', lng: -75.45, lat: 40.62, note: '宾州，工业/电子气体', impact: 'high', subKind: 'specialty' },
];
