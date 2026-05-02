# Laloraapp 📱

Restaurant & Sports Court Management Mobile Application built with Expo and React Native.

## Features

- **Admin Dashboard**: Reports, user management, menus, tables
- **Kitchen**: Real-time order tracking with delay warnings
- **Waitress**: Order creation and management
- **Cashier**: Billing and shift closures
- **Cancha**: Sports court reservations and sales tracking

## Tech Stack

- **Framework**: Expo SDK 54, React Native 0.81.5
- **Language**: TypeScript
- **Navigation**: Expo Router, React Navigation
- **Styling**: NativeWind, Tailwind CSS, Reanimated
- **State**: Zustand
- **Data**: TanStack React Query
- **Testing**: Jest, jest-expo, @testing-library/react-native

## Getting Started

1. Install dependencies
   ```bash
   npm install
   ```

2. Start the app
   ```bash
   npx expo start
   ```

3. Run on device/emulator
   - Android: `npx expo run:android`
   - iOS: `npx expo run:ios`

## Project Structure

```
app/           # Expo Router pages
src/
  components/ # UI components
  store/      # Zustand stores
  assets/    # Fonts, images
core/         # Adapters, database, helpers
constants/   # Theming, constants
__mocks__/   # Jest mocks for native modules
```

## Architecture

- Feature-based modular architecture
- File-based routing with Expo Router
- Role-based access (Admin, Cashier, Kitchen, Waitress, CanchaManager)

## 🧪 Testing

The project uses **Jest** with `jest-expo` preset for React Native compatibility.

### Run Tests
```bash
npm test              # Run all tests
npm run test:watch    # Watch mode
npm run test:cov      # Coverage report
npm run test:debug    # Verbose debugging
```

### Test Structure
- **Pure functions** (`core/helper/validators.spec.ts`): Direct input/output testing.
- **API layer** (`core/actions/api/generalActions.spec.ts`): Mock `global.fetch` to simulate HTTP.
- **Zustand stores** (`src/store/*.spec.ts`): Reset state in `beforeEach`, test actions.
- **Components** (`src/components/**/*.spec.tsx`): Mock data hooks, render with Testing Library.

### Mocks
- `__mocks__/expo-secure-store.ts` — In-memory secure storage.
- `__mocks__/expo-router.ts` — Navigation with jest.fn().
- `__mocks__/@expo/vector-icons.tsx` — Icons as `<Text>`.

## License

MIT