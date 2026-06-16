/**
 * 经纬网格（Graticule）生成 — LIFEOS-005 自主开发
 *
 * China 当前无底图瓦片（public 为空、geodata 返回空）。
 * 用程序生成经纬网格作为离线底图，让暗色画布读起来像"态势地图"，
 * 不依赖任何外部瓦片服务，契合暗色科技风。
 */

export interface LineFeature {
  type: 'Feature';
  geometry: { type: 'LineString'; coordinates: [number, number][] };
  properties: { kind: 'meridian' | 'parallel' };
}

export interface GraticuleFC {
  type: 'FeatureCollection';
  features: LineFeature[];
}

/** 生成经纬网格（默认每 30°一条，10°采样一点） */
export function buildGraticule(step = 30): GraticuleFC {
  const features: LineFeature[] = [];

  // 经线（meridians）
  for (let lng = -180; lng <= 180; lng += step) {
    const coordinates: [number, number][] = [];
    for (let lat = -80; lat <= 80; lat += 10) coordinates.push([lng, lat]);
    features.push({
      type: 'Feature',
      geometry: { type: 'LineString', coordinates },
      properties: { kind: 'meridian' },
    });
  }

  // 纬线（parallels）
  for (let lat = -80; lat <= 80; lat += step) {
    const coordinates: [number, number][] = [];
    for (let lng = -180; lng <= 180; lng += 10) coordinates.push([lng, lat]);
    features.push({
      type: 'Feature',
      geometry: { type: 'LineString', coordinates },
      properties: { kind: 'parallel' },
    });
  }

  return { type: 'FeatureCollection', features };
}

/** 由区域边界 [[minLng,minLat],[maxLng,maxLat]] 生成矩形外框（用于区域高亮） */
export function buildBoundsRing(
  bounds: [[number, number], [number, number]],
): GraticuleFC {
  const [[minLng, minLat], [maxLng, maxLat]] = bounds;
  const ring: [number, number][] = [
    [minLng, minLat],
    [maxLng, minLat],
    [maxLng, maxLat],
    [minLng, maxLat],
    [minLng, minLat],
  ];
  return {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        geometry: { type: 'LineString', coordinates: ring },
        properties: { kind: 'parallel' },
      },
    ],
  };
}
