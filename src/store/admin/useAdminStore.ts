import { create } from 'zustand';
import { MOCK_DB } from '@core/database/mockDb';

export interface AdminZone {
  id: string;
  name: string;
  icon: string;
  dbKey: 'SALON' | 'TERRAZA' | string; // Map to MOCK_DB zone
}

export interface AdminTable {
  id: string;
  name: string;
  zoneId: string;
  status: 'LIBRE' | 'OCUPADA';
  dbId?: number; // Reference to MOCK_DB table id
}

interface AdminState {
  users: any[];
  zones: AdminZone[];
  tables: AdminTable[];
  categories: any[];
  expenses: any[];
  
  // Zones Actions
  addZone: (zone: Omit<AdminZone, 'id'>) => void;
  updateZone: (id: string, name: string) => void;
  deleteZone: (id: string) => void;
  
  // Tables Actions
  addTable: (table: Omit<AdminTable, 'id' | 'status'>) => void;
  deleteTable: (id: string) => void;
  
  addExpense: (expense: any) => void;
}

// Initial state derived from MOCK_DB to ensure coherence
const initialZones: AdminZone[] = [
  { id: '1', name: 'Salón Principal', icon: 'restaurant-outline', dbKey: 'SALON' },
  { id: '2', name: 'Terraza / Exterior', icon: 'sunny-outline', dbKey: 'TERRAZA' },
];

const initialTables: AdminTable[] = MOCK_DB.tables.map(t => ({
  id: t.id.toString(),
  name: t.name,
  zoneId: t.zone === 'SALON' ? '1' : '2',
  status: t.status,
  dbId: t.id
}));

export const useAdminStore = create<AdminState>((set) => ({
  users: [],
  zones: initialZones,
  tables: initialTables,
  categories: [],
  expenses: [],
  
  addZone: (zone) => set((state) => ({
    zones: [...state.zones, { ...zone, id: Date.now().toString() }]
  })),
  
  updateZone: (id, name) => set((state) => ({
    zones: state.zones.map(z => z.id === id ? { ...z, name } : z)
  })),
  
  deleteZone: (id) => set((state) => ({
    zones: state.zones.filter(z => z.id !== id),
    tables: state.tables.filter(t => t.zoneId !== id)
  })),
  
  addTable: (table) => set((state) => ({
    tables: [...state.tables, { ...table, id: Date.now().toString(), status: 'LIBRE' }]
  })),
  
  deleteTable: (id) => set((state) => ({
    tables: state.tables.filter(t => t.id !== id)
  })),
  
  addExpense: (expense) => set((state) => ({ 
    expenses: [...state.expenses, { ...expense, id: Date.now().toString() }] 
  })),
}));
