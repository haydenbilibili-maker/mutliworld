/**
 * 第三轮增密 · 全球主题/战略图层扩展（2026-06-22）
 *
 * 本轮聚焦薄弱静态事实图层的信息密度提升：
 *  - world_heritage（世界遗产）：补亚非拉与欧洲遗漏遗产
 *  - minerals（关键矿产）：补稀土/铜/铀/钛/钨/石墨/铂金等战略矿产
 *  - datacenters（数据中心）：补中东/拉美/印度/非洲/亚太算力枢纽
 *  - garrisons（海外军事基地）：补吉布提多国基地、中亚、非洲、南海岛礁
 *  - hydrocarbon（油气储藏）：补页岩油气、深海、北极、非常规油气田
 *
 * 所有条目为公开资料示意坐标，非精确/实时数据。
 */

import type { ThematicPoint } from './global.thematic';
import type { GarrisonBase } from './global.garrisons';
import type { HydrocarbonReserveSite, HydrocarbonResourceType, HydrocarbonStatus, HydrocarbonReserveTier } from './global.hydrocarbon';
import type { ImpactLevel } from '@/types/geo';

// ───────────────────────────────────────────────────────────────
// world_heritage 增密（亚非拉与欧洲遗漏遗产）
// ───────────────────────────────────────────────────────────────
export const DENSIFY_WORLD_HERITAGE_R3: ThematicPoint[] = [
  { id: 'r3-wh-machu', name: '马丘比丘', layerId: 'world_heritage', lng: -72.55, lat: -13.16, note: '秘鲁 · 1983 · 印加帝国云端古城', impact: 'critical', subKind: 'mixed' },
  { id: 'r3-wh-teotihuacan', name: '特奥蒂瓦坎', layerId: 'world_heritage', lng: -98.84, lat: 19.69, note: '墨西哥 · 1987 · 太阳与月亮金字塔', impact: 'high', subKind: 'cultural' },
  { id: 'r3-wh-chichen', name: '奇琴伊察', layerId: 'world_heritage', lng: -88.57, lat: 20.68, note: '墨西哥 · 1988 · 玛雅文明遗址', impact: 'high', subKind: 'cultural' },
  { id: 'r3-wh-tikal', name: '蒂卡尔国家公园', layerId: 'world_heritage', lng: -89.62, lat: 17.22, note: '危地马拉 · 1979 · 玛雅城邦遗址', impact: 'medium', subKind: 'mixed' },
  { id: 'r3-wh-cartagena', name: '卡塔赫纳港', layerId: 'world_heritage', lng: -75.55, lat: 10.42, note: '哥伦比亚 · 1984 · 殖民时期要塞城', impact: 'medium', subKind: 'cultural' },
  { id: 'r3-wh-iguazu', name: '伊瓜苏国家公园', layerId: 'world_heritage', lng: -54.44, lat: -25.69, note: '阿根廷/巴西 · 1984 · 壮观瀑布群', impact: 'medium', subKind: 'natural' },
  { id: 'r3-wh-easter', name: '拉帕努伊国家公园（复活节岛）', layerId: 'world_heritage', lng: -109.37, lat: -27.11, note: '智利 · 1995 · 巨石像', impact: 'high', subKind: 'cultural' },
  { id: 'r3-wh-machu-inca', name: '库斯科古城', layerId: 'world_heritage', lng: -71.97, lat: -13.52, note: '秘鲁 · 1983 · 印加帝国首都', impact: 'high', subKind: 'cultural' },
  { id: 'r3-wh-timbuktu', name: '廷巴克图', layerId: 'world_heritage', lng: -3.0, lat: 16.77, note: '马里 · 1988 · 撒哈拉学术与贸易中心', impact: 'high', subKind: 'cultural' },
  { id: 'r3-wh-greatzimbabwe', name: '大津巴布韦遗址', layerId: 'world_heritage', lng: 30.93, lat: -20.27, note: '津巴布韦 · 1986 · 古代石头城邦', impact: 'medium', subKind: 'cultural' },
  { id: 'r3-wh-lalibela', name: '拉利贝拉岩石教堂', layerId: 'world_heritage', lng: 39.05, lat: 12.03, note: '埃塞俄比亚 · 1978 · 岩凿教堂群', impact: 'high', subKind: 'cultural' },
  { id: 'r3-wh-pyramids-meroe', name: '麦罗埃岛考古遗址', layerId: 'world_heritage', lng: 33.72, lat: 16.94, note: '苏丹 · 2011 · 库施王国都城', impact: 'medium', subKind: 'cultural' },
  { id: 'r3-wh-robben', name: '罗本岛', layerId: 'world_heritage', lng: 18.37, lat: -33.8, note: '南非 · 1999 · 曼德拉囚禁地', impact: 'medium', subKind: 'cultural' },
  { id: 'r3-wh-ksar-ait', name: '艾本哈杜古城', layerId: 'world_heritage', lng: -7.13, lat: 31.05, note: '摩洛哥 · 1987 · 沙漠土堡群', impact: 'medium', subKind: 'cultural' },
  { id: 'r3-wh-persepolis', name: '波斯波利斯', layerId: 'world_heritage', lng: 52.89, lat: 29.94, note: '伊朗 · 1979 · 阿契美尼德都城', impact: 'critical', subKind: 'cultural' },
  { id: 'r3-wh-samarra', name: '萨迈拉考古城', layerId: 'world_heritage', lng: 43.88, lat: 34.2, note: '伊拉克 · 2007 · 螺旋塔', impact: 'high', subKind: 'cultural' },
  { id: 'r3-wh-anebdam', name: '巴姆古城与文化景观', layerId: 'world_heritage', lng: 58.37, lat: 29.11, note: '伊朗 · 2004 · 沙漠绿洲泥砖城', impact: 'medium', subKind: 'cultural' },
  { id: 'r3-wh-hampi', name: '汉皮古迹群', layerId: 'world_heritage', lng: 76.46, lat: 15.33, note: '印度 · 1986 · 维查耶纳伽尔都城', impact: 'high', subKind: 'cultural' },
  { id: 'r3-wh-ajanta', name: '阿旃陀石窟', layerId: 'world_heritage', lng: 75.7, lat: 20.55, note: '印度 · 1983 · 佛教石窟壁画', impact: 'high', subKind: 'cultural' },
  { id: 'r3-wh-bagan', name: '蒲甘古城', layerId: 'world_heritage', lng: 94.86, lat: 21.17, note: '缅甸 · 2019 · 万塔之城', impact: 'high', subKind: 'cultural' },
  { id: 'r3-wh-borobudur2', name: '普兰巴南寺', layerId: 'world_heritage', lng: 110.5, lat: -7.75, note: '印尼 · 1991 · 印度教神庙群', impact: 'high', subKind: 'cultural' },
  { id: 'r3-wh-halong', name: '下龙湾', layerId: 'world_heritage', lng: 107.2, lat: 20.86, note: '越南 · 1994 · 喀斯特海景', impact: 'high', subKind: 'natural' },
  { id: 'r3-wh-vatphou', name: '瓦普神庙', layerId: 'world_heritage', lng: 105.82, lat: 14.85, note: '老挝 · 2001 · 高棉遗迹', impact: 'medium', subKind: 'cultural' },
  { id: 'r3-wh-rice', name: '菲律宾科迪勒拉水稻梯田', layerId: 'world_heritage', lng: 121.05, lat: 16.93, note: '菲律宾 · 1995 · 高山梯田', impact: 'medium', subKind: 'cultural' },
  { id: 'r3-wh-kyongju', name: '庆州历史区', layerId: 'world_heritage', lng: 129.22, lat: 35.84, note: '韩国 · 2000 · 新罗都城', impact: 'medium', subKind: 'cultural' },
  { id: 'r3-wh-versailles', name: '凡尔赛宫及园林', layerId: 'world_heritage', lng: 2.12, lat: 48.8, note: '法国 · 1979 · 王室宫殿', impact: 'high', subKind: 'cultural' },
  { id: 'r3-wh-mont', name: '圣米歇尔山', layerId: 'world_heritage', lng: -1.51, lat: 48.64, note: '法国 · 1979 · 海上修道院', impact: 'high', subKind: 'cultural' },
  { id: 'r3-wh-alhambra', name: '阿尔罕布拉宫', layerId: 'world_heritage', lng: -3.59, lat: 37.18, note: '西班牙 · 1984 · 摩尔王朝宫殿', impact: 'high', subKind: 'cultural' },
  { id: 'r3-wh-sagrada', name: '圣家堂', layerId: 'world_heritage', lng: 2.17, lat: 41.4, note: '西班牙巴塞罗那 · 高迪作品', impact: 'high', subKind: 'cultural' },
  { id: 'r3-wh-cordoba', name: '科尔多瓦历史中心', layerId: 'world_heritage', lng: -4.78, lat: 37.88, note: '西班牙 · 1984 · 大清真寺', impact: 'high', subKind: 'cultural' },
  { id: 'r3-wh-pompeii', name: '庞贝与赫库兰尼姆', layerId: 'world_heritage', lng: 14.49, lat: 40.75, note: '意大利 · 1997 · 火山掩埋古城', impact: 'high', subKind: 'cultural' },
  { id: 'r3-wh-florence', name: '佛罗伦萨历史中心', layerId: 'world_heritage', lng: 11.26, lat: 43.77, note: '意大利 · 1982 · 文艺复兴发源地', impact: 'high', subKind: 'cultural' },
  { id: 'r3-wh-venice', name: '威尼斯及潟湖', layerId: 'world_heritage', lng: 12.33, lat: 45.44, note: '意大利 · 1987 · 水上之城', impact: 'high', subKind: 'cultural' },
  { id: 'r3-wh-stonehenge', name: '巨石阵', layerId: 'world_heritage', lng: -1.83, lat: 51.18, note: '英国 · 1986 · 史前巨石遗迹', impact: 'high', subKind: 'cultural' },
  { id: 'r3-wh-westminster', name: '威斯敏斯特宫', layerId: 'world_heritage', lng: -0.12, lat: 51.5, note: '英国伦敦 · 大本钟', impact: 'high', subKind: 'cultural' },
  { id: 'r3-wh-brasilia', name: '巴西利亚', layerId: 'world_heritage', lng: -47.92, lat: -15.78, note: '巴西 · 1987 · 现代主义新城', impact: 'medium', subKind: 'cultural' },
  { id: 'r3-wh-selous', name: '塞卢斯禁猎区', layerId: 'world_heritage', lng: 37.5, lat: -8.5, note: '坦桑尼亚 · 1982 · 非洲最大保护区之一', impact: 'medium', subKind: 'natural' },
  { id: 'r3-wh-komodo', name: '科莫多国家公园', layerId: 'world_heritage', lng: 119.49, lat: -8.55, note: '印尼 · 1991 · 巨蜥栖息地', impact: 'medium', subKind: 'natural' },
  { id: 'r3-wh-cape', name: '好望角保护区（开普植物区）', layerId: 'world_heritage', lng: 18.42, lat: -34.0, note: '南非 · 2004 · 全球最小植物王国', impact: 'medium', subKind: 'natural' },
  { id: 'r3-wh-uluru', name: '乌鲁鲁-卡塔丘塔', layerId: 'world_heritage', lng: 131.04, lat: -25.34, note: '澳大利亚 · 1987 · 原住民圣地', impact: 'high', subKind: 'mixed' },
  { id: 'r3-wh-sydney-opera', name: '悉尼歌剧院', layerId: 'world_heritage', lng: 151.21, lat: -33.86, note: '澳大利亚 · 2007 · 现代建筑杰作', impact: 'medium', subKind: 'cultural' },
];

// ───────────────────────────────────────────────────────────────
// minerals 增密（稀土/铜/铀/钛/钨/石墨/铂金等战略矿产）
// ───────────────────────────────────────────────────────────────
export const DENSIFY_MINERALS_R3: ThematicPoint[] = [
  { id: 'r3-min-ree-bayan-obo', name: '内蒙古白云鄂博 · 稀土', layerId: 'minerals', lng: 109.97, lat: 41.77, note: '全球最大轻稀土矿，占中国稀土储量主体', impact: 'critical', subKind: 'rare_earth' },
  { id: 'r3-min-ree-jiangxi', name: '江西赣州 · 重稀土', layerId: 'minerals', lng: 114.93, lat: 25.83, note: '离子型中重稀土核心产区', impact: 'critical', subKind: 'rare_earth' },
  { id: 'r3-min-mountain-pass', name: '芒廷帕斯 · 稀土', layerId: 'minerals', lng: -115.43, lat: 35.49, note: '美国加州，西方唯一大型稀土矿', impact: 'high', subKind: 'rare_earth' },
  { id: 'r3-min-mt-weld', name: '韦尔德山 · 稀土', layerId: 'minerals', lng: 122.46, lat: -28.83, note: '澳洲西澳，Lynas 主力矿', impact: 'high', subKind: 'rare_earth' },
  { id: 'r3-min-iron-pilbara', name: '皮尔巴拉 · 铁矿', layerId: 'minerals', lng: 118.0, lat: -21.0, note: '澳洲最大铁矿区，全球铁矿石定价锚', impact: 'critical', subKind: 'iron' },
  { id: 'r3-min-iron-carajas', name: '卡拉加斯 · 铁矿', layerId: 'minerals', lng: -50.5, lat: -6.07, note: '巴西淡水河谷世界最大铁矿', impact: 'critical', subKind: 'iron' },
  { id: 'r3-min-copper-escondida', name: '埃斯康迪达 · 铜', layerId: 'minerals', lng: -68.5, lat: -24.27, note: '智利阿塔卡马，全球最大铜矿', impact: 'critical', subKind: 'copper' },
  { id: 'r3-min-copper-chuqui', name: '丘基卡马塔 · 铜', layerId: 'minerals', lng: -68.9, lat: -22.3, note: '智利，全球最大露天铜矿之一', impact: 'critical', subKind: 'copper' },
  { id: 'r3-min-copper-morenci', name: '莫伦西 · 铜', layerId: 'minerals', lng: -109.35, lat: 33.05, note: '美国亚利桑那，北美最大铜矿之一', impact: 'high', subKind: 'copper' },
  { id: 'r3-min-uranium-kazakh', name: '哈萨克斯坦 · 铀矿带', layerId: 'minerals', lng: 68.0, lat: 48.0, note: '全球最大铀生产国，原地浸出', impact: 'critical', subKind: 'uranium' },
  { id: 'r3-min-uranium-olympic', name: '奥林匹克坝 · 铀铜金', layerId: 'minerals', lng: 136.88, lat: -30.47, note: '澳洲南澳，世界最大铀储量矿床', impact: 'critical', subKind: 'uranium' },
  { id: 'r3-min-uranium-cigar', name: '雪茄湖 · 铀', layerId: 'minerals', lng: -109.93, lat: 57.99, note: '加拿大萨省，高品位铀矿', impact: 'high', subKind: 'uranium' },
  { id: 'r3-min-uranium-niger', name: '尼日尔阿尔利特 · 铀', layerId: 'minerals', lng: 7.37, lat: 18.74, note: '西非铀产区，法核电原料来源', impact: 'high', subKind: 'uranium' },
  { id: 'r3-min-nickel-sorowako', name: '索罗瓦科 · 镍', layerId: 'minerals', lng: 121.27, lat: -2.55, note: '印尼苏拉威西，镍铁/不锈钢原料', impact: 'high', subKind: 'nickel' },
  { id: 'r3-min-lithium-pilgangoora', name: '皮尔甘古拉 · 锂', layerId: 'minerals', lng: 119.85, lat: -21.43, note: '西澳硬岩锂矿集群核心', impact: 'high', subKind: 'lithium' },
  { id: 'r3-min-lithium-thacker', name: '萨克帕斯 · 锂', layerId: 'minerals', lng: -117.55, lat: 41.66, note: '美国内华达，黏土型锂矿', impact: 'high', subKind: 'lithium' },
  { id: 'r3-min-tungsten-xianghua', name: '湖南柿竹园 · 钨', layerId: 'minerals', lng: 113.05, lat: 25.77, note: '全球最大钨矿，中国钨储量主导', impact: 'critical', subKind: 'tungsten' },
  { id: 'r3-min-tungsten-mactung', name: 'Mactung · 钨', layerId: 'minerals', lng: -130.37, lat: 62.5, note: '加拿大育空，北美最大未开发钨矿', impact: 'high', subKind: 'tungsten' },
  { id: 'r3-min-titanium-rutile', name: '塞拉利昂金红石 · 钛', layerId: 'minerals', lng: -12.78, lat: 8.46, note: '西非天然金红石（钛白粉/航空合金）', impact: 'high', subKind: 'titanium' },
  { id: 'r3-min-tin-bangka', name: '邦加勿里洞 · 锡', layerId: 'minerals', lng: 106.0, lat: -2.5, note: '印尼，全球主要锡产岛', impact: 'high', subKind: 'tin' },
  { id: 'r3-min-tin-myanmar', name: '佤邦 · 锡', layerId: 'minerals', lng: 99.0, lat: 22.5, note: '缅甸，全球第三大锡矿产地', impact: 'high', subKind: 'tin' },
  { id: 'r3-min-vanadium-panzhihua', name: '攀枝花 · 钒钛', layerId: 'minerals', lng: 101.71, lat: 26.58, note: '中国四川，钒钛磁铁矿核心', impact: 'high', subKind: 'vanadium' },
  { id: 'r3-min-manganese-kalinwezi', name: '加丹加 · 锰', layerId: 'minerals', lng: 27.0, lat: -10.5, note: '刚果（金），钢铁合金原料', impact: 'medium', subKind: 'manganese' },
  { id: 'r3-min-manganese-gabon', name: '莫安达 · 锰', layerId: 'minerals', lng: 13.8, lat: -1.6, note: '加蓬，全球最大锰矿之一', impact: 'high', subKind: 'manganese' },
  { id: 'r3-min-graphite-mozambique', name: '巴拉马 · 石墨', layerId: 'minerals', lng: 34.18, lat: -12.27, note: '莫桑比克，全球最大鳞片石墨矿之一', impact: 'high', subKind: 'graphite' },
  { id: 'r3-min-bauxite-guinea', name: '几内亚 · 铝土矿', layerId: 'minerals', lng: -13.0, lat: 10.0, note: '全球铝土矿储量与出口第一', impact: 'critical', subKind: 'bauxite' },
  { id: 'r3-min-bauxite-weipa', name: '韦帕 · 铝土矿', layerId: 'minerals', lng: 141.87, lat: -12.67, note: '澳洲昆士兰，主要铝土出口港', impact: 'high', subKind: 'bauxite' },
  { id: 'r3-min-diamond-jwaneng', name: '朱瓦能 · 钻石', layerId: 'minerals', lng: 24.69, lat: -25.0, note: '博茨瓦纳，按价值计全球最富钻石矿', impact: 'high', subKind: 'diamond' },
  { id: 'r3-min-gold-grasberg', name: '格拉斯伯格 · 金铜', layerId: 'minerals', lng: 137.11, lat: -4.05, note: '印尼巴布亚，全球最大金矿之一', impact: 'critical', subKind: 'gold' },
  { id: 'r3-min-gold-nevada', name: '内华达金矿带', layerId: 'minerals', lng: -116.85, lat: 40.5, note: '美国，全球主要产金州', impact: 'high', subKind: 'gold' },
];

// ───────────────────────────────────────────────────────────────
// datacenters 增密（中东/拉美/印度/非洲/亚太算力枢纽）
// ───────────────────────────────────────────────────────────────
export const DENSIFY_DATACENTERS_R3: ThematicPoint[] = [
  { id: 'r3-dc-quincy', name: '昆西（华盛顿州）', layerId: 'datacenters', lng: -119.85, lat: 47.23, note: '微软/Intel/戴尔超大规模集群，水电供能', impact: 'high' },
  { id: 'r3-dc-the-dalles', name: '达尔斯（俄勒冈）', layerId: 'datacenters', lng: -121.18, lat: 45.6, note: '谷歌最早超大规模数据中心之一', impact: 'high' },
  { id: 'r3-dc-council-bluffs', name: '康瑟尔布拉夫斯', layerId: 'datacenters', lng: -95.86, lat: 41.26, note: '谷歌爱荷华数据园区', impact: 'high' },
  { id: 'r3-dc-san-antonio', name: '圣安东尼奥（得州）', layerId: 'datacenters', lng: -98.49, lat: 29.42, note: '微软/甲骨文/NSA 核心枢纽', impact: 'high' },
  { id: 'r3-dc-arizona', name: '凤凰城（亚利桑那）', layerId: 'datacenters', lng: -112.07, lat: 33.45, note: 'Switch/微软超大规模园区', impact: 'high' },
  { id: 'r3-dc-iowa', name: '得梅因（爱荷华）', layerId: 'datacenters', lng: -93.61, lat: 41.59, note: 'Meta/苹果/Microsoft 中西部集群', impact: 'medium' },
  { id: 'r3-dc-singapore', name: '新加坡 · 裕廊', layerId: 'datacenters', lng: 103.72, lat: 1.33, note: '亚太枢纽，AWS/Azure/Equinix 集群', impact: 'critical' },
  { id: 'r3-dc-hyderabad', name: '海得拉巴', layerId: 'datacenters', lng: 78.49, lat: 17.39, note: '微软/谷歌/ADATA 印度第二枢纽', impact: 'high' },
  { id: 'r3-dc-chennai2', name: '金奈', layerId: 'datacenters', lng: 80.27, lat: 13.08, note: '印度海岸登陆站与云园区', impact: 'high' },
  { id: 'r3-dc-johor', name: '柔佛（马来西亚）', layerId: 'datacenters', lng: 103.75, lat: 1.49, note: '新加坡溢出的东南亚新枢纽', impact: 'high' },
  { id: 'r3-dc-jakarta', name: '雅加达', layerId: 'datacenters', lng: 106.85, lat: -6.21, note: 'AWS/Azure 印尼区域', impact: 'medium' },
  { id: 'r3-dc-sydney', name: '悉尼', layerId: 'datacenters', lng: 151.21, lat: -33.87, note: 'AWS/Azure 澳新主区域', impact: 'high' },
  { id: 'r3-dc-osaka', name: '大阪', layerId: 'datacenters', lng: 135.5, lat: 34.69, note: 'AWS/GCP 日本备援区', impact: 'high' },
  { id: 'r3-dc-zhangjiakou', name: '张北（河北）', layerId: 'datacenters', lng: 114.88, lat: 41.0, note: '阿里云张北集群，风光供能', impact: 'high' },
  { id: 'r3-dc-guizhou', name: '贵安（贵州）', layerId: 'datacenters', lng: 106.62, lat: 26.55, note: '苹果/腾讯/华为中国南方数据中心', impact: 'high' },
  { id: 'r3-dc-neimeng', name: '和林格尔（内蒙古）', layerId: 'datacenters', lng: 111.82, lat: 40.39, note: '中国「东数西算」枢纽节点', impact: 'high' },
  { id: 'r3-dc-frankfurt2', name: '法兰克福（DE-CIX）', layerId: 'datacenters', lng: 8.68, lat: 50.11, note: '欧洲最大互联网交换点', impact: 'critical' },
  { id: 'r3-dc-stockholm', name: '斯德哥尔摩', layerId: 'datacenters', lng: 18.07, lat: 59.33, note: '北欧低碳数据中心集群', impact: 'medium' },
  { id: 'r3-dc-sao-paulo', name: '圣保罗', layerId: 'datacenters', lng: -46.63, lat: -23.55, note: 'AWS/Azure 拉美主区域', impact: 'high' },
  { id: 'r3-dc-santiago', name: '圣地亚哥（智利）', layerId: 'datacenters', lng: -70.67, lat: -33.45, note: 'Azure/谷歌拉美南区域', impact: 'medium' },
  { id: 'r3-dc-mexico', name: '克雷塔罗（墨西哥）', layerId: 'datacenters', lng: -100.39, lat: 20.59, note: '拉美近岸外包数据中心节点', impact: 'medium' },
  { id: 'r3-dc-dubai', name: '迪拜', layerId: 'datacenters', lng: 55.27, lat: 25.2, note: 'AWS/Azure 中东区域', impact: 'high' },
  { id: 'r3-dc-bahrain', name: '巴林', layerId: 'datacenters', lng: 50.56, lat: 26.23, note: 'AWS 中东首个区域', impact: 'medium' },
  { id: 'r3-dc-riyadh', name: '利雅得', layerId: 'datacenters', lng: 46.72, lat: 24.71, note: '谷歌/阿里云中东新区域', impact: 'high' },
  { id: 'r3-dc-doha', name: '多哈', layerId: 'datacenters', lng: 51.53, lat: 25.29, note: '海湾数字枢纽与 2022 世界杯支撑', impact: 'medium' },
  { id: 'r3-dc-cape-town', name: '开普敦', layerId: 'datacenters', lng: 18.42, lat: -33.92, note: 'AWS 非洲首个区域（af-south-1）', impact: 'high' },
  { id: 'r3-dc-johannesburg', name: '约翰内斯堡', layerId: 'datacenters', lng: 28.04, lat: -26.2, note: 'Azure 非洲南区域', impact: 'medium' },
  { id: 'r3-dc-lagos', name: '拉各斯', layerId: 'datacenters', lng: 3.38, lat: 6.52, note: '西非新兴数据中心与海底光缆登陆', impact: 'medium' },
  { id: 'r3-dc-nairobi', name: '内罗毕', layerId: 'datacenters', lng: 36.82, lat: -1.29, note: '东非科技中心与云节点', impact: 'medium' },
  { id: 'r3-dc-mumbai2', name: '浦那', layerId: 'datacenters', lng: 73.86, lat: 18.52, note: '印度西部数据中心集群', impact: 'medium' },
];

// ───────────────────────────────────────────────────────────────
// garrisons 增密（吉布提多国基地、中亚、非洲、南海岛礁）
// ───────────────────────────────────────────────────────────────
export const DENSIFY_GARRISONS_R3: GarrisonBase[] = [
  // 吉布提多国基地集群（"世界兵营"）
  { id: 'r3-gar-fr-djibouti', name: '法国驻吉布提基地', country: 'france', lng: 42.85, lat: 11.57, role: '法国最大海外军事基地，第5海外混合团', impact: 'high' },
  { id: 'r3-gar-jp-djibouti', name: '日本吉布提基地', country: 'france', lng: 43.15, lat: 11.55, role: '日本首个海外基地（自卫队）', impact: 'medium' },
  { id: 'r3-gar-it-djibouti', name: '意大利巴拉卡军营', country: 'france', lng: 43.15, lat: 11.57, role: '意大利在非洲的军事存在', impact: 'medium' },
  { id: 'r3-gar-de-djibouti', name: '德国吉布提海军设施', country: 'france', lng: 43.15, lat: 11.6, role: '欧盟阿塔兰特反海盗行动支撑点', impact: 'low' },
  { id: 'r3-gar-sa-djibouti', name: '沙特吉布提设施', country: 'france', lng: 43.1, lat: 11.58, role: '也门战争期间的军事存在', impact: 'low' },
  // 美国（补充）
  { id: 'r3-gar-thule', name: '皮图菲克太空基地（图勒）', country: 'us', lng: -68.7, lat: 76.53, role: '美军格陵兰弹道导弹预警雷达', impact: 'high' },
  { id: 'r3-gar-clear', name: '克利尔太空军基地', country: 'us', lng: -149.19, lat: 64.29, role: '阿拉斯加弹道导弹预警雷达', impact: 'high' },
  { id: 'r3-gar-cape-canaveral', name: '卡纳维拉尔角太空军基地', country: 'us', lng: -80.57, lat: 28.39, role: '东海岸航天发射与太空监视', impact: 'high' },
  { id: 'r3-gar-vandenberg', name: '范登堡太空军基地', country: 'us', lng: -120.57, lat: 34.74, role: '西海岸航天发射与导弹试验', impact: 'high' },
  { id: 'r3-gar-pearl', name: '珍珠港-希卡姆联合基地', country: 'us', lng: -157.96, lat: 21.37, role: '太平洋舰队司令部所在地（夏威夷）', impact: 'critical' },
  { id: 'r3-gar-kadena', name: '嘉手纳空军基地', country: 'us', lng: 127.77, lat: 26.36, role: '美军西太平洋最大空军基地（冲绳）', impact: 'critical' },
  { id: 'r3-gar-kunsan', name: '群山空军基地', country: 'us', lng: 126.62, lat: 35.9, role: '美第8战斗机联队驻地（韩国）', impact: 'high' },
  { id: 'r3-gar-camp-humphreys2', name: '乌山空军基地', country: 'us', lng: 127.03, lat: 37.09, role: '美第七航空队指挥所（韩国）', impact: 'high' },
  { id: 'r3-gar-navsupp', name: '萨德博尔海军补给站', country: 'us', lng: 11.83, lat: 53.54, role: '德国（备注）', impact: 'low' },
  { id: 'r3-gar-incirlik', name: '因吉尔利克空军基地', country: 'us', lng: 35.43, lat: 37.0, role: '美军土耳其前沿空军与核武储存点', impact: 'high' },
  { id: 'r3-gar-izmir', name: '伊兹密尔陆军基地', country: 'us', lng: 27.14, lat: 38.42, role: '北约陆地司令部（土耳其）', impact: 'medium' },
  // 俄罗斯（补充）
  { id: 'r3-gar-ru-tartus', name: '塔尔图斯海军基地', country: 'russia', lng: 35.89, lat: 34.89, role: '俄在地中海唯一海军设施（叙利亚）', impact: 'critical' },
  { id: 'r3-gar-ru-khmeimim', name: '赫梅米姆空军基地', country: 'russia', lng: 35.92, lat: 35.4, role: '俄在叙利亚主要空军基地', impact: 'critical' },
  { id: 'r3-gar-ru-kant', name: '坎特空军基地', country: 'russia', lng: 74.51, lat: 42.85, role: '俄在吉尔吉斯斯坦的集体安全条约组织基地', impact: 'high' },
  { id: 'r3-gar-ru-gudauta', name: '古达乌塔军事设施', country: 'russia', lng: 40.56, lat: 43.1, role: '俄在阿布哈兹争议地区的军事存在', impact: 'medium' },
  { id: 'r3-gar-ru-nagurskoye', name: '纳古尔斯科耶北极基地', country: 'russia', lng: 52.48, lat: 80.81, role: '俄在北极 Franz Josef Land 的战略据点', impact: 'high' },
  // 英国（补充）
  { id: 'r3-gar-uk-akrotiri', name: '阿克罗蒂里主权基地', country: 'uk', lng: 32.99, lat: 34.59, role: '英在塞浦路斯主权基地（RAF）', impact: 'high' },
  { id: 'r3-gar-uk-dhekelia', name: '德凯利亚主权基地', country: 'uk', lng: 33.71, lat: 34.96, role: '英在塞浦路斯主权基地（陆军）', impact: 'medium' },
  { id: 'r3-gar-uk-diego', name: '迪戈加西亚（英属）', country: 'uk', lng: 72.41, lat: -7.31, role: '英属印度洋领地，英美共用战略基地', impact: 'critical' },
  { id: 'r3-gar-uk-falklands', name: '芒特普莱森特基地', country: 'uk', lng: -59.22, lat: -51.82, role: '英在福克兰群岛军事基地', impact: 'medium' },
  { id: 'r3-gar-uk-brunei', name: '文莱巴斯基地', country: 'uk', lng: 114.75, lat: 4.7, role: '英军远东丛林训练基地', impact: 'low' },
  // 中国（补充）
  { id: 'r3-gar-cn-woody', name: '永兴岛（西沙）设施', country: 'china', lng: 112.33, lat: 16.84, role: '南海岛礁建设重点，港口与机场', impact: 'high' },
  { id: 'r3-gar-cn-fiery', name: '华阳礁设施', country: 'china', lng: 113.0, lat: 10.0, role: '南沙人工岛礁建设之一', impact: 'medium' },
  { id: 'r3-gar-cn-mischief', name: '美济礁设施', country: 'china', lng: 115.55, lat: 9.9, role: '南沙最大人工岛礁之一', impact: 'high' },
  { id: 'r3-gar-cn-subi', name: '渚碧礁设施', country: 'china', lng: 114.06, lat: 10.93, role: '南沙人工岛礁，跑道与港口', impact: 'high' },
  // 法国（补充）
  { id: 'r3-gar-fr-dakar', name: '达喀尔军事设施', country: 'france', lng: -17.44, lat: 14.69, role: '法国在西非的军事存在（塞内加尔）', impact: 'medium' },
  { id: 'r3-gar-fr-noumea', name: '努美阿军事设施', country: 'france', lng: 166.46, lat: -22.27, role: '法在新喀里多尼亚的太平洋存在', impact: 'low' },
  { id: 'r3-gar-fr-papeete', name: '帕皮提军事设施', country: 'france', lng: -149.57, lat: -17.54, role: '法属波利尼西亚武装部队驻地', impact: 'low' },
  { id: 'r3-gar-fr-reunion', name: '留尼汪军事设施', country: 'france', lng: 55.3, lat: -20.88, role: '法在印度洋南部武装部队（FAZSOI）', impact: 'medium' },
];

// ───────────────────────────────────────────────────────────────
// hydrocarbon 增密（页岩油气、深海、北极、非常规油气田）
// ───────────────────────────────────────────────────────────────
function hydroSite(
  id: string,
  nameZh: string,
  name: string,
  type: HydrocarbonResourceType,
  estimatedReserves: string,
  country: string,
  status: HydrocarbonStatus,
  reserveTier: HydrocarbonReserveTier,
  lng: number,
  lat: number,
  note: string,
): HydrocarbonReserveSite {
  let impact: ImpactLevel = 'medium';
  if (reserveTier === 'mega') impact = 'critical';
  else if (reserveTier === 'large') impact = 'high';
  return { id, name, nameZh, type, estimatedReserves, country, status, reserveTier, lng, lat, note, impact };
}

export const DENSIFY_HYDROCARBON_R3: HydrocarbonReserveSite[] = [
  // 页岩油气（Marcellus/Haynesville 为美国新增页岩气，Permian/Bakken/Eagle Ford 已在基础库）
  hydroSite('r3-hc-marcellus', '马塞勒斯页岩', 'Marcellus Shale', '天然气', '约 7 万亿立方米', '美国', '生产中', 'mega', -78.0, 41.5, '阿巴拉契亚，美国最大页岩气田'),
  hydroSite('r3-hc-haynesville', '海恩斯维尔页岩', 'Haynesville Shale', '天然气', '约 2 万亿立方米', '美国', '生产中', 'large', -93.5, 32.5, '得州/路易斯安那，深层页岩气'),
  // 深海/超深水
  hydroSite('r3-hc-pre-salt', '盐下层油田', 'Pre-Salt Province', '石油', '约 500 亿桶可采', '巴西', '生产中', 'mega', -40.5, -24.5, '大西洋深海盐下层，巴西产能支柱'),
  hydroSite('r3-hc-tupi', '卢拉油田（图皮）', 'Lula Field', '石油', '约 80 亿桶', '巴西', '生产中', 'large', -41.5, -25.0, '盐下层超深水巨型油田'),
  hydroSite('r3-hc-stones', '斯托恩斯油田', 'Stones Project', '石油', '约 4 亿桶', '美国', '生产中', 'medium', -91.5, 26.5, '墨西哥湾超深水（2900m 水深）'),
  hydroSite('r3-hc-guyana', '斯塔布鲁克区块', 'Stabroek Block', '石油', '约 110 亿桶可采', '圭亚那', '开发中', 'mega', -57.0, 7.5, '埃克森圭亚那深水发现，新兴产能'),
  // 北极/高纬
  hydroSite('r3-hc-yamal', '亚马尔半岛气田', 'Yamal Peninsula', '天然气', '约 16 万亿立方米', '俄罗斯', '生产中', 'mega', 70.0, 70.0, '西西伯利亚，俄 LNG 出口核心'),
  hydroSite('r3-hc-gydan', '吉丹半岛气田', 'Gydan Peninsula', '天然气', '约 4 万亿立方米', '俄罗斯', '开发中', 'large', 76.0, 70.5, '北极圈气田群'),
  hydroSite('r3-hc-prirazlomnoye', '普里拉兹洛姆诺耶', 'Prirazlomnoye', '石油', '约 7000 万吨', '俄罗斯', '生产中', 'medium', 57.5, 66.5, '北极首个海上油田（巴伦支海）'),
  hydroSite('r3-hc-snohvit', '斯诺赫维特气田', 'Snøhvit Field', '天然气', '约 1500 亿立方米', '挪威', '生产中', 'large', 20.8, 71.5, '巴伦支海首个 LNG 生产设施'),
  // 中东补充
  hydroSite('r3-hc-shaybah', '谢伊巴油田', 'Shaybah Field', '石油', '约 150 亿桶', '沙特阿拉伯', '生产中', 'mega', 53.0, 22.5, '鲁卜哈利沙漠超级油田'),
  hydroSite('r3-hc-khurais', '库赖斯油田', 'Khurais Field', '石油', '约 200 亿桶', '沙特阿拉伯', '生产中', 'mega', 45.0, 25.0, '沙特第二大油田'),
  hydroSite('r3-hc-west-qurna', '西古尔奈油田', 'West Qurna Field', '石油', '约 250 亿桶', '伊拉克', '生产中', 'mega', 47.5, 31.0, '伊拉克南部巨型油田'),
  hydroSite('r3-hc-majnoon', '马吉努油田', 'Majnoon Field', '石油', '约 380 亿桶', '伊拉克', '生产中', 'mega', 47.5, 30.8, '伊拉克超巨型油田'),
  // 西非/东非/其他
  hydroSite('r3-hc-jubilee', '朱比利油田', 'Jubilee Field', '石油', '约 7 亿桶', '加纳', '生产中', 'large', -2.5, 4.5, '西非新兴深水油田'),
  hydroSite('r3-hc-tanzania-lng', '坦桑尼亚 LNG', 'Tanzania LNG', '天然气', '约 1.2 万亿立方米', '坦桑尼亚', '开发中', 'large', 40.0, -10.0, '东非深海天然气发现'),
  hydroSite('r3-hc-moz-lng', '莫桑比克 LNG', 'Mozambique LNG', '天然气', '约 2.8 万亿立方米', '莫桑比克', '开发中', 'mega', 40.5, -12.0, '鲁伍马盆地，非洲最大 LNG 项目'),
  // 中国补充
  hydroSite('r3-hc-qaidam', '柴达木盆地油气', 'Qaidam Basin', '油气', '约 20 亿吨油当量', '中国', '生产中', 'large', 94.0, 37.5, '青海，中国西部油气区'),
  hydroSite('r3-hc-ordos', '鄂尔多斯盆地', 'Ordos Basin', '天然气', '约 10 万亿立方米', '中国', '生产中', 'mega', 109.0, 38.0, '苏里格等大型致密气田'),
  hydroSite('r3-hc-sichuan-gas', '四川盆地页岩气', 'Sichuan Basin', '天然气', '约 4 万亿立方米', '中国', '生产中', 'mega', 105.0, 30.0, '涪陵等页岩气田，中国页岩气主产区'),
  hydroSite('r3-hc-tarim', '塔里木盆地油气', 'Tarim Basin', '油气', '约 200 亿吨油当量', '中国', '生产中', 'mega', 84.0, 41.0, '新疆，中国最大含油气盆地之一'),
];
