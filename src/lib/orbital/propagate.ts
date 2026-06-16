/**
 * SGP4 轨道传播 — satellite.js 封装
 * 从 TLE 计算指定时刻的星下点经纬、高度、速度
 */

import {
  twoline2satrec,
  propagate,
  gstime,
  eciToGeodetic,
  degreesLat,
  degreesLong,
} from 'satellite.js';
import type { OrbitalCategory, OrbitalObject, TleRecord } from '@/types/orbital';
import { loadTleDatabase } from './tleStore';

function velocityKmh(v: { x: number; y: number; z: number } | boolean): number {
  if (typeof v === 'boolean' || !v) return 0;
  const kmps = Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z);
  return kmps * 3600;
}

/** 单条 TLE 传播到指定时刻 */
export function propagateTle(record: TleRecord, date: Date = new Date()): OrbitalObject | null {
  try {
    const satrec = twoline2satrec(record.line1, record.line2);
    const pv = propagate(satrec, date);
    if (!pv || !pv.position || typeof pv.position === 'boolean') return null;

    const gmst = gstime(date);
    const gd = eciToGeodetic(pv.position, gmst);
    const lat = degreesLat(gd.latitude);
    const lng = degreesLong(gd.longitude);
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;

    return {
      id: record.id,
      noradId: record.noradId,
      name: record.displayName ?? record.name,
      category: record.category,
      lat,
      lng,
      altKm: gd.height,
      velocityKmh: velocityKmh(pv.velocity),
      highlight: record.highlight,
      operator: record.operator,
    };
  } catch {
    return null;
  }
}

export interface PropagateOptions {
  categories?: OrbitalCategory[];
  /** 每类上限（debris 默认 300） */
  limits?: Partial<Record<OrbitalCategory, number>>;
  at?: Date;
}

const DEFAULT_LIMITS: Record<OrbitalCategory, number> = {
  station: 20,
  satellite: 200,
  debris: 300,
};

/** 批量传播当前 TLE 库 */
export function propagateAll(options: PropagateOptions = {}): {
  objects: OrbitalObject[];
  meta: { tleFetchedAt: string | null; source: string; counts: Record<OrbitalCategory, number> };
} {
  const db = loadTleDatabase();
  const at = options.at ?? new Date();
  const cats = options.categories ?? ['station', 'satellite', 'debris'];
  const catSet = new Set(cats);
  const limits = { ...DEFAULT_LIMITS, ...options.limits };

  const perCat = { station: 0, satellite: 0, debris: 0 };
  const objects: OrbitalObject[] = [];

  for (const rec of db.objects) {
    if (!catSet.has(rec.category)) continue;
    if (perCat[rec.category] >= limits[rec.category]) continue;

    const obj = propagateTle(rec, at);
    if (!obj) continue;
    objects.push(obj);
    perCat[rec.category] += 1;
  }

  return {
    objects,
    meta: {
      tleFetchedAt: db.fetchedAt || null,
      source: db.source,
      counts: perCat,
    },
  };
}

/** 转为 GeoJSON FeatureCollection（星下点） */
export function toOrbitalGeoJSON(objects: OrbitalObject[]) {
  return {
    type: 'FeatureCollection' as const,
    features: objects.map((o) => ({
      type: 'Feature' as const,
      geometry: {
        type: 'Point' as const,
        coordinates: [o.lng, o.lat] as [number, number],
      },
      properties: {
        id: o.id,
        noradId: o.noradId,
        name: o.name,
        category: o.category,
        alt_km: Math.round(o.altKm * 10) / 10,
        velocity_kmh: Math.round(o.velocityKmh),
        highlight: o.highlight ?? false,
        operator: o.operator ?? null,
      },
    })),
  };
}
