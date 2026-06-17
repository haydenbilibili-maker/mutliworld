/** 实时天气点位（Open-Meteo 当前观测） */
export interface LiveWeatherPoint {
  id: string;
  name: string;
  lat: number;
  lng: number;
  temperature: number;
  humidity: number | null;
  windSpeed: number;
  windDirection: number;
  weatherCode: number;
  condition: string;
  emoji: string;
  observedAt: string;
}

export interface LiveWeatherResponse {
  points: LiveWeatherPoint[];
  generatedAt: string;
}

export interface RadarFrameMeta {
  /** RainViewer 雷达帧 Unix 时间戳（秒） */
  timestamp: number;
  /** MapLibre raster tiles 模板（含 {z}/{x}/{y}） */
  tiles: string[];
  host: string;
  generatedAt: string;
}
