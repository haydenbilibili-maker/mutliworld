/**
 * 全球主要航运通道 — 基于公开地理坐标的示意航线
 * 用于无 AIS API Key 时的结构化模拟（船舶沿航道移动）
 */

export interface ShippingLane {
  id: string;
  name: string;
  /** [经度, 纬度] 航路点 */
  waypoints: [number, number][];
  /** 该航道模拟船舶数量 */
  density: number;
}

/** 马六甲、苏伊士、巴拿马、霍尔木兹、东海/台海等关键通道 */
export const SHIPPING_LANES: ShippingLane[] = [
  {
    id: 'malacca',
    name: '马六甲海峡',
    waypoints: [
      [95.0, 6.0],
      [98.0, 4.5],
      [100.4, 2.5],
      [103.0, 1.5],
      [104.5, 1.2],
    ],
    density: 48,
  },
  {
    id: 'suez',
    name: '苏伊士运河',
    waypoints: [
      [32.35, 29.9],
      [32.35, 30.5],
      [32.35, 31.2],
      [32.3, 31.8],
    ],
    density: 32,
  },
  {
    id: 'panama',
    name: '巴拿马运河',
    waypoints: [
      [-79.95, 9.35],
      [-79.92, 9.08],
      [-79.88, 8.85],
    ],
    density: 22,
  },
  {
    id: 'hormuz',
    name: '霍尔木兹海峡',
    waypoints: [
      [55.5, 26.2],
      [56.4, 26.57],
      [57.2, 26.8],
      [58.0, 25.5],
    ],
    density: 36,
  },
  {
    id: 'ecs',
    name: '东海/台湾海峡',
    waypoints: [
      [118.0, 28.5],
      [120.0, 26.5],
      [121.5, 25.0],
      [123.0, 24.0],
      [125.0, 23.5],
    ],
    density: 42,
  },
  {
    id: 'bab-el-mandeb',
    name: '曼德海峡',
    waypoints: [
      [43.0, 12.8],
      [43.33, 12.58],
      [44.0, 12.4],
      [45.0, 12.8],
    ],
    density: 24,
  },
  {
    id: 'gibraltar',
    name: '直布罗陀海峡',
    waypoints: [
      [-6.5, 36.0],
      [-5.5, 35.97],
      [-4.5, 36.1],
      [-3.0, 36.5],
    ],
    density: 28,
  },
  {
    id: 'english-channel',
    name: '英吉利海峡',
    waypoints: [
      [-5.0, 49.5],
      [-2.0, 50.2],
      [1.5, 50.9],
      [4.0, 51.5],
    ],
    density: 30,
  },
  {
    id: 'bosphorus',
    name: '博斯普鲁斯海峡',
    waypoints: [
      [28.5, 41.0],
      [29.06, 41.12],
      [29.5, 41.25],
    ],
    density: 16,
  },
  {
    id: 'trans-pacific',
    name: '北太平洋干线',
    waypoints: [
      [139.5, 35.5],
      [160.0, 38.0],
      [180.0, 40.0],
      [-160.0, 38.0],
      [-140.0, 36.0],
      [-125.0, 34.0],
      [-118.5, 33.5],
    ],
    density: 38,
  },
  {
    id: 'trans-atlantic',
    name: '北大西洋干线',
    waypoints: [
      [-74.0, 40.5],
      [-50.0, 42.0],
      [-30.0, 44.0],
      [-10.0, 48.0],
      [2.0, 50.5],
      [-5.0, 49.0],
    ],
    density: 34,
  },
  {
    id: 'cape-route',
    name: '好望角航线',
    waypoints: [
      [18.0, -34.5],
      [25.0, -36.0],
      [40.0, -32.0],
      [55.0, -25.0],
      [65.0, -15.0],
    ],
    density: 26,
  },
  {
    id: 'south-china-sea',
    name: '南海航道',
    waypoints: [
      [104.5, 1.2],
      [108.0, 8.0],
      [112.0, 14.0],
      [115.0, 18.0],
      [118.0, 22.0],
    ],
    density: 36,
  },
  {
    id: 'persian-gulf',
    name: '波斯湾出口',
    waypoints: [
      [50.0, 26.5],
      [52.0, 26.3],
      [55.5, 26.2],
    ],
    density: 28,
  },
  {
    id: 'med-east',
    name: '地中海东线',
    waypoints: [
      [32.3, 31.8],
      [30.0, 33.0],
      [28.0, 34.5],
      [25.0, 35.5],
      [20.0, 36.5],
    ],
    density: 22,
  },
];
