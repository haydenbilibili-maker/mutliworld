/**
 * 时效性格式化工具集（信息增密 · 时效性提升专项）
 *
 * 统一全站「相对时间 / 数据龄期 / 倒计时 / stale 判定」语义，消除散落于
 * 各组件（NewsPanel / NearEarthDataBar / LiveEventFeed / TleStatusBar 等）的
 * 重复实现与边界不一致（如 `<48h` vs `<24h`、`<1min` 处理差异）。
 *
 * 设计约定：
 *  - 语义分三类，不可混用：
 *    · `timeAgo`    —— 已过去的时间（「3 分钟前」），用于历史事件 / 数据抓取时刻
 *    · `countdown`  —— 距未来的时间（「3 天后」），用于预报 / 接近事件 / 下次刷新
 *    · `ageLabel`   —— 数据龄期标签（「刚抓取」「3 分钟前」「约 2.1 小时前」），专为数据时效设计
 *  - 边界统一：<1 分钟一律显示「刚刚」/「即将」；最大单位为「天」，超过 30 天回落到绝对日期。
 *  - 所有函数对非法/NaN/null 输入返回空串或占位符，绝不抛错。
 *  - 纯函数（除入参外不依赖外部状态），便于在 useMemo / setInterval tick 中复算。
 */

/** 时间输入：ISO 字符串、毫秒时间戳、Date 或空值 */
type TimeInput = string | number | Date | null | undefined;

function toMs(t: TimeInput): number | null {
  if (t == null) return null;
  if (typeof t === 'number') return Number.isFinite(t) ? t : null;
  if (t instanceof Date) return Number.isNaN(t.getTime()) ? null : t.getTime();
  const ms = Date.parse(t);
  return Number.isFinite(ms) ? ms : null;
}

/**
 * 已过去时间的相对描述（「刚刚」「3 分钟前」「2 小时前」「1 天前」）。
 * 用于历史事件时间戳、数据抓取时刻等「已经发生」的时间点。
 *
 * - 输入为未来时间或非法 → 返回 ''（调用方决定如何处理）
 * - 精度：分钟级（<60min）→ 小时（<24h）→ 天（>24h）
 */
export function timeAgo(t: TimeInput, now: number = Date.now()): string {
  const ms = toMs(t);
  if (ms == null) return '';
  const diff = now - ms;
  if (diff < 0) return ''; // 未来时间不适用「前」语义
  const m = Math.floor(diff / 60_000);
  if (m < 1) return '刚刚';
  if (m < 60) return `${m} 分钟前`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} 小时前`;
  const d = Math.floor(h / 24);
  if (d < 30) return `${d} 天前`;
  // 超过 30 天回落到绝对日期，避免「90 天前」这类无信息量描述
  return formatDate(ms);
}

/**
 * 距未来时间的相对描述（「即将」「3 分钟后」「2 小时后」「1 天后」）。
 * 用于预报、近地天体接近、下次自动刷新等「尚未发生」的时间点。
 *
 * - 输入为过去时间或非法 → 返回 ''（调用方决定如何处理）
 * - 边界：<1 分钟显示「即将」（而非「0 分钟后」），更贴合「马上发生」的语义
 */
export function countdown(t: TimeInput, now: number = Date.now()): string {
  const ms = toMs(t);
  if (ms == null) return '';
  const diff = ms - now;
  if (diff <= 0) return '';
  const m = Math.floor(diff / 60_000);
  if (m < 1) return '即将';
  if (m < 60) return `${m} 分钟后`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} 小时后`;
  const d = Math.floor(h / 24);
  if (d < 365) return `${d} 天后`;
  return `约 ${(d / 365).toFixed(1)} 年后`;
}

/**
 * 数据龄期标签 —— 专为「数据抓取/更新时刻」设计，比 timeAgo 更紧凑。
 * 取代散落各处的 `formatTleAgeHours` / `relTime` 实现，边界统一。
 *
 * @param t 数据更新时刻（ISO / ms / Date）
 * @returns 「刚刚」「3 分钟前」「2.1 小时前」「1.2 天前」或绝对日期
 */
export function ageLabel(t: TimeInput, now: number = Date.now()): string {
  const ms = toMs(t);
  if (ms == null) return '—';
  const diff = now - ms;
  if (diff < 0) {
    // 未来时间（时钟漂移 / 占位符）回退为「刚刚」，避免显示负数龄期
    return '刚刚';
  }
  const m = Math.floor(diff / 60_000);
  if (m < 1) return '刚刚';
  if (m < 60) return `${m} 分钟前`;
  const h = diff / 3_600_000;
  if (h < 24) return `${h.toFixed(1)} 小时前`;
  const d = h / 24;
  if (d < 30) return `${d.toFixed(1)} 天前`;
  return formatDate(ms);
}

/**
 * compact 龄期 —— 用于空间紧凑的 chip / 角标（如「3m」「2h」「1d」）。
 * 适合实时态势计数条、顶部状态芯片等横向排布、字符宽度受限的场景。
 */
export function ageCompact(t: TimeInput, now: number = Date.now()): string {
  const ms = toMs(t);
  if (ms == null) return '';
  const diff = now - ms;
  if (diff < 60_000) return 'now';
  const m = Math.floor(diff / 60_000);
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h`;
  const d = Math.floor(h / 24);
  return `${d}d`;
}

/** 是否已过期（超过阈值），用于 stale 角标判定 */
export function isStale(t: TimeInput, thresholdMs: number, now: number = Date.now()): boolean {
  const ms = toMs(t);
  if (ms == null) return true; // 无时间戳视为过期
  return now - ms > thresholdMs;
}

/** ISO → 「YYYY-MM-DD HH:MM」（本地时区，与原 DataFreshnessBar formatTime 一致） */
export function formatDate(t: TimeInput): string {
  const ms = toMs(t);
  if (ms == null) return '—';
  const d = new Date(ms);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  const HH = String(d.getHours()).padStart(2, '0');
  const MM = String(d.getMinutes()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd} ${HH}:${MM}`;
}

/** ISO → 「MM-DD HH:MM」（无年份，适合近时事件列表，与原 LiveEventFeed formatTimestamp 一致） */
export function formatShort(t: TimeInput): string {
  const ms = toMs(t);
  if (ms == null) return '—';
  const d = new Date(ms);
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  const HH = String(d.getHours()).padStart(2, '0');
  const MM = String(d.getMinutes()).padStart(2, '0');
  return `${mm}-${dd} ${HH}:${MM}`;
}

/** ISO → 「HH:MM:SS」（用于精确时刻 / 日志，秒级精度） */
export function formatClock(t: TimeInput): string {
  const ms = toMs(t);
  if (ms == null) return '—';
  const d = new Date(ms);
  const HH = String(d.getHours()).padStart(2, '0');
  const MM = String(d.getMinutes()).padStart(2, '0');
  const SS = String(d.getSeconds()).padStart(2, '0');
  return `${HH}:${MM}:${SS}`;
}

/**
 * 下次刷新倒计时 —— 由「上次刷新时刻 + 轮询间隔」推算下次刷新点，
 * 返回剩余秒数（向下取整）。用于 UI 显示「X 秒后刷新」。
 *
 * - 若已超时（应已刷新）返回 0
 * - intervalMs ≤ 0 时返回 null（无周期刷新）
 */
export function nextRefreshIn(
  lastFetchMs: TimeInput,
  intervalMs: number,
  now: number = Date.now(),
): number | null {
  if (intervalMs <= 0) return null;
  const last = toMs(lastFetchMs);
  if (last == null) return null;
  const remain = intervalMs - (now - last);
  return remain > 0 ? Math.floor(remain / 1000) : 0;
}

/**
 * 解析 ISO 为毫秒时间戳（对齐 timeRange.parseIsoMs，统一入口）。
 * 非法输入返回 null。
 */
export function parseMs(t: TimeInput): number | null {
  return toMs(t);
}
