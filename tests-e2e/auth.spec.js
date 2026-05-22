import { test, expect } from '@playwright/test';

test.describe('Admin Dashboard E2E', () => {
  test('should login successfully with real backend', async ({ page }) => {
    // Navigate to login page
    await page.goto('/login');

    // Verify page title/content
    await expect(page).toHaveTitle(/Ridex Admin/);
    await expect(page.getByText('Welcome Back')).toBeVisible();

    // Fill credentials
    await page.getByPlaceholder('admin@ridex.com').fill('admin@ridex.com');
    await page.getByPlaceholder('••••••••').fill('password123');

    // Click sign in
    await page.getByRole('button', { name: 'Sign In' }).click();

    // Should redirect to dashboard
    await expect(page).toHaveURL('http://localhost:5173/');
    
    // Check if stats are visible (indicating data was fetched from real backend)
    await expect(page.getByText('Overview')).toBeVisible();
    await expect(page.getByText('Total Drivers')).toBeVisible();
  });

  test('should navigate through dashboard pages', async ({ page }) => {
    // Login first
    await page.goto('/login');
    await page.getByPlaceholder('admin@ridex.com').fill('admin@ridex.com');
    await page.getByPlaceholder('••••••••').fill('password123');
    await page.getByRole('button', { name: 'Sign In' }).click();

    // Navigate to Drivers
    await page.getByRole('link', { name: 'Drivers' }).click();
    await expect(page).toHaveURL(/.*drivers/);
    await expect(page.getByRole('heading', { name: 'Drivers' })).toBeVisible();

    // Navigate to Live Map
    await page.getByRole('link', { name: 'Live Map' }).click();
    await expect(page).toHaveURL(/.*tracking/);
    // Google Maps might take a second to load
    await expect(page.getByText('Live Tracking')).toBeVisible();
  });
});
