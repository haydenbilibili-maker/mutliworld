'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useMapStore } from '@/store/useMapStore';
import { PanelCloseButton } from '@/components/ui/PanelCloseButton';
import { LAYER_HINTS, LAYER_LABELS } from '@/lib/constants';
import { getRegion } from '@/regions';
import type { LayerId } from '@/types/geo';

interface LayerToggleProps {
  className?: string;
  /** 嵌入 MapControlBar 时省略独立按钮外框样式 */
  embedded?: boolean;
}

/** 图层按主题分组（对标 World Monitor 的归类导航） */
const LAYER_GROUPS: { title: string; ids: LayerId[] }[] = [
  {
    title: '冲突与安全',
    ids: ['conflicts', 'conflict_zones', 'hotspots', 'military', 'bases', 'garrisons', 'nuclear', 'sanctions', 'persons'],
  },
  {
    title: '基础设施与通道',
    ids: ['aviation', 'live_flights', 'live_maritime', 'maritime', 'cables', 'pipelines', 'waterways', 'outages'],
  },
  {
    title: '经济与自然',
    ids: ['economic', 'econ_hubs', 'minerals', 'datacenters', 'semiconductors', 'hydrocarbon_reserves', 'natural', 'weather', 'live_weather', 'live_fires', 'climate'],
  },
  {
    title: '社会与时空',
    ids: ['protests', 'daynight'],
  },
  {
    title: 'OSINT 指标',
    ids: ['pizza_index'],
  },
  {
    title: '海洋与洋底空间',
    ids: [
      'deep_sea_mining',
      'tectonics',
      'cable_incidents',
      'quake_depth',
      'marine_archaeology',
      'ocean_currents',
      'fisheries',
      'monsoon',
      'atmospheric_circulation',
      'deep_exploration',
    ],
  },
  {
    title: '宇宙空间',
    ids: [
      'launch_sites', 'launch_log', 'ground_stations', 'sat_constellations',
      'space_stations', 'satellites', 'space_debris', 'space_events',
    ],
  },
];

const LAYER_ORDER: LayerId[] = LAYER_GROUPS.flatMap((g) => g.ids);

/** 始终可用的全球图层（不受区域 layers 限制：全球基础设施叠加） */
const ALWAYS_ON: LayerId[] = [
  'conflict_zones',
  'aviation',
  'live_flights',
  'live_fires',
  'live_maritime',
  'maritime',
  'cables',
  'econ_hubs',
  'minerals',
  'daynight',
  'pipelines',
  'datacenters',
  'protests',
  'climate',
  'live_weather',
  'launch_sites',
  'launch_log',
  'semiconductors',
  'garrisons',
  'deep_sea_mining',
  'tectonics',
  'cable_incidents',
  'quake_depth',
  'marine_archaeology',
  'ocean_currents',
  'fisheries',
  'monsoon',
  'atmospheric_circulation',
  'deep_exploration',
  'hydrocarbon_reserves',
  'ground_stations',
  'sat_constellations',
  'space_stations',
  'satellites',
  'space_debris',
  'space_events',
  'pizza_index',
];

export function LayerToggle({ className = '', embedded = false }: LayerToggleProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);

  const activeRegion = useMapStore((s) => s.activeRegion);
  const activeLayers = useMapStore((s) => s.activeLayers);
  const toggleLayer = useMapStore((s) => s.toggleLayer);
  const setActiveLayers = useMapStore((s) => s.setActiveLayers);

  const regionLayers = useMemo(() => {
    const mod = getRegion(activeRegion);
    const allowed = new Set([...(mod?.layers ?? LAYER_ORDER), ...ALWAYS_ON]);
    return LAYER_ORDER.filter((id) => allowed.has(id));
  }, [activeRegion]);

  const groups = useMemo(() => {
    const allowed = new Set(regionLayers);
    return LAYER_GROUPS.map((g) => ({
      title: g.title,
      ids: g.ids.filter((id) => allowed.has(id)),
    })).filter((g) => g.ids.length > 0);
  }, [regionLayers]);

  const activeCount = activeLayers.filter((id) => regionLayers.includes(id)).length;

  const showAll = useCallback(() => {
    setActiveLayers([...regionLayers]);
  }, [regionLayers, setActiveLayers]);

  const clearAll = useCallback(() => {
    setActiveLayers([]);
  }, [setActiveLayers]);

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

  return (
    <div ref={rootRef} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="dialog"
        aria-label="地图图层"
        title="开关地图数据图层"
        className={[
          'flex items-center gap-1.5 rounded px-2 py-1 text-xs transition-colors sm:gap-2 sm:px-3 sm:py-1.5 sm:text-sm',
          embedded
            ? open
              ? 'bg-dashboard-military/25 text-white'
              : 'text-dashboard-neutral hover:bg-dashboard-neutral/20 hover:text-white'
            : [
                'gap-2 rounded-lg border px-3 py-2 shadow-lg backdrop-blur-sm',
                open
                  ? 'border-dashboard-military/50 bg-dashboard-bg/95 text-white'
                  : 'border-dashboard-neutral/25 bg-dashboard-bg/85 text-dashboard-neutral hover:border-dashboard-neutral/40 hover:text-white',
              ].join(' '),
        ].join(' ')}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <path d="M12 2 2 7l10 5 10-5-10-5Z" />
          <path d="m2 17 10 5 10-5" />
          <path d="m2 12 10 5 10-5" />
        </svg>
        <span>图层</span>
        <span
          className={[
            'min-w-[1.25rem] rounded-full px-1.5 py-0.5 text-center text-xs font-medium tabular-nums',
            activeCount > 0
              ? 'bg-dashboard-military/30 text-white'
              : 'bg-dashboard-neutral/15 text-dashboard-neutral/70',
          ].join(' ')}
        >
          {activeCount}
        </span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            role="dialog"
            aria-label="图层控制"
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className={[
              'absolute bottom-full z-30 mb-2 w-[min(22rem,calc(100vw-2rem))] rounded-lg border border-dashboard-neutral/25',
              'bg-dashboard-bg/95 p-3 shadow-xl backdrop-blur-md',
              embedded ? 'left-1/2 -translate-x-1/2 sm:left-auto sm:right-0 sm:translate-x-0' : 'right-0',
            ].join(' ')}
          >
            <div className="mb-2 flex items-center justify-between gap-2">
              <span className="text-sm font-medium text-white">地图图层</span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={showAll}
                  className="rounded px-2 py-0.5 text-xs text-dashboard-neutral hover:bg-white/5 hover:text-white"
                >
                  全开
                </button>
                <button
                  type="button"
                  onClick={clearAll}
                  className="rounded px-2 py-0.5 text-xs text-dashboard-neutral hover:bg-white/5 hover:text-white"
                >
                  清空
                </button>
                <PanelCloseButton
                  compact
                  onClick={() => setOpen(false)}
                  label="关闭图层面板"
                />
              </div>
            </div>

            <div className="max-h-[40vh] space-y-2.5 overflow-y-auto pr-0.5">
              {groups.map((g) => (
                <div key={g.title}>
                  <div className="mb-1 text-[10px] uppercase tracking-wide text-dashboard-neutral/40">
                    {g.title}
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {g.ids.map((id) => {
                      const active = activeLayers.includes(id);
                      return (
                        <button
                          key={id}
                          type="button"
                          aria-pressed={active}
                          title={LAYER_HINTS[id] ?? LAYER_LABELS[id]}
                          onClick={() => toggleLayer(id)}
                          className={[
                            'rounded-md border px-2.5 py-1 text-xs transition-colors',
                            active
                              ? 'border-dashboard-military/60 bg-dashboard-military/20 text-white'
                              : 'border-dashboard-neutral/20 bg-dashboard-neutral/5 text-dashboard-neutral hover:border-dashboard-neutral/35 hover:text-white',
                          ].join(' ')}
                        >
                          {LAYER_LABELS[id]}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            <p className="mt-2 text-[11px] leading-snug text-dashboard-neutral/50">
              已开启 {activeCount}/{regionLayers.length} 层 · 点击地图空白处关闭
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
