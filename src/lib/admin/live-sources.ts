import 'server-only';

import { fetchOpenSkyFlights } from '@/lib/flights/opensky';
import { fetchMaritimeVessels } from '@/lib/maritime/provider';
import { fetchPizzintWatch } from '@/lib/pizza-index/pizzint';
import { fetchLiveWeatherPoints } from '@/lib/weather/openMeteo';
import { loadTleDatabase } from '@/lib/orbital/tleStore';

export type LiveSourceStatus = 'ok' | 'degraded' | 'error' | 'unknown';

export interface LiveSourceProbe {
  id: string;
  name: string;
  provider: string;
  layerIds: string[];
  status: LiveSourceStatus;
  lastCheckedAt: string;
  lastFetchAt: string | null;
  latencyMs: number | null;
  detail: string;
  error?: string;
  cacheTtl: string;
  apiRoute: string;
}

async function probeMaritime(): Promise<Pick<LiveSourceProbe, 'status' | 'latencyMs' | 'detail' | 'error'>> {
  const start = Date.now();
  try {
    const { vessels, simulated } = await fetchMaritimeVessels({ limit: 50 });
    return {
      status: vessels.length > 0 ? 'ok' : 'degraded',
      latencyMs: Date.now() - start,
      detail: `${simulated ? '航运通道模拟' : 'AISStream'} · ${vessels.length} 艘`,
    };
  } catch (err) {
    return {
      status: 'error',
      latencyMs: Date.now() - start,
      detail: '海运数据拉取失败',
      error: err instanceof Error ? err.message : '未知错误',
    };
  }
}

async function probeOpenSky(): Promise<Pick<LiveSourceProbe, 'status' | 'latencyMs' | 'detail' | 'error'>> {
  const start = Date.now();
  try {
    const { flights, total } = await fetchOpenSkyFlights({ limit: 50 });
    const count = flights.length;
    return {
      status: count > 0 ? 'ok' : 'degraded',
      latencyMs: Date.now() - start,
      detail: `OpenSky 返回 ${count} 条航迹（总计 ${total}）`,
    };
  } catch (err) {
    return {
      status: 'error',
      latencyMs: Date.now() - start,
      detail: 'OpenSky 拉取失败',
      error: err instanceof Error ? err.message : '未知错误',
    };
  }
}

async function probeOpenMeteo(): Promise<Pick<LiveSourceProbe, 'status' | 'latencyMs' | 'detail' | 'error'>> {
  const start = Date.now();
  try {
    const points = await fetchLiveWeatherPoints();
    return {
      status: points.length > 0 ? 'ok' : 'degraded',
      latencyMs: Date.now() - start,
      detail: `Open-Meteo 返回 ${points.length} 个城市观测点`,
    };
  } catch (err) {
    return {
      status: 'error',
      latencyMs: Date.now() - start,
      detail: 'Open-Meteo 拉取失败',
      error: err instanceof Error ? err.message : '未知错误',
    };
  }
}

async function probeRainViewer(): Promise<Pick<LiveSourceProbe, 'status' | 'latencyMs' | 'detail' | 'error'>> {
  const start = Date.now();
  try {
    const res = await fetch('https://api.rainviewer.com/public/weather-maps.json', {
      next: { revalidate: 0 },
    });
    if (!res.ok) {
      return {
        status: 'error',
        latencyMs: Date.now() - start,
        detail: 'RainViewer API 不可用',
        error: `HTTP ${res.status}`,
      };
    }
    const data = (await res.json()) as { radar?: { past?: unknown[] } };
    const frames = data.radar?.past?.length ?? 0;
    return {
      status: frames > 0 ? 'ok' : 'degraded',
      latencyMs: Date.now() - start,
      detail: `RainViewer 雷达 ${frames} 帧历史`,
    };
  } catch (err) {
    return {
      status: 'error',
      latencyMs: Date.now() - start,
      detail: 'RainViewer 拉取失败',
      error: err instanceof Error ? err.message : '未知错误',
    };
  }
}

async function probePizzint(): Promise<
  Pick<LiveSourceProbe, 'status' | 'latencyMs' | 'detail' | 'error'> & {
    lastFetchAt?: string | null;
  }
> {
  const start = Date.now();
  try {
    const live = await fetchPizzintWatch();
    if (live) {
      return {
        status: 'ok',
        latencyMs: Date.now() - start,
        lastFetchAt: live.updatedAt,
        detail: `pizzint.watch 实时 · 指数 ${live.score} · ${live.venues.length} 门店`,
      };
    }
    return {
      status: 'degraded',
      latencyMs: Date.now() - start,
      lastFetchAt: null,
      detail: 'pizzint.watch 不可用，API 将回退模拟数据',
      error: '上游无响应或解析失败',
    };
  } catch (err) {
    return {
      status: 'error',
      latencyMs: Date.now() - start,
      lastFetchAt: null,
      detail: 'pizzint.watch 探测失败',
      error: err instanceof Error ? err.message : '未知错误',
    };
  }
}

function probeTle(): Pick<LiveSourceProbe, 'status' | 'detail' | 'lastFetchAt' | 'error'> {
  const tle = loadTleDatabase();
  const age = tle.fetchedAt ? Date.parse(tle.fetchedAt) : NaN;
  const stale = !Number.isFinite(age) || Date.now() - age > 7 * 24 * 60 * 60 * 1000;

  return {
    status: tle.source === 'seed-fallback' ? 'degraded' : stale ? 'degraded' : 'ok',
    lastFetchAt: tle.fetchedAt || null,
    detail: `CelesTrak · ${tle.objects.length} 物体 · 来源 ${tle.source}`,
    error: tle.source === 'seed-fallback' ? '使用种子 TLE 兜底' : stale ? 'TLE 数据可能过期（>7天）' : undefined,
  };
}

/** 服务端探测各实时数据源（不经由公开 API 路由） */
export async function probeLiveSources(): Promise<LiveSourceProbe[]> {
  const checkedAt = new Date().toISOString();

  const [opensky, maritime, meteo, rainviewer, pizzint] = await Promise.all([
    probeOpenSky(),
    probeMaritime(),
    probeOpenMeteo(),
    probeRainViewer(),
    probePizzint(),
  ]);

  const tle = probeTle();

  return [
    {
      id: 'opensky',
      name: 'OpenSky Network',
      provider: 'OpenSky ADS-B',
      layerIds: ['live_flights'],
      ...opensky,
      lastCheckedAt: checkedAt,
      lastFetchAt: checkedAt,
      cacheTtl: '45 秒（/api/flights 内存缓存）',
      apiRoute: '/api/flights',
    },
    {
      id: 'aisstream',
      name: 'AISStream / 航运模拟',
      provider: process.env.AISSTREAM_API_KEY ? 'AISStream.io' : '航运通道模拟',
      layerIds: ['live_maritime'],
      ...maritime,
      lastCheckedAt: checkedAt,
      lastFetchAt: checkedAt,
      cacheTtl: '60 秒（/api/maritime/live 内存缓存）',
      apiRoute: '/api/maritime/live',
    },
    {
      id: 'open-meteo',
      name: 'Open-Meteo',
      provider: 'Open-Meteo API',
      layerIds: ['live_weather'],
      ...meteo,
      lastCheckedAt: checkedAt,
      lastFetchAt: checkedAt,
      cacheTtl: '15 分钟（CDN s-maxage=900）',
      apiRoute: '/api/weather',
    },
    {
      id: 'rainviewer',
      name: 'RainViewer',
      provider: 'RainViewer 雷达瓦片',
      layerIds: ['live_weather'],
      ...rainviewer,
      lastCheckedAt: checkedAt,
      lastFetchAt: checkedAt,
      cacheTtl: '随 /api/weather/radar 缓存',
      apiRoute: '/api/weather/radar',
    },
    {
      id: 'pizzint',
      name: 'PizzINT',
      provider: 'pizzint.watch',
      layerIds: ['pizza_index'],
      ...pizzint,
      lastCheckedAt: checkedAt,
      lastFetchAt: pizzint.lastFetchAt ?? null,
      cacheTtl: '5 分钟实时 / 3 分钟模拟',
      apiRoute: '/api/osint/pentagon-pizza',
    },
    {
      id: 'celestrak-tle',
      name: 'CelesTrak TLE',
      provider: 'CelesTrak',
      layerIds: ['space_stations', 'satellites', 'space_debris'],
      status: tle.status,
      latencyMs: null,
      detail: tle.detail,
      error: tle.error,
      lastCheckedAt: checkedAt,
      lastFetchAt: tle.lastFetchAt,
      cacheTtl: '本地 tle.json · /api/orbital-objects 15s',
      apiRoute: '/api/orbital/tle/refresh',
    },
  ];
}
