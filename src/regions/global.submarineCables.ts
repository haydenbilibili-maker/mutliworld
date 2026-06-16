/**
 * 全球主要海底光缆系统 — 示意路由航点
 *
 * ⚠ 来源：公开电信/海缆资料汇总（Submarine Cable Map、运营商公告等），
 * 坐标为 WGS84 近似航点，非精确勘测数据，仅供态势示意。
 * 整理日：2026-06-16
 */

import type { ImpactLevel } from '@/types/geo';

export interface SubmarineCableRoute {
  id: string;
  name: string;
  coordinates: [number, number][];
  note: string;
  impact: ImpactLevel;
  /** 设计容量（公开资料） */
  capacity?: string;
  /** 投产/启用年份 */
  year?: number;
  /** 规划/在建海缆 — 地图虚线显示 */
  planned?: boolean;
}

const toRad = (d: number) => (d * Math.PI) / 180;
const toDeg = (r: number) => (r * 180) / Math.PI;

/** 两点间大圆弧插值 — 生成平滑跨洋航点 */
export function greatCircleArc(
  start: [number, number],
  end: [number, number],
  segments = 8,
): [number, number][] {
  const [lng1, lat1] = start;
  const [lng2, lat2] = end;
  const φ1 = toRad(lat1);
  const λ1 = toRad(lng1);
  const φ2 = toRad(lat2);
  const λ2 = toRad(lng2);

  const Δ = 2 * Math.asin(
    Math.sqrt(
      Math.sin((φ2 - φ1) / 2) ** 2 +
        Math.cos(φ1) * Math.cos(φ2) * Math.sin((λ2 - λ1) / 2) ** 2,
    ),
  );

  if (Δ < 1e-10) return [start, end];

  const points: [number, number][] = [];
  for (let i = 0; i <= segments; i++) {
    const f = i / segments;
    const A = Math.sin((1 - f) * Δ) / Math.sin(Δ);
    const B = Math.sin(f * Δ) / Math.sin(Δ);
    const x = A * Math.cos(φ1) * Math.cos(λ1) + B * Math.cos(φ2) * Math.cos(λ2);
    const y = A * Math.cos(φ1) * Math.sin(λ1) + B * Math.cos(φ2) * Math.sin(λ2);
    const z = A * Math.sin(φ1) + B * Math.sin(φ2);
    points.push([toDeg(Math.atan2(y, x)), toDeg(Math.atan2(z, Math.sqrt(x * x + y * y)))]);
  }
  return points;
}

/** 串联多登陆站的大圆航路（去重衔接点） */
export function chainArcs(
  waypoints: [number, number][],
  segmentsPerLeg = 6,
): [number, number][] {
  const out: [number, number][] = [];
  for (let i = 0; i < waypoints.length - 1; i++) {
    const leg = greatCircleArc(waypoints[i], waypoints[i + 1], segmentsPerLeg);
    if (i > 0) leg.shift();
    out.push(...leg);
  }
  return out;
}

/** 常用登陆站坐标（与 global.infrastructure.ts CABLES 对齐） */
const LP = {
  singapore: [103.7, 1.27] as [number, number],
  hongkong: [114.1, 22.25] as [number, number],
  shanghai: [121.8, 31.2] as [number, number],
  qingdao: [120.3, 36.1] as [number, number],
  taipei: [121.5, 25.0] as [number, number],
  tokyo: [140.0, 35.6] as [number, number],
  busan: [129.0, 35.1] as [number, number],
  manila: [120.98, 14.55] as [number, number],
  jakarta: [106.85, -6.12] as [number, number],
  mumbai: [72.83, 19.08] as [number, number],
  chennai: [80.3, 13.1] as [number, number],
  karachi: [67.0, 24.8] as [number, number],
  fujairah: [56.33, 25.12] as [number, number],
  jeddah: [39.17, 21.48] as [number, number],
  djibouti: [43.15, 11.6] as [number, number],
  alexandria: [29.92, 31.2] as [number, number],
  marseille: [5.35, 43.3] as [number, number],
  sines: [-8.87, 37.95] as [number, number],
  bilbao: [-2.93, 43.35] as [number, number],
  brest: [-4.48, 48.38] as [number, number],
  london: [-0.55, 51.45] as [number, number],
  dublin: [-6.15, 53.35] as [number, number],
  virginia: [-75.98, 36.85] as [number, number],
  nyc: [-73.95, 40.58] as [number, number],
  miami: [-80.12, 25.78] as [number, number],
  portland: [-70.25, 43.66] as [number, number],
  la: [-118.4, 33.9] as [number, number],
  guam: [144.79, 13.46] as [number, number],
  perth: [115.8, -32.0] as [number, number],
  sydney: [151.2, -33.9] as [number, number],
  melbourne: [144.95, -37.85] as [number, number],
  auckland: [174.78, -36.87] as [number, number],
  fortaleza: [-38.52, -3.72] as [number, number],
  santos: [-46.33, -23.95] as [number, number],
  rio: [-43.17, -22.9] as [number, number],
  lagos: [3.4, 6.45] as [number, number],
  capeTown: [18.4, -34.0] as [number, number],
  mombasa: [39.67, -4.05] as [number, number],
  maputo: [32.58, -25.97] as [number, number],
  hawaii: [-157.0, 21.0] as [number, number],
  buenosAires: [-58.4, -34.6] as [number, number],
} as const;

/** 主要国际海缆系统（简化多段 LineString 航点） */
export const GLOBAL_SUBMARINE_CABLES: SubmarineCableRoute[] = [
  // ── 欧亚走廊 / 红海—苏伊士—地中海 ──
  {
    id: 'cable-smw5',
    name: 'SEA-ME-WE 5',
    coordinates: [
      LP.singapore,
      [85.0, 8.0],
      LP.chennai,
      LP.mumbai,
      LP.fujairah,
      LP.djibouti,
      [43.3, 12.5],
      LP.jeddah,
      LP.alexandria,
      [18.0, 36.0],
      LP.marseille,
    ],
    note: '东南亚—南亚—中东—红海—地中海—欧洲主干海缆',
    impact: 'critical',
    capacity: '约 24 Tbps',
    year: 2017,
  },
  {
    id: 'cable-smw6',
    name: 'SEA-ME-WE 6（规划）',
    coordinates: chainArcs([
      LP.singapore,
      LP.chennai,
      LP.mumbai,
      LP.fujairah,
      LP.djibouti,
      LP.alexandria,
      LP.marseille,
      LP.london,
    ]),
    note: '欧亚新世代海缆走廊（部分段在建/规划）',
    impact: 'high',
    capacity: '约 100+ Tbps（设计）',
    year: 2026,
    planned: true,
  },
  {
    id: 'cable-smw4',
    name: 'SMW4（经红海）',
    coordinates: [
      LP.singapore,
      [80.0, 6.0],
      LP.chennai,
      LP.mumbai,
      LP.fujairah,
      LP.djibouti,
      [43.3, 12.5],
      LP.jeddah,
      LP.alexandria,
      [15.0, 38.0],
      LP.marseille,
    ],
    note: '东南亚—印度—中东—红海—苏伊士—地中海走廊',
    impact: 'high',
    capacity: '约 1.28 Tbps',
    year: 2005,
  },
  {
    id: 'cable-smw3',
    name: 'SMW3',
    coordinates: [
      LP.singapore,
      LP.jakarta,
      [78.0, 4.0],
      LP.chennai,
      LP.mumbai,
      LP.fujairah,
      LP.djibouti,
      LP.alexandria,
      LP.marseille,
      LP.sines,
    ],
    note: '早期欧亚主干海缆 · 经红海与苏伊士',
    impact: 'medium',
    capacity: '约 40 Gbps',
    year: 1999,
  },
  {
    id: 'cable-imewe',
    name: 'IMEWE',
    coordinates: [
      LP.marseille,
      LP.alexandria,
      LP.djibouti,
      LP.jeddah,
      LP.mumbai,
      LP.karachi,
      LP.fujairah,
      LP.chennai,
    ],
    note: '印度—中东—西欧多运营商共建海缆',
    impact: 'high',
    capacity: '约 3.84 Tbps',
    year: 2012,
  },
  {
    id: 'cable-aae1',
    name: 'AAE-1',
    coordinates: [
      LP.hongkong,
      LP.singapore,
      LP.chennai,
      LP.mumbai,
      LP.fujairah,
      LP.djibouti,
      LP.jeddah,
      LP.alexandria,
      LP.marseille,
      LP.sines,
    ],
    note: '亚洲—非洲—欧洲一号海缆',
    impact: 'high',
    capacity: '约 40 Tbps',
    year: 2017,
  },
  {
    id: 'cable-peace',
    name: 'PEACE Cable',
    coordinates: chainArcs([
      LP.marseille,
      LP.alexandria,
      LP.djibouti,
      LP.mombasa,
      LP.karachi,
      LP.singapore,
    ]),
    note: '巴基斯坦—东非—地中海—欧洲海缆',
    impact: 'high',
    capacity: '约 16 Tbps',
    year: 2022,
  },
  {
    id: 'cable-falcon',
    name: 'FALCON（中东环网）',
    coordinates: [
      LP.mumbai,
      [66.0, 22.0],
      [58.5, 23.6],
      [50.5, 26.2],
      LP.jeddah,
      LP.fujairah,
      LP.mumbai,
    ],
    note: '印度—阿曼—海湾—沙特—阿联酋区域海缆环',
    impact: 'high',
    capacity: '约 2.56 Tbps',
    year: 2006,
  },

  // ── 跨大西洋集群 ──
  {
    id: 'cable-marea',
    name: 'MAREA',
    coordinates: chainArcs([LP.virginia, [-55.0, 40.0], [-35.0, 44.0], [-15.0, 45.0], LP.bilbao]),
    note: '弗吉尼亚海滩—西班牙毕尔巴鄂跨大西洋海缆',
    impact: 'critical',
    capacity: '约 160 Tbps（升级后）',
    year: 2018,
  },
  {
    id: 'cable-amitie',
    name: 'Amitié',
    coordinates: chainArcs([LP.portland, [-50.0, 44.0], [-30.0, 46.0], [-10.0, 47.0], LP.brest]),
    note: '美国马萨诸塞—法国勒波尔热跨大西洋海缆',
    impact: 'high',
    capacity: '约 320 Tbps（设计）',
    year: 2023,
  },
  {
    id: 'cable-ac1',
    name: 'AC-1（Atlantic Crossing）',
    coordinates: chainArcs([LP.nyc, [-50.0, 43.0], [-25.0, 47.0], LP.brest]),
    note: '纽约—法国跨大西洋早期主干',
    impact: 'high',
    capacity: '约 40 Gbps',
    year: 1998,
  },
  {
    id: 'cable-hibernia',
    name: 'Hibernia Express',
    coordinates: chainArcs([LP.nyc, [-45.0, 46.0], [-20.0, 50.0], LP.dublin]),
    note: '纽约—爱尔兰低时延跨大西洋海缆',
    impact: 'high',
    capacity: '约 53 Tbps',
    year: 2015,
  },
  {
    id: 'cable-dunant',
    name: 'Dunant',
    coordinates: chainArcs([LP.virginia, [-50.0, 42.0], [-30.0, 45.0], LP.brest]),
    note: 'Google 跨大西洋私有海缆',
    impact: 'high',
    capacity: '约 250 Tbps',
    year: 2021,
  },
  {
    id: 'cable-tat14',
    name: 'TAT-14',
    coordinates: chainArcs([LP.nyc, [-45.0, 44.0], [-20.0, 48.0], LP.london, LP.brest]),
    note: '跨大西洋多登陆点环网',
    impact: 'medium',
    capacity: '约 3.2 Tbps',
    year: 2001,
  },
  {
    id: 'cable-flag-atlantic',
    name: 'FLAG Atlantic-1',
    coordinates: chainArcs([LP.nyc, [-40.0, 42.0], [-15.0, 46.0], LP.london]),
    note: '纽约—伦敦跨大西洋海缆',
    impact: 'medium',
    capacity: '约 10 Gbps',
    year: 2001,
  },
  {
    id: 'cable-ellalink',
    name: 'EllaLink',
    coordinates: chainArcs([LP.fortaleza, [-30.0, 0.0], [-15.0, 30.0], LP.sines]),
    note: '巴西—葡萄牙跨南大西洋直连',
    impact: 'high',
    capacity: '约 72 Tbps',
    year: 2021,
  },
  {
    id: 'cable-atlantis2',
    name: 'Atlantis-2',
    coordinates: chainArcs([LP.fortaleza, [-30.0, -10.0], [-10.0, 25.0], LP.sines, LP.marseille]),
    note: '南美—欧洲跨大西洋环网',
    impact: 'medium',
    capacity: '约 20 Gbps',
    year: 2000,
  },
  {
    id: 'cable-firmina',
    name: 'Firmina（规划）',
    coordinates: chainArcs([LP.virginia, [-45.0, 20.0], [-55.0, -5.0], LP.fortaleza, LP.santos]),
    note: 'Google 跨大西洋—南美私有海缆（规划）',
    impact: 'high',
    capacity: '约 240 Tbps（设计）',
    year: 2026,
    planned: true,
  },

  // ── 跨太平洋集群 ──
  {
    id: 'cable-faster',
    name: 'FASTER',
    coordinates: chainArcs([LP.la, [-140.0, 38.0], [-160.0, 36.0], [-175.0, 28.0], LP.guam, LP.tokyo]),
    note: '美国西岸—关岛—日本跨太平洋高速海缆',
    impact: 'critical',
    capacity: '约 60 Tbps',
    year: 2016,
  },
  {
    id: 'cable-unity',
    name: 'Unity',
    coordinates: chainArcs([
      LP.la,
      [-130.0, 32.0],
      [-150.0, 28.0],
      [-165.0, 22.0],
      LP.guam,
      LP.tokyo,
    ]),
    note: '洛杉矶—夏威夷—关岛—日本多运营商共建海缆',
    impact: 'critical',
    capacity: '约 7.68 Tbps',
    year: 2010,
  },
  {
    id: 'cable-aag',
    name: 'AAG（亚太—美洲）',
    coordinates: chainArcs([
      LP.singapore,
      LP.hongkong,
      LP.guam,
      [-165.0, 18.0],
      [-157.0, 21.0],
      LP.la,
    ]),
    note: '东南亚—香港—关岛—夏威夷—美国西岸海缆',
    impact: 'high',
    capacity: '约 2 Tbps',
    year: 2009,
  },
  {
    id: 'cable-plcn',
    name: 'PLCN（Pacific Light）',
    coordinates: chainArcs([LP.la, [-150.0, 30.0], [-170.0, 25.0], LP.guam, LP.hongkong, LP.taipei]),
    note: '洛杉矶—台湾—香港跨太平洋海缆',
    impact: 'high',
    capacity: '约 144 Tbps',
    year: 2021,
  },
  {
    id: 'cable-ncp',
    name: 'NCP（New Cross Pacific）',
    coordinates: chainArcs([LP.la, [-155.0, 32.0], LP.guam, LP.tokyo, LP.busan, LP.shanghai]),
    note: '美国西岸—日本—韩国—中国跨太平洋海缆',
    impact: 'high',
    capacity: '约 80 Tbps',
    year: 2017,
  },
  {
    id: 'cable-tpe',
    name: 'TPE（Trans-Pacific Express）',
    coordinates: chainArcs([LP.la, [-150.0, 35.0], LP.guam, LP.qingdao, LP.shanghai, LP.busan, LP.tokyo]),
    note: '中美日韩跨太平洋海缆联盟',
    impact: 'critical',
    capacity: '约 5.12 Tbps',
    year: 2010,
  },
  {
    id: 'cable-jupiter',
    name: 'JUPITER',
    coordinates: chainArcs([LP.la, [-145.0, 34.0], LP.guam, LP.tokyo, LP.busan, LP.manila]),
    note: '美日菲跨太平洋超高速海缆',
    impact: 'critical',
    capacity: '约 60 Tbps',
    year: 2020,
  },
  {
    id: 'cable-sea-us',
    name: 'SEA-US',
    coordinates: chainArcs([
      LP.la,
      [-140.0, 30.0],
      LP.guam,
      LP.manila,
      LP.singapore,
      LP.jakarta,
    ]),
    note: '美国—东南亚跨太平洋海缆',
    impact: 'high',
    capacity: '约 20 Tbps',
    year: 2017,
  },
  {
    id: 'cable-echo',
    name: 'Echo/Juno（规划）',
    coordinates: chainArcs([LP.la, [-155.0, 28.0], LP.guam, LP.singapore, LP.jakarta]),
    note: 'Google/Meta 跨太平洋私有海缆（规划）',
    impact: 'high',
    capacity: '约 340 Tbps（设计）',
    year: 2025,
    planned: true,
  },
  {
    id: 'cable-southern-cross',
    name: 'Southern Cross',
    coordinates: chainArcs([LP.sydney, [-170.0, -30.0], [-150.0, -20.0], LP.hawaii, LP.la]),
    note: '澳新—美国跨太平洋海缆',
    impact: 'high',
    capacity: '约 6.4 Tbps',
    year: 2000,
  },
  {
    id: 'cable-indigo',
    name: 'INDIGO',
    coordinates: chainArcs([LP.perth, [110.0, -20.0], LP.singapore, LP.jakarta, LP.sydney]),
    note: '澳大利亚—东南亚—新加坡海缆',
    impact: 'high',
    capacity: '约 36 Tbps',
    year: 2019,
  },
  {
    id: 'cable-hawaiki',
    name: 'Hawaiki',
    coordinates: chainArcs([LP.sydney, [-170.0, -35.0], [-155.0, -25.0], LP.auckland, LP.la]),
    note: '澳新—美国跨太平洋海缆',
    impact: 'high',
    capacity: '约 43 Tbps',
    year: 2018,
  },

  // ── 亚太区域环网 ──
  {
    id: 'cable-apcn2',
    name: 'APCN-2',
    coordinates: [
      LP.tokyo,
      LP.taipei,
      LP.hongkong,
      LP.manila,
      LP.singapore,
    ],
    note: '日本—台湾—香港—菲律宾—新加坡环亚太海缆',
    impact: 'high',
    capacity: '约 2.56 Tbps',
    year: 2002,
  },
  {
    id: 'cable-sjc',
    name: 'SJC',
    coordinates: [
      LP.singapore,
      [106.8, -5.5],
      LP.jakarta,
      LP.manila,
      LP.hongkong,
      LP.taipei,
      LP.tokyo,
    ],
    note: '新加坡—印尼—菲律宾—香港—日本海缆系统',
    impact: 'high',
    capacity: '约 28 Tbps',
    year: 2013,
  },
  {
    id: 'cable-apg',
    name: 'APG（Asia Pacific Gateway）',
    coordinates: [
      LP.singapore,
      LP.jakarta,
      LP.manila,
      LP.hongkong,
      LP.taipei,
      LP.shanghai,
      LP.busan,
      LP.tokyo,
    ],
    note: '东亚—东南亚多登陆点环网海缆',
    impact: 'high',
    capacity: '约 54.8 Tbps',
    year: 2016,
  },
  {
    id: 'cable-eac-c2c',
    name: 'EAC-C2C',
    coordinates: [
      LP.singapore,
      LP.hongkong,
      LP.taipei,
      LP.shanghai,
      LP.busan,
      LP.tokyo,
    ],
    note: '东亚沿海城市互联海缆',
    impact: 'high',
    capacity: '约 17.92 Tbps',
    year: 2008,
  },
  {
    id: 'cable-pc1',
    name: 'PC-1',
    coordinates: chainArcs([LP.tokyo, LP.guam, LP.hongkong, LP.taipei, LP.tokyo]),
    note: '日本—关岛—香港—台湾环太平洋支线',
    impact: 'medium',
    capacity: '约 640 Gbps',
    year: 2001,
  },
  {
    id: 'cable-ajc',
    name: 'AJC（Australia Japan）',
    coordinates: chainArcs([LP.perth, [125.0, -15.0], LP.guam, LP.tokyo]),
    note: '澳大利亚—日本直连海缆',
    impact: 'high',
    capacity: '约 10 Tbps',
    year: 2008,
  },
  {
    id: 'cable-ia',
    name: 'IA（Indonesia Australia）',
    coordinates: chainArcs([LP.perth, [115.0, -20.0], LP.jakarta, LP.singapore]),
    note: '印尼—澳大利亚海缆',
    impact: 'medium',
    capacity: '约 9.8 Tbps',
    year: 2018,
  },

  // ── 非洲沿岸 ──
  {
    id: 'cable-2africa',
    name: '2Africa',
    coordinates: [
      LP.london,
      LP.marseille,
      LP.alexandria,
      LP.djibouti,
      LP.mombasa,
      LP.maputo,
      LP.capeTown,
      LP.lagos,
      LP.fortaleza,
      LP.sines,
    ],
    note: '环绕非洲大陆的海缆系统（简化示意）',
    impact: 'high',
    capacity: '约 180 Tbps（设计）',
    year: 2024,
  },
  {
    id: 'cable-wacs',
    name: 'WACS',
    coordinates: [
      LP.london,
      LP.lagos,
      LP.capeTown,
      LP.maputo,
      LP.mombasa,
      LP.djibouti,
      LP.fujairah,
    ],
    note: '西非海底光缆系统',
    impact: 'high',
    capacity: '约 5.12 Tbps',
    year: 2012,
  },
  {
    id: 'cable-ace',
    name: 'ACE',
    coordinates: [
      LP.marseille,
      LP.lagos,
      LP.capeTown,
      LP.fortaleza,
    ],
    note: '非洲海岸至欧洲海缆',
    impact: 'high',
    capacity: '约 5.12 Tbps',
    year: 2012,
  },
  {
    id: 'cable-seacom',
    name: 'SEACOM',
    coordinates: [
      LP.mumbai,
      LP.mombasa,
      LP.maputo,
      LP.capeTown,
      LP.marseille,
    ],
    note: '东非—南亚—欧洲海缆',
    impact: 'high',
    capacity: '约 1.28 Tbps',
    year: 2009,
  },
  {
    id: 'cable-eassy',
    name: 'EASSy',
    coordinates: [
      LP.djibouti,
      LP.mombasa,
      LP.maputo,
      LP.capeTown,
      LP.mumbai,
    ],
    note: '东非海底光缆系统',
    impact: 'high',
    capacity: '约 4.72 Tbps',
    year: 2010,
  },
  {
    id: 'cable-safe',
    name: 'SAFE',
    coordinates: chainArcs([LP.capeTown, [-20.0, -40.0], [80.0, -35.0], LP.perth, LP.mumbai]),
    note: '南非—印度洋—澳大利亚—印度海缆',
    impact: 'medium',
    capacity: '约 130 Gbps',
    year: 2002,
  },

  // ── 南美走廊 ──
  {
    id: 'cable-sam1',
    name: 'SAM-1',
    coordinates: chainArcs([LP.fortaleza, [-35.0, -15.0], LP.rio, LP.santos, LP.buenosAires]),
    note: '南美东海岸区域海缆',
    impact: 'medium',
    capacity: '约 20 Gbps',
    year: 2001,
  },
  {
    id: 'cable-brusa',
    name: 'BRUSA',
    coordinates: chainArcs([LP.fortaleza, [-40.0, 5.0], LP.virginia, LP.miami]),
    note: '巴西—美国跨大西洋海缆',
    impact: 'high',
    capacity: '约 138 Tbps',
    year: 2018,
  },
  {
    id: 'cable-monet',
    name: 'Monet',
    coordinates: chainArcs([LP.fortaleza, [-35.0, -10.0], LP.rio, LP.miami]),
    note: '巴西—美国跨大西洋海缆',
    impact: 'high',
    capacity: '约 64 Tbps',
    year: 2017,
  },
  {
    id: 'cable-sac',
    name: 'SAC（South America Crossing）',
    coordinates: chainArcs([LP.fortaleza, [-30.0, -20.0], LP.rio, LP.santos]),
    note: '南美跨洋区域互联',
    impact: 'medium',
    capacity: '约 20 Gbps',
    year: 2000,
  },
];
