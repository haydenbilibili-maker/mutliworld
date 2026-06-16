/**
 * 全球板块边界 / 活动断层带 — 洋底空间层（三位一体 Phase 1）
 *
 * 公开地质事实，坐标为边界/断层代表性**示意点**（非连续边界线）。
 * 类型：convergent 汇聚（碰撞/俯冲）/ divergent 离散（洋脊/裂谷）/ transform 转换断层。整理日：2026-06-16
 */

import type { ImpactLevel } from '@/types/geo';
import { DENSIFY_TECTONICS } from './global.layers-densify-r2';

export interface TectonicFeature {
  id: string;
  name: string;
  kind: 'convergent' | 'divergent' | 'transform';
  lng: number;
  lat: number;
  note: string;
  impact: ImpactLevel;
}

export const GLOBAL_TECTONICS: TectonicFeature[] = [
  // 汇聚边界（俯冲带 / 碰撞带）
  { id: 'tec-japan-trench', name: '日本海沟', kind: 'convergent', lng: 144.0, lat: 38.0, note: '太平洋板块俯冲，2011 东日本大地震源区', impact: 'critical' },
  { id: 'tec-kuril', name: '千岛—堪察加海沟', kind: 'convergent', lng: 156.0, lat: 50.0, note: '环太平洋强震带北段', impact: 'high' },
  { id: 'tec-aleutian', name: '阿留申海沟', kind: 'convergent', lng: -175.0, lat: 52.0, note: '北太平洋俯冲带', impact: 'high' },
  { id: 'tec-cascadia', name: '卡斯卡迪亚俯冲带', kind: 'convergent', lng: -125.0, lat: 45.0, note: '北美西北潜在大地震风险', impact: 'high' },
  { id: 'tec-peru-chile', name: '秘鲁—智利海沟', kind: 'convergent', lng: -73.0, lat: -30.0, note: '纳斯卡板块俯冲，特大地震多发', impact: 'critical' },
  { id: 'tec-sunda', name: '巽他海沟（苏门答腊）', kind: 'convergent', lng: 100.0, lat: -3.0, note: '2004 印度洋大海啸源区', impact: 'critical' },
  { id: 'tec-himalaya', name: '喜马拉雅碰撞带', kind: 'convergent', lng: 84.0, lat: 28.0, note: '印度—欧亚板块碰撞造山带', impact: 'high' },
  { id: 'tec-marianas', name: '马里亚纳海沟', kind: 'convergent', lng: 142.0, lat: 18.0, note: '全球最深海沟（约 -11km）', impact: 'high' },
  { id: 'tec-alpine-med', name: '阿尔卑斯—地中海碰撞带', kind: 'convergent', lng: 15.0, lat: 40.0, note: '非洲—欧亚汇聚，南欧地震带', impact: 'medium' },
  // 离散边界（洋中脊 / 大陆裂谷）
  { id: 'tec-mar', name: '大西洋中脊', kind: 'divergent', lng: -30.0, lat: 0.0, note: '全球最长洋中脊，板块新生处', impact: 'medium' },
  { id: 'tec-iceland', name: '冰岛洋脊（裂谷上岛）', kind: 'divergent', lng: -18.0, lat: 65.0, note: '洋脊出露陆地，火山活跃', impact: 'high' },
  { id: 'tec-east-africa', name: '东非大裂谷', kind: 'divergent', lng: 36.0, lat: 0.0, note: '大陆裂解中，未来或成新洋', impact: 'medium' },
  { id: 'tec-red-sea', name: '红海裂谷', kind: 'divergent', lng: 38.0, lat: 20.0, note: '阿拉伯—非洲张裂，年轻海盆', impact: 'medium' },
  { id: 'tec-epr', name: '东太平洋海隆', kind: 'divergent', lng: -103.0, lat: -10.0, note: '快速扩张洋中脊', impact: 'low' },
  // 转换断层
  { id: 'tec-san-andreas', name: '圣安德烈斯断层', kind: 'transform', lng: -120.0, lat: 36.0, note: '太平洋—北美右旋走滑，加州强震带', impact: 'critical' },
  { id: 'tec-anatolian', name: '北安纳托利亚断层', kind: 'transform', lng: 35.0, lat: 40.5, note: '土耳其大地震主控断层', impact: 'critical' },
  { id: 'tec-dead-sea', name: '死海转换断层', kind: 'transform', lng: 35.5, lat: 31.5, note: '阿拉伯—非洲左旋走滑', impact: 'medium' },
  ...DENSIFY_TECTONICS,
];
