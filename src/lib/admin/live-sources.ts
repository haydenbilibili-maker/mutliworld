import 'server-only';

import { fetchAdsbFlights } from '@/lib/flights/adsb';
import { fetchMaritimeVessels } from '@/lib/maritime/provider';
import { fetchPizzintWatch } from '@/lib/pizza-index/pizzint';
import { fetchLiveWeatherPoints } from '@/lib/weather/openMeteo';
import { loadTleDatabase } from '@/lib/orbital/tleStore';
import { hasLlm, LLM_MODEL_NAME } from '@/lib/llm/client';
import type { KeyRequirement } from '@/lib/layers/liveSourceKeys';
import { getKeyInfoBySource, sourceKeyConfigured } from '@/lib/layers/liveSourceKeys';

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
  /** 鉴权方式：无 Key / 免费 Key / 付费 Key */
  keyRequirement: KeyRequirement;
  /** 所需 env 变量名（无 Key 时为 null） */
  keyEnvVar: string | null;
  /** 运行时是否已配置所需 Key（服务端读取 env 后的真实态） */
  keyConfigured: boolean;
}

/** 从注册表填充 Key 需求字段（服务端运行时真实配置态） */
function keyMeta(sourceId: string): {
  keyRequirement: KeyRequirement;
  keyEnvVar: string | null;
  keyConfigured: boolean;
} {
  const info = getKeyInfoBySource(sourceId);
  if (!info) return { keyRequirement: 'none', keyEnvVar: null, keyConfigured: true };
  return {
    keyRequirement: info.keyRequirement,
    keyEnvVar: info.envVar,
    keyConfigured: sourceKeyConfigured(sourceId),
  };
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

async function probeFlights(): Promise<Pick<LiveSourceProbe, 'status' | 'latencyMs' | 'detail' | 'error'>> {
  const start = Date.now();
  try {
    // 探测覆盖密集区（欧洲）以反映社区 ADS-B 真实可用性
    const { flights, total, source } = await fetchAdsbFlights({
      bbox: { lamin: 45, lomin: 2, lamax: 52, lomax: 12 },
      limit: 50,
    });
    const count = flights.length;
    return {
      status: count > 0 ? 'ok' : 'degraded',
      latencyMs: Date.now() - start,
      detail: `${source} · 欧洲样本 ${count} 架（总计 ${total}）· 中国内陆覆盖稀疏`,
    };
  } catch (err) {
    return {
      status: 'error',
      latencyMs: Date.now() - start,
      detail: '社区 ADS-B 拉取失败（将回退 OpenSky）',
      error: err instanceof Error ? err.message : '未知错误',
    };
  }
}

async function probeGeocoding(): Promise<Pick<LiveSourceProbe, 'status' | 'latencyMs' | 'detail' | 'error'>> {
  const start = Date.now();
  try {
    const res = await fetch(
      'https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&q=' + encodeURIComponent('北京'),
      { headers: { 'User-Agent': 'OmniLens-SituationMap/1.0', Accept: 'application/json' }, next: { revalidate: 0 } },
    );
    if (!res.ok) return { status: 'error', latencyMs: Date.now() - start, detail: 'Nominatim 不可用', error: `HTTP ${res.status}` };
    const data = (await res.json()) as unknown[];
    return { status: data.length > 0 ? 'ok' : 'degraded', latencyMs: Date.now() - start, detail: `Nominatim 地理编码 · 命中 ${data.length}` };
  } catch (err) {
    return { status: 'error', latencyMs: Date.now() - start, detail: 'Nominatim 探测失败', error: err instanceof Error ? err.message : '未知错误' };
  }
}

async function probeBodyTiles(): Promise<Pick<LiveSourceProbe, 'status' | 'latencyMs' | 'detail' | 'error'>> {
  const start = Date.now();
  const url = 'https://cartocdn-gusc.global.ssl.fastly.net/opmbuilder/api/v1/map/named/opm-mars-basemap-v0-2/all/0/0/0.png';
  try {
    const res = await fetch(url, { method: 'GET', next: { revalidate: 0 } });
    return {
      status: res.ok ? 'ok' : 'degraded',
      latencyMs: Date.now() - start,
      detail: res.ok ? 'OpenPlanetaryMap 火星/月球/水星瓦片可用' : `瓦片返回 HTTP ${res.status}（其余天体走主色球面）`,
    };
  } catch (err) {
    return { status: 'degraded', latencyMs: Date.now() - start, detail: 'OPM 瓦片探测失败（天体走主色球面兜底）', error: err instanceof Error ? err.message : '未知错误' };
  }
}

function probeLlm(): Pick<LiveSourceProbe, 'status' | 'detail' | 'error'> {
  return hasLlm()
    ? { status: 'ok', detail: `AI 简报已启用 · 模型 ${LLM_MODEL_NAME}` }
    : { status: 'degraded', detail: '未配置密钥（设 DEEPSEEK_API_KEY/LLM_API_KEY 启用）· 当前回落规则化简报', error: 'no_key' };
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

  const [flights, maritime, meteo, rainviewer, pizzint, geocoding, bodyTiles] = await Promise.all([
    probeFlights(),
    probeMaritime(),
    probeOpenMeteo(),
    probeRainViewer(),
    probePizzint(),
    probeGeocoding(),
    probeBodyTiles(),
  ]);

  const tle = probeTle();
  const llm = probeLlm();

  return [
    {
      id: 'adsb',
      name: '社区 ADS-B（adsb.lol / adsb.fi）',
      provider: 'adsb.lol（OpenSky 兜底）',
      layerIds: ['live_flights'],
      ...flights,
      ...keyMeta('adsb'),
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
      ...keyMeta('aisstream'),
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
      ...keyMeta('open-meteo'),
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
      ...keyMeta('rainviewer'),
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
      ...keyMeta('pizzint'),
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
      ...keyMeta('celestrak-tle'),
      lastCheckedAt: checkedAt,
      lastFetchAt: tle.lastFetchAt,
      cacheTtl: '本地 tle.json · /api/orbital-objects 15s',
      apiRoute: '/api/orbital/tle/refresh',
    },
    {
      id: 'nominatim',
      name: 'OSM Nominatim 地理编码',
      provider: 'OpenStreetMap',
      layerIds: ['search'],
      ...geocoding,
      ...keyMeta('nominatim'),
      lastCheckedAt: checkedAt,
      lastFetchAt: checkedAt,
      cacheTtl: '前端防抖 450ms（无服务端缓存）',
      apiRoute: '（前端直连）',
    },
    {
      id: 'opm-body-tiles',
      name: '天体底图瓦片（OpenPlanetaryMap）',
      provider: 'OpenPlanetaryMap · NASA/USGS',
      layerIds: ['moon', 'mars', 'mercury'],
      ...bodyTiles,
      ...keyMeta('opm-body-tiles'),
      lastCheckedAt: checkedAt,
      lastFetchAt: checkedAt,
      cacheTtl: 'CDN 瓦片缓存',
      apiRoute: '（前端直连 · 金星/泰坦等走主色球面）',
    },
    {
      id: 'llm-deepseek',
      name: 'AI 态势简报（DeepSeek 兼容）',
      provider: process.env.LLM_BASE_URL ?? 'api.deepseek.com',
      layerIds: ['briefing'],
      status: llm.status,
      latencyMs: null,
      detail: llm.detail,
      error: llm.error,
      ...keyMeta('llm-deepseek'),
      lastCheckedAt: checkedAt,
      lastFetchAt: null,
      cacheTtl: '按需生成（后台）',
      apiRoute: '/api/briefing',
    },
  ];
}
