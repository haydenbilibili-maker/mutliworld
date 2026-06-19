/**
 * 实时航班数据源 — adsb.lol 社区 ADS-B（免鉴权、全球覆盖、CORS 友好）。
 * 取代受 OAuth2 限流的 OpenSky 匿名访问，作为主源；OpenSky 作兜底。
 *
 * adsb.lol v2：GET /v2/lat/{lat}/lon/{lon}/dist/{nm} 返回半径内飞机（dist 上限约 250nm）。
 */

import type { FlightState } from '@/types/flights';
import type { BboxFilter, FetchFlightsOptions } from '@/lib/flights/opensky';

const ADSB_LOL = 'https://api.adsb.lol/v2';
const ADSB_FI = 'https://opendata.adsb.fi/api/v2';
const MAX_DIST_NM = 250;
const TIMEOUT_MS = 12_000;

const KNOTS_TO_MS = 0.514444;
const FT_TO_M = 0.3048;
const FTMIN_TO_MS = 0.00508;

interface AdsbAircraft {
  hex?: string;
  flight?: string;
  r?: string;
  t?: string;
  lat?: number;
  lon?: number;
  alt_baro?: number | 'ground';
  alt_geom?: number;
  gs?: number;
  track?: number;
  baro_rate?: number;
  squawk?: string;
  seen_pos?: number;
}

interface AdsbResponse {
  ac?: AdsbAircraft[] | null;
  aircraft?: AdsbAircraft[] | null;
  total?: number;
}

/** bbox → 中心点 + 覆盖半径（海里，上限 250） */
function bboxToCenterRadius(bbox: BboxFilter | null): { lat: number; lon: number; nm: number } {
  if (!bbox) return { lat: 30, lon: 10, nm: MAX_DIST_NM };
  const lat = (bbox.lamin + bbox.lamax) / 2;
  const lon = (bbox.lomin + bbox.lomax) / 2;
  const dLatKm = ((bbox.lamax - bbox.lamin) / 2) * 111;
  const dLonKm = ((bbox.lomax - bbox.lomin) / 2) * 111 * Math.cos((lat * Math.PI) / 180);
  const radiusKm = Math.sqrt(dLatKm * dLatKm + dLonKm * dLonKm);
  const nm = Math.min(Math.max(radiusKm / 1.852, 40), MAX_DIST_NM);
  return { lat, lon, nm: Math.round(nm) };
}

function parseAircraft(a: AdsbAircraft): FlightState | null {
  const lat = a.lat;
  const lng = a.lon;
  if (typeof lat !== 'number' || typeof lng !== 'number' || !Number.isFinite(lat) || !Number.isFinite(lng)) {
    return null;
  }
  const onGround = a.alt_baro === 'ground';
  const altFt =
    typeof a.alt_geom === 'number'
      ? a.alt_geom
      : typeof a.alt_baro === 'number'
        ? a.alt_baro
        : null;
  return {
    icao24: String(a.hex ?? '').trim(),
    callsign: (a.flight ?? '').trim(),
    originCountry: '',
    lng,
    lat,
    altitudeM: altFt != null ? altFt * FT_TO_M : null,
    onGround,
    velocityMs: typeof a.gs === 'number' ? a.gs * KNOTS_TO_MS : null,
    heading: typeof a.track === 'number' ? a.track : null,
    verticalRate: typeof a.baro_rate === 'number' ? a.baro_rate * FTMIN_TO_MS : null,
    squawk: a.squawk != null ? String(a.squawk) : null,
    lastContact:
      typeof a.seen_pos === 'number'
        ? Math.floor(Date.now() / 1000 - a.seen_pos)
        : Math.floor(Date.now() / 1000),
  };
}

async function fetchAdsbJson(base: string, lat: number, lon: number, nm: number): Promise<AdsbResponse> {
  const url = `${base}/lat/${lat.toFixed(4)}/lon/${lon.toFixed(4)}/dist/${nm}`;
  const res = await fetch(url, {
    headers: { Accept: 'application/json', 'User-Agent': 'OmniLens-SituationMap/1.0' },
    signal: AbortSignal.timeout(TIMEOUT_MS),
    next: { revalidate: 0 },
  });
  if (!res.ok) throw new Error(`ADSB HTTP ${res.status}`);
  return (await res.json()) as AdsbResponse;
}

/** 从 adsb.lol（失败回退 adsb.fi）拉取航班，产出与 OpenSky 一致的 FlightState[] */
export async function fetchAdsbFlights(
  options: FetchFlightsOptions = {},
): Promise<{ flights: FlightState[]; source: string; total: number; capped: boolean }> {
  const { bbox = null, limit = 1500, airborneOnly = true } = options;
  const { lat, lon, nm } = bboxToCenterRadius(bbox);

  let json: AdsbResponse;
  let source = 'adsb.lol · 社区 ADS-B';
  try {
    json = await fetchAdsbJson(ADSB_LOL, lat, lon, nm);
  } catch {
    json = await fetchAdsbJson(ADSB_FI, lat, lon, nm);
    source = 'adsb.fi · 社区 ADS-B';
  }

  let flights = (json.ac ?? json.aircraft ?? [])
    .map(parseAircraft)
    .filter((f): f is FlightState => f != null);

  if (airborneOnly) flights = flights.filter((f) => !f.onGround);
  flights.sort((a, b) => (b.lastContact ?? 0) - (a.lastContact ?? 0));

  const total = flights.length;
  const capped = total > limit;
  if (capped) flights = flights.slice(0, limit);

  return { flights, source, total, capped };
}
