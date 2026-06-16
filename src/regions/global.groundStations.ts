/**
 * 全球地面测控站 / 深空网 — 宇宙空间层（三位一体 Phase 2）
 *
 * 公开航天测控资料汇总，坐标为台站公开近似位置。
 * 类型：deep_space 深空网（DSN 等）/ tracking 常规测控与信关站。整理日：2026-06-16
 */

import type { ImpactLevel } from '@/types/geo';

export interface GroundStation {
  id: string;
  name: string;
  operator: string;
  kind: 'deep_space' | 'tracking';
  lng: number;
  lat: number;
  note: string;
  impact: ImpactLevel;
}

export const GLOBAL_GROUND_STATIONS: GroundStation[] = [
  // 深空网（DSN / ESA / 中国深空站）
  { id: 'gs-dsn-goldstone', name: '戈尔德斯通深空站', operator: 'NASA DSN', kind: 'deep_space', lng: -116.89, lat: 35.43, note: '美国加州，深空网三大站之一', impact: 'high' },
  { id: 'gs-dsn-madrid', name: '马德里深空站', operator: 'NASA DSN', kind: 'deep_space', lng: -4.25, lat: 40.43, note: '西班牙罗夫莱多，深空网欧洲站', impact: 'high' },
  { id: 'gs-dsn-canberra', name: '堪培拉深空站', operator: 'NASA DSN', kind: 'deep_space', lng: 148.98, lat: -35.4, note: '澳大利亚，深空网南半球站', impact: 'high' },
  { id: 'gs-esa-cebreros', name: '塞夫雷罗斯深空站', operator: 'ESA', kind: 'deep_space', lng: -4.37, lat: 40.45, note: '欧空局西班牙深空天线', impact: 'medium' },
  { id: 'gs-esa-malargue', name: '马拉圭埃深空站', operator: 'ESA', kind: 'deep_space', lng: -69.4, lat: -35.78, note: '欧空局阿根廷深空天线', impact: 'medium' },
  { id: 'gs-esa-newnorcia', name: '新诺西亚深空站', operator: 'ESA', kind: 'deep_space', lng: 116.19, lat: -31.05, note: '欧空局澳大利亚深空天线', impact: 'medium' },
  { id: 'gs-cn-jiamusi', name: '佳木斯深空站', operator: '中国深空网', kind: 'deep_space', lng: 130.77, lat: 46.49, note: '中国 66m 深空测控天线', impact: 'high' },
  { id: 'gs-cn-kashgar', name: '喀什深空站', operator: '中国深空网', kind: 'deep_space', lng: 76.0, lat: 39.5, note: '中国西部深空测控', impact: 'high' },
  { id: 'gs-cn-argentina', name: '内乌肯深空站', operator: '中国深空网', kind: 'deep_space', lng: -70.15, lat: -38.2, note: '中国在阿根廷的深空测控站', impact: 'medium' },
  // 常规测控 / 极地信关站
  { id: 'gs-ksat-svalbard', name: '斯瓦尔巴信关站', operator: 'KSAT', kind: 'tracking', lng: 15.4, lat: 78.23, note: '北极高纬，极轨卫星每圈可见', impact: 'high' },
  { id: 'gs-ksat-troll', name: '特罗尔信关站', operator: 'KSAT', kind: 'tracking', lng: 2.5, lat: -72.0, note: '南极，极轨卫星数据下行', impact: 'medium' },
  { id: 'gs-cn-xian', name: '西安卫星测控中心', operator: '中国', kind: 'tracking', lng: 108.9, lat: 34.3, note: '中国航天测控指挥核心', impact: 'high' },
  { id: 'gs-ru-tsup', name: '莫斯科飞控中心（TsUP）', operator: '俄罗斯', kind: 'tracking', lng: 37.85, lat: 55.92, note: '俄罗斯载人与卫星飞控', impact: 'medium' },
  { id: 'gs-nasa-wallops', name: '沃洛普斯测控站', operator: 'NASA', kind: 'tracking', lng: -75.47, lat: 37.94, note: '美东测控与发射支持', impact: 'medium' },
];
