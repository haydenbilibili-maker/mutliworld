/**
 * 全球海运 AIS 模拟引擎
 *
 * 沿真实航运通道生成确定性船舶位置；配置 AISSTREAM_API_KEY 后可切换为实时 AIS。
 */

import type { VesselState } from '@/types/maritime';
import { SHIPPING_LANES } from '@/lib/maritime/lanes';

export interface BboxFilter {
  lamin: number;
  lomin: number;
  lamax: number;
  lomax: number;
}

const VESSEL_TYPES = [
  { type: 'container', label: '集装箱船', weight: 0.35 },
  { type: 'tanker', label: '油轮', weight: 0.25 },
  { type: 'bulk', label: '散货船', weight: 0.18 },
  { type: 'lng', label: 'LNG 运输船', weight: 0.08 },
  { type: 'cargo', label: '杂货船', weight: 0.14 },
] as const;

const FLAGS = [
  '巴拿马', '利比里亚', '马绍尔群岛', '中国香港', '新加坡',
  '马耳他', '巴哈马', '希腊', '中国', '日本', '韩国', '挪威',
  '英国', '丹麦', '德国', '美国', '阿联酋', '印度', '土耳其',
];

const DESTINATIONS = [
  '上海', '新加坡', '鹿特丹', '洛杉矶', '釜山', '迪拜', '汉堡',
  '安特卫普', '深圳', '宁波', '科伦坡', '吉达', '比雷埃夫斯',
  '纽约', '横滨', '高雄', '费利克斯托', '丹戎帕拉帕斯',
];

const NAME_PREFIXES = [
  'EVER', 'COSCO', 'MSC', 'MAERSK', 'CMA', 'ONE', 'HMM', 'YANG MING',
  'PACIFIC', 'ATLANTIC', 'ORIENT', 'GLOBAL', 'STAR', 'OCEAN', 'GOLDEN',
  'SILVER', 'JADE', 'PEARL', 'CORAL', 'NORDIC', 'BALTIC', 'AEGEAN',
];

const NAME_SUFFIXES = [
  'GLORY', 'SPIRIT', 'HARMONY', 'VICTORY', 'FORTUNE', 'HORIZON',
  'TRADER', 'PIONEER', 'VOYAGER', 'EXPLORER', 'CHAMPION', 'LEGEND',
];

function mulberry32(seed: number): () => number {
  let t = seed >>> 0;
  return () => {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

function bucketSeed(now: Date): number {
  const y = now.getUTCFullYear();
  const m = now.getUTCMonth();
  const d = now.getUTCDate();
  const h = now.getUTCHours();
  const slot = Math.floor(now.getUTCMinutes() / 2);
  return y * 1_000_000 + m * 10_000 + d * 100 + h * 6 + slot;
}

function haversineKm(a: [number, number], b: [number, number]): number {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b[1] - a[1]);
  const dLng = toRad(b[0] - a[0]);
  const lat1 = toRad(a[1]);
  const lat2 = toRad(b[1]);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 6371 * 2 * Math.asin(Math.sqrt(h));
}

function laneLength(waypoints: [number, number][]): number {
  let total = 0;
  for (let i = 1; i < waypoints.length; i++) {
    total += haversineKm(waypoints[i - 1], waypoints[i]);
  }
  return total;
}

function bearingDeg(from: [number, number], to: [number, number]): number {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const toDeg = (r: number) => ((r * 180) / Math.PI + 360) % 360;
  const lat1 = toRad(from[1]);
  const lat2 = toRad(to[1]);
  const dLng = toRad(to[0] - from[0]);
  const y = Math.sin(dLng) * Math.cos(lat2);
  const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLng);
  return toDeg(Math.atan2(y, x));
}

/** 沿航道按里程比例插值位置 */
function positionAlongLane(
  waypoints: [number, number][],
  progress: number,
): { lng: number; lat: number; course: number } {
  const total = laneLength(waypoints);
  if (total <= 0 || waypoints.length < 2) {
    const [lng, lat] = waypoints[0] ?? [0, 0];
    return { lng, lat, course: 0 };
  }

  let target = ((progress % 1) + 1) % 1 * total;
  for (let i = 1; i < waypoints.length; i++) {
    const segLen = haversineKm(waypoints[i - 1], waypoints[i]);
    if (target <= segLen || i === waypoints.length - 1) {
      const frac = segLen > 0 ? target / segLen : 0;
      const lng = waypoints[i - 1][0] + (waypoints[i][0] - waypoints[i - 1][0]) * frac;
      const lat = waypoints[i - 1][1] + (waypoints[i][1] - waypoints[i - 1][1]) * frac;
      return { lng, lat, course: bearingDeg(waypoints[i - 1], waypoints[i]) };
    }
    target -= segLen;
  }

  const last = waypoints[waypoints.length - 1];
  const prev = waypoints[waypoints.length - 2];
  return { lng: last[0], lat: last[1], course: bearingDeg(prev, last) };
}

function pickWeighted<T extends { weight: number }>(items: readonly T[], rng: () => number): T {
  const total = items.reduce((s, i) => s + i.weight, 0);
  let r = rng() * total;
  for (const item of items) {
    r -= item.weight;
    if (r <= 0) return item;
  }
  return items[items.length - 1];
}

function generateName(rng: () => number): string {
  const prefix = NAME_PREFIXES[Math.floor(rng() * NAME_PREFIXES.length)];
  const suffix = NAME_SUFFIXES[Math.floor(rng() * NAME_SUFFIXES.length)];
  const num = Math.floor(rng() * 900) + 100;
  return `${prefix} ${suffix} ${num}`;
}

function inBbox(lng: number, lat: number, bbox: BboxFilter): boolean {
  return lng >= bbox.lomin && lng <= bbox.lomax && lat >= bbox.lamin && lat <= bbox.lamax;
}

/** 生成全球模拟船舶 */
export function simulateVessels(
  options: { bbox?: BboxFilter | null; limit?: number; now?: Date } = {},
): VesselState[] {
  const { bbox = null, limit = 600, now = new Date() } = options;
  const baseSeed = bucketSeed(now);
  const epochMin = Math.floor(now.getTime() / 60_000);
  const vessels: VesselState[] = [];

  for (const lane of SHIPPING_LANES) {
    const laneSeed = baseSeed + lane.id.split('').reduce((s, c) => s + c.charCodeAt(0), 0);

    for (let i = 0; i < lane.density; i++) {
      const rng = mulberry32(laneSeed * 1000 + i);
      const vt = pickWeighted(VESSEL_TYPES, rng);
      const phase = rng();
      const speedKnots = 8 + rng() * 14;
      const advancePerMin = (speedKnots * 0.000308) / laneLength(lane.waypoints);
      const progress = (phase + epochMin * advancePerMin) % 1;
      const { lng, lat, course } = positionAlongLane(lane.waypoints, progress);

      if (bbox && !inBbox(lng, lat, bbox)) continue;

      const mmsi = String(200_000_000 + ((laneSeed + i * 7919) % 799_999_999));

      vessels.push({
        mmsi,
        name: generateName(rng),
        vesselType: vt.type,
        vesselTypeLabel: vt.label,
        flag: FLAGS[Math.floor(rng() * FLAGS.length)],
        lng,
        lat,
        speedKnots: Math.round(speedKnots * 10) / 10,
        course: Math.round(course),
        destination: DESTINATIONS[Math.floor(rng() * DESTINATIONS.length)],
        lastContact: Math.floor(now.getTime() / 1000),
      });
    }
  }

  vessels.sort((a, b) => a.mmsi.localeCompare(b.mmsi));
  const capped = vessels.length > limit;
  return capped ? vessels.slice(0, limit) : vessels;
}

export function formatSpeedKnots(knots: number | null): string {
  if (knots == null) return '—';
  return `${knots.toFixed(1)} kn`;
}

export function formatCourse(deg: number | null): string {
  if (deg == null) return '—';
  return `${Math.round(deg)}°`;
}
