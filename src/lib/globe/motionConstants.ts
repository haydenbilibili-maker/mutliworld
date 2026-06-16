/** 自转周期（秒）— 1x 下约 60 秒一圈（加速演示，非真实 24h） */
export const ROTATION_PERIOD_S = 60;

export type GlobeMotionSpeed = 1 | 10 | 100;

export const GLOBE_MOTION_SPEEDS: GlobeMotionSpeed[] = [1, 10, 100];

/** 宇宙层 3D 地球「回正中国」正视图参数 */
export const CHINA_GLOBE_VIEW = {
  center: [105, 35] as [number, number],
  zoom: 2.8,
  bearing: 0,
  pitch: 0,
};

export const CHINA_GLOBE_FLY_DURATION_MS = 800;
