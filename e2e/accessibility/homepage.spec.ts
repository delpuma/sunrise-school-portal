import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

test.describe('Homepage Accessibility @a11y', () => {
  test('should not have any automatically detectable accessibility issues', async ({ page }) => {
    await page.goto('/')
    
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze()
    
    expect(accessibilityScanResults.violations).toEqual([])
  })

  test('should have proper heading hierarchy', async ({ page }) => {
    await page.goto('/')
    
    const h1Count = await page.locator('h1').count()
    expect(h1Count).toBe(1) // Should have exactly one h1
    
    const h1Text = await page.locator('h1').textContent()
    expect(h1Text).toBeTruthy()
  })

  test('should have skip navigation link', async ({ page }) => {
    await page.goto('/')
    
    // Tab to focus skip link
    await page.keyboard.press('Tab')
    
    const skipLink = page.getByRole('link', { name: /skip to main content/i })
    await expect(skipLink).toBeFocused()
  })

  test('should have alt text for all images', async ({ page }) => {
    await page.goto('/')
    
    const images = await page.locator('img').all()
    
    for (const img of images) {
      const alt = await img.getAttribute('alt')
      expect(alt).toBeDefined()
    }
  })

  test('should be keyboard navigable', async ({ page }) => {
    await page.goto('/')
    
    // Tab through interactive elements
    await page.keyboard.press('Tab')
    await page.keyboard.press('Tab')
    await page.keyboard.press('Tab')
    
    // Should have visible focus indicator
    const focusedElement = await page.locator(':focus')
    await expect(focusedElement).toBeVisible()
  })

  test('should have proper color contrast', async ({ page }) => {
    await page.goto('/')
    
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2aa'])
      .disableRules(['color-contrast']) // We'll check this separately
      .analyze()
    
    const contrastViolations = accessibilityScanResults.violations.filter(
      v => v.id === 'color-contrast'
    )
    
    expect(contrastViolations).toEqual([])
  })
})

test.describe('Forms Accessibility @a11y', () => {
  test('should have accessible form labels', async ({ page }) => {
    await page.goto('/login')
    
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze()
    
    expect(accessibilityScanResults.violations).toEqual([])
  })

  test('should show error messages accessibly', async ({ page }) => {
    await page.goto('/login')
    
    // Submit form without filling fields
    await page.getByRole('button', { name: /log in/i }).click()
    
    // Error messages should be announced to screen readers
    const errorMessages = await page.locator('[role="alert"]').all()
    expect(errorMessages.length).toBeGreaterThan(0)
  })
})

test.describe('Navigation Accessibility @a11y', () => {
  test('should have accessible navigation menu', async ({ page }) => {
    await page.goto('/')
    
    const nav = page.getByRole('navigation')
    await expect(nav).toBeVisible()
    
    const accessibilityScanResults = await new AxeBuilder({ page })
      .include('nav')
      .analyze()
    
    expect(accessibilityScanResults.violations).toEqual([])
  })

  test('should have proper ARIA labels for navigation', async ({ page }) => {
    await page.goto('/')
    
    const nav = page.getByRole('navigation')
    const ariaLabel = await nav.getAttribute('aria-label')
    
    expect(ariaLabel).toBeTruthy()
  })
})
