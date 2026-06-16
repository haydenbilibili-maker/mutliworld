'use client';

/**
 * 宇宙层轨道列表入口 — 默认折叠为 FAB，展开为右侧浮层
 * 避免常驻侧栏遮挡 3D 地球右侧轨道标记。
 */

import { AnimatePresence, motion } from 'framer-motion';
import { useMapStore } from '@/store/useMapStore';
import { useOrbitalPanelStore } from '@/store/useOrbitalPanelStore';
import { useOrbitalObjects } from '@/hooks/useOrbitalObjects';
import { OrbitalObjectsPanel } from '@/components/region/OrbitalObjectsPanel';

interface OrbitalListHostProps {
  className?: string;
}

export function OrbitalListHost({ className = '' }: OrbitalListHostProps) {
  const inSpace = useMapStore((s) => s.activeTier === 'space');
  const open = useOrbitalPanelStore((s) => s.open);
  const toggle = useOrbitalPanelStore((s) => s.toggle);
  const { meta } = useOrbitalObjects(inSpace);

  if (!inSpace) return null;

  const stationCount = meta?.counts?.station ?? 0;

  return (
    <div
      className={[
        'pointer-events-none absolute right-4 top-20 bottom-24 z-30 flex flex-col items-end justify-end gap-2',
        className,
      ].join(' ')}
    >
      <div className="pointer-events-auto flex max-h-full flex-col items-end gap-2">
        <AnimatePresence>
          {open && (
            <motion.div
              key="orbital-panel"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.18 }}
              className="max-h-[min(50vh,24rem)] w-[min(18rem,calc(100vw-2rem))] overflow-hidden"
            >
              <OrbitalObjectsPanel className="max-h-[min(50vh,24rem)]" />
            </motion.div>
          )}
        </AnimatePresence>

        <button
          type="button"
          onClick={toggle}
          aria-expanded={open}
          aria-label={open ? '收起轨道列表' : '展开轨道列表'}
          className={[
            'flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs shadow-lg backdrop-blur-md transition-colors',
            open
              ? 'border-violet-500/40 bg-dashboard-bg/95 text-white'
              : 'border-dashboard-neutral/25 bg-dashboard-bg/90 text-dashboard-neutral hover:border-violet-500/30 hover:text-white',
          ].join(' ')}
        >
          <span aria-hidden>🛰️</span>
          <span className="font-medium">轨道列表</span>
          {stationCount > 0 && (
            <span
              className={[
                'min-w-[1.25rem] rounded-full px-1.5 py-0.5 text-center text-[10px] font-medium tabular-nums',
                open ? 'bg-violet-500/25 text-violet-100' : 'bg-dashboard-neutral/15 text-dashboard-neutral/70',
              ].join(' ')}
            >
              {stationCount}
            </span>
          )}
        </button>
      </div>
    </div>
  );
}
