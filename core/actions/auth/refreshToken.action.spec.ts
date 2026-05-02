/**
 * ============================================================
 * SUITE DE PRUEBAS: refreshTokenAction y checkTokenStatusAction
 * ============================================================
 *
 * QUÉ estamos probando:
 * - refreshTokenAction: renueva tokens de acceso usando el refresh token.
 * - checkTokenStatusAction: verifica localmente si el token JWT está
 *   próximo a expirar sin hacer llamada al servidor.
 *
 * POR QUÉ importa:
 * El refresh de tokens mantiene la sesión activa sin requerir
 * re-login. checkTokenStatusAction permite a la app saber cuándo
 * refrescar proactivamente antes de que expire.
 */

import { refreshTokenAction, checkTokenStatusAction } from './refreshToken.action';

// Mock de SecureStorageAdapter para checkTokenStatusAction
jest.mock('@core/adapters/secure-storage.adapter', () => ({
  SecureStorageAdapter: {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
  },
}));

// Importar el mock para poder controlarlo
import { SecureStorageAdapter } from '@core/adapters/secure-storage.adapter';

describe('refreshTokenAction', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (global.fetch as jest.Mock) = jest.fn(() =>
      Promise.resolve({
        ok: true,
        status: 200,
        json: () =>
          Promise.resolve({
            success: true,
            data: {
              access_token: 'new-access-token',
              refresh_token: 'new-refresh-token',
            },
            message: 'Token refreshed',
          }),
      }),
    );
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  /**
   * ============================================================
   * PRUEBA: Refresh exitoso retorna nuevos tokens
   * ============================================================
   *
   * QUÉ estamos probando:
   * Que con un refresh token válido, el endpoint /auth/refresh
   * retorna un nuevo par de access_token y refresh_token.
   *
   * POR QUÉ importa:
   * Este es el mecanismo que permite mantener sesiones largas
   * sin pedir credenciales al usuario repetidamente.
   */
  it('debería refrescar el token exitosamente', async () => {
    // Arrange: el mock ya está configurado en beforeEach

    // Act
    const result = await refreshTokenAction('valid-refresh-token');

    // Assert
    expect(result).not.toBeNull();
    expect(result?.access_token).toBe('new-access-token');
    expect(result?.refresh_token).toBe('new-refresh-token');

    // Verificar que fetch se llamó con el header Authorization correcto
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/auth/refresh'),
      expect.objectContaining({
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer valid-refresh-token',
        },
      }),
    );
  });

  /**
   * ============================================================
   * PRUEBA: Refresh con token vacío retorna null
   * ============================================================
   *
   * QUÉ estamos probando:
   * Que si se pasa un refreshToken vacío o null, la función
   * retorna null inmediatamente sin llamar al servidor.
   *
   * POR QUÉ importa:
   * Evita llamadas innecesarias al backend cuando no hay
   * token para refrescar.
   */
  it('debería retornar null cuando el refresh token está vacío', async () => {
    // Arrange

    // Act
    const result = await refreshTokenAction('');

    // Assert
    expect(result).toBeNull();
    expect(global.fetch).not.toHaveBeenCalled();
  });

  /**
   * ============================================================
   * PRUEBA: Refresh fallido con token inválido
   * ============================================================
   *
   * QUÉ estamos probando:
   * Que cuando el refresh token es inválido o expirado,
   * el backend responde con error y la función lanza excepción.
   *
   * POR QUÉ importa:
   * Cuando el refresh falla, la app debe limpiar la sesión
   * y redirigir al login.
   */
  it('debería lanzar error cuando el refresh token es inválido', async () => {
    // Arrange: simular respuesta de error del backend
    (global.fetch as jest.Mock) = jest.fn(() =>
      Promise.resolve({
        ok: false,
        status: 401,
        json: () =>
          Promise.resolve({
            success: false,
            message: 'Invalid refresh token',
          }),
      }),
    );

    // Act & Assert
    await expect(refreshTokenAction('expired-token')).rejects.toThrow(
      'Invalid refresh token',
    );
  });
});

describe('checkTokenStatusAction', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  /**
   * ============================================================
   * PRUEBA: Token válido con tiempo suficiente
   * ============================================================
   *
   * QUÉ estamos probando:
   * Que con un token JWT válido que expira en más de 5 minutos,
   * checkTokenStatusAction retorna needsRefresh: false y el
   * tiempo restante correcto.
   *
   * POR QUÉ importa:
   * Permite a la app decidir si necesita refrescar el token
   * antes de hacer una petición.
   */
  it('debería retornar expiresIn y needsRefresh: false para token válido con tiempo suficiente', async () => {
    // Arrange: crear un token JWT falso que expira en 10 minutos
    const futureExp = Math.floor((Date.now() + 10 * 60 * 1000) / 1000);
    const fakePayload = JSON.stringify({ exp: futureExp, sub: 'user-1' });
    const fakeToken = `header.${btoa(fakePayload)}.signature`;

    (SecureStorageAdapter.getItem as jest.Mock).mockResolvedValue(fakeToken);

    // Act
    const result = await checkTokenStatusAction();

    // Assert
    expect(result.needsRefresh).toBe(false);
    expect(result.expiresIn).toBeGreaterThan(5 * 60 * 1000); // más de 5 minutos
  });

  /**
   * ============================================================
   * PRUEBA: Token próximo a expirar (menos de 5 minutos)
   * ============================================================
   *
   * QUÉ estamos probando:
   * Que cuando el token expira en menos de 5 minutos,
   * needsRefresh se establece en true.
   *
   * POR QUÉ importa:
   * Este umbral de 5 minutos da margen para refrescar antes
   * de que el token expire y cause errores 401.
   */
  it('debería retornar needsRefresh: true cuando el token expira en menos de 5 minutos', async () => {
    // Arrange: token que expira en 2 minutos
    const futureExp = Math.floor((Date.now() + 2 * 60 * 1000) / 1000);
    const fakePayload = JSON.stringify({ exp: futureExp, sub: 'user-1' });
    const fakeToken = `header.${btoa(fakePayload)}.signature`;

    (SecureStorageAdapter.getItem as jest.Mock).mockResolvedValue(fakeToken);

    // Act
    const result = await checkTokenStatusAction();

    // Assert
    expect(result.needsRefresh).toBe(true);
    expect(result.expiresIn).toBeLessThan(5 * 60 * 1000);
  });

  /**
   * ============================================================
   * PRUEBA: Sin token almacenado
   * ============================================================
   *
   * QUÉ estamos probando:
   * Que cuando no hay token en secure storage, la función
   * retorna expiresIn: 0 y needsRefresh: true.
   *
   * POR QUÉ importa:
   * Indica que el usuario no está autenticado y necesita login.
   */
  it('debería retornar necesita refresh cuando no hay token', async () => {
    // Arrange: no hay token almacenado
    (SecureStorageAdapter.getItem as jest.Mock).mockResolvedValue(null);

    // Act
    const result = await checkTokenStatusAction();

    // Assert
    expect(result).toEqual({ expiresIn: 0, needsRefresh: true });
  });

  /**
   * ============================================================
   * PRUEBA: Token malformado causa needsRefresh: true
   * ============================================================
   *
   * QUÉ estamos probando:
   * Que si el token no es un JWT válido (no se puede decodificar),
   * la función maneja la excepción y retorna needsRefresh: true.
   *
   * POR QUÉ importa:
   * Previene crashes si el token almacenado está corrupto.
   */
  it('debería retornar necesita refresh cuando el token está malformado', async () => {
    // Arrange: token que no es un JWT válido
    (SecureStorageAdapter.getItem as jest.Mock).mockResolvedValue('not-a-jwt-token');

    // Act
    const result = await checkTokenStatusAction();

    // Assert
    expect(result).toEqual({ expiresIn: 0, needsRefresh: true });
  });
});
