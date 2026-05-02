# Laloraapp — Agente del Proyecto Mobile

> Este archivo define las reglas, patrones y mejores prácticas para el desarrollo de la app móvil de La Lora.

---

## 1. Arquitectura y Stack Tecnológico

- **Framework:** Expo (SDK ~54), React Native (0.81.5)
- **Lenguaje:** TypeScript (Strict Mode)
- **Navegación:** Expo Router, React Navigation
- **Estilos:** NativeWind (^4.2.2), Tailwind CSS, React Native Reanimated, React Native Gesture Handler
- **Estado Global:** Zustand (^5.0.11)
- **Data Fetching:** TanStack React Query (^5.90.21)
- **Iconos y Assets:** @expo/vector-icons, React Native SVG

### Estructura de Carpetas

```
app/                     # Routing con Expo Router (admin, cashier, kitchen, waitres, cancha)
src/
  components/            # Componentes UI por feature y shared
  store/                 # Zustand stores (useAuthStore, useMainStore, useAdminStore, etc.)
  assets/                # Custom fonts e imágenes
core/                    # Adapters (secure storage), helpers, validadores
  actions/
    api/
      generalActions.ts  # fetchGeneral wrapper (único punto de fetch)
    admin/               # API actions para admin (categories, products, etc.)
    menu/                # API actions para menú público
constants/               # Theming y constantes compartidas
```

---

## 2. Reglas de Implementación Obligatorias

### 2.1 Actualizaciones Quirúrgicas
- Modificar solo lo necesario. Seguir patrones de nombrado y código existentes.

### 2.2 Type Safety
- Siempre usar tipos e interfaces correctos para cambios relacionados con datos.
- Sincronizar tipos con los DTOs del backend (`lalorabacknest/AGENTS.md`).

### 2.3 UI/UX
- Usar clases utilitarias de NativeWind.
- Elementos interactivos deben tener estados active/pressed.
- Optimizar listas y animaciones con Reanimated.

### 2.4 Performance
- Usar React Query para cache y data fetching.
- Optimizar renders con `useMemo`, `useCallback` cuando sea necesario.

### 2.5 Seguridad
- **NUNCA** loguear ni commitear variables `.env` o tokens sensibles.
- Usar `expo-secure-store` para almacenamiento seguro.

---

## 3. Contrato API (App ↔ Backend)

### 3.1 Formato de Respuesta del Backend

**TODAS** las respuestas del backend siguen este formato (vía `SuccessResponseInterceptor`):

```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful"
}
```

**La app DEBE extraer `response.data` de este wrapper** en todos sus hooks y utilidades de fetch.

### 3.2 Formato de Error

```json
{
  "success": false,
  "message": "Error description",
  "statusCode": 400,
  "errors": [ ... ]
}
```

### 3.3 Autenticación
- **Header**: `Authorization: Bearer <access_token>`
- **Refresh**: Endpoint dedicado para renovar tokens expirados.
- **Roles**: `ADMIN`, `CASHIER`, `WAITER`, `KITCHEN`

### 3.4 Headers Requeridos

| Header | Descripción |
|---|---|
| `Authorization` | Bearer token para endpoints protegidos |
| `X-Request-Id` | UUID único por request (generado por backend, opcional en app) |
| `Content-Type` | `application/json` |

---

## 4. API Actions y Hooks

### 4.1 fetchGeneral
**TODAS** las llamadas a API DEBEN usar `fetchGeneral` desde `core/actions/api/generalActions.ts`. Nunca crear fetch directo.

### 4.2 Estructura de API Actions

```
core/actions/
├── api/
│   └── generalActions.ts          # fetchGeneral wrapper
├── admin/
│   ├── categories.ts              # GET/POST/PUT/DELETE /admin/categories
│   └── products.ts                # GET/POST/PUT/DELETE /admin/products
├── menu/
│   ├── categories.ts              # GET /categories
│   └── products.ts                # GET /categories/:id/products
```

### 4.3 TanStack Query Hooks

Todos los hooks de data fetching con cache DEBEN estar en `src/hooks/`:

```
src/hooks/
├── useAdminCategories.ts
├── useAdminProducts.ts
├── useMenuCategories.ts
└── useMenuProducts.ts
```

---

## 5. Delegación al Backend

**Cuando necesites un nuevo endpoint o cambio en el backend:**
1. Delegar primero a `lalorabacknest` usando su `AGENTS.md`.
2. El backend define el contrato (endpoint, DTOs, respuesta).
3. Luego implementar el consumo en la app con `fetchGeneral` y hooks correspondientes.

**Referencia del backend:** `../lalorabacknest/AGENTS.md`

---

## 6. RTK Terminal Commands (Eficiencia de Tokens)

- `ls` / `ls -la` → `rtk ls`
- `find` → `rtk find` (acepta flags nativos como `-name`, `-type`)
- `cat <file>` → `rtk read <file>`
- `grep <pattern>` → `rtk grep <pattern>`
- Cualquier comando `git` → `rtk git <subcommand>`
- `npm run <script>` → `rtk npm run <script>`
- `npx <tool>` → `rtk npx <tool>`
- `eslint` / `npx eslint` → `rtk lint`
- `tsc` / `npx tsc` → `rtk tsc`
- Cualquier formateador → `rtk format`
- `curl` → `rtk curl` (auto JSON detection)

---

## 7. Comandos del Proyecto

```bash
npm start              # Iniciar Expo
npm run android        # Ejecutar en Android
npm run ios            # Ejecutar en iOS
npm run lint           # Linting con ESLint
npm test               # Ejecutar tests con Jest
npm run test:watch     # Modo watch para desarrollo
npm run test:cov       # Tests con reporte de cobertura
npm run test:debug     # Tests con verbose y runInBand
```

---

## 8. Testing

### Framework
- **Jest** con preset `jest-expo/web` para compatibilidad con Expo/React Native.
- **@testing-library/react-native** para testing de hooks y componentes UI.
- **@testing-library/jest-native** para matchers extendidos.
- **TanStack React Query** se testea con `QueryClientProvider` wrapper.

### Estado Actual
- **35 test suites**, **284 tests**, **91.13% cobertura** (statements).
- Target: 90% statements/lines, 70% branches.

### Estructura de Tests
```
__mocks__/
├── expo-secure-store.ts     # Mock de almacenamiento seguro
├── expo-router.ts           # Mock de navegación
└── expo.ts                  # Mock genérico de expo

core/helper/
└── validators.spec.ts       # Tests de funciones puras

core/actions/
├── api/generalActions.spec.ts       # Tests de fetch API
├── login.action.spec.ts             # Tests de login
├── orders.spec.ts                   # Tests de órdenes
├── tables.spec.ts                   # Tests de mesas
├── zones.spec.ts                    # Tests de zonas
├── auth/refreshToken.action.spec.ts # Tests de refresh token
├── update-profile.action.spec.ts    # Tests de perfil
├── admin/                           # Tests de admin actions
│   ├── categories.spec.ts
│   ├── category-lists.spec.ts
│   ├── products.spec.ts
│   ├── tables.spec.ts
│   └── zones.spec.ts
└── menu/                            # Tests de menu actions
    ├── categories.spec.ts
    └── products.spec.ts

src/store/
├── useAuthStore.spec.ts             # Tests del store de auth
├── useMainStore.spec.ts             # Tests del carrito
├── useMenuStore.spec.ts             # Tests de selección de menú
├── useAlertStore.spec.ts            # Tests de alertas
├── useModalStore.spec.ts            # Tests de modales
├── useKitchenStore.spec.ts          # Tests de cocina
└── admin/useAdminStore.spec.ts      # Tests del store admin

src/hooks/                           # Tests de TanStack Query hooks
├── useAdminCategories.spec.tsx
├── useAdminProducts.spec.tsx
├── useAdminTables.spec.tsx
├── useAdminZones.spec.tsx
├── useCategoryLists.spec.tsx
├── useMenuCategories.spec.tsx
├── useMenuProducts.spec.tsx
├── useOrders.spec.tsx
└── useZones.spec.tsx

src/__tests__/
├── utils.tsx                        # createMockQueryClient, renderHookWithQueryClient
└── e2e/                             # Flujos end-to-end
    ├── auth-flow.spec.ts            # Flujo de autenticación
    ├── order-flow.spec.tsx          # Flujo de creación de órdenes
    ├── admin-catalog-flow.spec.tsx  # Flujo de gestión de catálogo
    └── admin-tables-flow.spec.tsx   # Flujo de gestión de mesas/zonas
```

### Patrones de Testing
- **Funciones puras**: Test directo con inputs/outputs conocidos.
- **API Actions**: Mock de `global.fetch` para simular respuestas HTTP.
- **Zustand stores**: Resetear estado en `beforeEach`, probar acciones con `getState()`.
- **Hooks TanStack Query**: Usar `createMockQueryClient` + `QueryClientProvider` wrapper.
- **Flujos E2E**: Orquestar stores + actions + hooks para simular flujos completos.

### Convenciones
- Archivos: `*.spec.ts` o `*.spec.tsx` (tsx si contiene JSX).
- Todos los tests deben incluir comentarios educativos en español.
- Seguir patrón Arrange → Act → Assert.

### Mocks Reutilizables
- `__mocks__/expo-secure-store.ts` — Almacenamiento en memoria.
- `__mocks__/expo-router.ts` — Navegación con jest.fn().
- `__mocks__/expo.ts` — Mock genérico de expo (evita winter runtime bug).
- `src/__tests__/utils.tsx` — `createMockQueryClient()` y `renderHookWithQueryClient()`.

### Exclusiones de Cobertura
- Componentes UI (`src/components/**`) — Se testearán en fase posterior.
- Assets, theme, constants, configuración.
- `core/database/mockDb.ts`, `core/examplearrays/`.

---

## 9. Prohibiciones Estrictas

❌ NO loguear ni commitear `.env` o tokens sensibles
❌ NO crear fetch directo (siempre usar `fetchGeneral`)
❌ NO ignorar el wrapper de respuesta `{ success, data, message }`
❌ NO hardcodear URLs de API
❌ NO usar `any` sin justificación

---

## 10. Knowledge Cache Log

*[28/04/2026] Estandarización de AGENTS.md - Migrado desde agent.md. Ajustado contrato API para coincidir con formato de respuesta del backend `{ success, data, message }`. Eliminados agent.md y GEMINI.md obsoletos.*

*[01/05/2026] Testing completo implementado - 284 tests, 91% cobertura. Stores Zustand (7), API Actions (14 archivos), Hooks TanStack Query (9), Flujos E2E (4). Excluidos componentes UI de cobertura.*

---

**Última actualización**: 2026-05-01
