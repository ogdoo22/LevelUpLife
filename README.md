# Level Up Life 🏠💰

> *"What would it take to live here?"* - Find out with humor and motivation.

Level Up Life is a mobile app that analyzes any neighborhood and tells you what it takes to live there - delivered with personality, humor, and actionable career suggestions.

## 🎯 What It Does

1. **Share your location** or **take a photo** of a neighborhood
2. App analyzes the area's median home prices, income levels, and cost of living
3. Receive a fun "roast" about the neighborhood
4. Get personalized career suggestions to reach that income level
5. See your "Level Up Plan" with actionable (and funny) steps

## 🏗️ Architecture

```
LevelUpLife/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── buttons/         # Button components
│   │   ├── cards/           # Card display components
│   │   ├── feedback/        # Loading, error, toast components
│   │   └── layout/          # Layout wrapper components
│   ├── screens/             # Full page views
│   ├── services/            # Business logic & API integrations
│   │   └── mockData/        # Mock data for development
│   ├── hooks/               # Custom React hooks
│   ├── utils/               # Pure utility functions
│   ├── constants/           # All constants, configs, static data
│   ├── types/               # TypeScript interfaces and types
│   ├── assets/              # Images, fonts, static assets
│   └── __tests__/           # Test files mirroring src structure
│       ├── unit/
│       ├── integration/
│       └── components/
├── docs/                    # Additional documentation
├── App.tsx                  # App entry point
└── package.json
```

## 📐 Coding Standards

This project follows **aerospace-grade coding standards** inspired by MISRA and NASA's Power of Ten rules, adapted for React Native/TypeScript:

### 1. Single Responsibility Principle
- Each function does **ONE thing only**
- Maximum **30 lines per function** (excluding comments)
- If a function needs more, break it into smaller functions

### 2. No Magic Numbers
- **ALL constants** must be defined in `/src/constants/`
- Numbers in code should be self-documenting via named constants
- Exception: 0, 1, -1, 2 for basic iteration

### 3. Explicit Types
- **No `any` types** - TypeScript strict mode enabled
- All function parameters and return types must be explicit
- Use interfaces for all data structures

### 4. Defensive Programming
- **Validate ALL inputs** at function boundaries
- Handle **ALL error cases** explicitly
- Never assume data is in expected format

### 5. Documentation
- **JSDoc comments** required for every function
- Document: purpose, parameters, return value, exceptions
- Complex logic must have inline explanatory comments

### 6. Naming Conventions
- **Descriptive names** - `userLocationData` not `uld`
- No abbreviations except universally known ones (URL, API, etc.)
- Boolean variables start with `is`, `has`, `can`, `should`
- Functions start with verbs: `get`, `set`, `calculate`, `validate`

### 7. Immutability
- Prefer `const` over `let`, never use `var`
- Avoid mutations - create new objects/arrays instead
- Use spread operators and functional array methods

### 8. Testability
- **Pure functions** wherever possible (same input → same output)
- Use **dependency injection** for external services
- Keep side effects at the edges of the system

### 9. Error Handling
- Use typed `AppError` objects, not generic errors
- **Graceful degradation** - always show user something useful
- Log errors structurally, never expose technical details to users

### 10. Logging
- Use structured logging (object format, not string concatenation)
- **Never log sensitive data** (location precision, personal info)
- Different log levels: debug, info, warn, error

## 🧪 Testing Requirements

- **Minimum 80% code coverage** overall
- **100% coverage** on:
  - `/src/utils/calculations.ts`
  - `/src/services/analysisEngine.ts`
- All edge cases must have explicit tests
- Integration tests for critical user flows

Run tests:
```bash
npm test                 # Run all tests
npm run test:coverage    # Run with coverage report
```

## 🔧 Development

### Prerequisites
- Node.js 18+
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator (Mac) or Android Emulator

### Setup
```bash
# Clone the repository
git clone <repo-url>
cd LevelUpLife

# Install dependencies
npm install

# Start development server
npm start
```

### Available Scripts
```bash
npm start          # Start Expo dev server
npm run ios        # Run on iOS simulator
npm run android    # Run on Android emulator
npm run web        # Run in web browser
npm run lint       # Check for linting errors
npm run lint:fix   # Auto-fix linting errors
npm run typecheck  # Run TypeScript compiler check
npm test           # Run test suite
```

## 📁 Key Files

| File | Purpose |
|------|---------|
| `src/types/index.ts` | All TypeScript interfaces |
| `src/constants/index.ts` | Configuration constants |
| `src/constants/roasts.ts` | Humor content by wealth tier |
| `src/services/analysisEngine.ts` | Core analysis logic |
| `src/services/locationService.ts` | Location handling |
| `src/hooks/useAnalysis.ts` | Main analysis hook |

## 🔐 API Keys Required

For full functionality, you'll need:

1. **None for MVP** - Uses mock data
2. **Future integrations:**
   - Zillow API (home prices)
   - Census Bureau API (free - income data)
   - Google Places API (neighborhood info)

## 🚀 Deployment

```bash
# Build for production
expo build:ios
expo build:android

# Or use EAS Build
eas build --platform all
```

## 📄 License

MIT License - See LICENSE file

## 🤝 Contributing

1. Follow the coding standards above
2. Write tests for all new code
3. Run `npm run lint` and `npm run typecheck` before committing
4. Keep PRs focused and small

---

Built with ❤️ and a healthy dose of humor
