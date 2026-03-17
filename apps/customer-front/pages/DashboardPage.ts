import { Page, Locator } from '@playwright/test';

/**
 * Page Object Model for the Customer Front dashboard page.
 * Encapsulates all selectors and actions available after login.
 */
export class DashboardPage {
  private readonly welcomeBanner: Locator;
  private readonly userMenuButton: Locator;
  private readonly logoutButton: Locator;
  private readonly customerListTable: Locator;
  private readonly createCustomerButton: Locator;
  private readonly searchInput: Locator;

  constructor(private readonly page: Page) {
    this.welcomeBanner = page.getByTestId('welcome-banner');
    this.userMenuButton = page.getByTestId('user-menu');
    this.logoutButton = page.getByRole('menuitem', { name: 'Logout' });
    this.customerListTable = page.getByTestId('customer-list');
    this.createCustomerButton = page.getByRole('button', { name: 'Create Customer' });
    this.searchInput = page.getByPlaceholder('Search customers…');
  }

  async goto(baseUrl: string): Promise<void> {
    await this.page.goto(`${baseUrl}/dashboard`);
  }

  async getWelcomeText(): Promise<string> {
    return this.welcomeBanner.innerText();
  }

  async logout(): Promise<void> {
    await this.userMenuButton.click();
    await this.logoutButton.click();
  }

  async searchCustomer(query: string): Promise<void> {
    await this.searchInput.fill(query);
    await this.searchInput.press('Enter');
  }

  async clickCreateCustomer(): Promise<void> {
    await this.createCustomerButton.click();
  }

  async isCustomerListVisible(): Promise<boolean> {
    return this.customerListTable.isVisible();
  }

  async isVisible(): Promise<boolean> {
    return this.welcomeBanner.isVisible();
  }
}
