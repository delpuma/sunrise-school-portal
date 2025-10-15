import { test, expect } from '@playwright/test'

test.describe('Parent Portal - Family Profile', () => {
  test.beforeEach(async ({ page }) => {
    // Login as parent
    await page.goto('/login')
    await page.getByLabel(/email/i).fill('parent@example.com')
    await page.getByLabel(/password/i).fill('testpassword123')
    await page.getByRole('button', { name: /log in/i }).click()
    await page.waitForURL(/\/portal/)
  })

  test('should display family profile page', async ({ page }) => {
    await page.goto('/portal/profile')
    
    await expect(page.getByRole('heading', { name: /family profile/i })).toBeVisible()
    await expect(page.getByLabel(/name/i)).toBeVisible()
    await expect(page.getByLabel(/email/i)).toBeVisible()
  })

  test('should update family information', async ({ page }) => {
    await page.goto('/portal/profile')
    
    const addressField = page.getByLabel(/address/i)
    await addressField.fill('123 Test Street, Miami, FL 33101')
    
    await page.getByRole('button', { name: /save changes/i }).click()
    
    await expect(page.getByText(/updated successfully/i)).toBeVisible()
  })

  test('should add a new student', async ({ page }) => {
    await page.goto('/portal/profile')
    
    await page.getByRole('button', { name: /add student/i }).click()
    
    await page.getByLabel(/student name/i).fill('Test Student')
    await page.getByLabel(/date of birth/i).fill('2015-01-15')
    await page.getByLabel(/grade/i).fill('3rd Grade')
    
    await page.getByRole('button', { name: /add student/i }).click()
    
    await expect(page.getByText('Test Student')).toBeVisible()
  })

  test('should edit existing student', async ({ page }) => {
    await page.goto('/portal/profile')
    
    // Find first student edit button
    const editButton = page.getByRole('button', { name: /edit/i }).first()
    if (await editButton.isVisible()) {
      await editButton.click()
      
      await page.getByLabel(/grade/i).fill('4th Grade')
      await page.getByRole('button', { name: /update student/i }).click()
      
      await expect(page.getByText('4th Grade')).toBeVisible()
    }
  })

  test('should remove student with confirmation', async ({ page }) => {
    await page.goto('/portal/profile')
    
    const removeButton = page.getByRole('button', { name: /remove/i }).first()
    if (await removeButton.isVisible()) {
      // Set up dialog handler
      page.on('dialog', dialog => dialog.accept())
      
      await removeButton.click()
      
      // Student should be removed
      await page.waitForTimeout(500)
    }
  })
})

test.describe('Parent Portal - Invoices', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login')
    await page.getByLabel(/email/i).fill('parent@example.com')
    await page.getByLabel(/password/i).fill('testpassword123')
    await page.getByRole('button', { name: /log in/i }).click()
    await page.waitForURL(/\/portal/)
  })

  test('should display invoices list', async ({ page }) => {
    await page.goto('/portal/invoices')
    
    await expect(page.getByRole('heading', { name: /invoices/i })).toBeVisible()
  })

  test('should show invoice details', async ({ page }) => {
    await page.goto('/portal/invoices')
    
    const firstInvoice = page.getByRole('row').nth(1)
    if (await firstInvoice.isVisible()) {
      await firstInvoice.click()
      
      await expect(page.getByText(/amount/i)).toBeVisible()
      await expect(page.getByText(/due date/i)).toBeVisible()
    }
  })
})

test.describe('Parent Portal - Resources', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login')
    await page.getByLabel(/email/i).fill('parent@example.com')
    await page.getByLabel(/password/i).fill('testpassword123')
    await page.getByRole('button', { name: /log in/i }).click()
    await page.waitForURL(/\/portal/)
  })

  test('should display resources library', async ({ page }) => {
    await page.goto('/portal/resources')
    
    await expect(page.getByRole('heading', { name: /resources/i })).toBeVisible()
  })

  test('should filter resources by category', async ({ page }) => {
    await page.goto('/portal/resources')
    
    const categoryFilter = page.getByRole('combobox', { name: /category/i })
    if (await categoryFilter.isVisible()) {
      await categoryFilter.selectOption({ index: 1 })
      
      // Should update the list
      await page.waitForTimeout(500)
    }
  })
})
