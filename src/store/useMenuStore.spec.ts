/**
 * ============================================================
 * SUITE DE PRUEBAS: useMenuStore (Zustand — Categoría del Menú)
 * ============================================================
 *
 * QUÉ estamos probando:
 * El store de selección de categoría del menú que controla
 * qué categoría de productos se muestra al usuario.
 *
 * POR QUÉ importa:
 * La navegación por categorías es la forma principal en que los
 * usuarios exploran el menú. Un bug aquí mostraría productos
 * incorrectos o ninguno.
 */

import { useMenuStore } from './useMenuStore';

describe('useMenuStore', () => {
  beforeEach(() => {
    // Reseteamos la categoría seleccionada a null antes de cada prueba
    useMenuStore.setState({ selectedCategoryId: null });
    jest.clearAllMocks();
  });

  /**
   * ============================================================
   * PRUEBA: Estado inicial — sin categoría seleccionada
   * ============================================================
   *
   * QUÉ estamos probando:
   * Que el store comienza con selectedCategoryId en null,
   * indicando que no hay categoría activa.
   *
   * POR QUÉ importa:
   * Permite mostrar todos los productos o un estado inicial
   * antes de que el usuario filtre por categoría.
   */
  it('debe iniciar sin categoría seleccionada', () => {
    // Arrange: el beforeEach ya reseteó el estado
    // Act
    const state = useMenuStore.getState();

    // Assert
    expect(state.selectedCategoryId).toBeNull();
  });

  /**
   * ============================================================
   * PRUEBA: Seleccionar una categoría
   * ============================================================
   *
   * QUÉ estamos probando:
   * Que setSelectedCategory actualiza selectedCategoryId con
   * el ID proporcionado.
   *
   * POR QUÉ importa:
   * Es la acción principal para filtrar productos del menú.
   */
  it('debe seleccionar una categoría por su ID', () => {
    // Arrange
    const categoryId = 'cat-alimentos';

    // Act
    useMenuStore.getState().setSelectedCategory(categoryId);
    const state = useMenuStore.getState();

    // Assert
    expect(state.selectedCategoryId).toBe('cat-alimentos');
  });

  /**
   * ============================================================
   * PRUEBA: Cambiar de una categoría a otra
   * ============================================================
   *
   * QUÉ estamos probando:
   * Que al seleccionar una nueva categoría, se reemplaza la
   * anterior correctamente.
   *
   * POR QUÉ importa:
   * Los usuarios navegan entre categorías frecuentemente; cada
   * cambio debe actualizar el estado sin residuos.
   */
  it('debe cambiar de una categoría a otra', () => {
    // Arrange: seleccionamos la primera categoría
    useMenuStore.getState().setSelectedCategory('cat-entradas');
    expect(useMenuStore.getState().selectedCategoryId).toBe('cat-entradas');

    // Act: cambiamos a otra categoría
    useMenuStore.getState().setSelectedCategory('cat-carnes');
    const state = useMenuStore.getState();

    // Assert
    expect(state.selectedCategoryId).toBe('cat-carnes');
  });

  /**
   * ============================================================
   * PRUEBA: Deseleccionar categoría (set null)
   * ============================================================
   *
   * QUÉ estamos probando:
   * Que se puede volver a null para deseleccionar cualquier
   * categoría activa.
   *
   * POR QUÉ importa:
   * Permite al usuario volver a ver todos los productos sin filtro.
   */
  it('debe deseleccionar la categoría al pasar null', () => {
    // Arrange: seleccionamos una categoría
    useMenuStore.getState().setSelectedCategory('cat-bebidas');
    expect(useMenuStore.getState().selectedCategoryId).toBe('cat-bebidas');

    // Act: deseleccionamos
    useMenuStore.getState().setSelectedCategory(null);
    const state = useMenuStore.getState();

    // Assert
    expect(state.selectedCategoryId).toBeNull();
  });
});
