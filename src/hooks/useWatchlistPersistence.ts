'use client';

/**
 * 关注清单持久化 — 将关注类别 / 告警阈值 / 告警开关记忆到 localStorage，刷新后恢复。
 * 仅客户端 effect 内读写，规避 SSR 水合不一致；不持久化活动告警/去重缓冲（会话态）。
 */

import { useEffect } from 'react';
import { useWatchlistStore } from '@/store/useWatchlistStore';

const KEY = 'omnilens.watchlist.v1';

export function useWatchlistPersistence() {
  useEffect(() => {
    // 水合
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const p = JSON.parse(raw) as { kinds?: string[]; threshold?: number; alertsEnabled?: boolean };
        useWatchlistStore.getState().hydrate(p);
      }
    } catch {
      /* localStorage 不可用 */
    }
    // 持久化（仅相关字段变化时写入）
    let last = '';
    const unsub = useWatchlistStore.subscribe((s) => {
      const next = JSON.stringify({ kinds: s.kinds, threshold: s.threshold, alertsEnabled: s.alertsEnabled });
      if (next === last) return;
      last = next;
      try { localStorage.setItem(KEY, next); } catch { /* */ }
    });
    return unsub;
  }, []);
}
