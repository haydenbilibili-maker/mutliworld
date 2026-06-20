'use client';

/**
 * 视图偏好持久化 — 将近地视图的「叠加配色」「流场动画速度」记忆到 localStorage，刷新后恢复。
 * 仅在客户端 effect 内读写，规避 SSR 水合不一致；不持久化 globe（投影由空间层 view 级联控制）。
 */

import { useEffect } from 'react';
import { useMapStore } from '@/store/useMapStore';
import type { ColorScheme } from '@/lib/map/scalarColor';

const KEY = 'omnilens.viewPrefs.v1';
const SCHEMES = new Set<ColorScheme>(['default', 'turbo', 'viridis', 'grayscale']);

export function useViewPrefsPersistence() {
  useEffect(() => {
    // 水合
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const p = JSON.parse(raw) as { overlayScheme?: ColorScheme; flowSpeed?: number };
        const s = useMapStore.getState();
        if (p.overlayScheme && SCHEMES.has(p.overlayScheme)) s.setOverlayScheme(p.overlayScheme);
        if (typeof p.flowSpeed === 'number' && p.flowSpeed > 0 && p.flowSpeed <= 2) s.setFlowSpeed(p.flowSpeed);
      }
    } catch {
      /* localStorage 不可用 */
    }
    // 持久化（仅相关字段变化时写入，避免平移/缩放高频写盘）
    let last = '';
    const unsub = useMapStore.subscribe((s) => {
      const next = JSON.stringify({ overlayScheme: s.overlayScheme, flowSpeed: s.flowSpeed });
      if (next === last) return;
      last = next;
      try { localStorage.setItem(KEY, next); } catch { /* */ }
    });
    return unsub;
  }, []);
}
