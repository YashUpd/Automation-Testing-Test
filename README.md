# Enterprise Playwright Test Automation Framework

A production-grade, scalable End-to-End (E2E), Smoke, and Regression test automation framework built with **Playwright**, **JavaScript (ES Modules)**, and the **Page Object Model (POM)** pattern.

---

## 📁 Project Architecture

```
PlayWright Automation Testing/
├── .github/
│   └── workflows/
│       └── playwright.yml             # GitHub Actions CI/CD Pipeline
├── config/
│   └── environment.js                 # Centralized configuration & environment loader
├── downloads/                         # Automated test download artifact directory (.gitignored)
├── src/
│   ├── data/                          # Externalized test datasets & user profiles
│   │   ├── productStock.data.json     # Filter criteria, item selections
│   │   └── users.data.js              # Authentication user credentials & security payloads
│   ├── fixtures/
│   │   └── testFixtures.js            # Custom Playwright test fixtures (POM injection)
│   ├── pages/                         # Page Object Model (POM) classes
│   │   ├── BasePage.js                # Common browser actions, resilient waits, logging
│   │   ├── LoginPage.js               # Login page locators and authentication flows
│   │   ├── NavigationBar.js           # Top platform/hub switcher and sidebar tree
│   │   └── ProductStockPage.js        # Filter dialogs, grid actions, and Excel exports
│   └── utils/                         # Reusable framework utilities
│       ├── fileHelper.js              # File download validation & directory cleanup
│       └── logger.js                  # Standardized timestamped logging utility
├── tests/                             # Categorized test suites
│   ├── e2e/                           # End-to-end integration workflows
│   │   └── productStock.spec.js       # Complete filter & Excel export E2E test
│   ├── smoke/                         # Fast critical path validation tests
│   │   └── login.spec.js              # Primary authentication validation specs
│   └── regression/                    # Comprehensive Edge Cases & Negative Scenarios
│       ├── loginEdgeCases.spec.js     # Security injection, boundaries, empty fields, malformed emails
│       ├── navigationEdgeCases.spec.js# Hub switching, session recovery on reload, dashboard navigation
│       └── productStockEdgeCases.spec.js # Dialog search, cancellation, isolated filters, grid clearing
├── .env                               # Local secrets (gitignored)
├── .env.example                       # Environment template for onboarding & CI
├── .gitignore                         # Production-grade gitignore
├── package.json                       # Scripts, dependencies, and project metadata
├── playwright.config.js               # Enterprise Playwright test runner configuration
└── README.md                          # Framework documentation
```

---

## 🧪 Edge Cases & Regression Coverage

### 1. Authentication & Security Edge Cases ([loginEdgeCases.spec.js](file:///d:/PlayWright%20Automation%20Testing/tests/regression/loginEdgeCases.spec.js))
- **TC-AUTH-EDGE-01**: Empty credentials validation (both email and password empty).
- **TC-AUTH-EDGE-02**: Empty email with valid password.
- **TC-AUTH-EDGE-03**: Valid email with empty password.
- **TC-AUTH-EDGE-04**: Password case-sensitivity enforcement.
- **TC-AUTH-EDGE-05**: Rejection of malformed email formats (`plainaddress`, `missing-at-sign.com`, `@no-local-part.com`, `user@.missing-domain`, `user@domain with space.com`).
- **TC-AUTH-EDGE-06**: Defense against SQL Injection strings (`' OR '1'='1`).
- **TC-AUTH-EDGE-07**: Defense against Cross-Site Scripting (XSS) payloads (`<script>`, `<img>` onerror).
- **TC-AUTH-EDGE-08**: Graceful handling of Unicode and emoji characters.
- **TC-AUTH-EDGE-09**: Boundary length validation with 250+ character email and 500+ character password.
- **TC-AUTH-EDGE-10**: Input masking verification (`type="password"`).
- **TC-AUTH-EDGE-11**: Keyboard navigation and form submission via `Enter` key.

### 2. Navigation & Session Edge Cases ([navigationEdgeCases.spec.js](file:///d:/PlayWright%20Automation%20Testing/tests/regression/navigationEdgeCases.spec.js))
- **TC-NAV-EDGE-01**: Rapid Hub switching ("Operational Data Hub" $\leftrightarrow$ "Master Data Hub") maintaining state consistency.
- **TC-NAV-EDGE-02**: Direct browser reload on inner module maintaining active session and recovering view.
- **TC-NAV-EDGE-03**: Header "Home" button navigation returning to primary dashboard.

### 3. Product Stock & Grid Edge Cases ([productStockEdgeCases.spec.js](file:///d:/PlayWright%20Automation%20Testing/tests/regression/productStockEdgeCases.spec.js))
- **TC-STOCK-EDGE-01**: Value help search with non-existent query yields zero matches without dialog crash.
- **TC-STOCK-EDGE-02**: Value help search with partial keyword returns matching products.
- **TC-STOCK-EDGE-03**: Canceling product dialog discards unapplied selections.
- **TC-STOCK-EDGE-04**: Single-category filtering: Location only without selecting Products.
- **TC-STOCK-EDGE-05**: Single-category filtering: Stock Type only.
- **TC-STOCK-EDGE-06**: Filter reset: Clearing all applied filters via the filter bar "Clear" button.
- **TC-STOCK-EDGE-07**: Global text search input on the filter bar filtering the table.

---

## 🚀 Running Tests

| Command | Description |
| :--- | :--- |
| `npm test` | Runs all tests in headless mode across all browsers |
| `npm run test:smoke` | Runs fast critical path smoke tests (`@smoke`) |
| `npm run test:e2e` | Runs End-to-End workflow tests (`@e2e`) |
| `npm run test:regression` | Runs the full regression suite including all edge cases (`@regression`) |
| `npm run test:edge` | Runs all edge case scenarios (`@edge`) |
| `npm run test:headed` | Runs tests with browser UI visible |
| `npm run test:ui` | Opens Playwright Interactive UI Mode |
| `npm run test:debug` | Launches the Playwright Inspector for step-by-step debugging |
| `npm run test:chromium` | Runs tests exclusively on Chromium / Chrome |
| `npm run report` | Opens the latest HTML test report |
