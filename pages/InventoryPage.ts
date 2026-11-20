import { Page, Locator, expect } from "@playwright/test";
import { BasePage } from "./BasePage";
import { HeaderComponent } from "../components/HeaderComponent";

export class InventoryPage extends BasePage {
  // Composition: InventoryPage HAS-A HeaderComponent
  public readonly header: HeaderComponent;

  private readonly pageTitle: Locator;
  private readonly sortDropdown: Locator;
  private readonly inventoryItems: Locator;
  private readonly itemPrices: Locator;
  private readonly itemNames: Locator;

  constructor(page: Page) {
    super(page);
    this.header = new HeaderComponent(page);
    this.pageTitle = page.locator('[data-test="title"]');
    this.sortDropdown = page.locator('[data-test="product-sort-container"]');
    this.inventoryItems = page.locator('[data-test="inventory-item"]');
    this.itemPrices = page.locator('[data-test="inventory-item-price"]');
    this.itemNames = page.locator('[data-test="inventory-item-name"]');
  }

  async verifyPageLoaded(): Promise<void> {
    await expect(this.pageTitle).toHaveText("Products");
  }

  // Dynamic locator: Finds the specific product card by name and clicks its button
  async addProductToCart(productName: string): Promise<void> {
    const productCard = this.inventoryItems.filter({ hasText: productName });
    await productCard.locator("button").click();
  }

  async sortBy(optionValue: "az" | "za" | "lohi" | "hilo"): Promise<void> {
    await this.sortDropdown.selectOption(optionValue);
  }

  // Extracts all UI prices into a clean number[] array for sorting assertions
  async getAllProductPrices(): Promise<number[]> {
    const priceTexts = await this.itemPrices.allTextContents();
    return priceTexts.map((text) => parseFloat(text.replace("$", "")));
  }

  async getAllProductNames(): Promise<string[]> {
    return await this.itemNames.allTextContents();
  }
}
