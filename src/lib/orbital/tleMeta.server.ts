import 'server-only';

import { loadTleDatabase } from '@/lib/orbital/tleStore';
import type { TleMeta } from '@/types/orbital';

/** 读取 TLE 数据库元信息（不执行 SGP4 传播） */
export function getTleMeta(): TleMeta {
  const db = loadTleDatabase();
  return {
    fetchedAt: db.fetchedAt || null,
    source: db.source,
    counts: db.counts,
    total: db.objects.length,
  };
}
