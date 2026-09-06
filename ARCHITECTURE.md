# Architecture Overview

Happy Store uses a scalable, domain-driven architecture to separate UI from business logic and data fetching.

## 1. Routing

We use `react-router-dom` with a centralized configuration in `src/app/router.tsx`.
- **Lazy Loading**: Route-level code splitting is implemented using `React.lazy` and `Suspense`. The customer app, shop dashboard, and admin dashboard are split into separate chunks.
- **Route Guards**: 
  - `GuestRoute`: Prevents logged-in users from seeing Auth pages.
  - `ProtectedRoute`: Prevents unauthenticated users from seeing the app.
  - `RoleGuard`: Ensures route access based on `customer`, `shop_owner`, or `admin` roles.

## 2. State Management

We use a hybrid approach to state management:
- **Server State (TanStack Query)**: Handles all asynchronous data fetching, caching, synchronization, and error handling. We use `useQuery` and `useMutation` in shared hooks (`src/hooks/`).
- **Client State (Redux Toolkit)**: Manages global, synchronous UI state that needs to be accessed anywhere in the component tree.
  - `authSlice`: JWT/Session info.
  - `cartSlice`: Local cart state.
  - `themeSlice`: Light/Dark/System preference.
  - `notificationsSlice`: UI notification bell count.
  - `userPreferencesSlice`: Settings and toggles.

## 3. Service Layer

The `src/services/` directory abstracts all data access. Components never call `fetch` or `localStorage` directly.
- **Mock Client (`apiClient.ts`)**: Currently simulates network latency and errors. In Phase 3, this will be swapped for an actual HTTP client (e.g., Axios).
- **Domain Services**: `authService`, `productService`, `shopService`, etc. return standard `ApiResponse<T>` envelopes.

## 4. Components & Design System

The application relies on a bespoke design system implemented with vanilla CSS and utility classes.
- **Dumb Components**: `src/components/ui/` contains purely presentational components (Buttons, Inputs, Dialogs).
- **Domain Components**: `src/components/commerce/` contains business-aware components (ProductCard, ShopCard) wrapped in `React.memo` for performance.
- **Layouts**: Page shells that establish grids, navbars, and sidebars.

## 5. Forms & Validation

All forms use `react-hook-form` bound with `@hookform/resolvers/zod`. 
- Validation rules and error messages are centralized in `src/lib/validationSchemas.ts` ensuring consistency across the client and (eventually) the backend.
