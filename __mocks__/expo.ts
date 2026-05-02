/**
 * Mock del módulo expo para Jest.
 *
 * Expo SDK 54 tiene un bug en su runtime "winter" que causa
 * "ReferenceError: You are trying to import a file outside of
 * the scope of the test code" cuando se usa con Jest.
 *
 * Este mock evita que el winter runtime se cargue, proporcionando
 * stubs vacíos para las funciones que los tests podrían necesitar.
 */

export default {
  Constants: {
    manifest: {},
    manifest2: {},
  },
  registerRootComponent: jest.fn(),
  Haptic: {
    notificationAsync: jest.fn(),
    selectionAsync: jest.fn(),
    impactAsync: jest.fn(),
  },
  SplashScreen: {
    preventAutoHideAsync: jest.fn(),
    hideAsync: jest.fn(),
  },
};
