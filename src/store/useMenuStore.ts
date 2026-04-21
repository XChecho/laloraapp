import { create } from 'zustand';

interface MenuState {
  selectedCategoryId: string | null;
  setSelectedCategory: (id: string | null) => void;
}

export const useMenuStore = create<MenuState>((set) => ({
  selectedCategoryId: null,

  setSelectedCategory: (id) => {
    set({ selectedCategoryId: id });
  },
}));