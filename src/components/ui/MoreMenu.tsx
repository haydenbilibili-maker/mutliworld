'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useLaunchLogStore } from '@/store/useLaunchLogStore';
import { useOrbitalPanelStore } from '@/store/useOrbitalPanelStore';
import { useLaunchLog } from '@/hooks/useLaunchLog';
import { useMapStore } from '@/store/useMapStore';
import { useOrbitalObjects } from '@/hooks/useOrbitalObjects';

interface MoreMenuProps {
  className?: string;
  embedded?: boolean;
}

/** 地图控制条 · 更多功能入口（发射日志等） */
export function MoreMenu({ className = '', embedded = false }: MoreMenuProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const launchLogOpen = useLaunchLogStore((s) => s.open);
  const toggleLaunchLog = useLaunchLogStore((s) => s.toggle);
  const orbitalOpen = useOrbitalPanelStore((s) => s.open);
  const toggleOrbital = useOrbitalPanelStore((s) => s.toggle);
  const inSpace = useMapStore((s) => s.activeTier === 'space');
  const { total } = useLaunchLog('1y');
  const { meta: orbitalMeta } = useOrbitalObjects(inSpace && (menuOpen || orbitalOpen));

  const hasActiveItem = launchLogOpen || orbitalOpen;
  const orbitalTotal = orbitalMeta?.total ?? 0;
  const adminEnabled =
    process.env.NEXT_PUBLIC_ADMIN_ENABLED === 'true' ||
    process.env.NODE_ENV === 'development';

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

  const handleLaunchLogToggle = () => {
    toggleLaunchLog();
    setMenuOpen(false);
  };

  const handleOrbitalToggle = () => {
    toggleOrbital();
    setMenuOpen(false);
  };

  return (
    <div ref={rootRef} className={['relative', className].join(' ')}>
      <button
        type="button"
        onClick={() => setMenuOpen((v) => !v)}
        aria-expanded={menuOpen}
        aria-haspopup="menu"
        aria-pressed={hasActiveItem}
        aria-label="更多功能"
        className={[
          'flex items-center gap-1 rounded px-2 py-1 text-xs transition-colors sm:gap-1.5 sm:px-3 sm:py-1.5 sm:text-sm',
          embedded
            ? menuOpen || hasActiveItem
              ? 'bg-dashboard-military/25 text-white'
              : 'text-dashboard-neutral hover:bg-dashboard-neutral/20 hover:text-white'
            : [
                'gap-2 rounded-lg border px-3 py-2 shadow-lg backdrop-blur-sm',
                menuOpen || hasActiveItem
                  ? 'border-dashboard-military/50 bg-dashboard-bg/95 text-white'
                  : 'border-dashboard-neutral/25 bg-dashboard-bg/85 text-dashboard-neutral hover:border-dashboard-neutral/40 hover:text-white',
              ].join(' '),
        ].join(' ')}
      >
        <span>更多</span>
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
            menuOpen ? 'rotate-180' : '',
          ].join(' ')}
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.15 }}
            role="menu"
            aria-label="更多功能"
            className={[
              'absolute bottom-full z-50 mb-1.5 min-w-[11rem] overflow-hidden rounded-lg',
              'border border-dashboard-neutral/25 bg-dashboard-bg/95 shadow-xl backdrop-blur-md',
              embedded ? 'right-0' : 'right-0',
            ].join(' ')}
          >
            <div className="border-b border-dashboard-neutral/15 px-3 py-2 text-[10px] uppercase tracking-wide text-dashboard-neutral/55">
              更多
            </div>
            <ul className="py-1">
              <li>
                <button
                  type="button"
                  role="menuitemcheckbox"
                  aria-checked={launchLogOpen}
                  onClick={handleLaunchLogToggle}
                  className={[
                    'flex w-full items-center gap-2 px-3 py-2 text-left text-[12px] transition-colors',
                    launchLogOpen
                      ? 'bg-dashboard-military/15 text-white'
                      : 'text-dashboard-neutral hover:bg-white/5 hover:text-white',
                  ].join(' ')}
                >
                  <span aria-hidden className="shrink-0 text-sm">
                    🚀
                  </span>
                  <span className="min-w-0 flex-1 font-medium">发射日志</span>
                  {total > 0 && (
                    <span
                      className={[
                        'min-w-[1.25rem] rounded-full px-1.5 py-0.5 text-center text-[10px] font-medium tabular-nums',
                        launchLogOpen
                          ? 'bg-dashboard-military/30 text-white'
                          : 'bg-dashboard-neutral/15 text-dashboard-neutral/70',
                      ].join(' ')}
                    >
                      {total}
                    </span>
                  )}
                  {launchLogOpen && (
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
              <li>
                <button
                  type="button"
                  role="menuitemcheckbox"
                  aria-checked={orbitalOpen}
                  onClick={handleOrbitalToggle}
                  className={[
                    'flex w-full items-center gap-2 px-3 py-2 text-left text-[12px] transition-colors',
                    orbitalOpen
                      ? 'bg-dashboard-military/15 text-white'
                      : 'text-dashboard-neutral hover:bg-white/5 hover:text-white',
                  ].join(' ')}
                >
                  <span aria-hidden className="shrink-0 text-sm">
                    🛰️
                  </span>
                  <span className="min-w-0 flex-1 font-medium">轨道列表</span>
                  {orbitalTotal > 0 && (
                    <span
                      className={[
                        'min-w-[1.25rem] rounded-full px-1.5 py-0.5 text-center text-[10px] font-medium tabular-nums',
                        orbitalOpen
                          ? 'bg-dashboard-military/30 text-white'
                          : 'bg-dashboard-neutral/15 text-dashboard-neutral/70',
                      ].join(' ')}
                    >
                      {orbitalTotal}
                    </span>
                  )}
                  {orbitalOpen && (
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
              {adminEnabled && (
                <li>
                  <a
                    href="/admin"
                    target="_blank"
                    rel="noopener noreferrer"
                    role="menuitem"
                    title="在新标签页打开管理后台"
                    onClick={() => setMenuOpen(false)}
                    className="flex w-full items-center gap-2 px-3 py-2 text-left text-[12px] text-dashboard-neutral transition-colors hover:bg-white/5 hover:text-white"
                  >
                    <span aria-hidden className="shrink-0 text-sm">
                      ⚙️
                    </span>
                    <span className="min-w-0 flex-1 font-medium">管理后台</span>
                  </a>
                </li>
              )}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
