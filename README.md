# automation-framework

Enterprise-grade, modular test automation platform built with [Playwright](https://playwright.dev/) and TypeScript.

---

## Architecture

```
/framework-core          ← shared reusable framework
  /base                  ← BaseTest extension
  /fixtures              ← shared Playwright fixtures (customerService, coreService)
  /utils                 ← DataGenerator, Logger, retry helpers
  /api-client            ← ApiClient HTTP wrapper
  /config                ← EnvironmentConfig (local / dev / staging / production)

/modules
  /core                  ← Core microservice
    /services            ← CoreService
    /api-tests           ← core.spec.ts
  /customer              ← Customer microservice
    /services            ← CustomerService
    /api-tests           ← createCustomer.spec.ts

/apps
  /customer-front        ← Customer-facing UI
    /pages               ← LoginPage, DashboardPage (POM)
    /ui-tests            ← login.spec.ts
  /admin-front           ← Admin UI
    /pages               ← LoginPage, DashboardPage (POM)
    /ui-tests            ← login.spec.ts

/integration             ← Cross-module E2E tests
  customer-flow.spec.ts

playwright.config.ts     ← Multi-project config
```

---

## Design Principles

| Layer | Responsibility |
|---|---|
| `framework-core` | Common utilities, base configs, fixtures |
| `modules` | Backend/API domain-specific logic |
| `apps` | Frontend UI testing (Page Object Model) |
| `integration` | Cross-module end-to-end workflows |

**Key Rule:** Modules depend on the framework — never on each other directly.

---

## Getting Started

### Prerequisites
- Node.js ≥ 18
- npm ≥ 9

### Install

```bash
npm install
npx playwright install --with-deps chromium
```

### Environment Configuration

Set the `ENV` environment variable to target a specific environment:

| Value | Description |
|---|---|
| `local` (default) | `localhost` ports |
| `dev` | Development cluster |
| `staging` | Staging cluster |
| `production` | Production cluster |

```bash
export ENV=dev
```

---

## Running Tests

```bash
# Run all tests
npm test

# Run a specific project
npm run test:customer-api
npm run test:core-api
npm run test:customer-ui
npm run test:admin-ui
npm run test:integration

# Run by tag
npx playwright test --grep "@smoke"
npx playwright test --grep "@module:customer"
npx playwright test --grep "@app:customer-front"
npx playwright test --grep "@integration"
```

---

## Test Tags

| Tag | Scope |
|---|---|
| `@smoke` | Critical paths |
| `@module:customer` | Customer API tests |
| `@module:core` | Core API tests |
| `@app:customer-front` | Customer UI tests |
| `@app:admin-front` | Admin UI tests |
| `@integration` | Cross-module E2E |

---

## CI/CD Strategy

| Stage | Scope |
|---|---|
| PR | Module-level tests only |
| Merge | Module + UI tests |
| Nightly | Full integration suite |

---

## Governance

- Framework changes must be backward compatible.
- Modules must **not** duplicate utilities or override core behaviour.
- No hard-coded test data — use `DataGenerator`.
- No `page.waitForTimeout` — use proper awaits and retry helpers.
- UI logic stays in Page Objects; API logic stays in Services.
