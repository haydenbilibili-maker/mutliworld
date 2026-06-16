'use client';

/**
 * 宇宙层动效控制 — 自转播放与速度倍率
 * 仅在 🛰 宇宙空间层显示。
 */

import { useMapStore } from '@/store/useMapStore';
import { GLOBE_MOTION_SPEEDS, type GlobeMotionSpeed } from '@/lib/globe/motionConstants';

interface CosmicMotionControlsProps {
  className?: string;
}

export function CosmicMotionControls({ className = '' }: CosmicMotionControlsProps) {
  const activeTier = useMapStore((s) => s.activeTier);
  const playing = useMapStore((s) => s.globeMotionPlaying);
  const speed = useMapStore((s) => s.globeMotionSpeed);
  const setPlaying = useMapStore((s) => s.setGlobeMotionPlaying);
  const setSpeed = useMapStore((s) => s.setGlobeMotionSpeed);

  if (activeTier !== 'space') return null;

  return (
    <div
      className={`flex flex-col gap-1 border-t border-dashboard-neutral/15 pt-1 ${className}`}
      role="group"
      aria-label="地球自转控制"
    >
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => setPlaying(!playing)}
          aria-pressed={playing}
          title={playing ? '暂停自转' : '播放自转'}
          className={[
            'flex flex-1 items-center justify-center gap-1 rounded-md px-2 py-1 text-[10px] transition-colors',
            playing
              ? 'bg-emerald-500/20 text-emerald-200'
              : 'bg-dashboard-neutral/15 text-dashboard-neutral hover:text-white',
          ].join(' ')}
        >
          <span aria-hidden>{playing ? '⏸' : '▶'}</span>
          <span>{playing ? '动效：播放' : '动效：暂停'}</span>
        </button>
      </div>
      <div className="flex gap-0.5" role="group" aria-label="速度倍率">
        {GLOBE_MOTION_SPEEDS.map((s) => {
          const active = speed === s;
          return (
            <button
              key={s}
              type="button"
              onClick={() => setSpeed(s as GlobeMotionSpeed)}
              aria-pressed={active}
              title={`${s}× 速度`}
              className={[
                'flex-1 rounded px-1 py-0.5 text-[10px] transition-colors',
                active
                  ? 'bg-sky-500/25 text-sky-100'
                  : 'text-dashboard-neutral/55 hover:bg-dashboard-neutral/15 hover:text-white',
              ].join(' ')}
            >
              {s}×
            </button>
          );
        })}
      </div>
    </div>
  );
}
