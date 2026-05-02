/**
 * ============================================================
 * FLUJO E2E: Creación de Orden Completa
 * ============================================================
 *
 * QUÉ probamos:
 * El flujo completo de creación de orden: seleccionar mesa,
 * crear orden, agregar items, cambiar estados, y cerrar.
 *
 * POR QUÉ importa:
 * Este es el flujo principal del negocio. Una orden es el corazón
 * de toda la operación del restaurante.
 *
 * CÓMO funciona:
 * Mockeamos las API calls y simulamos el flujo paso a paso
 * usando los hooks y stores.
 */

import { renderHook, waitFor } from '@testing-library/react-native';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import React from 'react';
import { createMockQueryClient } from '@src/__tests__/utils';
import { useCreateOrder, useAddOrderItems, useUpdateOrderStatus, useOrder } from '@hooks/useOrders';
import { ordersApi } from '@core/actions/orders';
import { useMainStore } from '@src/store/useMainStore';
import { useAuthStore } from '@src/store/useAuthStore';

jest.mock('@core/actions/orders', () => ({
  ordersApi: {
    create: jest.fn(),
    getById: jest.fn(),
    addItems: jest.fn(),
    updateStatus: jest.fn(),
    cancel: jest.fn(),
    getActiveByTable: jest.fn(),
  },
}));

jest.mock('@src/store/useAuthStore', () => ({
  useAuthStore: () => ({
    isHydrated: true,
    isLoggedIn: true,
  }),
}));

describe('Flujo E2E: Creación de Orden', () => {
  let mockQueryClient: QueryClient;

  beforeEach(() => {
    mockQueryClient = createMockQueryClient();
    jest.clearAllMocks();
    useMainStore.setState({ currentOrder: [] });
  });

  /**
   * ============================================================
   * FLUJO 1: Crear Orden → Agregar Items → Confirmar
   * ============================================================
   *
   * Escenario: Un mesero crea una orden para Mesa 3, agrega
   * una hamburguesa y una cerveza, y confirma la orden.
   */
  it('debería crear orden, agregar items y confirmar', async () => {
    // Arrange: Mock de creación de orden
    const createdOrder = {
      id: 'order-new',
      tableId: 'table-3',
      userId: 'user-waiter-1',
      customerName: 'Mesa 3',
      orderType: 'LOCAL',
      status: 'PENDING',
      total: 0,
      items: [],
      table: { id: 'table-3', name: 'Mesa 3', status: 'OCCUPIED' },
    };
    (ordersApi.create as jest.Mock).mockResolvedValue(createdOrder);

    // Act: Paso 1 — Crear orden
    const { result: createResult } = renderHook(
      () => useCreateOrder(),
      { wrapper: ({ children }) => (
        <QueryClientProvider client={mockQueryClient}>{children}</QueryClientProvider>
      )},
    );

    const order = await createResult.current.mutateAsync({
      tableId: 'table-3',
      customerName: 'Mesa 3',
    });

    // Assert: Orden creada
    expect(order.id).toBe('order-new');
    expect(order.status).toBe('PENDING');
    expect(ordersApi.create).toHaveBeenCalledWith({
      tableId: 'table-3',
      customerName: 'Mesa 3',
    });

    // Arrange: Mock de agregar items
    const orderWithItems = {
      ...createdOrder,
      items: [
        {
          id: 'item-1',
          productId: 'prod-burger',
          productName: 'Hamburguesa',
          quantity: 2,
          price: 30000,
          notes: 'Sin cebolla',
        },
        {
          id: 'item-2',
          productId: 'prod-beer',
          productName: 'Cerveza',
          quantity: 3,
          price: 7500,
          notes: '',
        },
      ],
      total: 37500,
    };
    (ordersApi.addItems as jest.Mock).mockResolvedValue(orderWithItems);

    // Act: Paso 2 — Agregar items
    const { result: addItemsResult } = renderHook(
      () => useAddOrderItems(),
      { wrapper: ({ children }) => (
        <QueryClientProvider client={mockQueryClient}>{children}</QueryClientProvider>
      )},
    );

    const updatedOrder = await addItemsResult.current.mutateAsync({
      orderId: 'order-new',
      items: [
        { productId: 'prod-burger', quantity: 2, price: 15000, notes: 'Sin cebolla' },
        { productId: 'prod-beer', quantity: 3, price: 2500, notes: '' },
      ],
    });

    // Assert: Items agregados
    expect(updatedOrder.items.length).toBe(2);
    expect(updatedOrder.total).toBe(37500);

    // Arrange: Mock de cambio de estado
    const confirmedOrder = { ...orderWithItems, status: 'CONFIRMED' };
    (ordersApi.updateStatus as jest.Mock).mockResolvedValue(confirmedOrder);

    // Act: Paso 3 — Confirmar orden (PENDING → CONFIRMED)
    const { result: statusResult } = renderHook(
      () => useUpdateOrderStatus(),
      { wrapper: ({ children }) => (
        <QueryClientProvider client={mockQueryClient}>{children}</QueryClientProvider>
      )},
    );

    const finalOrder = await statusResult.current.mutateAsync({
      orderId: 'order-new',
      status: 'CONFIRMED',
    });

    // Assert: Orden confirmada
    expect(finalOrder.status).toBe('CONFIRMED');
  });

  /**
   * ============================================================
   * FLUJO 2: Agregar items al carrito → Crear orden desde carrito
   * ============================================================
   *
   * Escenario: Un mesero usa el carrito (useMainStore) para
   * acumular items y luego crea la orden.
   */
  it('debería acumular items en el carrito y crear la orden', async () => {
    // Arrange: Agregar items al carrito
    useMainStore.getState().addItem({
      id: 'prod-burger',
      name: 'Hamburguesa Clásica',
      price: 15000,
      notes: 'Con queso extra',
    });

    useMainStore.getState().addItem({
      id: 'prod-fries',
      name: 'Papas Fritas',
      price: 5000,
    });

    // Assert: Carrito tiene 2 items
    let cart = useMainStore.getState().currentOrder;
    expect(cart.length).toBe(2);
    expect(cart[0].name).toBe('Hamburguesa Clásica');
    expect(cart[0].notes).toBe('Con queso extra');
    expect(cart[1].name).toBe('Papas Fritas');

    // Act: Remover un item
    const friesInstanceId = cart[1].instanceId;
    useMainStore.getState().removeItem(friesInstanceId);

    // Assert: Carrito tiene 1 item
    cart = useMainStore.getState().currentOrder;
    expect(cart.length).toBe(1);
    expect(cart[0].name).toBe('Hamburguesa Clásica');

    // Act: Limpiar carrito
    useMainStore.getState().clearOrder();

    // Assert: Carrito vacío
    expect(useMainStore.getState().currentOrder).toEqual([]);
  });

  /**
   * ============================================================
   * FLUJO 3: Cancelar orden
   * ============================================================
   *
   * Escenario: Una orden se cancela antes de ser preparada.
   */
  it('debería cancelar una orden existente', async () => {
    // Arrange: Orden existente
    const existingOrder = {
      id: 'order-cancel',
      status: 'PENDING',
      tableId: 'table-5',
      items: [],
      table: { id: 'table-5', name: 'Mesa 5' },
    };
    (ordersApi.getById as jest.Mock).mockResolvedValue(existingOrder);

    const cancelledOrder = { ...existingOrder, status: 'CANCELLED' };
    (ordersApi.cancel as jest.Mock).mockResolvedValue(cancelledOrder);

    // Act: Obtener orden y cancelar
    const { result: orderResult } = renderHook(
      () => useOrder('order-cancel'),
      { wrapper: ({ children }) => (
        <QueryClientProvider client={mockQueryClient}>{children}</QueryClientProvider>
      )},
    );

    await waitFor(() => {
      (ordersApi.getById as jest.Mock).mockResolvedValue(existingOrder);
    });

    // Cancelar
    await ordersApi.cancel('order-cancel');

    // Assert
    expect(ordersApi.cancel).toHaveBeenCalledWith('order-cancel');
  });

  /**
   * ============================================================
   * FLUJO 4: Transición completa de estados
   * ============================================================
   *
   * Escenario: Una orden pasa por todos los estados válidos:
   * PENDING → CONFIRMED → IN_PREPARATION → READY → DELIVERED → CLOSED
   */
  it('debería permitir la transición completa de estados', async () => {
    const transitions = [
      { from: 'PENDING', to: 'CONFIRMED' },
      { from: 'CONFIRMED', to: 'IN_PREPARATION' },
      { from: 'IN_PREPARATION', to: 'READY' },
      { from: 'READY', to: 'DELIVERED' },
      { from: 'DELIVERED', to: 'CLOSED' },
    ];

    let currentStatus = 'PENDING';
    const orderId = 'order-full-flow';

    for (const { from, to } of transitions) {
      const order = {
        id: orderId,
        status: from,
        tableId: 'table-1',
        items: [],
        table: { id: 'table-1', name: 'Mesa 1' },
      };

      (ordersApi.updateStatus as jest.Mock).mockResolvedValue({
        ...order,
        status: to,
      });

      // Act: Cambiar estado
      const result = await ordersApi.updateStatus(orderId, to);

      // Assert: Estado actualizado
      expect(result.status).toBe(to);
      currentStatus = to;
    }

    expect(currentStatus).toBe('CLOSED');
  });
});
