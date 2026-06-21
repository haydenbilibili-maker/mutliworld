'use client';

/**
 * 叙事故事线面板（F②）— 捕捉视图态为帧、编排、播放导览、导出。
 * 播放时按帧依序还原视图态（复用「分享深链」的 applyViewStateFromParams），形成讲解式导览。
 */

import { useEffect, useRef, useState } from 'react';
import { DockPanel } from '@/components/region/DockPanel';
import { useStoryStore, type StoryFrame } from '@/store/useStoryStore';
import { applyViewStateFromParams } from '@/hooks/useSyncStateToUrl';

function captureQuery(): string {
  if (typeof window === 'undefined') return '';
  return window.location.search.replace(/^\?/, '');
}

/** 将一帧的视图态应用到地图，并同步地址栏（与深链一致） */
function applyFrame(f: StoryFrame) {
  const sp = new URLSearchParams(f.query);
  applyViewStateFromParams(sp);
  if (typeof window !== 'undefined') {
    const qs = sp.toString();
    window.history.replaceState(window.history.state, '', qs ? `${window.location.pathname}?${qs}` : window.location.pathname);
  }
}

export function StoryPanel({ className = '' }: { className?: string }) {
  const frames = useStoryStore((s) => s.frames);
  const playing = useStoryStore((s) => s.playing);
  const currentIndex = useStoryStore((s) => s.currentIndex);
  const dwellMs = useStoryStore((s) => s.dwellMs);
  const addFrame = useStoryStore((s) => s.addFrame);
  const removeFrame = useStoryStore((s) => s.removeFrame);
  const updateFrame = useStoryStore((s) => s.updateFrame);
  const move = useStoryStore((s) => s.move);
  const clear = useStoryStore((s) => s.clear);
  const setPlaying = useStoryStore((s) => s.setPlaying);
  const setCurrentIndex = useStoryStore((s) => s.setCurrentIndex);
  const setDwellMs = useStoryStore((s) => s.setDwellMs);

  const [copied, setCopied] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 播放控制：从 currentIndex 起按 dwellMs 依序还原各帧
  useEffect(() => {
    if (!playing) {
      if (timerRef.current) { clearTimeout(timerRef.current); timerRef.current = null; }
      return;
    }
    const all = useStoryStore.getState().frames;
    if (all.length === 0) { setPlaying(false); return; }
    let i = Math.max(0, useStoryStore.getState().currentIndex);

    const step = () => {
      const cur = useStoryStore.getState().frames;
      if (i >= cur.length) { setPlaying(false); return; }
      setCurrentIndex(i);
      applyFrame(cur[i]);
      i += 1;
      timerRef.current = setTimeout(step, useStoryStore.getState().dwellMs);
    };
    step();

    return () => { if (timerRef.current) { clearTimeout(timerRef.current); timerRef.current = null; } };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing]);

  const capture = () => {
    const n = frames.length + 1;
    addFrame({ title: `第 ${n} 帧`, note: '', query: captureQuery() });
  };

  const playFrom = (idx: number) => {
    setCurrentIndex(idx);
    setPlaying(true);
  };

  const jump = (f: StoryFrame, idx: number) => {
    setPlaying(false);
    setCurrentIndex(idx);
    applyFrame(f);
  };

  const copyLink = async (f: StoryFrame) => {
    if (typeof window === 'undefined') return;
    const url = `${window.location.origin}${window.location.pathname}${f.query ? `?${f.query}` : ''}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(f.id);
      setTimeout(() => setCopied((c) => (c === f.id ? null : c)), 1500);
    } catch { /* 剪贴板不可用 */ }
  };

  const exportJson = () => {
    if (typeof window === 'undefined') return;
    const blob = new Blob([JSON.stringify({ version: 1, exportedAt: new Date().toISOString(), frames }, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `omnilens-story-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <DockPanel
      id="story"
      icon="📖"
      title="叙事故事线"
      count={frames.length || undefined}
      className={`w-[min(20rem,calc(100vw-2rem))] border-violet-500/25 bg-dashboard-bg/95 shadow-xl backdrop-blur-md ${className}`}
      headerRight={
        frames.length > 0 ? (
          <button
            type="button"
            onClick={() => (playing ? setPlaying(false) : playFrom(currentIndex >= 0 && currentIndex < frames.length ? currentIndex : 0))}
            title={playing ? '停止播放' : '从当前帧播放导览'}
            className="rounded px-1.5 py-0.5 text-[11px] text-violet-200 transition-colors hover:bg-white/5"
          >
            {playing ? '⏸ 停止' : '▶ 播放'}
          </button>
        ) : undefined
      }
    >
      <div className="space-y-2 text-[11px]">
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={capture}
            className="flex-1 rounded-md border border-violet-400/40 bg-violet-400/10 px-2 py-1.5 text-[12px] font-medium text-violet-100 transition-colors hover:bg-violet-400/20"
          >
            ＋ 捕捉当前视图为帧
          </button>
          {frames.length > 0 && (
            <button type="button" onClick={exportJson} title="导出故事线 JSON" className="shrink-0 rounded-md px-2 py-1.5 text-dashboard-neutral/70 hover:bg-white/5 hover:text-white">⬇ JSON</button>
          )}
        </div>

        {frames.length > 1 && (
          <label className="flex items-center gap-2 px-0.5 text-[10px] text-dashboard-neutral/55">
            每帧停留
            <input
              type="range" min={1500} max={12000} step={500}
              value={dwellMs}
              onChange={(e) => setDwellMs(Number(e.target.value))}
              className="h-1 flex-1 accent-violet-400"
              aria-label="每帧停留时长"
            />
            <span className="w-9 text-right tabular-nums text-violet-200">{(dwellMs / 1000).toFixed(1)}s</span>
          </label>
        )}

        {frames.length === 0 ? (
          <div className="rounded-md bg-white/5 px-2 py-3 text-center text-dashboard-neutral/50">
            调好空间层 / 图层 / 视野后，点「捕捉当前视图为帧」开始编排一段可播放、可分享的态势故事。
          </div>
        ) : (
          <div className="max-h-[44vh] space-y-1.5 overflow-y-auto pr-0.5">
            {frames.map((f, idx) => (
              <div
                key={f.id}
                className={['rounded-md border px-2 py-1.5 transition-colors', idx === currentIndex && playing ? 'border-violet-400/60 bg-violet-500/10' : 'border-white/5 bg-white/5'].join(' ')}
              >
                <div className="flex items-center gap-1.5">
                  <span className="shrink-0 tabular-nums text-[10px] text-violet-300/70">{idx + 1}</span>
                  <input
                    value={f.title}
                    onChange={(e) => updateFrame(f.id, { title: e.target.value })}
                    className="min-w-0 flex-1 bg-transparent text-[12px] text-dashboard-neutral/90 outline-none focus:text-white"
                    aria-label="帧标题"
                  />
                  <button type="button" onClick={() => move(f.id, -1)} disabled={idx === 0} title="上移" className="shrink-0 rounded px-1 text-dashboard-neutral/50 hover:bg-white/5 hover:text-white disabled:opacity-25">↑</button>
                  <button type="button" onClick={() => move(f.id, 1)} disabled={idx === frames.length - 1} title="下移" className="shrink-0 rounded px-1 text-dashboard-neutral/50 hover:bg-white/5 hover:text-white disabled:opacity-25">↓</button>
                  <button type="button" onClick={() => removeFrame(f.id)} title="删除帧" className="shrink-0 rounded px-1 text-dashboard-neutral/50 hover:bg-white/5 hover:text-rose-300">×</button>
                </div>
                <input
                  value={f.note}
                  onChange={(e) => updateFrame(f.id, { note: e.target.value })}
                  placeholder="解说（可选）…"
                  className="mt-1 w-full bg-transparent text-[10px] text-dashboard-neutral/60 outline-none placeholder:text-dashboard-neutral/30 focus:text-dashboard-neutral/90"
                  aria-label="帧解说"
                />
                <div className="mt-1 flex items-center gap-2 text-[10px]">
                  <button type="button" onClick={() => jump(f, idx)} className="rounded px-1.5 py-0.5 text-violet-200 hover:bg-white/5">跳到此帧</button>
                  <button type="button" onClick={() => playFrom(idx)} className="rounded px-1.5 py-0.5 text-violet-200 hover:bg-white/5">从此播放</button>
                  <button type="button" onClick={() => copyLink(f)} className="ml-auto rounded px-1.5 py-0.5 text-dashboard-neutral/55 hover:bg-white/5 hover:text-white">{copied === f.id ? '已复制 ✓' : '复制链接'}</button>
                </div>
              </div>
            ))}
            <button type="button" onClick={clear} className="w-full rounded-md px-2 py-1 text-[10px] text-dashboard-neutral/40 hover:bg-white/5 hover:text-rose-300">清空故事线</button>
          </div>
        )}

        <div className="border-t border-dashboard-neutral/10 pt-1 text-[9px] text-dashboard-neutral/40">
          仅记录视图态与解说·播放即按帧还原·可导出/分享
        </div>
      </div>
    </DockPanel>
  );
}
