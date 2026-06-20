import { create } from 'zustand';

export type AqParam =
  | 'carbon_monoxide'
  | 'sulphur_dioxide'
  | 'nitrogen_dioxide'
  | 'ozone'
  | 'pm2_5'
  | 'pm10';

export const AQ_META: Record<AqParam, { label: string; unit: string; max: number }> = {
  carbon_monoxide: { label: '一氧化碳 CO', unit: 'μg/m³', max: 1000 },
  sulphur_dioxide: { label: '二氧化硫 SO₂', unit: 'μg/m³', max: 80 },
  nitrogen_dioxide: { label: '二氧化氮 NO₂', unit: 'μg/m³', max: 80 },
  ozone: { label: '臭氧 O₃', unit: 'μg/m³', max: 180 },
  pm2_5: { label: 'PM2.5', unit: 'μg/m³', max: 120 },
  pm10: { label: 'PM10', unit: 'μg/m³', max: 180 },
};

interface NearEarthStore {
  param: AqParam;
  setParam: (p: AqParam) => void;
}

export const useNearEarthStore = create<NearEarthStore>((set) => ({
  param: 'nitrogen_dioxide',
  setParam: (param) => set({ param }),
}));
