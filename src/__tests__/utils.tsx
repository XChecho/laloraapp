/**
 * ============================================================
 * MOCK REUTILIZABLE: createMockQueryClient
 * ============================================================
 *
 * QUÉ es:
 * Fábrica de QueryClient mockeado para tests de hooks de TanStack Query.
 *
 * POR QUÉ importa:
 * Los hooks de la app usan useQuery/useMutation de @tanstack/react-query.
 * Para testearlos sin hacer fetch real, necesitamos:
 * 1. Un QueryClient real para que el hook funcione
 * 2. Mockear las API actions para que no hagan HTTP real
 * 3. Envolver el hook con QueryClientProvider
 *
 * CÓMO usarlo:
 * ```ts
 * import { renderHook, waitFor } from '@testing-library/react-native';
 * import { QueryClientProvider } from '@tanstack/react-query';
 * import { createMockQueryClient } from '@src/__tests__/utils';
 *
 * it('debería hacer X', async () => {
 *   const mockQueryClient = createMockQueryClient();
 *   const { result } = renderHook(
 *     () => useMyHook(),
 *     { wrapper: ({ children }) => (
 *       <QueryClientProvider client={mockQueryClient}>{children}</QueryClientProvider>
 *     )}
 *   );
 *
 *   await waitFor(() => expect(result.current.data).toBeDefined());
 * });
 * ```
 */

import { QueryClient } from '@tanstack/react-query';

export function createMockQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: Infinity,
      },
      mutations: {
        retry: false,
      },
    },
  });
}

/**
 * Wrapper de render para hooks de React Query.
 *
 * USO:
 * ```ts
 * const { result } = renderHookWithQueryClient(() => useMyHook());
 * ```
 */
import { renderHook } from '@testing-library/react-native';
import React from 'react';
import { QueryClientProvider } from '@tanstack/react-query';

export function renderHookWithQueryClient(
  hook: () => unknown,
  queryClient?: QueryClient,
) {
  const client = queryClient || createMockQueryClient();

  return renderHook(hook, {
    wrapper: ({ children }) => (
      <QueryClientProvider client={client}>{children}</QueryClientProvider>
    ),
  });
}
