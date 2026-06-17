'use client';

/**
 * 区域切换器 — LIFEOS-005 平台化
 *
 * 紧凑下拉选择；由区域注册表驱动，未启用（迁移中）的区域置灰不可选。
 */

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useMapStore } from '@/store/useMapStore';
import { listRegions } from '@/regions';
import type { RegionId } from '@/types/region';
import { REGION_SWITCHER_TOOLTIP } from '@/lib/region/contentFilter';

interface RegionSwitcherProps {
  className?: string;
}

export function RegionSwitcher({ className = '' }: RegionSwitcherProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);

  const activeRegion = useMapStore((s) => s.activeRegion);
  const setRegion = useMapStore((s) => s.setRegion);
  const regions = listRegions();

  const current = regions.find((r) => r.id === (activeRegion as RegionId));

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) {
        setOpen(false);
      }
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

  const handleSelect = (id: RegionId, enabled: boolean) => {
    if (!enabled) return;
    setRegion(id);
    setOpen(false);
  };

  return (
    <div ref={rootRef} className={['relative', className].filter(Boolean).join(' ')}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label="区域切换"
        title={REGION_SWITCHER_TOOLTIP}
        className={[
          'flex items-center gap-2 rounded-lg border px-3 py-2 text-sm shadow-lg backdrop-blur-md transition-colors',
          'ring-1 ring-white/10',
          open
            ? 'border-dashboard-military/60 bg-dashboard-bg/95 text-white'
            : 'border-white/20 bg-dashboard-bg/95 text-white/90 hover:border-dashboard-military/40 hover:text-white',
        ].join(' ')}
      >
        <span className="max-w-[10rem] truncate sm:max-w-[12rem]">
          {current?.name ?? '全球'}
        </span>
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
          className={[
            'shrink-0 transition-transform duration-150',
            open ? 'rotate-180' : '',
          ].join(' ')}
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            role="listbox"
            aria-label="选择区域"
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className={[
              'absolute left-0 top-full z-50 mt-1.5 w-[min(16rem,calc(100vw-2rem))]',
              'overflow-hidden rounded-lg border border-white/15',
              'bg-dashboard-bg/95 shadow-xl backdrop-blur-md',
            ].join(' ')}
          >
            <div className="border-b border-dashboard-neutral/15 px-3 py-2 text-[10px] uppercase tracking-wide text-dashboard-neutral/55">
              区域
            </div>
            <ul className="max-h-[min(50vh,18rem)] overflow-y-auto py-1">
              {regions.map((r) => {
                const active = r.id === (activeRegion as RegionId);
                return (
                  <li key={r.id}>
                    <button
                      type="button"
                      role="option"
                      aria-selected={active}
                      disabled={!r.enabled}
                      title={r.enabled ? r.viewpoint : r.note ?? '迁移中'}
                      onClick={() => handleSelect(r.id, r.enabled)}
                      className={[
                        'flex w-full items-center gap-2 px-3 py-2 text-left text-sm transition-colors',
                        active
                          ? 'bg-dashboard-military/15 text-white'
                          : 'text-dashboard-neutral hover:bg-white/5 hover:text-white',
                        !r.enabled ? 'cursor-not-allowed opacity-40' : '',
                      ].join(' ')}
                    >
                      <span className="min-w-0 flex-1 font-medium">{r.name}</span>
                      {!r.enabled && (
                        <span className="shrink-0 text-xs text-dashboard-neutral/60">
                          待迁
                        </span>
                      )}
                      {active && r.enabled && (
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          aria-hidden
                          className="shrink-0 text-dashboard-military"
                        >
                          <path d="M20 6 9 17l-5-5" />
                        </svg>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
