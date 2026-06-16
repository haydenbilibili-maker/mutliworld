'use client';

import { createContext, useContext, type ReactNode } from 'react';
import type { GeodataResponse, GeodataMeta } from '@/types/geo';
import { useGeodata } from '@/hooks/useGeodata';

interface GeodataContextValue {
  data: GeodataResponse | null;
  meta: GeodataMeta | null;
  isLoading: boolean;
  isValidating: boolean;
  error: unknown;
  mutate: () => void;
}

const GeodataContext = createContext<GeodataContextValue | null>(null);

/**
 * GeodataProvider：在应用顶层维护唯一一次 /api/geodata SWR 调用。
 * 子组件通过 useGeodataContext 消费，避免多处独立 useGeodata 重复轮询。
 */
export function GeodataProvider({ children }: { children: ReactNode }) {
  const value = useGeodata();
  return (
    <GeodataContext.Provider value={value}>{children}</GeodataContext.Provider>
  );
}

export function useGeodataContext(): GeodataContextValue {
  const ctx = useContext(GeodataContext);
  if (!ctx) {
    throw new Error('useGeodataContext 必须在 GeodataProvider 内使用');
  }
  return ctx;
}
