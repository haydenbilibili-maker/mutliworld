'use client';

import { createContext, useContext, useMemo, type ReactNode } from 'react';
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
 *
 * value 经 useMemo 稳定引用：仅在 SWR 返回值（data/error/标志）实质变化时才产生新对象，
 * 否则 Provider 的 value 引用恒定，所有 consumer 不会因无关重渲染而级联刷新。
 */
export function GeodataProvider({ children }: { children: ReactNode }) {
  const geodata = useGeodata();
  const value = useMemo<GeodataContextValue>(
    () => ({
      data: geodata.data,
      meta: geodata.meta,
      isLoading: geodata.isLoading,
      isValidating: geodata.isValidating,
      error: geodata.error,
      mutate: geodata.mutate,
    }),
    [
      geodata.data,
      geodata.meta,
      geodata.isLoading,
      geodata.isValidating,
      geodata.error,
      geodata.mutate,
    ],
  );
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
