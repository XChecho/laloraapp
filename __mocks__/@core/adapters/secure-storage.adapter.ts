/**
 * Mock manual de SecureStorageAdapter para pruebas.
 *
 * Este mock se usa automáticamente para imports estáticos y dinámicos
 * de '@core/adapters/secure-storage.adapter'.
 *
 * Al estar en __mocks__/@core/adapters/, Jest lo resuelve tanto para
 * `import { SecureStorageAdapter } from '@core/adapters/...'` como
 * para `await import('@core/adapters/...')`.
 */

const store: Record<string, string | null> = {};

export const SecureStorageAdapter = {
  getItem: jest.fn(async (key: string) => {
    return store[key] ?? null;
  }),
  setItem: jest.fn(async (key: string, value: string) => {
    store[key] = value;
  }),
  removeItem: jest.fn(async (key: string) => {
    delete store[key];
  }),
};
