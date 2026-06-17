import type { Feature, FeatureCollection } from 'geojson';
import type { FlightState } from '@/types/flights';

/** OpenSky states/all 单行（按官方顺序） */
type OpenSkyRow = [
  string | null,
  string | null,
  string | null,
  number | null,
  number | null,
  number | null,
  number | null,
  number | null,
  boolean | null,
  number | null,
  number | null,
  number | null,
  unknown,
  number | null,
  string | null,
  boolean | null,
  number | null,
];

export interface BboxFilter {
  lamin: number;
  lomin: number;
  lamax: number;
  lomax: number;
}

export interface FetchFlightsOptions {
  bbox?: BboxFilter | null;
  limit?: number;
  airborneOnly?: boolean;
}

const OPENSKY_BASE = 'https://opensky-network.org/api/states/all';

function trimCallsign(raw: string | null): string {
  if (!raw) return '';
  return raw.trim();
}

function parseRow(row: OpenSkyRow): FlightState | null {
  const lng = row[5];
  const lat = row[6];
  if (lng == null || lat == null || !Number.isFinite(lng) || !Number.isFinite(lat)) {
    return null;
  }

  const geoAlt = row[13];
  const baroAlt = row[7];
  const altitudeM =
    geoAlt != null && Number.isFinite(geoAlt)
      ? geoAlt
      : baroAlt != null && Number.isFinite(baroAlt)
        ? baroAlt
        : null;

  return {
    icao24: String(row[0] ?? ''),
    callsign: trimCallsign(row[1]),
    originCountry: String(row[2] ?? ''),
    lng,
    lat,
    altitudeM,
    onGround: row[8] === true,
    velocityMs: row[9] != null && Number.isFinite(row[9]) ? row[9] : null,
    heading: row[10] != null && Number.isFinite(row[10]) ? row[10] : null,
    verticalRate: row[11] != null && Number.isFinite(row[11]) ? row[11] : null,
    squawk: row[14] != null ? String(row[14]) : null,
    lastContact: row[4] != null && Number.isFinite(row[4]) ? row[4] : null,
  };
}

function buildUrl(bbox?: BboxFilter | null): string {
  if (!bbox) return OPENSKY_BASE;
  const q = new URLSearchParams({
    lamin: String(bbox.lamin),
    lomin: String(bbox.lomin),
    lamax: String(bbox.lamax),
    lomax: String(bbox.lomax),
  });
  return `${OPENSKY_BASE}?${q.toString()}`;
}

function authHeader(): string | undefined {
  const user = process.env.OPENSKY_USERNAME;
  const pass = process.env.OPENSKY_PASSWORD;
  if (!user || !pass) return undefined;
  return `Basic ${Buffer.from(`${user}:${pass}`).toString('base64')}`;
}

/** 从 OpenSky 拉取并解析飞机状态 */
export async function fetchOpenSkyFlights(
  options: FetchFlightsOptions = {},
): Promise<{ flights: FlightState[]; source: string; total: number; capped: boolean }> {
  const { bbox = null, limit = 800, airborneOnly = true } = options;
  const url = buildUrl(bbox);
  const headers: Record<string, string> = { Accept: 'application/json' };
  const auth = authHeader();
  if (auth) headers.Authorization = auth;

  const res = await fetch(url, {
    headers,
    next: { revalidate: 0 },
  });

  if (!res.ok) {
    throw new Error(`OpenSky HTTP ${res.status}`);
  }

  const json = (await res.json()) as { states?: OpenSkyRow[] | null };
  let flights = (json.states ?? [])
    .map(parseRow)
    .filter((f): f is FlightState => f != null);

  if (airborneOnly) {
    flights = flights.filter((f) => !f.onGround);
  }

  // 优先保留最近有位置更新的目标
  flights.sort((a, b) => (b.lastContact ?? 0) - (a.lastContact ?? 0));

  const capped = flights.length > limit;
  const total = flights.length;
  if (capped) {
    flights = flights.slice(0, limit);
  }

  return {
    flights,
    source: auth ? 'OpenSky Network（认证）' : 'OpenSky Network',
    total,
    capped,
  };
}

function formatAltitude(m: number | null): string {
  if (m == null) return '—';
  const ft = Math.round(m * 3.28084);
  if (ft >= 1000) return `${Math.round(ft / 100) / 10}k ft`;
  return `${ft} ft`;
}

function formatSpeed(ms: number | null): string {
  if (ms == null) return '—';
  return `${Math.round(ms * 3.6)} km/h`;
}

/** 转为 GeoJSON FeatureCollection */
export function flightsToGeoJSON(flights: FlightState[]): FeatureCollection {
  const features: Feature[] = flights.map((f) => ({
    type: 'Feature',
    geometry: { type: 'Point', coordinates: [f.lng, f.lat] },
    properties: {
      icao24: f.icao24,
      callsign: f.callsign || f.icao24.toUpperCase(),
      originCountry: f.originCountry,
      altitudeM: f.altitudeM,
      altitudeLabel: formatAltitude(f.altitudeM),
      velocityMs: f.velocityMs,
      speedLabel: formatSpeed(f.velocityMs),
      heading: f.heading ?? 0,
      verticalRate: f.verticalRate,
      squawk: f.squawk,
      onGround: f.onGround,
    },
  }));

  return { type: 'FeatureCollection', features };
}
