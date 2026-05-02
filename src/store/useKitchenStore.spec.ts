/**
 * ============================================================
 * SUITE DE PRUEBAS: useKitchenStore (Zustand — Cocina)
 * ============================================================
 *
 * QUÉ estamos probando:
 * El store de cocina que maneja las órdenes activas y el flujo
 * de preparación de items (carta, sopas de almuerzo, bandejas).
 *
 * POR QUÉ importa:
 * La cocina depende de este store para saber qué preparar y
 * cuándo una orden está lista para servir. Un bug aquí causaría
 * órdenes incompletas o items olvidados.
 *
 * NOTA: Las órdenes mock se definen localmente para poder
 * resetear el estado en cada test, ya que MOCK_ORDERS no se
 * exporta desde el store.
 */

import { useKitchenStore } from './useKitchenStore';
import type { KitchenOrder } from './useKitchenStore';

/**
 * Helper para crear órdenes mock frescas para cada test.
 * Esto evita contaminación de estado entre pruebas.
 */
function createMockOrders(): KitchenOrder[] {
  const now = new Date();
  const twentyFiveMinsAgo = new Date(now.getTime() - 25 * 60 * 1000).toISOString();
  const tenMinsAgo = new Date(now.getTime() - 10 * 60 * 1000).toISOString();
  const justNow = new Date(now.getTime() - 2 * 60 * 1000).toISOString();

  return [
    {
      id: 'o1',
      tableId: 1,
      tableName: 'Mesa 01',
      type: 'MESA',
      status: 'ACTIVE',
      requestedAt: twentyFiveMinsAgo,
      items: [
        {
          id: 'r1',
          instanceId: 'i1',
          name: 'Churrasco',
          category: 'carta',
          subcategory: 'Res',
          price: 45000,
          isAvailable: true,
          term: '3/4',
          status: 'PENDING',
        },
        {
          id: 'l1',
          instanceId: 'i2',
          name: 'Mondongo',
          category: 'almuerzo',
          price: 23000,
          isAvailable: true,
          requiresLunchFlow: true,
          protein: 'Res Asada',
          status: 'PENDING',
          sopaStatus: 'PENDING',
          bandejaStatus: 'PENDING',
        },
      ],
    },
    {
      id: 'o2',
      type: 'LLEVAR',
      status: 'ACTIVE',
      requestedAt: tenMinsAgo,
      items: [
        {
          id: 'c2',
          instanceId: 'i3',
          name: 'Cerdo en Salsa',
          category: 'carta',
          subcategory: 'Cerdo',
          price: 42000,
          isAvailable: true,
          requiresSauce: true,
          sauce: 'Piña',
          notes: 'Sin ensalada - Ver en Rojo',
          status: 'PENDING',
        },
      ],
    },
    {
      id: 'o3',
      tableId: 5,
      tableName: 'Mesa 05',
      type: 'MESA',
      status: 'ACTIVE',
      requestedAt: justNow,
      items: [
        {
          id: 'l5',
          instanceId: 'i4',
          name: 'Bandeja (Sin Sopa)',
          category: 'almuerzo',
          price: 19000,
          isAvailable: true,
          requiresLunchFlow: true,
          protein: 'Pollo Asado',
          status: 'PENDING',
          bandejaStatus: 'PENDING',
        },
      ],
    },
  ];
}

describe('useKitchenStore', () => {
  beforeEach(() => {
    // Reseteamos las órdenes a su estado mock original antes de cada prueba
    useKitchenStore.setState({ orders: createMockOrders() });
    jest.clearAllMocks();
  });

  /**
   * ============================================================
   * PRUEBA: Estado inicial tiene órdenes mock
   * ============================================================
   *
   * QUÉ estamos probando:
   * Que el store comienza con 3 órdenes mock precargadas,
   * cada una con su estructura de items.
   *
   * POR QUÉ importa:
   * Las órdenes mock permiten desarrollar y probar la UI de
   * cocina sin necesidad del backend.
   */
  it('debe iniciar con 3 órdenes mock precargadas', () => {
    // Arrange: el beforeEach ya reseteó el estado
    // Act
    const state = useKitchenStore.getState();

    // Assert
    expect(state.orders).toHaveLength(3);

    // Verificar estructura de cada orden
    expect(state.orders[0].id).toBe('o1');
    expect(state.orders[0].tableId).toBe(1);
    expect(state.orders[0].tableName).toBe('Mesa 01');
    expect(state.orders[0].type).toBe('MESA');
    expect(state.orders[0].items).toHaveLength(2);

    expect(state.orders[1].id).toBe('o2');
    expect(state.orders[1].type).toBe('LLEVAR');
    expect(state.orders[1].items).toHaveLength(1);

    expect(state.orders[2].id).toBe('o3');
    expect(state.orders[2].tableId).toBe(5);
    expect(state.orders[2].items).toHaveLength(1);
  });

  /**
   * ============================================================
   * PRUEBA: Marcar item de carta como READY
   * ============================================================
   *
   * QUÉ estamos probando:
   * Que markItemReady cambia el status de un item de carta
   * de PENDING a READY.
   *
   * POR QUÉ importa:
   * Es el flujo básico de cocina: cuando un plato de carta
   * está listo, se marca para notificar al mesero.
   */
  it('debe marcar un item de carta como READY', () => {
    // Arrange: verificamos que el item está PENDING
    const stateBefore = useKitchenStore.getState();
    const churrasco = stateBefore.orders[0].items.find((i) => i.instanceId === 'i1');
    expect(churrasco?.status).toBe('PENDING');

    // Act: marcamos el Churrasco como listo
    useKitchenStore.getState().markItemReady('o1', 'i1');
    const stateAfter = useKitchenStore.getState();

    // Assert
    const churrascoAfter = stateAfter.orders[0].items.find((i) => i.instanceId === 'i1');
    expect(churrascoAfter?.status).toBe('READY');

    // La orden sigue ACTIVE porque no todos los items están listos
    expect(stateAfter.orders[0].status).toBe('ACTIVE');
  });

  /**
   * ============================================================
   * PRUEBA: Marcar sopa de almuerzo como READY
   * ============================================================
   *
   * QUÉ estamos probando:
   * Que markSopaReady cambia sopaStatus a READY en un item
   * de almuerzo con lunch flow.
   *
   * POR QUÉ importa:
   * El flujo de almuerzo tiene 2 partes (sopa + bandeja) que
   * se preparan independientemente.
   */
  it('debe marcar la sopa de un almuerzo como READY', () => {
    // Arrange: verificamos estado inicial del almuerzo
    const stateBefore = useKitchenStore.getState();
    const mondongo = stateBefore.orders[0].items.find((i) => i.instanceId === 'i2');
    expect(mondongo?.sopaStatus).toBe('PENDING');
    expect(mondongo?.bandejaStatus).toBe('PENDING');

    // Act: marcamos la sopa como lista
    useKitchenStore.getState().markSopaReady('o1', 'i2');
    const stateAfter = useKitchenStore.getState();

    // Assert
    const mondongoAfter = stateAfter.orders[0].items.find((i) => i.instanceId === 'i2');
    expect(mondongoAfter?.sopaStatus).toBe('READY');
    // La bandeja sigue pendiente
    expect(mondongoAfter?.bandejaStatus).toBe('PENDING');
    // El status general no cambia porque la bandeja aún no está lista
    expect(mondongoAfter?.status).toBe('PENDING');
  });

  /**
   * ============================================================
   * PRUEBA: Marcar bandeja de almuerzo como READY
   * ============================================================
   *
   * QUÉ estamos probando:
   * Que markBandejaReady cambia bandejaStatus a READY. Si la
   * sopa ya estaba READY (o no aplica), el status del item
   * cambia a READY.
   *
   * POR QUÉ importa:
   * Cuando ambas partes del almuerzo están listas, el plato
   * completo se considera listo para servir.
   */
  it('debe marcar la bandeja de un almuerzo como READY', () => {
    // Arrange: usamos la orden o3 que tiene bandeja sin sopa
    const stateBefore = useKitchenStore.getState();
    const bandejaItem = stateBefore.orders[2].items.find((i) => i.instanceId === 'i4');
    expect(bandejaItem?.bandejaStatus).toBe('PENDING');
    // No tiene sopaStatus (sin sopa)
    expect(bandejaItem?.sopaStatus).toBeUndefined();

    // Act: marcamos la bandeja como lista
    useKitchenStore.getState().markBandejaReady('o3', 'i4');
    const stateAfter = useKitchenStore.getState();

    // Assert
    const bandejaAfter = stateAfter.orders[2].items.find((i) => i.instanceId === 'i4');
    expect(bandejaAfter?.bandejaStatus).toBe('READY');
    // Como no tiene sopa (undefined), al marcar bandeja el item queda READY
    expect(bandejaAfter?.status).toBe('READY');
    // La orden completa también queda READY porque es el único item
    expect(stateAfter.orders[2].status).toBe('READY');
  });

  /**
   * ============================================================
   * PRUEBA: Marcar toda la orden como READY
   * ============================================================
   *
   * QUÉ estamos probando:
   * Que markOrderReady marca todos los items de la orden como
   * READY, incluyendo sopaStatus y bandejaStatus para items
   * de almuerzo.
   *
   * POR QUÉ importa:
   * Permite al chef marcar toda la orden como lista de una vez
   * sin ir item por item.
   */
  it('debe marcar toda la orden como READY (todos los items)', () => {
    // Arrange: verificamos que los items están PENDING
    const stateBefore = useKitchenStore.getState();
    expect(stateBefore.orders[0].status).toBe('ACTIVE');
    expect(stateBefore.orders[0].items[0].status).toBe('PENDING');
    expect(stateBefore.orders[0].items[1].status).toBe('PENDING');

    // Act: marcamos toda la orden o1 como lista
    useKitchenStore.getState().markOrderReady('o1');
    const stateAfter = useKitchenStore.getState();

    // Assert
    const order = stateAfter.orders.find((o) => o.id === 'o1');
    expect(order?.status).toBe('READY');

    // Todos los items deben estar READY
    expect(order?.items[0].status).toBe('READY');
    expect(order?.items[1].status).toBe('READY');

    // Los items de almuerzo deben tener sopa y bandeja READY
    const almuerzoItem = order?.items.find((i) => i.category === 'almuerzo');
    expect(almuerzoItem?.sopaStatus).toBe('READY');
    expect(almuerzoItem?.bandejaStatus).toBe('READY');
  });

  /**
   * ============================================================
   * PRUEBA: completedAt se setea cuando todos los items READY
   * ============================================================
   *
   * QUÉ estamos probando:
   * Que cuando todos los items de una orden alcanzan status
   * READY (vía markItemReady individual), se establece
   * completedAt con la fecha actual.
   *
   * POR QUÉ importa:
   * completedAt permite calcular tiempos de preparación y
   * métricas de eficiencia de cocina.
   */
  it('debe establecer completedAt cuando todos los items están READY', () => {
    // Arrange: la orden o2 tiene un solo item de carta
    const stateBefore = useKitchenStore.getState();
    expect(stateBefore.orders[1].status).toBe('ACTIVE');
    expect(stateBefore.orders[1].completedAt).toBeUndefined();

    // Act: marcamos el único item como READY
    useKitchenStore.getState().markItemReady('o2', 'i3');
    const stateAfter = useKitchenStore.getState();

    // Assert
    const order = stateAfter.orders.find((o) => o.id === 'o2');
    expect(order?.status).toBe('READY');
    expect(order?.completedAt).toBeDefined();
    expect(typeof order?.completedAt).toBe('string');
    // Verificar que es una fecha ISO válida
    expect(new Date(order!.completedAt!).getTime()).not.toBeNaN();
  });

  /**
   * ============================================================
   * PRUEBA: completedAt se setea al marcar orden completa
   * ============================================================
   *
   * QUÉ estamos probando:
   * Que markOrderReady también establece completedAt.
   */
  it('debe establecer completedAt al usar markOrderReady', () => {
    // Arrange
    const stateBefore = useKitchenStore.getState();
    expect(stateBefore.orders[0].completedAt).toBeUndefined();

    // Act
    useKitchenStore.getState().markOrderReady('o1');
    const stateAfter = useKitchenStore.getState();

    // Assert
    const order = stateAfter.orders.find((o) => o.id === 'o1');
    expect(order?.completedAt).toBeDefined();
    expect(new Date(order!.completedAt!).getTime()).not.toBeNaN();
  });

  /**
   * ============================================================
   * PRUEBA: markItemReady no afecta otras órdenes
   * ============================================================
   *
   * QUÉ estamos probando:
   * Que al marcar un item de una orden, las demás órdenes
   * permanecen sin cambios.
   *
   * POR QUÉ importa:
   * Garantiza aislamiento entre órdenes — marcar una orden
   * no debe afectar las demás.
   */
  it('no debe afectar otras órdenes al marcar un item', () => {
    // Arrange
    const stateBefore = useKitchenStore.getState();
    const order2Before = stateBefore.orders.find((o) => o.id === 'o2');
    const order3Before = stateBefore.orders.find((o) => o.id === 'o3');

    // Act: marcamos un item de la orden o1
    useKitchenStore.getState().markItemReady('o1', 'i1');
    const stateAfter = useKitchenStore.getState();

    // Assert: las órdenes o2 y o3 no cambiaron
    const order2After = stateAfter.orders.find((o) => o.id === 'o2');
    const order3After = stateAfter.orders.find((o) => o.id === 'o3');

    expect(order2After?.status).toBe(order2Before?.status);
    expect(order2After?.items[0].status).toBe(order2Before?.items[0].status);
    expect(order3After?.status).toBe(order3Before?.status);
    expect(order3After?.items[0].status).toBe(order3Before?.items[0].status);
  });

  /**
   * ============================================================
   * PRUEBA: Item de almuerzo con sopa y bandeja ambas READY
   * ============================================================
   *
   * QUÉ estamos probando:
   * Que cuando tanto sopaStatus como bandejaStatus están READY,
   * el status general del item cambia a READY.
   */
  it('debe cambiar status del item a READY cuando sopa y bandeja están listas', () => {
    // Arrange: orden o1 con Mondongo (almuerzo con sopa + bandeja)
    const stateBefore = useKitchenStore.getState();
    const mondongo = stateBefore.orders[0].items.find((i) => i.instanceId === 'i2');
    expect(mondongo?.status).toBe('PENDING');

    // Act: marcamos primero la sopa, luego la bandeja
    useKitchenStore.getState().markSopaReady('o1', 'i2');
    useKitchenStore.getState().markBandejaReady('o1', 'i2');
    const stateAfter = useKitchenStore.getState();

    // Assert
    const mondongoAfter = stateAfter.orders[0].items.find((i) => i.instanceId === 'i2');
    expect(mondongoAfter?.sopaStatus).toBe('READY');
    expect(mondongoAfter?.bandejaStatus).toBe('READY');
    expect(mondongoAfter?.status).toBe('READY');
  });
});
