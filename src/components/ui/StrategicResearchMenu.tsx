'use client';

/**
 * 地图控制条 · 战略研究入口
 * 下拉列出当前区域可用的研究主题，避免与左上角 RegionSwitcher 重叠。
 */

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useMapStore } from '@/store/useMapStore';
import { useStrategicResearchStore } from '@/store/useStrategicResearchStore';
import { listAvailableStrategicResearchPanels } from '@/regions/strategic-research/registry';
import type { StrategicResearchPanelId } from '@/types/strategic-research';

interface StrategicResearchMenuProps {
  className?: string;
  embedded?: boolean;
}

export function StrategicResearchMenu({
  className = '',
  embedded = false,
}: StrategicResearchMenuProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const activeRegion = useMapStore((s) => s.activeRegion);
  const panelId = useStrategicResearchStore((s) => s.panelId);
  const researchOpen = useStrategicResearchStore((s) => s.open);
  const openPanel = useStrategicResearchStore((s) => s.openPanel);
  const close = useStrategicResearchStore((s) => s.close);

  const available = listAvailableStrategicResearchPanels(activeRegion);
  const activeDef = panelId
    ? available.find((p) => p.id === panelId)
    : undefined;

  useEffect(() => {
    if (!menuOpen) return;

    const onPointerDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };

    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [menuOpen]);

  if (available.length === 0) return null;

  const handleSelect = (id: StrategicResearchPanelId) => {
    if (researchOpen && panelId === id) {
      close();
    } else {
      openPanel(id);
    }
    setMenuOpen(false);
  };

  return (
    <div ref={rootRef} className={['relative', className].join(' ')}>
      <button
        type="button"
        onClick={() => setMenuOpen((v) => !v)}
        aria-expanded={menuOpen}
        aria-haspopup="listbox"
        aria-pressed={researchOpen}
        aria-label="战略研究"
        title="打开战略研究专题面板"
        className={[
          'flex items-center gap-1.5 rounded px-2 py-1 text-xs transition-colors sm:gap-2 sm:px-3 sm:py-1.5 sm:text-sm',
          embedded
            ? researchOpen
              ? 'bg-amber-500/20 text-amber-100'
              : 'text-dashboard-neutral hover:bg-dashboard-neutral/20 hover:text-white'
            : [
                'gap-2 rounded-lg border px-3 py-2 shadow-lg backdrop-blur-sm',
                researchOpen
                  ? 'border-amber-500/50 bg-dashboard-bg/95 text-amber-100'
                  : 'border-dashboard-neutral/25 bg-dashboard-bg/85 text-dashboard-neutral hover:border-dashboard-neutral/40 hover:text-white',
              ].join(' '),
        ].join(' ')}
      >
        <span aria-hidden>📖</span>
        <span className="whitespace-nowrap">
          {researchOpen && activeDef ? activeDef.title : '研究'}
        </span>
      </button>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.15 }}
            role="listbox"
            aria-label="战略研究主题"
            className={[
              'absolute bottom-full left-0 z-50 mb-1.5 min-w-[11rem] overflow-hidden rounded-lg',
              'border border-dashboard-neutral/25 bg-dashboard-bg/95 shadow-xl backdrop-blur-md',
            ].join(' ')}
          >
            <div className="border-b border-dashboard-neutral/15 px-3 py-2 text-[10px] uppercase tracking-wide text-dashboard-neutral/55">
              战略研究
            </div>
            <ul className="max-h-56 overflow-y-auto py-1">
              {available.map((entry) => {
                const selected = researchOpen && panelId === entry.id;
                return (
                  <li key={entry.id}>
                    <button
                      type="button"
                      role="option"
                      aria-selected={selected}
                      onClick={() => handleSelect(entry.id)}
                      className={[
                        'flex w-full items-center gap-2 px-3 py-2 text-left text-[12px] transition-colors',
                        selected
                          ? 'bg-amber-500/15 text-amber-100'
                          : 'text-dashboard-neutral hover:bg-white/5 hover:text-white',
                      ].join(' ')}
                    >
                      <span aria-hidden className="shrink-0 text-sm">
                        {entry.icon}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block font-medium leading-snug">
                          {entry.title}
                        </span>
                        <span className="block text-[10px] text-dashboard-neutral/60">
                          {entry.subtitle}
                        </span>
                      </span>
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
