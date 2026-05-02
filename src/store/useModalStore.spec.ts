/**
 * ============================================================
 * SUITE DE PRUEBAS: useModalStore (Zustand — Modales)
 * ============================================================
 *
 * QUÉ estamos probando:
 * El store de modales que controla qué modal está activo y
 * qué datos se le pasan a cada uno.
 *
 * POR QUÉ importa:
 * Los modales manejan flujos críticos como confirmación de
 * cierre de caja, detalles de orden y acciones destructivas.
 * Un bug aquí podría mostrar datos incorrectos o el modal
 * equivocado.
 */

import { useModalStore } from './useModalStore';

describe('useModalStore', () => {
  beforeEach(() => {
    // Reseteamos el modal a su estado inicial antes de cada prueba
    useModalStore.setState({ activeModal: null, modalData: {} });
    jest.clearAllMocks();
  });

  /**
   * ============================================================
   * PRUEBA: Estado inicial — sin modal activo
   * ============================================================
   *
   * QUÉ estamos probando:
   * Que el store comienza con activeModal en null y modalData
   * como objeto vacío.
   *
   * POR QUÉ importa:
   * Garantiza que no hay modales residuales abiertos al cargar
   * una nueva pantalla.
   */
  it('debe iniciar sin modal activo y con datos vacíos', () => {
    // Arrange: el beforeEach ya reseteó el estado
    // Act
    const state = useModalStore.getState();

    // Assert
    expect(state.activeModal).toBeNull();
    expect(state.modalData).toEqual({});
  });

  /**
   * ============================================================
   * PRUEBA: Abrir modal CASHIER con datos
   * ============================================================
   *
   * QUÉ estamos probando:
   * Que openModal con tipo 'CASHIER' establece el modal activo
   * y pasa los datos de apertura/cierre de caja.
   *
   * POR QUÉ importa:
   * El cierre de caja es una operación financiera crítica que
   * requiere confirmación y datos precisos.
   */
  it('debe abrir el modal CASHIER con datos de tipo', () => {
    // Arrange
    const cashierData = {
      type: 'ABRIR' as const,
      title: 'Abrir Caja',
      message: '¿Desea abrir la caja para el turno actual?',
    };

    // Act
    useModalStore.getState().openModal('CASHIER', cashierData);
    const state = useModalStore.getState();

    // Assert
    expect(state.activeModal).toBe('CASHIER');
    expect(state.modalData.type).toBe('ABRIR');
    expect(state.modalData.title).toBe('Abrir Caja');
    expect(state.modalData.message).toBe('¿Desea abrir la caja para el turno actual?');
  });

  /**
   * ============================================================
   * PRUEBA: Abrir modal CONFIRMATION con onConfirm
   * ============================================================
   *
   * QUÉ estamos probando:
   * Que openModal con tipo 'CONFIRMATION' pasa correctamente
   * la función onConfirm para acciones destructivas.
   *
   * POR QUÉ importa:
   * Las confirmaciones previenen acciones accidentales como
   * eliminar productos o cancelar órdenes.
   */
  it('debe abrir el modal CONFIRMATION con callback onConfirm', () => {
    // Arrange
    const confirmCallback = jest.fn();
    const confirmationData = {
      title: 'Eliminar producto',
      message: '¿Está seguro de eliminar este producto?',
      onConfirm: confirmCallback,
    };

    // Act
    useModalStore.getState().openModal('CONFIRMATION', confirmationData);
    const state = useModalStore.getState();

    // Assert
    expect(state.activeModal).toBe('CONFIRMATION');
    expect(state.modalData.title).toBe('Eliminar producto');
    expect(state.modalData.message).toBe('¿Está seguro de eliminar este producto?');
    expect(state.modalData.onConfirm).toBe(confirmCallback);

    // Verificar que el callback es ejecutable
    state.modalData.onConfirm?.();
    expect(confirmCallback).toHaveBeenCalledTimes(1);
  });

  /**
   * ============================================================
   * PRUEBA: Abrir modal ORDER_DETAILS
   * ============================================================
   *
   * QUÉ estamos probando:
   * Que openModal con tipo 'ORDER_DETAILS' establece el modal
   * correcto con datos de la orden.
   *
   * POR QUÉ importa:
   * Los detalles de orden se muestran frecuentemente para
   * revisión por meseros y cajeros.
   */
  it('debe abrir el modal ORDER_DETAILS con datos de la orden', () => {
    // Arrange
    const orderDetailsData = {
      tableId: 5,
      title: 'Mesa 05',
      orderId: 'ord-123',
    };

    // Act
    useModalStore.getState().openModal('ORDER_DETAILS', orderDetailsData);
    const state = useModalStore.getState();

    // Assert
    expect(state.activeModal).toBe('ORDER_DETAILS');
    expect(state.modalData.tableId).toBe(5);
    expect(state.modalData.title).toBe('Mesa 05');
    expect(state.modalData.orderId).toBe('ord-123');
  });

  /**
   * ============================================================
   * PRUEBA: Cerrar modal limpia todo
   * ============================================================
   *
   * QUÉ estamos probando:
   * Que closeModal resetea activeModal a null y modalData a
   * objeto vacío.
   *
   * POR QUÉ importa:
   * Al cerrar un modal, no deben quedar datos residuales que
   * puedan filtrarse al siguiente modal que se abra.
   */
  it('debe cerrar el modal y limpiar todos los datos', () => {
    // Arrange: abrimos un modal con datos
    useModalStore.getState().openModal('CASHIER', {
      type: 'CERRAR',
      title: 'Cerrar Caja',
      tableId: 3,
    });
    expect(useModalStore.getState().activeModal).toBe('CASHIER');

    // Act
    useModalStore.getState().closeModal();
    const state = useModalStore.getState();

    // Assert
    expect(state.activeModal).toBeNull();
    expect(state.modalData).toEqual({});
  });

  /**
   * ============================================================
   * PRUEBA: Abrir modal diferente mientras otro está abierto
   * ============================================================
   *
   * QUÉ estamos probando:
   * Que al abrir un nuevo modal mientras hay uno activo, el
   * anterior se reemplaza completamente (tipo y datos).
   *
   * POR QUÉ importa:
   * Previene que datos del modal anterior se filtren al nuevo
   * modal, lo cual podría causar comportamientos incorrectos.
   */
  it('debe reemplazar un modal abierto con uno diferente', () => {
    // Arrange: abrimos un modal CASHIER
    useModalStore.getState().openModal('CASHIER', {
      type: 'ABRIR',
      title: 'Abrir Caja',
    });
    expect(useModalStore.getState().activeModal).toBe('CASHIER');

    // Act: abrimos un modal CONFIRMATION encima
    const confirmCallback = jest.fn();
    useModalStore.getState().openModal('CONFIRMATION', {
      title: 'Confirmar acción',
      onConfirm: confirmCallback,
    });
    const state = useModalStore.getState();

    // Assert
    expect(state.activeModal).toBe('CONFIRMATION');
    expect(state.modalData.title).toBe('Confirmar acción');
    expect(state.modalData.onConfirm).toBe(confirmCallback);
    // Los datos del modal anterior NO deben persistir
    expect(state.modalData.type).toBeUndefined();
  });

  /**
   * ============================================================
   * PRUEBA: Abrir modal sin datos
   * ============================================================
   *
   * QUÉ estamos probando:
   * Que openModal sin segundo parámetro establece modalData
   * como objeto vacío por defecto.
   */
  it('debe abrir un modal sin datos usando el valor por defecto', () => {
    // Act
    useModalStore.getState().openModal('ORDER_DETAILS');
    const state = useModalStore.getState();

    // Assert
    expect(state.activeModal).toBe('ORDER_DETAILS');
    expect(state.modalData).toEqual({});
  });
});
