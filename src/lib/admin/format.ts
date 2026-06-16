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
