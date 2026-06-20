/**
 * 天体注册表 — 多天体探索 v2.0 Phase 0
 * 导入即注册 地球 / 月球 / 火星；其余代码统一从 '@/bodies' 取 API。
 */

import type { BodyModule, CelestialBody } from '@/types/body';

const earth: BodyModule = {
  id: 'earth',
  name: '地球',
  icon: '🌍',
  tagline: '天 · 地 · 海 三位一体态势',
  center: [105, 28],
  zoom: 3.5,
  basemapColor: '#0A0E17',
  defaultLayers: [],
  enabled: true,
};

const moon: BodyModule = {
  id: 'moon',
  name: '月球',
  icon: '🌙',
  tagline: '阿波罗 · 嫦娥 · 在轨绕月',
  center: [0, 0],
  zoom: 2,
  basemapColor: '#3a3a3e',
  defaultLayers: [],
  enabled: true,
};

const mars: BodyModule = {
  id: 'mars',
  name: '火星',
  icon: '🔴',
  tagline: '巡视器 · 着陆器 · 绕火',
  center: [0, 0],
  zoom: 2,
  basemapColor: '#7a3b2b',
  defaultLayers: [],
  enabled: true,
};

const mercury: BodyModule = {
  id: 'mercury',
  name: '水星',
  icon: '☿️',
  tagline: 'Mariner 10 · MESSENGER · BepiColombo',
  center: [0, 0],
  zoom: 2,
  basemapColor: '#6b6660',
  defaultLayers: [],
  enabled: true,
};

const venus: BodyModule = {
  id: 'venus',
  name: '金星',
  icon: '♀️',
  tagline: '金星号着陆 · Magellan 雷达测绘',
  center: [0, 0],
  zoom: 2,
  basemapColor: '#b08a4f',
  defaultLayers: [],
  enabled: true,
};

const titan: BodyModule = {
  id: 'titan',
  name: '泰坦（土卫六）',
  icon: '🟠',
  tagline: '惠更斯号着陆 · 卡西尼 · 外太阳系唯一着陆',
  center: [0, 0],
  zoom: 2,
  basemapColor: '#c8932f',
  defaultLayers: [],
  enabled: true,
};

const europa: BodyModule = {
  id: 'europa',
  name: '欧罗巴（木卫二）',
  icon: '🧊',
  tagline: 'Galileo 飞掠 · Europa Clipper · JUICE',
  center: [0, 0],
  zoom: 2,
  basemapColor: '#9bb4c4',
  defaultLayers: [],
  enabled: true,
};

const pluto: BodyModule = {
  id: 'pluto',
  name: '冥王星',
  icon: '🤍',
  tagline: '新视野号飞掠（2015）· 心形冰原',
  center: [0, 0],
  zoom: 2,
  basemapColor: '#b7a48c',
  defaultLayers: [],
  enabled: true,
};

const ceres: BodyModule = {
  id: 'ceres',
  name: '谷神星',
  icon: '⚪',
  tagline: '黎明号环绕 · 最大小行星/矮行星',
  center: [0, 0],
  zoom: 2,
  basemapColor: '#5e5a55',
  defaultLayers: [],
  enabled: true,
};

const REGISTRY = new Map<CelestialBody, BodyModule>([
  [earth.id, earth],
  [moon.id, moon],
  [mars.id, mars],
  [mercury.id, mercury],
  [venus.id, venus],
  [titan.id, titan],
  [europa.id, europa],
  [pluto.id, pluto],
  [ceres.id, ceres],
]);

export function getBody(id: CelestialBody): BodyModule | undefined {
  return REGISTRY.get(id);
}

export function listBodies(): BodyModule[] {
  return Array.from(REGISTRY.values()).filter((b) => b.enabled);
}

export const DEFAULT_BODY: CelestialBody = 'earth';
