/**
 * 近地标量场配色 — 多套调色方案（对标竞品丰富视觉），叠加层与图例栏共用，避免漂移。
 * 序列型(aqi/thermal)随配色方案切换；diverging(海温偏差)与 baa(白化预警) 保留语义色阶不被覆盖。
 * Turbo / Viridis 为公开科学色图的原创近似实现。
 */

import type { ScalarRamp } from '@/store/useNearEarthStore';

export type ColorScheme = 'default' | 'turbo' | 'viridis' | 'grayscale';

export const COLOR_SCHEME_LABELS: Record<ColorScheme, string> = {
  default: '经典',
  turbo: 'Turbo',
  viridis: 'Viridis',
  grayscale: '灰度',
};

type Stop = [number, number[]];

const SEQUENTIAL: Record<ColorScheme, Stop[]> = {
  default: [[0, [56, 189, 248]], [0.25, [74, 222, 128]], [0.5, [250, 204, 21]], [0.7, [251, 146, 60]], [0.85, [248, 113, 113]], [1, [167, 71, 254]]],
  turbo: [[0, [48, 18, 59]], [0.25, [33, 144, 241]], [0.5, [60, 218, 120]], [0.7, [250, 204, 21]], [0.85, [247, 110, 35]], [1, [122, 4, 3]]],
  viridis: [[0, [68, 1, 84]], [0.25, [59, 82, 139]], [0.5, [33, 145, 140]], [0.7, [94, 201, 98]], [1, [253, 231, 37]]],
  grayscale: [[0, [30, 41, 59]], [0.5, [148, 163, 184]], [1, [241, 245, 249]]],
};

const THERMAL: Record<ColorScheme, Stop[]> = {
  default: [[0, [37, 99, 235]], [0.3, [56, 189, 248]], [0.5, [45, 212, 191]], [0.65, [250, 204, 21]], [0.82, [251, 146, 60]], [1, [239, 68, 68]]],
  turbo: SEQUENTIAL.turbo,
  viridis: SEQUENTIAL.viridis,
  grayscale: SEQUENTIAL.grayscale,
};

const DIVERGING: Stop[] = [[0, [37, 99, 235]], [0.3, [96, 165, 250]], [0.5, [241, 245, 249]], [0.7, [248, 113, 113]], [1, [185, 28, 28]]];
const BAA: Stop[] = [[0, [203, 213, 225]], [0.25, [250, 204, 21]], [0.5, [251, 146, 60]], [0.75, [239, 68, 68]], [1, [127, 29, 29]]];

export type RGB = [number, number, number];

function stopsFor(ramp: ScalarRamp, scheme: ColorScheme): Stop[] {
  switch (ramp) {
    case 'aqi': return SEQUENTIAL[scheme];
    case 'thermal': return THERMAL[scheme];
    case 'diverging': return DIVERGING; // 语义守恒：偏差冷暖
    case 'baa': return BAA; // 语义守恒：预警分级
  }
}

export function colorFor(ramp: ScalarRamp, scheme: ColorScheme, x: number): RGB {
  const stops = stopsFor(ramp, scheme);
  const t = Math.max(0, Math.min(1, x));
  for (let i = 1; i < stops.length; i++) {
    if (t <= stops[i][0]) {
      const [t0, c0] = stops[i - 1], [t1, c1] = stops[i];
      const f = (t - t0) / (t1 - t0 || 1);
      return [0, 1, 2].map((k) => Math.round(c0[k] + (c1[k] - c0[k]) * f)) as RGB;
    }
  }
  return stops[stops.length - 1][1] as RGB;
}

/** 生成 CSS linear-gradient 用于图例条 */
export function rampCss(ramp: ScalarRamp, scheme: ColorScheme): string {
  const stops = stopsFor(ramp, scheme);
  const parts = stops.map(([pos, c]) => `rgb(${c[0]},${c[1]},${c[2]}) ${Math.round(pos * 100)}%`);
  return `linear-gradient(90deg,${parts.join(',')})`;
}
