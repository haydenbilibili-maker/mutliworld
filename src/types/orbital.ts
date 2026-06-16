/** TLE 轨道物体类别 */
export type OrbitalCategory = 'station' | 'satellite' | 'debris';

/** data/orbital/tle.json 单条记录 */
export interface TleRecord {
  id: string;
  name: string;
  /** 中文展示名（可选） */
  displayName?: string;
  noradId: number;
  line1: string;
  line2: string;
  category: OrbitalCategory;
  /** 空间站等高亮标记 */
  highlight?: boolean;
  operator?: string;
}

/** TLE 数据库文件结构 */
export interface TleDatabase {
  version: number;
  fetchedAt: string;
  source: string;
  counts: Record<OrbitalCategory, number>;
  objects: TleRecord[];
}

/** 传播后的轨道物体 */
export interface OrbitalObject {
  id: string;
  noradId: number;
  name: string;
  category: OrbitalCategory;
  lat: number;
  lng: number;
  /** 高度 km */
  altKm: number;
  /** 速度 km/h */
  velocityKmh: number;
  highlight?: boolean;
  operator?: string;
}

/** /api/orbital/tle/meta 元数据（不含 SGP4 传播） */
export interface TleMeta {
  fetchedAt: string | null;
  source: string;
  counts: Record<OrbitalCategory, number>;
  total: number;
}

/** POST /api/orbital/tle/refresh 响应 */
export interface TleRefreshResponse {
  ok: boolean;
  count: number;
  fetchedAt: string;
  counts: Record<OrbitalCategory, number>;
  source: string;
  summary: string;
  error?: string;
}

/** /api/orbital-objects 元数据 */
export interface OrbitalObjectsMeta {
  generatedAt: string;
  tleFetchedAt: string | null;
  source: string;
  counts: Record<OrbitalCategory, number>;
  total: number;
}
