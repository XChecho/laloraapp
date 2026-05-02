const store: Record<string, string> = {};

/**
 * Mock de expo-secure-store para pruebas.
 *
 * En lugar de usar el módulo nativo real (que no funciona en Jest),
 * simulamos un almacenamiento en memoria con un objeto simple.
 * Esto permite que los tests de autenticación funcionen sin
 * depender de hardware real.
 */
export const SecureStore = {
  setItemAsync: jest.fn(async (key: string, value: string) => {
    store[key] = value;
  }),
  getItemAsync: jest.fn(async (key: string) => {
    return store[key] || null;
  }),
  deleteItemAsync: jest.fn(async (key: string) => {
    delete store[key];
  }),
};

export default SecureStore;
