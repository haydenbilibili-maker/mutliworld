/**
 * 将 emoji 渲染为 MapLibre 可用的 raster sprite（跨平台一致显示）
 */

import type { Map as MaplibreMap } from 'maplibre-gl';
import { MARKER_REGISTRY } from '@/lib/geodata/markerStyle';

const SPRITE_SIZE = 64;

function renderEmojiToImageData(emoji: string): ImageData {
  const canvas = document.createElement('canvas');
  canvas.width = SPRITE_SIZE;
  canvas.height = SPRITE_SIZE;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('无法创建 canvas 上下文');
  }

  ctx.clearRect(0, 0, SPRITE_SIZE, SPRITE_SIZE);
  ctx.font =
    '42px "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(emoji, SPRITE_SIZE / 2, SPRITE_SIZE / 2 + 2);

  return ctx.getImageData(0, 0, SPRITE_SIZE, SPRITE_SIZE);
}

/** 注册全部标记图标到地图样式 */
export function registerMarkerSprites(map: MaplibreMap): void {
  for (const [imageId, { emoji }] of Object.entries(MARKER_REGISTRY)) {
    if (map.hasImage(imageId)) continue;
    try {
      const imageData = renderEmojiToImageData(emoji);
      map.addImage(imageId, imageData, { pixelRatio: 2 });
    } catch {
      /* 单图标失败不阻断整图 */
    }
  }
}
