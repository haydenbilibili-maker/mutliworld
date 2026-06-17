/** 格式化 ISO 时间为本地可读字符串 */
export function formatDateTime(iso: string | null | undefined): string {
  if (!iso) return '—';
  const ms = Date.parse(iso);
  if (Number.isNaN(ms)) return iso;
  return new Date(ms).toLocaleString('zh-CN', { hour12: false });
}

/** 格式化字节大小 */
export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

/** 格式化 TLE / 数据抓取时间为相对年龄 */
export function formatTleAgeHours(fetchedAt: string | null): string {
  if (!fetchedAt) return '—';
  const ms = Date.parse(fetchedAt);
  if (Number.isNaN(ms)) return '—';
  const hours = (Date.now() - ms) / (1000 * 60 * 60);
  if (hours < 1) return `${Math.round(hours * 60)} 分钟前`;
  if (hours < 48) return `${hours.toFixed(1)} 小时前`;
  return `${(hours / 24).toFixed(1)} 天前`;
}
