/**
 * AISStream.io WebSocket 采集器（服务端）
 *
 * 需环境变量 AISSTREAM_API_KEY（免费注册：https://aisstream.io）
 * Node.js 需支持全局 WebSocket（Node 21+）；否则回退模拟数据。
 */

import type { VesselState } from '@/types/maritime';

const AISSTREAM_URL = 'wss://stream.aisstream.io/v0/stream';
const COLLECT_MS = 5_000;
const CACHE_TTL_MS = 60_000;

interface AisCache {
  vessels: Map<string, VesselState>;
  updatedAt: number;
  refreshPromise: Promise<void> | null;
  lastError: string | null;
}

const cache: AisCache = {
  vessels: new Map(),
  updatedAt: 0,
  refreshPromise: null,
  lastError: null,
};

const VESSEL_TYPE_LABELS: Record<number, string> = {
  70: '货船',
  71: '货船',
  72: '货船',
  73: '货船',
  74: '货船',
  75: '货船',
  76: '货船',
  77: '货船',
  78: '货船',
  79: '货船',
  80: '油轮',
  81: '油轮',
  82: '油轮',
  83: '油轮',
  84: '油轮',
  85: '油轮',
  86: '油轮',
  87: '油轮',
  88: '油轮',
  89: '油轮',
};

function typeLabel(shipType: number | undefined): { type: string; label: string } {
  if (shipType == null) return { type: 'cargo', label: '货船' };
  if (shipType >= 70 && shipType <= 79) return { type: 'cargo', label: VESSEL_TYPE_LABELS[shipType] ?? '货船' };
  if (shipType >= 80 && shipType <= 89) return { type: 'tanker', label: '油轮' };
  if (shipType === 30) return { type: 'fishing', label: '渔船' };
  if (shipType >= 60 && shipType <= 69) return { type: 'passenger', label: '客船' };
  return { type: 'other', label: '其他船舶' };
}

function parseAisMessage(raw: unknown): VesselState | null {
  if (!raw || typeof raw !== 'object') return null;
  const msg = raw as {
    MessageType?: string;
    Message?: { PositionReport?: Record<string, unknown> };
    MetaData?: Record<string, unknown>;
  };

  if (msg.MessageType !== 'PositionReport') return null;

  const pr = msg.Message?.PositionReport;
  const meta = msg.MetaData ?? {};
  const mmsi = String(meta.MMSI ?? pr?.UserID ?? '');
  if (!mmsi || mmsi === 'undefined') return null;

  const lat = (meta.latitude ?? pr?.Latitude) as number | undefined;
  const lng = (meta.longitude ?? pr?.Longitude) as number | undefined;
  if (lat == null || lng == null || !Number.isFinite(lat) || !Number.isFinite(lng)) return null;

  const shipType = meta.ShipType as number | undefined;
  const { type, label } = typeLabel(shipType);
  const sog = pr?.Sog as number | undefined;
  const cog = pr?.Cog as number | undefined;

  return {
    mmsi,
    name: String(meta.ShipName ?? `MMSI ${mmsi}`).trim() || `MMSI ${mmsi}`,
    vesselType: type,
    vesselTypeLabel: label,
    flag: String(meta.flag ?? meta.Country ?? '—'),
    lng,
    lat,
    speedKnots: sog != null && Number.isFinite(sog) ? Math.round(sog * 10) / 10 : null,
    course: cog != null && Number.isFinite(cog) ? Math.round(cog) : null,
    destination: meta.Destination != null ? String(meta.Destination) : null,
    lastContact: Math.floor(Date.now() / 1000),
  };
}

async function collectFromStream(apiKey: string): Promise<void> {
  if (typeof WebSocket === 'undefined') {
    cache.lastError = '当前 Node 运行时不支持 WebSocket';
    return;
  }

  return new Promise<void>((resolve) => {
    const vessels = new Map<string, VesselState>();
    let settled = false;

    const finish = () => {
      if (settled) return;
      settled = true;
      if (vessels.size > 0) {
        cache.vessels = vessels;
        cache.updatedAt = Date.now();
        cache.lastError = null;
      }
      resolve();
    };

    const ws = new WebSocket(AISSTREAM_URL);
    const timer = setTimeout(() => {
      try {
        ws.close();
      } catch {
        /* */
      }
      finish();
    }, COLLECT_MS);

    ws.addEventListener('open', () => {
      ws.send(
        JSON.stringify({
          APIKey: apiKey,
          BoundingBoxes: [[[-90, -180], [90, 180]]],
          FilterMessageTypes: ['PositionReport'],
        }),
      );
    });

    ws.addEventListener('message', (event) => {
      try {
        const parsed = parseAisMessage(JSON.parse(String(event.data)));
        if (parsed) vessels.set(parsed.mmsi, parsed);
      } catch {
        /* */
      }
    });

    ws.addEventListener('error', () => {
      cache.lastError = 'AISStream WebSocket 连接失败';
      clearTimeout(timer);
      finish();
    });

    ws.addEventListener('close', () => {
      clearTimeout(timer);
      finish();
    });
  });
}

/** 获取 AIS 缓存中的船舶（必要时刷新） */
export async function getAisVessels(apiKey: string): Promise<{
  vessels: VesselState[];
  fromCache: boolean;
  error: string | null;
}> {
  const now = Date.now();
  const stale = now - cache.updatedAt > CACHE_TTL_MS;

  if (stale && !cache.refreshPromise) {
    cache.refreshPromise = collectFromStream(apiKey).finally(() => {
      cache.refreshPromise = null;
    });
  }

  if (cache.refreshPromise && cache.vessels.size === 0) {
    await cache.refreshPromise;
  } else if (stale && cache.refreshPromise) {
    await cache.refreshPromise;
  }

  return {
    vessels: Array.from(cache.vessels.values()),
    fromCache: !stale,
    error: cache.lastError,
  };
}

export function aisCacheAge(): number {
  return cache.updatedAt > 0 ? Date.now() - cache.updatedAt : -1;
}
