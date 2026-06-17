'use client';

/**
 * 天体痕迹自定义覆盖 — Phase 5 后台在线编辑
 *
 * 管理后台新增/编辑的天体痕迹存于此（localStorage 持久化），与内置数据合并后实时呈现在地图。
 * 适配无服务端文件持久化的部署（如 Vercel）：浏览器内编辑 + JSON 导出/导入，开发者按需固化进仓库。
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { BodySite } from '@/types/body';

interface BodyOverridesState {
  customSites: BodySite[];
  /** 新增或按 id 覆盖 */
  upsertSite: (site: BodySite) => void;
  removeSite: (id: string) => void;
  replaceAll: (sites: BodySite[]) => void;
  clearAll: () => void;
}

export const useBodyOverridesStore = create<BodyOverridesState>()(
  persist(
    (set) => ({
      customSites: [],
      upsertSite: (site) =>
        set((s) => ({ customSites: [...s.customSites.filter((x) => x.id !== site.id), site] })),
      removeSite: (id) => set((s) => ({ customSites: s.customSites.filter((x) => x.id !== id) })),
      replaceAll: (customSites) => set({ customSites }),
      clearAll: () => set({ customSites: [] }),
    }),
    {
      name: 'omnilens-body-overrides',
      storage: createJSONStorage(() => (typeof window !== 'undefined' ? window.localStorage : undefined as unknown as Storage)),
    },
  ),
);
