/**
 * 全球主要军事冲突区 — 示意性多边形（非测绘级精度）
 * 用于 conflict_zones 图层：俄乌、中东、苏丹、缅甸、萨赫勒、台海等
 */

export type ConflictIntensity = 'high' | 'medium';

export interface ConflictZone {
  id: string;
  name: string;
  nameZh: string;
  status: string;
  since: string;
  intensity: ConflictIntensity;
  description: string;
  /** 闭合环坐标 [经度, 纬度] */
  ring: [number, number][];
  /** 标注位置 */
  label: [number, number];
  /** 虚线边界（敏感缓冲区，如台海） */
  dashed?: boolean;
  fillColor?: string;
  lineColor?: string;
}

/** 示意性冲突区多边形（5–16 顶点/区） */
export const GLOBAL_CONFLICT_ZONES: ConflictZone[] = [
  {
    id: 'cz-ukraine-east',
    name: 'Eastern Ukraine front',
    nameZh: '俄乌东部前线',
    status: 'active',
    since: '2022-02',
    intensity: 'high',
    description:
      '顿巴斯、扎波罗热与赫尔松方向持续交火，战线呈拉锯态势（示意范围，非精确前线）。',
    ring: [
      [36.2, 48.9],
      [40.1, 49.2],
      [39.4, 47.1],
      [37.2, 46.3],
      [33.4, 46.6],
      [32.6, 47.4],
      [35.2, 48.6],
      [36.2, 48.9],
    ],
    label: [37.5, 48.2],
    fillColor: '#FF4D4F',
    lineColor: '#FF7875',
  },
  {
    id: 'cz-gaza',
    name: 'Gaza Strip',
    nameZh: '加沙地带',
    status: 'active',
    since: '2023-10',
    intensity: 'high',
    description: '加沙地带人道危机与军事冲突持续，停火谈判反复（示意范围）。',
    ring: [
      [34.22, 31.22],
      [34.54, 31.22],
      [34.54, 31.57],
      [34.22, 31.57],
      [34.22, 31.22],
    ],
    label: [34.38, 31.4],
    fillColor: '#FF4D4F',
    lineColor: '#FF7875',
  },
  {
    id: 'cz-west-bank',
    name: 'West Bank tensions',
    nameZh: '约旦河西岸',
    status: 'active',
    since: 'ongoing',
    intensity: 'medium',
    description: '约旦河西岸定居点扩张与治安摩擦持续，局势高度敏感（示意范围）。',
    ring: [
      [34.92, 31.38],
      [35.52, 31.38],
      [35.52, 32.42],
      [34.92, 32.42],
      [34.92, 31.38],
    ],
    label: [35.22, 31.9],
    fillColor: '#FF7A45',
    lineColor: '#FFA940',
  },
  {
    id: 'cz-lebanon-border',
    name: 'Lebanon–Israel border',
    nameZh: '黎以边境',
    status: 'active',
    since: '2023-10',
    intensity: 'high',
    description: '黎巴嫩南部边境交火与火箭弹袭击频发，真主党与以军对峙（示意范围）。',
    ring: [
      [35.08, 33.05],
      [35.82, 33.05],
      [35.82, 33.42],
      [35.08, 33.42],
      [35.08, 33.05],
    ],
    label: [35.45, 33.24],
    fillColor: '#FF4D4F',
    lineColor: '#FF7875',
  },
  {
    id: 'cz-yemen',
    name: 'Yemen (Houthi areas)',
    nameZh: '也门胡塞区',
    status: 'active',
    since: '2014',
    intensity: 'high',
    description: '胡塞武装控制区及红海航运袭击外溢，区域冲突与封锁风险并存（示意范围）。',
    ring: [
      [42.2, 14.6],
      [44.4, 14.6],
      [44.4, 17.2],
      [43.2, 17.2],
      [42.2, 16.2],
      [42.2, 14.6],
    ],
    label: [43.3, 15.9],
    fillColor: '#FF4D4F',
    lineColor: '#FF7875',
  },
  {
    id: 'cz-syria',
    name: 'Syria conflict pockets',
    nameZh: '叙利亚冲突区',
    status: 'active',
    since: '2011',
    intensity: 'medium',
    description: '伊德利卜及东北部局部冲突与恐怖主义残余活动（示意范围）。',
    ring: [
      [36.4, 35.6],
      [37.6, 35.6],
      [37.6, 36.4],
      [36.4, 36.4],
      [36.4, 35.6],
    ],
    label: [37.0, 36.0],
    fillColor: '#FF7A45',
    lineColor: '#FFA940',
  },
  {
    id: 'cz-sudan-darfur',
    name: 'Darfur civil war',
    nameZh: '达尔富尔',
    status: 'active',
    since: '2023-04',
    intensity: 'high',
    description: '苏丹达尔富尔地区武装冲突与人道危机持续（示意范围）。',
    ring: [
      [22.2, 12.2],
      [26.8, 12.2],
      [26.8, 15.8],
      [22.2, 15.8],
      [22.2, 12.2],
    ],
    label: [24.5, 14.0],
    fillColor: '#FF4D4F',
    lineColor: '#FF7875',
  },
  {
    id: 'cz-sudan-khartoum',
    name: 'Khartoum civil war',
    nameZh: '喀土穆战区',
    status: 'active',
    since: '2023-04',
    intensity: 'high',
    description: '苏丹武装部队与快速支援部队在首都圈交战，局势动荡（示意范围）。',
    ring: [
      [31.6, 15.4],
      [32.8, 15.4],
      [32.8, 15.9],
      [31.6, 15.9],
      [31.6, 15.4],
    ],
    label: [32.2, 15.65],
    fillColor: '#FF4D4F',
    lineColor: '#FF7875',
  },
  {
    id: 'cz-myanmar-north',
    name: 'Myanmar ethnic conflicts',
    nameZh: '缅甸冲突区',
    status: 'active',
    since: '2021-02',
    intensity: 'high',
    description: '缅北及东部民族武装与军政府战事蔓延，边境外溢风险（示意范围）。',
    ring: [
      [96.2, 16.5],
      [99.2, 16.5],
      [99.2, 23.5],
      [96.2, 23.5],
      [96.2, 16.5],
    ],
    label: [97.7, 20.0],
    fillColor: '#FF4D4F',
    lineColor: '#FF7875',
  },
  {
    id: 'cz-sahel',
    name: 'Sahel instability belt',
    nameZh: '萨赫勒不稳定带',
    status: 'active',
    since: '2012',
    intensity: 'medium',
    description: '马里、布基纳法索、尼日尔安全形势恶化，恐怖主义与政变连锁（示意范围）。',
    ring: [
      [-5.2, 11.2],
      [4.8, 11.2],
      [4.8, 16.8],
      [-5.2, 16.8],
      [-5.2, 11.2],
    ],
    label: [-0.2, 14.0],
    fillColor: '#FF7A45',
    lineColor: '#FFA940',
  },
  {
    id: 'cz-taiwan-strait',
    name: 'Taiwan Strait sensitive zone',
    nameZh: '台海敏感区',
    status: 'sensitive',
    since: 'ongoing',
    intensity: 'medium',
    description:
      '台海局势高度敏感，双方军事与外交博弈持续；本区为示意性缓冲区，非主张范围（种子/示例）。',
    dashed: true,
    ring: [
      [118.2, 23.6],
      [121.8, 23.6],
      [121.8, 26.2],
      [118.2, 26.2],
      [118.2, 23.6],
    ],
    label: [120.0, 24.9],
    fillColor: '#f59e0b',
    lineColor: '#fbbf24',
  },
];
