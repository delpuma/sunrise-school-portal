import { test, expect } from '@playwright/test'

test.describe('Event Registration', () => {
  test.beforeEach(async ({ page }) => {
    // Login as parent
    await page.goto('/login')
    await page.getByLabel(/email/i).fill('parent@example.com')
    await page.getByLabel(/password/i).fill('testpassword123')
    await page.getByRole('button', { name: /log in/i }).click()
    await page.waitForURL(/\/portal/)
  })

  test('should display event list', async ({ page }) => {
    await page.goto('/events')
    
    await expect(page.getByRole('heading', { name: /events/i })).toBeVisible()
    // Should show at least one event or "no events" message
    const hasEvents = await page.getByRole('article').count() > 0
    const hasNoEventsMessage = await page.getByText(/no events/i).isVisible()
    
    expect(hasEvents || hasNoEventsMessage).toBeTruthy()
  })

  test('should show event details', async ({ page }) => {
    await page.goto('/events')
    
    // Click first event if available
    const firstEvent = page.getByRole('article').first()
    if (await firstEvent.isVisible()) {
      await firstEvent.click()
      
      // Should show event details
      await expect(page.getByRole('heading')).toBeVisible()
      await expect(page.getByText(/date/i)).toBeVisible()
    }
  })

  test('should show capacity indicator', async ({ page }) => {
    await page.goto('/events')
    
    const firstEvent = page.getByRole('article').first()
    if (await firstEvent.isVisible()) {
      await firstEvent.click()
      
      // Should show capacity or "unlimited" or "full"
      const hasCapacity = await page.getByText(/spots|capacity|available/i).isVisible()
      const isFull = await page.getByText(/full/i).isVisible()
      const isUnlimited = await page.getByText(/unlimited/i).isVisible()
      
      expect(hasCapacity || isFull || isUnlimited).toBeTruthy()
    }
  })

  test('should allow registration for available event', async ({ page }) => {
    await page.goto('/events')
    
    const firstEvent = page.getByRole('article').first()
    if (await firstEvent.isVisible()) {
      await firstEvent.click()
      
      // Check if registration button is available
      const registerButton = page.getByRole('button', { name: /register/i })
      if (await registerButton.isVisible()) {
        await registerButton.click()
        
        // Should show registration form or payment form
        await expect(page.getByRole('form')).toBeVisible()
      }
    }
  })
})
