/** WMO 天气代码 → 中文描述与 emoji（Open-Meteo WMO convention） */
export function wmoToCondition(code: number): { label: string; emoji: string } {
  if (code === 0) return { label: '晴', emoji: '☀️' };
  if (code === 1) return { label: '大部晴朗', emoji: '🌤️' };
  if (code === 2) return { label: '局部多云', emoji: '⛅' };
  if (code === 3) return { label: '阴', emoji: '☁️' };
  if (code === 45 || code === 48) return { label: '雾', emoji: '🌫️' };
  if (code >= 51 && code <= 55) return { label: '毛毛雨', emoji: '🌦️' };
  if (code >= 56 && code <= 57) return { label: '冻毛毛雨', emoji: '🌧️' };
  if (code >= 61 && code <= 65) return { label: '雨', emoji: '🌧️' };
  if (code >= 66 && code <= 67) return { label: '冻雨', emoji: '🌨️' };
  if (code >= 71 && code <= 77) return { label: '雪', emoji: '❄️' };
  if (code >= 80 && code <= 82) return { label: '阵雨', emoji: '🌦️' };
  if (code >= 85 && code <= 86) return { label: '阵雪', emoji: '🌨️' };
  if (code >= 95 && code <= 99) return { label: '雷暴', emoji: '⛈️' };
  return { label: '未知', emoji: '🌡️' };
}

/** 风向角度 → 中文八方位 */
export function windDirectionLabel(deg: number): string {
  const dirs = ['北', '东北', '东', '东南', '南', '西南', '西', '西北'] as const;
  const idx = Math.round(((deg % 360) + 360) % 360 / 45) % 8;
  return dirs[idx];
}
