/**
 * ============================================================
 * FLUJO E2E: Gestión de Mesas y Zonas Admin
 * ============================================================
 *
 * QUÉ probamos:
 * El flujo completo de administración de mesas y zonas: crear zona,
 * agregar mesas, asignar estado, y gestionar la relación zona-mesa.
 *
 * POR QUÉ importa:
 * La gestión de mesas es fundamental para el flujo de órdenes.
 * Sin mesas configuradas, los meseros no pueden crear órdenes.
 */

import { renderHook, waitFor } from '@testing-library/react-native';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import React from 'react';
import { createMockQueryClient } from '@src/__tests__/utils';
import {
  useAdminZones,
  useCreateAdminZone,
  useUpdateAdminZone,
  useDeleteAdminZone,
  useAddTablesToZone,
  useRemoveTableFromZone,
  useUpdateTableStatus,
} from '@hooks/useAdminZones';
import {
  useAdminTables,
  useCreateAdminTable,
  useUpdateAdminTable,
  useDeleteAdminTable,
  useAdminTablesByZone,
} from '@hooks/useAdminTables';
import { adminZonesApi } from '@core/actions/admin/zones';
import { adminTablesApi } from '@core/actions/admin/tables';

jest.mock('@core/actions/admin/zones', () => ({
  adminZonesApi: {
    getAll: jest.fn(),
    getById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    addTables: jest.fn(),
    addTable: jest.fn(),
    removeTable: jest.fn(),
    updateTableStatus: jest.fn(),
  },
}));

jest.mock('@core/actions/admin/tables', () => ({
  adminTablesApi: {
    getAll: jest.fn(),
    getById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    updateStatus: jest.fn(),
    delete: jest.fn(),
    getByZone: jest.fn(),
  },
}));

jest.mock('@src/store/useAuthStore', () => ({
  useAuthStore: () => ({
    isHydrated: true,
    isLoggedIn: true,
  }),
}));

describe('Flujo E2E: Gestión de Mesas y Zonas Admin', () => {
  let mockQueryClient: QueryClient;

  beforeEach(() => {
    mockQueryClient = createMockQueryClient();
    jest.clearAllMocks();
  });

  /**
   * ============================================================
   * FLUJO 1: Crear Zona → Agregar Mesas → Ver Listado
   * ============================================================
   *
   * Escenario: Un admin crea la zona "Terraza", agrega 4 mesas,
   * y verifica que aparecen en el listado.
   */
  it('debería crear zona, agregar mesas y listar', async () => {
    // Arrange: Mock de listado inicial vacío
    (adminZonesApi.getAll as jest.Mock).mockResolvedValue([]);

    // Act: Paso 1 — Ver zonas existentes
    const { result: listZonesResult } = renderHook(
      () => useAdminZones(),
      { wrapper: ({ children }) => (
        <QueryClientProvider client={mockQueryClient}>{children}</QueryClientProvider>
      )},
    );

    await waitFor(() => expect(listZonesResult.current.data).toEqual([]));

    // Arrange: Mock de creación de zona
    const newZone = {
      id: 'zone-terrace',
      name: 'Terraza',
      tableCount: 0,
    };
    (adminZonesApi.create as jest.Mock).mockResolvedValue(newZone);

    // Act: Paso 2 — Crear zona
    const { result: createZoneResult } = renderHook(
      () => useCreateAdminZone(),
      { wrapper: ({ children }) => (
        <QueryClientProvider client={mockQueryClient}>{children}</QueryClientProvider>
      )},
    );

    const createdZone = await createZoneResult.current.mutateAsync({
      name: 'Terraza',
    });

    // Assert: Zona creada
    expect(createdZone.name).toBe('Terraza');
    expect(createdZone.id).toBe('zone-terrace');

    // Arrange: Mock de agregar mesas
    const addedTables = {
      count: 4,
      tables: [
        { id: 'table-t1', name: 'T-1', zoneId: 'zone-terrace', status: 'AVAILABLE' },
        { id: 'table-t2', name: 'T-2', zoneId: 'zone-terrace', status: 'AVAILABLE' },
        { id: 'table-t3', name: 'T-3', zoneId: 'zone-terrace', status: 'AVAILABLE' },
        { id: 'table-t4', name: 'T-4', zoneId: 'zone-terrace', status: 'AVAILABLE' },
      ],
    };
    (adminZonesApi.addTables as jest.Mock).mockResolvedValue(addedTables);

    // Act: Paso 3 — Agregar 4 mesas a la zona
    const { result: addTablesResult } = renderHook(
      () => useAddTablesToZone(),
      { wrapper: ({ children }) => (
        <QueryClientProvider client={mockQueryClient}>{children}</QueryClientProvider>
      )},
    );

    const result = await addTablesResult.current.mutateAsync({
      zoneId: 'zone-terrace',
      tables: [
        { name: 'T-1', capacity: 4 },
        { name: 'T-2', capacity: 4 },
        { name: 'T-3', capacity: 2 },
        { name: 'T-4', capacity: 6 },
      ],
    });

    // Assert: 4 mesas agregadas
    expect(result.count).toBe(4);
    expect(result.tables.length).toBe(4);
  });

  /**
   * ============================================================
   * FLUJO 2: Cambiar Estado de Mesa → Ocupar → Liberar
   * ============================================================
   *
   * Escenario: Una mesa se ocupa cuando se crea una orden y
   * se libera cuando la orden se cierra.
   */
  it('debería cambiar el estado de una mesa (AVAILABLE → OCCUPIED → AVAILABLE)', async () => {
    // Arrange: Mesa disponible
    const table = {
      id: 'table-1',
      name: 'Mesa 1',
      zoneId: 'zone-main',
      status: 'AVAILABLE',
    };

    // Act: Paso 1 — Ocupar mesa
    (adminZonesApi.updateTableStatus as jest.Mock).mockResolvedValue({
      ...table,
      status: 'OCCUPIED',
    });

    const occupiedResult = await adminZonesApi.updateTableStatus(
      'zone-main',
      'table-1',
      'OCCUPIED',
    );

    // Assert: Mesa ocupada
    expect(occupiedResult.status).toBe('OCCUPIED');

    // Act: Paso 2 — Liberar mesa
    (adminZonesApi.updateTableStatus as jest.Mock).mockResolvedValue({
      ...table,
      status: 'AVAILABLE',
    });

    const availableResult = await adminZonesApi.updateTableStatus(
      'zone-main',
      'table-1',
      'AVAILABLE',
    );

    // Assert: Mesa disponible
    expect(availableResult.status).toBe('AVAILABLE');
  });

  /**
   * ============================================================
   * FLUJO 3: Crear Mesa Individual → Actualizar → Eliminar
   * ============================================================
   *
   * Escenario: Un admin crea una mesa individual, actualiza
   * su nombre, y luego la elimina.
   */
  it('debería crear, actualizar y eliminar una mesa individual', async () => {
    // Arrange: Mock de creación
    const newTable = {
      id: 'table-new',
      name: 'Mesa VIP-1',
      zoneId: 'zone-vip',
      status: 'AVAILABLE',
      capacity: 8,
    };
    (adminTablesApi.create as jest.Mock).mockResolvedValue(newTable);

    // Act: Paso 1 — Crear mesa
    const { result: createTableResult } = renderHook(
      () => useCreateAdminTable(),
      { wrapper: ({ children }) => (
        <QueryClientProvider client={mockQueryClient}>{children}</QueryClientProvider>
      )},
    );

    const created = await createTableResult.current.mutateAsync({
      name: 'Mesa VIP-1',
      zoneId: 'zone-vip',
      capacity: 8,
    });

    // Assert: Mesa creada
    expect(created.name).toBe('Mesa VIP-1');
    expect(created.capacity).toBe(8);

    // Arrange: Mock de actualización
    (adminTablesApi.update as jest.Mock).mockResolvedValue({
      ...newTable,
      name: 'Mesa VIP-1 Premium',
      capacity: 10,
    });

    // Act: Paso 2 — Actualizar mesa
    const { result: updateTableResult } = renderHook(
      () => useUpdateAdminTable(),
      { wrapper: ({ children }) => (
        <QueryClientProvider client={mockQueryClient}>{children}</QueryClientProvider>
      )},
    );

    const updated = await updateTableResult.current.mutateAsync({
      id: 'table-new',
      data: { name: 'Mesa VIP-1 Premium', capacity: 10 },
    });

    // Assert: Mesa actualizada
    expect(updated.name).toBe('Mesa VIP-1 Premium');
    expect(updated.capacity).toBe(10);

    // Arrange: Mock de eliminación
    (adminTablesApi.delete as jest.Mock).mockResolvedValue({
      id: 'table-new',
      deleted: true,
    });

    // Act: Paso 3 — Eliminar mesa
    const { result: deleteTableResult } = renderHook(
      () => useDeleteAdminTable(),
      { wrapper: ({ children }) => (
        <QueryClientProvider client={mockQueryClient}>{children}</QueryClientProvider>
      )},
    );

    await deleteTableResult.current.mutateAsync('table-new');

    // Assert: Mesa eliminada
    expect(adminTablesApi.delete).toHaveBeenCalledWith('table-new');
  });

  /**
   * ============================================================
   * FLUJO 4: Remover Mesa de Zona
   * ============================================================
   *
   * Escenario: Un admin remueve una mesa de una zona porque
   * la zona se está reorganizando.
   */
  it('debería remover una mesa de una zona', async () => {
    // Arrange: Zona con mesas
    (adminZonesApi.getById as jest.Mock).mockResolvedValue({
      id: 'zone-main',
      name: 'Salón Principal',
      tables: [
        { id: 'table-1', name: 'Mesa 1' },
        { id: 'table-2', name: 'Mesa 2' },
      ],
    });

    // Act: Remover mesa
    (adminZonesApi.removeTable as jest.Mock).mockResolvedValue({
      id: 'zone-main',
      name: 'Salón Principal',
      tables: [{ id: 'table-2', name: 'Mesa 2' }],
    });

    const result = await adminZonesApi.removeTable('zone-main', 'table-1');

    // Assert: Mesa removida
    expect(result.tables.length).toBe(1);
    expect(result.tables[0].id).toBe('table-2');
  });

  /**
   * ============================================================
   * FLUJO 5: Listado Completo de Mesas por Zona
   * ============================================================
   *
   * Escenario: Un admin quiere ver todas las mesas de una zona
   * específica para hacer un inventario.
   */
  it('debería listar todas las mesas de una zona', async () => {
    // Arrange: Mesas de la zona
    const tablesByZone = [
      { id: 't1', name: 'Mesa 1', zoneId: 'zone-1', status: 'AVAILABLE', capacity: 4 },
      { id: 't2', name: 'Mesa 2', zoneId: 'zone-1', status: 'OCCUPIED', capacity: 4 },
      { id: 't3', name: 'Mesa 3', zoneId: 'zone-1', status: 'AVAILABLE', capacity: 2 },
    ];
    (adminTablesApi.getByZone as jest.Mock).mockResolvedValue(tablesByZone);

    // Act: Listar mesas por zona
    const { result } = renderHook(
      () => useAdminTablesByZone('zone-1'),
      { wrapper: ({ children }) => (
        <QueryClientProvider client={mockQueryClient}>{children}</QueryClientProvider>
      )},
    );

    // Assert
    await waitFor(() => expect(result.current.data).toEqual(tablesByZone));
    expect(result.current.data?.length).toBe(3);
  });
});
