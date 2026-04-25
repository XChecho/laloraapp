import { fetchGeneral } from './api/generalActions';

export interface Zone {
  id: string;
  name: string;
  icon: string;
  _count?: { tables: number };
}

export const zonesApi = {
  getAll: () => fetchGeneral<Zone[]>('zones', 'GET'),

  getById: (id: string) => fetchGeneral<Zone>(`zones/${id}`, 'GET'),
};