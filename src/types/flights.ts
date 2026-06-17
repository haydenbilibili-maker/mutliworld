import type { FeatureCollection } from 'geojson';

/** OpenSky 解析后的单架飞机状态 */
export interface FlightState {
  icao24: string;
  callsign: string;
  originCountry: string;
  lng: number;
  lat: number;
  /** 几何高度（米），优先 geo_altitude */
  altitudeM: number | null;
  onGround: boolean;
  /** 地速 m/s */
  velocityMs: number | null;
  /** 航向角（度，真北顺时针） */
  heading: number | null;
  verticalRate: number | null;
  squawk: string | null;
  lastContact: number | null;
}

/** /api/flights 元数据 */
export interface FlightsMeta {
  generatedAt: string;
  source: string;
  total: number;
  displayed: number;
  capped: boolean;
  bbox: [number, number, number, number] | null;
  error?: string;
}

export interface FlightsResponse extends FeatureCollection {
  meta: FlightsMeta;
}
