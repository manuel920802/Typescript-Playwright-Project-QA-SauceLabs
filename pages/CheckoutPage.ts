import { Page, Locator, expect } from "@playwright/test";
import { BasePage } from "./BasePage";
import { CustomerInfo } from "../test-data/checkout.types";

export class CheckoutPage extends BasePage {
  private readonly pageTitle: Locator;
  private readonly firstNameInput: Locator;
  private readonly lastNameInput: Locator;
  private readonly postalCodeInput: Locator;
  private readonly continueButton: Locator;
  private readonly errorMessage: Locator;

  // Overview step locators
  private readonly itemTotalLabel: Locator;
  private readonly taxLabel: Locator;
  private readonly totalLabel: Locator;
  private readonly finishButton: Locator;

  // Complete step locators
  private readonly completeHeader: Locator;

  constructor(page: Page) {
    super(page);
    this.pageTitle = page.locator('[data-test="title"]');
    this.firstNameInput = page.locator('[data-test="firstName"]');
    this.lastNameInput = page.locator('[data-test="lastName"]');
    this.postalCodeInput = page.locator('[data-test="postalCode"]');
    this.continueButton = page.locator('[data-test="continue"]');
    this.errorMessage = page.locator('[data-test="error"]');

    this.itemTotalLabel = page.locator('[data-test="subtotal-label"]');
    this.taxLabel = page.locator('[data-test="tax-label"]');
    this.totalLabel = page.locator('[data-test="total-label"]');
    this.finishButton = page.locator('[data-test="finish"]');

    this.completeHeader = page.locator('[data-test="complete-header"]');
  }

  async verifyPageLoaded(): Promise<void> {
    await expect(this.pageTitle).toHaveText("Checkout: Your Information");
  }

  // Accepts our typed CustomerInfo interface
  async fillShippingInformation(customer: CustomerInfo): Promise<void> {
    await this.firstNameInput.fill(customer.firstName);
    await this.lastNameInput.fill(customer.lastName);
    await this.postalCodeInput.fill(customer.postalCode);
    await this.continueButton.click();
  }

  async getErrorMessage(): Promise<string | null> {
    return await this.errorMessage.textContent();
  }

  // Extracts numeric values to validate subtotal + tax === total
  async verifyOrderMath(): Promise<void> {
    const subtotalText = (await this.itemTotalLabel.textContent()) || "";
    const taxText = (await this.taxLabel.textContent()) || "";
    const totalText = (await this.totalLabel.textContent()) || "";

    const subtotal = parseFloat(subtotalText.replace("Item total: $", ""));
    const tax = parseFloat(taxText.replace("Tax: $", ""));
    const total = parseFloat(totalText.replace("Total: $", ""));

    expect(Number((subtotal + tax).toFixed(2))).toBe(total);
  }

  async finishOrder(): Promise<void> {
    await this.finishButton.click();
  }

  async verifyOrderCompleted(): Promise<void> {
    await expect(this.completeHeader).toHaveText("Thank you for your order!");
  }
}
