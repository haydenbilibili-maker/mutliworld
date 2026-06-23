/**
 * 海底光缆中断事件 — 洋底空间层（三位一体 Phase 1）
 *
 * 均为公开报道的海缆受损/中断事件，带日期与出处概述；坐标为受损海域**示意位置**。
 * 数据有时效性，需定期核实更新。整理日：2026-06-23
 */

import type { ImpactLevel } from '@/types/geo';
import { DENSIFY_CABLE_INCIDENTS } from './global.layers-densify-r2';

export interface CableIncident {
  id: string;
  name: string;
  date: string; // ISO
  lng: number;
  lat: number;
  note: string;
  source: string;
  impact: ImpactLevel;
}

export const GLOBAL_CABLE_INCIDENTS: CableIncident[] = [
  {
    id: 'ci-redsea-2024',
    name: '红海多条海缆受损',
    date: '2024-02-24',
    lng: 41.0,
    lat: 15.5,
    note: 'AAE-1 / Seacom / EIG 等多条欧亚海缆在也门外海受损，亚欧通信受影响（受损原因有争议）',
    source: '多家电信运营商公告 / 公开报道（2024-02）',
    impact: 'critical',
  },
  {
    id: 'ci-baltic-clion1-2024',
    name: '波罗的海 C-Lion1 海缆中断',
    date: '2024-11-18',
    lng: 18.5,
    lat: 55.6,
    note: '芬兰—德国 C-Lion1 与立陶宛—瑞典 BCS East-West 海缆相继受损，欧洲展开调查',
    source: '公开报道（2024-11）',
    impact: 'high',
  },
  {
    id: 'ci-baltic-estlink-2024',
    name: '波罗的海 Estlink 2 / 海缆受损',
    date: '2024-12-25',
    lng: 25.0,
    lat: 59.6,
    note: '爱沙尼亚—芬兰电力与通信海缆受损，多国加强海底基础设施巡护',
    source: '公开报道（2024-12）',
    impact: 'high',
  },
  {
    id: 'ci-matsu-2023',
    name: '台湾马祖海缆中断',
    date: '2023-02-08',
    lng: 119.95,
    lat: 26.15,
    note: '连接马祖的两条海缆先后中断，离岛对外通信一度严重受限',
    source: '公开报道（2023-02）',
    impact: 'high',
  },
  {
    id: 'ci-taiwan-north-2025',
    name: '台湾北部海域海缆受损',
    date: '2025-01-03',
    lng: 122.0,
    lat: 25.3,
    note: '台湾北部一条国际海缆疑遭船只拖锚受损，引发海底设施安全关注',
    source: '公开报道（2025-01）',
    impact: 'medium',
  },
  {
    id: 'ci-vietnam-2023',
    name: '越南多条国际海缆故障',
    date: '2023-02-01',
    lng: 110.0,
    lat: 12.0,
    note: 'APG / AAE-1 / AAG / IA / SMW-3 多条海缆同期故障，越南国际带宽显著下降',
    source: '公开报道（2023）',
    impact: 'medium',
  },
  {
    id: 'ci-westafrica-2024',
    name: '西非沿岸多条海缆中断',
    date: '2024-03-14',
    lng: -5.0,
    lat: 5.0,
    note: 'WACS / MainOne / SAT-3 / ACE 等海缆受损，多国互联网大面积中断',
    source: '公开报道（2024-03）',
    impact: 'high',
  },
  ...DENSIFY_CABLE_INCIDENTS,
];
