# AGENTS.md — apps/admin

This file provides guidance to Claude Code when working with the AlgaShop admin dashboard.

## Project Overview

Angular 17 SPA that serves as the back-office admin dashboard for AlgaShop.

- **Dev port:** 4200
- **Docker port:** 80 (Nginx)
- **Auth:** OAuth2 Authorization Code + PKCE (`angular-oauth2-oidc`)
- **API gateway:** `http://admin-api.algashop.local:9998`
- **Auth server:** `http://auth.algashop.local:8081`

## Technology Stack

- Angular 17.1.2, TypeScript 5.3 (strict mode), RxJS 7.8
- PrimeNG 17.13.0 + PrimeFlex 3.3.1 + Chart.js 4.4.3
- angular-oauth2-oidc 17.0.1
- Node 20, Angular CLI 17.1.2
- Playwright 1.41.2 for E2E tests

## Dev Commands

```bash
npm install              # install dependencies
npm start                # dev server at http://localhost:4200 (SSL off)
npm run start-with-ssl   # dev server at https://admin.algashop.local:4200
npm run build            # production build → dist/admin/
npm run build:dev        # dev build with source maps
npm run build:prod       # production build with hashing and optimization
npm run lint             # ESLint on TS + HTML
npm run test             # Playwright E2E tests
npm run e2e              # alias for test
```

## Environment Configuration

Files: `src/environments/environment.ts` (dev) and `environment.prod.ts` (prod).

| Key | Dev | Prod |
|-----|-----|------|
| `issuer` | http://auth.algashop.local:8081 | http://auth.algashop.com |
| `redirectUri` | http://admin.algashop.local:4200 | http://admin.algashop.com |
| `clientId` | algashop-admin-web | algashop-admin-web |
| `apiUrl` | http://admin-api.algashop.local:9998 | http://admin-api.algashop.com |
| `authUrl` | http://auth.algashop.local:8081 | http://auth.algashop.com |

**OAuth2 scopes:** `openid products:read products:write products:stock:write categories:read categories:write invoices:read orders:read customers:read shopping-carts:read users:read users:write`

## Architecture

### Source layout

```
src/app/
├── core/          # CoreModule — singleton auth services, guards, HTTP interceptors
├── shared/        # SharedModule — layout, error pages, pipes, directives, NgPrimeModule
│   ├── layout/    # LayoutComponent, HeaderComponent, MenuComponent, FooterComponent
│   ├── error/     # PageNotFoundComponent (404), ForbiddenComponent (403)
│   └── helper/    # Pipes, directives, utility functions
└── features/      # Lazy-loaded feature modules (one folder per domain)
```

### Feature modules (lazy-loaded)

| Route | Module | Key components |
|-------|--------|----------------|
| `/dashboard` | DashboardModule | DashboardDetailPageComponent |
| `/users` | UsersModule | List / Create / Detail / Edit page components |
| `/orders` | OrdersModule | Order list, OrderStatusBadgeComponent |
| `/products` | ProductsModule | Product CRUD + image upload |
| `/customers` | CustomersModule | Customer management |
| `/categories` | CategoriesModule | Category CRUD |
| `/payments` | PaymentsModule | Payment processing |
| `/debug` | BasicsModule | Dev/debug pages |

All protected routes sit under `LayoutComponent` with `canActivateChild: [AuthGuardWithForcedLogin]`.

### OAuth2 auth flow

1. `APP_INITIALIZER` in `CoreModule` calls `AuthService.init()` before the app bootstraps.
2. `AuthGuardWithForcedLogin` redirects unauthenticated users to the OIDC issuer.
3. PKCE code exchange is handled client-side by `angular-oauth2-oidc`; tokens are stored in `localStorage`.
4. The `OAuthModule` HTTP interceptor auto-injects `Authorization: Bearer <token>` on requests to:
   - `http://admin-api.algashop.local:9998/api/v1`
   - `http://auth.algashop.local:8081/api/v1`
5. Silent refresh runs every 5 s via a hidden iframe (`src/silent-refresh.html`).

### Service pattern

Services use `environment.apiUrl` or `environment.authUrl` as base URL, call `HttpClient`, and return `Observable<T>` or `Observable<Page<T>>` for paginated lists.

### Adding a feature module

1. Create `src/app/features/<name>/<name>.module.ts` with `RouterModule.forChild(routes)` and `SharedModule`.
2. Add a lazy-loaded entry in `src/app/app-routing.module.ts`:
   ```ts
   { path: '<name>', loadChildren: () => import('./features/<name>/<name>.module').then(m => m.<Name>Module) }
   ```
3. Add a menu entry in `src/app/shared/layout/menu/menu-data.service.ts`.

## Shared Utilities (`src/app/shared/`)

| Symbol | Purpose |
|--------|---------|
| `NgPrimeModule` | Re-exports all PrimeNG components used across the app |
| `ValidationMessageComponent` | Displays reactive form field error messages |
| `LabelWithDefaultComponent` | Label with fallback/default text |
| `BlockCopyPasteDirective` | Prevents copy/paste on targeted inputs |
| `sleep(ms)` | Promise-based delay utility |
| `enumToString(enum, value)` | Converts enum value to display string |
| `enumToOptions(enumObj)` | Converts enum to `{label, value}[]` for PrimeNG dropdowns |
| `MenuDataService` | Provides sidebar navigation items |

## Testing

E2E tests use Playwright (`e2e/` directory):

- `basic-app-structure.spec.ts` — verifies the home page renders correctly
- `happy-path-flow.spec.ts` — full flow: login (bob/bob on dev OIDC) → navigate → logout

```bash
npm run test    # runs all Playwright E2E tests
```

No unit or component tests exist at this time — Playwright is the only test suite.

## Docker & Nginx

Multi-stage `Dockerfile`:
1. `node:20-alpine` — runs `npm ci && npm run build` → outputs `dist/admin/`
2. `nginx:1.27-alpine` — serves static files on port 80

`nginx.conf` features:
- Gzip compression for text/JS/CSS (≥10 KB)
- 1-year immutable cache headers for hashed assets (`*.js`, `*.css`, fonts, images)
- `Cache-Control: no-cache` + security headers (`X-Frame-Options`, `X-Content-Type-Options`) on `index.html`
- SPA fallback: `try_files $uri /index.html`

## /etc/hosts Requirements (dev)

```
127.0.0.1 admin.algashop.local
127.0.0.1 admin-api.algashop.local
127.0.0.1 auth.algashop.local
```

SSL certs for HTTPS dev server: `ssl/localhost.crt` + `ssl/localhost.key` (self-signed).
Use `npm run start-with-ssl` to enable them.
