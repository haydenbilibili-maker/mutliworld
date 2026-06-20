'use client';

/**
 * AI 态势简报 — 全局后台生成 store。
 *
 * 生成脱离组件生命周期：点击「生成」后在后台请求 /api/briefing，用户可自由切换区域/天体/页面，
 * 生成不中断；完成后入通知队列（弹窗 toast），可在右侧详情弹窗查看全文。
 */

import { create } from 'zustand';

export type BriefingStatus = 'loading' | 'done' | 'no_key' | 'error';

export interface BriefingTask {
  key: string;
  label: string;
  status: BriefingStatus;
  text: string;
  startedAt: number;
  finishedAt?: number;
}

interface BriefingState {
  tasks: Record<string, BriefingTask>;
  /** 已完成但未查看的通知（key 列表，最新在末尾） */
  notifications: string[];
  /** 当前在右侧详情弹窗中查看的 key */
  detailKey: string | null;
  generate: (key: string, label: string, body: unknown) => void;
  openDetail: (key: string) => void;
  closeDetail: () => void;
  dismissNotification: (key: string) => void;
}

export const useBriefingStore = create<BriefingState>((set, get) => ({
  tasks: {},
  notifications: [],
  detailKey: null,

  generate: (key, label, body) => {
    const cur = get().tasks[key];
    if (cur?.status === 'loading') return; // 同一范围生成中则忽略重复点击

    set((s) => ({
      tasks: {
        ...s.tasks,
        [key]: { key, label, status: 'loading', text: '', startedAt: Date.now() },
      },
    }));

    // 后台请求：不依赖组件挂载状态，导航切换不中断
    fetch('/api/briefing', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
      .then(async (res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = (await res.json()) as { briefing?: string; degraded?: string };
        let status: BriefingStatus = 'done';
        let text = '';
        if (json.degraded === 'no_key') status = 'no_key';
        else if (!json.briefing) status = 'error';
        else text = json.briefing;
        set((s) => ({
          tasks: { ...s.tasks, [key]: { ...s.tasks[key], status, text, finishedAt: Date.now() } },
          notifications: [...s.notifications.filter((k) => k !== key), key],
        }));
      })
      .catch(() => {
        set((s) => ({
          tasks: { ...s.tasks, [key]: { ...s.tasks[key], status: 'error', finishedAt: Date.now() } },
          notifications: [...s.notifications.filter((k) => k !== key), key],
        }));
      });
  },

  openDetail: (key) =>
    set((s) => ({ detailKey: key, notifications: s.notifications.filter((k) => k !== key) })),

  closeDetail: () => set({ detailKey: null }),

  dismissNotification: (key) =>
    set((s) => ({ notifications: s.notifications.filter((k) => k !== key) })),
}));
