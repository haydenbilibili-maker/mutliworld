/** 全球主要城市 — 用于 Open-Meteo 实时天气采样 */
export interface WeatherCity {
  id: string;
  name: string;
  lat: number;
  lng: number;
}

export const WEATHER_CITIES: WeatherCity[] = [
  { id: 'beijing', name: '北京', lat: 39.9042, lng: 116.4074 },
  { id: 'shanghai', name: '上海', lat: 31.2304, lng: 121.4737 },
  { id: 'tokyo', name: '东京', lat: 35.6762, lng: 139.6503 },
  { id: 'seoul', name: '首尔', lat: 37.5665, lng: 126.978 },
  { id: 'singapore', name: '新加坡', lat: 1.3521, lng: 103.8198 },
  { id: 'mumbai', name: '孟买', lat: 19.076, lng: 72.8777 },
  { id: 'delhi', name: '新德里', lat: 28.6139, lng: 77.209 },
  { id: 'sydney', name: '悉尼', lat: -33.8688, lng: 151.2093 },
  { id: 'moscow', name: '莫斯科', lat: 55.7558, lng: 37.6173 },
  { id: 'london', name: '伦敦', lat: 51.5074, lng: -0.1278 },
  { id: 'paris', name: '巴黎', lat: 48.8566, lng: 2.3522 },
  { id: 'berlin', name: '柏林', lat: 52.52, lng: 13.405 },
  { id: 'cairo', name: '开罗', lat: 30.0444, lng: 31.2357 },
  { id: 'lagos', name: '拉各斯', lat: 6.5244, lng: 3.3792 },
  { id: 'new-york', name: '纽约', lat: 40.7128, lng: -74.006 },
  { id: 'washington', name: '华盛顿', lat: 38.9072, lng: -77.0369 },
  { id: 'los-angeles', name: '洛杉矶', lat: 34.0522, lng: -118.2437 },
  { id: 'sao-paulo', name: '圣保罗', lat: -23.5505, lng: -46.6333 },
  { id: 'mexico-city', name: '墨西哥城', lat: 19.4326, lng: -99.1332 },
  { id: 'dubai', name: '迪拜', lat: 25.2048, lng: 55.2708 },
  { id: 'istanbul', name: '伊斯坦布尔', lat: 41.0082, lng: 28.9784 },
];
