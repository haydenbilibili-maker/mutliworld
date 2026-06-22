/**
 * 全球主要油气田 / 含油气盆地 — 油气储藏图层公开态势整理
 *
 * 坐标为代表性示意点；储量口径为公开资料量级估算（非实时探明储量）。
 * 整理日：2026-06-17
 */

import type { ImpactLevel } from '@/types/geo';
import { DENSIFY_HYDROCARBON_R3 } from './global.layers-densify-r3';

export type HydrocarbonResourceType = '石油' | '天然气' | '油气';
export type HydrocarbonReserveTier = 'mega' | 'large' | 'medium';
export type HydrocarbonStatus = '生产中' | '开发中' | '战略储备';

export interface HydrocarbonReserveSite {
  id: string;
  name: string;
  nameZh: string;
  type: HydrocarbonResourceType;
  estimatedReserves: string;
  country: string;
  status: HydrocarbonStatus;
  reserveTier: HydrocarbonReserveTier;
  lng: number;
  lat: number;
  note: string;
  impact: ImpactLevel;
}

function tierImpact(tier: HydrocarbonReserveTier): ImpactLevel {
  if (tier === 'mega') return 'critical';
  if (tier === 'large') return 'high';
  return 'medium';
}

function site(
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
  return {
    id,
    name,
    nameZh,
    type,
    estimatedReserves,
    country,
    status,
    reserveTier,
    lng,
    lat,
    note,
    impact: tierImpact(reserveTier),
  };
}

export const GLOBAL_HYDROCARBON_RESERVES: HydrocarbonReserveSite[] = [
  site('hc-ghawar', '加瓦尔油田', 'Ghawar Field', '石油', '约 700–800 亿桶可采', '沙特阿拉伯', '生产中', 'mega', 49.0, 23.5, '全球最大陆上油田，沙特产能支柱'),
  site('hc-burgan', '布尔甘油田', 'Burgan Field', '石油', '约 650–700 亿桶', '科威特', '生产中', 'mega', 47.7, 29.0, '科威特主力油田，海湾产能核心'),
  site('hc-rumaila', '鲁迈拉油田', 'Rumaila Field', '石油', '约 170 亿桶以上', '伊拉克', '生产中', 'mega', 47.0, 30.5, '伊拉克最大油田，巴士拉以北'),
  site('hc-permian', '二叠纪盆地', 'Permian Basin', '油气', '约 400+ 亿桶油当量', '美国', '生产中', 'mega', -102.5, 31.5, '美国页岩革命核心，全球短期边际供应'),
  site('hc-orinoco', '奥里诺科重油带', 'Orinoco Belt', '石油', '约 2,600 亿桶原地', '委内瑞拉', '生产中', 'mega', -64.0, 8.5, '超重油资源，出口与制裁高度相关'),
  site('hc-west-siberia', '西西伯利亚盆地', 'West Siberian Basin', '油气', '约 400+ 亿桶油当量', '俄罗斯', '生产中', 'mega', 73.0, 61.0, '俄罗斯油气主产区，管道出口枢纽'),
  site('hc-athabasca', '阿萨巴斯卡油砂', 'Athabasca Oil Sands', '石油', '约 1,700 亿桶可采', '加拿大', '生产中', 'mega', -111.0, 57.0, '油砂开采，北美重质油供应'),
  site('hc-north-dome', '北方气田', 'North Field / North Dome', '天然气', '约 900 Tcf 原地', '卡塔尔', '生产中', 'mega', 51.5, 26.5, '全球最大非伴生气田，LNG 出口核心'),
  site('hc-south-pars', '南帕尔斯气田', 'South Pars Field', '天然气', '约 500 Tcf 可采', '伊朗', '生产中', 'mega', 52.5, 27.0, '与卡塔尔共属北方气田，波斯湾气源'),
  site('hc-safaniya', '萨法尼亚海上油田', 'Safaniya Field', '石油', '约 360 亿桶', '沙特阿拉伯', '生产中', 'mega', 49.5, 27.8, '全球最大海上油田'),
  site('hc-galkynysh', '加尔金内什气田', 'Galkynysh Field', '天然气', '约 700 Tcf 原地', '土库曼斯坦', '生产中', 'mega', 59.5, 37.5, '中亚对华管道气重要来源'),
  site('hc-kashagan', '卡沙甘油田', 'Kashagan Field', '石油', '约 130 亿桶可采', '哈萨克斯坦', '生产中', 'large', 51.5, 44.5, '里海超深高压油田，产能爬坡中'),
  site('hc-tengiz', '田吉兹油田', 'Tengiz Field', '油气', '约 90 亿桶油当量', '哈萨克斯坦', '生产中', 'large', 53.0, 46.5, '里海西岸主力，雪佛龙运营'),
  site('hc-north-sea', '北海油田群', 'North Sea Fields', '油气', '累计约 400+ 亿桶', '挪威/英国', '生产中', 'large', 2.5, 58.0, '布伦特定价基准历史产区'),
  site('hc-johan-sverdrup', '约翰·斯韦德鲁普油田', 'Johan Sverdrup', '石油', '约 27 亿桶可采', '挪威', '生产中', 'large', 2.0, 58.5, '北海最大在产新油田'),
  site('hc-prudhoe', '普拉德霍湾', 'Prudhoe Bay', '石油', '约 250 亿桶累计', '美国（阿拉斯加）', '生产中', 'large', -148.5, 70.3, '北美最大油田，北极管线出口'),
  site('hc-gom', '墨西哥湾深水', 'Gulf of Mexico Deepwater', '油气', '数十亿桶级在产', '美国', '生产中', 'large', -90.5, 27.0, '深水平台与飓风风险区'),
  site('hc-bakken', '巴肯页岩', 'Bakken Formation', '石油', '约 300+ 亿桶原地', '美国', '生产中', 'large', -103.0, 47.5, '页岩油主产区之一'),
  site('hc-eagle-ford', '鹰福特页岩', 'Eagle Ford Shale', '油气', '约 200+ 亿桶油当量', '美国', '生产中', 'large', -98.5, 28.5, '德州南部页岩油气带'),
  site('hc-campos', '坎普斯盆地', 'Campos Basin', '石油', '数十亿桶在产', '巴西', '生产中', 'large', -40.5, -22.0, '巴西近海主力产区'),
  site('hc-santos-presalt', '桑托斯盐下层', 'Santos Pre-salt', '石油', '约 150 亿桶可采', '巴西', '生产中', 'large', -44.0, -25.5, '盐下层深水，巴西国家石油战略'),
  site('hc-niger-delta', '尼日尔三角洲', 'Niger Delta', '油气', '约 370 亿桶油当量', '尼日利亚', '生产中', 'large', 6.5, 5.0, '非洲最大产油区，管道盗损风险'),
  site('hc-angola-offshore', '安哥拉海上', 'Angola Offshore Blocks', '石油', '数十亿桶在产', '安哥尔', '生产中', 'large', 12.0, -8.0, '深水 FPSO 集群'),
  site('hc-azer-chirag', '阿塞里—奇拉格油田', 'Azeri-Chirag-Gunashli', '石油', '约 60 亿桶可采', '阿塞拜疆', '生产中', 'large', 50.0, 40.5, '里海 BTC 管线起点'),
  site('hc-kharg', '哈尔克岛出口枢纽', 'Kharg Island Hub', '石油', '战略出口设施', '伊朗', '生产中', 'large', 50.3, 29.2, '波斯湾原油外运关键节点'),
  site('hc-hormuz-strait', '霍尔木兹海峡油气通道', 'Strait of Hormuz Transit', '油气', '全球约 20% 海运油气', '国际水道', '生产中', 'large', 56.5, 26.5, '海湾油气外运咽喉，地缘溢价敏感'),
  site('hc-yamal-lng', '亚马尔 LNG', 'Yamal LNG', '天然气', '约 16.5 Mtpa 产能', '俄罗斯', '生产中', 'large', 70.0, 71.0, '北极 LNG 出口，北方航道关联'),
  site('hc-karachaganak', '卡拉恰甘纳克', 'Karachaganak Field', '油气', '约 120 亿桶油当量', '哈萨克斯坦', '生产中', 'large', 53.5, 51.0, '凝析油气田，欧俄管道过境'),
  site('hc-rub-al-khali', '鲁卜哈利盆地', 'Rub al Khali Basin', '油气', '约 500+ 亿桶油当量', '沙特/阿联酋', '生产中', 'large', 52.0, 20.0, '空季度盆地，沙特阿美/ADNOC 主力区'),
  site('hc-scs-liyue', '礼乐滩油气区', 'Reed Bank / Liyue Tan', '油气', '争议区潜在储量', '南海', '开发中', 'medium', 116.8, 11.0, '中菲声索重叠，勘探权争端'),
  site('hc-scs-wanan', '万安滩区块', 'Vanguard Bank Blocks', '油气', '争议区潜在储量', '南海', '开发中', 'medium', 109.5, 7.5, '中越主张重叠海域'),
  site('hc-ecs-chunxiao', '春晓油气田', 'Chunxiao / Shirakaba', '天然气', '约 200–300 Bcf', '东海', '生产中', 'medium', 125.5, 29.0, '中日中间线附近，主权与开发权分歧'),
  site('hc-timor-sea', '帝汶海油气', 'Timor Sea Fields', '油气', '约 40 亿桶油当量', '东帝汶/澳大利亚', '生产中', 'medium', 127.0, -10.5, '帝汶海收入基金来源'),
  site('hc-libya-sirte', '苏尔特盆地', 'Sirte Basin', '石油', '约 480 亿桶原地', '利比亚', '开发中', 'large', 17.0, 29.0, '政局动荡影响产能恢复'),
  site('hc-algeria-hassi', '哈西迈萨乌德', 'Hassi Messaoud', '石油', '约 120 亿桶累计', '阿尔及利亚', '生产中', 'large', 6.0, 31.5, '北非最大油田，向欧洲供气'),
  ...DENSIFY_HYDROCARBON_R3,
];
