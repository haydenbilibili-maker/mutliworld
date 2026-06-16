/**
 * 全球海洋与洋底空间信息图层 — 海洋考古 / 洋流 / 渔场 / 季风 / 大气环流 / 深海探索
 *
 * 均为公开地理与海洋学资料，坐标为区域中心或路径**示意**，非精确勘测边界。
 * 整理日：2026-06-16
 */

import type { ImpactLevel, LayerId } from '@/types/geo';

export interface OceanPoint {
  id: string;
  name: string;
  layerId: LayerId;
  lng: number;
  lat: number;
  note: string;
  impact: ImpactLevel;
  /** 子类（考古类型、探索类型、季风季节等） */
  subKind?: string;
}

export interface OceanCurrentRoute {
  id: string;
  name: string;
  coordinates: [number, number][];
  note: string;
  impact: ImpactLevel;
  /** 流向描述 */
  direction?: string;
}

/** 海洋考古遗址 — 20 处 */
export const GLOBAL_MARINE_ARCHAEOLOGY: OceanPoint[] = [
  { id: 'arch-nanhai1', name: '南海一号沉船', layerId: 'marine_archaeology', lng: 112.5, lat: 21.8, note: '宋代商船，1987 年发现，广东阳江海域整体打捞', impact: 'critical', subKind: 'merchant' },
  { id: 'arch-nanhai2', name: '南海二号沉船', layerId: 'marine_archaeology', lng: 113.2, lat: 22.1, note: '明代沉船，2022 年出水，广州打捞', impact: 'high', subKind: 'merchant' },
  { id: 'arch-antikythera', name: '安提基特拉沉船', layerId: 'marine_archaeology', lng: 23.3, lat: 35.2, note: '公元前 1 世纪希腊沉船，出土安提基特拉机械', impact: 'critical', subKind: 'ancient' },
  { id: 'arch-uluburun', name: '乌鲁布伦沉船', layerId: 'marine_archaeology', lng: 30.0, lat: 36.2, note: '公元前 14 世纪青铜时代商船，土耳其南岸', impact: 'critical', subKind: 'ancient' },
  { id: 'arch-belitung', name: '黑石号（Belitung）', layerId: 'marine_archaeology', lng: 107.5, lat: -2.5, note: '9 世纪唐代沉船，印尼勿里洞岛海域，大量中国瓷器', impact: 'high', subKind: 'merchant' },
  { id: 'arch-atocha', name: '阿托查号沉船', layerId: 'marine_archaeology', lng: -82.0, lat: 24.5, note: '1622 年西班牙宝船，佛罗里达礁群', impact: 'high', subKind: 'galleon' },
  { id: 'arch-sanjose', name: '圣何塞号宝船', layerId: 'marine_archaeology', lng: -76.0, lat: 9.8, note: '1708 年西班牙宝船，哥伦比亚加勒比海域', impact: 'high', subKind: 'galleon' },
  { id: 'arch-titanic', name: '泰坦尼克号残骸', layerId: 'marine_archaeology', lng: -49.9, lat: 41.7, note: '1912 年沉没，北大西洋 3800m 深处', impact: 'critical', subKind: 'modern' },
  { id: 'arch-yamato', name: '大和号战列舰残骸', layerId: 'marine_archaeology', lng: 128.0, lat: 30.4, note: '1945 年沉没，冲绳以南深海', impact: 'high', subKind: 'warship' },
  { id: 'arch-heracleion', name: '赫拉克利翁古城（Thonis）', layerId: 'marine_archaeology', lng: 29.9, lat: 31.2, note: '埃及地中海海底古城，公元前 8 世纪', impact: 'critical', subKind: 'ancient' },
  { id: 'arch-portroyal', name: '皇家港水下遗址', layerId: 'marine_archaeology', lng: -76.8, lat: 17.9, note: '1692 年地震沉没的牙买加海盗港', impact: 'medium', subKind: 'colonial' },
  { id: 'arch-quanzhou', name: '泉州湾宋代沉船群', layerId: 'marine_archaeology', lng: 118.6, lat: 24.9, note: '福建泉州海域多处宋元沉船，海上丝绸之路遗存', impact: 'high', subKind: 'merchant' },
  { id: 'arch-ningbo', name: '宁波小白礁沉船', layerId: 'marine_archaeology', lng: 121.8, lat: 29.9, note: '清代商船，2010 年整体打捞，浙江象山海域', impact: 'medium', subKind: 'merchant' },
  { id: 'arch-grafspee', name: '格拉夫·斯佩号残骸', layerId: 'marine_archaeology', lng: -56.3, lat: -34.9, note: '1939 年自沉的德国袖珍战列舰，乌拉圭蒙得维的亚', impact: 'medium', subKind: 'warship' },
  { id: 'arch-vasa', name: '瓦萨号（浅水保存）', layerId: 'marine_archaeology', lng: 18.1, lat: 59.3, note: '1628 年沉没瑞典战船，1961 年打捞，斯德哥尔摩港', impact: 'high', subKind: 'warship' },
  { id: 'arch-maryrose', name: '玛丽玫瑰号', layerId: 'marine_archaeology', lng: -1.1, lat: 50.8, note: '1545 年沉没的亨利八世旗舰，朴茨茅斯', impact: 'high', subKind: 'warship' },
  { id: 'arch-dwarka', name: '德瓦卡海底遗址（争议）', layerId: 'marine_archaeology', lng: 68.9, lat: 22.2, note: '古吉拉特海岸水下石构，年代与性质学界存争议', impact: 'medium', subKind: 'ancient' },
  { id: 'arch-cesme', name: '切什梅湾奥斯曼沉船', layerId: 'marine_archaeology', lng: 26.3, lat: 38.3, note: '爱琴海奥斯曼帝国时期沉船群', impact: 'medium', subKind: 'colonial' },
  { id: 'arch-huaguangjiao', name: '华光礁一号沉船', layerId: 'marine_archaeology', lng: 111.5, lat: 16.2, note: '南宋沉船，西沙群岛，大量瓷器', impact: 'high', subKind: 'merchant' },
  { id: 'arch-ehime', name: '爱媛丸事件沉船', layerId: 'marine_archaeology', lng: -157.9, lat: 21.4, note: '2001 年美国潜艇撞沉日本渔船，夏威夷近海', impact: 'medium', subKind: 'modern' },
];

/** 主要洋流 — 14 条示意路径 */
export const GLOBAL_OCEAN_CURRENTS: OceanCurrentRoute[] = [
  {
    id: 'cur-gulf-stream',
    name: '墨西哥湾流 / 北大西洋暖流',
    direction: '向北偏东',
    note: '世界最强暖洋流之一，将热带热量输送至欧洲西北部',
    impact: 'critical',
    coordinates: [[-85, 25], [-80, 28], [-75, 32], [-70, 36], [-60, 40], [-50, 45], [-40, 48], [-30, 50], [-20, 52], [-10, 55]],
  },
  {
    id: 'cur-kuroshio',
    name: '黑潮（日本暖流）',
    direction: '向北偏东',
    note: '西太平洋最强暖流，影响东亚气候与渔业',
    impact: 'critical',
    coordinates: [[125, 18], [128, 22], [132, 26], [136, 30], [140, 34], [142, 38], [145, 42], [148, 45]],
  },
  {
    id: 'cur-acc',
    name: '南极绕极流（ACC）',
    direction: '自西向东',
    note: '全球唯一无陆地阻挡的洋流，环绕南极洲',
    impact: 'critical',
    coordinates: [[0, -55], [45, -58], [90, -60], [135, -58], [180, -55], [-135, -58], [-90, -60], [-45, -58], [0, -55]],
  },
  {
    id: 'cur-humboldt',
    name: '秘鲁寒流（洪堡流）',
    direction: '向北',
    note: '东南太平洋上升流区，支撑全球最大渔业之一',
    impact: 'critical',
    coordinates: [[-80, -15], [-78, -10], [-76, -5], [-74, 0], [-72, 5], [-70, 10]],
  },
  {
    id: 'cur-benguela',
    name: '本格拉寒流',
    direction: '向北',
    note: '西南非洲沿岸上升流，沙丁鱼与磷虾渔场',
    impact: 'high',
    coordinates: [[10, -35], [8, -30], [6, -25], [4, -20], [2, -15], [0, -10]],
  },
  {
    id: 'cur-canary',
    name: '加那利寒流',
    direction: '向南偏西南',
    note: '东北大西洋寒流，影响西非海岸气候',
    impact: 'high',
    coordinates: [[-20, 32], [-22, 28], [-24, 24], [-26, 20], [-28, 16], [-30, 12]],
  },
  {
    id: 'cur-brazil',
    name: '巴西暖流',
    direction: '向南偏西南',
    note: '南大西洋西部暖流，与福克兰寒流交汇',
    impact: 'high',
    coordinates: [[-35, -5], [-38, -10], [-42, -15], [-46, -20], [-50, -28], [-52, -35]],
  },
  {
    id: 'cur-agulhas',
    name: '厄加勒斯暖流',
    direction: '向南偏西',
    note: '印度洋最强暖流，南端形成大型涡旋脱离',
    impact: 'high',
    coordinates: [[42, -10], [40, -15], [38, -22], [32, -30], [25, -38], [18, -42]],
  },
  {
    id: 'cur-california',
    name: '加利福尼亚寒流',
    direction: '向南',
    note: '东北太平洋寒流，支撑北美西海岸渔业',
    impact: 'high',
    coordinates: [[-125, 48], [-124, 42], [-122, 36], [-120, 30], [-118, 24], [-115, 18]],
  },
  {
    id: 'cur-east-aus',
    name: '东澳大利亚暖流',
    direction: '向南',
    note: '西南太平洋暖流，影响澳洲东岸气候',
    impact: 'medium',
    coordinates: [[155, -10], [154, -18], [153, -26], [152, -34], [150, -42]],
  },
  {
    id: 'cur-oyashio',
    name: '亲潮（千岛寒流）',
    direction: '向南偏西南',
    note: '西北太平洋寒流，与黑潮交汇形成重要渔场',
    impact: 'high',
    coordinates: [[155, 48], [152, 44], [148, 40], [145, 36], [142, 32], [140, 28]],
  },
  {
    id: 'cur-labrador',
    name: '拉布拉多寒流',
    direction: '向南',
    note: '西北大西洋寒流，与湾流交汇于纽芬兰大浅滩',
    impact: 'high',
    coordinates: [[-55, 55], [-54, 50], [-52, 45], [-50, 42], [-48, 40], [-45, 38]],
  },
  {
    id: 'cur-monsoon',
    name: '季风洋流（印度洋）',
    direction: '季节反转',
    note: '夏季西南季风驱动向东流，冬季东北季风驱动向西流',
    impact: 'high',
    coordinates: [[50, 5], [60, 0], [70, -5], [80, -10], [90, -15], [100, -10], [95, 0], [85, 8], [75, 12], [65, 10], [55, 8], [50, 5]],
  },
  {
    id: 'cur-north-atlantic-drift',
    name: '北大西洋漂移',
    direction: '向东偏北',
    note: '湾流延伸，维持英国与北欧相对温和气候',
    impact: 'critical',
    coordinates: [[-30, 50], [-20, 52], [-10, 54], [0, 56], [10, 58], [20, 60], [30, 62], [40, 64]],
  },
];

/** 主要渔场 — 24 处 */
export const GLOBAL_FISHERIES: OceanPoint[] = [
  { id: 'fish-grand-banks', name: '纽芬兰大浅滩', layerId: 'fisheries', lng: -51.0, lat: 46.5, note: '湾流与拉布拉多寒流交汇，历史上鳕鱼渔场', impact: 'critical', subKind: 'groundfish' },
  { id: 'fish-peru-anchovy', name: '秘鲁鳀鱼渔场', layerId: 'fisheries', lng: -76.0, lat: -12.0, note: '洪堡上升流区，全球最大渔获量之一', impact: 'critical', subKind: 'pelagic' },
  { id: 'fish-north-sea', name: '北海渔场', layerId: 'fisheries', lng: 3.0, lat: 56.0, note: '欧洲最重要渔场，鳕鱼与鲱鱼', impact: 'high', subKind: 'groundfish' },
  { id: 'fish-oyashio-kuroshio', name: '亲潮-黑潮交汇渔场', layerId: 'fisheries', lng: 142.0, lat: 38.0, note: '西北太平洋重要渔场，鱿鱼与金枪鱼', impact: 'critical', subKind: 'pelagic' },
  { id: 'fish-nw-pacific', name: '西北太平洋渔场', layerId: 'fisheries', lng: 145.0, lat: 42.0, note: '日本近海，鲑鱼、鲭鱼与底栖鱼类', impact: 'high', subKind: 'groundfish' },
  { id: 'fish-bering', name: '白令海狭鳕渔场', layerId: 'fisheries', lng: -175.0, lat: 58.0, note: '全球最大狭鳕（阿拉斯加鳕）渔场', impact: 'critical', subKind: 'groundfish' },
  { id: 'fish-gulf-alaska', name: '阿拉斯加湾渔场', layerId: 'fisheries', lng: -145.0, lat: 58.0, note: '鲑鱼、蟹类与底栖鱼类', impact: 'high', subKind: 'groundfish' },
  { id: 'fish-biscay', name: '比斯开湾渔场', layerId: 'fisheries', lng: -5.0, lat: 46.0, note: '大西洋东北部重要渔场', impact: 'medium', subKind: 'groundfish' },
  { id: 'fish-yellow-sea', name: '黄海-东海渔场', layerId: 'fisheries', lng: 123.0, lat: 35.0, note: '中国近海传统渔场，过度捕捞与休渔管理', impact: 'high', subKind: 'coastal' },
  { id: 'fish-scs', name: '南海渔场', layerId: 'fisheries', lng: 112.0, lat: 14.0, note: '热带珊瑚礁与近海渔业，主权争议海域', impact: 'high', subKind: 'coastal' },
  { id: 'fish-somali', name: '索马里上升流渔场', layerId: 'fisheries', lng: 48.0, lat: 8.0, note: '季风驱动上升流，金枪鱼与远洋渔业', impact: 'medium', subKind: 'pelagic' },
  { id: 'fish-benguela-sardine', name: '本格拉沙丁鱼渔场', layerId: 'fisheries', lng: 14.0, lat: -28.0, note: '纳米比亚与南非沿岸沙丁鱼与鳀鱼', impact: 'high', subKind: 'pelagic' },
  { id: 'fish-new-england', name: '新英格兰近海渔场', layerId: 'fisheries', lng: -69.0, lat: 42.0, note: '美国东北海岸龙虾与底栖鱼类', impact: 'medium', subKind: 'groundfish' },
  { id: 'fish-iceland', name: '冰岛鳕鱼渔场', layerId: 'fisheries', lng: -20.0, lat: 65.0, note: '北大西洋鳕鱼，配额管理严格', impact: 'high', subKind: 'groundfish' },
  { id: 'fish-norwegian', name: '挪威海渔场', layerId: 'fisheries', lng: 5.0, lat: 68.0, note: '鲱鱼与鳕鱼，北欧渔业核心', impact: 'high', subKind: 'groundfish' },
  { id: 'fish-patagonia', name: '巴塔哥尼亚大陆架', layerId: 'fisheries', lng: -62.0, lat: -48.0, note: '阿根廷鱿鱼与底栖鱼类', impact: 'medium', subKind: 'groundfish' },
  { id: 'fish-falkland', name: '福克兰群岛鱿鱼渔场', layerId: 'fisheries', lng: -58.0, lat: -52.0, note: '西南大西洋鱿鱼重要产区', impact: 'medium', subKind: 'pelagic' },
  { id: 'fish-wpac-tuna', name: '西太平洋金枪鱼渔场', layerId: 'fisheries', lng: 155.0, lat: 5.0, note: '热带太平洋金枪鱼围网与延绳钓', impact: 'critical', subKind: 'pelagic' },
  { id: 'fish-indian-tuna', name: '印度洋金枪鱼渔场', layerId: 'fisheries', lng: 72.0, lat: -5.0, note: '马尔代夫与斯里兰卡近海延绳钓', impact: 'high', subKind: 'pelagic' },
  { id: 'fish-mediterranean', name: '地中海沙丁鱼渔场', layerId: 'fisheries', lng: 12.0, lat: 38.0, note: '过度捕捞严重，资源衰退', impact: 'medium', subKind: 'coastal' },
  { id: 'fish-gulf-guinea', name: '几内亚湾渔场', layerId: 'fisheries', lng: 4.0, lat: 4.0, note: '西非沿岸小型渔业与非法捕捞问题', impact: 'medium', subKind: 'coastal' },
  { id: 'fish-antarctic-krill', name: '南极磷虾渔场（CCAMLR）', layerId: 'fisheries', lng: -45.0, lat: -62.0, note: '南极海洋生物资源养护公约管理区', impact: 'high', subKind: 'pelagic' },
  { id: 'fish-okhotsk', name: '鄂霍次克海渔场', layerId: 'fisheries', lng: 148.0, lat: 52.0, note: '俄罗斯远东蟹类与鲑鱼', impact: 'high', subKind: 'groundfish' },
  { id: 'fish-tasman', name: '塔斯曼海渔场', layerId: 'fisheries', lng: 160.0, lat: -42.0, note: '澳新之间底栖鱼类与龙虾', impact: 'medium', subKind: 'groundfish' },
];

/** 季风气候带 — 12 处锚点 */
export const GLOBAL_MONSOON: OceanPoint[] = [
  { id: 'mon-so-asia-sw', name: '南亚西南季风区', layerId: 'monsoon', lng: 78.0, lat: 15.0, note: '6–9 月西南季风带来丰沛降水，影响印度农业', impact: 'critical', subKind: 'summer' },
  { id: 'mon-so-asia-ne', name: '南亚东北季风区', layerId: 'monsoon', lng: 82.0, lat: 18.0, note: '10–3 月干燥东北季风，孟加拉湾转向', impact: 'high', subKind: 'winter' },
  { id: 'mon-ea-summer', name: '东亚夏季季风区', layerId: 'monsoon', lng: 118.0, lat: 28.0, note: '5–8 月梅雨与台风季，中国东部降水主源', impact: 'critical', subKind: 'summer' },
  { id: 'mon-ea-winter', name: '东亚冬季季风区', layerId: 'monsoon', lng: 125.0, lat: 35.0, note: '11–3 月偏北季风，黄海渤海寒潮', impact: 'high', subKind: 'winter' },
  { id: 'mon-aus-nw', name: '澳大利亚西北季风区', layerId: 'monsoon', lng: 125.0, lat: -15.0, note: '11–4 月湿季，北澳热带草原降水', impact: 'high', subKind: 'summer' },
  { id: 'mon-wafrica', name: '西非季风区（Sahel）', layerId: 'monsoon', lng: -5.0, lat: 12.0, note: '6–9 月 ITCZ 北移带来雨季，萨赫勒带', impact: 'critical', subKind: 'summer' },
  { id: 'mon-nam', name: '北美季风区', layerId: 'monsoon', lng: -110.0, lat: 28.0, note: '7–9 月墨西哥与美国西南部雷暴降水', impact: 'medium', subKind: 'summer' },
  { id: 'mon-amazon', name: '亚马逊湿季区', layerId: 'monsoon', lng: -60.0, lat: -5.0, note: '12–5 月赤道南半球雨季，亚马孙河汛', impact: 'high', subKind: 'summer' },
  { id: 'mon-maritime', name: '海洋大陆季风区', layerId: 'monsoon', lng: 115.0, lat: 2.0, note: '印尼-马来群岛季风与对流降水', impact: 'high', subKind: 'year_round' },
  { id: 'mon-arabian-onset', name: '阿拉伯海季风爆发区', layerId: 'monsoon', lng: 65.0, lat: 12.0, note: '6 月初季风爆发，索马里急流形成', impact: 'high', subKind: 'summer' },
  { id: 'mon-phil-habagat', name: '菲律宾 habagat 西南季风', layerId: 'monsoon', lng: 122.0, lat: 12.0, note: '5–10 月西南季风，台风与洪涝', impact: 'high', subKind: 'summer' },
  { id: 'mon-iod', name: '印度洋偶极子影响区', layerId: 'monsoon', lng: 90.0, lat: -5.0, note: 'IOD 正/负位相影响东非与澳洲降水异常', impact: 'high', subKind: 'year_round' },
];

/** 大气环流概念带 — 12 处锚点 */
export const GLOBAL_ATMOSPHERIC_CIRCULATION: OceanPoint[] = [
  { id: 'atmo-itcz', name: '赤道辐合带（ITCZ）', layerId: 'atmospheric_circulation', lng: -30.0, lat: 5.0, note: '南北半球信风交汇上升区，全球降水最大带', impact: 'critical', subKind: 'itcz' },
  { id: 'atmo-trade-ne', name: '东北信风带', layerId: 'atmospheric_circulation', lng: -40.0, lat: 18.0, note: '北半球副热带高压向赤道吹送的稳定东风', impact: 'high', subKind: 'trade_wind' },
  { id: 'atmo-trade-se', name: '东南信风带', layerId: 'atmospheric_circulation', lng: -150.0, lat: -15.0, note: '南半球信风，驱动太平洋赤道洋流', impact: 'high', subKind: 'trade_wind' },
  { id: 'atmo-subtrop-high-na', name: '北大西洋副热带高压', layerId: 'atmospheric_circulation', lng: -35.0, lat: 32.0, note: '亚速尔高压，影响欧洲与美洲天气型', impact: 'high', subKind: 'subtropical_high' },
  { id: 'atmo-subtrop-high-sp', name: '南太平洋副热带高压', layerId: 'atmospheric_circulation', lng: -140.0, lat: -28.0, note: '南太平洋稳定高压，影响澳洲东部干旱', impact: 'medium', subKind: 'subtropical_high' },
  { id: 'atmo-polar-jet', name: '极锋急流', layerId: 'atmospheric_circulation', lng: 0.0, lat: 55.0, note: '温带锋面系统主通道，影响跨大西洋航班与风暴', impact: 'critical', subKind: 'jet_stream' },
  { id: 'atmo-subtrop-jet', name: '副热带急流', layerId: 'atmospheric_circulation', lng: 140.0, lat: 35.0, note: '亚洲西风急流，影响东亚梅雨与台风路径', impact: 'high', subKind: 'jet_stream' },
  { id: 'atmo-hadley-ascend', name: '哈德利环流上升支', layerId: 'atmospheric_circulation', lng: -60.0, lat: 0.0, note: '赤道强烈对流上升，驱动信风与 ITCZ', impact: 'high', subKind: 'hadley' },
  { id: 'atmo-polar-cell', name: '极地环流下沉支', layerId: 'atmospheric_circulation', lng: 0.0, lat: 75.0, note: '极地高压与极地东风带形成机制', impact: 'medium', subKind: 'polar' },
  { id: 'atmo-walker-pac', name: '沃克环流（太平洋）', layerId: 'atmospheric_circulation', lng: 160.0, lat: 0.0, note: '赤道太平洋东西向环流，厄尔尼诺/拉尼娜核心', impact: 'critical', subKind: 'walker' },
  { id: 'atmo-aleutian-low', name: '阿留申低压', layerId: 'atmospheric_circulation', lng: -175.0, lat: 52.0, note: '冬季北太平洋主要低压中心，影响北美西海岸', impact: 'high', subKind: 'semi_permanent' },
  { id: 'atmo-siberian-high', name: '西伯利亚高压（冬季）', layerId: 'atmospheric_circulation', lng: 100.0, lat: 55.0, note: '最强大陆性高压，驱动东亚冬季季风', impact: 'critical', subKind: 'semi_permanent' },
];

/** 深海探索里程碑 — 24 处 */
export const GLOBAL_DEEP_EXPLORATION: OceanPoint[] = [
  { id: 'deep-challenger', name: '挑战者深渊（马里亚纳）', layerId: 'deep_exploration', lng: 142.2, lat: 11.3, note: '全球最深点约 10984m，多次载人/无人深潜', impact: 'critical', subKind: 'trench' },
  { id: 'deep-epr-vents', name: '东太平洋海隆热液喷口', layerId: 'deep_exploration', lng: -104.0, lat: 9.0, note: '黑烟囱硫化物热液生态系统，Alvin 多次考察', impact: 'critical', subKind: 'hydrothermal' },
  { id: 'deep-cameron-2012', name: '詹姆斯·卡梅隆深潜（2012）', layerId: 'deep_exploration', lng: 142.2, lat: 11.3, note: '单人潜水器 Deepsea Challenger 抵达挑战者深渊', impact: 'high', subKind: 'manned' },
  { id: 'deep-jiaolong', name: '中国「蛟龙」号 7000m 级', layerId: 'deep_exploration', lng: 125.0, lat: 25.0, note: '2012 年马里亚纳 7062m，中国首个载人深潜器', impact: 'critical', subKind: 'manned' },
  { id: 'deep-fendouzhe', name: '中国「奋斗者」号 10909m', layerId: 'deep_exploration', lng: 142.2, lat: 11.3, note: '2020 年万米载人深潜器抵达马里亚纳', impact: 'critical', subKind: 'manned' },
  { id: 'deep-trieste-1960', name: '的里雅斯特号（1960）', layerId: 'deep_exploration', lng: 142.2, lat: 11.3, note: '人类首次抵达挑战者深渊，皮卡德父子', impact: 'critical', subKind: 'manned' },
  { id: 'deep-kaiko', name: '日本 Kaiko ROV', layerId: 'deep_exploration', lng: 142.2, lat: 11.3, note: '1995 年无人深潜器抵达海底，后于台风中遗失', impact: 'high', subKind: 'rov' },
  { id: 'deep-shinkai6500', name: '日本「深海 6500」', layerId: 'deep_exploration', lng: 135.0, lat: 32.0, note: '6500m 级载人潜水器，日本海洋研究开发机构', impact: 'high', subKind: 'manned' },
  { id: 'deep-alvin', name: '美国 Alvin DSV', layerId: 'deep_exploration', lng: -44.0, lat: 32.0, note: '4500m 级载人潜水器，发现热液喷口与泰坦尼克', impact: 'critical', subKind: 'manned' },
  { id: 'deep-lost-city', name: '失落之城热液场', layerId: 'deep_exploration', lng: -30.0, lat: 30.0, note: '大西洋慢速扩张脊碳酸盐热液烟囱，独特生态系统', impact: 'high', subKind: 'hydrothermal' },
  { id: 'deep-mar-ridge', name: '大西洋中脊热液区', layerId: 'deep_exploration', lng: -29.0, lat: 36.0, note: 'TAG 热液田等，深海采矿与生物勘探热点', impact: 'high', subKind: 'hydrothermal' },
  { id: 'deep-puerto-rico', name: '波多黎各海沟', layerId: 'deep_exploration', lng: -66.0, lat: 19.5, note: '大西洋最深海沟约 8400m', impact: 'high', subKind: 'trench' },
  { id: 'deep-java', name: '爪哇海沟', layerId: 'deep_exploration', lng: 110.0, lat: -10.0, note: '印度洋-太平洋俯冲带，深源地震频发', impact: 'high', subKind: 'trench' },
  { id: 'deep-kermadec', name: '克马德克海沟', layerId: 'deep_exploration', lng: -177.0, lat: -32.0, note: '西南太平洋深俯冲带，10000m 级深度', impact: 'high', subKind: 'trench' },
  { id: 'deep-tonga', name: '汤加海沟', layerId: 'deep_exploration', lng: -175.0, lat: -23.0, note: '全球第二深海沟，2022 年火山喷发关联俯冲', impact: 'critical', subKind: 'trench' },
  { id: 'deep-philippine', name: '菲律宾海沟', layerId: 'deep_exploration', lng: 126.0, lat: 12.0, note: '西太平洋最深海沟之一约 10500m', impact: 'high', subKind: 'trench' },
  { id: 'deep-south-sandwich', name: '南桑威奇海沟', layerId: 'deep_exploration', lng: -26.0, lat: -55.0, note: '南大西洋唯一深海沟，南极绕极流影响', impact: 'medium', subKind: 'trench' },
  { id: 'deep-peru-chile', name: '秘鲁-智利海沟', layerId: 'deep_exploration', lng: -74.0, lat: -22.0, note: '东太平洋俯冲带，深源地震与海啸源', impact: 'high', subKind: 'trench' },
  { id: 'deep-shenhai', name: '中国「深海勇士」号', layerId: 'deep_exploration', lng: 110.0, lat: 18.0, note: '4500m 级载人潜水器，南海科考主力', impact: 'high', subKind: 'manned' },
  { id: 'deep-who', name: '伍兹霍尔海洋研究所', layerId: 'deep_exploration', lng: -70.7, lat: 41.5, note: 'Alvin 与 Jason ROV 运营基地，深海科学重镇', impact: 'high', subKind: 'institution' },
  { id: 'deep-schmidt', name: 'Schmidt 海洋研究所', layerId: 'deep_exploration', lng: -122.4, lat: 37.8, note: 'R/V Falkor 等科考船，全球深海测绘', impact: 'medium', subKind: 'institution' },
  { id: 'deep-nereid', name: 'Nereid Under Ice 任务', layerId: 'deep_exploration', lng: -45.0, lat: 78.0, note: '2014 年格陵兰冰下海域无人探测', impact: 'medium', subKind: 'rov' },
  { id: 'deep-okeanos', name: 'NOAA Okeanos Explorer', layerId: 'deep_exploration', lng: -157.0, lat: 21.0, note: '美国国家海洋大气局深海勘探船，全球遥操作', impact: 'high', subKind: 'institution' },
  { id: 'deep-rv-kexue', name: '中国「科学」号科考船', layerId: 'deep_exploration', lng: 120.0, lat: 30.0, note: '中科院海洋所，西太平洋深海科考与潜器母船', impact: 'high', subKind: 'institution' },
];

/** 全部海洋点要素（不含洋流路径） */
export const GLOBAL_OCEAN_POINTS: OceanPoint[] = [
  ...GLOBAL_MARINE_ARCHAEOLOGY,
  ...GLOBAL_FISHERIES,
  ...GLOBAL_MONSOON,
  ...GLOBAL_ATMOSPHERIC_CIRCULATION,
  ...GLOBAL_DEEP_EXPLORATION,
];
