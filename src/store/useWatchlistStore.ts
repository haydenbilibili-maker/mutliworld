'use client';

/**
 * 关注清单 + 阈值告警（3.0 智能层 · 关联引擎雏形）。
 *
 * 用户在异常榜按类别「关注」（多选，持久化）。当被关注类别出现 显著度 ≥ 阈值 的
 * 真实异常项，且此前未告警过（按实例 key 去重），则推送一条告警 toast。
 * 全部基于既有真实数据（USGS / EONET / NOAA CRW / Open-Meteo），不预测、不编造；
 * 告警是对当前已发生事实越阈的提示，非预报。
 */

import { create } from 'zustand';

/** 异常榜上送的候选项（与 AnomalyBoard.Anomaly 字段对齐的最小子集） */
export interface AlertCandidate {
  key: string;
  icon: string;
  kind: string;
  label: string;
  score: number;
  coords: [number, number];
  time?: string;
}

/** 已触发的活动告警（用于 toast 展示） */
export interface AlertItem extends AlertCandidate {
  at: number;
}

const ALERTS_CAP = 6; // 同时展示的活动告警上限
const SEEN_CAP = 240; // 去重环形缓冲上限

interface WatchlistState {
  /** 关注的异常类别（如 地震 / 风暴 / 白化预警…） */
  kinds: string[];
  /** 告警显著度阈值 */
  threshold: number;
  /** 告警总开关 */
  alertsEnabled: boolean;
  /** 活动告警（最新在末尾） */
  alerts: AlertItem[];
  /** 已告警实例 key（去重，限长） */
  seen: string[];

  toggleKind: (k: string) => void;
  setThreshold: (n: number) => void;
  setAlertsEnabled: (b: boolean) => void;
  isWatched: (k: string) => boolean;
  /** 异常榜每轮刷新后上送候选项，按规则筛出新越阈告警 */
  ingest: (candidates: AlertCandidate[]) => void;
  dismissAlert: (key: string) => void;
  /** 持久化水合（仅客户端调用） */
  hydrate: (p: { kinds?: string[]; threshold?: number; alertsEnabled?: boolean }) => void;
}

export const useWatchlistStore = create<WatchlistState>((set, get) => ({
  kinds: [],
  threshold: 60,
  alertsEnabled: true,
  alerts: [],
  seen: [],

  toggleKind: (k) =>
    set((s) => ({
      kinds: s.kinds.includes(k) ? s.kinds.filter((x) => x !== k) : [...s.kinds, k],
    })),

  setThreshold: (n) => set({ threshold: Math.max(0, Math.min(100, Math.round(n))) }),

  setAlertsEnabled: (b) => set({ alertsEnabled: b }),

  isWatched: (k) => get().kinds.includes(k),

  ingest: (candidates) => {
    const { alertsEnabled, kinds, threshold, seen, alerts } = get();
    if (!alertsEnabled || kinds.length === 0) return;
    const seenSet = new Set(seen);
    const fresh: AlertItem[] = [];
    for (const c of candidates) {
      if (!kinds.includes(c.kind) || c.score < threshold || seenSet.has(c.key)) continue;
      seenSet.add(c.key);
      fresh.push({ ...c, at: Date.now() });
    }
    if (fresh.length === 0) return;
    const nextAlerts = [...alerts, ...fresh].slice(-ALERTS_CAP);
    const nextSeen = [...seen, ...fresh.map((f) => f.key)].slice(-SEEN_CAP);
    set({ alerts: nextAlerts, seen: nextSeen });
  },

  dismissAlert: (key) => set((s) => ({ alerts: s.alerts.filter((a) => a.key !== key) })),

  hydrate: (p) =>
    set((s) => ({
      kinds: Array.isArray(p.kinds) ? p.kinds.filter((x) => typeof x === 'string') : s.kinds,
      threshold:
        typeof p.threshold === 'number' && p.threshold >= 0 && p.threshold <= 100
          ? Math.round(p.threshold)
          : s.threshold,
      alertsEnabled: typeof p.alertsEnabled === 'boolean' ? p.alertsEnabled : s.alertsEnabled,
    })),
}));
