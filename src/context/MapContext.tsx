'use client';

import { createContext, useCallback, useContext, useState } from 'react';
import type maplibregl from 'maplibre-gl';

const MapContext = createContext<maplibregl.Map | null>(null);
const MapStyleEpochContext = createContext(0);

export function MapProvider({
  map,
  children,
}: {
  map: maplibregl.Map | null;
  children: React.ReactNode;
}) {
  const [styleEpoch, setStyleEpoch] = useState(0);
  const bumpStyleEpoch = useCallback(() => {
    setStyleEpoch((n) => n + 1);
  }, []);

  return (
    <MapContext.Provider value={map}>
      <MapStyleEpochContext.Provider value={styleEpoch}>
        <MapStyleEpochActionsContext.Provider value={bumpStyleEpoch}>
          {children}
        </MapStyleEpochActionsContext.Provider>
      </MapStyleEpochContext.Provider>
    </MapContext.Provider>
  );
}

const MapStyleEpochActionsContext = createContext<() => void>(() => {});

export function useMapContext(): maplibregl.Map | null {
  return useContext(MapContext);
}

export function useMapStyleEpoch(): number {
  return useContext(MapStyleEpochContext);
}

export function useBumpMapStyleEpoch(): () => void {
  return useContext(MapStyleEpochActionsContext);
}
