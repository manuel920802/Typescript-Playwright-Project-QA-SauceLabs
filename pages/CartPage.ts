import { Page, Locator, expect } from "@playwright/test";
import { BasePage } from "./BasePage";
import { HeaderComponent } from "../components/HeaderComponent";

export class CartPage extends BasePage {
  public readonly header: HeaderComponent;

  private readonly pageTitle: Locator;
  private readonly cartItemNames: Locator;
  private readonly checkoutButton: Locator;

  constructor(page: Page) {
    super(page);
    this.header = new HeaderComponent(page);
    this.pageTitle = page.locator('[data-test="title"]');
    this.cartItemNames = page.locator('[data-test="inventory-item-name"]');
    this.checkoutButton = page.locator('[data-test="checkout"]');
  }

  async verifyPageLoaded(): Promise<void> {
    await expect(this.pageTitle).toHaveText("Your Cart");
  }

  async getProductCartNames(): Promise<string[]> {
    return await this.cartItemNames.allTextContents();
  }

  async proceedToCheckout() {
    await this.checkoutButton.click();
  }
}
