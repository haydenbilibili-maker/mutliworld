'use client';

import { createContext, useContext } from 'react';
import type maplibregl from 'maplibre-gl';

const MapContext = createContext<maplibregl.Map | null>(null);

export function MapProvider({
  map,
  children,
}: {
  map: maplibregl.Map | null;
  children: React.ReactNode;
}) {
  return <MapContext.Provider value={map}>{children}</MapContext.Provider>;
}

export function useMapContext(): maplibregl.Map | null {
  return useContext(MapContext);
}
