'use client';

/**
 * 标量叠加层 — 近地化学污染物/颗粒物等距投影栅格叠加（对标 earth.nullschool overlay）。
 *
 * 由粗网格双线性插值生成等距(equirectangular)彩色图，作为 maplibre image 源铺满全球，
 * 随地图平移/缩放/投影(含球面)原生重映射；不逐帧重绘。仅在近地层 + 污染物/颗粒物图层开启时显示。
 */

import { useEffect } from 'react';
import useSWR from 'swr';
import type maplibregl from 'maplibre-gl';
import { useMapContext, useMapStyleEpoch } from '@/context/MapContext';
import { useMapStore } from '@/store/useMapStore';
import { useNearEarthStore, AQ_META, type AqParam } from '@/store/useNearEarthStore';

const SOURCE = 'near-earth-scalar';
const LAYER = 'near-earth-scalar-raster';
const IMG_W = 480, IMG_H = 240;
const COORDS: [[number, number], [number, number], [number, number], [number, number]] = [
  [-180, 85], [180, 85], [180, -85], [-180, -85],
];

interface AqGrid {
  nx: number; ny: number; lon0: number; lat0: number; dLon: number; dLat: number;
  params: Record<AqParam, number[]>;
}

const fetcher = (url: string) => fetch(url).then((r) => r.json());

/** 值(0..1)→AQI 风格色带 rgba */
function ramp(t: number): [number, number, number] {
  const stops: [number, number[]][] = [
    [0, [56, 189, 248]], [0.25, [74, 222, 128]], [0.5, [250, 204, 21]],
    [0.7, [251, 146, 60]], [0.85, [248, 113, 113]], [1, [167, 71, 254]],
  ];
  const x = Math.max(0, Math.min(1, t));
  for (let i = 1; i < stops.length; i++) {
    if (x <= stops[i][0]) {
      const [t0, c0] = stops[i - 1], [t1, c1] = stops[i];
      const f = (x - t0) / (t1 - t0 || 1);
      return [0, 1, 2].map((k) => Math.round(c0[k] + (c1[k] - c0[k]) * f)) as [number, number, number];
    }
  }
  return [167, 71, 254];
}

export function ScalarOverlayLayer() {
  const map = useMapContext();
  const styleEpoch = useMapStyleEpoch();
  const enabled = useMapStore(
    (s) => s.activeBody === 'earth' && s.activeTier === 'near_earth' &&
      (s.activeLayers.includes('air_pollutants') || s.activeLayers.includes('particulates')),
  );
  const param = useNearEarthStore((s) => s.param);
  const { data } = useSWR<AqGrid>(enabled ? '/api/airquality-grid' : null, fetcher, {
    refreshInterval: 60 * 60 * 1000,
    revalidateOnFocus: false,
  });

  useEffect(() => {
    if (!map || !enabled || !data || !data.nx) return;
    const { nx, ny, lon0, lat0, dLon, dLat, params } = data;
    const field = params[param];
    if (!field) return;
    const max = AQ_META[param].max;

    const sample = (lng: number, lat: number): number => {
      const yf = Math.max(0, Math.min(ny - 1, (lat - lat0) / dLat));
      let xf = (lng - lon0) / dLon; xf = ((xf % nx) + nx) % nx;
      const i0 = Math.floor(xf), j0 = Math.floor(yf);
      const i1 = (i0 + 1) % nx, j1 = Math.min(j0 + 1, ny - 1);
      const fx = xf - i0, fy = yf - j0;
      const at = (j: number, i: number) => j * nx + i;
      const lp = (a: number, b: number, t: number) => a + (b - a) * t;
      return lp(lp(field[at(j0, i0)], field[at(j0, i1)], fx), lp(field[at(j1, i0)], field[at(j1, i1)], fx), fy);
    };

    const cv = document.createElement('canvas');
    cv.width = IMG_W; cv.height = IMG_H;
    const c = cv.getContext('2d');
    if (!c) return;
    const img = c.createImageData(IMG_W, IMG_H);
    for (let y = 0; y < IMG_H; y++) {
      const lat = 85 - (y / IMG_H) * 170;
      for (let x = 0; x < IMG_W; x++) {
        const lng = -180 + (x / IMG_W) * 360;
        const val = sample(lng, lat);
        const t = val / max;
        const [r, g, b] = ramp(t);
        const o = (y * IMG_W + x) * 4;
        img.data[o] = r; img.data[o + 1] = g; img.data[o + 2] = b;
        img.data[o + 3] = val <= 0 ? 0 : Math.round(150 * Math.min(1, 0.35 + t)); // 低值更透明
      }
    }
    c.putImageData(img, 0, 0);
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
  }, [map, enabled, data, param, styleEpoch]);

  return null;
}
