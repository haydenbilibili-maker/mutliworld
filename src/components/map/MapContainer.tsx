'use client';

import { useRef, useEffect, useState } from 'react';
import maplibregl from 'maplibre-gl';
import { useMapStore } from '@/store/useMapStore';
import { useSyncStateToUrl } from '@/hooks/useSyncStateToUrl';
import { useRegionData } from '@/hooks/useRegionData';
import { DEFAULT_CENTER, DEFAULT_ZOOM } from '@/lib/constants';
import { buildGraticule, buildBoundsRing } from '@/lib/graticule';
import { MapProvider } from '@/context/MapContext';
import { GeodataLayer } from '@/components/map/GeodataLayer';
import { BathymetryLayer } from '@/components/map/BathymetryLayer';
import { GlobeController } from '@/components/map/GlobeController';
import { OrbitRings } from '@/components/map/OrbitRings';

interface MapContainerProps {
  className?: string;
}

export function MapContainer({ className = '' }: MapContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const initialSyncDone = useRef(false);
  const [mapInstance, setMapInstance] = useState<maplibregl.Map | null>(null);
  const { center, zoom, setCenter, setZoom } = useMapStore();
  const { bounds } = useRegionData();

  useSyncStateToUrl();

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
    });
    map.addControl(new maplibregl.NavigationControl(), 'top-right');
    map.on('moveend', () => {
      const c = map.getCenter();
      setCenter([c.lng, c.lat]);
      setZoom(map.getZoom());
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
    const atTarget =
      Math.abs(c.lng - center[0]) < 1e-4 &&
      Math.abs(c.lat - center[1]) < 1e-4 &&
      Math.abs(map.getZoom() - zoom) < 1e-3;
    if (atTarget) return;
    map.flyTo({ center, zoom, duration: 800 });
  }, [center, zoom]);

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
      <div
        ref={containerRef}
        className={className}
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
      />
      <BathymetryLayer />
      <GlobeController />
      <OrbitRings />
      <GeodataLayer />
    </MapProvider>
  );
}
