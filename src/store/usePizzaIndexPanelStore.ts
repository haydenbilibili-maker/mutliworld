import { create } from 'zustand';

interface PizzaIndexPanelStore {
  open: boolean;
  setOpen: (open: boolean) => void;
  toggle: () => void;
}

export const usePizzaIndexPanelStore = create<PizzaIndexPanelStore>((set) => ({
  open: false,
  setOpen: (open) => set({ open }),
  toggle: () => set((s) => ({ open: !s.open })),
}));
