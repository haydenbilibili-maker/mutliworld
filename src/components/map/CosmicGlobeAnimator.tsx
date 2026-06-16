'use client';

/**
 * 宇宙层 3D 地球动效 — 自转（bearing）
 *
 * 仅在 🛰 宇宙空间层且 globe 投影激活时运行；离开该层或标签页隐藏时暂停。
 * 使用 requestAnimationFrame，卸载时 cancel 并恢复平面视角 bearing/pitch。
 * 动效暂停时恢复 MapLibre 拖拽/旋转交互，供用户手动拨动地球。
 */

import { useEffect, useRef, type MutableRefObject } from 'react';
import type maplibregl from 'maplibre-gl';
import { useMapContext } from '@/context/MapContext';
import { useMapStore } from '@/store/useMapStore';
import { isGlobeSupported } from '@/components/map/GlobeController';
import { ROTATION_PERIOD_S } from '@/lib/globe/motionConstants';
import { runProgrammaticBearing } from '@/lib/map/viewState';

const GLOBE_TOUCH_OPTS = { around: 'center' as const };

/** 宇宙层动效播放时关闭手动交互，暂停时恢复（含轨道式旋转） */
function setGlobeManualInteraction(map: maplibregl.Map, enabled: boolean) {
  try {
    if (enabled) {
      map.dragPan.enable();
      map.dragRotate.enable();
      map.touchPitch.enable(GLOBE_TOUCH_OPTS);
      map.touchZoomRotate.enable(GLOBE_TOUCH_OPTS);
    } else {
      map.dragPan.disable();
      map.dragRotate.disable();
      map.touchPitch.disable();
      map.touchZoomRotate.disable();
    }
  } catch {
    /* 地图未就绪 */
  }
}

function syncBearingFromMap(
  map: maplibregl.Map,
  bearingRef: MutableRefObject<number>,
) {
  try {
    bearingRef.current = map.getBearing();
  } catch {
    /* */
  }
}

export function CosmicGlobeAnimator() {
  const map = useMapContext();
  const activeTier = useMapStore((s) => s.activeTier);
  const playing = useMapStore((s) => s.globeMotionPlaying);
  const speed = useMapStore((s) => s.globeMotionSpeed);

  const bearingRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const playingRef = useRef(playing);

  const isCosmicActive = activeTier === 'space';

  useEffect(() => {
    playingRef.current = playing;
  }, [playing]);

  // 离开宇宙层：恢复平面默认视角与默认交互，避免地表/洋底层带着倾斜
  useEffect(() => {
    if (!map || activeTier === 'space') return;
    setGlobeManualInteraction(map, true);
    try {
      map.setBearing(0);
      map.setPitch(0);
    } catch {
      /* */
    }
  }, [map, activeTier]);

  // 宇宙层：播放时禁用手动拖拽，暂停时恢复；暂停期间同步手动调整后的 bearing
  useEffect(() => {
    if (!map || !isCosmicActive || !isGlobeSupported(map)) return;

    const manual = !playing;
    setGlobeManualInteraction(map, manual);
    if (manual) {
      syncBearingFromMap(map, bearingRef);
    }

    if (!manual) return () => setGlobeManualInteraction(map, true);

    const onRotate = () => syncBearingFromMap(map, bearingRef);
    map.on('rotate', onRotate);

    return () => {
      map.off('rotate', onRotate);
      setGlobeManualInteraction(map, true);
    };
  }, [map, isCosmicActive, playing]);

  useEffect(() => {
    if (!map || !isCosmicActive || !playing) return;
    if (!isGlobeSupported(map)) return;

    let lastTs = performance.now();
    let stopped = false;

    const tick = (ts: number) => {
      if (stopped || document.hidden || !playingRef.current) {
        rafRef.current = null;
        return;
      }

      const dt = Math.min((ts - lastTs) / 1000, 0.1);
      lastTs = ts;

      const rotRate = (360 / ROTATION_PERIOD_S) * speed;
      bearingRef.current = (bearingRef.current + rotRate * dt) % 360;

      try {
        runProgrammaticBearing(() => {
          map.setBearing(bearingRef.current);
        });
      } catch {
        /* 样式未就绪 */
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    const resume = () => {
      if (stopped || document.hidden || !playingRef.current) return;
      lastTs = performance.now();
      if (rafRef.current === null) {
        rafRef.current = requestAnimationFrame(tick);
      }
    };

    syncBearingFromMap(map, bearingRef);

    rafRef.current = requestAnimationFrame(tick);
    document.addEventListener('visibilitychange', resume);

    return () => {
      stopped = true;
      document.removeEventListener('visibilitychange', resume);
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [map, isCosmicActive, playing, speed]);

  return null;
}
