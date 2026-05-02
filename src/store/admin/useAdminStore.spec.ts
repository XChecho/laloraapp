/**
 * ============================================================
 * SUITE DE PRUEBAS: useAdminStore (Zustand — Admin)
 * ============================================================
 *
 * QUÉ estamos probando:
 * El store de administración de zonas y mesas. No depende de
 * APIs externas; trabaja con datos locales derivados de MOCK_DB.
 *
 * POR QUÉ importa:
 * La gestión de mesas y zonas es el núcleo operativo del
 * restaurante. Un bug aquí afecta la asignación de órdenes.
 */

import { useAdminStore } from './useAdminStore';
import { MOCK_DB } from '@core/database/mockDb';

describe('useAdminStore', () => {
  beforeEach(() => {
    // Reseteamos el estado a su condición original
    useAdminStore.setState({
      users: [],
      zones: [
        { id: '1', name: 'Salón Principal', icon: 'restaurant-outline', dbKey: 'SALON' },
        { id: '2', name: 'Terraza / Exterior', icon: 'sunny-outline', dbKey: 'TERRAZA' },
      ],
      tables: MOCK_DB.tables.map((t) => ({
        id: t.id.toString(),
        name: t.name,
        zoneId: t.zone === 'SALON' ? '1' : '2',
        status: t.status,
        dbId: t.id,
      })),
      expenses: [],
    });

    jest.clearAllMocks();
  });

  /**
   * ============================================================
   * PRUEBA: Estado inicial carga desde MOCK_DB
   * ============================================================
   *
   * QUÉ estamos probando:
   * Que las mesas iniciales provienen de MOCK_DB y las zonas
   * tienen los valores esperados.
   */
  it('debe cargar zonas y mesas iniciales desde MOCK_DB', () => {
    // Act
    const state = useAdminStore.getState();

    // Assert
    expect(state.zones).toHaveLength(2);
    expect(state.zones[0].name).toBe('Salón Principal');
    expect(state.tables.length).toBe(MOCK_DB.tables.length);
  });

  /**
   * ============================================================
   * PRUEBA: addZone crea una nueva zona
   * ============================================================
   *
   * QUÉ estamos probando:
   * Que addZone agrega una zona al final del array y genera un id.
   */
  it('debe agregar una nueva zona', () => {
    // Arrange
    const nuevaZona = { name: 'Barra', icon: 'wine-outline', dbKey: 'BARRA' };

    // Act
    useAdminStore.getState().addZone(nuevaZona);
    const state = useAdminStore.getState();

    // Assert
    expect(state.zones).toHaveLength(3);
    expect(state.zones[2].name).toBe('Barra');
    expect(state.zones[2].id).toBeDefined();
  });

  /**
   * ============================================================
   * PRUEBA: updateZone modifica el nombre de una zona
   * ============================================================
   */
  it('debe actualizar el nombre de una zona existente', () => {
    // Act
    useAdminStore.getState().updateZone('1', 'Salón VIP');
    const state = useAdminStore.getState();

    // Assert
    expect(state.zones[0].name).toBe('Salón VIP');
    expect(state.zones[1].name).toBe('Terraza / Exterior');
  });

  /**
   * ============================================================
   * PRUEBA: deleteZone elimina zona y sus mesas asociadas
   * ============================================================
   *
   * QUÉ estamos probando:
   * La cascada: al borrar una zona, también se borran las mesas
   * cuyo zoneId coincida.
   *
   * POR QUÉ importa:
   * Evita mesas huérfanas sin zona asignada.
   */
  it('debe eliminar una zona y todas sus mesas asociadas', () => {
    // Arrange
    const mesasSalonAntes = useAdminStore.getState().tables.filter((t) => t.zoneId === '1').length;
    expect(mesasSalonAntes).toBeGreaterThan(0);

    // Act
    useAdminStore.getState().deleteZone('1');
    const state = useAdminStore.getState();

    // Assert
    expect(state.zones.find((z) => z.id === '1')).toBeUndefined();
    expect(state.tables.some((t) => t.zoneId === '1')).toBe(false);
  });

  /**
   * ============================================================
   * PRUEBA: addTable agrega una mesa con estado LIBRE
   * ============================================================
   */
  it('debe agregar una nueva mesa con estado LIBRE', () => {
    // Arrange
    const nuevaMesa = { name: 'MESA 99', zoneId: '1' };

    // Act
    useAdminStore.getState().addTable(nuevaMesa);
    const state = useAdminStore.getState();

    // Assert
    const mesaCreada = state.tables.find((t) => t.name === 'MESA 99');
    expect(mesaCreada).toBeDefined();
    expect(mesaCreada?.status).toBe('LIBRE');
  });

  /**
   * ============================================================
   * PRUEBA: deleteTable remueve una mesa específica
   * ============================================================
   */
  it('debe eliminar una mesa por su id', () => {
    // Arrange
    const mesaId = useAdminStore.getState().tables[0].id;

    // Act
    useAdminStore.getState().deleteTable(mesaId);
    const state = useAdminStore.getState();

    // Assert
    expect(state.tables.find((t) => t.id === mesaId)).toBeUndefined();
  });
});
