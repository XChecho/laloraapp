import { create } from 'zustand';

type AlertType = 'success' | 'error';

interface AlertData {
  type: AlertType;
  title: string;
  description: string;
}

interface AlertStore {
  alert: AlertData | null;
  showAlert: (data: AlertData) => void;
  hideAlert: () => void;
}

export const useAlertStore = create<AlertStore>((set) => ({
  alert: null,
  showAlert: (data) => set({ alert: data }),
  hideAlert: () => set({ alert: null }),
}));
