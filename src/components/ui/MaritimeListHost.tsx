'use client';

/**
 * 地表层海运状态 FAB — 显示在航船舶数量与刷新状态
 */

import { useMapStore } from '@/store/useMapStore';
import { useLiveMaritime } from '@/hooks/useLiveMaritime';

interface MaritimeListHostProps {
  className?: string;
}

function formatTime(iso: string | null | undefined): string {
  if (!iso) return '—';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  const HH = String(d.getHours()).padStart(2, '0');
  const MM = String(d.getMinutes()).padStart(2, '0');
  const SS = String(d.getSeconds()).padStart(2, '0');
  return `${HH}:${MM}:${SS}`;
}

export function MaritimeListHost({ className = '' }: MaritimeListHostProps) {
  const activeTier = useMapStore((s) => s.activeTier);
  const activeLayers = useMapStore((s) => s.activeLayers);
  const center = useMapStore((s) => s.center);
  const zoom = useMapStore((s) => s.zoom);

  const enabled = activeTier === 'surface' && activeLayers.includes('live_maritime');
  const { meta, isValidating, error } = useLiveMaritime(enabled, center, zoom);

  if (!enabled) return null;

  const count = meta?.displayed ?? 0;
  const statusClass = error || meta?.error
    ? 'bg-dashboard-conflict'
    : isValidating
      ? 'bg-amber-400'
      : 'bg-emerald-400';

  const simNote = meta?.simulated ? '（模拟）' : '';

  return (
    <div
      className={[
        'pointer-events-none absolute right-4 top-[7.5rem] z-30 flex flex-col items-end',
        className,
      ].join(' ')}
    >
      <div
        className="pointer-events-auto flex items-center gap-1.5 rounded-lg border border-dashboard-neutral/25 bg-dashboard-bg/90 px-3 py-2 text-xs shadow-lg backdrop-blur-md"
        role="status"
        aria-live="polite"
        title={
          meta?.error || error
            ? String(meta?.error ?? error)
            : `数据来源：${meta?.sourceLabel ?? '海运 AIS'}${simNote} · 更新 ${formatTime(meta?.generatedAt)}`
        }
      >
        <span aria-hidden>🚢</span>
        <span className="font-medium text-white">海运实时</span>
        <span className="min-w-[1.25rem] rounded-full bg-cyan-500/20 px-1.5 py-0.5 text-center text-[10px] font-medium tabular-nums text-cyan-100">
          {count}
        </span>
        <span className={`h-2 w-2 shrink-0 rounded-full ${statusClass}`} />
        <span className="hidden text-[10px] text-dashboard-neutral/60 sm:inline">
          {formatTime(meta?.generatedAt)}
        </span>
      </div>
    </div>
  );
}
