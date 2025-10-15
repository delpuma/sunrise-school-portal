import { test, expect } from '@playwright/test'

test.describe('Authentication', () => {
  test('should display login page', async ({ page }) => {
    await page.goto('/login')
    
    await expect(page.getByRole('heading', { name: /log in/i })).toBeVisible()
    await expect(page.getByLabel(/email/i)).toBeVisible()
    await expect(page.getByLabel(/password/i)).toBeVisible()
    await expect(page.getByRole('button', { name: /log in/i })).toBeVisible()
  })

  test('should show error with invalid credentials', async ({ page }) => {
    await page.goto('/login')
    
    await page.getByLabel(/email/i).fill('invalid@example.com')
    await page.getByLabel(/password/i).fill('wrongpassword')
    await page.getByRole('button', { name: /log in/i }).click()
    
    await expect(page.getByText(/invalid/i)).toBeVisible()
  })

  test('should redirect to portal after successful login', async ({ page }) => {
    await page.goto('/login')
    
    // Use test credentials
    await page.getByLabel(/email/i).fill('test@example.com')
    await page.getByLabel(/password/i).fill('testpassword123')
    await page.getByRole('button', { name: /log in/i }).click()
    
    // Should redirect to portal
    await expect(page).toHaveURL(/\/portal/)
  })

  test('should protect portal routes when not authenticated', async ({ page }) => {
    await page.goto('/portal/dashboard')
    
    // Should redirect to login
    await expect(page).toHaveURL(/\/login/)
  })

  test('should allow signup with valid data', async ({ page }) => {
    await page.goto('/signup')
    
    await page.getByLabel(/name/i).fill('Test User')
    await page.getByLabel(/email/i).fill(`test${Date.now()}@example.com`)
    await page.getByLabel(/password/i).fill('SecurePassword123!')
    await page.getByRole('button', { name: /sign up/i }).click()
    
    // Should redirect to portal or show success message
    await expect(page).toHaveURL(/\/portal|\/login/)
  })
})
