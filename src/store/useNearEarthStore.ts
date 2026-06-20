import { create } from 'zustand';
import type { LayerId } from '@/types/geo';

/**
 * 近地标量叠加注册表 — 统一管理多数据源标量场（对标 earth.nullschool Overlay 选择器）。
 * 每个参数声明：取数端点 + 单位/范围 + 色阶类型 + 所属图层（用于级联门控）。
 * 数据源全部免密钥真实数据：Open-Meteo Air-Quality(CAMS) / Open-Meteo Marine / NOAA Coral Reef Watch。
 */

export type ScalarParam =
  // 化学污染物（气体）
  | 'carbon_monoxide' | 'sulphur_dioxide' | 'nitrogen_dioxide' | 'ozone'
  // 颗粒物
  | 'pm2_5' | 'pm10'
  // 海洋标量
  | 'sea_surface_temperature' | 'wave_height'
  // NOAA 珊瑚礁观察
  | 'sst_anomaly' | 'bleaching_alert_area' | 'degree_heating_week'
  // 大气
  | 'air_temperature' | 'precipitation';

/** 向后兼容别名（旧引用） */
export type AqParam = ScalarParam;

export type ScalarRamp = 'aqi' | 'thermal' | 'diverging' | 'baa';

export interface ScalarMeta {
  label: string;
  unit: string;
  /** 色阶下界（diverging 用，如海温偏差 -5；其余多为 0） */
  min: number;
  /** 色阶上界 */
  max: number;
  /** 取数端点 */
  endpoint: string;
  /** 端点返回 params 中的键 */
  key: string;
  /** 色阶类型 */
  ramp: ScalarRamp;
  /** 所属近地图层（开启该层方显示此叠加） */
  layer: LayerId;
}

export const SCALAR_META: Record<ScalarParam, ScalarMeta> = {
  carbon_monoxide: { label: '一氧化碳 CO', unit: 'μg/m³', min: 0, max: 1000, endpoint: '/api/airquality-grid', key: 'carbon_monoxide', ramp: 'aqi', layer: 'air_pollutants' },
  sulphur_dioxide: { label: '二氧化硫 SO₂', unit: 'μg/m³', min: 0, max: 80, endpoint: '/api/airquality-grid', key: 'sulphur_dioxide', ramp: 'aqi', layer: 'air_pollutants' },
  nitrogen_dioxide: { label: '二氧化氮 NO₂', unit: 'μg/m³', min: 0, max: 80, endpoint: '/api/airquality-grid', key: 'nitrogen_dioxide', ramp: 'aqi', layer: 'air_pollutants' },
  ozone: { label: '臭氧 O₃', unit: 'μg/m³', min: 0, max: 180, endpoint: '/api/airquality-grid', key: 'ozone', ramp: 'aqi', layer: 'air_pollutants' },
  pm2_5: { label: 'PM2.5', unit: 'μg/m³', min: 0, max: 120, endpoint: '/api/airquality-grid', key: 'pm2_5', ramp: 'aqi', layer: 'particulates' },
  pm10: { label: 'PM10', unit: 'μg/m³', min: 0, max: 180, endpoint: '/api/airquality-grid', key: 'pm10', ramp: 'aqi', layer: 'particulates' },
  sea_surface_temperature: { label: '海面温度 SST', unit: '°C', min: -2, max: 32, endpoint: '/api/marine-scalar-grid', key: 'sea_surface_temperature', ramp: 'thermal', layer: 'sea_temp' },
  wave_height: { label: '有效波高', unit: 'm', min: 0, max: 10, endpoint: '/api/marine-scalar-grid', key: 'wave_height', ramp: 'thermal', layer: 'sig_wave_height' },
  sst_anomaly: { label: '海温偏差', unit: '°C', min: -5, max: 5, endpoint: '/api/noaa-crw-grid', key: 'sst_anomaly', ramp: 'diverging', layer: 'sst_anomaly' },
  bleaching_alert_area: { label: '白化预警 BAA', unit: '级', min: 0, max: 4, endpoint: '/api/noaa-crw-grid', key: 'bleaching_alert_area', ramp: 'baa', layer: 'coral_baa' },
  degree_heating_week: { label: '度日热 DHW', unit: '°C·周', min: 0, max: 16, endpoint: '/api/noaa-crw-grid', key: 'degree_heating_week', ramp: 'thermal', layer: 'dhw' },
  air_temperature: { label: '2米气温', unit: '°C', min: -30, max: 45, endpoint: '/api/atmo-grid', key: 'temperature_2m', ramp: 'thermal', layer: 'air_temp' },
  precipitation: { label: '降水', unit: 'mm', min: 0, max: 30, endpoint: '/api/atmo-grid', key: 'precipitation', ramp: 'aqi', layer: 'precip' },
};

/** 向后兼容别名（旧引用 AQ_META） */
export const AQ_META = SCALAR_META;

/** 叠加层 → 默认参数（开启该层时自动选中） */
export const LAYER_DEFAULT_PARAM: Partial<Record<LayerId, ScalarParam>> = {
  air_pollutants: 'nitrogen_dioxide',
  particulates: 'pm2_5',
  sea_temp: 'sea_surface_temperature',
  sig_wave_height: 'wave_height',
  sst_anomaly: 'sst_anomaly',
  coral_baa: 'bleaching_alert_area',
  dhw: 'degree_heating_week',
  air_temp: 'air_temperature',
  precip: 'precipitation',
};

interface NearEarthStore {
  param: ScalarParam;
  setParam: (p: ScalarParam) => void;
}

export const useNearEarthStore = create<NearEarthStore>((set) => ({
  param: 'nitrogen_dioxide',
  setParam: (param) => set({ param }),
}));
