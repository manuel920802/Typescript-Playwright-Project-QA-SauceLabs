import { Page, Locator, expect } from "@playwright/test";

export class HeaderComponent {
  private readonly cartBadge: Locator;
  private readonly cartLink: Locator;
  private readonly burgerMenuButton: Locator;
  private readonly logoutLink: Locator;

  constructor(page: Page) {
    this.cartBadge = page.locator('[data-test="shopping-cart-badge"]');
    this.cartLink = page.locator('[data-test="shopping-cart-link"]');
    this.burgerMenuButton = page.locator("#react-burger-menu-btn");
    this.logoutLink = page.locator('[data-test="logout-sidebar-link"]');
  }

  async getCartItemCount(): Promise<number> {
    if (await this.cartBadge.isHidden()) {
      return 0;
    }
    const badgeText = await this.cartBadge.textContent();
    return Number(badgeText);
  }

  async verifyCartCount(expectedCount: number): Promise<void> {
    if (expectedCount === 0) {
      await expect(this.cartBadge).toBeHidden();
    } else {
      await expect(this.cartBadge).toHaveText(expectedCount.toString());
    }
  }

  async openCart(): Promise<void> {
    await this.cartLink.click();
  }

  async logout(): Promise<void> {
    await this.burgerMenuButton.click();
    await this.logoutLink.click();
  }
}
