/**
 * 地震波 / 震级 / 震源 — 专用色谱（橙红琥珀 PGA 风格，区别于油气棕黑图例）
 */

/** 按震级分带（USGS M4.5+ feed） */
export type QuakeMagBand = 'mag-low' | 'mag-medium' | 'mag-high' | 'mag-critical';

/** 震源深度分带 */
export type QuakeDepthBand = 'shallow' | 'intermediate' | 'deep';

export function magBand(mag: number): QuakeMagBand {
  if (mag >= 7) return 'mag-critical';
  if (mag >= 6) return 'mag-high';
  if (mag >= 5) return 'mag-medium';
  return 'mag-low';
}

/** 震级光晕色 — 琥珀 → 橙 → 红，避免深灰/黑色（易与油气储藏混淆） */
export const QUAKE_MAG_HALO: Record<QuakeMagBand, string> = {
  'mag-low': '#fbbf24',
  'mag-medium': '#f97316',
  'mag-high': '#ef4444',
  'mag-critical': '#dc2626',
};

/** 震源深度光晕色 — 青紫地震学色谱，非油气棕黑 */
export const QUAKE_DEPTH_HALO: Record<QuakeDepthBand, string> = {
  shallow: '#fb923c',
  intermediate: '#c084fc',
  deep: '#22d3ee',
};

export const QUAKE_MAG_LABEL: Record<QuakeMagBand, string> = {
  'mag-low': '地震波 · 震级 M4.5–4.9',
  'mag-medium': '地震波 · 震级 M5.0–5.9',
  'mag-high': '地震波 · 震级 M6.0–6.9',
  'mag-critical': '地震波 · 震级 M≥7.0',
};

export const QUAKE_DEPTH_LABEL: Record<QuakeDepthBand, string> = {
  shallow: '震源 · 浅源 (<70km)',
  intermediate: '震源 · 中源 (70–300km)',
  deep: '震源 · 深源 (>300km)',
};

/** 图例分组悬停说明 */
export const SEISMIC_LEGEND_HINTS: Record<string, string> = {
  natural: '地震波橙红琥珀色谱 · 非油气储藏区（棕黑图例为油气专用）',
  quake_depth: '按震源深度着色 · 青紫橙系 · 非油气储藏',
};
