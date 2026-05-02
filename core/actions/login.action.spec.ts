/**
 * ============================================================
 * SUITE DE PRUEBAS: loginAction
 * ============================================================
 *
 * QUÉ estamos probando:
 * La función loginAction que maneja la autenticación del usuario
 * enviando email y password al endpoint /auth/login.
 *
 * POR QUÉ importa:
 * Es la puerta de entrada a toda la aplicación. Si falla, ningún
 * usuario puede acceder al sistema.
 */

import { loginAction } from './login.action';

describe('loginAction', () => {
  beforeEach(() => {
    (global.fetch as jest.Mock) = jest.fn(() =>
      Promise.resolve({
        ok: true,
        status: 200,
        json: () =>
          Promise.resolve({
            success: true,
            data: {
              access_token: 'fake-access-token',
              refresh_token: 'fake-refresh-token',
              firstName: 'Juan',
              lastName: 'Pérez',
              userType: 'ADMIN',
              phone: '+1234567890',
              profileImage: 'https://example.com/avatar.jpg',
            },
            message: 'Login successful',
          }),
      }),
    );
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  /**
   * ============================================================
   * PRUEBA: Login exitoso retorna todos los campos esperados
   * ============================================================
   *
   * QUÉ estamos probando:
   * Que cuando el backend responde 200 con success: true,
   * loginAction extrae correctamente los datos y mapea
   * access_token → token, refresh_token → refreshToken.
   *
   * POR QUÉ importa:
   * La app depende de estos campos para almacenar la sesión
   * y mostrar la información del usuario.
   */
  it('debería hacer login exitosamente y retornar los datos del usuario', async () => {
    // Arrange: el mock ya está configurado en beforeEach

    // Act
    const result = await loginAction('juan@test.com', 'password123');

    // Assert
    expect(result.token).toBe('fake-access-token');
    expect(result.refreshToken).toBe('fake-refresh-token');
    expect(result.firstName).toBe('Juan');
    expect(result.lastName).toBe('Pérez');
    expect(result.userType).toBe('ADMIN');
    expect(result.email).toBe('juan@test.com');
    expect(result.phone).toBe('+1234567890');
    expect(result.profileImage).toBe('https://example.com/avatar.jpg');

    // Verificar que fetch se llamó con la URL y método correctos
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/auth/login'),
      expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'juan@test.com', password: 'password123' }),
      }),
    );
  });

  /**
   * ============================================================
   * PRUEBA: Login fallido con credenciales inválidas (401)
   * ============================================================
   *
   * QUÉ estamos probando:
   * Que cuando el backend responde 401 (Unauthorized),
   * loginAction lanza un Error con el mensaje apropiado.
   *
   * POR QUÉ importa:
   * La UI necesita capturar este error para mostrar un mensaje
   * claro al usuario de que sus credenciales son incorrectas.
   */
  it('debería lanzar error cuando las credenciales son inválidas (401)', async () => {
    // Arrange: simular respuesta 401 del backend
    (global.fetch as jest.Mock) = jest.fn(() =>
      Promise.resolve({
        ok: false,
        status: 401,
        json: () =>
          Promise.resolve({
            success: false,
            message: 'Invalid credentials',
          }),
      }),
    );

    // Act & Assert
    await expect(loginAction('bad@email.com', 'wrongpass')).rejects.toThrow(
      'Invalid credentials',
    );
  });

  /**
   * ============================================================
   * PRUEBA: Login fallido con success: false y mensaje de error
   * ============================================================
   *
   * QUÉ estamos probando:
   * Que incluso si response.ok es true pero json.success es false,
   * la función lanza error con el mensaje del backend.
   *
   * POR QUÉ importa:
   * Algunos errores del backend pueden venir con status 200 pero
   * success: false. La función debe detectar ambos casos.
   */
  it('debería lanzar error cuando la respuesta tiene success: false', async () => {
    // Arrange: simular respuesta con success: false
    (global.fetch as jest.Mock) = jest.fn(() =>
      Promise.resolve({
        ok: true,
        status: 200,
        json: () =>
          Promise.resolve({
            success: false,
            message: 'Cuenta desactivada',
          }),
      }),
    );

    // Act & Assert
    await expect(loginAction('disabled@test.com', 'password')).rejects.toThrow(
      'Cuenta desactivada',
    );
  });
});
