'use client';

/**
 * 空间层选择器 — 宇宙 / 地表 / 洋底（下拉，嵌入底部控制条）
 * 由原左侧竖向 TierSwitcher 拆出，仅保留层级切换；下拉而非平铺，提升坪效。
 */

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useMapStore } from '@/store/useMapStore';
import { listTiers } from '@/tiers';

interface TierSelectorProps {
  className?: string;
}

export function TierSelector({ className = '' }: TierSelectorProps) {
  const activeTier = useMapStore((s) => s.activeTier);
  const setTier = useMapStore((s) => s.setTier);
  const tiers = listTiers();
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);

  const current = tiers.find((t) => t.id === activeTier) ?? tiers[0];

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  return (
    <div ref={rootRef} className={['relative', className].join(' ')}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label={`空间层：${current.name}`}
        title="切换空间层（宇宙 / 地表 / 洋底）"
        className={[
          'flex items-center gap-1.5 rounded px-2 py-1 text-xs transition-colors sm:px-3 sm:py-1.5 sm:text-sm',
          open
            ? 'bg-dashboard-military/25 text-white'
            : 'text-dashboard-neutral hover:bg-dashboard-neutral/20 hover:text-white',
        ].join(' ')}
      >
        <span className="text-sm leading-none" aria-hidden>{current.icon}</span>
        <span className="font-medium text-white">{current.name}</span>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden className={['shrink-0 transition-transform duration-150', open ? 'rotate-180' : ''].join(' ')}>
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.15 }}
            role="listbox"
            aria-label="空间层"
            className="absolute bottom-full left-0 z-50 mb-1.5 w-44 overflow-hidden rounded-lg border border-dashboard-neutral/25 bg-dashboard-bg/95 p-1 shadow-xl backdrop-blur-md"
          >
            {tiers.map((t) => {
              const active = t.id === activeTier;
              return (
                <li key={t.id}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={active}
                    onClick={() => {
                      setTier(t.id);
                      setOpen(false);
                    }}
                    title={t.tagline}
                    className={[
                      'flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-left transition-colors',
                      active
                        ? 'bg-dashboard-military/20 text-white'
                        : 'text-dashboard-neutral hover:bg-white/5 hover:text-white',
                    ].join(' ')}
                  >
                    <span className="shrink-0 text-base leading-none" aria-hidden>{t.icon}</span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-[12px] font-medium leading-tight">{t.name}</span>
                      <span className="block truncate text-[10px] text-dashboard-neutral/55">{t.tagline}</span>
                    </span>
                    {active && <span aria-hidden className="shrink-0 text-dashboard-military">✓</span>}
                  </button>
                </li>
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
