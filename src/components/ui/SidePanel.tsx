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
import type { LayerId } from '@/types/geo';

interface SidePanelProps {
  className?: string;
}

export function SidePanel({ className = '' }: SidePanelProps) {
  const sidePanelOpen = useMapStore((s) => s.sidePanelOpen);
  const selectedEvent = useMapStore((s) => s.selectedEvent);
  const openSidePanel = useMapStore((s) => s.openSidePanel);
  const setViewport = useMapStore((s) => s.setViewport);
  useRelativeTimeTick(30_000, sidePanelOpen);

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
                    <MiniGlobe lng={e.location[0]} lat={e.location[1]} color={theme.color} />
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
