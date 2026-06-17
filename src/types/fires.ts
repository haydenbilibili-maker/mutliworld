/** NASA FIRMS 活跃火点 — Wave 2 实时 */

export interface FirePoint {
  id: string;
  lat: number;
  lng: number;
  /** 火辐射功率 MW（越大火越强） */
  frp: number;
  /** 置信度：l 低 / n 名义 / h 高（或数值字符串） */
  confidence: string;
  /** 亮温 K（bright_ti4） */
  brightness: number;
  acqDate: string;
  acqTime: string;
  /** D 日 / N 夜 */
  daynight: string;
  satellite: string;
}

export interface LiveFiresResponse {
  points: FirePoint[];
  generatedAt: string;
  count: number;
  /** 未配置 FIRMS_MAP_KEY 时为 true（前端可提示） */
  noKey?: boolean;
}
