'use client';

/**
 * 全局搜索框 — 对标 World Monitor Round 8
 * 跨区域/事件/设施/基础设施/核设施搜索；选中后飞向地图并出详情（区域→详情卡）。
 */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useMapStore } from '@/store/useMapStore';
import { useRegionDetailStore } from '@/store/useRegionDetailStore';
import { searchEntries, type SearchEntry, type SearchKind } from '@/lib/search/searchIndex';
import { geocodePlaces } from '@/lib/search/geocode';
import type { EventDetail } from '@/types/geo';

interface SearchBoxProps {
  className?: string;
  /** 嵌入 MapControlBar 时省略独立按钮外框样式 */
  embedded?: boolean;
}

const KIND_DOT: Record<SearchKind, string> = {
  region: 'bg-cyan-400',
  event: 'bg-rose-400',
  incident: 'bg-orange-400',
  facility: 'bg-slate-300',
  infra: 'bg-teal-400',
  nuclear: 'bg-purple-400',
  person: 'bg-violet-400',
  place: 'bg-emerald-400',
};

export function SearchBox({ className = '', embedded = false }: SearchBoxProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const [active, setActive] = useState(0);

  const setRegion = useMapStore((s) => s.setRegion);
  const setViewport = useMapStore((s) => s.setViewport);
  const selectEvent = useMapStore((s) => s.selectEvent);
  const focusOnMap = useMapStore((s) => s.focusOnMap);
  const openDetail = useRegionDetailStore((s) => s.open);

  const localResults = useMemo(() => searchEntries(q, 8), [q]);
  const [geoResults, setGeoResults] = useState<SearchEntry[]>([]);
  const [geoLoading, setGeoLoading] = useState(false);

  /** 合并本地结果与地理编码地点结果（本地优先），供键盘导航与渲染统一使用 */
  const results = useMemo(() => {
    const seen = new Set(localResults.map((e) => `${e.lng.toFixed(3)},${e.lat.toFixed(3)}`));
    const geo = geoResults.filter((e) => !seen.has(`${e.lng.toFixed(3)},${e.lat.toFixed(3)}`));
    return [...localResults, ...geo];
  }, [localResults, geoResults]);

  useEffect(() => {
    setActive(0);
  }, [q]);

  /** 地名地理编码：防抖 450ms + 取消上一请求，结果并入「地点」 */
  useEffect(() => {
    const query = q.trim();
    if (query.length < 2) {
      setGeoResults([]);
      setGeoLoading(false);
      return;
    }
    const ctrl = new AbortController();
    setGeoLoading(true);
    const t = window.setTimeout(async () => {
      const places = await geocodePlaces(query, ctrl.signal);
      if (!ctrl.signal.aborted) {
        setGeoResults(places);
        setGeoLoading(false);
      }
    }, 450);
    return () => {
      ctrl.abort();
      window.clearTimeout(t);
    };
  }, [q]);

  const close = useCallback(() => {
    setOpen(false);
    setQ('');
    inputRef.current?.blur();
  }, []);

  const choose = useCallback(
    (e: SearchEntry) => {
      if (e.kind === 'region' && e.regionId) {
        setRegion(e.regionId);
        openDetail(e.regionId);
      } else {
        setViewport([e.lng, e.lat], e.zoom);
        const ev: EventDetail = {
          id: e.id,
          title: e.label,
          source: e.source ?? '',
          timestamp: '',
          location: [e.lng, e.lat],
          impact_level: e.impact ?? 'medium',
          category: e.category ?? e.kind,
          description: e.description,
        };
        focusOnMap(ev);
        selectEvent(null);
      }
      close();
    },
    [setRegion, openDetail, setViewport, selectEvent, focusOnMap, close],
  );

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (ev: PointerEvent) => {
      if (!rootRef.current?.contains(ev.target as Node)) close();
    };
    const onKeyDown = (ev: KeyboardEvent) => {
      if (ev.key === 'Escape') close();
    };

    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open, close]);

  useEffect(() => {
    if (open) {
      const t = window.setTimeout(() => inputRef.current?.focus(), 50);
      return () => window.clearTimeout(t);
    }
  }, [open]);

  const onInputKeyDown = (ev: React.KeyboardEvent) => {
    if (ev.key === 'Escape') {
      close();
      return;
    }
    if (!results.length) return;
    if (ev.key === 'ArrowDown') {
      ev.preventDefault();
      setActive((i) => (i + 1) % results.length);
    } else if (ev.key === 'ArrowUp') {
      ev.preventDefault();
      setActive((i) => (i - 1 + results.length) % results.length);
    } else if (ev.key === 'Enter') {
      ev.preventDefault();
      const sel = results[active];
      if (sel) choose(sel);
    }
  };

  const showResults = q.trim().length > 0;

  return (
    <div ref={rootRef} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="dialog"
        aria-label="全局搜索"
        className={[
          'flex items-center gap-1.5 transition-colors sm:gap-2',
          embedded
            ? [
                'rounded px-2 py-1 text-xs sm:px-3 sm:py-1.5 sm:text-sm',
                open
                  ? 'bg-dashboard-military/25 text-white'
                  : 'text-dashboard-neutral hover:bg-dashboard-neutral/20 hover:text-white',
              ].join(' ')
            : [
                'gap-2 rounded-lg border px-3 py-2 text-sm shadow-lg backdrop-blur-sm',
                open
                  ? 'border-dashboard-military/50 bg-dashboard-bg/95 text-white'
                  : 'border-dashboard-neutral/25 bg-dashboard-bg/85 text-dashboard-neutral hover:border-dashboard-neutral/40 hover:text-white',
              ].join(' '),
        ].join(' ')}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          className="shrink-0"
          aria-hidden
        >
          <circle cx="11" cy="11" r="7" />
          <path d="m21 21-4.3-4.3" />
        </svg>
        <span>搜索</span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            role="dialog"
            aria-label="全局搜索"
            initial={{ opacity: 0, y: embedded ? 8 : -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: embedded ? 8 : -6, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className={[
              'absolute z-40 w-[min(22rem,calc(100vw-2rem))] rounded-lg border border-dashboard-neutral/25 bg-dashboard-bg/95 shadow-xl backdrop-blur-md',
              embedded
                ? 'bottom-full left-1/2 mb-2 -translate-x-1/2 sm:left-auto sm:right-0 sm:translate-x-0'
                : 'left-0 top-full mt-2',
            ].join(' ')}
          >
            <div className="flex items-center gap-2 border-b border-dashboard-neutral/15 px-3 py-2">
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                className="shrink-0 text-dashboard-neutral/60"
                aria-hidden
              >
                <circle cx="11" cy="11" r="7" />
                <path d="m21 21-4.3-4.3" />
              </svg>
              <input
                ref={inputRef}
                value={q}
                onChange={(e) => setQ(e.target.value)}
                onKeyDown={onInputKeyDown}
                placeholder="区域 / 事件 / 设施 / 地名…"
                aria-label="搜索关键词"
                className="min-w-0 flex-1 bg-transparent text-sm text-white placeholder:text-dashboard-neutral/45 focus:outline-none"
              />
              {q && (
                <button
                  type="button"
                  onClick={() => {
                    setQ('');
                    inputRef.current?.focus();
                  }}
                  aria-label="清空搜索"
                  className="shrink-0 text-sm leading-none text-dashboard-neutral/50 hover:text-white"
                >
                  ×
                </button>
              )}
              <button
                type="button"
                onClick={close}
                aria-label="关闭搜索"
                className="shrink-0 rounded px-1 text-dashboard-neutral/70 hover:bg-white/5 hover:text-white"
              >
                ×
              </button>
            </div>

            {showResults && (
              <div className="max-h-[min(40vh,18rem)] overflow-y-auto p-1">
                {results.length === 0 && !geoLoading ? (
                  <div className="px-3 py-2 text-xs text-dashboard-neutral/50">无匹配结果</div>
                ) : (
                  results.map((e, i) => (
                    <div key={e.id}>
                      {e.kind === 'place' && results[i - 1]?.kind !== 'place' && (
                        <div className="px-2.5 pb-0.5 pt-1.5 text-[10px] uppercase tracking-wide text-dashboard-neutral/40">
                          📍 地点 · OpenStreetMap
                        </div>
                      )}
                      <button
                        type="button"
                        onClick={() => choose(e)}
                        onMouseEnter={() => setActive(i)}
                        className={[
                          'flex w-full items-start gap-2 rounded-md px-2.5 py-1.5 text-left transition-colors',
                          i === active ? 'bg-dashboard-military/20' : 'hover:bg-white/5',
                        ].join(' ')}
                      >
                        <span
                          className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${KIND_DOT[e.kind]}`}
                          aria-hidden
                        />
                        <span className="min-w-0">
                          <span className="block truncate text-[12px] text-white">{e.label}</span>
                          <span className="block truncate text-[10px] text-dashboard-neutral/50">
                            {e.sublabel}
                          </span>
                        </span>
                      </button>
                    </div>
                  ))
                )}
                {geoLoading && (
                  <div className="px-3 py-1.5 text-[11px] text-dashboard-neutral/45">
                    正在检索地点…
                  </div>
                )}
              </div>
            )}

            {!showResults && (
              <p className="px-3 py-2 text-[11px] text-dashboard-neutral/50">
                搜区域/事件/设施，或任意地名（如「白泉镇」「艾菲尔铁塔」）· Esc 关闭{embedded ? ' · 点击空白处关闭' : ''}
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
