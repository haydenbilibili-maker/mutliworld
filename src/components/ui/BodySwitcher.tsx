'use client';

/**
 * 天体切换器 — 多天体探索 v2.0（地球 / 月球 / 火星）
 * 顶栏「世界」选择，切换即换天体底图与默认视野。默认地球，零回归。
 */

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useMapStore } from '@/store/useMapStore';
import { listBodies } from '@/bodies';

interface BodySwitcherProps {
  className?: string;
}

export function BodySwitcher({ className = '' }: BodySwitcherProps) {
  const activeBody = useMapStore((s) => s.activeBody);
  const setBody = useMapStore((s) => s.setBody);
  const bodies = listBodies();
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);

  const current = bodies.find((b) => b.id === activeBody) ?? bodies[0];

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
        aria-label={`天体：${current.name}`}
        title="切换天体（地球 / 月球 / 火星）"
        className={[
          'flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs transition-colors sm:text-sm',
          activeBody !== 'earth'
            ? 'border-brand-gold/45 bg-brand-gold/10 text-white'
            : open
              ? 'border-brand-cyan/45 bg-dashboard-bg/95 text-white'
              : 'border-dashboard-neutral/25 bg-dashboard-bg/85 text-dashboard-neutral hover:border-dashboard-neutral/40 hover:text-white',
        ].join(' ')}
      >
        <span className="text-sm leading-none" aria-hidden>{current.icon}</span>
        <span className="font-medium">{current.name}</span>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden className={['shrink-0 transition-transform duration-150', open ? 'rotate-180' : ''].join(' ')}>
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15 }}
            role="listbox"
            aria-label="天体"
            className="absolute left-0 top-full z-50 mt-1.5 w-44 overflow-hidden rounded-lg border border-dashboard-neutral/25 bg-dashboard-bg/95 p-1 shadow-xl backdrop-blur-md"
          >
            {bodies.map((b) => {
              const active = b.id === activeBody;
              return (
                <li key={b.id}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={active}
                    onClick={() => {
                      setBody(b.id);
                      setOpen(false);
                    }}
                    title={b.tagline}
                    className={[
                      'flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-left transition-colors',
                      active ? 'bg-brand-cyan/15 text-white' : 'text-dashboard-neutral hover:bg-white/5 hover:text-white',
                    ].join(' ')}
                  >
                    <span className="shrink-0 text-base leading-none" aria-hidden>{b.icon}</span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-[12px] font-medium leading-tight">{b.name}</span>
                      <span className="block truncate text-[10px] text-dashboard-neutral/55">{b.tagline}</span>
                    </span>
                    {active && <span aria-hidden className="shrink-0 text-brand-cyan">✓</span>}
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
