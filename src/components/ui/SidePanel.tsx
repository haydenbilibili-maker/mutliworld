'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useMapStore } from '@/store/useMapStore';
import { LAYER_LABELS } from '@/lib/constants';
import { PanelCloseButton } from '@/components/ui/PanelCloseButton';
import { NEWS_CATEGORY_COLORS } from '@/data/news-feed';
import type { LayerId } from '@/types/geo';

interface SidePanelProps {
  className?: string;
}

function formatTimestamp(iso: string) {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  const HH = String(d.getHours()).padStart(2, '0');
  const MM = String(d.getMinutes()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd} ${HH}:${MM}`;
}

const IMPACT_LABELS: Record<string, string> = {
  low: '低',
  medium: '中',
  high: '高',
  critical: '极高',
};

export function SidePanel({ className = '' }: SidePanelProps) {
  const { sidePanelOpen, selectedEvent, openSidePanel } = useMapStore();

  const formattedTimestamp = selectedEvent
    ? formatTimestamp(selectedEvent.timestamp)
    : '';
  const impactLabel = selectedEvent
    ? IMPACT_LABELS[selectedEvent.impact_level] ?? selectedEvent.impact_level
    : '';
  const newsCategory =
    selectedEvent?.category?.startsWith('news:')
      ? selectedEvent.category.slice(5)
      : null;
  const categoryLabel = newsCategory
    ? newsCategory
    : selectedEvent?.category
      ? LAYER_LABELS[(selectedEvent.category as LayerId) ?? 'conflicts']
      : '';
  const categoryColor = newsCategory
    ? NEWS_CATEGORY_COLORS[newsCategory as keyof typeof NEWS_CATEGORY_COLORS]
    : undefined;
  const hasLocation =
    selectedEvent &&
    (selectedEvent.location[0] !== 0 || selectedEvent.location[1] !== 0);
  const locationText = hasLocation
    ? `经度：${selectedEvent!.location[0].toFixed(4)}，纬度：${selectedEvent!.location[1].toFixed(4)}`
    : '';

  return (
    <AnimatePresence>
      {sidePanelOpen && (
        <motion.aside
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'tween', duration: 0.25 }}
          className={`absolute top-0 right-0 z-35 h-full w-full max-w-md overflow-y-auto border-l border-dashboard-neutral/20 bg-dashboard-bg/95 shadow-xl ${className}`}
        >
          <div className="p-4">
            <PanelCloseButton
              onClick={() => openSidePanel(false)}
              label="关闭侧边栏"
              className="mb-4"
            />
            {selectedEvent ? (
              <div className="space-y-2">
                <h2 className="text-lg font-semibold text-white">
                  {selectedEvent.title}
                </h2>
                <p className="text-sm text-dashboard-neutral">
                  来源：{selectedEvent.source}
                  {formattedTimestamp ? ` · ${formattedTimestamp}` : ''}
                </p>
                <p className="text-sm text-dashboard-neutral">
                  影响：{impactLabel}
                </p>
                {categoryLabel && (
                  <p className="text-sm text-dashboard-neutral flex items-center gap-1.5">
                    类别：
                    {categoryColor ? (
                      <span
                        className="inline-block rounded px-1.5 py-0.5 text-xs font-medium"
                        style={{
                          color: categoryColor,
                          backgroundColor: `${categoryColor}22`,
                          border: `1px solid ${categoryColor}44`,
                        }}
                      >
                        {categoryLabel}
                      </span>
                    ) : (
                      categoryLabel
                    )}
                  </p>
                )}
                {locationText && (
                  <p className="text-sm text-dashboard-neutral">{locationText}</p>
                )}
                {selectedEvent.description && (
                  <p className="text-sm text-dashboard-neutral/90 leading-relaxed">
                    {selectedEvent.description}
                  </p>
                )}
                {selectedEvent.url && (
                  <a
                    href={selectedEvent.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm text-blue-400 hover:text-blue-300 transition-colors mt-2"
                  >
                    阅读原文 →
                  </a>
                )}
              </div>
            ) : (
              <p className="text-dashboard-neutral">点击地图上的标记查看详情</p>
            )}
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
