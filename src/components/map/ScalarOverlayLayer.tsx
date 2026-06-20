'use client';

/**
 * 标量叠加层 — 近地多源标量场等距投影栅格叠加（对标 earth.nullschool overlay）。
 *
 * 支持化学污染物/颗粒物(CAMS) · 海面温度/有效波高(Marine) · 海温偏差/BAA(NOAA CRW)。
 * 由粗网格双线性插值生成等距(equirectangular)彩色图，作为 maplibre image 源铺满全球，
 * 随地图平移/缩放/投影(含球面)原生重映射；不逐帧重绘。仅在近地层 + 对应叠加图层开启时显示。
 * 当前显示由 useNearEarthStore.param 决定，色阶/范围/端点取自 SCALAR_META 注册表。
 */

import { useEffect } from 'react';
import useSWR from 'swr';
import type maplibregl from 'maplibre-gl';
import { useMapContext, useMapStyleEpoch } from '@/context/MapContext';
import { useMapStore } from '@/store/useMapStore';
import { useNearEarthStore, SCALAR_META } from '@/store/useNearEarthStore';
import { colorFor } from '@/lib/map/scalarColor';

const SOURCE = 'near-earth-scalar';
const LAYER = 'near-earth-scalar-raster';
const IMG_W = 480, IMG_H = 240;
const COORDS: [[number, number], [number, number], [number, number], [number, number]] = [
  [-180, 85], [180, 85], [180, -85], [-180, -85],
];

interface ScalarGrid {
  nx: number; ny: number; lon0: number; lat0: number; dLon: number; dLat: number;
  params: Record<string, number[]>;
}

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export function ScalarOverlayLayer() {
  const map = useMapContext();
  const styleEpoch = useMapStyleEpoch();
  const param = useNearEarthStore((s) => s.param);
  const meta = SCALAR_META[param];
  const enabled = useMapStore(
    (s) => s.activeBody === 'earth' && s.activeTier === 'near_earth' && s.activeLayers.includes(meta.layer),
  );
  const scheme = useMapStore((s) => s.overlayScheme);
  const { data } = useSWR<ScalarGrid>(enabled ? meta.endpoint : null, fetcher, {
    refreshInterval: 60 * 60 * 1000,
    revalidateOnFocus: false,
  });

  useEffect(() => {
    if (!map || !enabled || !data || !data.nx) return;
    const { nx, ny, lon0, lat0, dLon, dLat, params } = data;
    const field = params[meta.key];
    if (!field) return;
    const { min, max, ramp } = meta;
    const span = max - min || 1;

    // 双线性插值，缺测(NaN)容忍：按可用角加权，仅四角全缺才判缺测（海陆边界平滑、不再块状）
    const sample = (lng: number, lat: number): number => {
      const yf = Math.max(0, Math.min(ny - 1, (lat - lat0) / dLat));
      let xf = (lng - lon0) / dLon; xf = ((xf % nx) + nx) % nx;
      const i0 = Math.floor(xf), j0 = Math.floor(yf);
      const i1 = (i0 + 1) % nx, j1 = Math.min(j0 + 1, ny - 1);
      const fx = xf - i0, fy = yf - j0;
      const at = (j: number, i: number) => j * nx + i;
      const corners: [number, number][] = [
        [field[at(j0, i0)], (1 - fx) * (1 - fy)],
        [field[at(j0, i1)], fx * (1 - fy)],
        [field[at(j1, i0)], (1 - fx) * fy],
        [field[at(j1, i1)], fx * fy],
      ];
      let acc = 0, wsum = 0;
      for (const [val, w] of corners) {
        if (Number.isFinite(val) && w > 0) { acc += val * w; wsum += w; }
      }
      return wsum > 0 ? acc / wsum : NaN;
    };

    const cv = document.createElement('canvas');
    cv.width = IMG_W; cv.height = IMG_H;
    const cx = cv.getContext('2d');
    if (!cx) return;
    const img = cx.createImageData(IMG_W, IMG_H);
    for (let y = 0; y < IMG_H; y++) {
      const lat = 85 - (y / IMG_H) * 170;
      for (let x = 0; x < IMG_W; x++) {
        const lng = -180 + (x / IMG_W) * 360;
        const val = sample(lng, lat);
        const o = (y * IMG_W + x) * 4;
        if (!Number.isFinite(val) || (ramp === 'baa' && val <= 0)) {
          img.data[o + 3] = 0; continue; // 缺测 / BAA 无预警 → 透明
        }
        const t = (val - min) / span;
        const [r, g, b] = colorFor(ramp, scheme, t);
        // 强度→不透明度：diverging 取偏离中性的程度，其余取归一值
        const intensity = ramp === 'diverging' ? Math.min(1, Math.abs(t - 0.5) * 2) : Math.max(0, Math.min(1, t));
        img.data[o] = r; img.data[o + 1] = g; img.data[o + 2] = b;
        img.data[o + 3] = Math.round(150 * Math.min(1, 0.35 + intensity));
      }
    }
    cx.putImageData(img, 0, 0);
    const dataUrl = cv.toDataURL('image/png');

    let cancelled = false;
    const ensure = () => {
      if (cancelled || !map.isStyleLoaded()) return;
      try {
        const existing = map.getSource(SOURCE) as maplibregl.ImageSource | undefined;
        if (!existing) {
          map.addSource(SOURCE, { type: 'image', url: dataUrl, coordinates: COORDS });
          if (!map.getLayer(LAYER)) {
            const before = ['geodata-api-halo', 'geodata-api-core'].find((id) => map.getLayer(id));
            map.addLayer({ id: LAYER, type: 'raster', source: SOURCE, paint: { 'raster-opacity': 0.55, 'raster-fade-duration': 300 } }, before);
          }
        } else {
          existing.updateImage({ url: dataUrl, coordinates: COORDS });
        }
      } catch {
        /* 样式未就绪 */
      }
    };
    ensure();
    map.on('style.load', ensure);
    const t1 = window.setTimeout(ensure, 160);
    const t2 = window.setTimeout(ensure, 560);

    return () => {
      cancelled = true;
      map.off('style.load', ensure);
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      try {
        if (map.getLayer(LAYER)) map.removeLayer(LAYER);
        if (map.getSource(SOURCE)) map.removeSource(SOURCE);
      } catch {
        /* */
      }
    };
  }, [map, enabled, data, param, meta, scheme, styleEpoch]);

  return null;
}
