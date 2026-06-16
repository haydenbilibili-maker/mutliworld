/** 数据源展示名（客户端安全） */
export function formatTleSource(source: string): string {
  if (source === 'celestrak-gp') return 'CelesTrak TLE';
  if (source === 'seed-fallback') return '种子兜底';
  return source;
}
