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
import { useNearEarthStore, SCALAR_META, type ScalarRamp } from '@/store/useNearEarthStore';

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

type RGB = [number, number, number];
function lerpStops(stops: [number, number[]][], x: number): RGB {
  const t = Math.max(0, Math.min(1, x));
  for (let i = 1; i < stops.length; i++) {
    if (t <= stops[i][0]) {
      const [t0, c0] = stops[i - 1], [t1, c1] = stops[i];
      const f = (t - t0) / (t1 - t0 || 1);
      return [0, 1, 2].map((k) => Math.round(c0[k] + (c1[k] - c0[k]) * f)) as RGB;
    }
  }
  return stops[stops.length - 1][1] as RGB;
}

/** 各色阶：t∈[0,1] → rgb（diverging 的 t=0.5 为中性） */
function colorFor(ramp: ScalarRamp, t: number): RGB {
  switch (ramp) {
    case 'aqi':
      return lerpStops([[0, [56, 189, 248]], [0.25, [74, 222, 128]], [0.5, [250, 204, 21]], [0.7, [251, 146, 60]], [0.85, [248, 113, 113]], [1, [167, 71, 254]]], t);
    case 'thermal':
      return lerpStops([[0, [37, 99, 235]], [0.3, [56, 189, 248]], [0.5, [45, 212, 191]], [0.65, [250, 204, 21]], [0.82, [251, 146, 60]], [1, [239, 68, 68]]], t);
    case 'diverging': // 海温偏差：冷蓝 ← 白 → 暖红
      return lerpStops([[0, [37, 99, 235]], [0.3, [96, 165, 250]], [0.5, [241, 245, 249]], [0.7, [248, 113, 113]], [1, [185, 28, 28]]], t);
    case 'baa':
      return lerpStops([[0, [203, 213, 225]], [0.25, [250, 204, 21]], [0.5, [251, 146, 60]], [0.75, [239, 68, 68]], [1, [127, 29, 29]]], t);
  }
}

export function ScalarOverlayLayer() {
  const map = useMapContext();
  const styleEpoch = useMapStyleEpoch();
  const param = useNearEarthStore((s) => s.param);
  const meta = SCALAR_META[param];
  const enabled = useMapStore(
    (s) => s.activeBody === 'earth' && s.activeTier === 'near_earth' && s.activeLayers.includes(meta.layer),
  );
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

    // 双线性插值；任一角缺测(NaN)则该点判为缺测
    const sample = (lng: number, lat: number): number => {
      const yf = Math.max(0, Math.min(ny - 1, (lat - lat0) / dLat));
      let xf = (lng - lon0) / dLon; xf = ((xf % nx) + nx) % nx;
      const i0 = Math.floor(xf), j0 = Math.floor(yf);
      const i1 = (i0 + 1) % nx, j1 = Math.min(j0 + 1, ny - 1);
      const fx = xf - i0, fy = yf - j0;
      const at = (j: number, i: number) => j * nx + i;
      const a = field[at(j0, i0)], b = field[at(j0, i1)], c = field[at(j1, i0)], d = field[at(j1, i1)];
      if (![a, b, c, d].every(Number.isFinite)) return NaN;
      const lp = (x: number, y: number, t: number) => x + (y - x) * t;
      return lp(lp(a, b, fx), lp(c, d, fx), fy);
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
        const [r, g, b] = colorFor(ramp, t);
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
  }, [map, enabled, data, param, meta, styleEpoch]);

  return null;
}
