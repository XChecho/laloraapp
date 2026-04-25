import { fetchGeneral } from '../api/generalActions';

export interface ZoneWithTables {
  id: string;
  name: string;
  icon: string;
  tables: TableData[];
  _count?: { tables: number };
}

export interface TableData {
  id: string;
  name: string;
  capacity: number;
  zoneId: string;
  status: 'AVAILABLE' | 'OCCUPIED' | 'RESERVED';
}

export interface CreateZoneInput {
  name: string;
  icon?: string;
}

export interface UpdateZoneInput {
  name?: string;
  icon?: string;
}

export interface AddTablesInput {
  quantity: number;
}

export interface UpdateTableInput {
  name?: string;
  capacity?: number;
}

export const adminZonesApi = {
  getAll: () => fetchGeneral<ZoneWithTables[]>('admin/zones', 'GET'),

  getById: (id: string) => fetchGeneral<ZoneWithTables>(`admin/zones/${id}`, 'GET'),

  create: (data: CreateZoneInput) => fetchGeneral<ZoneWithTables>('admin/zones', 'POST', data),

  update: (id: string, data: UpdateZoneInput) => fetchGeneral<ZoneWithTables>(`admin/zones/${id}`, 'PUT', data),

  delete: (id: string) => fetchGeneral<void>(`admin/zones/${id}`, 'DELETE'),

  addTables: (id: string, data: AddTablesInput) => 
    fetchGeneral<ZoneWithTables>(`admin/zones/${id}/tables`, 'POST', data),

  addTable: (id: string, data?: UpdateTableInput) => 
    fetchGeneral<TableData>(`admin/zones/${id}/table`, 'POST', data),

  removeTable: (zoneId: string, tableId: string) => 
    fetchGeneral<void>(`admin/zones/${zoneId}/tables/${tableId}`, 'DELETE'),

  updateTableStatus: (zoneId: string, tableId: string, status: 'AVAILABLE' | 'OCCUPIED' | 'RESERVED') =>
    fetchGeneral<TableData>(`admin/zones/${zoneId}/tables/${tableId}/status`, 'PUT', { status }),
};