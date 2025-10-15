# Testing Guide

## Overview

This document outlines the testing strategy for the Sunrise School Portal application.

## Testing Infrastructure Setup

### Install Dependencies

```bash
npm install --save-dev @playwright/test @axe-core/playwright vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/jest-dom
```

### Configuration Files

#### vitest.config.ts
```typescript
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    globals: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
    },
  },
})
```

#### vitest.setup.ts
```typescript
import '@testing-library/jest-dom'
import { expect, afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'

afterEach(() => {
  cleanup()
})
```

#### playwright.config.ts
```typescript
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
})
```

### Update package.json Scripts

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "test:a11y": "playwright test --grep @a11y"
  }
}
```

## Test Structure

### Unit Tests (Vitest + React Testing Library)

Location: `__tests__/` directory next to components

Example: `__tests__/components/DynamicForm.test.tsx`

### Integration Tests (Vitest)

Location: `__tests__/integration/`

Example: `__tests__/integration/api/forms.test.ts`

### E2E Tests (Playwright)

Location: `e2e/`

Example: `e2e/auth.spec.ts`

### Accessibility Tests (Playwright + axe-core)

Location: `e2e/accessibility/`

Example: `e2e/accessibility/homepage.spec.ts`

## Critical Test Coverage

### Authentication Flows
- ✅ User login with valid credentials
- ✅ User login with invalid credentials
- ✅ User signup
- ✅ Password reset
- ✅ Session persistence
- ✅ Protected route access

### Event Registration
- ✅ View event list
- ✅ View event details
- ✅ Register for event (authenticated)
- ✅ Payment flow (Square sandbox)
- ✅ Capacity validation
- ✅ Waitlist functionality

### Parent Portal
- ✅ View family profile
- ✅ Update family information
- ✅ Add student
- ✅ Edit student
- ✅ Remove student
- ✅ View invoices
- ✅ View registrations
- ✅ Access resources

### Admin Dashboard
- ✅ Create event
- ✅ Edit event
- ✅ Delete event
- ✅ Export roster
- ✅ Create form
- ✅ View form submissions
- ✅ Manage CRM contacts
- ✅ Add notes to contacts

### Form System
- ✅ Render dynamic form
- ✅ Validate required fields
- ✅ Submit form data
- ✅ Create CRM contact from submission
- ✅ Track interaction

### CRM System
- ✅ Create contact
- ✅ Update contact
- ✅ Track interactions
- ✅ Calculate engagement score
- ✅ Export contacts to CSV
- ✅ Filter and search contacts

## Accessibility Testing

All pages must meet WCAG 2.2 AA standards:

- ✅ Keyboard navigation
- ✅ Screen reader compatibility
- ✅ Color contrast ratios
- ✅ ARIA labels and roles
- ✅ Focus management
- ✅ Skip navigation links

## Running Tests

### Run All Unit Tests
```bash
npm test
```

### Run Tests in Watch Mode
```bash
npm test -- --watch
```

### Run E2E Tests
```bash
npm run test:e2e
```

### Run E2E Tests with UI
```bash
npm run test:e2e:ui
```

### Run Accessibility Tests Only
```bash
npm run test:a11y
```

## CI/CD Integration

Tests should run on:
- Every pull request
- Before deployment to production
- Nightly for full E2E suite

### GitHub Actions Example

```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm test
      - run: npm run build
      - run: npx playwright install --with-deps
      - run: npm run test:e2e
```

## Test Data Management

### Use Test Database
Set up a separate Supabase project for testing:
- `NEXT_PUBLIC_SUPABASE_URL_TEST`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY_TEST`

### Seed Test Data
Create seed scripts in `scripts/seed-test-data.ts`

### Clean Up After Tests
Use `afterEach` hooks to clean up test data

## Square Payment Testing

Use Square Sandbox mode:
- Test card: `4111 1111 1111 1111`
- CVV: Any 3 digits
- Expiry: Any future date
- ZIP: Any 5 digits

## Best Practices

1. **Test User Behavior, Not Implementation**
   - Focus on what users see and do
   - Avoid testing internal state

2. **Use Data Test IDs Sparingly**
   - Prefer accessible queries (role, label, text)
   - Use test IDs only when necessary

3. **Mock External Services**
   - Mock Square API calls
   - Mock Google Calendar API
   - Mock email sending

4. **Keep Tests Fast**
   - Unit tests should run in milliseconds
   - E2E tests should complete in seconds

5. **Write Descriptive Test Names**
   - Use "should" statements
   - Be specific about expected behavior

6. **Test Error States**
   - Network failures
   - Validation errors
   - Permission denied scenarios

## Coverage Goals

- **Unit Tests:** 80%+ coverage for utility functions and API routes
- **Integration Tests:** 100% coverage for payment and authentication logic
- **E2E Tests:** All critical user journeys
- **Accessibility Tests:** All public pages and key workflows

## Monitoring Test Health

- Track test execution time
- Monitor flaky tests
- Review coverage reports
- Update tests when features change
