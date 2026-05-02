/**
 * ============================================================
 * SUITE DE PRUEBAS: Validadores del Core
 * ============================================================
 *
 * QUÉ estamos probando:
 * Funciones puras de validación y formateo que no dependen de
 * React Native, APIs externas ni estado global.
 *
 * POR QUÉ importa:
 * Las funciones puras son las más fáciles de testear y constituyen
 * la base de confiabilidad de toda la app. Si un email inválido
 * pasa la validación, el backend rechazará el login y el usuario
 * no entenderá qué falló.
 *
 * PATRÓN Arrange → Act → Assert:
 * En cada prueba definimos entradas conocidas, ejecutamos la
 * función y comparamos el resultado contra un valor esperado.
 */

import { isValidEmail, formatCOP } from './validators';

describe('validators', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  /**
   * ============================================================
   * PRUEBA: Email válido pasa la validación
   * ============================================================
   *
   * QUÉ estamos probando:
   * Que la función isValidEmail reconoce un email correctamente
   * formateado.
   *
   * POR QUÉ importa:
   * Esta función se usa en el login para validar que el usuario
   * ingresó un email antes de intentar autenticarse.
   *
   * PATRÓN Arrange → Act → Assert:
   * 1. Arrange: Definimos el email de prueba
   * 2. Act: Llamamos a isValidEmail con ese email
   * 3. Assert: Esperamos que devuelva true
   */
  describe('isValidEmail', () => {
    it('debe retornar true para emails válidos', () => {
      // Arrange
      const emailsValidos = ['test@example.com', 'user.name@domain.co'];

      // Act & Assert
      emailsValidos.forEach((email) => {
        expect(isValidEmail(email)).toBe(true);
      });
    });

    /**
     * ============================================================
     * PRUEBA: Email inválido es rechazado
     * ============================================================
     *
     * QUÉ estamos probando:
     * Que isValidEmail devuelve false cuando el formato no cumple
     * la expresión regular something@something.something
     *
     * POR QUÉ importa:
     * Evita requests innecesarios al backend con datos malformados.
     */
    it('debe retornar false para emails inválidos', () => {
      // Arrange
      const emailsInvalidos = ['', 'notanemail', '@domain.com', 'user@'];

      // Act & Assert
      emailsInvalidos.forEach((email) => {
        expect(isValidEmail(email)).toBe(false);
      });
    });
  });

  /**
   * ============================================================
   * PRUEBA: Formato de pesos colombianos (COP)
   * ============================================================
   *
   * QUÉ estamos probando:
   * Que formatCOP convierte números enteros a string con formato
   * monetario colombiano usando Intl.NumberFormat.
   *
   * POR QUÉ importa:
   * Garantiza consistencia visual en todos los precios mostrados
   * en la app (menú, cuentas, cancha).
   */
  describe('formatCOP', () => {
    it('debe formatear valores numéricos a COP correctamente', () => {
      // Arrange & Act & Assert
      // Intl.NumberFormat agrega un espacio entre $ y el número en es-CO
      expect(formatCOP(45000)).toContain('45.000');
      expect(formatCOP(120500)).toContain('120.500');
      expect(formatCOP(0)).toContain('0');
    });
  });
});
