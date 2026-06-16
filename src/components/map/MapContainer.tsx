'use client';

import { useRef, useEffect, useState, Suspense } from 'react';
import maplibregl from 'maplibre-gl';
import { useMapStore } from '@/store/useMapStore';
import { useOrbitalPanelStore } from '@/store/useOrbitalPanelStore';
import { UrlStateSync } from '@/hooks/useSyncStateToUrl';
import { useRegionData } from '@/hooks/useRegionData';
import { DEFAULT_CENTER, DEFAULT_ZOOM } from '@/lib/constants';
import { centersEqual, isProgrammaticBearingMove, zoomsEqual } from '@/lib/map/viewState';
import { buildGraticule, buildBoundsRing } from '@/lib/graticule';
import { MapProvider } from '@/context/MapContext';
import { GeodataLayer } from '@/components/map/GeodataLayer';
import { BathymetryLayer } from '@/components/map/BathymetryLayer';
import { GlobeController } from '@/components/map/GlobeController';
import { CosmicGlobeAnimator } from '@/components/map/CosmicGlobeAnimator';
import { OrbitRings } from '@/components/map/OrbitRings';
import { OrbitalObjectsLayer } from '@/components/map/OrbitalObjectsLayer';
import { ProfilePicker } from '@/components/map/ProfilePicker';
import { CrossLayerLinks } from '@/components/map/CrossLayerLinks';

interface MapContainerProps {
  className?: string;
}

export function MapContainer({ className = '' }: MapContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const initialSyncDone = useRef(false);
  const [mapInstance, setMapInstance] = useState<maplibregl.Map | null>(null);
  const { center, zoom } = useMapStore();
  const activeTier = useMapStore((s) => s.activeTier);
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
    const style: maplibregl.StyleSpecification = {
      version: 8,
      sources: {
        countries: {
          type: 'vector',
          url: 'https://demotiles.maplibre.org/tiles/tiles.json',
        },
        graticule: { type: 'geojson', data: buildGraticule(20) },
      },
      layers: [
        {
          id: 'background',
          type: 'background',
          paint: { 'background-color': '#0A0E17' },
        },
        {
          id: 'country-fill',
          type: 'fill',
          source: 'countries',
          'source-layer': 'countries',
          paint: { 'fill-color': '#13233f', 'fill-opacity': 0.7 },
        },
        {
          id: 'country-line',
          type: 'line',
          source: 'countries',
          'source-layer': 'countries',
          paint: { 'line-color': '#2d5a8c', 'line-width': 0.6 },
        },
        {
          id: 'graticule-lines',
          type: 'line',
          source: 'graticule',
          paint: {
            'line-color': '#3b6ea5',
            'line-width': 0.5,
            'line-opacity': 0.35,
          },
        },
      ],
    };

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
      // 球面模式下拖拽更接近拨动实体地球（宇宙层暂停时可手动旋转）
      aroundCenter: true,
    });
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

      state.setCenter(nextCenter);
      state.setZoom(z);
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

    const ro = new ResizeObserver(() => {
      try {
        map.resize();
      } catch {
        /* */
      }
    });
    ro.observe(containerRef.current);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(t1);
      ro.disconnect();
      map.remove();
      mapRef.current = null;
      setMapInstance(null);
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    if (!initialSyncDone.current) {
      initialSyncDone.current = true;
      return;
    }
    const c = map.getCenter();
    const z = map.getZoom();
    if (
      centersEqual([c.lng, c.lat], center) &&
      zoomsEqual(z, zoom)
    ) {
      return;
    }
    map.flyTo({ center, zoom, duration: 800 });
  }, [center, zoom]);

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

    return () => {
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
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
        />
        <BathymetryLayer />
        <GlobeController />
        <CosmicGlobeAnimator />
        <OrbitRings />
        <OrbitalObjectsLayer />
        <ProfilePicker />
        <CrossLayerLinks />
        <GeodataLayer />
      </div>
    </MapProvider>
  );
}
