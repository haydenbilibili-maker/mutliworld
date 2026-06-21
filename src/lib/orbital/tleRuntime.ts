import 'server-only';

/**
 * 运行时 TLE 自动获取 — 直接 HTTP 拉 CelesTrak GP 星历（免密钥），解析入进程内存缓存。
 * 不写磁盘、不起子进程，serverless 友好；按 TTL 节流。失败时保留既有缓存（bundled tle.json / 种子）。
 * 替代「手动 npm run data:tle 脚本 + 提交 tle.json」的旧流程。
 */

import type { TleDatabase, TleRecord, OrbitalCategory } from '@/types/orbital';
import { loadTleDatabase, setTleCache } from '@/lib/orbital/tleStore';

const CELESTRAK = 'https://celestrak.org/NORAD/elements/gp.php';
const TTL_MS = 6 * 60 * 60 * 1000; // 6 小时
const SAT_CAP = 260; // 卫星上限，控制载荷与传播开销

/** 拉取的分组（免密钥）：空间站 + 亮星可视 + 科学卫星 */
const GROUPS: { group: string; category: OrbitalCategory; cap: number; highlight?: boolean }[] = [
  { group: 'stations', category: 'station', cap: 30, highlight: true },
  { group: 'visual', category: 'satellite', cap: 160 },
  { group: 'science', category: 'satellite', cap: 100 },
];

let lastFetch = 0;
let fetching: Promise<void> | null = null;

const noradOf = (l1: string): number => parseInt(l1.slice(2, 7), 10);

/** 解析 CelesTrak FORMAT=tle 文本（每 3 行一组：名称/Line1/Line2） */
function parseTle(text: string, category: OrbitalCategory, cap: number, highlight?: boolean): TleRecord[] {
  const lines = text.split(/\r?\n/).map((l) => l.trimEnd()).filter((l) => l.length > 0);
  const out: TleRecord[] = [];
  for (let i = 0; i + 2 < lines.length && out.length < cap; i += 3) {
    const name = lines[i].trim();
    const line1 = lines[i + 1];
    const line2 = lines[i + 2];
    if (!line1.startsWith('1 ') || !line2.startsWith('2 ')) { i -= 2; continue; } // 容错：错位时逐行推进
    const noradId = noradOf(line1);
    if (!Number.isFinite(noradId)) continue;
    out.push({ id: String(noradId), name, displayName: name, noradId, line1, line2, category, highlight });
  }
  return out;
}

async function fetchGroup(group: string): Promise<string> {
  const url = `${CELESTRAK}?GROUP=${encodeURIComponent(group)}&FORMAT=tle`;
  const res = await fetch(url, { signal: AbortSignal.timeout(15000), headers: { 'User-Agent': 'MultiWorldDashboard/2.0' }, next: { revalidate: 0 } });
  if (!res.ok) throw new Error(`CelesTrak ${group} HTTP ${res.status}`);
  return res.text();
}

/** 确保 TLE 新鲜：超过 TTL 则后台从 CelesTrak 拉取并写入内存缓存；失败保留既有数据 */
export async function ensureFreshTle(): Promise<void> {
  const now = Date.now();
  if (now - lastFetch < TTL_MS) return;
  if (fetching) return fetching;
  fetching = (async () => {
    try {
      const objects: TleRecord[] = [];
      const seen = new Set<number>();
      for (const g of GROUPS) {
        try {
          const text = await fetchGroup(g.group);
          for (const rec of parseTle(text, g.category, g.cap, g.highlight)) {
            if (seen.has(rec.noradId)) continue;
            if (g.category === 'satellite' && objects.filter((o) => o.category === 'satellite').length >= SAT_CAP) break;
            seen.add(rec.noradId);
            objects.push(rec);
          }
        } catch { /* 单组失败跳过 */ }
      }
      if (objects.length < 10) throw new Error('CelesTrak 返回不足');
      const counts = { station: 0, satellite: 0, debris: 0 };
      for (const o of objects) counts[o.category] += 1;
      const db: TleDatabase = { version: 1, fetchedAt: new Date().toISOString(), source: 'celestrak-gp（运行时）', counts, objects };
      setTleCache(db);
      lastFetch = now;
    } catch {
      // 失败：保留 bundled/seed 缓存，下次再试（不更新 lastFetch 以便尽快重试）
      loadTleDatabase();
    } finally {
      fetching = null;
    }
  })();
  return fetching;
}
