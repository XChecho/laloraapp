/**
 * Setup file para Jest (JavaScript puro, sin import.meta).
 *
 * Expo SDK 54 usa `import.meta` en su runtime "winter", pero Jest no lo soporta.
 * Este archivo parchea el entorno antes de que expo intente cargar su runtime nativo.
 */

// Parche para import.meta (expo winter runtime lo necesita)
if (typeof globalThis.importMeta === 'undefined') {
  globalThis.importMeta = { url: '' };
}

// Mock de require.context para Jest
if (typeof require !== 'undefined' && typeof require.context === 'undefined') {
  require.context = function() {
    return function() { return []; };
  };
}

// Mock de __dirname y __filename para módulos ESM
if (typeof globalThis.__dirname === 'undefined') {
  globalThis.__dirname = '';
}
if (typeof globalThis.__filename === 'undefined') {
  globalThis.__filename = '';
}

// Mock global fetch for API tests
if (typeof globalThis.fetch === 'undefined') {
  globalThis.fetch = jest.fn();
}

// Desactivar cleanup automático de @testing-library/react-native
// para evitar conflictos con tests async de React Query
if (typeof process !== 'undefined') {
  process.env.RTL_SKIP_AUTO_CLEANUP = 'true';
}
