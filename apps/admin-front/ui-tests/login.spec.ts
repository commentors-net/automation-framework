import { test, expect } from '../../../framework-core/fixtures/index';
import { LoginPage } from '../pages/LoginPage';
import { DashboardPage } from '../pages/DashboardPage';
import { environmentConfig } from '../../../framework-core/config/EnvironmentConfig';

/**
 * Admin Front UI tests – @app:admin-front
 *
 * Validates login and admin dashboard flows using the Page Object Model.
 */
test.describe('Admin Front – login flow @app:admin-front', () => {
  let loginPage: LoginPage;
  let dashboardPage: DashboardPage;
  const baseUrl = environmentConfig.urls.adminFrontBaseUrl;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);
  });

  test('renders the admin login form @smoke', async ({ page }) => {
    await loginPage.goto(baseUrl);

    await expect(page.getByRole('button', { name: 'Login' })).toBeVisible();
    await expect(page.getByLabel('Email')).toBeVisible();
    await expect(page.getByLabel('Password')).toBeVisible();
  });

  test('navigates to admin dashboard after successful login @app:admin-front', async ({ page }) => {
    await loginPage.goto(baseUrl);
    await loginPage.login('admin@example.com', 'admin123');

    await expect(page).toHaveURL(/dashboard/);
    const isVisible = await dashboardPage.isVisible();
    expect(isVisible).toBe(true);
  });

  test('shows error for invalid admin credentials @app:admin-front', async () => {
    await loginPage.goto(baseUrl);
    await loginPage.login('notadmin@example.com', 'badpassword');

    const error = await loginPage.getErrorMessage();
    expect(error).toContain('Invalid');
  });

  test('redirects unauthenticated users to login @app:admin-front', async ({ page }) => {
    await dashboardPage.goto(baseUrl);

    await expect(page).toHaveURL(/login/);
  });
});
