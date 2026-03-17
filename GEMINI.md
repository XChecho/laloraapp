# RTK — Token-Optimized Commands

When running shell commands, ALWAYS prefix with `rtk` for these commands.
This reduces token consumption by ~89%.

## File System

- `ls` / `ls -la` → `rtk ls`
- `tree` → `rtk tree`
- `find` → `rtk find` (accepts native flags like `-name`, `-type`)
- `wc` → `rtk wc`

## File Reading & Diffs

- `cat <file>` → `rtk read <file>`
- `diff <file1> <file2>` → `rtk diff <file1> <file2>`
- `grep <pattern>` → `rtk grep <pattern>`

## Git & GitHub

- `git status` → `rtk git status`
- `git diff` → `rtk git diff`
- `git log` → `rtk git log`
- Any `git` command → `rtk git <subcommand>`
- Any `gh` command → `rtk gh <subcommand>`
- `gt` (Graphite stacked PRs) → `rtk gt <subcommand>`

## JavaScript / Node

- `npm run <script>` → `rtk npm run <script>` (rtk npm run build, rtk npm run dev, rtk npm run test, ...)
- `npx <tool>` → `rtk npx <tool>` (auto-routes tsc, eslint, prisma to specialized filters)
- `pnpm <command>` → `rtk pnpm <command>`
- `next build` → `rtk next build`

## Linting & Formatting

- `eslint` / `npx eslint` → `rtk lint`
- `prettier` → `rtk prettier`
- `ruff` → `rtk ruff`
- `mypy` → `rtk mypy`
- `tsc` / `npx tsc` → `rtk tsc`
- Any formatter (prettier, black, ruff format) → `rtk format`

## Databases & Cloud

- `psql` → `rtk psql` (strips borders, compresses tables)
- `aws` → `rtk aws` (forces JSON output, compresses)
- `kubectl` → `rtk kubectl`
- `docker` → `rtk docker`

## Network & Downloads

- `curl` → `rtk curl` (auto JSON detection and schema output)
- `wget` → `rtk wget` (strips progress bars)

## Logs & Errors

- Any command where only errors matter → `rtk err "<command>"`
- Any command where only logs matter → `rtk log "<command>"`

## Summaries & Analysis

- Quick 2-line summary of a command → `rtk smart "<command>"`
- Full heuristic summary → `rtk summary "<command>"`
- Project dependencies → `rtk deps`
- Environment variables (sensitive masked) → `rtk env`
- Token savings history → `rtk gain`
- Claude Code spending vs RTK savings → `rtk cc-economics`

## Utilities

- `cat package.json` / `cat Cargo.toml` / etc. → `rtk deps` (dependency summary)
- Run command without filtering but track usage → `rtk proxy "<command>"`
- Discover missed RTK savings from history → `rtk discover`
- Learn from past CLI errors → `rtk learn`
- Check hook integrity → `rtk verify`
- Show hook rewrite audit metrics → `rtk hook-audit` (requires `RTK_HOOK_AUDIT=1`)
- Rewrite a raw command to RTK equivalent → `rtk rewrite "<command>"`
- RTK configuration → `rtk config`
- Initialize RTK in CLAUDE.md → `rtk init`
- JSON structure without values → `rtk json <file>`

---

# Project Context: laloraapp

## Overview
An Expo React Native mobile application built with Expo Router, styled with NativeWind (Tailwind CSS v3), and managed by Zustand. It utilizes TanStack React Query for data fetching and caching.

## Tech Stack & Libraries
- **Framework:** Expo (SDK ~54), React Native (0.81.5)
- **Navigation:** Expo Router, React Navigation
- **Styling:** NativeWind (^4.2.2), Tailwind CSS, React Native Reanimated, React Native Gesture Handler
- **State Management:** Zustand (^5.0.11)
- **Data Fetching:** TanStack React Query (^5.90.21)
- **Icons & Assets:** @expo/vector-icons, React Native SVG

## Folder Structure
- `app/`: Routing logic using Expo Router, handling private, public, and tab-based layouts (admin, cashier, kitchen, waitres, cancha).
- `src/`: Core logic and UI.
  - `components/`: Feature-specific and shared UI components (e.g., admin, cancha, modals).
  - `store/`: Zustand stores (`useAuthStore`, `useMainStore`, `useAdminStore`, etc.).
  - `assets/`: Custom fonts and images.
- `core/`: Adapters (like secure storage), database mocks, and helper/validator functions.
- `constants/`: Theming and shared constants.

## Recent Commits
- `1895f43` feat: Add Cancha tab with reservation cards, status management, and associated modals.
- `52d0a03` feat: Introduce a new admin section with dedicated screens for reports, user management, menus, tables, and settings.
- `23f1c71` feat: Enhance kitchen order tracking with dynamic delay/warning thresholds.
- `2ee5df5` feat: Customize Android tab bar appearance and implement collapsible animated footer.
- `b423573` refactor: Migrate Kitchen tab to use Pressable and `react-native-safe-area-context`.
- `c63e84e` feat: Implement a kitchen display screen with order tracking.
- `4b3c4b0` refactor: migrate tab navigation to `NativeTabs`.
- `ceed50d` feat: Implement a centralized modal management system.
- `3fa111b` Create cashier index screen.
- `2691182` Add first part of login auth.