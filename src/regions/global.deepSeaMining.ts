/**
 * 全球深海采矿 / ISA 勘探合同区档案 — 洋底空间层（三位一体 Phase 1）
 *
 * 均为公开资料（国际海底管理局 ISA 勘探区与公开研究），坐标为区域中心**示意点**，非边界精确坐标。
 * 资源类型：nodules 多金属结核 / sulphides 多金属硫化物 / crusts 富钴结壳。整理日：2026-06-16
 */

import type { ImpactLevel } from '@/types/geo';
import { DENSIFY_DEEP_SEA } from './global.layers-densify-r2';

export interface SeabedMiningArea {
  id: string;
  name: string;
  /** 资源类型 */
  resource: 'nodules' | 'sulphides' | 'crusts';
  lng: number;
  lat: number;
  note: string;
  impact: ImpactLevel;
}

export const GLOBAL_DEEP_SEA_MINING: SeabedMiningArea[] = [
  { id: 'dsm-ccz', name: '克拉里昂-克利珀顿带（CCZ）', resource: 'nodules', lng: -130.0, lat: 12.0, note: '太平洋东北部，全球多金属结核勘探最密集区，多国合同', impact: 'critical' },
  { id: 'dsm-cio', name: '中印度洋海盆', resource: 'nodules', lng: 76.0, lat: -12.0, note: '印度等国结核勘探区', impact: 'high' },
  { id: 'dsm-penrhyn', name: '彭林海盆（库克群岛）', resource: 'nodules', lng: -163.0, lat: -12.0, note: '南太平洋结核资源争夺新热点', impact: 'medium' },
  { id: 'dsm-peru', name: '秘鲁海盆', resource: 'nodules', lng: -90.0, lat: -14.0, note: '东南太平洋结核区', impact: 'medium' },
  { id: 'dsm-mar', name: '大西洋中脊热液区', resource: 'sulphides', lng: -33.0, lat: 14.0, note: '多金属硫化物（海底热液）勘探', impact: 'high' },
  { id: 'dsm-indian-ridge', name: '西南印度洋洋脊', resource: 'sulphides', lng: 49.0, lat: -37.0, note: '中国等国硫化物勘探合同区', impact: 'medium' },
  { id: 'dsm-cir', name: '中印度洋洋脊', resource: 'sulphides', lng: 67.0, lat: -23.0, note: '热液硫化物勘探区', impact: 'medium' },
  { id: 'dsm-wpac-crusts', name: '西太平洋海山（富钴结壳）', resource: 'crusts', lng: 153.0, lat: 16.0, note: '麦哲伦海山等富钴结壳勘探区', impact: 'high' },
  { id: 'dsm-rio-grande', name: '里奥格兰德海隆', resource: 'crusts', lng: -35.0, lat: -31.0, note: '南大西洋富钴结壳勘探', impact: 'low' },
  ...DENSIFY_DEEP_SEA,
];
