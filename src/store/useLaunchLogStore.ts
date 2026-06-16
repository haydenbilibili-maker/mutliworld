import { create } from 'zustand';

interface LaunchLogStore {
  open: boolean;
  setOpen: (open: boolean) => void;
  toggle: () => void;
}

export const useLaunchLogStore = create<LaunchLogStore>((set) => ({
  open: false,
  setOpen: (open) => set({ open }),
  toggle: () => set((s) => ({ open: !s.open })),
}));
