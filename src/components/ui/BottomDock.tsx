'use client';

/**
 * 底部 Dock 协调器 — 把「近地数值数据条」与「底部控制栏」收入同一居中 flex 列，
 * 形成「窄数据层叠在宽控制层之上」的级联台阶，共享玻璃语言与高级原生质感。
 *
 * 形态：级联分层 Dock
 *   ┌── 数据层(窄 40rem, 青色顶辉光) ──┐   仅近地空间层挂载，弹簧抬升级联
 *   └──────────────┬───────────────────┘   gap 6px
 *   ┌──────────────┴───────────────────┐
 *   │  控制层(宽 48rem, 始终在地球层渲染)  │
 *   └────────────────────────────────────┘
 *
 * 定位锚点：absolute bottom-14（与原 MapControlBar 一致，布局零偏移）。
 * 门控：仅 activeBody === 'earth' 时渲染；非地球天体返回 null（保持现状）。
 */

import { AnimatePresence, motion } from 'framer-motion';
import { useMapStore } from '@/store/useMapStore';
import { MapControlBar } from '@/components/ui/MapControlBar';
import { NearEarthDataBar } from '@/components/ui/NearEarthDataBar';

interface BottomDockProps {
  className?: string;
}

export function BottomDock({ className = '' }: BottomDockProps) {
  const isEarth = useMapStore((s) => s.activeBody === 'earth');
  const inNearEarth = useMapStore((s) => s.activeBody === 'earth' && s.activeTier === 'near_earth');

  if (!isEarth) return null;

  return (
    <div
      className={[
        'absolute bottom-14 left-1/2 z-20 flex -translate-x-1/2 flex-col items-center gap-1.5',
        'max-sm:bottom-16 max-sm:max-w-[calc(100vw-1rem)]',
        className,
      ].join(' ')}
    >
      {/* 近地数据层：弹簧抬升级联（在控制栏之后入场，离开近地时优雅收回） */}
      <AnimatePresence>
        {inNearEarth && (
          <motion.div
            key="near-earth-data"
            initial={{ opacity: 0, y: 14, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 320, damping: 28, mass: 0.8, delay: 0.04 }}
          >
            <NearEarthDataBar />
          </motion.div>
        )}
      </AnimatePresence>

      {/* 控制层：始终渲染（地球各空间层通用） */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
      >
        <MapControlBar embedded />
      </motion.div>

      {/* 环境光：极淡青金辉光托住整个 dock，营造悬浮落地感。
          宽度按控制层（最宽项）居中收束，不随数据条入场/退场跳动。 */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-full h-6 w-[min(48rem,calc(100vw-2rem))] -translate-x-1/2 translate-y-1 rounded-full opacity-60 blur-xl"
        style={{ background: 'radial-gradient(ellipse at center, rgba(63,200,224,0.10), transparent 70%)' }}
      />
    </div>
  );
}
