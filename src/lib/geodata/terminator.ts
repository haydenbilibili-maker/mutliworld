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

/** 太阳赤纬（度）与直射经度（度）：用于昼夜分界与太阳直射点 */
function solarParams(now: Date) {
  const start = Date.UTC(now.getUTCFullYear(), 0, 0);
  const dayOfYear = Math.floor((now.getTime() - start) / 86_400_000);
  const declDeg = 23.44 * Math.sin(((2 * Math.PI) / 365) * (dayOfYear - 81));
  const utcHours = now.getUTCHours() + now.getUTCMinutes() / 60;
  const rawLng = (12 - utcHours) * 15;
  const subsolarLng = ((rawLng + 540) % 360) - 180; // 归一化到 [-180,180)
  return { declDeg, subsolarLng, rawLng };
}

/** 太阳直射点（subsolar point）：当前正午所在经度 + 太阳赤纬 */
export function subsolarPoint(now = new Date()): { lng: number; lat: number } {
  const { declDeg, subsolarLng } = solarParams(now);
  return { lng: subsolarLng, lat: declDeg };
}

/** 连续晨昏线（不分段，纬度钳制避免极区发散），用于构造夜半球多边形 */
export function buildTerminatorLine(now = new Date()): [number, number][] {
  const { declDeg, rawLng } = solarParams(now);
  const decl = declDeg * DEG;
  const tanDecl = Math.tan(decl) || 1e-6;
  const pts: [number, number][] = [];
  for (let lng = -180; lng <= 180; lng += 1) {
    const h = (lng - rawLng) * DEG;
    let lat = (Math.atan(-Math.cos(h) / tanDecl) * 180) / Math.PI;
    lat = Math.max(-89.5, Math.min(89.5, lat));
    pts.push([lng, lat]);
  }
  return pts;
}

/**
 * 夜半球多边形（外环坐标）。decl>0（北半球夏季向）时夜半球在晨昏线以南，反之以北。
 * 近春/秋分（|赤纬|很小）时晨昏线近竖直、多边形退化 → 返回 null，仅画分界线。
 */
export function buildNightPolygon(now = new Date()): [number, number][][] | null {
  const { declDeg } = solarParams(now);
  if (Math.abs(declDeg) < 0.8) return null;
  const line = buildTerminatorLine(now);
  const darkPole = declDeg >= 0 ? -90 : 90;
  const ring: [number, number][] = [
    ...line,
    [180, darkPole],
    [-180, darkPole],
    [line[0][0], line[0][1]],
  ];
  return [ring];
}
