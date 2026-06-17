'use client';

import { create } from 'zustand';

interface BrandState {
  aboutOpen: boolean;
  setAboutOpen: (v: boolean) => void;
}

/** 「关于 / 致敬」面板开关 */
export const useBrandStore = create<BrandState>((set) => ({
  aboutOpen: false,
  setAboutOpen: (aboutOpen) => set({ aboutOpen }),
}));
