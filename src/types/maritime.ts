import type { FeatureCollection } from 'geojson';

/** 解析后的单艘船舶 AIS 状态 */
export interface VesselState {
  mmsi: string;
  name: string;
  vesselType: string;
  vesselTypeLabel: string;
  flag: string;
  lng: number;
  lat: number;
  /** 对地航速（节） */
  speedKnots: number | null;
  /** 对地航向（度，真北顺时针） */
  course: number | null;
  destination: string | null;
  lastContact: number | null;
}

export type MaritimeSource = 'aisstream' | 'simulated' | 'aisstream+simulated';

/** /api/maritime/live 元数据 */
export interface MaritimeMeta {
  generatedAt: string;
  source: MaritimeSource;
  sourceLabel: string;
  total: number;
  displayed: number;
  capped: boolean;
  bbox: [number, number, number, number] | null;
  simulated?: boolean;
  error?: string;
  stale?: boolean;
}

export interface MaritimeResponse extends FeatureCollection {
  meta: MaritimeMeta;
}
