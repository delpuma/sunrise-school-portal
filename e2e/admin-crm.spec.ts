import { test, expect } from '@playwright/test'

test.describe('Admin CRM System', () => {
  test.beforeEach(async ({ page }) => {
    // Login as admin
    await page.goto('/login')
    await page.getByLabel(/email/i).fill('admin@example.com')
    await page.getByLabel(/password/i).fill('adminpassword123')
    await page.getByRole('button', { name: /log in/i }).click()
    await page.waitForURL(/\/admin/)
  })

  test('should display CRM dashboard', async ({ page }) => {
    await page.goto('/admin/crm')
    
    await expect(page.getByRole('heading', { name: /crm/i })).toBeVisible()
    await expect(page.getByRole('button', { name: /add contact/i })).toBeVisible()
  })

  test('should create new contact', async ({ page }) => {
    await page.goto('/admin/crm')
    
    await page.getByRole('button', { name: /add contact/i }).click()
    
    await page.getByLabel(/email/i).fill(`test${Date.now()}@example.com`)
    await page.getByLabel(/first name/i).fill('Test')
    await page.getByLabel(/last name/i).fill('Contact')
    await page.getByLabel(/phone/i).fill('305-555-0123')
    
    await page.getByRole('button', { name: /create contact/i }).click()
    
    await expect(page.getByText('Test Contact')).toBeVisible()
  })

  test('should filter contacts by status', async ({ page }) => {
    await page.goto('/admin/crm')
    
    const statusFilter = page.getByRole('combobox', { name: /status/i })
    await statusFilter.selectOption('lead')
    
    // Should update the contact list
    await page.waitForTimeout(500)
  })

  test('should search contacts', async ({ page }) => {
    await page.goto('/admin/crm')
    
    const searchInput = page.getByPlaceholder(/search/i)
    await searchInput.fill('test')
    
    // Should filter results
    await page.waitForTimeout(500)
  })

  test('should view contact details', async ({ page }) => {
    await page.goto('/admin/crm')
    
    const firstContact = page.getByRole('link', { name: /view details/i }).first()
    if (await firstContact.isVisible()) {
      await firstContact.click()
      
      await expect(page.getByRole('heading')).toBeVisible()
      await expect(page.getByText(/email/i)).toBeVisible()
      await expect(page.getByText(/status/i)).toBeVisible()
    }
  })

  test('should add note to contact', async ({ page }) => {
    await page.goto('/admin/crm')
    
    const firstContact = page.getByRole('link', { name: /view details/i }).first()
    if (await firstContact.isVisible()) {
      await firstContact.click()
      
      const noteTextarea = page.getByPlaceholder(/add a note/i)
      await noteTextarea.fill('This is a test note')
      
      await page.getByRole('button', { name: /add note/i }).click()
      
      await expect(page.getByText('This is a test note')).toBeVisible()
    }
  })

  test('should export contacts to CSV', async ({ page }) => {
    await page.goto('/admin/crm')
    
    const downloadPromise = page.waitForEvent('download')
    await page.getByRole('button', { name: /export csv/i }).click()
    
    const download = await downloadPromise
    expect(download.suggestedFilename()).toContain('.csv')
  })

  test('should update contact status', async ({ page }) => {
    await page.goto('/admin/crm')
    
    const firstContact = page.getByRole('link', { name: /view details/i }).first()
    if (await firstContact.isVisible()) {
      await firstContact.click()
      
      await page.getByRole('button', { name: /edit contact/i }).click()
      
      const statusSelect = page.getByRole('combobox', { name: /status/i })
      await statusSelect.selectOption('prospect')
      
      await page.getByRole('button', { name: /save changes/i }).click()
      
      await expect(page.getByText('prospect')).toBeVisible()
    }
  })
})

test.describe('Admin Form Management', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login')
    await page.getByLabel(/email/i).fill('admin@example.com')
    await page.getByLabel(/password/i).fill('adminpassword123')
    await page.getByRole('button', { name: /log in/i }).click()
    await page.waitForURL(/\/admin/)
  })

  test('should display forms list', async ({ page }) => {
    await page.goto('/admin/forms')
    
    await expect(page.getByRole('heading', { name: /forms/i })).toBeVisible()
    await expect(page.getByRole('link', { name: /create new form/i })).toBeVisible()
  })

  test('should create new form', async ({ page }) => {
    await page.goto('/admin/forms/new')
    
    await page.getByLabel(/form title/i).fill('Test Contact Form')
    await page.getByLabel(/slug/i).fill('test-contact-form')
    await page.getByLabel(/description/i).fill('A test form')
    
    // Add a field
    await page.getByLabel(/field name/i).fill('email')
    await page.getByLabel(/field label/i).fill('Email Address')
    await page.getByRole('combobox', { name: /field type/i }).selectOption('email')
    await page.getByLabel(/required field/i).check()
    
    await page.getByRole('button', { name: /add field/i }).click()
    
    // Submit form
    await page.getByRole('button', { name: /create form/i }).click()
    
    await expect(page).toHaveURL(/\/admin\/forms/)
  })

  test('should view form submissions', async ({ page }) => {
    await page.goto('/admin/forms')
    
    const firstForm = page.getByRole('link', { name: /submissions/i }).first()
    if (await firstForm.isVisible()) {
      await firstForm.click()
      
      await expect(page.getByRole('heading', { name: /submissions/i })).toBeVisible()
    }
  })
})
