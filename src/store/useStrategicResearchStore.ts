'use client';

/**
 * 战略研究半屏抽屉 — 通用状态
 * panelId 标识当前打开的研究主题；activeModuleId 对应该主题内的模块。
 */

import { create } from 'zustand';
import type { StrategicResearchPanelId } from '@/types/strategic-research';
import { getStrategicResearchPanel } from '@/regions/strategic-research/registry';

interface StrategicResearchState {
  panelId: StrategicResearchPanelId | null;
  open: boolean;
  activeModuleId: string;
  openPanel: (panelId: StrategicResearchPanelId, moduleId?: string) => void;
  setOpen: (open: boolean) => void;
  togglePanel: (panelId: StrategicResearchPanelId) => void;
  setActiveModule: (id: string) => void;
  close: () => void;
}

export const useStrategicResearchStore = create<StrategicResearchState>((set, get) => ({
  panelId: null,
  open: false,
  activeModuleId: 'overview',
  openPanel: (panelId, moduleId) => {
    const def = getStrategicResearchPanel(panelId);
    set({
      panelId,
      open: true,
      activeModuleId: moduleId ?? def?.defaultModuleId ?? 'overview',
    });
  },
  setOpen: (open) => set({ open, ...(open ? {} : { panelId: null }) }),
  togglePanel: (panelId) => {
    const { open, panelId: current } = get();
    if (open && current === panelId) {
      set({ open: false, panelId: null });
    } else {
      get().openPanel(panelId);
    }
  },
  setActiveModule: (activeModuleId) => set({ activeModuleId }),
  close: () => set({ open: false, panelId: null }),
}));
