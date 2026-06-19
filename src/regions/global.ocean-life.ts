/**
 * 海洋生态与海底奇观图层数据 — 珊瑚礁 / 海洋生物分布 / 海底奇观 / 迁徙路线
 *
 * 公开海洋地理与生态资料，坐标为区域中心或路径**示意**，非精确勘测边界。整理日：2026-06-19
 */

import type { OceanPoint, OceanCurrentRoute } from '@/regions/global.ocean';

/** 重要珊瑚礁盘 — 全球代表性珊瑚礁系统 */
export const GLOBAL_CORAL_REEFS: OceanPoint[] = [
  { id: 'reef-gbr', name: '大堡礁', layerId: 'coral_reefs', lng: 147.7, lat: -18.3, note: '世界最大珊瑚礁系统，跨约 2300km，世界自然遗产', impact: 'critical', subKind: 'barrier' },
  { id: 'reef-redsea', name: '红海珊瑚礁', layerId: 'coral_reefs', lng: 35.0, lat: 24.5, note: '高温高盐下的耐热珊瑚，抗白化研究热点', impact: 'high', subKind: 'fringing' },
  { id: 'reef-mesoamerican', name: '中美洲堡礁', layerId: 'coral_reefs', lng: -87.8, lat: 17.5, note: '西半球最大堡礁，含伯利兹大蓝洞', impact: 'high', subKind: 'barrier' },
  { id: 'reef-coral-triangle', name: '珊瑚大三角', layerId: 'coral_reefs', lng: 123.0, lat: -2.0, note: '印尼-菲-巴新海域，全球珊瑚物种最丰富中心', impact: 'critical', subKind: 'biodiversity' },
  { id: 'reef-maldives', name: '马尔代夫环礁', layerId: 'coral_reefs', lng: 73.2, lat: 3.2, note: '典型环礁群，受海平面上升与白化威胁', impact: 'high', subKind: 'atoll' },
  { id: 'reef-newcaledonia', name: '新喀里多尼亚堡礁', layerId: 'coral_reefs', lng: 165.5, lat: -21.5, note: '世界第二长堡礁，世界自然遗产', impact: 'medium', subKind: 'barrier' },
  { id: 'reef-papahanaumokuakea', name: '帕帕哈瑙莫夸基亚', layerId: 'coral_reefs', lng: -176.0, lat: 25.5, note: '夏威夷西北群岛，世界最大海洋保护区之一', impact: 'high', subKind: 'atoll' },
  { id: 'reef-chagos', name: '查戈斯群岛礁', layerId: 'coral_reefs', lng: 72.4, lat: -6.0, note: '印度洋大型海洋保护区，珊瑚恢复参照地', impact: 'medium', subKind: 'atoll' },
  { id: 'reef-aldabra', name: '阿尔达布拉环礁', layerId: 'coral_reefs', lng: 46.3, lat: -9.4, note: '塞舌尔，世界自然遗产，巨龟与原生礁盘', impact: 'medium', subKind: 'atoll' },
  { id: 'reef-southchina', name: '南海珊瑚礁群', layerId: 'coral_reefs', lng: 114.0, lat: 10.0, note: '南沙-黄岩岛一带造礁珊瑚，生态与权益交汇', impact: 'high', subKind: 'atoll' },
  { id: 'reef-florida-keys', name: '佛罗里达礁岛群', layerId: 'coral_reefs', lng: -80.5, lat: 24.7, note: '北美唯一堡礁，珊瑚修复（鹿角珊瑚）重点区', impact: 'medium', subKind: 'barrier' },
  { id: 'reef-rainbow-fiji', name: '斐济彩虹礁', layerId: 'coral_reefs', lng: 179.9, lat: -16.8, note: '以软珊瑚著称，南太平洋潜水胜地', impact: 'medium', subKind: 'fringing' },
];

/** 海洋生物分布 — 标志性物种聚集/保护区 */
export const GLOBAL_MARINE_LIFE: OceanPoint[] = [
  { id: 'life-bluewhale-srilanka', name: '蓝鲸 · 斯里兰卡外海', layerId: 'marine_life', lng: 80.5, lat: 5.9, note: '全球少有的近岸蓝鲸常年出没海域', impact: 'high', subKind: 'whale' },
  { id: 'life-humpback-tonga', name: '座头鲸繁育区 · 汤加', layerId: 'marine_life', lng: -174.0, lat: -21.1, note: '南太座头鲸越冬繁殖与育幼海域', impact: 'medium', subKind: 'whale' },
  { id: 'life-greatwhite-sa', name: '大白鲨 · 南非甘斯拜', layerId: 'marine_life', lng: 19.4, lat: -34.6, note: '大白鲨聚集观测地（受海洋变化影响波动）', impact: 'medium', subKind: 'shark' },
  { id: 'life-whaleshark-philippines', name: '鲸鲨 · 菲律宾东萨马', layerId: 'marine_life', lng: 125.5, lat: 11.5, note: '鲸鲨季节性聚集，生态旅游与保护焦点', impact: 'medium', subKind: 'shark' },
  { id: 'life-hammerhead-galapagos', name: '锤头鲨 · 加拉帕戈斯', layerId: 'marine_life', lng: -91.0, lat: -0.4, note: '海洋保护区，锤头鲨与海洋巨型动物群', impact: 'high', subKind: 'shark' },
  { id: 'life-turtle-costarica', name: '海龟产卵 · 哥斯达黎加', layerId: 'marine_life', lng: -85.7, lat: 10.9, note: '橄榄绿海龟集群产卵（arribada）海滩', impact: 'medium', subKind: 'turtle' },
  { id: 'life-kingcrab-bering', name: '帝王蟹 · 白令海', layerId: 'marine_life', lng: -170.0, lat: 58.0, note: '阿拉斯加帝王蟹渔业与种群监测区', impact: 'medium', subKind: 'crustacean' },
  { id: 'life-seaotter-california', name: '海獭 · 加州中部', layerId: 'marine_life', lng: -121.9, lat: 36.5, note: '南方海獭恢复区，海藻林关键物种', impact: 'medium', subKind: 'mammal' },
  { id: 'life-krill-antarctic', name: '南极磷虾 · 南大洋', layerId: 'marine_life', lng: -45.0, lat: -62.0, note: '南极食物网基石，鲸/企鹅/海豹依赖', impact: 'high', subKind: 'krill' },
  { id: 'life-spermwhale-azores', name: '抹香鲸 · 亚速尔', layerId: 'marine_life', lng: -28.0, lat: 38.5, note: '深海抹香鲸常年观测海域', impact: 'medium', subKind: 'whale' },
  { id: 'life-dugong-gbr', name: '儒艮 · 大堡礁海草床', layerId: 'marine_life', lng: 146.0, lat: -19.5, note: '依赖海草床的濒危海洋哺乳动物', impact: 'medium', subKind: 'mammal' },
];

/** 海底奇观 — 标志性海底地貌与自然奇景 */
export const GLOBAL_UNDERSEA_WONDERS: OceanPoint[] = [
  { id: 'wonder-blue-hole', name: '伯利兹大蓝洞', layerId: 'undersea_wonders', lng: -87.53, lat: 17.32, note: '直径约 300m 的海底竖井，世界著名潜点', impact: 'high', subKind: 'sinkhole' },
  { id: 'wonder-mariana', name: '马里亚纳海沟 · 挑战者深渊', layerId: 'undersea_wonders', lng: 142.2, lat: 11.35, note: '地球最深处约 -10935m', impact: 'critical', subKind: 'trench' },
  { id: 'wonder-lost-city', name: '"失落之城"热液区', layerId: 'undersea_wonders', lng: -42.1, lat: 30.1, note: '大西洋中脊碱性热液烟囱群，生命起源研究地', impact: 'high', subKind: 'hydrothermal' },
  { id: 'wonder-loihi', name: '罗希海底火山', layerId: 'undersea_wonders', lng: -155.27, lat: 18.92, note: '夏威夷东南正在成长的海底火山', impact: 'medium', subKind: 'volcano' },
  { id: 'wonder-galapagos-rift', name: '加拉帕戈斯裂谷热泉', layerId: 'undersea_wonders', lng: -86.2, lat: 0.8, note: '1977 年首次发现深海热液生态系统', impact: 'high', subKind: 'hydrothermal' },
  { id: 'wonder-silfra', name: '丝浮拉裂缝', layerId: 'undersea_wonders', lng: -65.0, lat: 64.26, note: '冰岛欧美板块交界处的清澈裂缝（示意经度）', impact: 'low', subKind: 'rift' },
  { id: 'wonder-yonaguni', name: '与那国岛海底地形', layerId: 'undersea_wonders', lng: 123.0, lat: 24.44, note: '日本与那国外海阶梯状海底岩体（成因有争议）', impact: 'low', subKind: 'formation' },
  { id: 'wonder-brothers', name: '红海兄弟岛', layerId: 'undersea_wonders', lng: 34.83, lat: 26.32, note: '陡峭礁壁与沉船，世界级潜水点', impact: 'medium', subKind: 'reef_wall' },
  { id: 'wonder-tonga-volcano', name: '洪阿哈阿帕伊海底火山', layerId: 'undersea_wonders', lng: -175.39, lat: -20.55, note: '2022 年剧烈喷发的海底火山', impact: 'high', subKind: 'volcano' },
  { id: 'wonder-monterey-canyon', name: '蒙特雷海底峡谷', layerId: 'undersea_wonders', lng: -122.0, lat: 36.7, note: '深度可比大峡谷的近岸海底峡谷', impact: 'medium', subKind: 'canyon' },
];

/** 迁徙路线 — 标志性海洋动物洄游/迁徙通道（示意路径） */
export const GLOBAL_MIGRATION_ROUTES: OceanCurrentRoute[] = [
  {
    id: 'mig-graywhale',
    name: '灰鲸 · 东太平洋迁徙',
    coordinates: [[-168, 62], [-150, 50], [-130, 40], [-118, 30], [-114, 27]],
    note: '白令海/楚科奇海觅食区 ↔ 下加利福尼亚潟湖繁殖区，单程约 8000km',
    impact: 'high',
    direction: '秋冬南下 / 春季北上',
  },
  {
    id: 'mig-humpback-eastaus',
    name: '座头鲸 · 东澳迁徙',
    coordinates: [[152, -42], [153, -32], [152, -25], [147, -18]],
    note: '南极觅食区 ↔ 大堡礁外海繁殖区，沿澳东岸"鲸之路"',
    impact: 'medium',
    direction: '冬季北上 / 夏季南下',
  },
  {
    id: 'mig-leatherback',
    name: '棱皮龟 · 跨太平洋',
    coordinates: [[130, -2], [160, 8], [-180, 20], [-150, 32], [-124, 38]],
    note: '印尼产卵地 ↔ 北美西岸水母觅食区，跨太平洋最长爬行动物迁徙',
    impact: 'high',
    direction: '东向觅食 / 西向产卵',
  },
  {
    id: 'mig-bluefin-tuna',
    name: '大西洋蓝鳍金枪鱼',
    coordinates: [[-88, 26], [-60, 36], [-30, 40], [-6, 36], [10, 38]],
    note: '墨西哥湾/地中海产卵区 ↔ 北大西洋觅食区的跨洋洄游',
    impact: 'high',
    direction: '跨大西洋往返',
  },
  {
    id: 'mig-european-eel',
    name: '欧洲鳗 · 马尾藻海',
    coordinates: [[-58, 26], [-45, 35], [-25, 43], [-8, 46], [2, 48]],
    note: '马尾藻海产卵 ↔ 欧洲河流，幼鳗随湾流漂移数千公里',
    impact: 'medium',
    direction: '幼体东向 / 成体西向产卵',
  },
  {
    id: 'mig-whaleshark-indian',
    name: '鲸鲨 · 印度洋',
    coordinates: [[73, 6], [85, -2], [100, -10], [115, -19]],
    note: '随浮游生物季节聚集在印度洋多个热点间移动',
    impact: 'medium',
    direction: '季节性east-west',
  },
];
