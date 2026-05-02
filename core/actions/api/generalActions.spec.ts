/**
 * ============================================================
 * SUITE DE PRUEBAS: fetchGeneral — Wrapper de API
 * ============================================================
 *
 * QUÉ estamos probando:
 * La función fetchGeneral, que es el ÚNICO punto de fetch de toda
 * la aplicación según las reglas del proyecto.
 *
 * POR QUÉ importa:
 * Si fetchGeneral falla, TODA la comunicación con el backend
 * falla. Es el contrato más crítico de la app.
 *
 * CÓMO funciona el mocking aquí:
 * - Mockamos `global.fetch` para simular respuestas HTTP sin
 *   hacer requests reales.
 * - Mockamos `SecureStorageAdapter` para que devuelva tokens falsos.
 * - Mockamos `refreshTokenAction` para aislar la prueba de la
 *   lógica de refresco real.
 */

import { fetchGeneral } from './generalActions';
import { refreshTokenAction } from '../auth/refreshToken.action';

// Mock del módulo de refresh para controlar su comportamiento
jest.mock('../auth/refreshToken.action', () => ({
  refreshTokenAction: jest.fn(),
}));

// Mock de SecureStorageAdapter para que no dependa de expo-secure-store nativo
jest.mock('@core/adapters/secure-storage.adapter', () => ({
  SecureStorageAdapter: {
    getItem: jest.fn(async (key: string) => {
      if (key === 'token') return 'fake-token';
      if (key === 'refreshToken') return 'fake-refresh-token';
      return null;
    }),
    setItem: jest.fn(),
    removeItem: jest.fn(),
  },
}));

describe('fetchGeneral', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (global.fetch as jest.Mock) = jest.fn();
    process.env.EXPO_PUBLIC_API_URL = 'https://api.test.com';
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  /**
   * ============================================================
   * PRUEBA: GET exitoso retorna datos desempaquetados
   * ============================================================
   *
   * QUÉ estamos probando:
   * Que cuando el backend responde 200 con el wrapper estándar
   * { success: true, data: {...} }, fetchGeneral devuelve solo
   * el contenido de `data`.
   *
   * POR QUÉ importa:
   * Todos los consumidores de la API esperan el objeto interno,
   * no el wrapper completo.
   */
  it('debe retornar los datos desempaquetados en una petición GET exitosa', async () => {
    // Arrange
    const mockData = { id: '1', name: 'Test' };
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({ success: true, data: mockData, message: 'OK' }),
    });

    // Act
    const result = await fetchGeneral('test-endpoint', 'GET');

    // Assert
    expect(result).toEqual(mockData);
    expect(global.fetch).toHaveBeenCalledWith(
      'https://api.test.com/test-endpoint',
      expect.objectContaining({ method: 'GET' }),
    );
  });

  /**
   * ============================================================
   * PRUEBA: POST exitoso envía body correctamente
   * ============================================================
   *
   * QUÉ estamos probando:
   * Que fetchGeneral serializa el body como JSON y usa el método POST.
   *
   * POR QUÉ importa:
   * Crear órdenes, categorías y productos depende de POST con body.
   */
  it('debe enviar el body correctamente en una petición POST exitosa', async () => {
    // Arrange
    const payload = { name: 'Nueva categoría' };
    const mockResponse = { id: '99', name: 'Nueva categoría' };
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      status: 201,
      json: async () => ({ success: true, data: mockResponse }),
    });

    // Act
    const result = await fetchGeneral('categories', 'POST', payload);

    // Assert
    expect(result).toEqual(mockResponse);
    const fetchCall = (global.fetch as jest.Mock).mock.calls[0];
    expect(fetchCall[1].method).toBe('POST');
    expect(fetchCall[1].body).toBe(JSON.stringify(payload));
  });

  /**
   * ============================================================
   * PRUEBA: Error 400 lanza excepción con mensaje del backend
   * ============================================================
   *
   * QUÉ estamos probando:
   * Que un status 400 (u otro no-ok) provoca un throw con el
   * mensaje parseado del cuerpo de error del backend.
   *
   * POR QUÉ importa:
   * Los componentes UI capturan este error para mostrar alerts
   * descriptivos al usuario.
   */
  it('debe lanzar un error con el mensaje del backend cuando la respuesta es 400', async () => {
    // Arrange
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 400,
      json: async () => ({
        success: false,
        message: 'Validation failed',
        errors: ['Name is required'],
      }),
    });

    // Act & Assert
    await expect(fetchGeneral('categories', 'POST')).rejects.toThrow(
      'Validation failed - Name is required',
    );
  });

  /**
   * ============================================================
   * PRUEBA: 401 refresca el token y reintenta la petición
   * ============================================================
   *
   * QUÉ estamos probando:
   * El flujo de refresh automático: si el access token expiró,
   * fetchGeneral llama refreshTokenAction, actualiza el header
   * Authorization y reintenta el fetch original.
   *
   * POR QUÉ importa:
   * Este es el mecanismo central de sesión persistente. Sin él,
   * el usuario sería deslogueado cada vez que el token expira.
   */
  it('debe refrescar el token y reintentar cuando recibe 401', async () => {
    // Arrange
    const mockData = { id: '10' };
    const newToken = 'new-fake-token';

    (refreshTokenAction as jest.Mock).mockResolvedValueOnce({
      access_token: newToken,
      refresh_token: 'new-refresh',
    });

    // Primera llamada: 401 unauthorized
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 401,
      json: async () => ({ success: false, message: 'Unauthorized' }),
    });

    // Segunda llamada (retry): 200 ok
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({ success: true, data: mockData }),
    });

    // Act
    const result = await fetchGeneral('protected-resource', 'GET');

    // Assert
    expect(refreshTokenAction).toHaveBeenCalledWith('fake-refresh-token');
    expect(global.fetch).toHaveBeenCalledTimes(2);
    expect(result).toEqual(mockData);
  });
});
