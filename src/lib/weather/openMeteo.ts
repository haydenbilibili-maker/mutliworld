import { WEATHER_CITIES } from '@/lib/weather/cities';
import { wmoToCondition } from '@/lib/weather/wmoCode';
import type { LiveWeatherPoint } from '@/types/weather';

interface OpenMeteoCurrent {
  time?: string;
  temperature_2m?: number;
  relative_humidity_2m?: number;
  weather_code?: number;
  wind_speed_10m?: number;
  wind_direction_10m?: number;
}

interface OpenMeteoLocation {
  latitude?: number;
  longitude?: number;
  current?: OpenMeteoCurrent;
}

const CURRENT_VARS = [
  'temperature_2m',
  'relative_humidity_2m',
  'weather_code',
  'wind_speed_10m',
  'wind_direction_10m',
].join(',');

/** 批量拉取主要城市当前天气（Open-Meteo，免费无 key） */
export async function fetchLiveWeatherPoints(): Promise<LiveWeatherPoint[]> {
  const lats = WEATHER_CITIES.map((c) => c.lat).join(',');
  const lngs = WEATHER_CITIES.map((c) => c.lng).join(',');
  const url =
    `https://api.open-meteo.com/v1/forecast?latitude=${lats}&longitude=${lngs}` +
    `&current=${CURRENT_VARS}&timezone=auto&wind_speed_unit=kmh`;

  const res = await fetch(url, {
    next: { revalidate: 900 },
    headers: { Accept: 'application/json' },
  });
  if (!res.ok) throw new Error(`Open-Meteo 请求失败 (${res.status})`);

  const data = (await res.json()) as OpenMeteoLocation | OpenMeteoLocation[];
  const locations = Array.isArray(data) ? data : [data];

  const points: LiveWeatherPoint[] = [];

  for (let i = 0; i < WEATHER_CITIES.length; i += 1) {
    const city = WEATHER_CITIES[i];
    const loc = locations[i];
    const cur = loc?.current;
    if (!cur || cur.temperature_2m == null) continue;

    const code = cur.weather_code ?? 0;
    const { label, emoji } = wmoToCondition(code);

    points.push({
      id: city.id,
      name: city.name,
      lat: city.lat,
      lng: city.lng,
      temperature: Math.round(cur.temperature_2m),
      humidity: cur.relative_humidity_2m ?? null,
      windSpeed: Math.round(cur.wind_speed_10m ?? 0),
      windDirection: cur.wind_direction_10m ?? 0,
      weatherCode: code,
      condition: label,
      emoji,
      observedAt: cur.time ?? new Date().toISOString(),
    });
  }

  return points;
}
