'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useMapStore } from '@/store/useMapStore';
import { useGeodataContext } from '@/context/GeodataContext';
import { getLegendGroups, IMPACT_LEGEND } from '@/lib/geodata/markerStyle';
import { QUAKE_DEPTH_HALO, QUAKE_MAG_HALO } from '@/lib/geodata/seismicStyle';
import { GLOBAL_CONFLICT_ZONES } from '@/regions/global.conflict-zones';
import type { LayerId } from '@/types/geo';

/** 非 geodata API 供给、由独立图层渲染的实时层 */
const LIVE_OVERLAY_LAYERS = new Set<LayerId>([
  'live_weather',
  'live_flights',
  'live_maritime',
  'conflict_zones',
  'pizza_index',
]);

const LIVE_LAYER_FALLBACK_COUNT: Partial<Record<LayerId, number>> = {
  conflict_zones: GLOBAL_CONFLICT_ZONES.length,
};

interface MapLegendProps {
  className?: string;
}

/** 由经纬度跨度估算合适的缩放级别 */
function zoomForSpan(span: number): number {
  if (span > 120) return 1.6;
  if (span > 60) return 2.4;
  if (span > 30) return 3.2;
  if (span > 15) return 4;
  if (span > 6) return 4.8;
  if (span > 2) return 5.6;
  if (span > 0.5) return 6.4;
  return 7;
}

function legendEntryColor(imageId: string): string | undefined {
  if (imageId.startsWith('quake-mag-')) {
    const band = imageId.replace('quake-mag-', 'mag-') as keyof typeof QUAKE_MAG_HALO;
    return QUAKE_MAG_HALO[band];
  }
  if (imageId === 'quake-shallow') return QUAKE_DEPTH_HALO.shallow;
  if (imageId === 'quake-intermediate') return QUAKE_DEPTH_HALO.intermediate;
  if (imageId === 'quake-deep') return QUAKE_DEPTH_HALO.deep;
  if (imageId === 'hydrocarbon-mega') return '#3d2914';
  if (imageId === 'hydrocarbon-large') return '#b8860b';
  if (imageId === 'hydrocarbon-medium') return '#6b5a2a';
  return undefined;
}

export function MapLegend({ className = '' }: MapLegendProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);

  const activeLayers = useMapStore((s) => s.activeLayers);
  const toggleLayer = useMapStore((s) => s.toggleLayer);
  const setCenter = useMapStore((s) => s.setCenter);
  const setZoom = useMapStore((s) => s.setZoom);
  const { data } = useGeodataContext();

  const groups = useMemo(() => getLegendGroups(activeLayers), [activeLayers]);
  const entryCount = groups.reduce((n, g) => n + g.entries.length, 0);
  const showSeismicHydrocarbonNote =
    activeLayers.includes('natural') && activeLayers.includes('hydrocarbon_reserves');

  /** 各图层当前要素数（来自实时 geodata） */
  const counts = useMemo(() => {
    const m = new Map<string, number>();
    for (const f of data?.features ?? []) {
      const id = String(f.properties?.layerId ?? '');
      if (!id) continue;
      m.set(id, (m.get(id) ?? 0) + 1);
    }
    return m;
  }, [data]);

  /** 点击图层 → 地图聚焦该图层全部要素的范围 */
  const focusLayer = (layerId: LayerId) => {
    const pts: [number, number][] = [];
    for (const f of data?.features ?? []) {
      if (String(f.properties?.layerId ?? '') !== layerId) continue;
      const lng = Number(f.properties?.lng);
      const lat = Number(f.properties?.lat);
      if (Number.isFinite(lng) && Number.isFinite(lat)) pts.push([lng, lat]);
    }
    if (pts.length === 0) return;
    let minLng = Infinity,
      minLat = Infinity,
      maxLng = -Infinity,
      maxLat = -Infinity;
    for (const [lng, lat] of pts) {
      minLng = Math.min(minLng, lng);
      maxLng = Math.max(maxLng, lng);
      minLat = Math.min(minLat, lat);
      maxLat = Math.max(maxLat, lat);
    }
    const span = Math.max(maxLng - minLng, maxLat - minLat);
    setCenter([(minLng + maxLng) / 2, (minLat + maxLat) / 2]);
    setZoom(pts.length === 1 ? 5.6 : zoomForSpan(span));
    setOpen(false);
  };

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

  if (groups.length === 0) return null;

  return (
    <div ref={rootRef} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label="地图图例"
        className={[
          'flex items-center gap-2 rounded-lg border px-3 py-2 text-sm shadow-lg backdrop-blur-sm transition-colors',
          open
            ? 'border-dashboard-military/50 bg-dashboard-bg/95 text-white'
            : 'border-dashboard-neutral/25 bg-dashboard-bg/85 text-dashboard-neutral hover:border-dashboard-neutral/40 hover:text-white',
        ].join(' ')}
      >
        <span aria-hidden>🗺️</span>
        <span>图例</span>
        <span className="rounded-full bg-dashboard-neutral/15 px-1.5 py-0.5 text-xs text-dashboard-neutral/80">
          {entryCount}
        </span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            role="dialog"
            aria-label="地图图例说明"
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="absolute bottom-full left-0 z-30 mb-2 w-[min(21rem,calc(100vw-2rem))] max-h-[min(56vh,26rem)] overflow-y-auto rounded-lg border border-dashboard-neutral/25 bg-dashboard-bg/95 p-3 shadow-xl backdrop-blur-md"
          >
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-medium text-white">地图图例</span>
              <span className="text-[10px] text-dashboard-neutral/45">
                点击图层名可缩放至范围
              </span>
            </div>

            <div className="space-y-2.5">
              {groups.map((group) => {
                const geoCount = counts.get(group.layerId) ?? 0;
                const fallback = LIVE_LAYER_FALLBACK_COUNT[group.layerId];
                const n = geoCount > 0 ? geoCount : (fallback ?? 0);
                const isLiveOverlay = LIVE_OVERLAY_LAYERS.has(group.layerId);
                return (
                  <section key={group.layerId}>
                    <div className="mb-1 flex items-center gap-1.5">
                      <span
                        className="h-2 w-2 shrink-0 rounded-full"
                        style={{ backgroundColor: group.color }}
                      />
                      <button
                        type="button"
                        onClick={() => focusLayer(group.layerId)}
                        disabled={n === 0}
                        title={
                          n > 0
                            ? '缩放至该图层范围'
                            : isLiveOverlay
                              ? '实时数据源图层'
                              : '当前无要素'
                        }
                        className={[
                          'flex min-w-0 items-center gap-1.5 rounded px-1 py-0.5 text-xs font-medium transition-colors',
                          n > 0 || isLiveOverlay
                            ? 'text-dashboard-neutral hover:bg-white/5 hover:text-white'
                            : 'text-dashboard-neutral/40',
                        ].join(' ')}
                      >
                        <span className="truncate">{group.layerLabel}</span>
                        {n > 0 && (
                          <span className="shrink-0 rounded-full bg-dashboard-neutral/15 px-1.5 text-[10px] tabular-nums text-dashboard-neutral/80">
                            {n}
                          </span>
                        )}
                        {n === 0 && isLiveOverlay && (
                          <span className="shrink-0 rounded-full bg-cyan-500/15 px-1.5 text-[10px] text-cyan-200/80">
                            实时
                          </span>
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() => toggleLayer(group.layerId)}
                        aria-label={`隐藏${group.layerLabel}图层`}
                        title="从地图隐藏该图层"
                        className="ml-auto shrink-0 rounded px-1 text-dashboard-neutral/40 hover:bg-white/5 hover:text-white"
                      >
                        ✕
                      </button>
                    </div>
                    {group.hint && (
                      <p
                        className="mb-1 pl-3.5 text-[10px] leading-snug text-amber-200/55"
                        title={group.hint}
                      >
                        {group.hint}
                      </p>
                    )}
                    <div className="grid grid-cols-2 gap-1 pl-3.5">
                      {group.entries.map((entry) => {
                        const swatch = legendEntryColor(entry.imageId);
                        return (
                          <div
                            key={entry.imageId}
                            className="flex items-center gap-1.5 rounded px-1 py-0.5 text-xs text-dashboard-neutral"
                            title={
                              entry.imageId.startsWith('quake-')
                                ? '地震波图例 · 非油气储藏'
                                : entry.imageId.startsWith('hydrocarbon-')
                                  ? '油气储量波图例 · 非地震'
                                  : undefined
                            }
                          >
                            {swatch ? (
                              <span
                                className="h-2.5 w-2.5 shrink-0 rounded-full opacity-80"
                                style={{ backgroundColor: swatch }}
                                aria-hidden
                              />
                            ) : (
                              <span className="text-base leading-none" aria-hidden>
                                {entry.emoji}
                              </span>
                            )}
                            <span className="truncate">{entry.label}</span>
                          </div>
                        );
                      })}
                    </div>
                  </section>
                );
              })}

              <section className="border-t border-dashboard-neutral/15 pt-2">
                {showSeismicHydrocarbonNote && (
                  <p className="mb-2 text-[10px] leading-snug text-dashboard-neutral/55">
                    橙红/琥珀圆环 = 地震波（USGS）· 棕黑/暗金圆环 = 油气储藏（≠ 地震）
                  </p>
                )}
                <div className="mb-1 text-xs font-medium text-dashboard-neutral">
                  影响光晕
                </div>
                <div className="flex flex-wrap gap-2">
                  {IMPACT_LEGEND.map((item) => (
                    <div
                      key={item.level}
                      className="flex items-center gap-1 text-[11px] text-dashboard-neutral/80"
                    >
                      <span
                        className="h-3 w-3 rounded-full opacity-60"
                        style={{ backgroundColor: item.color }}
                      />
                      {item.label}
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
