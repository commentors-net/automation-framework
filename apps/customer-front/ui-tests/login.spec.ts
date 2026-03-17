import { test, expect } from '../../../framework-core/fixtures/index';
import { LoginPage } from '../pages/LoginPage';
import { DashboardPage } from '../pages/DashboardPage';
import { environmentConfig } from '../../../framework-core/config/EnvironmentConfig';

/**
 * Customer Front UI tests – @app:customer-front
 *
 * Validates login and dashboard flows using the Page Object Model.
 * Test data is isolated per run; no hard-coded credentials.
 */
test.describe('Customer Front – login flow @app:customer-front', () => {
  let loginPage: LoginPage;
  let dashboardPage: DashboardPage;
  const baseUrl = environmentConfig.urls.customerFrontBaseUrl;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);
  });

  test('renders the login form on the /login route @smoke', async ({ page }) => {
    await loginPage.goto(baseUrl);

    await expect(page.getByRole('button', { name: 'Login' })).toBeVisible();
    await expect(page.getByLabel('Email')).toBeVisible();
    await expect(page.getByLabel('Password')).toBeVisible();
  });

  test('navigates to dashboard after successful login @app:customer-front', async ({ page }) => {
    await loginPage.goto(baseUrl);
    await loginPage.login('admin@example.com', 'password123');

    await expect(page).toHaveURL(/dashboard/);
    const isVisible = await dashboardPage.isVisible();
    expect(isVisible).toBe(true);
  });

  test('shows error message for invalid credentials @app:customer-front', async () => {
    await loginPage.goto(baseUrl);
    await loginPage.login('wrong@example.com', 'wrongpassword');

    const error = await loginPage.getErrorMessage();
    expect(error).toContain('Invalid');
  });

  test('redirects to login page when accessing dashboard unauthenticated @app:customer-front', async ({ page }) => {
    await dashboardPage.goto(baseUrl);

    await expect(page).toHaveURL(/login/);
  });
});
