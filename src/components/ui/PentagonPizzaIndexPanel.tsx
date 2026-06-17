'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useMapStore } from '@/store/useMapStore';
import { usePizzaIndexPanelStore } from '@/store/usePizzaIndexPanelStore';
import { usePentagonPizzaIndex } from '@/hooks/usePentagonPizzaIndex';
import { PanelCloseButton } from '@/components/ui/PanelCloseButton';
import { levelLabelZh } from '@/lib/pizza-index/simulate';
import { PENTAGON_CENTER, PENTAGON_FLY_ZOOM } from '@/lib/pizza-index/venues';
import type { PizzaIndexLevel, PizzaIndexTrend } from '@/types/pizza-index';

const LEVEL_STYLES: Record<PizzaIndexLevel, string> = {
  LOW: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
  ELEVATED: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
  HIGH: 'bg-orange-500/20 text-orange-300 border-orange-500/40',
  CRITICAL: 'bg-red-500/20 text-red-300 border-red-500/40',
};

const TREND_ICON: Record<PizzaIndexTrend, string> = {
  up: '↑',
  down: '↓',
  flat: '→',
};

function formatTime(iso: string | undefined): string {
  if (!iso) return '—';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  const HH = String(d.getHours()).padStart(2, '0');
  const MM = String(d.getMinutes()).padStart(2, '0');
  const SS = String(d.getSeconds()).padStart(2, '0');
  return `${HH}:${MM}:${SS}`;
}

function Sparkline({ values }: { values: number[] }) {
  if (values.length < 2) return null;
  const max = Math.max(...values, 1);
  const min = Math.min(...values, 0);
  const range = max - min || 1;
  const w = 200;
  const h = 36;
  const points = values
    .map((v, i) => {
      const x = (i / (values.length - 1)) * w;
      const y = h - ((v - min) / range) * (h - 4) - 2;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="h-9 w-full" aria-hidden>
      <polyline
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
        strokeLinecap="round"
        className="text-orange-400/80"
        points={points}
      />
    </svg>
  );
}

interface PentagonPizzaIndexPanelProps {
  className?: string;
}

/** 五角大楼披萨指数 OSINT 面板 */
export function PentagonPizzaIndexPanel({ className = '' }: PentagonPizzaIndexPanelProps) {
  const open = usePizzaIndexPanelStore((s) => s.open);
  const setOpen = usePizzaIndexPanelStore((s) => s.setOpen);
  const setCenter = useMapStore((s) => s.setCenter);
  const setZoom = useMapStore((s) => s.setZoom);
  const toggleLayer = useMapStore((s) => s.toggleLayer);
  const activeLayers = useMapStore((s) => s.activeLayers);

  const { data, isValidating, error } = usePentagonPizzaIndex(open);

  const flyToPentagon = () => {
    setCenter(PENTAGON_CENTER);
    setZoom(PENTAGON_FLY_ZOOM);
    if (!activeLayers.includes('pizza_index')) toggleLayer('pizza_index');
  };

  const handleOpen = () => {
    flyToPentagon();
  };

  if (!open) return null;

  const level = data?.level ?? 'LOW';
  const score = data?.score ?? 0;
  const trend = data?.trend ?? 'flat';
  const isLive = data?.source === 'pizzint.watch';
  const isSimulated = data?.source === 'simulated';

  return (
    <AnimatePresence>
      <motion.aside
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.18 }}
        className={[
          'pointer-events-auto flex max-h-[min(70vh,28rem)] w-[min(22rem,calc(100vw-2rem))] flex-col overflow-hidden',
          'rounded-lg border border-orange-500/25 bg-dashboard-bg/95 shadow-xl backdrop-blur-md',
          className,
        ].join(' ')}
        aria-label="五角大楼披萨指数"
      >
        <header className="flex shrink-0 items-start justify-between gap-2 border-b border-dashboard-neutral/15 px-3 py-2.5">
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span aria-hidden className="text-base">
                🍕
              </span>
              <h2 className="truncate text-sm font-semibold text-white">五角大楼披萨指数</h2>
              {isLive && (
                <span className="shrink-0 rounded border border-emerald-500/40 bg-emerald-500/15 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-emerald-300">
                  实时
                </span>
              )}
              {isSimulated && (
                <span className="shrink-0 rounded border border-amber-500/40 bg-amber-500/15 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-amber-300">
                  演示
                </span>
              )}
            </div>
            <p className="mt-0.5 text-[10px] leading-snug text-dashboard-neutral/55">
              OSINT meme · 深夜披萨订单与军政活动相关性观察
            </p>
          </div>
          <PanelCloseButton compact onClick={() => setOpen(false)} label="关闭披萨指数面板" />
        </header>

        <div className="flex-1 space-y-3 overflow-y-auto px-3 py-2.5">
          {error && (
            <p className="text-xs text-dashboard-conflict">加载失败，请稍后重试</p>
          )}

          <div className="flex items-center justify-between gap-2">
            <div>
              <div className="text-[10px] uppercase tracking-wide text-dashboard-neutral/50">
                综合指数
              </div>
              <div className="mt-0.5 flex items-baseline gap-2">
                <span className="text-2xl font-bold tabular-nums text-white">{score}</span>
                <span className="text-xs text-dashboard-neutral/60">/ 100</span>
                <span
                  className="text-sm font-medium text-dashboard-neutral"
                  title="趋势"
                  aria-label={`趋势${TREND_ICON[trend]}`}
                >
                  {TREND_ICON[trend]}
                </span>
              </div>
            </div>
            <span
              className={[
                'rounded border px-2 py-1 text-[11px] font-semibold uppercase tracking-wide',
                LEVEL_STYLES[level],
              ].join(' ')}
            >
              {levelLabelZh(level)}
            </span>
          </div>

          {data?.history && data.history.length > 1 && (
            <div className="rounded-md border border-dashboard-neutral/15 bg-dashboard-neutral/5 px-2 py-1.5">
              <div className="mb-1 text-[10px] text-dashboard-neutral/55">近 24 小时</div>
              <Sparkline values={data.history.map((p) => p.score)} />
            </div>
          )}

          <p className="text-[11px] leading-relaxed text-dashboard-neutral/65">
            冷战时期流传：重大军事行动前，五角大楼周边披萨店深夜订单会异常激增。本面板追踪
            Arlington 一带披萨店繁忙度作为弱信号参考——
            <span className="text-amber-400/90">纯属娱乐，不构成情报或投资建议</span>。
          </p>

          {isSimulated && (
            <p className="rounded border border-amber-500/25 bg-amber-500/10 px-2 py-1.5 text-[10px] leading-snug text-amber-200/90">
              演示数据 — pizzint.watch 实时源暂不可用，已回退本地模拟
            </p>
          )}

          {isLive && (
            <p className="text-[10px] leading-snug text-dashboard-neutral/55">
              实时数据来自{' '}
              <a
                href="https://www.pizzint.watch/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-orange-300/90 underline decoration-orange-500/40 underline-offset-2 hover:text-orange-200"
              >
                pizzint.watch
              </a>
              （Google Maps 热门时段）
            </p>
          )}

          {data?.venues && data.venues.length > 0 && (
            <div>
              <div className="mb-1.5 text-[10px] uppercase tracking-wide text-dashboard-neutral/50">
                监测门店 ({data.venues.length})
              </div>
              <ul className="space-y-1">
                {data.venues.map((v) => (
                  <li
                    key={v.id}
                    className="flex items-center justify-between gap-2 rounded border border-dashboard-neutral/10 bg-dashboard-neutral/5 px-2 py-1.5 text-[11px]"
                  >
                    <span className="min-w-0 truncate text-dashboard-neutral">{v.brand}</span>
                    <span className="shrink-0 tabular-nums text-white">{v.busyLevel}%</span>
                    <span
                      className={[
                        'shrink-0 tabular-nums text-[10px]',
                        v.delta > 0 ? 'text-orange-400' : 'text-emerald-400/80',
                      ].join(' ')}
                    >
                      {v.delta > 0 ? '+' : ''}
                      {v.delta.toFixed(0)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-[10px] text-dashboard-neutral/55">
            <span>
              更新：
              <span className="tabular-nums text-dashboard-neutral">
                {formatTime(data?.updatedAt)}
                {isValidating ? ' …' : ''}
              </span>
            </span>
            <span>
              来源：
              <span className="text-dashboard-neutral">
                {isLive ? (
                  <a
                    href="https://www.pizzint.watch/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-400/90 underline-offset-2 hover:underline"
                  >
                    pizzint.watch
                  </a>
                ) : isSimulated ? (
                  '模拟演示'
                ) : (
                  data?.source
                )}
              </span>
            </span>
          </div>
        </div>

        <footer className="shrink-0 border-t border-dashboard-neutral/15 px-3 py-2">
          <button
            type="button"
            onClick={handleOpen}
            className={[
              'w-full rounded border border-orange-500/35 bg-orange-500/15 px-2 py-1.5',
              'text-[11px] font-medium text-orange-100 transition-colors',
              'hover:border-orange-400/50 hover:bg-orange-500/25',
            ].join(' ')}
          >
            飞向五角大楼 · 显示地图标记
          </button>
        </footer>
      </motion.aside>
    </AnimatePresence>
  );
}
