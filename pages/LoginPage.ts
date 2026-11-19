import { Page, Locator, expect } from "@playwright/test";
import { BasePage } from "./BasePage";

export class LoginPage extends BasePage {
  //Private locators: Hidden from test scripts (Encapsulation)
  private readonly usernameInput: Locator;
  private readonly passwordInput: Locator;
  private readonly loginButton: Locator;
  private readonly errorMessage: Locator;
  private readonly closeErrorButton: Locator;

  constructor(page: Page) {
    super(page); //Passes the browser page up to BasePage
    this.usernameInput = page.locator('[data-test="username"]');
    this.passwordInput = page.locator('[data-test="password"]');
    this.loginButton = page.locator('[data-test="login-button"]');
    this.errorMessage = page.locator('[data-test="error"]');
    this.closeErrorButton = page.locator('[data-test="error-button"]');
  }

  //Fullfiling the abstract contract from BasePage
  async verifyPageLoaded(): Promise<void> {
    await expect(this.loginButton).toBeVisible();
  }

  //High-Level business action
  async login(username: string, password: string): Promise<void> {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  //Getter method for assertions
  async getErrorMessageText(): Promise<string | null> {
    return await this.errorMessage.textContent();
  }

  async dismissErrorMessage(): Promise<void> {
    await this.closeErrorButton.click();
  }

  async verifyErrorHidden(): Promise<void> {
    await expect(this.errorMessage).toBeHidden();
  }
}
