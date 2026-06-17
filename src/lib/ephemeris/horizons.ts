/**
 * JPL Horizons 星历客户端 — 多天体探索 Phase 3
 *
 * 取「星下点」：以航天器为观测中心(CENTER='500@<scId>')、天体为目标(COMMAND=bodyCode)，
 * 请求 OBSERVER 表 quantity 14(sub-observer 经纬) + 20(距离)，解析当前历元星下经纬与高度。
 *
 * 仅用真实星历；任何请求/解析异常 → 返回 null（上层标记降级，绝不编造位置）。
 * 注：Horizons 参数与 CSV 列序需对真实接口核验，列解析采用启发式以增强健壮性。
 */

import type { OrbiterDef } from '@/bodies/orbiters';

const HORIZONS = 'https://ssd.jpl.nasa.gov/api/horizons.api';
const AU_KM = 149597870.7;
const BODY_RADIUS_KM: Record<string, number> = { '301': 1737.4, '499': 3389.5 };

export interface OrbiterFix {
  id: string;
  body: OrbiterDef['body'];
  layer: OrbiterDef['layer'];
  name: string;
  nameEn: string;
  agency: string;
  note: string;
  /** 星下点经度（东经正，-180..180） */
  lng: number;
  /** 星下点纬度 */
  lat: number;
  /** 轨道高度 km（距离 − 天体半径），可空 */
  altKm: number | null;
  /** 历元（ISO，UTC） */
  epoch: string;
}

function nowUtcParts(): { start: string; stop: string } {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  const start = `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())} ${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}`;
  const d2 = new Date(d.getTime() + 120_000);
  const stop = `${d2.getUTCFullYear()}-${pad(d2.getUTCMonth() + 1)}-${pad(d2.getUTCDate())} ${pad(d2.getUTCHours())}:${pad(d2.getUTCMinutes())}`;
  return { start, stop };
}

function buildUrl(o: OrbiterDef, start: string, stop: string): string {
  const p = new URLSearchParams({
    format: 'text',
    COMMAND: `'${o.bodyCode}'`,
    CENTER: `'500@${o.horizonsId}'`,
    EPHEM_TYPE: 'OBSERVER',
    QUANTITIES: "'14,20'",
    ANG_FORMAT: 'DEG',
    CSV_FORMAT: 'YES',
    START_TIME: `'${start}'`,
    STOP_TIME: `'${stop}'`,
    STEP_SIZE: "'1'",
  });
  return `${HORIZONS}?${p.toString()}`;
}

function norm180(lon: number): number {
  let x = ((lon + 180) % 360 + 360) % 360 - 180;
  if (x === -180) x = 180;
  return x;
}

/** 从 $$SOE..$$EOE 数据行启发式提取 sub-lon / sub-lat / 距离(AU) */
function parseRow(block: string): { lon: number; lat: number; deltaAu: number | null } | null {
  const soe = block.indexOf('$$SOE');
  const eoe = block.indexOf('$$EOE');
  if (soe < 0 || eoe < 0 || eoe <= soe) return null;
  const body = block.slice(soe + 5, eoe).trim();
  const firstLine = body.split(/\r?\n/).find((l) => l.trim().length > 0);
  if (!firstLine) return null;
  const fields = firstLine.split(',').map((s) => s.trim());
  // fields[0] 为日期；其后为各 quantity 列。启发式：取首个 |v|<=360 为 lon、随后 |v|<=90 为 lat。
  const nums: number[] = [];
  for (let i = 1; i < fields.length; i++) {
    const v = Number(fields[i]);
    if (Number.isFinite(v)) nums.push(v);
  }
  if (nums.length < 2) return null;
  let lon: number | null = null;
  let lat: number | null = null;
  for (const v of nums) {
    if (lon === null && Math.abs(v) <= 360) { lon = v; continue; }
    if (lon !== null && lat === null && Math.abs(v) <= 90) { lat = v; continue; }
  }
  if (lon === null || lat === null) return null;
  // 距离：取一个较大的正数（AU 量级，通常 < 0.01 AU 对近天体轨道；放宽到 <2）
  const deltaAu = nums.find((v) => v > 0 && v < 2) ?? null;
  return { lon: norm180(lon), lat, deltaAu };
}

async function fetchOne(o: OrbiterDef, start: string, stop: string): Promise<OrbiterFix | null> {
  try {
    const res = await fetch(buildUrl(o, start, stop), { next: { revalidate: 300 } });
    if (!res.ok) return null;
    const text = await res.text();
    const parsed = parseRow(text);
    if (!parsed) return null;
    const radius = BODY_RADIUS_KM[o.bodyCode] ?? 0;
    const altKm = parsed.deltaAu != null ? Math.round(parsed.deltaAu * AU_KM - radius) : null;
    return {
      id: o.id,
      body: o.body,
      layer: o.layer,
      name: o.name,
      nameEn: o.nameEn,
      agency: o.agency,
      note: o.note,
      lng: Number(parsed.lon.toFixed(2)),
      lat: Number(parsed.lat.toFixed(2)),
      altKm: altKm != null && altKm > 0 ? altKm : null,
      epoch: new Date().toISOString(),
    };
  } catch {
    return null;
  }
}

/** 批量取轨道器星下点；逐个 try/catch，失败的不出现（不造假）。 */
export async function fetchOrbiterFixes(orbiters: OrbiterDef[]): Promise<OrbiterFix[]> {
  const { start, stop } = nowUtcParts();
  const settled = await Promise.allSettled(orbiters.map((o) => fetchOne(o, start, stop)));
  const out: OrbiterFix[] = [];
  for (const s of settled) {
    if (s.status === 'fulfilled' && s.value) out.push(s.value);
  }
  return out;
}
