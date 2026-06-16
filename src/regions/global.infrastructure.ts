/**
 * 全球关键基础设施档案 — 航空枢纽 / 海运要道 / 海底光缆登陆点
 *
 * 均为公开地理事实（非时效、非敏感军事坐标），坐标为机场/港口/登陆站的公开近似位置。
 * 用于「基础设施」类图层的全局底图，由 /api/geodata 按区域边界过滤后上屏。
 * 来源：公开航空/港口/电信资料汇总。整理日：2026-06-16
 */

import type { ImpactLevel, LayerId } from '@/types/geo';
import { DENSIFY_INFRA } from './global.layers-densify-r2';

export interface InfraPoint {
  id: string;
  name: string;
  layerId: Extract<LayerId, 'aviation' | 'maritime' | 'cables'>;
  lng: number;
  lat: number;
  note: string;
  impact: ImpactLevel;
}

/** 航空枢纽 · 全球主要国际机场（客货吞吐量领先） */
const AVIATION: InfraPoint[] = [
  { id: 'air-atl', name: '亚特兰大 ATL', layerId: 'aviation', lng: -84.43, lat: 33.64, note: '全球客流量最高机场之一', impact: 'high' },
  { id: 'air-dxb', name: '迪拜 DXB', layerId: 'aviation', lng: 55.36, lat: 25.25, note: '中东超级枢纽 · 国际客流领先', impact: 'high' },
  { id: 'air-lhr', name: '伦敦希思罗 LHR', layerId: 'aviation', lng: -0.45, lat: 51.47, note: '西欧主要国际门户', impact: 'high' },
  { id: 'air-pkx', name: '北京大兴 PKX', layerId: 'aviation', lng: 116.41, lat: 39.51, note: '华北超大型枢纽', impact: 'high' },
  { id: 'air-pvg', name: '上海浦东 PVG', layerId: 'aviation', lng: 121.81, lat: 31.14, note: '中国货运量最大机场', impact: 'high' },
  { id: 'air-hnd', name: '东京羽田 HND', layerId: 'aviation', lng: 139.78, lat: 35.55, note: '东亚客流核心', impact: 'high' },
  { id: 'air-lax', name: '洛杉矶 LAX', layerId: 'aviation', lng: -118.41, lat: 33.94, note: '北美西岸门户', impact: 'high' },
  { id: 'air-sin', name: '新加坡樟宜 SIN', layerId: 'aviation', lng: 103.99, lat: 1.36, note: '东南亚转运枢纽', impact: 'high' },
  { id: 'air-ist', name: '伊斯坦布尔 IST', layerId: 'aviation', lng: 28.74, lat: 41.26, note: '欧亚之间中转枢纽', impact: 'high' },
  { id: 'air-cdg', name: '巴黎戴高乐 CDG', layerId: 'aviation', lng: 2.55, lat: 49.01, note: '西欧主要枢纽', impact: 'medium' },
  { id: 'air-jfk', name: '纽约肯尼迪 JFK', layerId: 'aviation', lng: -73.78, lat: 40.64, note: '北美东岸国际门户', impact: 'medium' },
  { id: 'air-icn', name: '首尔仁川 ICN', layerId: 'aviation', lng: 126.45, lat: 37.46, note: '东北亚转运枢纽', impact: 'medium' },
  { id: 'air-gru', name: '圣保罗瓜鲁柳斯 GRU', layerId: 'aviation', lng: -46.47, lat: -23.43, note: '南美最大航空枢纽', impact: 'medium' },
  { id: 'air-fra', name: '法兰克福 FRA', layerId: 'aviation', lng: 8.57, lat: 50.04, note: '欧洲货运与中转核心', impact: 'medium' },
  { id: 'air-pek', name: '北京首都 PEK', layerId: 'aviation', lng: 116.6, lat: 40.08, note: '中国政治中心航空门户', impact: 'high' },
  { id: 'air-cgk', name: '雅加达 CGK', layerId: 'aviation', lng: 106.65, lat: -6.12, note: '东南亚人口大国枢纽', impact: 'medium' },
  { id: 'air-bkk', name: '曼谷 BKK', layerId: 'aviation', lng: 100.75, lat: 13.69, note: '东南亚旅游与中转中心', impact: 'medium' },
  { id: 'air-doh', name: '多哈 DOH', layerId: 'aviation', lng: 51.61, lat: 25.26, note: '卡塔尔航空全球枢纽', impact: 'high' },
  { id: 'air-ams', name: '阿姆斯特丹 AMS', layerId: 'aviation', lng: 4.76, lat: 52.31, note: '欧洲货运与 KLM 枢纽', impact: 'high' },
  { id: 'air-mex', name: '墨西哥城 MEX', layerId: 'aviation', lng: -99.07, lat: 19.44, note: '拉美高海拔主要枢纽', impact: 'medium' },
  { id: 'air-del', name: '德里 DEL', layerId: 'aviation', lng: 77.1, lat: 28.56, note: '南亚最大航空市场', impact: 'medium' },
  { id: 'air-mel', name: '墨尔本 MEL', layerId: 'aviation', lng: 144.84, lat: -37.67, note: '澳新南部门户', impact: 'medium' },
  { id: 'air-muc', name: '慕尼黑 MUC', layerId: 'aviation', lng: 11.79, lat: 48.35, note: '汉莎二级枢纽', impact: 'medium' },
];

/** 海运要道 · 全球主要港口与海上咽喉 */
const MARITIME: InfraPoint[] = [
  { id: 'sea-shanghai', name: '上海港', layerId: 'maritime', lng: 121.5, lat: 30.62, note: '全球集装箱吞吐量第一', impact: 'high' },
  { id: 'sea-ningbo', name: '宁波舟山港', layerId: 'maritime', lng: 122.07, lat: 29.95, note: '全球货物吞吐量领先', impact: 'high' },
  { id: 'sea-singapore', name: '新加坡港', layerId: 'maritime', lng: 103.85, lat: 1.26, note: '全球转运枢纽', impact: 'high' },
  { id: 'sea-rotterdam', name: '鹿特丹港', layerId: 'maritime', lng: 4.4, lat: 51.95, note: '欧洲最大港口', impact: 'high' },
  { id: 'str-hormuz', name: '霍尔木兹海峡', layerId: 'maritime', lng: 56.4, lat: 26.57, note: '全球石油海运咽喉（约 1/5 原油过境）', impact: 'critical' },
  { id: 'str-malacca', name: '马六甲海峡', layerId: 'maritime', lng: 100.4, lat: 2.5, note: '东亚能源与贸易生命线', impact: 'critical' },
  { id: 'str-suez', name: '苏伊士运河', layerId: 'maritime', lng: 32.35, lat: 30.5, note: '欧亚海运捷径', impact: 'critical' },
  { id: 'str-bab', name: '曼德海峡', layerId: 'maritime', lng: 43.33, lat: 12.58, note: '红海—亚丁湾咽喉', impact: 'critical' },
  { id: 'str-panama', name: '巴拿马运河', layerId: 'maritime', lng: -79.92, lat: 9.08, note: '美洲两洋通道', impact: 'high' },
  { id: 'str-bosphorus', name: '博斯普鲁斯海峡', layerId: 'maritime', lng: 29.06, lat: 41.12, note: '黑海唯一出海口', impact: 'high' },
  { id: 'str-gibraltar', name: '直布罗陀海峡', layerId: 'maritime', lng: -5.5, lat: 35.97, note: '地中海—大西洋门户', impact: 'high' },
  { id: 'str-taiwan', name: '台湾海峡', layerId: 'maritime', lng: 119.5, lat: 24.5, note: '东亚关键航运通道', impact: 'high' },
  { id: 'sea-la', name: '洛杉矶/长滩港', layerId: 'maritime', lng: -118.21, lat: 33.74, note: '北美最大集装箱门户', impact: 'medium' },
  { id: 'sea-busan', name: '釜山港', layerId: 'maritime', lng: 129.04, lat: 35.1, note: '东北亚转运与集装箱枢纽', impact: 'high' },
  { id: 'sea-dubai', name: '杰贝阿里港', layerId: 'maritime', lng: 55.07, lat: 25.0, note: '中东最大集装箱港', impact: 'high' },
  { id: 'sea-hamburg', name: '汉堡港', layerId: 'maritime', lng: 9.97, lat: 53.54, note: '德国最大海港，中欧门户', impact: 'high' },
  { id: 'sea-antwerp', name: '安特卫普港', layerId: 'maritime', lng: 4.4, lat: 51.23, note: '欧洲第二大港，化工与集装箱', impact: 'high' },
  { id: 'sea-colombo', name: '科伦坡港', layerId: 'maritime', lng: 79.85, lat: 6.94, note: '印度洋转运与补给枢纽', impact: 'medium' },
  { id: 'sea-santos', name: '桑托斯港', layerId: 'maritime', lng: -46.33, lat: -23.96, note: '拉美最大港口，大豆出口', impact: 'high' },
  { id: 'sea-manila', name: '马尼拉港', layerId: 'maritime', lng: 120.95, lat: 14.58, note: '菲律宾主要集装箱门户', impact: 'medium' },
  { id: 'sea-vladivostok', name: '符拉迪沃斯托克港', layerId: 'maritime', lng: 131.89, lat: 43.12, note: '俄罗斯太平洋最大港口', impact: 'medium' },
  { id: 'sea-odessa', name: '敖德萨港', layerId: 'maritime', lng: 30.73, lat: 46.48, note: '黑海粮食与物资出口关键港', impact: 'high' },
  { id: 'str-dover', name: '英吉利海峡', layerId: 'maritime', lng: 1.5, lat: 50.9, note: '欧洲最繁忙海运通道之一', impact: 'high' },
  { id: 'str-lombok', name: '龙目海峡', layerId: 'maritime', lng: 116.0, lat: -8.5, note: '马六甲替代航线', impact: 'medium' },
];

/** 海底光缆 · 全球主要登陆点 / 通信枢纽 */
const CABLES: InfraPoint[] = [
  { id: 'cab-marseille', name: '马赛 · 地中海光缆枢纽', layerId: 'cables', lng: 5.35, lat: 43.3, note: '欧洲—亚非主要登陆点', impact: 'high' },
  { id: 'cab-alexandria', name: '亚历山大/塞得港 · SMW 走廊', layerId: 'cables', lng: 29.92, lat: 31.2, note: '欧亚海缆经埃及陆桥过境', impact: 'critical' },
  { id: 'cab-singapore', name: '新加坡 · 海缆枢纽', layerId: 'cables', lng: 103.7, lat: 1.27, note: '亚太海缆汇聚中心', impact: 'high' },
  { id: 'cab-hongkong', name: '香港 · 海缆登陆站', layerId: 'cables', lng: 114.1, lat: 22.25, note: '东亚区域通信枢纽', impact: 'high' },
  { id: 'cab-fujairah', name: '富查伊拉 · 海缆登陆', layerId: 'cables', lng: 56.33, lat: 25.12, note: '中东—南亚海缆要冲', impact: 'high' },
  { id: 'cab-mumbai', name: '孟买 · 海缆登陆站', layerId: 'cables', lng: 72.83, lat: 19.08, note: '南亚国际通信门户', impact: 'medium' },
  { id: 'cab-fortaleza', name: '福塔莱萨 · 跨大西洋登陆', layerId: 'cables', lng: -38.52, lat: -3.72, note: '南美—欧/非海缆枢纽', impact: 'medium' },
  { id: 'cab-virginia', name: '弗吉尼亚海滩 · 跨大西洋登陆', layerId: 'cables', lng: -75.98, lat: 36.85, note: '北美东岸主要登陆点', impact: 'medium' },
  { id: 'cab-sines', name: '锡尼什/里斯本 · 海缆登陆', layerId: 'cables', lng: -8.87, lat: 37.95, note: '欧洲西南海缆门户', impact: 'medium' },
  { id: 'cab-guam', name: '关岛 · 太平洋海缆枢纽', layerId: 'cables', lng: 144.79, lat: 13.46, note: '跨太平洋海缆中继要地', impact: 'high' },
  { id: 'cab-shanghai', name: '上海 · 崇明/南汇登陆站', layerId: 'cables', lng: 121.8, lat: 31.2, note: 'TPE/NCP 等跨太平洋海缆登陆', impact: 'high' },
  { id: 'cab-qingdao', name: '青岛 · 海缆登陆站', layerId: 'cables', lng: 120.3, lat: 36.1, note: 'TPE 等亚太—美洲走廊北端登陆', impact: 'medium' },
  { id: 'cab-taipei', name: '台北 · 海缆登陆站', layerId: 'cables', lng: 121.5, lat: 25.0, note: 'PLCN/APCN 等环亚太海缆节点', impact: 'high' },
  { id: 'cab-tokyo', name: '东京/千叶 · 海缆枢纽', layerId: 'cables', lng: 140.0, lat: 35.6, note: 'JUPITER/FASTER 等跨太平洋汇聚', impact: 'high' },
  { id: 'cab-busan', name: '釜山 · 海缆登陆站', layerId: 'cables', lng: 129.0, lat: 35.1, note: 'NCP/TPE 等韩日—美洲走廊', impact: 'medium' },
  { id: 'cab-chennai', name: '金奈 · 海缆登陆站', layerId: 'cables', lng: 80.3, lat: 13.1, note: 'SMW/SEACOM 等南亚东岸门户', impact: 'medium' },
  { id: 'cab-perth', name: '珀斯 · 海缆登陆站', layerId: 'cables', lng: 115.8, lat: -32.0, note: 'INDIGO/Southern Cross 等澳西门户', impact: 'medium' },
  { id: 'cab-sydney', name: '悉尼 · 海缆登陆站', layerId: 'cables', lng: 151.2, lat: -33.9, note: 'INDIGO/Hawaiki 等澳新走廊', impact: 'medium' },
  { id: 'cab-la', name: '洛杉矶/埃尔塞贡多 · 登陆站', layerId: 'cables', lng: -118.4, lat: 33.9, note: 'PLCN/Unity 等跨太平洋西岸枢纽', impact: 'high' },
  { id: 'cab-djibouti', name: '吉布提 · 红海海缆枢纽', layerId: 'cables', lng: 43.15, lat: 11.6, note: 'EASSy/PEACE 等东非—欧亚走廊', impact: 'high' },
  { id: 'cab-cape-town', name: '开普敦 · 海缆登陆站', layerId: 'cables', lng: 18.4, lat: -34.0, note: 'SEACOM/Safe 等南非国际出口', impact: 'medium' },
  { id: 'cab-karachi', name: '卡拉奇 · PEACE 登陆站', layerId: 'cables', lng: 67.0, lat: 24.8, note: '中巴走廊海缆西端门户', impact: 'medium' },
  { id: 'cab-nyc', name: '纽约/长岛 · 跨大西洋登陆', layerId: 'cables', lng: -73.95, lat: 40.58, note: 'AC-1/TAT-14 等北美东岸枢纽', impact: 'high' },
  { id: 'cab-miami', name: '迈阿密 · 海缆登陆站', layerId: 'cables', lng: -80.12, lat: 25.78, note: 'BRUSA/Monet 等南美—北美走廊', impact: 'medium' },
  { id: 'cab-bilbao', name: '毕尔巴鄂 · 跨大西洋登陆', layerId: 'cables', lng: -2.93, lat: 43.35, note: 'MAREA 等跨大西洋西端门户', impact: 'medium' },
  { id: 'cab-brest', name: '布雷斯特/勒波尔热 · 登陆站', layerId: 'cables', lng: -4.48, lat: 48.38, note: 'Amitié/Dunant 等跨大西洋法端', impact: 'medium' },
  { id: 'cab-london', name: '伦敦/布德 · 海缆登陆', layerId: 'cables', lng: -0.55, lat: 51.45, note: 'FLAG/TAT-14/2Africa 等欧洲枢纽', impact: 'high' },
  { id: 'cab-dublin', name: '都柏林 · 海缆登陆站', layerId: 'cables', lng: -6.15, lat: 53.35, note: 'Hibernia Express 等跨大西洋爱尔兰端', impact: 'medium' },
  { id: 'cab-portland', name: '波特兰/波士顿 · 登陆站', layerId: 'cables', lng: -70.25, lat: 43.66, note: 'Amitié 等新英格兰跨大西洋出口', impact: 'medium' },
  { id: 'cab-jeddah', name: '吉达 · 红海海缆枢纽', layerId: 'cables', lng: 39.17, lat: 21.48, note: 'SMW/IMEWE/AAE-1 等红海走廊', impact: 'high' },
  { id: 'cab-manila', name: '马尼拉 · 海缆登陆站', layerId: 'cables', lng: 120.98, lat: 14.55, note: 'SEA-US/JUPITER 等菲国门户', impact: 'medium' },
  { id: 'cab-jakarta', name: '雅加达 · 海缆登陆站', layerId: 'cables', lng: 106.85, lat: -6.12, note: 'SJC/INDIGO 等印尼走廊', impact: 'medium' },
  { id: 'cab-melbourne', name: '墨尔本 · 海缆登陆站', layerId: 'cables', lng: 144.95, lat: -37.85, note: 'INDIGO 等澳东南门户', impact: 'medium' },
  { id: 'cab-auckland', name: '奥克兰 · 海缆登陆站', layerId: 'cables', lng: 174.78, lat: -36.87, note: 'Hawaiki/Southern Cross 等新西兰出口', impact: 'medium' },
  { id: 'cab-santos', name: '桑托斯 · 海缆登陆站', layerId: 'cables', lng: -46.33, lat: -23.95, note: 'SAM-1/Monet 等巴西东南门户', impact: 'medium' },
  { id: 'cab-rio', name: '里约热内卢 · 海缆登陆', layerId: 'cables', lng: -43.17, lat: -22.9, note: '南美东海岸区域海缆节点', impact: 'medium' },
  { id: 'cab-lagos', name: '拉各斯 · 西非海缆枢纽', layerId: 'cables', lng: 3.4, lat: 6.45, note: 'WACS/ACE 等西非国际出口', impact: 'high' },
  { id: 'cab-mombasa', name: '蒙巴萨 · 东非海缆枢纽', layerId: 'cables', lng: 39.67, lat: -4.05, note: 'SEACOM/EASSy/PEACE 等东非门户', impact: 'high' },
  { id: 'cab-maputo', name: '马普托 · 海缆登陆站', layerId: 'cables', lng: 32.58, lat: -25.97, note: 'EASSy/WACS 等南非东岸节点', impact: 'medium' },
  { id: 'cab-hawaii', name: '夏威夷 · 太平洋中继站', layerId: 'cables', lng: -157.0, lat: 21.0, note: '跨太平洋海缆中继枢纽', impact: 'high' },
  { id: 'cab-ho-chi-minh', name: '胡志明市 · 海缆登陆站', layerId: 'cables', lng: 106.7, lat: 10.8, note: 'AAG/APG 等越南门户', impact: 'medium' },
  { id: 'cab-darwin', name: '达尔文 · 北澳海缆登陆', layerId: 'cables', lng: 130.84, lat: -12.46, note: 'INDIGO 等澳北走廊', impact: 'medium' },
  { id: 'cab-marseille2', name: '马赛/土伦 · 地中海枢纽', layerId: 'cables', lng: 5.93, lat: 43.12, note: '2Africa/SEA-ME-WE 等汇聚', impact: 'high' },
  { id: 'cab-valparaiso', name: '瓦尔帕莱索 · 智利海缆登陆', layerId: 'cables', lng: -71.62, lat: -33.05, note: '南美太平洋岸通信出口', impact: 'medium' },
  { id: 'cab-casablanca', name: '卡萨布兰卡 · 西非海缆枢纽', layerId: 'cables', lng: -7.62, lat: 33.6, note: '2Africa/ACE 等摩洛哥门户', impact: 'medium' },
  { id: 'cab-naples', name: '那不勒斯 · 地中海登陆站', layerId: 'cables', lng: 14.25, lat: 40.84, note: 'MedNautilus 等意大利走廊', impact: 'medium' },
  { id: 'cab-piraeus', name: '比雷埃夫斯 · 海缆登陆', layerId: 'cables', lng: 23.64, lat: 37.94, note: '欧亚海缆希腊门户', impact: 'medium' },
  { id: 'cab-haifa', name: '海法 · 东地中海登陆', layerId: 'cables', lng: 34.99, lat: 32.82, note: '中东—欧洲走廊节点', impact: 'medium' },
  { id: 'cab-colombo', name: '科伦坡 · 印度洋海缆枢纽', layerId: 'cables', lng: 79.85, lat: 6.94, note: 'SEA-ME-WE/2Africa 等交汇', impact: 'high' },
];

export const GLOBAL_INFRASTRUCTURE: InfraPoint[] = [
  ...AVIATION,
  ...MARITIME,
  ...CABLES,
  ...DENSIFY_INFRA,
];
