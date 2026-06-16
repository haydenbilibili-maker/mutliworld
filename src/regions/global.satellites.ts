/**
 * 在轨卫星（以地球同步 GEO 卫星为主）— 宇宙空间层（三位一体 Phase 2）
 *
 * GEO 卫星位于赤道上空、对应固定经度（纬度≈0），可精确标注，排成"同步轨道带"。
 * 公开航天资料汇总，经度为各星公开定点位置；类型：weather 气象 / comms 通信 / navigation 导航。
 * 整理日：2026-06-16
 */

import type { ImpactLevel } from '@/types/geo';

export interface SatellitePoint {
  id: string;
  name: string;
  operator: string;
  kind: 'weather' | 'comms' | 'navigation';
  /** GEO 定点经度（纬度固定为 0） */
  lng: number;
  note: string;
  impact: ImpactLevel;
}

export const GLOBAL_SATELLITES: SatellitePoint[] = [
  // 气象 GEO
  { id: 'sat-goes19', name: 'GOES-19（东）', operator: 'NOAA', kind: 'weather', lng: -75.2, note: '美洲东部静止气象卫星', impact: 'high' },
  { id: 'sat-goes18', name: 'GOES-18（西）', operator: 'NOAA', kind: 'weather', lng: -137.0, note: '美洲西部/太平洋静止气象卫星', impact: 'high' },
  { id: 'sat-meteosat-0', name: 'Meteosat（0°）', operator: 'EUMETSAT', kind: 'weather', lng: 0.0, note: '欧洲—非洲全圆盘气象', impact: 'high' },
  { id: 'sat-meteosat-iodc', name: 'Meteosat IODC', operator: 'EUMETSAT', kind: 'weather', lng: 45.5, note: '印度洋上空气象覆盖', impact: 'medium' },
  { id: 'sat-fy4b', name: '风云四号 B', operator: '中国气象局', kind: 'weather', lng: 105.0, note: '东亚—西太平洋静止气象', impact: 'high' },
  { id: 'sat-insat3d', name: 'INSAT-3D', operator: 'ISRO', kind: 'weather', lng: 82.0, note: '南亚静止气象卫星', impact: 'medium' },
  { id: 'sat-himawari9', name: '葵花九号 Himawari-9', operator: 'JMA', kind: 'weather', lng: 140.7, note: '东亚—大洋洲静止气象', impact: 'high' },
  { id: 'sat-gk2a', name: '千里眼二号 GK-2A', operator: 'KMA', kind: 'weather', lng: 128.2, note: '朝鲜半岛—东亚气象', impact: 'medium' },
  { id: 'sat-elektro', name: 'Elektro-L', operator: 'Roscosmos', kind: 'weather', lng: 76.0, note: '俄罗斯静止气象', impact: 'medium' },
  // 通信 GEO
  { id: 'sat-inmarsat-i4', name: 'Inmarsat-4（亚太）', operator: 'Inmarsat', kind: 'comms', lng: 143.5, note: '海事/航空卫星通信', impact: 'medium' },
  { id: 'sat-intelsat-atl', name: 'Intelsat（大西洋）', operator: 'Intelsat', kind: 'comms', lng: -34.5, note: '跨大西洋卫星通信枢纽', impact: 'medium' },
  // 导航 GEO（北斗含 GEO 星）
  { id: 'sat-bds-g1', name: '北斗 GEO（约 80°E）', operator: '中国北斗', kind: 'navigation', lng: 80.0, note: '北斗地球静止轨道卫星', impact: 'high' },
  { id: 'sat-bds-g2', name: '北斗 GEO（约 110.5°E）', operator: '中国北斗', kind: 'navigation', lng: 110.5, note: '北斗地球静止轨道卫星', impact: 'high' },
  { id: 'sat-bds-g3', name: '北斗 GEO（约 140°E）', operator: '中国北斗', kind: 'navigation', lng: 140.0, note: '北斗地球静止轨道卫星', impact: 'high' },
];
