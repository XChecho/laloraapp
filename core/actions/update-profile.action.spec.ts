/**
 * ============================================================
 * SUITE DE PRUEBAS: update-profile.action
 * ============================================================
 *
 * QUÉ estamos probando:
 * - getProfileAction: obtiene el perfil del usuario autenticado.
 * - updateProfileAction: actualiza datos del perfil.
 * - changePasswordAction: cambia la contraseña del usuario.
 *
 * POR QUÉ importa:
 * Estas funciones manejan la gestión de cuenta del usuario.
 * Todas requieren autenticación y deben manejar errores
 * de sesión expirada o datos inválidos.
 */

import { getProfileAction, updateProfileAction, changePasswordAction } from './update-profile.action';

// Mock de SecureStorageAdapter — usa el mock manual en __mocks__/@core/adapters/
jest.mock('@core/adapters/secure-storage.adapter');

import { SecureStorageAdapter } from '@core/adapters/secure-storage.adapter';

describe('getProfileAction', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (SecureStorageAdapter.getItem as jest.Mock).mockImplementation(async (key: string) => {
      if (key === 'token') return 'fake-auth-token';
      return null;
    });
    (global.fetch as jest.Mock) = jest.fn(() =>
      Promise.resolve({
        ok: true,
        status: 200,
        json: () =>
          Promise.resolve({
            success: true,
            data: {
              firstName: 'Juan',
              lastName: 'Pérez',
              email: 'juan@test.com',
              phone: '+1234567890',
              userType: 'ADMIN',
              profileImage: 'https://example.com/avatar.jpg',
            },
            message: 'Profile retrieved',
          }),
      }),
    );
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  /**
   * ============================================================
   * PRUEBA: Obtener perfil exitosamente
   * ============================================================
   *
   * QUÉ estamos probando:
   * Que GET /auth/profile retorna los datos del perfil del
   * usuario autenticado con el token en el header Authorization.
   *
   * POR QUÉ importa:
   * La app necesita estos datos para mostrar la información
   * del usuario en la pantalla de perfil.
   */
  it('debería obtener el perfil exitosamente', async () => {
    // Arrange: el mock ya está configurado en beforeEach

    // Act
    const result = await getProfileAction();

    // Assert: la función retorna el JSON completo del backend
    expect(result.data.firstName).toBe('Juan');
    expect(result.data.lastName).toBe('Pérez');
    expect(result.data.email).toBe('juan@test.com');
    expect(result.data.userType).toBe('ADMIN');
    expect(result.success).toBe(true);

    // Verificar que se envió el token en el header
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/auth/profile'),
      expect.objectContaining({
        method: 'GET',
        headers: {
          Authorization: 'Bearer fake-auth-token',
        },
      }),
    );
  });

  /**
   * ============================================================
   * PRUEBA: Error al obtener perfil sin autenticación
   * ============================================================
   *
   * QUÉ estamos probando:
   * Que cuando no hay token almacenado, getProfileAction lanza
   * error "No autenticado" sin llamar al servidor.
   *
   * POR QUÉ importa:
   * Previene llamadas innecesarias al backend cuando el usuario
   * no está logueado.
   */
  it('debería lanzar error cuando no hay token de autenticación', async () => {
    // Arrange: simular que no hay token
    (SecureStorageAdapter.getItem as jest.Mock).mockResolvedValue(null);

    // Act & Assert
    await expect(getProfileAction()).rejects.toThrow('No autenticado');
    expect(global.fetch).not.toHaveBeenCalled();
  });

  /**
   * ============================================================
   * PRUEBA: Error del servidor al obtener perfil
   * ============================================================
   *
   * QUÉ estamos probando:
   * Que cuando el backend responde con error, la función
   * lanza la excepción con el mensaje del servidor.
   *
   * POR QUÉ importa:
   * La UI debe mostrar el error específico al usuario.
   */
  it('debería lanzar error cuando el servidor falla al obtener perfil', async () => {
    // Arrange: simular error del servidor
    (global.fetch as jest.Mock) = jest.fn(() =>
      Promise.resolve({
        ok: false,
        status: 500,
        json: () =>
          Promise.resolve({
            success: false,
            message: 'Error interno del servidor',
          }),
      }),
    );

    // Act & Assert
    await expect(getProfileAction()).rejects.toThrow('Error interno del servidor');
  });
});

describe('updateProfileAction', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (SecureStorageAdapter.getItem as jest.Mock).mockImplementation(async (key: string) => {
      if (key === 'token') return 'fake-auth-token';
      return null;
    });
    (global.fetch as jest.Mock) = jest.fn(() =>
      Promise.resolve({
        ok: true,
        status: 200,
        json: () =>
          Promise.resolve({
            success: true,
            data: {
              firstName: 'Carlos',
              lastName: 'García',
              email: 'carlos@test.com',
              phone: '+0987654321',
              userType: 'WAITER',
              profileImage: 'https://example.com/new-avatar.jpg',
            },
            message: 'Profile updated',
          }),
      }),
    );
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  /**
   * ============================================================
   * PRUEBA: Actualizar perfil exitosamente
   * ============================================================
   *
   * QUÉ estamos probando:
   * Que PUT /auth/profile envía los datos actualizados y
   * retorna el perfil modificado.
   *
   * POR QUÉ importa:
   * Permite al usuario cambiar su nombre, email, teléfono, etc.
   */
  it('debería actualizar el perfil exitosamente', async () => {
    // Arrange: el mock ya está configurado en beforeEach
    const updateData = {
      firstName: 'Carlos',
      lastName: 'García',
      phone: '+0987654321',
    };

    // Act
    const result = await updateProfileAction(updateData);

    // Assert: la función retorna el JSON completo del backend
    expect(result.data.firstName).toBe('Carlos');
    expect(result.data.lastName).toBe('García');
    expect(result.data.phone).toBe('+0987654321');
    expect(result.success).toBe(true);

    // Verificar que se envió el body correctamente
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/auth/profile'),
      expect.objectContaining({
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer fake-auth-token',
        },
        body: JSON.stringify(updateData),
      }),
    );
  });

  /**
   * ============================================================
   * PRUEBA: Error al actualizar perfil sin autenticación
   * ============================================================
   */
  it('debería lanzar error cuando no hay token de autenticación', async () => {
    // Arrange
    (SecureStorageAdapter.getItem as jest.Mock).mockResolvedValue(null);

    // Act & Assert
    await expect(updateProfileAction({ firstName: 'Test' })).rejects.toThrow('No autenticado');
  });

  /**
   * ============================================================
   * PRUEBA: Error del servidor al actualizar perfil
   * ============================================================
   */
  it('debería lanzar error cuando el servidor falla al actualizar perfil', async () => {
    // Arrange
    (global.fetch as jest.Mock) = jest.fn(() =>
      Promise.resolve({
        ok: false,
        status: 400,
        json: () =>
          Promise.resolve({
            success: false,
            message: 'Email ya está en uso',
          }),
      }),
    );

    // Act & Assert
    await expect(updateProfileAction({ email: 'duplicate@test.com' })).rejects.toThrow(
      'Email ya está en uso',
    );
  });
});

describe('changePasswordAction', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (SecureStorageAdapter.getItem as jest.Mock).mockImplementation(async (key: string) => {
      if (key === 'token') return 'fake-auth-token';
      return null;
    });
    (global.fetch as jest.Mock) = jest.fn(() =>
      Promise.resolve({
        ok: true,
        status: 200,
        json: () =>
          Promise.resolve({
            success: true,
            data: {},
            message: 'Password changed successfully',
          }),
      }),
    );
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  /**
   * ============================================================
   * PRUEBA: Cambiar contraseña exitosamente
   * ============================================================
   *
   * QUÉ estamos probando:
   * Que PUT /auth/change-password envía currentPassword y
   * newPassword correctamente.
   *
   * POR QUÉ importa:
   * Funcionalidad crítica de seguridad para que los usuarios
   * puedan cambiar sus credenciales.
   */
  it('debería cambiar la contraseña exitosamente', async () => {
    // Arrange: el mock ya está configurado en beforeEach

    // Act
    await changePasswordAction('oldPassword123', 'newPassword456');

    // Assert
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/auth/change-password'),
      expect.objectContaining({
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer fake-auth-token',
        },
        body: JSON.stringify({
          currentPassword: 'oldPassword123',
          newPassword: 'newPassword456',
        }),
      }),
    );
  });

  /**
   * ============================================================
   * PRUEBA: Error al cambiar contraseña sin autenticación
   * ============================================================
   */
  it('debería lanzar error cuando no hay token de autenticación', async () => {
    // Arrange
    (SecureStorageAdapter.getItem as jest.Mock).mockResolvedValue(null);

    // Act & Assert
    await expect(changePasswordAction('old', 'new')).rejects.toThrow('No autenticado');
  });

  /**
   * ============================================================
   * PRUEBA: Error con contraseña actual incorrecta
   * ============================================================
   */
  it('debería lanzar error cuando la contraseña actual es incorrecta', async () => {
    // Arrange
    (global.fetch as jest.Mock) = jest.fn(() =>
      Promise.resolve({
        ok: false,
        status: 400,
        json: () =>
          Promise.resolve({
            success: false,
            message: 'La contraseña actual es incorrecta',
          }),
      }),
    );

    // Act & Assert
    await expect(changePasswordAction('wrongPassword', 'newPassword')).rejects.toThrow(
      'La contraseña actual es incorrecta',
    );
  });
});
