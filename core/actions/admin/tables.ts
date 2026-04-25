import { fetchGeneral } from '../api/generalActions';

export interface AdminTable {
  id: string;
  name: string;
  capacity: number;
  zoneId: string;
  zone: {
    id: string;
    name: string;
    icon: string;
  };
  status: 'AVAILABLE' | 'OCCUPIED' | 'RESERVED';
}

export interface UpdateTableInput {
  name?: string;
  capacity?: number;
}

export const adminTablesApi = {
  getAll: () => fetchGeneral<AdminTable[]>('admin/tables', 'GET'),

  getById: (id: string) => fetchGeneral<AdminTable>(`admin/tables/${id}`, 'GET'),

  update: (id: string, data: UpdateTableInput) => fetchGeneral<AdminTable>(`admin/tables/${id}`, 'PUT', data),

  updateStatus: (id: string, status: 'AVAILABLE' | 'OCCUPIED' | 'RESERVED') =>
    fetchGeneral<AdminTable>(`admin/tables/${id}/status`, 'PUT', { status }),

  delete: (id: string) => fetchGeneral<void>(`admin/tables/${id}`, 'DELETE'),

  create: (data: { zoneId: string; name: string; capacity: number }) =>
    fetchGeneral<AdminTable>('admin/tables', 'POST', data),

  getByZone: (zoneId: string) => fetchGeneral<AdminTable[]>(`admin/tables/zone/${zoneId}`, 'GET'),
};