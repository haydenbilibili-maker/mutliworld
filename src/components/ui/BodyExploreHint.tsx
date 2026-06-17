'use client';

/**
 * 天体探索占位提示 — 多天体探索 Phase 0
 * 月球 / 火星当前为骨架视图（占位底图）；列出 Phase 1+ 即将上线的真实探索痕迹。
 */

import { useMapStore } from '@/store/useMapStore';
import { getBody } from '@/bodies';
import { getSitesForBody } from '@/bodies/sites';

const PLANNED: Record<string, string[]> = {
  moon: ['阿波罗 11/12/14/15/16/17 着陆点', '嫦娥 3/4/5/6（含月背采样）', 'Luna / Surveyor / Chandrayaan-3 / SLIM', '在轨绕月：LRO · 鹊桥二号 · Danuri（实时星历）'],
  mars: ['巡视器：勇气 · 机遇 · 好奇 · 毅力 · 祝融', '着陆器：Viking · Pathfinder · InSight · 天问', '巡视行进轨迹（traverse）', '在轨绕火：MRO · MAVEN · 天问环绕器（实时星历）'],
};

export function BodyExploreHint() {
  const activeBody = useMapStore((s) => s.activeBody);
  const setBody = useMapStore((s) => s.setBody);
  const mod = getBody(activeBody);
  if (!mod || activeBody === 'earth') return null;
  // 已有真实痕迹数据的天体（如月球）直接看地图标记，不再覆盖提示
  if (getSitesForBody(activeBody).length > 0) return null;
  const planned = PLANNED[activeBody] ?? [];

  return (
    <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center p-4">
      <div className="pointer-events-auto w-[min(26rem,calc(100vw-2rem))] rounded-xl border border-brand-gold/25 bg-dashboard-bg/90 p-5 text-center shadow-2xl backdrop-blur-md">
        <div className="text-4xl" aria-hidden>{mod.icon}</div>
        <h2 className="mt-2 text-xl font-semibold text-white">{mod.name}</h2>
        <p className="mt-1 text-xs text-brand-cyan/80">{mod.tagline}</p>
        <div className="mt-3 rounded-lg border border-dashboard-neutral/15 bg-white/[0.02] p-3 text-left">
          <div className="mb-1.5 text-[10px] uppercase tracking-wide text-dashboard-neutral/45">
            即将上线 · 真实探索痕迹
          </div>
          <ul className="space-y-1 text-[11px] leading-relaxed text-dashboard-neutral/85">
            {planned.map((p) => (
              <li key={p} className="flex gap-1.5">
                <span aria-hidden className="text-brand-gold/70">·</span>
                <span>{p}</span>
              </li>
            ))}
          </ul>
        </div>
        <p className="mt-3 text-[10px] text-dashboard-neutral/45">
          多天体探索 v2.0 · Phase 0 骨架（占位底图）· 真实底图与痕迹见后续阶段
        </p>
        <button
          type="button"
          onClick={() => setBody('earth')}
          className="mt-3 rounded-md border border-dashboard-neutral/25 px-3 py-1.5 text-xs text-dashboard-neutral transition-colors hover:bg-white/5 hover:text-white"
        >
          ← 返回地球
        </button>
      </div>
    </div>
  );
}
