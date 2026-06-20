import { create } from 'zustand';

interface LiveStreamStore {
  open: boolean;
  setOpen: (open: boolean) => void;
  toggle: () => void;
}

export const useLiveStreamStore = create<LiveStreamStore>((set) => ({
  open: false,
  setOpen: (open) => set({ open }),
  toggle: () => set((s) => ({ open: !s.open })),
}));
