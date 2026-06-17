/**
 * 为 GeoJSON 要素补齐 markerImageId / haloColor 等地图渲染属性。
 * 实时 USGS 等 API 直出 feature 须经此步骤，否则光晕色缺失会呈深色/黑色。
 */

import type { GeoJSONFeature } from '@/types/geo';
import { resolveMarkerStyle } from '@/lib/geodata/markerStyle';

export function enrichGeodataFeature(f: GeoJSONFeature): GeoJSONFeature {
  const p = f.properties ?? {};
  if (p.markerImageId && p.haloColor) return f;

  const marker = resolveMarkerStyle({
    layerId: String(p.layerId ?? ''),
    impact: String(p.impact ?? ''),
    nuclearKind: String(p.nuclearKind ?? ''),
    ftype: String(p.ftype ?? ''),
    etype: String(p.etype ?? ''),
    production: String(p.production ?? ''),
    subKind: String(p.subKind ?? ''),
    launchStatus: String(p.launchStatus ?? ''),
    mag: typeof p.mag === 'number' ? p.mag : undefined,
    live: p.live === true,
  });

  return {
    ...f,
    properties: { ...p, ...marker },
  };
}

export function enrichGeodataFeatures(features: GeoJSONFeature[]): GeoJSONFeature[] {
  return features.map(enrichGeodataFeature);
}
