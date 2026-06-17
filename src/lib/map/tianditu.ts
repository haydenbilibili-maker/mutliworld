/**
 * 天地图合规底图 — Wave 1 合规
 *
 * 用国家「天地图」官方 WMTS 瓦片渲染国界（含南海九段线、藏南、台湾等），
 * 自动符合自然资源部地图审核标准。**九段线不自绘**，由官方瓦片渲染。
 *
 * 依赖：天地图浏览器端 token（免费，注册 https://console.tianditu.gov.cn 获取），
 *       配到环境变量 NEXT_PUBLIC_TIANDITU_TOKEN。无 token 时调用方回退到现有底图。
 * 对外发布另需自然资源部审图号（GS(年份)xxxx号），见 README / 合规标注组件。
 */

import type { StyleSpecification } from 'maplibre-gl';

const SUBS = ['t0', 't1', 't2', 't3', 't4', 't5', 't6', 't7'];

/** 天地图浏览器端 token */
export const TIANDITU_TOKEN = (process.env.NEXT_PUBLIC_TIANDITU_TOKEN ?? '').trim();

/** 是否已配置天地图 token（决定是否启用合规底图） */
export function hasTianditu(): boolean {
  return TIANDITU_TOKEN.length > 0;
}

/** 天地图 WMTS 瓦片 URL 列表（Web Mercator，EPSG:3857，后缀 _w）
 *  layer: vec 矢量底图 / cva 矢量注记 / img 影像 / cia 影像注记 / ter 地形 */
export function tiandituTiles(layer: 'vec' | 'cva' | 'img' | 'cia' | 'ter' | 'cta'): string[] {
  if (!hasTianditu()) return [];
  return SUBS.map(
    (s) =>
      `https://${s}.tianditu.gov.cn/${layer}_w/wmts` +
      `?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=${layer}` +
      `&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles` +
      `&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=${TIANDITU_TOKEN}`,
  );
}

export const TDT_ATTRIBUTION = '© 天地图 · 国家地理信息公共服务平台';

/** 天地图矢量底图 + 注记的 source（注记承载国界/标注，可单独叠加到影像上） */
export function tiandituSources(opts: { vec?: boolean; cva?: boolean; img?: boolean; cia?: boolean } = {}) {
  const src: NonNullable<StyleSpecification['sources']> = {};
  if (opts.vec) src['tdt-vec'] = { type: 'raster', tiles: tiandituTiles('vec'), tileSize: 256, attribution: TDT_ATTRIBUTION };
  if (opts.img) src['tdt-img'] = { type: 'raster', tiles: tiandituTiles('img'), tileSize: 256, attribution: TDT_ATTRIBUTION };
  if (opts.cva) src['tdt-cva'] = { type: 'raster', tiles: tiandituTiles('cva'), tileSize: 256 };
  if (opts.cia) src['tdt-cia'] = { type: 'raster', tiles: tiandituTiles('cia'), tileSize: 256 };
  return src;
}

/** 政区合规底图样式：天地图矢量 vec + 注记 cva（深色大屏可叠暗化罩，见调用方） */
export function buildTiandituStyle(): StyleSpecification {
  return {
    version: 8,
    sources: tiandituSources({ vec: true, cva: true }),
    layers: [
      { id: 'background', type: 'background', paint: { 'background-color': '#0b1020' } },
      { id: 'tdt-vec-layer', type: 'raster', source: 'tdt-vec', paint: { 'raster-opacity': 0.92 } },
      { id: 'tdt-cva-layer', type: 'raster', source: 'tdt-cva' },
    ],
  };
}
