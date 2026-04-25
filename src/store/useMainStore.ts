import { create } from 'zustand';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  notes?: string;
  instanceId: string;
}

interface MainStore {
  currentOrder: CartItem[];
  addItem: (item: Omit<CartItem, 'instanceId'>) => void;
  removeItem: (instanceId: string) => void;
  clearOrder: () => void;
}

export const useMainStore = create<MainStore>((set) => ({
  currentOrder: [],
  addItem: (item) =>
    set((state) => ({
      currentOrder: [
        ...state.currentOrder,
        { ...item, instanceId: Math.random().toString(36).substr(2, 9) } as CartItem,
      ],
    })),
  removeItem: (instanceId) =>
    set((state) => ({
      currentOrder: state.currentOrder.filter((i) => i.instanceId !== instanceId),
    })),
  clearOrder: () => set({ currentOrder: [] }),
}));
