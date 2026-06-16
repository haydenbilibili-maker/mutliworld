/**
 * 空天事件 — 宇宙空间层（三位一体 Phase 2 收尾）
 *
 * 公开历史/近期空天事件：反卫星(ASAT)试验、在轨相撞、解体/碎片、再入、抵近规避。
 * 带日期与出处；坐标为事件发生时星下点**示意位置**，非精确星历。
 * 类型：asat / collision / breakup / reentry / closeapproach。整理日：2026-06-16
 */

import type { ImpactLevel } from '@/types/geo';

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
];
