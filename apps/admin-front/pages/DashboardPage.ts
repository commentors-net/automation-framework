import { Page, Locator } from '@playwright/test';

/**
 * Page Object Model for the Admin Front dashboard page.
 */
export class DashboardPage {
  private readonly headerTitle: Locator;
  private readonly userMenuButton: Locator;
  private readonly logoutButton: Locator;
  private readonly modulesNav: Locator;

  constructor(private readonly page: Page) {
    this.headerTitle = page.getByTestId('admin-dashboard-title');
    this.userMenuButton = page.getByTestId('user-menu');
    this.logoutButton = page.getByRole('menuitem', { name: 'Logout' });
    this.modulesNav = page.getByTestId('modules-nav');
  }

  async goto(baseUrl: string): Promise<void> {
    await this.page.goto(`${baseUrl}/dashboard`);
  }

  async getTitle(): Promise<string> {
    return this.headerTitle.innerText();
  }

  async logout(): Promise<void> {
    await this.userMenuButton.click();
    await this.logoutButton.click();
  }

  async isModulesNavVisible(): Promise<boolean> {
    return this.modulesNav.isVisible();
  }

  async isVisible(): Promise<boolean> {
    return this.headerTitle.isVisible();
  }
}
