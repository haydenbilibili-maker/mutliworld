'use client';

/**
 * 地表层实时天气状态 FAB — 显示刷新/错误状态（Open-Meteo + RainViewer）
 */

import { useMapStore } from '@/store/useMapStore';
import { useLiveWeather, useWeatherRadar } from '@/hooks/useLiveWeather';

interface LiveWeatherStatusHostProps {
  className?: string;
}

function formatTime(iso: string | null | undefined): string {
  if (!iso) return '—';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  const HH = String(d.getHours()).padStart(2, '0');
  const MM = String(d.getMinutes()).padStart(2, '0');
  return `${HH}:${MM}`;
}

export function LiveWeatherStatusHost({ className = '' }: LiveWeatherStatusHostProps) {
  const activeTier = useMapStore((s) => s.activeTier);
  const activeLayers = useMapStore((s) => s.activeLayers);

  const enabled = activeTier === 'surface' && activeLayers.includes('live_weather');
  const { points, generatedAt, error: weatherError, isValidating: weatherBusy, retry: retryWeather } =
    useLiveWeather(enabled);
  const { radar, error: radarError, isValidating: radarBusy, retry: retryRadar } =
    useWeatherRadar(enabled);

  if (!enabled) return null;

  const hasError = Boolean(weatherError || radarError);
  const statusClass = hasError
    ? 'bg-dashboard-conflict'
    : weatherBusy || radarBusy
      ? 'bg-amber-400'
      : 'bg-emerald-400';

  const errorMsg =
    weatherError instanceof Error
      ? weatherError.message
      : radarError instanceof Error
        ? radarError.message
        : '天气数据暂不可用';

  return (
    <div
      className={[
        'pointer-events-none absolute right-4 top-[9.75rem] z-30 flex flex-col items-end',
        className,
      ].join(' ')}
    >
      <div
        className="pointer-events-auto flex max-w-[min(18rem,calc(100vw-2rem))] items-center gap-1.5 rounded-lg border border-dashboard-neutral/25 bg-dashboard-bg/90 px-3 py-2 text-xs shadow-lg backdrop-blur-md"
        role="status"
        aria-live="polite"
        title={
          hasError
            ? errorMsg
            : `城市实况 ${points.length} 处 · 雷达 ${radar ? '已加载' : '等待中'} · 更新 ${formatTime(generatedAt)}`
        }
      >
        <span aria-hidden>🌧️</span>
        <span className="font-medium text-white">实时天气</span>
        <span className="min-w-[1.25rem] rounded-full bg-cyan-500/20 px-1.5 py-0.5 text-center text-[10px] font-medium tabular-nums text-cyan-100">
          {points.length}
        </span>
        <span className={`h-2 w-2 shrink-0 rounded-full ${statusClass}`} />
        {hasError ? (
          <>
            <span className="truncate text-[10px] text-dashboard-conflict/90 max-w-[6rem] sm:max-w-none">
              {errorMsg}
            </span>
            <button
              type="button"
              onClick={() => {
                retryWeather();
                retryRadar();
              }}
              className="pointer-events-auto shrink-0 rounded px-1.5 py-0.5 text-[10px] text-cyan-200 hover:bg-white/10"
            >
              重试
            </button>
          </>
        ) : (
          <span className="hidden text-[10px] text-dashboard-neutral/60 sm:inline">
            {formatTime(generatedAt)}
          </span>
        )}
      </div>
    </div>
  );
}
