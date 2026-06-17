/**
 * 在轨轨道器名册 — 多天体探索 Phase 3（实时星历）
 *
 * 每个轨道器经 JPL Horizons 取「星下点」（spacecraft 为观测中心、天体为目标的 sub-observer 经纬）。
 * Horizons ID 为最佳已知值，需对真实接口核验；不可用者自动降级、不造假。
 */

import type { BodyLayerId, CelestialBody } from '@/types/body';

export interface OrbiterDef {
  id: string;
  body: CelestialBody;
  layer: BodyLayerId; // moon_orbiters | mars_orbiters
  name: string;
  nameEn: string;
  agency: string;
  /** JPL Horizons 航天器编号（如 -74），作为观测中心 '500@<id>' */
  horizonsId: string;
  /** 天体中心 Horizons 编号（月 301 / 火 499） */
  bodyCode: string;
  note: string;
}

export const ORBITERS: OrbiterDef[] = [
  // ── 绕月 ────────────────────────────────────────
  { id: 'lro', body: 'moon', layer: 'moon_orbiters', name: '月球勘测轨道器', nameEn: 'LRO', agency: 'NASA', horizonsId: '-85', bodyCode: '301', note: '高分辨率全月测绘，2009 至今在轨。' },

  // ── 绕火 ────────────────────────────────────────
  { id: 'mro', body: 'mars', layer: 'mars_orbiters', name: '火星勘测轨道器', nameEn: 'MRO', agency: 'NASA', horizonsId: '-74', bodyCode: '499', note: 'HiRISE 高分相机，中继与高分成像。' },
  { id: 'maven', body: 'mars', layer: 'mars_orbiters', name: 'MAVEN', nameEn: 'MAVEN', agency: 'NASA', horizonsId: '-202', bodyCode: '499', note: '研究火星高层大气与逃逸。' },
  { id: 'odyssey', body: 'mars', layer: 'mars_orbiters', name: '火星奥德赛', nameEn: 'Mars Odyssey', agency: 'NASA', horizonsId: '-53', bodyCode: '499', note: '在役最久的火星轨道器，中继骨干。' },
  { id: 'mex', body: 'mars', layer: 'mars_orbiters', name: '火星快车', nameEn: 'Mars Express', agency: 'ESA', horizonsId: '-41', bodyCode: '499', note: '欧空局首个火星任务，雷达探测地下水冰。' },
  { id: 'tgo', body: 'mars', layer: 'mars_orbiters', name: '微量气体轨道器', nameEn: 'ExoMars TGO', agency: 'ESA/Roscosmos', horizonsId: '-143', bodyCode: '499', note: '探测火星大气微量气体（甲烷等）。' },
];

export function orbitersForBody(body: CelestialBody): OrbiterDef[] {
  return ORBITERS.filter((o) => o.body === body);
}
