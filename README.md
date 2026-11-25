# 🎭 Playwright & TypeScript Full-Stack Automation Framework

[![Playwright Tests](https://github.com/manuel920802/Typescript-Playwright-Project-QA-SauceLabs/actions/workflows/playwright.yml/badge.svg)](https://github.com/manuel920802/Typescript-Playwright-Project-QA-SauceLabs/actions/workflows/playwright.yml)

An enterprise-grade end-to-end **UI & REST API Test Automation Framework** built with **Playwright** and **TypeScript**, engineered around **Object-Oriented Programming (OOP)** principles, **Dependency Injection**, **Session State Reuse**, **Network Interception**, and **CI/CD** automation.

---

## 🏗️ Architectural Highlights

- **Page Object Model (POM) with Abstraction & Inheritance:** An `abstract class BasePage` enforces page-load contracts (`abstract verifyPageLoaded()`) and encapsulates shared browser navigation across `LoginPage`, `InventoryPage`, `CartPage`, and `CheckoutPage`.
- **Component Composition:** Reusable UI widgets like `HeaderComponent` (shopping cart badge & navigation menu) are composed inside Page Objects rather than duplicated.
- **Authentication Session Reuse (`storageState`):** A dedicated `setup` project (`auth.setup.ts`) authenticates once, saves cookies and localStorage to `playwright/.auth/user.json`, and injects that pre-authenticated session into dependent test suites (`chromium-authenticated`) to eliminate redundant UI logins and accelerate execution.
- **Network Interception & Fault Injection (`page.route`):** Intercepts browser network traffic to abort heavy image assets for faster test execution, inject simulated `500 Internal Server Error` responses to verify frontend resilience, and audit outgoing HTTP status codes.
- **Custom Playwright Fixtures (`test.extend`):** Dependency Injection automatically instantiates Page Objects and API clients on demand, eliminating `beforeEach` boilerplate.
- **Self-Cleaning API Fixtures:** Fixture composition (`createdBooking`) creates unique backend test data via REST API before test execution and guarantees teardown deletion afterward—even when assertions fail.
- **Strict TypeScript Data Contracts:** Dedicated `.types.ts` interfaces validate UI test datasets and REST API JSON payloads/responses at compile time.
- **Multi-Environment Configuration (`.env`):** Externalizes base URLs and credentials using `dotenv` and `playwright.config.ts`.
- **Continuous Integration (GitHub Actions):** Automatically runs all UI & API suites on every push/PR and archives interactive HTML reports and trace artifacts.

---

## 📂 Framework Structure

```text
├── .github/workflows/
│   └── playwright.yml         # CI/CD pipeline configuration
├── api/
│   └── BookingApiClient.ts    # Encapsulated REST API client (Auth, CRUD, query filtering)
├── components/
│   └── HeaderComponent.ts     # Reusable UI header & cart badge component
├── fixtures/
│   └── pom.fixture.ts         # Custom Playwright fixtures & auto-teardown data lifecycle
├── pages/
│   ├── BasePage.ts            # Abstract parent class for all Page Objects
│   ├── LoginPage.ts           # Authentication locators & actions
│   ├── InventoryPage.ts       # Product catalog, dynamic item selection, & sorting
│   ├── CartPage.ts            # Cart review & checkout navigation
│   └── CheckoutPage.ts        # Shipping forms, tax/total math assertions, & completion
├── test-data/
│   ├── booking.data.ts        # API test payloads
│   ├── booking.types.ts       # API request/response TypeScript interfaces
│   ├── checkout.data.ts       # Shipping test data
│   ├── checkout.types.ts      # CustomerInfo interface
│   ├── inventory.data.ts      # Catalog product constants
│   ├── login.data.ts          # Data-driven authentication scenarios
│   └── login.types.ts         # Credential & negative test interfaces
├── tests/
│   ├── api-booking.spec.ts    # REST API CRUD & query filtering test suite
│   ├── auth.setup.ts          # Global authentication setup generating storageState
│   ├── checkout.spec.ts       # End-to-end purchase & form validation suite
│   ├── inventory.spec.ts      # Catalog badge & dynamic array sorting suite
│   ├── login.spec.ts          # Positive & data-driven negative auth suite
│   └── network.spec.ts        # Network interception, asset blocking, & 500 error mocking
├── .env.example               # Template for required environment variables
└── playwright.config.ts       # Multi-project Playwright & storageState configuration
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org) (v18 or v20+)
- npm

### Installation & Local Execution

1. **Clone the repository:**

   ```bash
   git clone https://github.com
   cd Typescript-Playwright-Project-QA-SauceLabs
   ```

2. **Install dependencies and Playwright browsers:**

   ```bash
   npm install
   npx playwright install chromium
   ```

3. **Configure environment variables:**

   ```bash
   cp .env.example .env
   ```

4. **Run all UI & API tests:**

   ```bash
   npx playwright test
   ```

5. **Open the interactive HTML test report:**
   ```bash
   npx playwright show-report
   ```

---

## 🧪 Automated Test Coverage

- **Global Auth Setup (`auth.setup.ts`):** Logs in once as `standard_user` and persists browser session state for downstream test projects.
- **Authentication (`login.spec.ts`):** Standard login, data-driven negative scenarios (locked-out user, empty credentials, invalid password), and error banner dismissal.
- **Catalog & Sorting (`inventory.spec.ts`):** Dynamic cart badge updates, ascending price sorting (`low to high`), descending alphabetical sorting (`Z to A`), and session logout.
- **End-to-End Checkout (`checkout.spec.ts`):** Multi-item cart verification, shipping form validation, dynamic subtotal + tax math verification, and order confirmation.
- **Network Resilience (`network.spec.ts`):** Asset blocking (`route.abort()`), simulated CDN `500` server error injection (`route.fulfill()`), and background HTTP status auditing (`page.on('response')`).
- **REST API CRUD (`api-booking.spec.ts`):** Token authentication (`POST /auth`), automated booking setup (`POST`), retrieval (`GET`), query parameter filtering, updates (`PUT`), and guaranteed fixture teardown (`DELETE`).
