'use client';

/**
 * 故事线持久化 — 将帧列表与停留时长记忆到 localStorage，刷新后恢复。
 * 仅客户端 effect 内读写，规避 SSR 水合不一致；不持久化播放态（会话态）。
 */

import { useEffect } from 'react';
import { useStoryStore } from '@/store/useStoryStore';

const KEY = 'omnilens.story.v1';

export function useStoryPersistence() {
  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const p = JSON.parse(raw) as { frames?: unknown; dwellMs?: number };
        useStoryStore.getState().hydrate(p as { frames?: never; dwellMs?: number });
      }
    } catch {
      /* localStorage 不可用 */
    }
    let last = '';
    const unsub = useStoryStore.subscribe((s) => {
      const next = JSON.stringify({ frames: s.frames, dwellMs: s.dwellMs });
      if (next === last) return;
      last = next;
      try { localStorage.setItem(KEY, next); } catch { /* */ }
    });
    return unsub;
  }, []);
}
