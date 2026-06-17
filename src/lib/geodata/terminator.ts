/**
 * 昼夜分界线（晨昏线）— 按当前 UTC 计算太阳直射点与晨昏大圆
 *
 * 经度参数化：对每个经度求晨昏纬度 lat(lng) = atan(-cos(lng - subsolar) / tan(decl))，
 * 得到一条完整、连续、位置正确的晨昏曲线（近分点时沿经线，自动分段避免跨极跳变）。
 */

const DEG = Math.PI / 180;

export function buildTerminatorSegments(now = new Date()): [number, number][][] {
  const start = Date.UTC(now.getUTCFullYear(), 0, 0);
  const dayOfYear = Math.floor((now.getTime() - start) / 86_400_000);
  // 太阳赤纬（弧度）
  const declination = 23.44 * Math.sin(((2 * Math.PI) / 365) * (dayOfYear - 81)) * DEG;
  // 太阳直射经度：本初子午线在 12:00 UTC 直射 → subsolar = (12 - UTC小时) * 15
  const utcHours = now.getUTCHours() + now.getUTCMinutes() / 60;
  const subsolarLng = (12 - utcHours) * 15;
  const tanDecl = Math.tan(declination) || 1e-6;

  const segments: [number, number][][] = [];
  let current: [number, number][] = [];
  let prevLat: number | null = null;

  for (let lng = -180; lng <= 180; lng += 2) {
    const h = (lng - subsolarLng) * DEG;
    const lat = (Math.atan(-Math.cos(h) / tanDecl) * 180) / Math.PI;
    // 近分点时纬度在 ±90 间剧烈跳变 → 分段，避免横跨折线
    if (prevLat !== null && Math.abs(lat - prevLat) > 60) {
      if (current.length > 1) segments.push(current);
      current = [];
    }
    current.push([lng, lat]);
    prevLat = lat;
  }
  if (current.length > 1) segments.push(current);
  return segments;
}
