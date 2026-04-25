import { fetchGeneral } from './api/generalActions';

export interface Table {
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

export const tablesApi = {
  getAll: () => fetchGeneral<Table[]>('tables', 'GET'),

  getById: (id: string) => fetchGeneral<Table>(`tables/${id}`, 'GET'),

  getByZone: (zoneId: string) => fetchGeneral<Table[]>(`zones/${zoneId}/tables`, 'GET'),
};