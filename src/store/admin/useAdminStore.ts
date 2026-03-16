import { create } from 'zustand';

interface AdminState {
  users: any[];
  spaces: any[];
  categories: any[];
  expenses: any[];
  addExpense: (expense: any) => void;
  // ... more actions
}

export const useAdminStore = create<AdminState>((set) => ({
  users: [],
  spaces: [],
  categories: [],
  expenses: [],
  addExpense: (expense) => set((state) => ({ 
    expenses: [...state.expenses, { ...expense, id: Date.now().toString() }] 
  })),
}));
