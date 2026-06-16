/**
 * 昼夜分界线（晨昏线）— 按当前 UTC 计算太阳直射点与日落大圆
 */

/** 生成晨昏线折线段（跨日界线处自动分段） */
export function buildTerminatorSegments(now = new Date()): [number, number][][] {
  const start = Date.UTC(now.getUTCFullYear(), 0, 0);
  const dayOfYear = Math.floor((now.getTime() - start) / 86_400_000);
  const declination =
    ((23.45 * Math.sin(((360 / 365) * (dayOfYear - 81) * Math.PI) / 180)) * Math.PI) / 180;
  const subsolarLng = (now.getUTCHours() + now.getUTCMinutes() / 60 - 12) * 15;

  const raw: [number, number][] = [];
  for (let lat = -88; lat <= 88; lat += 2) {
    const latR = (lat * Math.PI) / 180;
    const cosH = -Math.tan(latR) * Math.tan(declination);
    if (cosH < -1 || cosH > 1) continue;
    const hourAngle = (Math.acos(Math.max(-1, Math.min(1, cosH))) * 180) / Math.PI;
    let lng = subsolarLng + hourAngle;
    lng = ((lng + 180) % 360) - 180;
    raw.push([lng, lat]);
  }

  const segments: [number, number][][] = [];
  let current: [number, number][] = [];
  for (let i = 0; i < raw.length; i++) {
    if (i > 0 && Math.abs(raw[i][0] - raw[i - 1][0]) > 180) {
      if (current.length > 1) segments.push(current);
      current = [];
    }
    current.push(raw[i]);
  }
  if (current.length > 1) segments.push(current);
  return segments;
}
