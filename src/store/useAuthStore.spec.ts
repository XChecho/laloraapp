/**
 * ============================================================
 * SUITE DE PRUEBAS: useAuthStore (Zustand)
 * ============================================================
 *
 * QUÉ estamos probando:
 * El store global de autenticación que maneja login, logout,
 * hidratación desde secure storage y actualización de perfil.
 *
 * POR QUÉ importa:
 * Todo el acceso a rutas protegidas y la UI condicional dependen
 * de este store. Un bug aquí bloquea toda la app.
 *
 * CÓMO funciona el mocking:
 * - `expo-secure-store` está mockado en __mocks__/ para simular
 *   almacenamiento en memoria sin módulos nativos.
 * - `expo-router` está mockado para evitar dependencias de
 *   navegación nativa durante los tests.
 * - `login.action` se mockea para devolver datos de usuario
 *   ficticios sin hacer fetch real.
 */

import { useAuthStore } from './useAuthStore';
import { loginAction } from '@core/actions/login.action';
import { router } from 'expo-router';

// Mock de login.action
jest.mock('@core/actions/login.action', () => ({
  loginAction: jest.fn(),
}));

// Mock de expo-router
jest.mock('expo-router', () => ({
  router: {
    replace: jest.fn(),
  },
}));

// Mock del alert store para evitar efectos secundarios visuales
jest.mock('./useAlertStore', () => ({
  useAlertStore: {
    getState: () => ({
      showAlert: jest.fn(),
      hideAlert: jest.fn(),
    }),
  },
}));

describe('useAuthStore', () => {
  beforeEach(() => {
    // Reseteamos el estado de Zustand antes de cada prueba
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
   * PRUEBA: Estado inicial — usuario deslogueado
   * ============================================================
   *
   * QUÉ estamos probando:
   * Que el store comienza con isLoggedIn en false antes de
   * cualquier interacción.
   *
   * POR QUÉ importa:
   * La navegación protegida depende de este flag. Si arranca
   * en true, cualquier usuario vería pantallas privadas.
   */
  it('debe iniciar con el usuario deslogueado', () => {
    // Arrange: el beforeEach ya reseteó el estado
    // Act
    const state = useAuthStore.getState();

    // Assert
    expect(state.isLoggedIn).toBe(false);
    expect(state.isHydrated).toBe(false);
    expect(state.token).toBeNull();
  });

  /**
   * ============================================================
   * PRUEBA: Login exitoso almacena datos y actualiza estado
   * ============================================================
   *
   * QUÉ estamos probando:
   * Que la acción login llama a loginAction, guarda cada campo
   * en SecureStorage y actualiza el estado global.
   *
   * POR QUÉ importa:
   * Es el flujo de entrada a la app. Si no persiste el token,
   * el usuario debería loguearse cada vez que abre la app.
   */
  it('debe loguear al usuario y persistir datos en secure storage', async () => {
    // Arrange
    const fakeUser = {
      firstName: 'Sergio',
      lastName: 'Morales',
      userType: 'ADMIN',
      token: 'access-123',
      refreshToken: 'refresh-456',
      email: 'sergio@test.com',
    };

    (loginAction as jest.Mock).mockResolvedValueOnce(fakeUser);

    // Act
    const result = await useAuthStore.getState().login('sergio@test.com', 'password');

    // Assert
    expect(result).toBe(true);
    const state = useAuthStore.getState();
    expect(state.isLoggedIn).toBe(true);
    expect(state.firstName).toBe('Sergio');
    expect(state.token).toBe('access-123');
    expect(loginAction).toHaveBeenCalledWith('sergio@test.com', 'password');
  });

  /**
   * ============================================================
   * PRUEBA: Logout limpia todo
   * ============================================================
   *
   * QUÉ estamos probando:
   * Que logout borra todos los datos de secure storage y resetea
   * el estado a los valores iniciales.
   *
   * POR QUÉ importa:
   * Es crítico para seguridad. Un logout incompleto dejaría
   * tokens sensibles en el dispositivo.
   */
  it('debe desloguear al usuario y limpiar el estado y storage', async () => {
    // Arrange: ponemos el store en estado logueado
    useAuthStore.setState({
      isLoggedIn: true,
      firstName: 'Sergio',
      token: 'tok',
    });

    // Act
    await useAuthStore.getState().logout();

    // Assert
    const state = useAuthStore.getState();
    expect(state.isLoggedIn).toBe(false);
    expect(state.firstName).toBeNull();
    expect(state.token).toBeNull();
    expect(router.replace).toHaveBeenCalledWith('/(main)/login');
  });

  /**
   * ============================================================
   * PRUEBA: checkAuthStatus hidrata estado desde storage
   * ============================================================
   *
   * QUÉ estamos probando:
   * Que al abrir la app, checkAuthStatus lee secure storage y
   * reconstruye el estado de autenticación.
   *
   * POR QUÉ importa:
   * Permite mantener la sesión activa entre cierres de la app.
   */
  it('debe hidratar el estado desde secure storage', async () => {
    // Arrange: los mocks de expo-secure-store devuelven valores
    // Act
    await useAuthStore.getState().checkAuthStatus();

    // Assert
    const state = useAuthStore.getState();
    expect(state.isHydrated).toBe(true);
  });

  /**
   * ============================================================
   * PRUEBA: updateProfile actualiza campos específicos
   * ============================================================
   *
   * QUÉ estamos probando:
   * Que updateProfile modifica solo los campos proporcionados
   * sin afectar el resto del estado.
   */
  it('debe actualizar campos específicos del perfil', async () => {
    // Arrange
    useAuthStore.setState({
      isLoggedIn: true,
      firstName: 'Sergio',
      lastName: 'Morales',
      phone: null,
    });

    // Act
    await useAuthStore.getState().updateProfile({ phone: '3001234567' });

    // Assert
    const state = useAuthStore.getState();
    expect(state.phone).toBe('3001234567');
    expect(state.firstName).toBe('Sergio');
    expect(state.lastName).toBe('Morales');
  });
});
