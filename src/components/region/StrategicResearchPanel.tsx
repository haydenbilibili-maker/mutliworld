'use client';

/**
 * 战略研究 · 通用半屏右侧抽屉（50vw）
 * 左侧模块导航 + 右侧可滚动长文；各主题面板共用此壳层。
 */

import { useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMapStore } from '@/store/useMapStore';
import { useStrategicResearchStore } from '@/store/useStrategicResearchStore';
import { PanelCloseButton } from '@/components/ui/PanelCloseButton';
import { LAYER_LABELS } from '@/lib/constants';
import { tierForLayer } from '@/tiers';
import type {
  StrategicResearchModule,
  StrategicResearchPanelId,
  StrategicResearchRelatedPanel,
} from '@/types/strategic-research';
import type { LayerId } from '@/types/geo';

interface StrategicResearchPanelProps {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  modules: StrategicResearchModule[];
  activeModuleId: string;
  onModuleChange: (id: string) => void;
  footer?: string;
  className?: string;
  /** 面板 aria 标签 */
  ariaLabel?: string;
  parentPanelId?: StrategicResearchPanelId;
  relatedPanels?: StrategicResearchRelatedPanel[];
}

export function StrategicResearchPanel({
  open,
  onClose,
  title,
  subtitle = '战略研究 · 深度阅读',
  modules,
  activeModuleId,
  onModuleChange,
  footer,
  className = '',
  ariaLabel,
  parentPanelId,
  relatedPanels,
}: StrategicResearchPanelProps) {
  const setCenter = useMapStore((s) => s.setCenter);
  const setZoom = useMapStore((s) => s.setZoom);
  const setTier = useMapStore((s) => s.setTier);
  const activeTier = useMapStore((s) => s.activeTier);
  const setActiveLayers = useMapStore((s) => s.setActiveLayers);
  const activeLayers = useMapStore((s) => s.activeLayers);
  const openPanel = useStrategicResearchStore((s) => s.openPanel);
  const panelRef = useRef<HTMLElement>(null);

  const module =
    modules.find((m) => m.id === activeModuleId) ?? modules[0];

  const showOnMap = useCallback(() => {
    if (!module) return;
    const layerIds = module.relatedLayerIds ?? [];
    const needsSurface = layerIds.some((id) => tierForLayer(id) === 'surface');
    if (needsSurface && activeTier !== 'surface') {
      setTier('surface');
    }
    if (module.mapView) {
      setCenter(module.mapView.center);
      setZoom(module.mapView.zoom);
    }
    if (layerIds.length) {
      const merged = Array.from(new Set([...activeLayers, ...layerIds])) as LayerId[];
      setActiveLayers(merged);
    }
  }, [module, setCenter, setZoom, setTier, activeTier, setActiveLayers, activeLayers]);

  useEffect(() => {
    if (!open) return;
    const closeBtn = panelRef.current?.querySelector<HTMLButtonElement>(
      '[aria-label*="关闭"]',
    );
    closeBtn?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      e.preventDefault();
      onClose();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  if (!module) return null;

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.button
            type="button"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 z-[29] bg-black/40 backdrop-blur-[1px]"
            aria-label="关闭战略研究面板"
            onClick={onClose}
          />
          <motion.aside
            ref={panelRef}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.28 }}
            className={[
              'absolute top-0 right-0 z-30 flex h-full',
              'w-full sm:w-1/2 sm:min-w-[20rem] sm:max-w-[50vw]',
              'border-l border-dashboard-neutral/25 bg-dashboard-bg/97 shadow-2xl backdrop-blur-md',
              className,
            ].join(' ')}
            role="dialog"
            aria-modal="true"
            aria-label={ariaLabel ?? title}
          >
            <div className="flex min-h-0 min-w-0 flex-1 flex-col">
              <header className="flex shrink-0 items-center gap-3 border-b border-dashboard-neutral/15 px-4 py-3">
                <div className="min-w-0 flex-1">
                  <h1 className="text-base font-semibold leading-snug text-white">
                    {title}
                  </h1>
                  <p className="mt-0.5 text-[11px] text-dashboard-neutral/70">
                    {subtitle}
                  </p>
                </div>
                <PanelCloseButton onClick={onClose} label="关闭战略研究面板" />
              </header>

              <div className="flex min-h-0 min-w-0 flex-1">
                <nav
                  className="w-[9.5rem] shrink-0 overflow-y-auto border-r border-dashboard-neutral/10 bg-black/20 py-2 sm:w-44"
                  aria-label="研究模块"
                >
                  {modules.map((m) => {
                    const active = m.id === activeModuleId;
                    return (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => onModuleChange(m.id)}
                        className={[
                          'block w-full px-3 py-2.5 text-left text-[12px] leading-snug transition-colors',
                          active
                            ? 'border-r-2 border-amber-500/80 bg-white/5 text-white'
                            : 'text-dashboard-neutral hover:bg-white/5 hover:text-white',
                        ].join(' ')}
                      >
                        <span className="block break-words">{m.title}</span>
                      </button>
                    );
                  })}
                </nav>

                <div className="min-h-0 min-w-0 flex-1 overflow-y-auto overflow-x-hidden px-4 py-4 sm:px-5">
                  <div className="mb-4 min-w-0">
                    <h2 className="text-lg font-semibold leading-snug text-white">
                      {module.title}
                    </h2>
                    <p className="mt-1.5 text-[13px] leading-relaxed text-dashboard-neutral/90">
                      {module.summary}
                    </p>
                  </div>

                  {(module.mapView || module.relatedLayerIds?.length) && (
                    <div className="mb-5 flex min-w-0 flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={showOnMap}
                        className="shrink-0 rounded-md border border-amber-500/40 bg-amber-500/10 px-3 py-1.5 text-[12px] text-amber-200 transition-colors hover:bg-amber-500/20"
                      >
                        在地图上查看
                      </button>
                      {module.relatedLayerIds?.map((lid) => (
                        <span
                          key={lid}
                          className="shrink-0 rounded-full bg-white/5 px-2 py-0.5 text-[10px] text-dashboard-neutral/80"
                        >
                          {LAYER_LABELS[lid]}
                        </span>
                      ))}
                    </div>
                  )}

                  {relatedPanels && relatedPanels.length > 0 && (
                    <div className="mb-5 flex min-w-0 flex-wrap gap-2">
                      {relatedPanels.map((rel) => (
                        <button
                          key={rel.panelId}
                          type="button"
                          onClick={() => openPanel(rel.panelId, rel.moduleId)}
                          className="shrink-0 rounded-md border border-dashboard-neutral/25 bg-white/5 px-3 py-1.5 text-[12px] text-dashboard-neutral/90 transition-colors hover:border-amber-500/35 hover:bg-amber-500/10 hover:text-amber-100"
                        >
                          {parentPanelId === rel.panelId ? '← ' : ''}
                          {rel.label}
                          {parentPanelId !== rel.panelId ? ' →' : ''}
                        </button>
                      ))}
                    </div>
                  )}

                  <article className="min-w-0 space-y-6">
                    {module.sections.map((sec) => (
                      <section key={sec.heading} className="min-w-0">
                        <h3 className="mb-2 text-[14px] font-medium leading-snug text-white/95">
                          {sec.heading}
                        </h3>
                        <div className="space-y-3">
                          {sec.paragraphs.map((p, i) => (
                            <p
                              key={i}
                              className="text-[13px] leading-[1.75] text-dashboard-neutral/85"
                            >
                              {p}
                            </p>
                          ))}
                        </div>
                      </section>
                    ))}
                  </article>

                  {footer && (
                    <footer className="mt-8 border-t border-dashboard-neutral/10 pt-3 text-[10px] text-dashboard-neutral/45">
                      {footer}
                    </footer>
                  )}
                </div>
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
