/**
 * 文化与自然遗产图层 — UNESCO 世界遗产名录 + 中国全国重点文物保护单位（国保）
 *
 * 精选真实子集（各类别代表性条目），公开资料整理，坐标为代表性位置「示意」。
 * UNESCO 世界遗产逾 1200 项、中国国保逾 5000 处，此处为精选，可后续增密。整理日：2026-06-19
 */

import type { ThematicPoint } from '@/regions/global.thematic';

/** UNESCO 世界遗产（文化 cultural / 自然 natural / 双重 mixed），全球精选 */
export const GLOBAL_WORLD_HERITAGE: ThematicPoint[] = [
  { id: 'wh-greatwall', name: '长城', layerId: 'world_heritage', lng: 116.02, lat: 40.36, note: '中国 · 1987 列入 · 文化遗产', impact: 'critical', subKind: 'cultural' },
  { id: 'wh-forbiddencity', name: '北京故宫', layerId: 'world_heritage', lng: 116.39, lat: 39.92, note: '中国 · 1987 · 明清皇宫', impact: 'critical', subKind: 'cultural' },
  { id: 'wh-mogao', name: '莫高窟', layerId: 'world_heritage', lng: 94.81, lat: 40.04, note: '中国敦煌 · 1987 · 佛教石窟艺术', impact: 'high', subKind: 'cultural' },
  { id: 'wh-terracotta', name: '秦始皇陵及兵马俑', layerId: 'world_heritage', lng: 109.28, lat: 34.38, note: '中国西安 · 1987', impact: 'high', subKind: 'cultural' },
  { id: 'wh-potala', name: '布达拉宫历史建筑群', layerId: 'world_heritage', lng: 91.12, lat: 29.66, note: '中国拉萨 · 1994', impact: 'high', subKind: 'cultural' },
  { id: 'wh-taishan', name: '泰山', layerId: 'world_heritage', lng: 117.1, lat: 36.25, note: '中国 · 1987 · 双重遗产', impact: 'high', subKind: 'mixed' },
  { id: 'wh-jiuzhaigou', name: '九寨沟', layerId: 'world_heritage', lng: 103.92, lat: 33.2, note: '中国四川 · 1992 · 自然遗产', impact: 'medium', subKind: 'natural' },
  { id: 'wh-tajmahal', name: '泰姬陵', layerId: 'world_heritage', lng: 78.04, lat: 27.17, note: '印度阿格拉 · 1983', impact: 'critical', subKind: 'cultural' },
  { id: 'wh-angkor', name: '吴哥古迹', layerId: 'world_heritage', lng: 103.87, lat: 13.41, note: '柬埔寨 · 1992', impact: 'high', subKind: 'cultural' },
  { id: 'wh-borobudur', name: '婆罗浮屠', layerId: 'world_heritage', lng: 110.2, lat: -7.61, note: '印尼 · 1991 · 佛教大塔', impact: 'high', subKind: 'cultural' },
  { id: 'wh-fuji', name: '富士山', layerId: 'world_heritage', lng: 138.73, lat: 35.36, note: '日本 · 2013 · 文化遗产', impact: 'high', subKind: 'cultural' },
  { id: 'wh-kyoto', name: '古都京都的文化财', layerId: 'world_heritage', lng: 135.77, lat: 35.0, note: '日本 · 1994', impact: 'medium', subKind: 'cultural' },
  { id: 'wh-petra', name: '佩特拉古城', layerId: 'world_heritage', lng: 35.44, lat: 30.33, note: '约旦 · 1985 · 岩凿之城', impact: 'high', subKind: 'cultural' },
  { id: 'wh-giza', name: '吉萨金字塔（孟菲斯及其墓地）', layerId: 'world_heritage', lng: 31.13, lat: 29.98, note: '埃及 · 1979', impact: 'critical', subKind: 'cultural' },
  { id: 'wh-abusimbel', name: '阿布辛贝至菲莱努比亚遗址', layerId: 'world_heritage', lng: 31.63, lat: 22.34, note: '埃及 · 1979', impact: 'medium', subKind: 'cultural' },
  { id: 'wh-serengeti', name: '塞伦盖蒂国家公园', layerId: 'world_heritage', lng: 34.83, lat: -2.33, note: '坦桑尼亚 · 1981 · 自然遗产', impact: 'high', subKind: 'natural' },
  { id: 'wh-victoria-falls', name: '维多利亚瀑布（莫西奥图尼亚）', layerId: 'world_heritage', lng: 25.86, lat: -17.92, note: '赞比亚/津巴布韦 · 1989', impact: 'medium', subKind: 'natural' },
  { id: 'wh-acropolis', name: '雅典卫城', layerId: 'world_heritage', lng: 23.73, lat: 37.97, note: '希腊 · 1987', impact: 'critical', subKind: 'cultural' },
  { id: 'wh-colosseum', name: '罗马历史中心', layerId: 'world_heritage', lng: 12.49, lat: 41.89, note: '意大利 · 1980', impact: 'critical', subKind: 'cultural' },
  { id: 'wh-venice', name: '威尼斯及其潟湖', layerId: 'world_heritage', lng: 12.34, lat: 45.44, note: '意大利 · 1987', impact: 'high', subKind: 'cultural' },
  { id: 'wh-versailles', name: '凡尔赛宫及园林', layerId: 'world_heritage', lng: 2.12, lat: 48.8, note: '法国 · 1979', impact: 'high', subKind: 'cultural' },
  { id: 'wh-paris-seine', name: '巴黎塞纳河岸', layerId: 'world_heritage', lng: 2.34, lat: 48.86, note: '法国 · 1991', impact: 'high', subKind: 'cultural' },
  { id: 'wh-sagrada', name: '高迪建筑群（含圣家堂）', layerId: 'world_heritage', lng: 2.17, lat: 41.4, note: '西班牙巴塞罗那 · 1984', impact: 'high', subKind: 'cultural' },
  { id: 'wh-alhambra', name: '阿尔罕布拉宫', layerId: 'world_heritage', lng: -3.59, lat: 37.18, note: '西班牙格拉纳达 · 1984', impact: 'high', subKind: 'cultural' },
  { id: 'wh-stonehenge', name: '巨石阵', layerId: 'world_heritage', lng: -1.83, lat: 51.18, note: '英国 · 1986', impact: 'high', subKind: 'cultural' },
  { id: 'wh-kremlin', name: '克里姆林宫与红场', layerId: 'world_heritage', lng: 37.62, lat: 55.75, note: '俄罗斯莫斯科 · 1990', impact: 'high', subKind: 'cultural' },
  { id: 'wh-istanbul', name: '伊斯坦布尔历史区', layerId: 'world_heritage', lng: 28.98, lat: 41.01, note: '土耳其 · 1985', impact: 'high', subKind: 'cultural' },
  { id: 'wh-machupicchu', name: '马丘比丘', layerId: 'world_heritage', lng: -72.55, lat: -13.16, note: '秘鲁 · 1983 · 双重遗产', impact: 'critical', subKind: 'mixed' },
  { id: 'wh-chichenitza', name: '奇琴伊察', layerId: 'world_heritage', lng: -88.57, lat: 20.68, note: '墨西哥 · 1988 · 玛雅古城', impact: 'high', subKind: 'cultural' },
  { id: 'wh-grandcanyon', name: '大峡谷国家公园', layerId: 'world_heritage', lng: -112.1, lat: 36.1, note: '美国 · 1979 · 自然遗产', impact: 'high', subKind: 'natural' },
  { id: 'wh-yellowstone', name: '黄石国家公园', layerId: 'world_heritage', lng: -110.5, lat: 44.6, note: '美国 · 1978 · 自然遗产', impact: 'high', subKind: 'natural' },
  { id: 'wh-statue-liberty', name: '自由女神像', layerId: 'world_heritage', lng: -74.04, lat: 40.69, note: '美国 · 1984', impact: 'medium', subKind: 'cultural' },
  { id: 'wh-galapagos', name: '加拉帕戈斯群岛', layerId: 'world_heritage', lng: -90.33, lat: -0.6, note: '厄瓜多尔 · 1978 · 自然遗产', impact: 'high', subKind: 'natural' },
  { id: 'wh-gbr', name: '大堡礁', layerId: 'world_heritage', lng: 147.7, lat: -18.3, note: '澳大利亚 · 1981 · 自然遗产', impact: 'high', subKind: 'natural' },
];

/** 中国全国重点文物保护单位（国保）· 精选 */
export const GLOBAL_CHINA_HERITAGE: ThematicPoint[] = [
  { id: 'ch-tiantan', name: '天坛', layerId: 'china_heritage', lng: 116.41, lat: 39.88, note: '北京 · 明清祭天建筑群', impact: 'high', subKind: '古建筑' },
  { id: 'ch-summer-palace', name: '颐和园', layerId: 'china_heritage', lng: 116.27, lat: 39.99, note: '北京 · 清代皇家园林', impact: 'high', subKind: '古建筑' },
  { id: 'ch-mingtombs', name: '明十三陵', layerId: 'china_heritage', lng: 116.24, lat: 40.25, note: '北京昌平 · 明代帝陵', impact: 'medium', subKind: '陵墓' },
  { id: 'ch-zhoukoudian', name: '周口店北京人遗址', layerId: 'china_heritage', lng: 115.92, lat: 39.68, note: '北京房山 · 古人类遗址', impact: 'high', subKind: '遗址' },
  { id: 'ch-dayanta', name: '大雁塔', layerId: 'china_heritage', lng: 108.96, lat: 34.22, note: '西安 · 唐代砖塔', impact: 'medium', subKind: '古建筑' },
  { id: 'ch-longmen', name: '龙门石窟', layerId: 'china_heritage', lng: 112.47, lat: 34.55, note: '洛阳 · 北魏至唐石窟造像', impact: 'high', subKind: '石窟' },
  { id: 'ch-yungang', name: '云冈石窟', layerId: 'china_heritage', lng: 113.13, lat: 40.11, note: '大同 · 北魏皇家石窟', impact: 'high', subKind: '石窟' },
  { id: 'ch-maijishan', name: '麦积山石窟', layerId: 'china_heritage', lng: 106.0, lat: 34.35, note: '天水 · 泥塑艺术宝库', impact: 'medium', subKind: '石窟' },
  { id: 'ch-dazu', name: '大足石刻', layerId: 'china_heritage', lng: 105.7, lat: 29.7, note: '重庆 · 宋代摩崖造像', impact: 'high', subKind: '石窟' },
  { id: 'ch-leshan', name: '乐山大佛', layerId: 'china_heritage', lng: 103.77, lat: 29.55, note: '四川 · 唐代摩崖大佛', impact: 'high', subKind: '石窟' },
  { id: 'ch-dujiangyan', name: '都江堰', layerId: 'china_heritage', lng: 103.62, lat: 31.0, note: '四川 · 战国水利工程', impact: 'high', subKind: '遗址' },
  { id: 'ch-yinxu', name: '殷墟', layerId: 'china_heritage', lng: 114.31, lat: 36.13, note: '安阳 · 商代都城与甲骨文', impact: 'high', subKind: '遗址' },
  { id: 'ch-sanxingdui', name: '三星堆遗址', layerId: 'china_heritage', lng: 104.2, lat: 31.0, note: '广汉 · 古蜀青铜文明', impact: 'high', subKind: '遗址' },
  { id: 'ch-liangzhu', name: '良渚古城遗址', layerId: 'china_heritage', lng: 119.99, lat: 30.4, note: '杭州 · 新石器晚期都邑', impact: 'high', subKind: '遗址' },
  { id: 'ch-pingyao', name: '平遥古城', layerId: 'china_heritage', lng: 112.18, lat: 37.2, note: '山西 · 明清县城', impact: 'high', subKind: '古建筑' },
  { id: 'ch-sankong', name: '曲阜孔庙孔林孔府', layerId: 'china_heritage', lng: 116.99, lat: 35.59, note: '山东 · 儒家三孔', impact: 'high', subKind: '古建筑' },
  { id: 'ch-wudang', name: '武当山古建筑群', layerId: 'china_heritage', lng: 111.0, lat: 32.4, note: '湖北 · 道教宫观群', impact: 'medium', subKind: '古建筑' },
  { id: 'ch-zhuozheng', name: '拙政园', layerId: 'china_heritage', lng: 120.63, lat: 31.32, note: '苏州 · 江南私家园林', impact: 'medium', subKind: '古建筑' },
  { id: 'ch-chengde', name: '承德避暑山庄', layerId: 'china_heritage', lng: 117.94, lat: 41.0, note: '河北 · 清代皇家行宫', impact: 'high', subKind: '古建筑' },
  { id: 'ch-yingxian', name: '应县木塔（佛宫寺释迦塔）', layerId: 'china_heritage', lng: 113.18, lat: 39.55, note: '山西 · 现存最高木塔', impact: 'high', subKind: '古建筑' },
  { id: 'ch-zhaozhou', name: '赵州桥', layerId: 'china_heritage', lng: 114.77, lat: 37.72, note: '河北 · 隋代敞肩石拱桥', impact: 'medium', subKind: '古建筑' },
  { id: 'ch-tulou', name: '福建土楼', layerId: 'china_heritage', lng: 117.0, lat: 24.6, note: '永定/南靖 · 客家夯土民居', impact: 'medium', subKind: '古建筑' },
  { id: 'ch-kaiping', name: '开平碉楼', layerId: 'china_heritage', lng: 112.6, lat: 22.4, note: '广东 · 中西合璧碉楼群', impact: 'medium', subKind: '古建筑' },
  { id: 'ch-xidi-hongcun', name: '西递宏村', layerId: 'china_heritage', lng: 117.98, lat: 29.9, note: '安徽 · 徽派古村落', impact: 'medium', subKind: '古建筑' },
  { id: 'ch-gulangyu', name: '鼓浪屿', layerId: 'china_heritage', lng: 118.07, lat: 24.45, note: '厦门 · 近代国际社区', impact: 'medium', subKind: '古建筑' },
  { id: 'ch-yueyang', name: '岳阳楼', layerId: 'china_heritage', lng: 113.1, lat: 29.37, note: '湖南 · 江南名楼', impact: 'medium', subKind: '古建筑' },
  { id: 'ch-huanghelou', name: '黄鹤楼', layerId: 'china_heritage', lng: 114.3, lat: 30.55, note: '武汉 · 江南名楼', impact: 'medium', subKind: '古建筑' },
  { id: 'ch-gugong', name: '北京故宫（紫禁城）', layerId: 'china_heritage', lng: 116.39, lat: 39.92, note: '北京 · 明清皇宫（国保第一批）', impact: 'critical', subKind: '古建筑' },
  { id: 'ch-mogao-ch', name: '莫高窟', layerId: 'china_heritage', lng: 94.81, lat: 40.04, note: '敦煌 · 国保第一批石窟', impact: 'high', subKind: '石窟' },
  { id: 'ch-terracotta-ch', name: '秦始皇陵', layerId: 'china_heritage', lng: 109.28, lat: 34.38, note: '西安 · 国保第一批陵墓', impact: 'high', subKind: '陵墓' },
];
