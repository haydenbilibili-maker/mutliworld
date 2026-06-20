'use client';

/**
 * 全球直播 — 接入主流媒体 24/7 实时直播（YouTube 频道直播嵌入）。
 * 左侧频道列表 + 主区 iframe 播放器；可随时关闭，不影响地图浏览。
 */

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useLiveStreamStore } from '@/store/useLiveStreamStore';
import { LIVE_CHANNELS, channelEmbedUrl } from '@/data/liveChannels';

export function GlobalLivePanel() {
  const open = useLiveStreamStore((s) => s.open);
  const setOpen = useLiveStreamStore((s) => s.setOpen);
  const [activeId, setActiveId] = useState(LIVE_CHANNELS[0].id);
  const active = LIVE_CHANNELS.find((c) => c.id === activeId) ?? LIVE_CHANNELS[0];

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[70] flex items-center justify-center p-3 sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-black/65 backdrop-blur-sm" onClick={() => setOpen(false)} aria-hidden />
          <motion.div
            role="dialog"
            aria-label="全球直播"
            initial={{ opacity: 0, scale: 0.97, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 12 }}
            transition={{ duration: 0.18 }}
            className="relative flex h-[min(80vh,42rem)] w-[min(64rem,calc(100vw-1.5rem))] flex-col overflow-hidden rounded-xl border border-dashboard-neutral/25 bg-dashboard-bg/97 shadow-2xl backdrop-blur-md"
          >
            <div className="flex items-center gap-2 border-b border-dashboard-neutral/15 px-4 py-2.5">
              <span className="h-2 w-2 animate-pulse rounded-full bg-red-500" aria-hidden />
              <span className="text-sm font-medium text-white">全球直播 · LIVE</span>
              <span className="text-[11px] text-dashboard-neutral/55">主流媒体 24/7 实时直播 · 中立并陈</span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="关闭直播"
                className="ml-auto rounded px-2 py-0.5 text-dashboard-neutral/70 hover:bg-white/5 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="flex min-h-0 flex-1 flex-col sm:flex-row">
              {/* 频道列表 */}
              <ul className="flex shrink-0 gap-1 overflow-x-auto border-b border-dashboard-neutral/10 p-2 sm:w-56 sm:flex-col sm:overflow-y-auto sm:border-b-0 sm:border-r">
                {LIVE_CHANNELS.map((c) => {
                  const on = c.id === activeId;
                  return (
                    <li key={c.id} className="shrink-0 sm:shrink">
                      <button
                        type="button"
                        onClick={() => setActiveId(c.id)}
                        className={[
                          'flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-left transition-colors',
                          on ? 'bg-brand-cyan/15 text-white' : 'text-dashboard-neutral hover:bg-white/5 hover:text-white',
                        ].join(' ')}
                      >
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-[12px] font-medium leading-tight">{c.name}</span>
                          <span className="block truncate text-[10px] text-dashboard-neutral/50">{c.region} · {c.lang}</span>
                        </span>
                        {on && <span className="shrink-0 text-[9px] text-red-400">● LIVE</span>}
                      </button>
                    </li>
                  );
                })}
              </ul>

              {/* 播放器 */}
              <div className="flex min-h-0 flex-1 flex-col bg-black">
                <div className="relative flex-1">
                  <iframe
                    key={active.channelId}
                    title={active.name}
                    src={channelEmbedUrl(active.channelId)}
                    className="absolute inset-0 h-full w-full"
                    allow="autoplay; encrypted-media; picture-in-picture"
                    allowFullScreen
                    referrerPolicy="strict-origin-when-cross-origin"
                  />
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 text-[10px] text-dashboard-neutral/50">
                  <span className="truncate">{active.name}</span>
                  <a
                    href={`https://www.youtube.com/channel/${active.channelId}/live`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-auto shrink-0 text-brand-cyan hover:text-white"
                  >
                    在 YouTube 打开 ↗
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
