/**
 * ============================================================
 * SUITE DE PRUEBAS: useMainStore (Zustand — Carrito)
 * ============================================================
 *
 * QUÉ estamos probando:
 * El store del carrito de compras que maneja agregar, remover
 * y limpiar items de la orden actual.
 *
 * POR QUÉ importa:
 * El carrito es el núcleo de la experiencia de pedido. Un bug
 * aquí significa órdenes incorrectas o items perdidos.
 */

import { useMainStore } from './useMainStore';

describe('useMainStore', () => {
  beforeEach(() => {
    // Reseteamos el carrito a su estado vacío antes de cada prueba
    useMainStore.setState({ currentOrder: [] });
    jest.clearAllMocks();
  });

  /**
   * ============================================================
   * PRUEBA: Estado inicial — carrito vacío
   * ============================================================
   *
   * QUÉ estamos probando:
   * Que el store comienza con currentOrder como un array vacío.
   *
   * POR QUÉ importa:
   * Garantiza que no hay items residuales de sesiones anteriores.
   */
  it('debe iniciar con el carrito vacío', () => {
    // Arrange: el beforeEach ya reseteó el estado
    // Act
    const state = useMainStore.getState();

    // Assert
    expect(state.currentOrder).toEqual([]);
    expect(state.currentOrder).toHaveLength(0);
  });

  /**
   * ============================================================
   * PRUEBA: Agregar un item al carrito
   * ============================================================
   *
   * QUÉ estamos probando:
   * Que addItem agrega el item y genera un instanceId único
   * automáticamente.
   *
   * POR QUÉ importa:
   * El instanceId es necesario para poder remover items individuales
   * (especialmente cuando hay duplicados del mismo producto).
   */
  it('debe agregar un item con instanceId auto-generado', () => {
    // Arrange
    const newItem = {
      id: 'r1',
      name: 'Churrasco',
      price: 45000,
      notes: 'Término 3/4',
    };

    // Act
    useMainStore.getState().addItem(newItem);
    const state = useMainStore.getState();

    // Assert
    expect(state.currentOrder).toHaveLength(1);
    expect(state.currentOrder[0].id).toBe('r1');
    expect(state.currentOrder[0].name).toBe('Churrasco');
    expect(state.currentOrder[0].price).toBe(45000);
    expect(state.currentOrder[0].instanceId).toBeDefined();
    expect(typeof state.currentOrder[0].instanceId).toBe('string');
    expect(state.currentOrder[0].instanceId.length).toBeGreaterThan(0);
  });

  /**
   * ============================================================
   * PRUEBA: Agregar múltiples items al carrito
   * ============================================================
   *
   * QUÉ estamos probando:
   * Que se pueden agregar varios items y cada uno recibe su
   * propio instanceId único.
   *
   * POR QUÉ importa:
   * Los usuarios agregan múltiples productos a una orden; cada
   * uno debe ser identificable individualmente.
   */
  it('debe agregar múltiples items con instanceIds únicos', () => {
    // Arrange
    const item1 = { id: 'r1', name: 'Churrasco', price: 45000 };
    const item2 = { id: 'b3', name: 'Cerveza Club Colombia', price: 6000 };
    const item3 = { id: 'e1', name: 'Patacón con Chicharrón', price: 15000 };

    // Act
    useMainStore.getState().addItem(item1);
    useMainStore.getState().addItem(item2);
    useMainStore.getState().addItem(item3);
    const state = useMainStore.getState();

    // Assert
    expect(state.currentOrder).toHaveLength(3);

    // Cada item tiene su instanceId único
    const instanceIds = state.currentOrder.map((i) => i.instanceId);
    const uniqueIds = new Set(instanceIds);
    expect(uniqueIds.size).toBe(3);

    // Verificar que los items están en el orden correcto
    expect(state.currentOrder[0].name).toBe('Churrasco');
    expect(state.currentOrder[1].name).toBe('Cerveza Club Colombia');
    expect(state.currentOrder[2].name).toBe('Patacón con Chicharrón');
  });

  /**
   * ============================================================
   * PRUEBA: Remover un item por instanceId
   * ============================================================
   *
   * QUÉ estamos probando:
   * Que removeItem filtra correctamente el item con el instanceId
   * dado, dejando los demás intactos.
   *
   * POR QUÉ importa:
   * Los usuarios deben poder cancelar items individuales sin
   * afectar el resto de la orden.
   */
  it('debe remover un item específico por instanceId', () => {
    // Arrange: agregamos 3 items
    useMainStore.getState().addItem({ id: 'r1', name: 'Churrasco', price: 45000 });
    useMainStore.getState().addItem({ id: 'b3', name: 'Cerveza', price: 6000 });
    useMainStore.getState().addItem({ id: 'e1', name: 'Patacón', price: 15000 });

    const stateBefore = useMainStore.getState();
    const itemToRemoveId = stateBefore.currentOrder[1].instanceId; // Cerveza

    // Act
    useMainStore.getState().removeItem(itemToRemoveId);
    const stateAfter = useMainStore.getState();

    // Assert
    expect(stateAfter.currentOrder).toHaveLength(2);
    expect(stateAfter.currentOrder.find((i) => i.instanceId === itemToRemoveId)).toBeUndefined();
    // Los otros items permanecen
    expect(stateAfter.currentOrder.find((i) => i.name === 'Churrasco')).toBeDefined();
    expect(stateAfter.currentOrder.find((i) => i.name === 'Patacón')).toBeDefined();
  });

  /**
   * ============================================================
   * PRUEBA: Limpiar el carrito completo
   * ============================================================
   *
   * QUÉ estamos probando:
   * Que clearOrder vacía completamente el array currentOrder.
   *
   * POR QUÉ importa:
   * Necesario al completar una orden o al cancelar toda la orden.
   */
  it('debe limpiar el carrito completo', () => {
    // Arrange: agregamos items al carrito
    useMainStore.getState().addItem({ id: 'r1', name: 'Churrasco', price: 45000 });
    useMainStore.getState().addItem({ id: 'b3', name: 'Cerveza', price: 6000 });
    expect(useMainStore.getState().currentOrder).toHaveLength(2);

    // Act
    useMainStore.getState().clearOrder();
    const state = useMainStore.getState();

    // Assert
    expect(state.currentOrder).toEqual([]);
    expect(state.currentOrder).toHaveLength(0);
  });

  /**
   * ============================================================
   * PRUEBA: Agregar item con modificadores
   * ============================================================
   *
   * QUÉ estamos probando:
   * Que los modificadores del item se preservan correctamente
   * al agregar al carrito.
   */
  it('debe preservar los modificadores del item', () => {
    // Arrange
    const itemWithModifiers = {
      id: 'r1',
      name: 'Churrasco',
      price: 45000,
      notes: 'Sin cebolla',
      modifiers: [
        { modifierName: 'Término', selectedOption: '3/4', priceExtra: 0, affectsKitchen: true },
        { modifierName: 'Acompañamiento', selectedOption: 'Puré', priceExtra: 3000, affectsKitchen: false },
      ],
    };

    // Act
    useMainStore.getState().addItem(itemWithModifiers);
    const state = useMainStore.getState();

    // Assert
    expect(state.currentOrder[0].modifiers).toHaveLength(2);
    expect(state.currentOrder[0].modifiers?.[0].selectedOption).toBe('3/4');
    expect(state.currentOrder[0].modifiers?.[1].priceExtra).toBe(3000);
  });
});
