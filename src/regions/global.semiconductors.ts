/**
 * 全球半导体晶圆厂 / 先进制程产能档案 — 对标芯片供应链态势
 *
 * 均为公开企业资料汇总（厂址近似坐标），非实时产能数据。整理日：2026-06-23
 */

import type { ImpactLevel } from '@/types/geo';
import { DENSIFY_SEMICONDUCTORS } from './global.layers-densify-r2';
import { DENSIFY_SEMICONDUCTORS_R8 } from './global.layers-densify-r8';
import { DENSIFY_SEMICONDUCTORS_R9 } from './global.layers-densify-r9';
import { DENSIFY_SEMICONDUCTORS_R10 } from './global.layers-densify-r10b';

export interface SemiconductorFab {
  id: string;
  name: string;
  operator: string;
  lng: number;
  lat: number;
  /** foundry 代工 / memory 存储 / idm 垂直整合 */
  kind: 'foundry' | 'memory' | 'idm';
  status: 'active' | 'planned';
  note: string;
  impact: ImpactLevel;
}

export const GLOBAL_SEMICONDUCTORS: SemiconductorFab[] = [
  { id: 'fab-tsmc-hsinchu', name: '新竹科学园区 · TSMC', operator: '台积电', lng: 120.97, lat: 24.78, kind: 'foundry', status: 'active', note: '全球先进制程核心产区', impact: 'critical' },
  { id: 'fab-tsmc-tainan', name: '台南 · TSMC Fab 18', operator: '台积电', lng: 120.27, lat: 23.1, kind: 'foundry', status: 'active', note: '3nm 量产 / 2nm GAA 2025 试产', impact: 'critical' },
  { id: 'fab-tsmc-az', name: '亚利桑那凤凰城 · TSMC', operator: '台积电', lng: -112.13, lat: 33.72, kind: 'foundry', status: 'active', note: 'Fab 21 · N4 量产中，N2 2028 计划', impact: 'high' },
  { id: 'fab-tsmc-kumamoto', name: '熊本 · JASM（TSMC）', operator: '台积电/索尼', lng: 130.78, lat: 32.89, kind: 'foundry', status: 'active', note: '日本成熟+特殊制程基地', impact: 'high' },
  { id: 'fab-tsmc-dresden', name: '德累斯顿 · ESMC（TSMC）', operator: '台积电', lng: 13.73, lat: 51.05, kind: 'foundry', status: 'planned', note: '欧洲车用芯片合资厂', impact: 'medium' },
  { id: 'fab-samsung-pyeongtaek', name: '平泽 · 三星', operator: '三星电子', lng: 127.05, lat: 37.0, kind: 'memory', status: 'active', note: '全球最大存储+代工园区 · 2nm GAA 2025 试产', impact: 'critical' },
  { id: 'fab-samsung-hwaseong', name: '华城 · 三星', operator: '三星电子', lng: 126.81, lat: 37.2, kind: 'memory', status: 'active', note: 'DRAM/逻辑先进制程', impact: 'high' },
  { id: 'fab-samsung-taylor', name: '德州泰勒 · 三星', operator: '三星电子', lng: -97.41, lat: 30.57, kind: 'foundry', status: 'planned', note: '美国先进代工新厂', impact: 'medium' },
  { id: 'fab-skhynix-icheon', name: '利川 · SK 海力士', operator: 'SK 海力士', lng: 127.44, lat: 37.27, kind: 'memory', status: 'active', note: 'HBM3E/HBM4 高带宽存储核心（AI 算力瓶颈）', impact: 'critical' },
  { id: 'fab-intel-hillsboro', name: '俄勒冈希尔斯伯勒 · Intel', operator: 'Intel', lng: -122.93, lat: 45.54, kind: 'idm', status: 'active', note: 'Intel 18A（1.8nm）研发与试产主基地', impact: 'high' },
  { id: 'fab-intel-chandler', name: '亚利桑那钱德勒 · Intel', operator: 'Intel', lng: -111.94, lat: 33.06, kind: 'idm', status: 'active', note: 'Intel 18A 大规模量产基地', impact: 'high' },
  { id: 'fab-intel-magdeburg', name: '马格德堡 · Intel', operator: 'Intel', lng: 11.63, lat: 52.13, kind: 'idm', status: 'planned', note: '欧洲大型晶圆厂（推进中）', impact: 'medium' },
  { id: 'fab-smic-shanghai', name: '上海 · 中芯国际', operator: '中芯国际', lng: 121.6, lat: 31.27, kind: 'foundry', status: 'active', note: '中国大陆代工龙头 · N+2（7nm 级）受限 EUV', impact: 'critical' },
  { id: 'fab-micron-boise', name: '爱达荷博伊西 · 美光', operator: '美光', lng: -116.2, lat: 43.61, kind: 'memory', status: 'active', note: 'DRAM 研发与先进存储', impact: 'medium' },
  { id: 'fab-gf-malta', name: '纽约马耳他 · GlobalFoundries', operator: 'GlobalFoundries', lng: -73.79, lat: 42.99, kind: 'foundry', status: 'active', note: '美国成熟制程代工', impact: 'medium' },
  { id: 'fab-umc-tainan', name: '台南 · 联电', operator: '联华电子', lng: 120.25, lat: 23.0, kind: 'foundry', status: 'active', note: '成熟制程与特色工艺', impact: 'high' },
  { id: 'fab-psmc-hsinchu', name: '新竹 · 力积电', operator: '力积电', lng: 121.0, lat: 24.78, kind: 'memory', status: 'active', note: 'DRAM 与代工双轨', impact: 'medium' },
  { id: 'fab-ti-sherman', name: '德州谢尔曼 · TI', operator: '德州仪器', lng: -96.61, lat: 33.64, kind: 'idm', status: 'planned', note: '模拟芯片大型晶圆厂', impact: 'medium' },
  { id: 'fab-st-crolles', name: '克罗勒 · STMicro', operator: '意法半导体', lng: 5.93, lat: 45.27, kind: 'idm', status: 'active', note: '欧洲车用与工业芯片', impact: 'medium' },
  { id: 'fab-nxp-eindhoven', name: '埃因霍温 · NXP', operator: '恩智浦', lng: 5.47, lat: 51.44, kind: 'idm', status: 'active', note: '汽车半导体欧洲总部', impact: 'high' },
  { id: 'fab-rapidus-chitose', name: '千岁 · Rapidus', operator: 'Rapidus', lng: 141.65, lat: 42.82, kind: 'foundry', status: 'planned', note: '日本 2nm GAA 量产合资（2027 目标）', impact: 'high' },
  { id: 'fab-huahong-shanghai', name: '上海 · 华虹', operator: '华虹半导体', lng: 121.65, lat: 31.22, kind: 'foundry', status: 'active', note: '中国大陆特色工艺代工', impact: 'high' },
  { id: 'fab-yangtze-nanjing', name: '南京 · 长江存储', operator: '长江存储', lng: 118.8, lat: 32.06, kind: 'memory', status: 'active', note: 'NAND 232 层 Xtacking 3.0 国产化核心', impact: 'critical' },
  { id: 'fab-cxmt-hefei', name: '合肥 · 长鑫存储', operator: '长鑫存储', lng: 117.28, lat: 31.86, kind: 'memory', status: 'active', note: '中国大陆 DRAM 主力 · 17nm 量产中', impact: 'critical' },
  ...DENSIFY_SEMICONDUCTORS,
  ...DENSIFY_SEMICONDUCTORS_R8,
  ...DENSIFY_SEMICONDUCTORS_R9,
  ...DENSIFY_SEMICONDUCTORS_R10,
];
