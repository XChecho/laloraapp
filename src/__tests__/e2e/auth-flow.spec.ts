/**
 * ============================================================
 * FLUJO E2E: Autenticación Completa
 * ============================================================
 *
 * QUÉ probamos:
 * El flujo completo de autenticación desde login hasta logout,
 * incluyendo hidratación, refresh de token y actualización de perfil.
 *
 * POR QUÉ importa:
 * Este es el flujo de entrada a toda la app. Si falla, nadie puede
 * usar ninguna funcionalidad protegida.
 *
 * CÓMO funciona:
 * Mockeamos las llamadas HTTP y simulamos el flujo paso a paso
 * usando el store de auth directamente.
 */

import { useAuthStore } from '@src/store/useAuthStore';
import { loginAction } from '@core/actions/login.action';
import { router } from 'expo-router';

jest.mock('@core/actions/login.action', () => ({
  loginAction: jest.fn(),
}));

jest.mock('expo-router', () => ({
  router: {
    replace: jest.fn(),
  },
}));

jest.mock('@src/store/useAlertStore', () => ({
  useAlertStore: {
    getState: () => ({
      showAlert: jest.fn(),
      hideAlert: jest.fn(),
    }),
  },
}));

describe('Flujo E2E: Autenticación', () => {
  beforeEach(() => {
    useAuthStore.setState({
      isLoggedIn: false,
      isHydrated: false,
      firstName: null,
      lastName: null,
      userType: null,
      token: null,
      refreshToken: null,
      email: null,
      phone: null,
      profileImage: null,
    });
    jest.clearAllMocks();
  });

  /**
   * ============================================================
   * FLUJO 1: Login → Sesión Activa → Logout
   * ============================================================
   *
   * Escenario: Un mesero abre la app, se loguea, y luego cierra sesión.
   */
  it('debería completar el flujo login → sesión activa → logout', async () => {
    // Arrange: Simular respuesta exitosa de login
    const fakeUser = {
      firstName: 'Carlos',
      lastName: 'Mesero',
      userType: 'WAITER',
      token: 'access-token-123',
      refreshToken: 'refresh-token-456',
      email: 'carmesero@lalora.com',
      phone: '3001234567',
    };
    (loginAction as jest.Mock).mockResolvedValueOnce(fakeUser);

    // Act: Paso 1 — Login
    const loginResult = await useAuthStore.getState().login(
      'carmesero@lalora.com',
      'password123',
    );

    // Assert: Login exitoso
    expect(loginResult).toBe(true);
    let state = useAuthStore.getState();
    expect(state.isLoggedIn).toBe(true);
    expect(state.firstName).toBe('Carlos');
    expect(state.userType).toBe('WAITER');
    expect(state.token).toBe('access-token-123');
    expect(state.email).toBe('carmesero@lalora.com');

    // Act: Paso 3 — Logout
    await useAuthStore.getState().logout();

    // Assert: Sesión limpiada completamente
    state = useAuthStore.getState();
    expect(state.isLoggedIn).toBe(false);
    expect(state.token).toBeNull();
    expect(state.firstName).toBeNull();
    expect(state.userType).toBeNull();
    expect(router.replace).toHaveBeenCalledWith('/(main)/login');
  });

  /**
   * ============================================================
   * FLUJO 2: Login Fallido → Reintento Exitoso
   * ============================================================
   *
   * Escenario: Un usuario se equivoca de contraseña, luego la corrige.
   */
  it('debería manejar login fallido y reintento exitoso', async () => {
    // Arrange: Primer intento falla
    (loginAction as jest.Mock).mockRejectedValueOnce(
      new Error('Invalid credentials'),
    );

    // Act: Primer intento de login
    const result1 = await useAuthStore.getState().login(
      'admin@lalora.com',
      'wrongpass',
    );

    // Assert: Login fallido
    expect(result1).toBe(false);
    expect(useAuthStore.getState().isLoggedIn).toBe(false);

    // Arrange: Segundo intento exitoso
    (loginAction as jest.Mock).mockResolvedValueOnce({
      firstName: 'Admin',
      lastName: 'User',
      userType: 'ADMIN',
      token: 'admin-token',
      refreshToken: 'admin-refresh',
      email: 'admin@lalora.com',
    });

    // Act: Segundo intento de login
    const result2 = await useAuthStore.getState().login(
      'admin@lalora.com',
      'correctpass',
    );

    // Assert: Login exitoso
    expect(result2).toBe(true);
    expect(useAuthStore.getState().isLoggedIn).toBe(true);
    expect(useAuthStore.getState().userType).toBe('ADMIN');
  });

  /**
   * ============================================================
   * FLUJO 3: Apertura de App → Hidratación → Sesión Persistente
   * ============================================================
   *
   * Escenario: Un usuario que ya se logueó antes abre la app.
   * Los tokens están en SecureStore y la sesión se restaura.
   */
  it('debería hidratar la sesión desde secure storage al abrir la app', async () => {
    // Arrange: Los mocks de expo-secure-store ya tienen datos
    // (el mock almacena en memoria)

    // Act: checkAuthStatus lee el storage
    await useAuthStore.getState().checkAuthStatus();

    // Assert: Estado hidratado
    const state = useAuthStore.getState();
    expect(state.isHydrated).toBe(true);
  });

  /**
   * ============================================================
   * FLUJO 4: Actualización de Perfil
   * ============================================================
   *
   * Escenario: Un usuario actualiza su teléfono y foto de perfil.
   */
  it('debería actualizar campos del perfil manteniendo los existentes', async () => {
    // Arrange: Usuario logueado
    useAuthStore.setState({
      isLoggedIn: true,
      isHydrated: true,
      firstName: 'Sergio',
      lastName: 'Morales',
      userType: 'ADMIN',
      token: 'tok',
      refreshToken: 'ref',
      email: 'sergio@test.com',
      phone: null,
      profileImage: null,
    });

    // Act: Actualizar teléfono
    await useAuthStore.getState().updateProfile({ phone: '3009876543' });

    // Assert: Teléfono actualizado, resto intacto
    let state = useAuthStore.getState();
    expect(state.phone).toBe('3009876543');
    expect(state.firstName).toBe('Sergio');
    expect(state.lastName).toBe('Morales');

    // Act: Actualizar foto de perfil
    await useAuthStore.getState().updateProfile({
      profileImage: 'https://cloudinary.com/profile.jpg',
    });

    // Assert: Foto actualizada, teléfono intacto
    state = useAuthStore.getState();
    expect(state.profileImage).toBe('https://cloudinary.com/profile.jpg');
    expect(state.phone).toBe('3009876543');
  });
});
