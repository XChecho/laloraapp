# Laloraapp — Optimized Project Standards & Continuous Learning

High-performance Expo React Native mobile application using modular feature-based architecture and dynamic routing.

## 🚀 Core Architecture
- **Framework:** Expo (SDK ~54), React Native (0.81.5)
- **Language:** TypeScript (Strict Mode).
- **Navigation:** Expo Router, React Navigation
- **Styling:** NativeWind (^4.2.2), Tailwind CSS, React Native Reanimated, React Native Gesture Handler
- **State Management:** Zustand (^5.0.11)
- **Data Fetching:** TanStack React Query (^5.90.21)
- **Icons & Assets:** @expo/vector-icons, React Native SVG

## 🛠️ Mandatory Implementation Rules
1. **Surgical Updates:** Modify only what is necessary. Follow existing naming and coding patterns.
2. **Type Safety:** Always refer to and update correct types and interfaces for any data-related changes.
3. **UI/UX:** Use NativeWind utility classes. Ensure interactive elements have active/pressed states.
4. **Performance:** Optimize list performance, animations (using Reanimated), and use appropriate data fetching and caching with React Query.
5. **Security:** Never log or commit `.env` variables or sensitive tokens. Secure storage must be handled properly using core adapters.

## 🔄 Continuous Learning & Knowledge Caching
**Self-Correction Rule:** If the user corrects, scolds, or provides a better implementation, or if new official standards (e.g., Expo/React Native updates) are applied, **immediately update this file** with the new rule.
**Knowledge Cache Protocol (30-day rule):**
- **BEFORE** starting any module task, check `Knowledge Cache Log` for research within the last 30 days.
- If missing/old: Conduct deep research (official docs prioritized), apply findings, and **log the summary below.**
**Format:** `[DD/MM/AAAA] [Topic] - [Summary of findings/updates].`

## ⚡ Agent Efficiency & Tokens
- **RTK:** Always use `rtk` prefix for terminal commands (fs, git, npm, expo, lint) to reduce tokens by ~89%. Example: `rtk npm run start`, `rtk npx expo start`, `rtk lint`, `rtk tsc`, `rtk git status`.
- **Context:** Maintain a clean context. Use surgical reads (`read_file` with ranges) and parallel sub-agents (e.g., `codebase_investigator`) for maximum efficiency.
- **Token Saver:** Prioritize token economy. Be extremely concise. Use "caveman" style for non-vital responses (e.g., "tasks done" instead of "all tasks completed successfully"). Avoid unnecessary explanations. If "yes" suffices, say only "yes".

---

## 📂 Project Structure Snapshot
- `app/`: Routing logic using Expo Router, handling private, public, and tab-based layouts (admin, cashier, kitchen, waitres, cancha).
- `src/`: Core logic and UI.
  - `components/`: Feature-specific and shared UI components (e.g., admin, cancha, modals).
  - `store/`: Zustand stores (`useAuthStore`, `useMainStore`, `useAdminStore`, etc.).
  - `assets/`: Custom fonts and images.
- `core/`: Adapters (like secure storage), database mocks, and helper/validator functions.
- `constants/`: Theming and shared constants.

---

## 📝 Knowledge Cache Log
*[16/04/2026] Agent.md Initialization - Established unified context file for mobile project standards, inheriting from previous guidelines.*
