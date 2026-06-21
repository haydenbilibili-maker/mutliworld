'use client';

/**
 * 叙事故事线（3.0 协作与叙事 F②）— 把一次分析沉淀为可播放、可分享的多帧故事。
 *
 * 每「帧」捕捉当前视图态（与「分享深链」同一套 URL 查询参数：空间层 / 投影 / 图层 / 视野 / 配色…）
 * 加一句解说。播放时按帧依序还原视图态形成导览。帧/停留时长持久化到 localStorage。
 * 仅记录视图态与文字，不改动任何真实数据，不编造。
 */

import { create } from 'zustand';

export interface StoryFrame {
  id: string;
  title: string;
  note: string;
  /** 视图态查询串（不含前导 ?） */
  query: string;
  at: number;
}

const FRAMES_CAP = 60;

interface StoryState {
  frames: StoryFrame[];
  playing: boolean;
  /** 当前播放/高亮帧序号（-1 表示无） */
  currentIndex: number;
  /** 每帧停留毫秒 */
  dwellMs: number;

  addFrame: (f: { title: string; note: string; query: string }) => void;
  removeFrame: (id: string) => void;
  updateFrame: (id: string, patch: Partial<Pick<StoryFrame, 'title' | 'note'>>) => void;
  move: (id: string, dir: -1 | 1) => void;
  clear: () => void;
  setPlaying: (b: boolean) => void;
  setCurrentIndex: (i: number) => void;
  setDwellMs: (n: number) => void;
  hydrate: (p: { frames?: StoryFrame[]; dwellMs?: number }) => void;
}

function genId(): string {
  return `f${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
}

export const useStoryStore = create<StoryState>((set) => ({
  frames: [],
  playing: false,
  currentIndex: -1,
  dwellMs: 4500,

  addFrame: ({ title, note, query }) =>
    set((s) => ({
      frames: [...s.frames, { id: genId(), title, note, query, at: Date.now() }].slice(-FRAMES_CAP),
    })),

  removeFrame: (id) => set((s) => ({ frames: s.frames.filter((f) => f.id !== id) })),

  updateFrame: (id, patch) =>
    set((s) => ({ frames: s.frames.map((f) => (f.id === id ? { ...f, ...patch } : f)) })),

  move: (id, dir) =>
    set((s) => {
      const i = s.frames.findIndex((f) => f.id === id);
      const j = i + dir;
      if (i < 0 || j < 0 || j >= s.frames.length) return s;
      const next = s.frames.slice();
      [next[i], next[j]] = [next[j], next[i]];
      return { frames: next };
    }),

  clear: () => set({ frames: [], currentIndex: -1, playing: false }),

  setPlaying: (b) => set({ playing: b }),
  setCurrentIndex: (i) => set({ currentIndex: i }),
  setDwellMs: (n) => set({ dwellMs: Math.max(1500, Math.min(20000, Math.round(n))) }),

  hydrate: (p) =>
    set((s) => ({
      frames: Array.isArray(p.frames)
        ? p.frames
            .filter((f) => f && typeof f.query === 'string')
            .map((f) => ({
              id: typeof f.id === 'string' ? f.id : genId(),
              title: typeof f.title === 'string' ? f.title : '未命名帧',
              note: typeof f.note === 'string' ? f.note : '',
              query: f.query,
              at: typeof f.at === 'number' ? f.at : Date.now(),
            }))
            .slice(-FRAMES_CAP)
        : s.frames,
      dwellMs: typeof p.dwellMs === 'number' && p.dwellMs >= 1500 && p.dwellMs <= 20000 ? Math.round(p.dwellMs) : s.dwellMs,
    })),
}));
