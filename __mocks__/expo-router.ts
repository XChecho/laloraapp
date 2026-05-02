/**
 * Mock de expo-router para pruebas.
 *
 * La navegación nativa no funciona en el entorno de Jest,
 * así que reemplazamos todas las funciones de routing con
 * jest.fn() vacías. Esto nos permite verificar QUE se llamó
 * a router.push() sin que realmente intente navegar.
 */
export const router = {
  push: jest.fn(),
  replace: jest.fn(),
  back: jest.fn(),
  navigate: jest.fn(),
  setParams: jest.fn(),
  dismiss: jest.fn(),
  dismissTo: jest.fn(),
  dismissAll: jest.fn(),
};

export const useRouter = () => router;

export const useLocalSearchParams = () => ({});

export const useSegments = () => [];

export const usePathname = () => '/';

export const Link = jest.fn(() => null);

export const Redirect = jest.fn(() => null);
