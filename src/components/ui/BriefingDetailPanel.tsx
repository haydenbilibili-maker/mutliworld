'use client';

/**
 * AI 简报详情弹窗 — 右侧滑出，查看后台生成完成的简报全文。
 * 与生成解耦：可随时打开/关闭，不影响地图浏览。
 */

import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useBriefingStore, type BriefingStatus } from '@/store/useBriefingStore';

const STATUS_LABEL: Record<BriefingStatus, string> = {
  loading: '生成中…',
  done: '已生成',
  no_key: '未配置 LLM',
  error: '生成失败',
};

export function BriefingDetailPanel() {
  const detailKey = useBriefingStore((s) => s.detailKey);
  const tasks = useBriefingStore((s) => s.tasks);
  const close = useBriefingStore((s) => s.closeDetail);
  const task = detailKey ? tasks[detailKey] : null;

  useEffect(() => {
    if (!detailKey) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [detailKey, close]);

  return (
    <AnimatePresence>
      {task && (
        <motion.aside
          key={task.key}
          initial={{ opacity: 0, x: 36 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 36 }}
          transition={{ duration: 0.2 }}
          role="dialog"
          aria-label="AI 态势简报详情"
          className="fixed right-3 top-20 z-[75] flex max-h-[72vh] w-[min(24rem,calc(100vw-1.5rem))] flex-col rounded-xl border border-dashboard-neutral/25 bg-dashboard-bg/96 shadow-2xl backdrop-blur-md"
        >
          <div className="flex items-center gap-2 border-b border-dashboard-neutral/15 px-3.5 py-2.5">
            <span className="text-sm font-medium text-white">✨ {task.label}</span>
            <span className="rounded bg-white/5 px-1.5 py-0.5 text-[10px] text-dashboard-neutral/70">
              {STATUS_LABEL[task.status]}
            </span>
            <button
              type="button"
              onClick={close}
              aria-label="关闭详情"
              className="ml-auto rounded px-1.5 text-dashboard-neutral/70 hover:bg-white/5 hover:text-white"
            >
              ✕
            </button>
          </div>

          <div className="overflow-y-auto px-3.5 py-3">
            {task.status === 'done' && (
              <p className="whitespace-pre-wrap text-[12.5px] leading-relaxed text-dashboard-neutral/90">
                {task.text}
              </p>
            )}
            {task.status === 'no_key' && (
              <p className="text-[11px] leading-snug text-amber-300/85">
                未配置 LLM 密钥。在 Vercel 设置 DEEPSEEK_API_KEY（或 LLM_API_KEY）即可启用 AI 合成；
                当前各面板仍展示规则化结构合成简报。
              </p>
            )}
            {task.status === 'error' && (
              <p className="text-[11px] text-dashboard-conflict/85">生成失败，请稍后在面板重新点击「生成」。</p>
            )}
          </div>

          <div className="border-t border-dashboard-neutral/10 px-3.5 py-2 text-[10px] text-dashboard-neutral/45">
            {task.finishedAt ? new Date(task.finishedAt).toLocaleString('zh-CN') : ''} · AI 合成仅基于真实监测数据、保留来源、不编造
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
