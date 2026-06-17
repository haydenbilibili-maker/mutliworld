'use client';

/**
 * 天体视图控制 — 多天体探索 Phase 4
 * 月/火视图底部：3D 球面 / 2D 平面切换 + 返回地球。
 */

import { useMapStore } from '@/store/useMapStore';
import { useBodyStore } from '@/store/useBodyStore';
import { hasBodyImagery } from '@/lib/map/bodyBasemap';

interface BodyViewControlsProps {
  className?: string;
}

export function BodyViewControls({ className = '' }: BodyViewControlsProps) {
  const activeBody = useMapStore((s) => s.activeBody);
  const globe = useMapStore((s) => s.globe);
  const setGlobe = useMapStore((s) => s.setGlobe);
  const setBody = useMapStore((s) => s.setBody);
  const setKnowledgeOpen = useBodyStore((s) => s.setKnowledgeOpen);
  const bodyBasemapMode = useBodyStore((s) => s.bodyBasemapMode);
  const setBodyBasemapMode = useBodyStore((s) => s.setBodyBasemapMode);

  if (activeBody === 'earth') return null;
  const imageryReady = hasBodyImagery(activeBody);

  return (
    <div className={`flex items-center gap-1.5 rounded-lg border border-dashboard-neutral/20 bg-dashboard-bg/90 px-1.5 py-1 shadow-lg backdrop-blur-sm ${className}`}>
      <button
        type="button"
        onClick={() => setGlobe(!globe)}
        aria-pressed={globe}
        title="3D 球面 / 2D 平面"
        className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs transition-colors ${globe ? 'bg-sky-500/20 text-sky-200' : 'text-dashboard-neutral hover:bg-white/5 hover:text-white'}`}
      >
        <span aria-hidden>🌐</span>
        {globe ? '3D 球面' : '2D 平面'}
      </button>
      <span className="h-4 w-px bg-dashboard-neutral/20" aria-hidden />
      <button
        type="button"
        onClick={() => setBodyBasemapMode(bodyBasemapMode === 'terrain' ? 'imagery' : 'terrain')}
        aria-pressed={bodyBasemapMode === 'imagery'}
        title={imageryReady ? '地形图 / 卫星实拍 切换' : '卫星实拍底图未配置（设 NEXT_PUBLIC_*_IMAGERY_URL）；当前回落地形图'}
        className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs transition-colors ${bodyBasemapMode === 'imagery' ? 'bg-emerald-500/20 text-emerald-200' : 'text-dashboard-neutral hover:bg-white/5 hover:text-white'}`}
      >
        <span aria-hidden>🛰️</span>
        {bodyBasemapMode === 'imagery' ? '实拍' : '地形'}
        {bodyBasemapMode === 'imagery' && !imageryReady && <span className="text-[9px] text-amber-300/80">(未配置)</span>}
      </button>
      <span className="h-4 w-px bg-dashboard-neutral/20" aria-hidden />
      <button
        type="button"
        onClick={() => setKnowledgeOpen(true)}
        title="天体百科：概况/地理/载人/博弈/合作/影像/影视"
        className="flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs text-dashboard-neutral transition-colors hover:bg-white/5 hover:text-white"
      >
        <span aria-hidden>📖</span>百科
      </button>
      <span className="h-4 w-px bg-dashboard-neutral/20" aria-hidden />
      <button
        type="button"
        onClick={() => setBody('earth')}
        title="返回地球"
        className="rounded-md px-2.5 py-1 text-xs text-dashboard-neutral transition-colors hover:bg-white/5 hover:text-white"
      >
        ← 地球
      </button>
    </div>
  );
}
