/**
 * ============================================================
 * SUITE DE PRUEBAS: useAlertStore (Zustand — Alertas/Toasts)
 * ============================================================
 *
 * QUÉ estamos probando:
 * El store de alertas que maneja la visualización de toasts
 * de éxito y error en la interfaz.
 *
 * POR QUÉ importa:
 * Las alertas son el feedback visual principal para el usuario.
 * Sin ellas, el usuario no sabe si sus acciones tuvieron éxito
 * o fallaron.
 */

import { useAlertStore } from './useAlertStore';

describe('useAlertStore', () => {
  beforeEach(() => {
    // Reseteamos la alerta a null antes de cada prueba
    useAlertStore.setState({ alert: null });
    jest.clearAllMocks();
  });

  /**
   * ============================================================
   * PRUEBA: Estado inicial — sin alerta activa
   * ============================================================
   *
   * QUÉ estamos probando:
   * Que el store comienza con alert en null, sin ninguna
   * alerta visible.
   *
   * POR QUÉ importa:
   * Garantiza que no hay alertas residuales de operaciones
   * anteriores al cargar la pantalla.
   */
  it('debe iniciar sin alerta activa', () => {
    // Arrange: el beforeEach ya reseteó el estado
    // Act
    const state = useAlertStore.getState();

    // Assert
    expect(state.alert).toBeNull();
  });

  /**
   * ============================================================
   * PRUEBA: Mostrar alerta de éxito
   * ============================================================
   *
   * QUÉ estamos probando:
   * Que showAlert con type 'success' almacena correctamente
   * los datos de la alerta.
   *
   * POR QUÉ importa:
   * Confirma que las operaciones exitosas pueden mostrar
   * feedback visual al usuario.
   */
  it('debe mostrar una alerta de éxito', () => {
    // Arrange
    const successAlert = {
      type: 'success' as const,
      title: 'Orden creada',
      description: 'La orden ha sido enviada a cocina',
    };

    // Act
    useAlertStore.getState().showAlert(successAlert);
    const state = useAlertStore.getState();

    // Assert
    expect(state.alert).not.toBeNull();
    expect(state.alert?.type).toBe('success');
    expect(state.alert?.title).toBe('Orden creada');
    expect(state.alert?.description).toBe('La orden ha sido enviada a cocina');
  });

  /**
   * ============================================================
   * PRUEBA: Mostrar alerta de error
   * ============================================================
   *
   * QUÉ estamos probando:
   * Que showAlert con type 'error' almacena correctamente
   * los datos de la alerta de error.
   *
   * POR QUÉ importa:
   * Los errores de API o validación necesitan notificarse
   * claramente al usuario.
   */
  it('debe mostrar una alerta de error', () => {
    // Arrange
    const errorAlert = {
      type: 'error' as const,
      title: 'Error de conexión',
      description: 'No se pudo conectar con el servidor',
    };

    // Act
    useAlertStore.getState().showAlert(errorAlert);
    const state = useAlertStore.getState();

    // Assert
    expect(state.alert).not.toBeNull();
    expect(state.alert?.type).toBe('error');
    expect(state.alert?.title).toBe('Error de conexión');
    expect(state.alert?.description).toBe('No se pudo conectar con el servidor');
  });

  /**
   * ============================================================
   * PRUEBA: Ocultar alerta activa
   * ============================================================
   *
   * QUÉ estamos probando:
   * Que hideAlert establece alert a null, cerrando cualquier
   * alerta visible.
   *
   * POR QUÉ importa:
   * Las alertas deben poder cerrarse (auto-dismiss o manual)
   * para no bloquear la interfaz.
   */
  it('debe ocultar la alerta activa', () => {
    // Arrange: mostramos una alerta primero
    useAlertStore.getState().showAlert({
      type: 'success',
      title: 'Guardado',
      description: 'Los cambios fueron guardados',
    });
    expect(useAlertStore.getState().alert).not.toBeNull();

    // Act
    useAlertStore.getState().hideAlert();
    const state = useAlertStore.getState();

    // Assert
    expect(state.alert).toBeNull();
  });

  /**
   * ============================================================
   * PRUEBA: Reemplazar alerta activa
   * ============================================================
   *
   * QUÉ estamos probando:
   * Que si hay una alerta activa y se muestra otra, la nueva
   * reemplaza completamente a la anterior.
   *
   * POR QUÉ importa:
   * Evita que alertas antiguas persistan cuando ocurre una
   * nueva operación con su propio feedback.
   */
  it('debe reemplazar una alerta activa con una nueva', () => {
    // Arrange: mostramos una alerta de éxito
    useAlertStore.getState().showAlert({
      type: 'success',
      title: 'Guardado',
      description: 'Los cambios fueron guardados',
    });

    // Act: mostramos una alerta de error que reemplaza la anterior
    useAlertStore.getState().showAlert({
      type: 'error',
      title: 'Error',
      description: 'No se pudo completar la operación',
    });
    const state = useAlertStore.getState();

    // Assert
    expect(state.alert).not.toBeNull();
    expect(state.alert?.type).toBe('error');
    expect(state.alert?.title).toBe('Error');
    expect(state.alert?.description).toBe('No se pudo completar la operación');
  });
});
