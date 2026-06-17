'use client';

import { create } from 'zustand';
import type { BodyLayerId } from '@/types/body';
import { BODY_LAYER_META } from '@/bodies/sites';

const ALL_BODY_LAYERS = BODY_LAYER_META.map((m) => m.id);

interface BodyLayerState {
  /** 已开启的天体探索图层（默认全开，展示全部痕迹） */
  activeBodyLayers: BodyLayerId[];
  toggleBodyLayer: (id: BodyLayerId) => void;
  setBodyLayers: (ids: BodyLayerId[]) => void;
  /** 天体百科面板开关 */
  knowledgeOpen: boolean;
  setKnowledgeOpen: (v: boolean) => void;
}

export const useBodyStore = create<BodyLayerState>((set) => ({
  activeBodyLayers: [...ALL_BODY_LAYERS],
  toggleBodyLayer: (id) =>
    set((s) => ({
      activeBodyLayers: s.activeBodyLayers.includes(id)
        ? s.activeBodyLayers.filter((x) => x !== id)
        : [...s.activeBodyLayers, id],
    })),
  setBodyLayers: (activeBodyLayers) => set({ activeBodyLayers }),
  knowledgeOpen: false,
  setKnowledgeOpen: (knowledgeOpen) => set({ knowledgeOpen }),
}));
