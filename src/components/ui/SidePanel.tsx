'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMapStore } from '@/store/useMapStore';
import { LAYER_LABELS } from '@/lib/constants';
import { formatDate, timeAgo } from '@/lib/format/time';
import { useRelativeTimeTick } from '@/hooks/useRelativeTimeTick';
import { PanelCloseButton } from '@/components/ui/PanelCloseButton';
import { NEWS_CATEGORY_COLORS } from '@/data/news-feed';
import { ImpactGauge, MiniGlobe, MiniChart, IMPACT_THEME } from '@/components/ui/EventViz';
import { useEventIndexStore, nearbySameCategory, nearbyCrossCategory } from '@/store/useEventIndexStore';
import type { EventDetail, LayerId } from '@/types/geo';

interface SidePanelProps {
  className?: string;
}

/** 按坐标计算 NASA GIBS 真彩瓦片 URL（Web Mercator slippy tile，免密钥真实影像，取近日） */
function gibsThumb(lng: number, lat: number, z = 4): string | null {
  if (!Number.isFinite(lng) || !Number.isFinite(lat) || Math.abs(lat) > 85) return null;
  const n = 2 ** z;
  const x = Math.floor(((lng + 180) / 360) * n);
  const latRad = (lat * Math.PI) / 180;
  const y = Math.floor(((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2) * n);
  if (x < 0 || y < 0 || x >= n || y >= n) return null;
  const d = new Date(Date.now() - 36 * 3600 * 1000).toISOString().slice(0, 10); // 近日（留 GIBS 出图余量）
  return `https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/MODIS_Terra_CorrectedReflectance_TrueColor/default/${d}/GoogleMapsCompatible_Level9/${z}/${y}/${x}.jpg`;
}

export function SidePanel({ className = '' }: SidePanelProps) {
  const sidePanelOpen = useMapStore((s) => s.sidePanelOpen);
  const selectedEvent = useMapStore((s) => s.selectedEvent);
  const openSidePanel = useMapStore((s) => s.openSidePanel);
  const setViewport = useMapStore((s) => s.setViewport);
  const selectEvent = useMapStore((s) => s.selectEvent);
  useRelativeTimeTick(30_000, sidePanelOpen);

  // 邻近同类事件（订阅该类别索引桶以在数据刷新时更新）
  const catKey = selectedEvent?.category && !selectedEvent.category.startsWith('news:') ? selectedEvent.category : '';
  const byCat = useEventIndexStore((s) => s.byCat);
  const hasLoc = !!selectedEvent && (selectedEvent.location[0] !== 0 || selectedEvent.location[1] !== 0);
  const nearby = catKey && selectedEvent && hasLoc
    ? nearbySameCategory(catKey, selectedEvent.location[0], selectedEvent.location[1], selectedEvent.id, 5)
    : [];
  const nearbyOther = selectedEvent && hasLoc && !selectedEvent.category?.startsWith('news:')
    ? nearbyCrossCategory(selectedEvent.location[0], selectedEvent.location[1], selectedEvent.id, catKey, 1500, 5)
    : [];
  void byCat;
  const globeMarkers = [...nearby, ...nearbyOther].map((it) => ({ lng: it.lng, lat: it.lat, color: (IMPACT_THEME[it.impact] ?? IMPACT_THEME.low).color }));

  const [copied, setCopied] = useState(false);

  const e = selectedEvent;
  const theme = e ? IMPACT_THEME[e.impact_level] ?? IMPACT_THEME.low : IMPACT_THEME.low;
  const formattedTimestamp = e?.timestamp ? formatDate(e.timestamp) : '';
  const relativeAge = e?.timestamp ? timeAgo(e.timestamp) : '';

  const newsCategory = e?.category?.startsWith('news:') ? e.category.slice(5) : null;
  const categoryLabel = newsCategory
    ? newsCategory
    : e?.category
      ? LAYER_LABELS[(e.category as LayerId) ?? 'conflicts']
      : '';
  const categoryColor = newsCategory
    ? NEWS_CATEGORY_COLORS[newsCategory as keyof typeof NEWS_CATEGORY_COLORS]
    : undefined;

  const hasLocation = e && (e.location[0] !== 0 || e.location[1] !== 0);

  const flyTo = () => {
    if (!e || !hasLocation) return;
    setViewport([e.location[0], e.location[1]], Math.max(useMapStore.getState().zoom, 4.5));
  };
  const copyCoords = async () => {
    if (!e) return;
    try {
      await navigator.clipboard.writeText(`${e.location[1].toFixed(4)}, ${e.location[0].toFixed(4)}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch { /* */ }
  };

  return (
    <AnimatePresence>
      {sidePanelOpen && (
        <motion.aside
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'tween', duration: 0.25 }}
          className={`absolute top-0 right-0 z-35 h-full w-full max-w-md overflow-y-auto border-l border-dashboard-neutral/20 bg-dashboard-bg/97 shadow-2xl ${className}`}
        >
          {e ? (
            <div>
              {/* 渐变头：按影响等级着色 */}
              <div
                className="relative px-4 pb-3 pt-4"
                style={{ background: `linear-gradient(160deg, ${theme.soft}, transparent 70%)` }}
              >
                <div className="absolute left-0 top-0 h-full w-1" style={{ background: theme.color }} aria-hidden />
                <div className="flex items-start justify-between gap-2">
                  <PanelCloseButton onClick={() => openSidePanel(false)} label="关闭侧边栏" />
                  <ImpactGauge level={e.impact_level} />
                </div>
                <motion.h2
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: 0.05 }}
                  className="mt-1 text-lg font-semibold leading-snug text-white"
                >
                  {e.title}
                </motion.h2>
                <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-dashboard-neutral/70">
                  <span className="rounded px-1.5 py-0.5 font-medium" style={{ color: theme.color, background: theme.soft }}>
                    影响 {theme.name}
                  </span>
                  {categoryLabel && (
                    <span
                      className="rounded px-1.5 py-0.5 font-medium"
                      style={categoryColor
                        ? { color: categoryColor, background: `${categoryColor}22`, border: `1px solid ${categoryColor}44` }
                        : { color: '#cbd5e1', background: 'rgba(255,255,255,0.06)' }}
                    >
                      {categoryLabel}
                    </span>
                  )}
                  <span className="text-dashboard-neutral/50">{e.source}</span>
                </div>
                {formattedTimestamp && (
                  <div className="mt-1 text-[11px] text-dashboard-neutral/55">
                    <span className="tabular-nums">{formattedTimestamp}</span>
                    {relativeAge && <span className="text-dashboard-neutral/40"> · {relativeAge}</span>}
                  </div>
                )}
              </div>

              <div className="space-y-3 p-4 pt-2">
                {/* 配图 */}
                {e.imageUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={e.imageUrl}
                    alt=""
                    className="max-h-44 w-full rounded-lg border border-white/10 object-cover"
                    onError={(ev) => { (ev.currentTarget as HTMLImageElement).style.display = 'none'; }}
                  />
                )}

                {/* 卫星影像缩略（按坐标取 NASA GIBS 真彩，仅当事件未自带配图） */}
                {hasLocation && !e.imageUrl && (() => {
                  const g = gibsThumb(e.location[0], e.location[1]);
                  return g ? (
                    <figure className="overflow-hidden rounded-lg border border-white/10">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={g} alt="" className="h-32 w-full object-cover"
                        onError={(ev) => { const fig = (ev.currentTarget as HTMLImageElement).closest('figure'); if (fig) (fig as HTMLElement).style.display = 'none'; }} />
                      <figcaption className="bg-black/30 px-2 py-1 text-[9px] text-dashboard-neutral/55">🛰 NASA GIBS 真彩卫星影像（近日 · 区域上下文）</figcaption>
                    </figure>
                  ) : null;
                })()}

                {/* 标签 */}
                {e.tags && e.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {e.tags.map((t) => (
                      <span key={t} className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] text-dashboard-neutral/75">#{t}</span>
                    ))}
                  </div>
                )}

                {/* 指标芯片 */}
                {e.metrics && e.metrics.length > 0 && (
                  <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3">
                    {e.metrics.map((m, i) => (
                      <div key={i} className="rounded-lg bg-white/5 px-2.5 py-2">
                        <div className="text-sm font-semibold tabular-nums" style={{ color: m.accent ?? '#fff' }}>{m.value}</div>
                        <div className="mt-0.5 text-[10px] text-dashboard-neutral/55">{m.label}{m.hint ? ` · ${m.hint}` : ''}</div>
                      </div>
                    ))}
                  </div>
                )}

                {/* 内联微图表 */}
                {e.series && e.series.points.length > 1 && (
                  <div className="rounded-lg border border-white/8 bg-white/[0.03] p-2.5">
                    <div className="mb-1 flex items-center justify-between text-[10px] text-dashboard-neutral/55">
                      <span>{e.series.label}</span>
                      {e.series.unit && <span>{e.series.unit}</span>}
                    </div>
                    <MiniChart series={e.series} color={theme.color} />
                  </div>
                )}
                {e.series2 && e.series2.points.length > 1 && (
                  <div className="rounded-lg border border-white/8 bg-white/[0.03] p-2.5">
                    <div className="mb-1 flex items-center justify-between text-[10px] text-dashboard-neutral/55">
                      <span>{e.series2.label}</span>
                      {e.series2.unit && <span>{e.series2.unit}</span>}
                    </div>
                    <MiniChart series={e.series2} color={theme.color} />
                  </div>
                )}

                {/* 坐标迷你地球 + 动作 */}
                {hasLocation && (
                  <div className="flex items-center gap-3 rounded-lg border border-white/8 bg-white/[0.03] p-2.5">
                    <MiniGlobe lng={e.location[0]} lat={e.location[1]} color={theme.color} markers={globeMarkers} />
                    <div className="min-w-0 flex-1">
                      <div className="text-[11px] tabular-nums text-dashboard-neutral/80">
                        {e.location[1].toFixed(4)}°, {e.location[0].toFixed(4)}°
                      </div>
                      <div className="mt-1.5 flex gap-1.5">
                        <button type="button" onClick={flyTo} className="rounded-md border border-white/10 bg-white/5 px-2 py-1 text-[11px] text-dashboard-neutral/85 transition-colors hover:bg-white/10 hover:text-white">飞到此处</button>
                        <button type="button" onClick={copyCoords} className="rounded-md border border-white/10 bg-white/5 px-2 py-1 text-[11px] text-dashboard-neutral/85 transition-colors hover:bg-white/10 hover:text-white">{copied ? '已复制 ✓' : '复制坐标'}</button>
                      </div>
                    </div>
                  </div>
                )}

                {/* 描述 */}
                {e.description && (
                  <p className="text-sm leading-relaxed text-dashboard-neutral/90">{e.description}</p>
                )}

                {/* 邻近同类事件 */}
                {nearby.length > 0 && (
                  <div className="border-t border-white/8 pt-2.5">
                    <div className="mb-1 text-[10px] uppercase tracking-wide text-dashboard-neutral/40">邻近同类事件</div>
                    <ul className="space-y-1">
                      {nearby.map((it) => {
                        const th = IMPACT_THEME[it.impact] ?? IMPACT_THEME.low;
                        return (
                          <li key={it.id}>
                            <button
                              type="button"
                              onClick={() => {
                                setViewport([it.lng, it.lat], Math.max(useMapStore.getState().zoom, 4.5));
                                selectEvent({ id: it.id, title: it.title, source: e.source, timestamp: '', location: [it.lng, it.lat], impact_level: it.impact, category: it.category } as EventDetail);
                              }}
                              className="flex w-full items-center gap-2 rounded-md bg-white/5 px-2 py-1.5 text-left transition-colors hover:bg-white/10"
                            >
                              <span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: th.color }} aria-hidden />
                              <span className="min-w-0 flex-1 truncate text-[11px] text-dashboard-neutral/85">{it.title}</span>
                              <span className="shrink-0 text-[10px] tabular-nums text-dashboard-neutral/45">{it.distKm < 1 ? '<1' : Math.round(it.distKm)} km</span>
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}

                {/* 周边其他灾害（跨类别，半径 1500km） */}
                {nearbyOther.length > 0 && (
                  <div className="border-t border-white/8 pt-2.5">
                    <div className="mb-1 text-[10px] uppercase tracking-wide text-dashboard-neutral/40">周边其他灾害（≤1500km）</div>
                    <ul className="space-y-1">
                      {nearbyOther.map((it) => {
                        const th = IMPACT_THEME[it.impact] ?? IMPACT_THEME.low;
                        const catLabel = LAYER_LABELS[it.category as LayerId] ?? it.category;
                        return (
                          <li key={it.id}>
                            <button
                              type="button"
                              onClick={() => {
                                setViewport([it.lng, it.lat], Math.max(useMapStore.getState().zoom, 4.5));
                                selectEvent({ id: it.id, title: it.title, source: e.source, timestamp: '', location: [it.lng, it.lat], impact_level: it.impact, category: it.category } as EventDetail);
                              }}
                              className="flex w-full items-center gap-2 rounded-md bg-white/5 px-2 py-1.5 text-left transition-colors hover:bg-white/10"
                            >
                              <span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: th.color }} aria-hidden />
                              <span className="shrink-0 rounded bg-white/10 px-1 text-[9px] text-dashboard-neutral/70">{catLabel}</span>
                              <span className="min-w-0 flex-1 truncate text-[11px] text-dashboard-neutral/85">{it.title}</span>
                              <span className="shrink-0 text-[10px] tabular-nums text-dashboard-neutral/45">{it.distKm < 1 ? '<1' : Math.round(it.distKm)} km</span>
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}

                {/* 链接 */}
                {(e.url || (e.links && e.links.length > 0)) && (
                  <div className="space-y-1.5 border-t border-white/8 pt-2.5">
                    {e.url && (
                      <a href={e.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-sm text-sky-400 transition-colors hover:text-sky-300">阅读原文 →</a>
                    )}
                    {e.links?.map((l, i) => (
                      <a key={i} href={l.url} target="_blank" rel="noopener noreferrer" className="block text-[12px] text-sky-400/90 transition-colors hover:text-sky-300">{l.label} →</a>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="p-4">
              <PanelCloseButton onClick={() => openSidePanel(false)} label="关闭侧边栏" className="mb-4" />
              <p className="text-dashboard-neutral">点击地图上的标记查看详情</p>
            </div>
          )}
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
