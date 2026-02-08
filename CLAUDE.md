# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

NeighborFi is a React Native (Expo SDK 54) mobile app that analyzes neighborhoods to tell users what it takes to live there. It provides humorous "roasts," career suggestions, and actionable level-up plans based on median home prices, income levels, and cost of living. Currently uses mock data for 100+ ZIP codes across all wealth tiers.

## Commands

```bash
npm start              # Start Expo dev server
npm run ios            # iOS simulator
npm run android        # Android emulator
npm run web            # Web browser
npm test               # Run tests (Jest with jest-expo preset)
npm run test:coverage  # Tests with coverage report
npm run lint           # ESLint check (.ts, .tsx)
npm run lint:fix       # ESLint auto-fix
npm run typecheck      # TypeScript strict check (tsc --noEmit)
```

Run a single test file: `npx jest path/to/test.ts`

## Architecture

**Entry point:** `App.tsx` → `src/navigation/AppNavigator.tsx` (stack navigator)

**Screen flow:** Onboarding → Home → Results → History

**Key layers:**
- `src/screens/` — 5 full-page views (Splash, Onboarding, Home, Results, History)
- `src/hooks/` — State management hooks (`useAnalysis`, `useLocation`, `useCamera`, `useFonts`)
- `src/services/` — Business logic: `analysisEngine.ts` orchestrates the core flow, `neighborhoodDataService.ts` provides data, `locationService.ts` handles GPS/geocoding. Mock data lives in `services/mockData/neighborhoodMocks.ts`
- `src/components/` — Reusable UI organized by category (buttons, cards, common, feedback, layout, settings)
- `src/constants/` — All magic numbers, colors, typography, roast templates, and tier-specific content
- `src/types/index.ts` — Central type definitions: `WealthTier` and `CareerCategory` enums, `NeighborhoodData`, `AnalysisResult`, `AppError`, navigation param types

**Data flow:** User enters ZIP or uses GPS → `useAnalysis` hook calls `analysisEngine` → engine fetches `NeighborhoodData` from mock/API → generates roast, career suggestions, level-up steps → returns `AnalysisResult` → displayed on ResultsScreen

**Path aliases** (configured in tsconfig.json): `@/*`, `@components/*`, `@screens/*`, `@services/*`, `@hooks/*`, `@utils/*`, `@constants/*`, `@types/*`

## Coding Standards

This project enforces strict "aerospace-grade" rules:

- **No `any` types** — `@typescript-eslint/no-explicit-any: error`
- **Explicit return types** on all functions
- **Max 30 lines per function**, max cyclomatic complexity 10, max nesting depth 3
- **No magic numbers** (only 0, 1, -1, 2 allowed inline; put everything else in `src/constants/`)
- **JSDoc required** on function declarations, methods, and classes
- **`prefer-const`**, `eqeqeq: always`, `curly: always`
- **Prettier:** 100 char width, single quotes, trailing commas (es5), semicolons

## Testing

- Global coverage threshold: 80% (branches, functions, lines, statements)
- `src/utils/calculations.ts` and `src/services/analysisEngine.ts` require 100% coverage
- Tests live in `src/__tests__/unit/` and `src/__tests__/integration/`

## Environment

- Requires Node.js 18+
- `.env` file contains `HUD_API_KEY` and `CENSUS_API_KEY` (not currently used; mock data serves MVP)
- Fonts: Playfair Display, Plus Jakarta Sans (loaded via expo-font)
- App targets portrait orientation only
- Bundle IDs: `com.neighborfi.app` (iOS and Android)
