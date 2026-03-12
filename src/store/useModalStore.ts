import { create } from 'zustand';

type ModalType = 'CASHIER' | 'CONFIRMATION' | 'ORDER_DETAILS' | null;

interface ModalData {
  type?: 'ABRIR' | 'CERRAR';
  title?: string;
  message?: string;
  onConfirm?: () => void;
  tableId?: number;
  [key: string]: any;
}

interface ModalStore {
  activeModal: ModalType;
  modalData: ModalData;
  openModal: (type: ModalType, data?: ModalData) => void;
  closeModal: () => void;
}

export const useModalStore = create<ModalStore>((set) => ({
  activeModal: null,
  modalData: {},
  openModal: (type, data = {}) => set({ activeModal: type, modalData: data }),
  closeModal: () => set({ activeModal: null, modalData: {} }),
}));
