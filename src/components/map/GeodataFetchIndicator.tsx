'use client';

import { useGeodataContext } from '@/context/GeodataContext';

/** 地图左上角 geodata 拉取状态（SWR） */
export function GeodataFetchIndicator() {
  const { meta, isLoading, isValidating, error } = useGeodataContext();
  const featureCount = meta?.featureCount ?? 0;

  if (error) {
    return (
      <div
        className="pointer-events-none absolute left-14 top-4 z-10 rounded-md border border-dashboard-conflict/40 bg-dashboard-bg/90 px-2 py-1 text-[10px] text-dashboard-conflict shadow-lg backdrop-blur-sm"
        role="status"
      >
        态势数据拉取失败
      </div>
    );
  }

  if (isLoading && !meta) {
    return (
      <div
        className="pointer-events-none absolute left-14 top-4 z-10 flex items-center gap-1.5 rounded-md border border-dashboard-neutral/25 bg-dashboard-bg/90 px-2 py-1 text-[10px] text-dashboard-neutral shadow-lg backdrop-blur-sm"
        role="status"
        aria-live="polite"
      >
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-amber-400" />
        加载态势数据…
      </div>
    );
  }

  if (featureCount === 0 && !isValidating) {
    return (
      <div
        className="pointer-events-none absolute left-14 top-4 z-10 rounded-md border border-dashboard-neutral/20 bg-dashboard-bg/85 px-2 py-1 text-[10px] text-dashboard-neutral/70 shadow-lg backdrop-blur-sm max-sm:left-2 max-sm:top-[3.25rem]"
        role="status"
      >
        当前区域暂无地图点位 · 可切换图层或区域
      </div>
    );
  }

  if (isValidating) {
    return (
      <div
        className="pointer-events-none absolute left-14 top-4 z-10 flex items-center gap-1.5 rounded-md border border-dashboard-neutral/20 bg-dashboard-bg/80 px-2 py-1 text-[10px] text-dashboard-neutral/60 shadow backdrop-blur-sm max-sm:hidden"
        role="status"
        aria-hidden
      >
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400/80" />
        刷新中
      </div>
    );
  }

  return null;
}
