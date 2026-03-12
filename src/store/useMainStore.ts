import { create } from 'zustand';
import { OrderItem } from '@core/database/mockDb';

interface MainStore {
  currentOrder: OrderItem[];
  addItem: (item: Omit<OrderItem, 'instanceId'>) => void;
  removeItem: (instanceId: string) => void;
  clearOrder: () => void;
}

export const useMainStore = create<MainStore>((set) => ({
  currentOrder: [],
  addItem: (item) =>
    set((state) => ({
      currentOrder: [
        ...state.currentOrder,
        { ...item, instanceId: Math.random().toString(36).substr(2, 9) } as OrderItem,
      ],
    })),
  removeItem: (instanceId) =>
    set((state) => ({
      currentOrder: state.currentOrder.filter((i) => i.instanceId !== instanceId),
    })),
  clearOrder: () => set({ currentOrder: [] }),
}));
