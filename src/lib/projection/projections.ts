/**
 * 投影引擎核心（3.0 A · 可插拔自绘后端骨架）。
 * 原创实现常见地图投影的前向变换（经纬度→平面），与 maplibre 并存、零依赖。
 * 约定：输入经纬度(度)，输出标准化平面坐标 [x, y]（单位球面尺度，y 向下为正）；
 *      背面/裁剪点返回 null。旋转由中心经度 lon0 / 中心纬度 lat0 控制。
 * 后续可在此基础上叠加海岸线/地图内容，并接入视图菜单的投影选择器。
 */

export type ProjectionId = 'equirectangular' | 'orthographic' | 'stereographic' | 'azimuthalEquidistant';

export interface ProjectionParams {
  /** 中心经度（度），用于水平旋转 */
  lon0: number;
  /** 中心纬度（度），用于倾斜 */
  lat0: number;
}

export interface ProjectionDef {
  id: ProjectionId;
  name: string;
  /** 经纬度(度) → 标准化平面 [x,y]；裁剪/背面返回 null */
  project: (lng: number, lat: number, p: ProjectionParams) => [number, number] | null;
  /** 该投影在标准化空间的半宽（用于自适应缩放）：x∈[-xHalf,xHalf] */
  xHalf: number;
  yHalf: number;
}

const D2R = Math.PI / 180;

/** 球面方位投影通用中间量（c 为球面距角余弦相关项） */
function azimuthalBase(lng: number, lat: number, p: ProjectionParams) {
  const lam = (lng - p.lon0) * D2R;
  const phi = lat * D2R;
  const phi0 = p.lat0 * D2R;
  const cosc = Math.sin(phi0) * Math.sin(phi) + Math.cos(phi0) * Math.cos(phi) * Math.cos(lam);
  const kx = Math.cos(phi) * Math.sin(lam);
  const ky = Math.cos(phi0) * Math.sin(phi) - Math.sin(phi0) * Math.cos(phi) * Math.cos(lam);
  return { cosc, kx, ky };
}

export const PROJECTIONS: Record<ProjectionId, ProjectionDef> = {
  equirectangular: {
    id: 'equirectangular', name: '等距柱（平面）', xHalf: Math.PI, yHalf: Math.PI / 2,
    project: (lng, lat, p) => {
      let lam = (lng - p.lon0) * D2R;
      // 归一到 [-π,π]
      lam = ((lam + Math.PI) % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI) - Math.PI;
      return [lam, -lat * D2R];
    },
  },
  orthographic: {
    id: 'orthographic', name: '正射（球面）', xHalf: 1, yHalf: 1,
    project: (lng, lat, p) => {
      const { cosc, kx, ky } = azimuthalBase(lng, lat, p);
      if (cosc < 0) return null; // 背面裁剪
      return [kx, -ky];
    },
  },
  stereographic: {
    id: 'stereographic', name: '球面立体', xHalf: 2, yHalf: 2,
    project: (lng, lat, p) => {
      const { cosc, kx, ky } = azimuthalBase(lng, lat, p);
      const denom = 1 + cosc;
      if (denom < 1e-3) return null; // 对极点附近裁剪
      const k = 2 / denom;
      return [k * kx, -k * ky];
    },
  },
  azimuthalEquidistant: {
    id: 'azimuthalEquidistant', name: '等距方位', xHalf: Math.PI, yHalf: Math.PI,
    project: (lng, lat, p) => {
      const { cosc, kx, ky } = azimuthalBase(lng, lat, p);
      const c = Math.acos(Math.max(-1, Math.min(1, cosc)));
      const sinc = Math.sin(c);
      const k = Math.abs(sinc) < 1e-6 ? 1 : c / sinc;
      return [k * kx, -k * ky];
    },
  },
};

export const PROJECTION_LIST = Object.values(PROJECTIONS);

/** 生成经纬网（meridians/parallels）采样点，供自绘引擎绘制 */
export function graticule(stepDeg = 30, sample = 2): { type: 'meridian' | 'parallel'; pts: [number, number][] }[] {
  const lines: { type: 'meridian' | 'parallel'; pts: [number, number][] }[] = [];
  for (let lng = -180; lng <= 180; lng += stepDeg) {
    const pts: [number, number][] = [];
    for (let lat = -90; lat <= 90; lat += sample) pts.push([lng, lat]);
    lines.push({ type: 'meridian', pts });
  }
  for (let lat = -90; lat <= 90; lat += stepDeg) {
    const pts: [number, number][] = [];
    for (let lng = -180; lng <= 180; lng += sample) pts.push([lng, lat]);
    lines.push({ type: 'parallel', pts });
  }
  return lines;
}
