/**
 * 第六轮增密 · 全球产业链模块（2026-06-23）
 *
 * 四个新图层，采用 thematic-point 路径（与 tech_companies/auto_brands 同）：
 *  - aerospace_mfg（航空制造）：飞机总装厂 / 发动机厂 / Tier1 供应商
 *  - defense_mfg（国防军工）：主承包商 / 造船厂 / 导弹
 *  - semi_supply（半导体上游）：EDA / 封测 / 硅晶圆 / 材料（与现有 semiconductors 晶圆厂互补）
 *  - chemicals（化工与材料）：石化 / 特种化学 / 化肥 / 电池材料
 *
 * 所有条目为公开资料示意坐标，非精确/实时数据。整理日：2026-06-23。
 */

import type { ThematicPoint } from './global.thematic';

// ───────────────────────────────────────────────────────────────
// aerospace_mfg 航空制造
// ───────────────────────────────────────────────────────────────
export const DENSIFY_AEROSPACE_MFG_R6: ThematicPoint[] = [
  // ── 飞机制造商（OEM 总装厂）──
  { id: 'r6-am-boeing-renton', name: '波音伦顿工厂', layerId: 'aerospace_mfg', lng: -122.22, lat: 47.49, note: '华盛顿州，737 系列总装', impact: 'critical', subKind: 'airframer' },
  { id: 'r6-am-boeing-everett', name: '波音埃弗里特工厂', layerId: 'aerospace_mfg', lng: -122.28, lat: 47.91, note: '华盛顿州，全球最大建筑，777/787 总装', impact: 'critical', subKind: 'airframer' },
  { id: 'r6-am-boeing-charleston', name: '波音查尔斯顿工厂', layerId: 'aerospace_mfg', lng: -80.04, lat: 32.9, note: '南卡，787 总装/研发', impact: 'high', subKind: 'airframer' },
  { id: 'r6-am-airbus-toulouse', name: '空客图卢兹总装', layerId: 'aerospace_mfg', lng: 1.36, lat: 43.6, note: '法国，A320/A350 总装总部', impact: 'critical', subKind: 'airframer' },
  { id: 'r6-am-airbus-hamburg', name: '空客汉堡工厂', layerId: 'aerospace_mfg', lng: 9.99, lat: 53.55, note: '德国，A321/A330 总装', impact: 'critical', subKind: 'airframer' },
  { id: 'r6-am-airbus-mobile', name: '空客莫比尔工厂', layerId: 'aerospace_mfg', lng: -88.02, lat: 30.69, note: '阿拉巴马州，美国 A320 总装', impact: 'high', subKind: 'airframer' },
  { id: 'r6-am-airbus-tianjin', name: '空客天津总装线', layerId: 'aerospace_mfg', lng: 117.21, lat: 39.13, note: '天津，A320 亚洲总装', impact: 'high', subKind: 'airframer' },
  { id: 'r6-am-embraer-sp', name: '巴航工业圣若泽工厂', layerId: 'aerospace_mfg', lng: -46.53, lat: -23.22, note: '圣保罗州，E-Jets 支线机总装', impact: 'high', subKind: 'airframer' },
  { id: 'r6-am-bombardier-toronto', name: '德哈维兰多伦多工厂', layerId: 'aerospace_mfg', lng: -79.62, lat: 43.68, note: '安大略，Q400/DHC 支线机', impact: 'medium', subKind: 'airframer' },
  { id: 'r6-am-comac-shanghai', name: '商飞上海总装', layerId: 'aerospace_mfg', lng: 121.66, lat: 31.13, note: '浦东，C919 国产大飞机总装', impact: 'critical', subKind: 'airframer' },
  { id: 'r6-am-comac-zhuhai', name: '商飞珠海总装', layerId: 'aerospace_mfg', lng: 113.35, lat: 22.01, note: '珠海，AG600/ARJ21 部装', impact: 'medium', subKind: 'airframer' },
  { id: 'r6-am-mitsubishi-nagoya', name: '三菱重工名古屋', layerId: 'aerospace_mfg', lng: 136.91, lat: 35.17, note: '名古屋，SpaceJet 支线机研发', impact: 'medium', subKind: 'airframer' },
  { id: 'r6-am-ilyushin-uac', name: '伊尔库特/UAC', layerId: 'aerospace_mfg', lng: 104.3, lat: 52.27, note: '伊尔库茨克，MC-21 国产客机', impact: 'medium', subKind: 'airframer' },
  { id: 'r6-am-tupolev-kazan', name: '图波列夫喀山工厂', layerId: 'aerospace_mfg', lng: 49.12, lat: 55.79, note: '喀山，Tu-214/战略轰炸机', impact: 'medium', subKind: 'airframer' },
  // ── 发动机制造商 ──
  { id: 'r6-am-pratt-easthartford', name: '普惠东哈特福德', layerId: 'aerospace_mfg', lng: -72.69, lat: 41.77, note: '康涅狄格，GTF 齿轮涡扇总部', impact: 'critical', subKind: 'engine' },
  { id: 'r6-am-rr-derby', name: '罗罗德比工厂', layerId: 'aerospace_mfg', lng: -1.5, lat: 52.93, note: '英国德比，Trent 系列发动机', impact: 'critical', subKind: 'engine' },
  { id: 'r6-am-ge-evendale', name: 'GE 航空伊文代尔', layerId: 'aerospace_mfg', lng: -84.41, lat: 39.28, note: '俄亥俄，GE9X/LEAP 发动机', impact: 'critical', subKind: 'engine' },
  { id: 'r6-am-cfm-hamilton', name: 'CFM 国际汉密尔顿', layerId: 'aerospace_mfg', lng: -84.51, lat: 39.4, note: 'GE/赛峰合资，LEAP 主力发动机', impact: 'high', subKind: 'engine' },
  { id: 'r6-am-safran-villaroche', name: '赛峰维拉罗什', layerId: 'aerospace_mfg', lng: 2.51, lat: 48.7, note: '法国，LEAP/舰用发动机', impact: 'high', subKind: 'engine' },
  { id: 'r6-am-mtu-munich', name: 'MTU 慕尼黑', layerId: 'aerospace_mfg', lng: 11.57, lat: 48.14, note: '德国，军用/民用发动机模块', impact: 'medium', subKind: 'engine' },
  { id: 'r6-am-aecc-zhuzhou', name: '中国航发株洲', layerId: 'aerospace_mfg', lng: 113.14, lat: 27.83, note: '湖南，涡轴/涡桨发动机', impact: 'high', subKind: 'engine' },
  { id: 'r6-am-aecc-chengdu', name: '中国航发成都', layerId: 'aerospace_mfg', lng: 104.07, lat: 30.67, note: '四川，太行/军用发动机', impact: 'high', subKind: 'engine' },
  // ── Tier1 供应商 / 系统 ──
  { id: 'r6-am-spirit-wichita', name: '势航威奇托', layerId: 'aerospace_mfg', lng: -97.34, lat: 37.69, note: '堪萨斯，机身段（前波音威奇托）', impact: 'high', subKind: 'supplier' },
  { id: 'r6-am-safran-toulouse-elec', name: '赛峰电气图卢兹', layerId: 'aerospace_mfg', lng: 1.38, lat: 43.6, note: '法国，航电/电气系统', impact: 'medium', subKind: 'supplier' },
  { id: 'r6-am-collins-charlotte', name: '柯林斯宇航夏洛特', layerId: 'aerospace_mfg', lng: -80.84, lat: 35.23, note: '北卡，航电/起落架系统', impact: 'high', subKind: 'supplier' },
  { id: 'r6-am-honeywell-phx', name: '霍尼韦尔凤凰城', layerId: 'aerospace_mfg', lng: -112.0, lat: 33.43, note: '亚利桑那，航电/APU 辅助动力', impact: 'high', subKind: 'supplier' },
  { id: 'r6-am-parker-cleveland', name: '派克汉尼汾克利夫兰', layerId: 'aerospace_mfg', lng: -81.69, lat: 41.5, note: '俄亥俄，液压/燃油系统', impact: 'medium', subKind: 'supplier' },
  { id: 'r6-am-stelia', name: 'Stelia 航空', layerId: 'aerospace_mfg', lng: -1.27, lat: 49.5, note: '法国梅奥，机身/复合材料', impact: 'medium', subKind: 'supplier' },
  { id: 'r6-am-recaro', name: 'ReCARO 航空座椅', layerId: 'aerospace_mfg', lng: 9.16, lat: 48.78, note: '德国斯图加特，机舱座椅', impact: 'low', subKind: 'supplier' },
  { id: 'r6-am-aviation-xinxiang', name: '航空工业新乡', layerId: 'aerospace_mfg', lng: 113.93, lat: 35.31, note: '河南，机载设备/传感器', impact: 'medium', subKind: 'supplier' },
];

// ───────────────────────────────────────────────────────────────
// defense_mfg 国防军工
// ───────────────────────────────────────────────────────────────
export const DENSIFY_DEFENSE_MFG_R6: ThematicPoint[] = [
  // ── 主承包商（prime）──
  { id: 'r6-dm-lockheed', name: '洛克希德·马丁', layerId: 'defense_mfg', lng: -77.06, lat: 38.9, note: '贝塞斯达 MD，F-35/导弹防御', impact: 'critical', subKind: 'prime' },
  { id: 'r6-dm-rtx', name: 'RTX（雷神技术）', layerId: 'defense_mfg', lng: -72.68, lat: 41.74, note: '康涅狄格，爱国者/战斧导弹', impact: 'critical', subKind: 'prime' },
  { id: 'r6-dm-northrop', name: '诺斯罗普·格鲁曼', layerId: 'defense_mfg', lng: -77.16, lat: 38.83, note: '弗吉尼亚，B-21 轰炸机/卫星', impact: 'critical', subKind: 'prime' },
  { id: 'r6-dm-gd', name: '通用动力', layerId: 'defense_mfg', lng: -77.18, lat: 38.91, note: '弗吉尼亚，M1 坦克/核潜艇', impact: 'critical', subKind: 'prime' },
  { id: 'r6-dm-boeing-defense', name: '波音防务', layerId: 'defense_mfg', lng: -122.28, lat: 47.91, note: '西雅图，F-15/KC-46 加油机', impact: 'high', subKind: 'prime' },
  { id: 'r6-dm-l3harris', name: 'L3Harris 技术', layerId: 'defense_mfg', lng: -80.41, lat: 27.99, note: '佛罗里达，通信/电子战', impact: 'high', subKind: 'prime' },
  { id: 'r6-dm-bae', name: 'BAE 系统', layerId: 'defense_mfg', lng: -0.46, lat: 51.59, note: '伦敦，欧洲最大防务承包商', impact: 'critical', subKind: 'prime' },
  { id: 'r6-dm-airbus-defense', name: '空客防务航天', layerId: 'defense_mfg', lng: 11.58, lat: 48.13, note: '慕尼黑，军用运输机/卫星', impact: 'high', subKind: 'prime' },
  { id: 'r6-dm-leonardo', name: '莱昂纳多', layerId: 'defense_mfg', lng: 12.51, lat: 41.84, note: '罗马，欧洲战斗机/直升机', impact: 'high', subKind: 'prime' },
  { id: 'r6-dm-thales-defense', name: '泰雷兹防务', layerId: 'defense_mfg', lng: 2.21, lat: 48.76, note: '巴黎，雷达/电子战', impact: 'high', subKind: 'prime' },
  { id: 'r6-dm-dassault', name: '达索航空', layerId: 'defense_mfg', lng: 2.34, lat: 48.84, note: '巴黎，阵风战斗机', impact: 'high', subKind: 'prime' },
  { id: 'r6-dm-saab', name: '萨博集团', layerId: 'defense_mfg', lng: 16.51, lat: 58.59, note: '林雪平，鹰狮战斗机', impact: 'high', subKind: 'prime' },
  { id: 'r6-dm-kbp', name: '高精武器系统公司', layerId: 'defense_mfg', lng: 35.82, lat: 55.92, note: '图拉，铠甲/通古斯卡防空', impact: 'high', subKind: 'prime' },
  { id: 'r6-dm-sukhoi', name: '苏霍伊', layerId: 'defense_mfg', lng: 37.62, lat: 55.75, note: '莫斯科，Su-35/Su-57 战机', impact: 'critical', subKind: 'prime' },
  { id: 'r6-dm-avic', name: '中国航空工业', layerId: 'defense_mfg', lng: 116.32, lat: 39.92, note: '北京，歼-20/运-20', impact: 'critical', subKind: 'prime' },
  { id: 'r6-dm-casic', name: '中国航天科工', layerId: 'defense_mfg', lng: 116.32, lat: 39.93, note: '北京，红旗/东风导弹', impact: 'critical', subKind: 'prime' },
  { id: 'r6-dm-cetc', name: '中国电科', layerId: 'defense_mfg', lng: 116.34, lat: 39.93, note: '北京，雷达/电子战/预警机', impact: 'high', subKind: 'prime' },
  { id: 'r6-dm-norinco', name: '中国兵器工业', layerId: 'defense_mfg', lng: 116.34, lat: 39.95, note: '北京，坦克/火炮/弹药', impact: 'critical', subKind: 'prime' },
  { id: 'r6-dm-csic-defense', name: '中国船舶工业', layerId: 'defense_mfg', lng: 116.35, lat: 39.92, note: '北京，航母/驱护舰', impact: 'critical', subKind: 'prime' },
  { id: 'r6-dm-htdz', name: '印度国防公企', layerId: 'defense_mfg', lng: 77.21, lat: 28.63, note: '新德里，HAL/BEL 国防集群', impact: 'high', subKind: 'prime' },
  { id: 'r6-dm-iai', name: '以色列航太工业', layerId: 'defense_mfg', lng: 34.89, lat: 32.02, note: '特拉维夫，铁穹/无人机', impact: 'high', subKind: 'prime' },
  { id: 'r6-dm-elbit', name: 'Elbit 系统', layerId: 'defense_mfg', lng: 34.99, lat: 32.81, note: '海法，光电/头盔瞄准', impact: 'medium', subKind: 'prime' },
  { id: 'r6-dm-baykar', name: 'Baykar 技术', layerId: 'defense_mfg', lng: 29.05, lat: 40.98, note: '伊斯坦布尔，Bayraktar 无人机', impact: 'high', subKind: 'prime' },
  { id: 'r6-dm-hanwha', name: '韩华防务', layerId: 'defense_mfg', lng: 126.83, lat: 37.34, note: '首尔，K2 坦克/K9 炮', impact: 'high', subKind: 'prime' },
  { id: 'r6-dm-mitsubishi-heavy', name: '三菱重工', layerId: 'defense_mfg', lng: 139.69, lat: 35.69, note: '东京，F-2/导弹/潜艇', impact: 'high', subKind: 'prime' },
  // ── 造船厂 ──
  { id: 'r6-dm-newport', name: '纽波特纽斯造船厂', layerId: 'defense_mfg', lng: -76.45, lat: 36.99, note: '弗吉尼亚，福特级航母', impact: 'critical', subKind: 'shipyard' },
  { id: 'r6-dm-electricboat', name: '电船公司', layerId: 'defense_mfg', lng: -72.1, lat: 41.35, note: '康涅狄格，弗吉尼亚级核潜艇', impact: 'critical', subKind: 'shipyard' },
  { id: 'r6-dm-bath', name: '巴斯钢铁', layerId: 'defense_mfg', lng: -69.82, lat: 43.91, note: '缅因，阿利·伯克级驱逐舰', impact: 'high', subKind: 'shipyard' },
  { id: 'r6-dm-ingalls', name: '英戈尔斯造船厂', layerId: 'defense_mfg', lng: -88.83, lat: 30.37, note: '密西西比，两栖/驱逐舰', impact: 'high', subKind: 'shipyard' },
  { id: 'r6-dm-bae-shipyard', name: 'BAE 苏格兰造船厂', layerId: 'defense_mfg', lng: -4.7, lat: 55.87, note: '格拉斯哥，26 型护卫舰', impact: 'medium', subKind: 'shipyard' },
  { id: 'r6-dm-naval-group', name: '海军集团', layerId: 'defense_mfg', lng: -4.49, lat: 48.4, note: '布雷斯特，核潜艇/护卫舰', impact: 'high', subKind: 'shipyard' },
  { id: 'r6-dm-dalian-ship', name: '大连造船厂', layerId: 'defense_mfg', lng: 121.65, lat: 38.91, note: '辽宁，航母/驱护舰', impact: 'critical', subKind: 'shipyard' },
  { id: 'r6-dm-jiangnan', name: '江南造船厂', layerId: 'defense_mfg', lng: 121.46, lat: 31.22, note: '上海长兴，航母/驱逐舰', impact: 'critical', subKind: 'shipyard' },
  { id: 'r6-dm-wuchang', name: '武昌造船厂', layerId: 'defense_mfg', lng: 114.3, lat: 30.6, note: '武汉，常规潜艇/护卫舰', impact: 'high', subKind: 'shipyard' },
  { id: 'r6-dm-mazagon', name: '马扎冈造船厂', layerId: 'defense_mfg', lng: 72.85, lat: 19.0, note: '孟买，印度驱逐舰/潜艇', impact: 'medium', subKind: 'shipyard' },
];

// ───────────────────────────────────────────────────────────────
// semi_supply 半导体上游（EDA/封测/硅晶圆/材料）
// ───────────────────────────────────────────────────────────────
export const DENSIFY_SEMI_SUPPLY_R6: ThematicPoint[] = [
  // ── EDA 软件 ──
  { id: 'r6-ss-synopsys', name: '新思科技（Synopsys）', layerId: 'semi_supply', lng: -121.99, lat: 37.4, note: '桑尼维尔 CA，EDA 龙头/EDA 黄金标准', impact: 'critical', subKind: 'eda' },
  { id: 'r6-ss-cadence', name: '铿腾电子（Cadence）', layerId: 'semi_supply', lng: -122.03, lat: 37.37, note: '圣何塞 CA，EDA/仿真', impact: 'critical', subKind: 'eda' },
  { id: 'r6-ss-siemens-eda', name: '西门子 EDA（Mentor）', layerId: 'semi_supply', lng: -122.69, lat: 45.51, note: '波特兰 OR（原 Mentor），PCB/验证', impact: 'high', subKind: 'eda' },
  { id: 'r6-ss-empyrean', name: '华大九天', layerId: 'semi_supply', lng: 116.46, lat: 39.93, note: '北京，国产 EDA 龙头', impact: 'high', subKind: 'eda' },
  { id: 'r6-ss-primary', name: '概伦电子', layerId: 'semi_supply', lng: 121.6, lat: 31.2, note: '上海，器件建模/测试 EDA', impact: 'medium', subKind: 'eda' },
  // ── 封测（OSAT）──
  { id: 'r6-ss-ase-kaohsiung', name: '日月光高雄', layerId: 'semi_supply', lng: 120.34, lat: 22.61, note: '台湾，全球最大 OSAT 封测', impact: 'critical', subKind: 'osat' },
  { id: 'r6-ss-ase-taichung', name: '日月光/矽品台中', layerId: 'semi_supply', lng: 120.65, lat: 24.16, note: '台中，先进封装', impact: 'high', subKind: 'osat' },
  { id: 'r6-ss-amkor-korea', name: '安靠韩国', layerId: 'semi_supply', lng: 127.1, lat: 37.4, note: '京畿道，全球第二大封测', impact: 'high', subKind: 'osat' },
  { id: 'r6-ss-jcet', name: '长电科技', layerId: 'semi_supply', lng: 120.35, lat: 31.55, note: '江阴，中国大陆封测龙头', impact: 'high', subKind: 'osat' },
  { id: 'r6-ss-tongfu', name: '通富微电', layerId: 'semi_supply', lng: 120.86, lat: 32.01, note: '南通，AMD 封测合作方', impact: 'high', subKind: 'osat' },
  { id: 'r6-ss-hua-tian', name: '华天科技', layerId: 'semi_supply', lng: 105.72, lat: 34.58, note: '天水，封测/传感器', impact: 'medium', subKind: 'osat' },
  { id: 'r6-ss-powertech', name: '力成科技', layerId: 'semi_supply', lng: 121.0, lat: 24.79, note: '新竹，存储封测', impact: 'medium', subKind: 'osat' },
  { id: 'r6-ss-spil', name: '京元电', layerId: 'semi_supply', lng: 120.96, lat: 24.83, note: '竹南，晶圆测试', impact: 'medium', subKind: 'osat' },
  // ── 硅晶圆 ──
  { id: 'r6-ss-sumco-imari', name: 'SUMCO 伊万里', layerId: 'semi_supply', lng: 129.87, lat: 33.29, note: '佐贺，12 寸硅晶圆', impact: 'critical', subKind: 'wafer' },
  { id: 'r6-ss-sumco-head', name: 'SUMCO 总部', layerId: 'semi_supply', lng: 135.49, lat: 34.69, note: '大阪，全球硅晶圆双寡头之一', impact: 'critical', subKind: 'wafer' },
  { id: 'r6-ss-shinetsu', name: '信越化学', layerId: 'semi_supply', lng: 138.24, lat: 36.69, note: '长野，硅晶圆/光刻胶龙头', impact: 'critical', subKind: 'wafer' },
  { id: 'r6-ss-global-wafers', name: '环球晶圆', layerId: 'semi_supply', lng: 120.97, lat: 24.8, note: '新竹，全球第三大硅晶圆', impact: 'high', subKind: 'wafer' },
  { id: 'r6-ss-siltronic', name: '世创电子材料', layerId: 'semi_supply', lng: 12.1, lat: 48.15, note: '慕尼黑，硅晶圆材料', impact: 'high', subKind: 'wafer' },
  { id: 'r6-ss-zhonghuan', name: '中环半导体', layerId: 'semi_supply', lng: 117.38, lat: 39.13, note: '天津，硅片/光伏', impact: 'medium', subKind: 'wafer' },
  // ── 材料（光刻胶/特气/靶材/CMP）──
  { id: 'r6-ss-jsr', name: 'JSR 株式会社', layerId: 'semi_supply', lng: 139.69, lat: 35.69, note: '东京，EUV 光刻胶', impact: 'critical', subKind: 'materials' },
  { id: 'r6-ss-tok', name: '东京应化（TOK）', layerId: 'semi_supply', lng: 139.65, lat: 35.65, note: '横滨，全球最大光刻胶厂', impact: 'critical', subKind: 'materials' },
  { id: 'r6-ss-fujifilm', name: '富士胶片（半导体）', layerId: 'semi_supply', lng: 139.66, lat: 35.66, note: '东京，光刻胶/CMP 浆料', impact: 'high', subKind: 'materials' },
  { id: 'r6-ss-entegris', name: 'Entegris', layerId: 'semi_supply', lng: -71.43, lat: 42.49, note: '马萨诸塞，特气/CMP/过滤器', impact: 'high', subKind: 'materials' },
  { id: 'r6-ss-cabot', name: '卡博特', layerId: 'semi_supply', lng: -71.05, lat: 42.36, note: '波士顿，CMP 浆料', impact: 'medium', subKind: 'materials' },
  { id: 'r6-ss-merck-elec', name: '默克电子', layerId: 'semi_supply', lng: 8.25, lat: 50.0, note: '达姆施塔特，特种气体/材料', impact: 'high', subKind: 'materials' },
  { id: 'r6-ss-air-liquide', name: '液化空气', layerId: 'semi_supply', lng: 2.34, lat: 48.84, note: '巴黎，电子特气', impact: 'high', subKind: 'materials' },
  { id: 'r6-ss-linde', name: '林德集团', layerId: 'semi_supply', lng: 8.55, lat: 47.37, note: '苏黎世，电子气体', impact: 'high', subKind: 'materials' },
  { id: 'r6-ss-nata', name: '南大光电', layerId: 'semi_supply', lng: 120.7, lat: 31.27, note: '苏州，国产光刻胶/前驱体', impact: 'medium', subKind: 'materials' },
  { id: 'r6-ss-yac', name: '雅克科技', layerId: 'semi_supply', lng: 120.3, lat: 31.45, note: '无锡，前驱体/CMP', impact: 'medium', subKind: 'materials' },
  { id: 'r6-ss-jmc', name: '江丰电子', layerId: 'semi_supply', lng: 121.16, lat: 30.04, note: '宁波，高纯溅射靶材', impact: 'medium', subKind: 'materials' },
];

// ───────────────────────────────────────────────────────────────
// chemicals 化工与材料
// ───────────────────────────────────────────────────────────────
export const DENSIFY_CHEMICALS_R6: ThematicPoint[] = [
  // ── 石化（petrochem）──
  { id: 'r6-ch-basf-ludwigshafen', name: '巴斯夫路德维希港', layerId: 'chemicals', lng: 8.45, lat: 49.48, note: '德国，全球最大化工综合体', impact: 'critical', subKind: 'petrochem' },
  { id: 'r6-ch-dow-midland', name: '陶氏化学', layerId: 'chemicals', lng: -84.25, lat: 43.61, note: '密歇根米德兰，美国最大化工', impact: 'critical', subKind: 'petrochem' },
  { id: 'r6-ch-sabic', name: '沙特基础工业', layerId: 'chemicals', lng: 50.1, lat: 26.28, note: '利雅得，全球石化巨头', impact: 'critical', subKind: 'petrochem' },
  { id: 'r6-ch-exxon-baytown', name: '埃克森美孚贝敦', layerId: 'chemicals', lng: -94.98, lat: 29.74, note: '得州，美国最大炼化综合体', impact: 'critical', subKind: 'petrochem' },
  { id: 'r6-ch-shell-rotterdam', name: '壳牌佩尔尼斯', layerId: 'chemicals', lng: 4.1, lat: 51.96, note: '鹿特丹，欧洲最大炼厂', impact: 'high', subKind: 'petrochem' },
  { id: 'r6-ch-ineos-cologne', name: '英力士科隆', layerId: 'chemicals', lng: 6.96, lat: 50.94, note: '德国，欧洲乙烯/PE 龙头', impact: 'high', subKind: 'petrochem' },
  { id: 'r6-ch-formosa', name: '台塑六轻', layerId: 'chemicals', lng: 120.18, lat: 23.79, note: '麦寮，亚洲最大石化园区', impact: 'critical', subKind: 'petrochem' },
  { id: 'r6-ch-sinopec-zhenhai', name: '中石化镇海炼化', layerId: 'chemicals', lng: 121.64, lat: 29.96, note: '宁波，中国最大炼厂', impact: 'critical', subKind: 'petrochem' },
  { id: 'r6-ch-reliance-jamnagar', name: '信实贾姆讷格尔', layerId: 'chemicals', lng: 70.05, lat: 22.45, note: '古吉拉特，全球最大炼油厂', impact: 'critical', subKind: 'petrochem' },
  { id: 'r6-ch-sk-ulsan', name: 'SK 创新蔚山', layerId: 'chemicals', lng: 129.31, lat: 35.54, note: '韩国，亚洲第二大炼厂', impact: 'high', subKind: 'petrochem' },
  { id: 'r6-ch-jxta-dalian', name: '恒力大连', layerId: 'chemicals', lng: 121.65, lat: 38.91, note: '长兴岛，民营炼化一体化', impact: 'high', subKind: 'petrochem' },
  { id: 'r6-ch-lyondell-channelview', name: '利安德巴塞尔', layerId: 'chemicals', lng: -95.1, lat: 29.78, note: '得州，全球聚烯烃龙头', impact: 'high', subKind: 'petrochem' },
  // ── 特种化学（specialty）──
  { id: 'r6-ch-evonik-essen', name: '赢创埃森', layerId: 'chemicals', lng: 7.01, lat: 51.45, note: '德国，特种化学品/过氧化物', impact: 'high', subKind: 'specialty' },
  { id: 'r6-ch-solvay-brussels', name: '索尔维布鲁塞尔', layerId: 'chemicals', lng: 4.35, lat: 50.85, note: '比利时，特种聚合物/纯碱', impact: 'high', subKind: 'specialty' },
  { id: 'r6-ch-wacker-munich', name: '瓦克慕尼黑', layerId: 'chemicals', lng: 11.57, lat: 48.14, note: '德国，硅化学/多晶硅', impact: 'high', subKind: 'specialty' },
  { id: 'r6-ch-covestro-leverkusen', name: '科思创勒沃库森', layerId: 'chemicals', lng: 6.98, lat: 51.04, note: '德国，聚碳酸酯/PU', impact: 'high', subKind: 'specialty' },
  { id: 'r6-ch-3m-maplewood', name: '3M 枫木镇', layerId: 'chemicals', lng: -92.98, lat: 44.95, note: '明尼苏达，氟化学/胶粘剂', impact: 'high', subKind: 'specialty' },
  { id: 'r6-ch-wanhua-yantai', name: '万华化学烟台', layerId: 'chemicals', lng: 121.39, lat: 37.54, note: '烟台，全球 MDI 龙头', impact: 'high', subKind: 'specialty' },
  { id: 'r6-ch-lubrizol-wickliffe', name: '路博润', layerId: 'chemicals', lng: -81.47, lat: 41.6, note: '俄亥俄，润滑油添加剂', impact: 'medium', subKind: 'specialty' },
  // ── 化肥（fertilizer）──
  { id: 'r6-ch-nutrien-saskatoon', name: 'Nutrien 萨斯卡通', layerId: 'chemicals', lng: -106.67, lat: 52.13, note: '加拿大，全球最大钾肥', impact: 'critical', subKind: 'fertilizer' },
  { id: 'r6-ch-mosaic', name: '美盛', layerId: 'chemicals', lng: -82.55, lat: 27.95, note: '佛罗里达，磷肥巨头', impact: 'high', subKind: 'fertilizer' },
  { id: 'r6-ch-urat', name: '乌拉尔钾肥', layerId: 'chemicals', lng: 59.04, lat: 56.71, note: '彼尔姆，俄罗斯钾肥核心', impact: 'high', subKind: 'fertilizer' },
  { id: 'r6-ch-belaruskali', name: '白俄罗斯钾肥', layerId: 'chemicals', lng: 27.55, lat: 52.42, note: '索利戈尔斯克，全球钾肥巨头', impact: 'high', subKind: 'fertilizer' },
  { id: 'r6-ch-yara-oslo', name: '雅苒奥斯陆', layerId: 'chemicals', lng: 10.75, lat: 59.91, note: '挪威，全球氮肥龙头', impact: 'critical', subKind: 'fertilizer' },
  { id: 'r6-ch-cf-nitrogen', name: 'CF 工业', layerId: 'chemicals', lng: -88.0, lat: 41.85, note: '伊利诺伊，氮肥/氨', impact: 'high', subKind: 'fertilizer' },
  { id: 'r6-ch-sinopec-fert', name: '中化化肥', layerId: 'chemicals', lng: 116.32, lat: 39.92, note: '北京，中国化肥龙头', impact: 'medium', subKind: 'fertilizer' },
  { id: 'r6-ch-ocp', name: 'OCP 集团', layerId: 'chemicals', lng: -6.85, lat: 33.97, note: '摩洛哥，全球磷肥储量第一', impact: 'critical', subKind: 'fertilizer' },
  // ── 电池材料（battery）──
  { id: 'r6-ch-ganfeng', name: '赣锋锂业', layerId: 'chemicals', lng: 114.93, lat: 25.82, note: '宜春/新余，锂盐/金属锂', impact: 'critical', subKind: 'battery' },
  { id: 'r6-ch-tianqi', name: '天齐锂业', layerId: 'chemicals', lng: 104.07, lat: 30.67, note: '成都/遂宁，锂化工龙头', impact: 'critical', subKind: 'battery' },
  { id: 'r6-ch-sqm', name: 'SQM 智利', layerId: 'chemicals', lng: -70.25, lat: -23.65, note: '安托法加斯塔，锂三角核心', impact: 'critical', subKind: 'battery' },
  { id: 'r6-ch-albemarle', name: '雅保', layerId: 'chemicals', lng: -80.84, lat: 35.23, note: '夏洛特，全球最大锂生产商', impact: 'critical', subKind: 'battery' },
  { id: 'r6-ch-umicore', name: '优美科', layerId: 'chemicals', lng: 4.35, lat: 50.85, note: '布鲁塞尔，正极材料/回收', impact: 'high', subKind: 'battery' },
  { id: 'r6-ch-posco-chemical', name: 'POSCO Future M', layerId: 'chemicals', lng: 126.63, lat: 37.45, note: '韩国，正极材料', impact: 'high', subKind: 'battery' },
  { id: 'r6-ch-btr', name: '贝特瑞', layerId: 'chemicals', lng: 114.06, lat: 22.55, note: '深圳，负极材料龙头', impact: 'high', subKind: 'battery' },
  { id: 'r6-ch-eve-mat', name: '恩捷股份', layerId: 'chemicals', lng: 102.83, lat: 24.9, note: '云南，隔膜材料龙头', impact: 'high', subKind: 'battery' },
];
