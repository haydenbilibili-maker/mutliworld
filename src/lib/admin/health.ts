import 'server-only';

import type { NextRequest } from 'next/server';

export interface HealthEndpointDef {
  id: string;
  name: string;
  path: string;
  query?: string;
  category: 'geodata' | 'live' | 'orbital' | 'osint';
}

export interface HealthCheckResult {
  id: string;
  name: string;
  path: string;
  status: number;
  ok: boolean;
  latencyMs: number;
  error?: string;
  checkedAt: string;
}

export const ADMIN_HEALTH_ENDPOINTS: HealthEndpointDef[] = [
  {
    id: 'geodata',
    name: 'Geodata 聚合',
    path: '/api/geodata',
    query: '?region=global&timeRange=7d&layers=conflicts',
    category: 'geodata',
  },
  {
    id: 'flights',
    name: '实时航班',
    path: '/api/flights',
    query: '?limit=10',
    category: 'live',
  },
  {
    id: 'weather',
    name: '实时天气',
    path: '/api/weather',
    category: 'live',
  },
  {
    id: 'weather-radar',
    name: '降水雷达',
    path: '/api/weather/radar',
    category: 'live',
  },
  {
    id: 'pizza',
    name: '披萨指数',
    path: '/api/osint/pentagon-pizza',
    category: 'osint',
  },
  {
    id: 'orbital-objects',
    name: '在轨物体',
    path: '/api/orbital-objects',
    query: '?limit=5',
    category: 'orbital',
  },
  {
    id: 'launch-log',
    name: '发射日志',
    path: '/api/launch-log',
    query: '?limit=5',
    category: 'geodata',
  },
];

const DEFAULT_TIMEOUT_MS = 12_000;

async function pingEndpoint(
  baseUrl: string,
  def: HealthEndpointDef,
  timeoutMs = DEFAULT_TIMEOUT_MS,
): Promise<HealthCheckResult> {
  const url = `${baseUrl}${def.path}${def.query ?? ''}`;
  const checkedAt = new Date().toISOString();
  const start = Date.now();

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);

    const res = await fetch(url, {
      signal: controller.signal,
      headers: { Accept: 'application/json' },
      cache: 'no-store',
    });

    clearTimeout(timer);

    return {
      id: def.id,
      name: def.name,
      path: def.path,
      status: res.status,
      ok: res.ok,
      latencyMs: Date.now() - start,
      checkedAt,
      error: res.ok ? undefined : `HTTP ${res.status}`,
    };
  } catch (err) {
    const message =
      err instanceof Error
        ? err.name === 'AbortError'
          ? '请求超时'
          : err.message
        : '未知错误';
    return {
      id: def.id,
      name: def.name,
      path: def.path,
      status: 0,
      ok: false,
      latencyMs: Date.now() - start,
      error: message,
      checkedAt,
    };
  }
}

export function resolveAdminBaseUrl(req: NextRequest): string {
  const host = req.headers.get('host');
  const proto = req.headers.get('x-forwarded-proto') ?? 'http';
  if (host) return `${proto}://${host}`;
  return process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';
}

export async function runAdminHealthChecks(
  req: NextRequest,
  endpointIds?: string[],
): Promise<HealthCheckResult[]> {
  const baseUrl = resolveAdminBaseUrl(req);
  const defs = endpointIds
    ? ADMIN_HEALTH_ENDPOINTS.filter((d) => endpointIds.includes(d.id))
    : ADMIN_HEALTH_ENDPOINTS;

  return Promise.all(defs.map((def) => pingEndpoint(baseUrl, def)));
}
