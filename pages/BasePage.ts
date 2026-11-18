import { Page } from "@playwright/test";

export abstract class BasePage {
  //Encapsulation: Protected so child pages can use 'this.page', while test files cannot
  protected readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  //Shared helper inherited by all child pages
  async navigateTo(url: string): Promise<void> {
    await this.page.goto(url);
  }

  //Abstraction: Every child page Object MUST implement its own page-load check
  abstract verifyPageLoaded(): Promise<void>;
}
