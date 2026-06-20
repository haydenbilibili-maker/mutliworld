'use client';

import { useRef, useEffect, useState, Suspense } from 'react';
import maplibregl from 'maplibre-gl';
import { useMapStore } from '@/store/useMapStore';
import { useOrbitalPanelStore } from '@/store/useOrbitalPanelStore';
import { UrlStateSync } from '@/hooks/useSyncStateToUrl';
import { useRegionData } from '@/hooks/useRegionData';
import { DEFAULT_CENTER, DEFAULT_ZOOM } from '@/lib/constants';
import {
  centersEqual,
  consumeViewportSyncFromMap,
  isProgrammaticBearingMove,
  markViewportSyncFromMap,
  zoomsEqual,
} from '@/lib/map/viewState';
import { buildBoundsRing } from '@/lib/graticule';
import { getTier } from '@/tiers';
import {
  applyBasemapZoomConstraints,
  applyTerrainEnhancement,
  isTerrainEnhanceEnabled,
  isTerrainPreset,
  resolveBasemapStyle,
  SATELLITE_BASEMAP_MAX_ZOOM,
  SURFACE_BASEMAP_MAX_ZOOM,
} from '@/lib/map/basemap';
import { syncGlobeState } from '@/lib/map/globeProjection';
import { MapProvider } from '@/context/MapContext';
import { BasemapController } from '@/components/map/BasemapController';
import { GeodataLayer } from '@/components/map/GeodataLayer';
import { DaynightLayer } from '@/components/map/DaynightLayer';
import { LivePulseLayer } from '@/components/map/LivePulseLayer';
import { FlightTrailLayer } from '@/components/map/FlightTrailLayer';
import { FlowLayer } from '@/components/map/FlowLayer';
import { BathymetryLayer } from '@/components/map/BathymetryLayer';
import { GlobeController } from '@/components/map/GlobeController';
import { CosmicGlobeAnimator } from '@/components/map/CosmicGlobeAnimator';
import { OrbitRings } from '@/components/map/OrbitRings';
import { OrbitalObjectsLayer } from '@/components/map/OrbitalObjectsLayer';
import { FlightLayer } from '@/components/map/FlightLayer';
import { FireLayer } from '@/components/map/FireLayer';
import { BodySiteLayer } from '@/components/map/BodySiteLayer';
import { BodyOrbiterLayer } from '@/components/map/BodyOrbiterLayer';
import { BodyTraverseLayer } from '@/components/map/BodyTraverseLayer';
import { BodyFeatureLayer } from '@/components/map/BodyFeatureLayer';
import { MaritimeLayer } from '@/components/map/MaritimeLayer';
import { PizzaIndexLayer } from '@/components/map/PizzaIndexLayer';
import { ProfilePicker } from '@/components/map/ProfilePicker';
import { CrossLayerLinks } from '@/components/map/CrossLayerLinks';
import { LiveWeatherLayer } from '@/components/map/LiveWeatherLayer';
import { ConflictZonesLayer } from '@/components/map/ConflictZonesLayer';
import { MapSelectionPulse } from '@/components/map/MapSelectionPulse';
import { MapTooltip } from '@/components/map/MapTooltip';
import { GeodataFetchIndicator } from '@/components/map/GeodataFetchIndicator';

interface MapContainerProps {
  className?: string;
}

export function MapContainer({ className = '' }: MapContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const initialSyncDone = useRef(false);
  const lastGlobeResetNonce = useRef(0);
  const [mapInstance, setMapInstance] = useState<maplibregl.Map | null>(null);
  const [mapReady, setMapReady] = useState(false);
  const center = useMapStore((s) => s.center);
  const zoom = useMapStore((s) => s.zoom);
  const globeViewResetNonce = useMapStore((s) => s.globeViewResetNonce);
  const activeTier = useMapStore((s) => s.activeTier);
  const isEarth = useMapStore((s) => s.activeBody === 'earth');
  const orbitalOpen = useOrbitalPanelStore((s) => s.open);
  const { bounds } = useRegionData();

  // useSearchParams 必须在 Suspense 边界内使用
  const urlStateSync = (
    <Suspense fallback={null}>
      <UrlStateSync />
    </Suspense>
  );

  useEffect(() => {
    if (!containerRef.current) return;

    const initialTier = useMapStore.getState().activeTier;
    const initialMode = useMapStore.getState().basemapMode;
    const preset = getTier(initialTier)?.basemap ?? 'imagery';
    const style = resolveBasemapStyle(preset, initialMode);
    const terrainEnhance = isTerrainPreset(preset) && isTerrainEnhanceEnabled();
    const initialMaxZoom = isTerrainPreset(preset)
      ? SURFACE_BASEMAP_MAX_ZOOM
      : initialMode === 'political'
        ? SURFACE_BASEMAP_MAX_ZOOM
        : SATELLITE_BASEMAP_MAX_ZOOM;

    const safeCenter: [number, number] =
      Number.isFinite(center[0]) && Number.isFinite(center[1])
        ? center
        : DEFAULT_CENTER;
    const safeZoom = Number.isFinite(zoom) ? zoom : DEFAULT_ZOOM;

    const map = new maplibregl.Map({
      container: containerRef.current,
      style,
      center: safeCenter,
      zoom: safeZoom,
      maxZoom: initialMaxZoom,
      // 球面模式下拖拽更接近拨动实体地球（宇宙层暂停时可手动旋转）
      aroundCenter: true,
    });

    const onInitialStyleReady = () => {
      try {
        applyBasemapZoomConstraints(map, preset, initialMode);
        if (terrainEnhance) {
          applyTerrainEnhancement(map);
        }
        const { globe, activeTier: tier } = useMapStore.getState();
        syncGlobeState(map, globe, tier);
      } catch {
        /* */
      }
    };

    if (typeof style === 'string') {
      map.once('load', onInitialStyleReady);
    } else {
      map.once('style.load', onInitialStyleReady);
    }
    map.addControl(new maplibregl.NavigationControl(), 'top-right');
    map.on('moveend', () => {
      const state = useMapStore.getState();
      // 宇宙层自转仅改 bearing，不回写 center/zoom，避免与 store/flyTo 形成反馈环
      if (
        state.activeTier === 'space' &&
        (state.globeMotionPlaying || isProgrammaticBearingMove())
      ) {
        return;
      }

      const c = map.getCenter();
      const z = map.getZoom();
      const nextCenter: [number, number] = [c.lng, c.lat];
      if (centersEqual(state.center, nextCenter) && zoomsEqual(state.zoom, z)) return;

      markViewportSyncFromMap(nextCenter, z);
      state.setViewport(nextCenter, z);
    });
    map.on('load', () => {
      try {
        map.resize();
      } catch {
        /* */
      }
    });

    mapRef.current = map;
    setMapInstance(map);
    // 首帧 idle（瓦片就绪、视野稳定）后淡入，隐藏初始化期间的 resize/样式抖动
    map.once('idle', () => setMapReady(true));
    const readyFallback = setTimeout(() => setMapReady(true), 1500);

    const raf = requestAnimationFrame(() => {
      try {
        map.resize();
      } catch {
        /* */
      }
    });
    const t1 = setTimeout(() => {
      try {
        map.resize();
      } catch {
        /* */
      }
    }, 400);

    let resizeTimer: ReturnType<typeof setTimeout> | null = null;
    let lastW = 0;
    let lastH = 0;
    const ro = new ResizeObserver(() => {
      const el = containerRef.current;
      if (!el) return;
      const w = Math.round(el.clientWidth);
      const h = Math.round(el.clientHeight);
      // 尺寸未实质变化（<2px）则跳过，断开 ResizeObserver↔resize 高频回环
      if (Math.abs(w - lastW) < 2 && Math.abs(h - lastH) < 2) return;
      lastW = w;
      lastH = h;
      if (resizeTimer) clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        resizeTimer = null;
        requestAnimationFrame(() => {
          try {
            map.resize();
          } catch {
            /* */
          }
        });
      }, 120);
    });
    ro.observe(containerRef.current);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(t1);
      clearTimeout(readyFallback);
      if (resizeTimer) clearTimeout(resizeTimer);
      ro.disconnect();
      map.remove();
      mapRef.current = null;
      setMapInstance(null);
      setMapReady(false);
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    if (!initialSyncDone.current) {
      initialSyncDone.current = true;
      return;
    }
    // 宇宙层回正由 CosmicGlobeAnimator 执行完整 flyTo（含 bearing/pitch）
    if (globeViewResetNonce !== lastGlobeResetNonce.current) {
      lastGlobeResetNonce.current = globeViewResetNonce;
      return;
    }
    if (consumeViewportSyncFromMap(center, zoom)) return;
    const c = map.getCenter();
    const z = map.getZoom();
    if (
      centersEqual([c.lng, c.lat], center) &&
      zoomsEqual(z, zoom)
    ) {
      return;
    }
    map.flyTo({ center, zoom, duration: 800 });
  }, [center, zoom, globeViewResetNonce]);

  // 轨道列表展开时右移可视中心，减轻浮层遮挡
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const padRight =
      activeTier === 'space' && orbitalOpen
        ? Math.min(window.innerWidth * 0.35, 288)
        : 0;
    const apply = () => {
      try {
        map.setPadding({ top: 0, bottom: 0, left: 0, right: padRight });
      } catch {
        /* */
      }
    };
    if (map.isStyleLoaded()) apply();
    else map.once('load', apply);
    map.on('style.load', apply);

    return () => {
      map.off('style.load', apply);
    };
  }, [activeTier, orbitalOpen]);

  // 区域边界高亮
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const SOURCE = 'region-bounds';
    const LAYER = 'region-bounds-line';

    const apply = () => {
      try {
        const data = bounds
          ? buildBoundsRing(bounds)
          : { type: 'FeatureCollection' as const, features: [] };
        const src = map.getSource(SOURCE) as
          | maplibregl.GeoJSONSource
          | undefined;
        if (src) {
          src.setData(data);
          return;
        }
        map.addSource(SOURCE, { type: 'geojson', data });
        map.addLayer({
          id: LAYER,
          type: 'line',
          source: SOURCE,
          paint: {
            'line-color': '#22d3ee',
            'line-width': 1.5,
            'line-dasharray': [3, 2],
            'line-opacity': 0.8,
          },
        });
      } catch {
        /* */
      }
    };

    if (map.isStyleLoaded()) apply();
    else map.once('load', apply);
    map.on('style.load', apply);

    return () => {
      map.off('style.load', apply);
      try {
        const m = mapRef.current;
        if (!m) return;
        if (m.getLayer(LAYER)) m.removeLayer(LAYER);
        if (m.getSource(SOURCE)) m.removeSource(SOURCE);
      } catch {
        /* */
      }
    };
  }, [bounds]);

  return (
    <MapProvider map={mapInstance}>
      {urlStateSync}
      <div className="relative h-full w-full">
        <div
          ref={containerRef}
          className={className}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            opacity: mapReady ? 1 : 0,
            transition: 'opacity 350ms ease',
          }}
        />
        <BasemapController />
        <GlobeController />
        <CosmicGlobeAnimator />
        <OrbitRings />

        {/* 天体探索层（月/火）：始终挂载，内部按 activeBody 门控 */}
        <BodySiteLayer />
        <BodyFeatureLayer />
        <BodyOrbiterLayer />
        <BodyTraverseLayer />

        {/* 地球数据层：仅地球渲染，避免在月/火上泄漏地球事件/标记 */}
        {isEarth && (
          <>
            <BathymetryLayer />
            <LiveWeatherLayer />
            <ConflictZonesLayer />
            <OrbitalObjectsLayer />
            <FlightTrailLayer />
            <FlightLayer />
            <FireLayer />
            <MaritimeLayer />
            <PizzaIndexLayer />
            <ProfilePicker />
            <CrossLayerLinks />
            <DaynightLayer />
            <GeodataLayer />
            <FlowLayer />
            <LivePulseLayer />
            <GeodataFetchIndicator />
            <MapSelectionPulse />
            <MapTooltip />
          </>
        )}
      </div>
    </MapProvider>
  );
}
