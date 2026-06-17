'use client';

/**
 * 地表层航班状态 FAB — 显示在轨飞机数量与刷新状态
 */

import { useMapStore } from '@/store/useMapStore';
import { useLiveFlights } from '@/hooks/useLiveFlights';

interface FlightListHostProps {
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

export function FlightListHost({ className = '' }: FlightListHostProps) {
  const activeTier = useMapStore((s) => s.activeTier);
  const activeLayers = useMapStore((s) => s.activeLayers);
  const center = useMapStore((s) => s.center);
  const zoom = useMapStore((s) => s.zoom);

  const enabled = activeTier === 'surface' && activeLayers.includes('live_flights');
  const { meta, isValidating, error } = useLiveFlights(enabled, center, zoom);

  if (!enabled) return null;

  const count = meta?.displayed ?? 0;
  const statusClass = error || meta?.error
    ? 'bg-dashboard-conflict'
    : isValidating
      ? 'bg-amber-400'
      : 'bg-emerald-400';

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
            : `数据来源：${meta?.source ?? 'OpenSky'} · 更新 ${formatTime(meta?.generatedAt)}`
        }
      >
        <span aria-hidden>✈️</span>
        <span className="font-medium text-white">实时航班</span>
        <span className="min-w-[1.25rem] rounded-full bg-sky-500/20 px-1.5 py-0.5 text-center text-[10px] font-medium tabular-nums text-sky-100">
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
