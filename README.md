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
```

## Architecture

- Feature-based modular architecture
- File-based routing with Expo Router
- Role-based access (Admin, Cashier, Kitchen, Waitress, CanchaManager)

## License

MIT