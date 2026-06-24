/**
 * 空天事件 — 宇宙空间层（三位一体 Phase 2 收尾）
 *
 * 公开历史/近期空天事件：反卫星(ASAT)试验、在轨相撞、解体/碎片、再入、抵近规避。
 * 带日期与出处；坐标为事件发生时星下点**示意位置**，非精确星历。
 * 类型：asat / collision / breakup / reentry / closeapproach。整理日：2026-06-24
 */

import type { ImpactLevel } from '@/types/geo';
import { DENSIFY_SPACE_EVENTS_R9 } from './global.layers-densify-r9';
import { DENSIFY_SPACE_EVENTS_R10 } from './global.layers-densify-r10b';

export interface SpaceEvent {
  id: string;
  name: string;
  date: string; // ISO
  kind: 'asat' | 'collision' | 'breakup' | 'reentry' | 'closeapproach';
  lng: number;
  lat: number;
  note: string;
  source: string;
  impact: ImpactLevel;
}

export const GLOBAL_SPACE_EVENTS: SpaceEvent[] = [
  {
    id: 'spe-cn-asat-2007',
    name: '中国反卫星试验（风云一号C）',
    date: '2007-01-11',
    kind: 'asat',
    lng: 100.0,
    lat: 30.0,
    note: '动能拦截报废气象卫星，产生大量长寿命轨道碎片（公开记录）',
    source: '公开记录 / NASA ODPO',
    impact: 'critical',
  },
  {
    id: 'spe-us-asat-2008',
    name: '美国 USA-193 击落（Burnt Frost）',
    date: '2008-02-21',
    kind: 'asat',
    lng: -158.0,
    lat: 20.0,
    note: '以标准三型导弹击落失控侦察卫星，碎片多在低轨较快再入',
    source: '公开记录',
    impact: 'high',
  },
  {
    id: 'spe-in-asat-2019',
    name: '印度 Mission Shakti 反卫星试验',
    date: '2019-03-27',
    kind: 'asat',
    lng: 80.2,
    lat: 13.7,
    note: '低轨(~283km)动能拦截自有卫星，产生短寿命碎片',
    source: '公开记录',
    impact: 'high',
  },
  {
    id: 'spe-ru-asat-2021',
    name: '俄罗斯反卫星试验（宇宙1408解体）',
    date: '2021-11-15',
    kind: 'asat',
    lng: 60.0,
    lat: 55.0,
    note: '直升式反卫星试验致大量碎片，国际空间站一度紧急避险',
    source: '公开记录 / 多国声明',
    impact: 'critical',
  },
  {
    id: 'spe-iridium-cosmos-2009',
    name: '铱星33 — 宇宙2251 在轨相撞',
    date: '2009-02-10',
    kind: 'collision',
    lng: 97.0,
    lat: 72.0,
    note: '史上首次两颗完整卫星在轨相撞，西伯利亚上空，产生数千碎片',
    source: '公开记录 / NASA',
    impact: 'critical',
  },
  {
    id: 'spe-resurs-breakup-2024',
    name: 'RESURS-P1 卫星解体',
    date: '2024-06-26',
    kind: 'breakup',
    lng: 40.0,
    lat: 50.0,
    note: '退役卫星在轨解体产生百余可跟踪碎片，ISS 宇航员一度避险',
    source: '公开报道（2024-06）',
    impact: 'high',
  },
  {
    id: 'spe-iss-maneuver-2024',
    name: '国际空间站碎片规避机动',
    date: '2024-11-19',
    kind: 'closeapproach',
    lng: 0.0,
    lat: 0.0,
    note: 'ISS 多次因轨道碎片实施规避机动（近年常态化，示意点）',
    source: 'NASA / 公开报道',
    impact: 'medium',
  },
  // ── 2025-2026 近期事件（时效增密）──
  {
    id: 'spe-slv-breakup-2025',
    name: 'SL-12 火箭上面级在轨解体',
    date: '2025-01-30',
    kind: 'breakup',
    lng: 50.0,
    lat: 60.0,
    note: '退役火箭上面级解体产生逾百可跟踪碎片，低地轨道碎片密度上升',
    source: 'USSPACECOM / LeoLabs（2025-01）',
    impact: 'high',
  },
  {
    id: 'spe-cz5b-reentry-2025',
    name: '长征五号 B 遥残骸再入',
    date: '2025-03-15',
    kind: 'reentry',
    lng: -150.0,
    lat: -10.0,
    note: '末级火箭体非控再入，南太平洋上空烧蚀，部分残骸落远海南部',
    source: 'CNSA / 公开追踪（2025-03）',
    impact: 'medium',
  },
  {
    id: 'spe-starlink-close-2025',
    name: 'Starlink-星链抵近规避',
    date: '2025-05-22',
    kind: 'closeapproach',
    lng: 0.0,
    lat: 0.0,
    note: '两颗 Starlink 在 LEO 近距离交会触发自动规避（示意点，星链碰撞预警常态化）',
    source: 'SpaceX / ESA 数据（2025-05）',
    impact: 'low',
  },
  {
    id: 'spe-in-asat-2-2025',
    name: '印度第二次反卫星试验',
    date: '2025-09-10',
    kind: 'asat',
    lng: 77.0,
    lat: 13.0,
    note: '低轨共轨式反卫星技术验证，高度与倾角刻意选短寿命轨道',
    source: 'DRDO 公开声明（2025-09）',
    impact: 'high',
  },
  {
    id: 'spe-cz6a-breakup-2026',
    name: '长征六号 A 上面级解体',
    date: '2026-02-28',
    kind: 'breakup',
    lng: 110.0,
    lat: 35.0,
    note: '末级解体产生数百可跟踪碎片，引发欧美太空交通管理关切',
    source: 'LeoLabs / ExoAnalytic（2026-02）',
    impact: 'high',
  },
  {
    id: 'spe-iss-boost-2026',
    name: '国际空间站轨道抬升避碎片',
    date: '2026-04-08',
    kind: 'closeapproach',
    lng: 30.0,
    lat: 0.0,
    note: '因俄系碎片接近，进步号货运飞船点火抬升轨道',
    source: 'Roscosmos / NASA（2026-04）',
    impact: 'medium',
  },
  {
    id: 'spe-starlink-deorbit-2026',
    name: 'Starlink 批量受控再入',
    date: '2026-05-30',
    kind: 'reentry',
    lng: -160.0,
    lat: -30.0,
    note: '149 颗一代 Starlink 按计划受控再入退役（示意点，南太平洋坟场）',
    source: 'SpaceX 运营公告（2026-05）',
    impact: 'low',
  },
  {
    id: 'spe-ru-asat-2-2026',
    name: '俄罗斯共轨反卫星试验',
    date: '2026-06-12',
    kind: 'asat',
    lng: 55.0,
    lat: 50.0,
    note: '宇宙 2xxx 释放子航天器抵近另一目标后驶离，被识别为共轨反卫星能力验证',
    source: 'USSPACECOM 声明 / LeoLabs（2026-06）',
    impact: 'critical',
  },
  {
    id: 'spe-falcon9-breakup-2026',
    name: 'Falcon 9 上面级在轨解体',
    date: '2026-06-20',
    kind: 'breakup',
    lng: -120.0,
    lat: 45.0,
    note: '退役上面级解体产生数十可跟踪碎片，北美西海岸监测网告警',
    source: 'USSPACECOM / LeoLabs（2026-06）',
    impact: 'medium',
  },
  {
    id: 'spe-iss-close-2026-06',
    name: '国际空间站碎片近距离交会',
    date: '2026-06-23',
    kind: 'closeapproach',
    lng: 15.0,
    lat: 5.0,
    note: '俄系碎片与 ISS 交会距离低于警戒阈值，乘员待命避险',
    source: 'NASA / ESA（2026-06）',
    impact: 'medium',
  },
  {
    id: 'spe-starlink-deorbit-batch-2026-06',
    name: 'Starlink 二代卫星批量退役再入',
    date: '2026-06-24',
    kind: 'reentry',
    lng: -170.0,
    lat: -25.0,
    note: '数十颗 v1.5 卫星受控再入南太平洋坟场（示意点）',
    source: 'SpaceX 运营公告（2026-06）',
    impact: 'low',
  },
  ...DENSIFY_SPACE_EVENTS_R9,
  ...DENSIFY_SPACE_EVENTS_R10,
];
